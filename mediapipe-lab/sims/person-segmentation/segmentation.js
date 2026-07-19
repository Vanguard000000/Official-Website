import {
  FilesetResolver,
  ImageSegmenter
} from "../../vendor/mediapipe/tasks-vision/vision_bundle.mjs";

function $(id) {
  const el = document.getElementById(id);
  if (!el) throw new Error("Missing element #" + id);
  return el;
}

const video = $("webcam");
const canvas = $("overlay");
const ctx = canvas.getContext("2d");
const placeholder = $("placeholder");
const statusEl = $("status");
const statusDetailEl = $("status-detail");
const cameraBtn = $("camera-btn");
const fileInput = $("file-input");
const thresholdSlider = $("threshold-slider");
const thresholdValue = $("threshold-value");
const colorPicker = $("color-picker");
const colorHex = $("color-hex");
const colorGrid = $("color-grid");
const edgeSlider = $("edge-slider");
const edgeValue = $("edge-value");
const showVideoInput = $("show-video");
const mirrorVideoInput = $("mirror-video");
const naiveModeInput = $("naive-mode");
const metricsEl = $("metrics");
const fpsEl = $("fps");
const latencyEl = $("latency");
const p95latencyEl = $("p95latency");
const skippedEl = $("skipped");
const errorsEl = $("errors");
const inferencesEl = $("inferences");
const benchmarkTimer = $("benchmark-timer");
const benchElapsedEl = $("bench-elapsed");
const errorOverlay = $("error-overlay");
const errorTitle = $("error-title");
const errorBody = $("error-body");
const errorDismiss = $("error-dismiss");
const modeImageBtn = $("mode-image");
const modeCameraBtn = $("mode-camera");
const imageControls = $("image-controls");
const cameraControls = $("camera-controls");
const videoToggleControls = $("video-toggle-controls");
const exportBtn = $("export-btn");

let segmenter = null;
let webcamRunning = false;
let animationFrameId = 0;
let lastVideoTime = -1;
let isProcessing = false;
let showVideoFeed = true;
let mirrorVideoFeed = true;
let naiveMode = false;
let maskThreshold = 0.5;
let maskColor = "#00ff88";
let edgeThickness = 2;
let currentMode = "image";

function setMode(mode) {
  currentMode = mode;
  if (mode === "image") {
    if (webcamRunning) stopCamera();
    modeImageBtn.classList.add("active");
    modeCameraBtn.classList.remove("active");
    imageControls.classList.remove("hidden");
    cameraControls.classList.add("hidden");
    videoToggleControls.classList.add("hidden");
  metricsEl.style.display = "none";
  exportBtn.disabled = true;
  benchmarkRunning = false;
  } else {
    modeCameraBtn.classList.add("active");
    modeImageBtn.classList.remove("active");
    imageControls.classList.add("hidden");
    cameraControls.classList.remove("hidden");
    videoToggleControls.classList.remove("hidden");
  }
}

modeImageBtn.addEventListener("click", () => setMode("image"));
modeCameraBtn.addEventListener("click", () => setMode("camera"));

let totalFrames = 0;
let skippedFrames = 0;
let errorCount = 0;
let inferenceCount = 0;
let lastFpsTick = performance.now();
let frameLatencyEstimate = 0;
let rollingLatencies = [];
const ROLLING_WINDOW = 100;
let benchmarkRunning = false;
let benchmarkLatencies = [];
let benchmarkInferences = 0;
let benchmarkStartTime = 0;
let benchmarkCoverages = [];

function setStatus(msg, state) {
  statusEl.textContent = msg;
  statusEl.className = state ? "state-" + state : "";
}

function setStatusDetail(msg) {
  statusDetailEl.textContent = msg;
}

function showError(title, body) {
  errorCount++;
  errorsEl.textContent = errorCount;
  errorTitle.textContent = title;
  errorBody.textContent = body;
  errorOverlay.classList.add("visible");
  errorOverlay.setAttribute("aria-hidden", "false");
}

function hideError() {
  errorOverlay.classList.remove("visible");
  errorOverlay.setAttribute("aria-hidden", "true");
}

errorDismiss.addEventListener("click", hideError);

function hexToRgb(hex) {
  const v = parseInt(hex.slice(1), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

function updateColor(hex) {
  maskColor = hex;
  colorPicker.value = hex;
  colorHex.value = hex;
  colorGrid.querySelectorAll(".color-swatch").forEach((b) => {
    b.classList.toggle("selected", b.dataset.hex.toUpperCase() === hex.toUpperCase());
  });
}

colorPicker.addEventListener("input", () => updateColor(colorPicker.value));

colorHex.addEventListener("input", () => {
  const v = colorHex.value.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(v)) {
    updateColor(v.toLowerCase());
  }
});

colorHex.addEventListener("blur", () => {
  if (!/^#[0-9a-fA-F]{6}$/.test(colorHex.value.trim())) {
    colorHex.value = maskColor;
  }
});

colorGrid.addEventListener("click", (e) => {
  const btn = e.target.closest(".color-swatch");
  if (!btn) return;
  updateColor(btn.dataset.hex);
});

thresholdSlider.addEventListener("input", () => {
  maskThreshold = Number(thresholdSlider.value) / 100;
  thresholdValue.textContent = maskThreshold.toFixed(2);
});

edgeSlider.addEventListener("input", () => {
  edgeThickness = Number(edgeSlider.value);
  edgeValue.textContent = edgeThickness + "px";
});

showVideoInput.addEventListener("change", () => {
  showVideoFeed = showVideoInput.checked;
});

mirrorVideoInput.addEventListener("change", () => {
  mirrorVideoFeed = mirrorVideoInput.checked;
});

naiveModeInput.addEventListener("change", () => {
  naiveMode = naiveModeInput.checked;
});

function computeCoverTransform() {
  const sw = video.videoWidth;
  const sh = video.videoHeight;
  const tw = canvas.width;
  const th = canvas.height;
  if (!sw || !sh || !tw || !th) return null;
  const scale = Math.max(tw / sw, th / sh);
  return {
    sourceWidth: sw,
    sourceHeight: sh,
    targetWidth: tw,
    targetHeight: th,
    drawnWidth: sw * scale,
    drawnHeight: sh * scale,
    scale,
    offsetX: (tw - sw * scale) / 2,
    offsetY: (th - sh * scale) / 2
  };
}

function resizeCanvasToViewport() {
  const rect = video.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const pr = window.devicePixelRatio || 1;
  const w = Math.max(1, Math.round(rect.width * pr));
  const h = Math.max(1, Math.round(rect.height * pr));
  if (canvas.width === w && canvas.height === h) return;
  canvas.width = w;
  canvas.height = h;
}

function drawVideoFrame(transform) {
  if (!showVideoFeed) return;
  ctx.save();
  if (mirrorVideoFeed) {
    ctx.translate(transform.targetWidth, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(video, transform.offsetX, transform.offsetY, transform.drawnWidth, transform.drawnHeight);
  ctx.restore();
}

function drawMask(mask, transform) {
  const data = mask.getAsFloat32Array();
  const maskW = mask.width;
  const maskH = mask.height;
  if (!data || !maskW || !maskH) return;

  const imgW = transform.sourceWidth;
  const imgH = transform.sourceHeight;
  const scaleX = maskW / imgW;
  const scaleY = maskH / imgH;
  const [r, g, b] = hexToRgb(maskColor);

  const offCanvas = document.createElement("canvas");
  offCanvas.width = canvas.width;
  offCanvas.height = canvas.height;
  const offCtx = offCanvas.getContext("2d");

  const iData = offCtx.createImageData(canvas.width, canvas.height);
  const pixels = iData.data;

  for (let dy = 0; dy < canvas.height; dy++) {
    for (let dx = 0; dx < canvas.width; dx++) {
      let srcX = dx;
      if (mirrorVideoFeed) srcX = canvas.width - dx - 1;

      const imgX = (srcX - transform.offsetX) / transform.scale;
      const imgY = (dy - transform.offsetY) / transform.scale;

      if (imgX < 0 || imgX >= imgW || imgY < 0 || imgY >= imgH) {
        continue;
      }

      const mx = Math.round(imgX * scaleX);
      const my = Math.round(imgY * scaleY);
      if (mx < 0 || mx >= maskW || my < 0 || my >= maskH) continue;

      const confidence = data[my * maskW + mx];
      if (confidence < maskThreshold) continue;

      const alpha = Math.min(confidence, 1);
      const idx = (dy * canvas.width + dx) * 4;
      pixels[idx] = r;
      pixels[idx + 1] = g;
      pixels[idx + 2] = b;
      pixels[idx + 3] = Math.round(alpha * 180);
    }
  }

  offCtx.putImageData(iData, 0, 0);

  if (edgeThickness > 0) {
    ctx.save();
    ctx.filter = "blur(" + edgeThickness + "px)";
    ctx.globalAlpha = 0.7;
    ctx.drawImage(offCanvas, 0, 0);
    ctx.restore();
  }

  ctx.drawImage(offCanvas, 0, 0);
}

function processFrame() {
  if (!segmenter || !webcamRunning) return;
  if (video.readyState < 2) return;

  const now = performance.now();
  if (video.currentTime === lastVideoTime) return;

  if (!naiveMode && isProcessing) {
    skippedFrames++;
    skippedEl.textContent = skippedFrames;
    return;
  }

  isProcessing = true;
  lastVideoTime = video.currentTime;
  resizeCanvasToViewport();

  const transform = computeCoverTransform();
  if (!transform) {
    isProcessing = false;
    return;
  }

  const t0 = performance.now();
  let result;
  try {
    result = segmenter.segmentForVideo(video, t0);
  } catch (err) {
    isProcessing = false;
    showError("Inference Error", err.message);
    return;
  }

  frameLatencyEstimate = performance.now() - t0;
  totalFrames++;
  inferenceCount++;
  rollingLatencies.push(frameLatencyEstimate);
  if (rollingLatencies.length > ROLLING_WINDOW) rollingLatencies.shift();
  if (benchmarkRunning) {
    benchmarkLatencies.push(frameLatencyEstimate);
    benchmarkInferences++;
  }
  inferencesEl.textContent = inferenceCount;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawVideoFrame(transform);

  if (result?.confidenceMasks && result.confidenceMasks.length > 0) {
    try {
      drawMask(result.confidenceMasks[0], transform);
      if (benchmarkRunning && result.confidenceMasks[0]) {
        const m = result.confidenceMasks[0];
        const d = m.getAsFloat32Array();
        let above = 0;
        for (let i = 0; i < d.length; i++) { if (d[i] > maskThreshold) above++; }
        benchmarkCoverages.push((above / d.length) * 100);
      }
    } catch (err) {
      showError("Mask Render Error", err.message);
    }
  }

  result.close();
  isProcessing = false;
}

function updateMetrics() {
  const now = performance.now();
  const elapsed = now - lastFpsTick;
  if (elapsed >= 500) {
    const infFps = totalFrames / (elapsed / 1000);
    const infCount = inferenceCount;

    let median = 0;
    let p95 = 0;
    if (rollingLatencies.length > 0) {
      const sorted = rollingLatencies.slice().sort((a, b) => a - b);
      median = sorted[Math.floor(sorted.length / 2)];
      p95 = sorted[Math.floor(sorted.length * 0.95)];
    }

    fpsEl.textContent = Math.round(infFps).toString();
    latencyEl.textContent = Math.round(median).toString();
    p95latencyEl.textContent = Math.round(p95).toString();
    totalFrames = 0;
    lastFpsTick = now;
  }
}

function renderLoop() {
  try {
    processFrame();
    updateMetrics();
    if (benchmarkRunning) {
      const elapsed = ((performance.now() - benchmarkStartTime) / 1000).toFixed(1);
      benchElapsedEl.textContent = elapsed;
      benchmarkTimer.style.display = "";
    } else {
      benchmarkTimer.style.display = "none";
    }
  } catch (err) {
    showError("Loop Error", err.message);
  }
  animationFrameId = requestAnimationFrame(renderLoop);
}

function segmentStillImage(file) {
  if (!segmenter) {
    showError("Model Not Ready", "The segmentation model has not finished loading.");
    return;
  }

  const img = new Image();
  img.onload = function () {
    resizeCanvasToViewportForImage(img);
    const t0 = performance.now();

    let result;
    try {
      segmenter.setOptions({ runningMode: "IMAGE" });
      result = segmenter.segment(img);
      segmenter.setOptions({ runningMode: "VIDEO" });
    } catch (err) {
      showError("Segmentation Error", err.message);
      return;
    }

    frameLatencyEstimate = performance.now() - t0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    if (result?.confidenceMasks && result.confidenceMasks.length > 0) {
      try {
        const mask = result.confidenceMasks[0];
        const data = mask.getAsFloat32Array();
        const maskW = mask.width;
        const maskH = mask.height;
        const [r, g, b] = hexToRgb(maskColor);

        const iData = ctx.createImageData(canvas.width, canvas.height);
        const pixels = iData.data;

        for (let dy = 0; dy < canvas.height; dy++) {
          for (let dx = 0; dx < canvas.width; dx++) {
            const mx = Math.floor((dx / canvas.width) * maskW);
            const my = Math.floor((dy / canvas.height) * maskH);
            if (mx < 0 || mx >= maskW || my < 0 || my >= maskH) continue;

            const confidence = data[my * maskW + mx];
            if (confidence < maskThreshold) continue;

            const idx = (dy * canvas.width + dx) * 4;
            pixels[idx] = r;
            pixels[idx + 1] = g;
            pixels[idx + 2] = b;
            pixels[idx + 3] = Math.round(Math.min(confidence, 1) * 180);
          }
        }

        ctx.putImageData(iData, 0, 0);

        if (edgeThickness > 0) {
          const edgeCanvas = document.createElement("canvas");
          edgeCanvas.width = canvas.width;
          edgeCanvas.height = canvas.height;
          const edgeCtx = edgeCanvas.getContext("2d");
          edgeCtx.putImageData(iData, 0, 0);
          ctx.filter = "blur(" + edgeThickness + "px)";
          ctx.globalAlpha = 0.7;
          ctx.drawImage(edgeCanvas, 0, 0);
          ctx.filter = "none";
          ctx.globalAlpha = 1;
          ctx.drawImage(edgeCanvas, 0, 0);
        }
      } catch (err) {
        showError("Mask Render Error", err.message);
      }
    }

    result.close();
    setStatus("Still image segmented", "ready");
    setStatusDetail(
      "Latency: " + Math.round(frameLatencyEstimate) + "ms | Threshold: " + maskThreshold.toFixed(2)
    );
  };

  img.src = URL.createObjectURL(file);
}

function resizeCanvasToViewportForImage(img) {
  const rect = video.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const pr = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.round(rect.width * pr));
  canvas.height = Math.max(1, Math.round(rect.height * pr));
}

fileInput.addEventListener("change", () => {
  const file = fileInput.files?.[0];
  if (!file) return;
  placeholder.classList.add("hidden");
  metricsEl.style.display = "none";
  video.style.visibility = "hidden";
  segmentStillImage(file);
});

async function loadModel() {
  setStatus("Loading segmentation model...");
  setStatusDetail("");
  try {
    const vision = await FilesetResolver.forVisionTasks(
      "../../vendor/mediapipe/tasks-vision/wasm"
    );
    segmenter = await ImageSegmenter.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: "../../vendor/mediapipe/models/selfie_segmenter.tflite",
        delegate: "CPU"
      },
      runningMode: "VIDEO",
      outputConfidenceMasks: true,
      outputCategoryMask: false
    });
    setStatus("Model ready", "ready");
    setStatusDetail("Upload an image or switch to webcam mode.");
    cameraBtn.textContent = "Enable Camera";
  } catch (err) {
    setStatus("Failed to load model", "error");
    setStatusDetail(err.message);
    showError("Model Load Failed", err.message);
  }
}

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 1920 }, height: { ideal: 1080 }, facingMode: "user" },
      audio: false
    });
    video.srcObject = stream;
    await video.play();
    webcamRunning = true;
    placeholder.classList.add("hidden");
    lastVideoTime = -1;
    totalFrames = 0;
    skippedFrames = 0;
    errorCount = 0;
    inferenceCount = 0;
    rollingLatencies = [];
    lastFpsTick = performance.now();
    fpsEl.textContent = "0";
    latencyEl.textContent = "0";
    p95latencyEl.textContent = "0";
    skippedEl.textContent = "0";
    errorsEl.textContent = "0";
    inferencesEl.textContent = "0";
    metricsEl.style.display = "flex";
    exportBtn.disabled = false;
    setStatus("Camera active", "ready");
    cameraBtn.textContent = "Disable Camera";
    animationFrameId = requestAnimationFrame(renderLoop);
  } catch (err) {
    if (err instanceof DOMException) {
      if (err.name === "NotAllowedError") {
        setStatus("Camera permission denied", "deny");
        setStatusDetail("Allow camera access in your browser settings and try again.");
        showError("Permission Denied", "Camera access was denied. Check your browser settings.");
      } else if (err.name === "NotFoundError") {
        setStatus("No camera found", "deny");
        setStatusDetail("Connect a camera and try again.");
        showError("No Camera", "No camera device was detected on this system.");
      } else if (err.name === "NotReadableError") {
        setStatus("Camera in use", "deny");
        setStatusDetail("Close other apps using the camera.");
        showError("Camera Unavailable", "The camera is already in use by another application.");
      } else {
        showError("Camera Error", err.name + ": " + err.message);
      }
    } else {
      showError("Camera Error", err.message);
    }
  }
}

function stopCamera() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = 0;
  }
  if (video.srcObject) {
    video.srcObject.getTracks().forEach((t) => t.stop());
    video.srcObject = null;
  }
  webcamRunning = false;
  lastVideoTime = -1;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  metricsEl.style.display = "none";
  placeholder.classList.remove("hidden");
  setStatus("Camera stopped", "");
  setStatusDetail("Upload an image or enable the camera.");
  cameraBtn.textContent = "Enable Camera";
  exportBtn.disabled = true;
  benchmarkRunning = false;
}

exportBtn.addEventListener("click", () => {
  if (benchmarkRunning) {
    benchmarkRunning = false;
    const elapsed = (performance.now() - benchmarkStartTime) / 1000;
    const sorted = benchmarkLatencies.slice().sort((a, b) => a - b);
    const median = sorted.length > 0
      ? sorted[Math.floor(sorted.length / 2)]
      : 0;
    const p95 = sorted.length > 0
      ? sorted[Math.floor(sorted.length * 0.95)]
      : 0;
    const fps = elapsed > 0 ? benchmarkInferences / elapsed : 0;
    const avgCoverage = benchmarkCoverages.length > 0
      ? benchmarkCoverages.reduce((s, v) => s + v, 0) / benchmarkCoverages.length
      : 0;

    const row =
      "| 1 | " +
      benchmarkInferences + " | " +
      median.toFixed(1) + " | " +
      p95.toFixed(1) + " | " +
      fps.toFixed(1) + " | " +
      avgCoverage.toFixed(1) + "% | " + elapsed.toFixed(1) + "s |";

    const json = JSON.stringify({
      inferences: benchmarkInferences,
      medianMs: median,
      p95Ms: p95,
      fps: fps,
      foregroundCoverage: avgCoverage,
      elapsedSec: elapsed,
      samples: benchmarkLatencies.length
    }, null, 2);

    const text = row + "\n\n" + json;
    navigator.clipboard.writeText(text).then(() => {
      exportBtn.textContent = "Copied " + benchmarkInferences + " frames";
      exportBtn.disabled = false;
      setTimeout(() => {
        exportBtn.textContent = "Start Benchmark";
        exportBtn.disabled = false;
      }, 2500);
    }).catch(() => {
      exportBtn.textContent = "Copy failed";
    });

    benchmarkLatencies = [];
    benchmarkInferences = 0;
    benchmarkCoverages = [];
    setStatus("Benchmark ended | " + fps.toFixed(1) + " FPS | " + median.toFixed(0) + "ms median", "ready");
  } else {
    benchmarkRunning = true;
    benchmarkLatencies = [];
    benchmarkInferences = 0;
    benchmarkCoverages = [];
    benchmarkStartTime = performance.now();
    exportBtn.textContent = "Stop & Export";
    setStatus("Benchmark running...", "");
  }
});

cameraBtn.addEventListener("click", () => {
  if (!segmenter) return;
  if (webcamRunning) {
    stopCamera();
  } else {
    startCamera();
  }
});

loadModel();
