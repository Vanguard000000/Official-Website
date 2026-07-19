# Plan — 2026-07-17

Complete this in your own words before creating the segmentation module. Load
`.opencode/skills/api-docs-first/SKILL.md` first. Your agent may review this and
ask questions, but it must not write the answers or implementation for you.

## API contract

- API and task: 
Building a person segmentation feature utilizing Mediapipe's selfie_segmenter model

- Local version or source: 
mediapipe-lab/vendor/mediapipe/tasks-vision/vision_bundle.mjs

- Primary documentation: 
[](https://developers.google.com/edge/mediapipe/solutions/vision/image_segmenter)

- Import or entry point: 
import { ImageSegmenter, FilesetResolver } from "../../vendor/mediapipe/tasks-vision/vision_bundle.mjs";

- Constructor or factory:
 ImageSegmenter.createFromOptions(...)

- Call signature: 
still-image: segmenter.segment(image)
video: segmenter.segmentForVideo(image, timestampMs)  

- Sync, async, callback, or event behavior: 
a direct result, with no waiting time

- Result shape used by this feature: 
ImageSegmenterResult object with three fields:

- confidenceMasks[] — array of MPMask (one per person)
- categoryMask — single MPMask or undefined
- qualityScores[] — array of floats
- Each MPMask gives pixel data via .getAsFloat32Array() (line 3423) — a float array, 0 to 1 per pixel
- Lifecycle and cleanup: 
1. result.close() — closes all confidenceMasks + categoryMask (line 7908–7912)
2. mask.close() — close individual mask (line 3420)
3. segmenter.close() — close the segmenter itself (line 4268–4272)

- Errors, permissions, and capability fallback: 
This isn't in the bundle. Camera permissions are handled by the browser's getUserMedia API:
- NotAllowedError — user denied permission
- NotFoundError — no camera
- NotReadableError — camera already in use
- Remaining uncertainty: nothing rn

## Documentation trace

For every symbol below, record the primary documentation page or local
declaration that proves you can use it this way.

| Symbol, method, option, or result field | Source | What the source says |
| --- | --- | --- |

| Runtime/WASM loader | vision_bundle.mjs 2914 | FilesetResolver.forVisionTasks("path/to/wasm/") takes the WASM path as a parameter in a function that loads the engine  |

| Segmenter factory | vision_bundle.mjs:8031 | Nc.createFromOptions(vision, options) builds an ImageSegmenter with CPU delegate |

| CPU delegate option | vision_bundle.mjs:3013 | by default runs inferences on CPU, with GPU being the only other alternative |

| Still-image method | vision_bundle.mjs:8023 | (Nc.prototype.segment = Nc.prototype.fa), where segment is the internal pointer of the fa method, and fa is implemente at line 7966 and tkes the image, options, and callback after which it runs inference |

| Video-frame method | vision_bundle.mjs:8022 | Nc.prototype.segmentForVideo = Nc.prototype.Na call na method that runs segmentation in live feed as segmentforvideo points to it|

| Running-mode change, if needed | vision_bundle.mjs:4262 | Pass runningMode: "IMAGE" or runningMode: "VIDEO" in options; constructor defaults to IMAGE |

| Confidence-mask result | vision_bundle.mjs:7989 | this.confidenceMasks = t.map(t => rc(...)) — converts engine output into MPMask[] |

| Mask data access | vision_bundle.mjs:3423 |  mask.getAsFloat32Array() returns per-pixel confidence values (0–1) |

| Mask cleanup | vision_bundle.mjs:3420 & 4272 | mask.close() for individual mask and result.close()   // closes every confidenceMask + categoryMask automatically |

| Segmenter cleanup | vision_bundle.mjs:4268–4272 | close() { this.P.close(), super.close(); } (ic is the base class ImageSegmenter inherits from) |

| Camera permission API | MDN: getUserMedia | navigator.mediaDevices.getUserMedia({video: true}) returns a Promise; rejects with NotAllowedError (denied), NotFoundError (no camera), or NotReadableError (hardware error) |

## Module plan

- Files I will create: 
mediapipe-lab/sims/person-segmentation/index.html
mediapipe-lab/sims/person-segmentation/styles.css
mediapipe-lab/sims/person-segmentation/segmentation.js
- Input states:
 An uploaded image file (still-image path)
- A webcam stream (video path)
- Processing stages, in order: 
the step-by-step pipeline. Something like:
1. Load MediaPipe runtime + model
2. Wait for input (image or webcam)
3. Run segmentation inference
4. Get confidence mask from result
5. Draw mask on canvas
6. Clean up result
- Outputs shown to the user:
- The original image/webcam feed
- The segmentation mask overlaid (colored or transparent)
- A threshold slider to adjust the cut-off
- Loading state: What the screen looks like while the model loads. Ex: "Loading model..." spinner or text.
- Ready state: What the screen looks like when the model is loaded and waiting for input. Ex: "Model ready — upload an image or enable camera."
- Stopped state: What happens when the user stops the webcam. The video freezes or the canvas clears, and the segmenter is no longer running.
- Permission-denied state: what the user sees if they click "Enable Camera" and deny permission. Ex: a message saying "Camera permission denied — check your browser settings."
- Runtime-error state: What happens if inference crashes mid-frame (bad model, broken WASM, etc). Ex: error message with details.
- How I will prevent overlapping inference calls:  If a frame takes 50ms to segment, but new frames arrive every 33ms, work will pile up. The mechanism: a boolean flag (isProcessing). A simple check that is ticked every time a frame is sent and successfully arrives. Once a on-time frame is processed and arrives, then any out-of-time frames will be skipped and this cycle will continue.
- How I will stop the camera:  stream.getTracks().forEach(t => t.stop()) and set video.srcObject = null.
- How I will release MediaPipe results and resources: result.close() after drawing, segmenter.close() when stopping.

## Test plan

- Fixed browser and version: Opera 133
- Machine and operating system: Optiplex 7040 Windows 10 Pro 22H2 (64-bit)
- Camera and requested resolution: K20 USB CAMERA, 1920x1080 ideal 60hz
- Lighting, distance, and background: close distnce (11-13 in), mostly clear background, and shady lightning (not dark-not bright)
- Warm-up period: 15 seconds of inferencig before starting webcam benchmarking
- Benchmark duration and number of runs: five fixed 10-second CPU tests
- How median latency will be calculated: sort all per-frame inference duration, and take the middle value
- How p95 latency will be calculated: Record inference duration for every frame (timestamp after - timestamp before). Sort all values ascending. Take the value at index floor(count * 0.95). 95% of frames are faster than this number.
- How effective inference FPS will be calculated: Count total completed segmentForVideo() calls during the 10-second window, divide by 10. This measures actual inference throughput, not canvas or display FPS.
- How foreground coverage will be calculated: For one representative frame, sum all mask values > threshold, divide by total mask pixels, multiply by 100. This gives the percentage of the frame the model classifies as a person.

## Predictions

- Median inference latency: 45ms
- p95 inference latency: 60ms
- Effective inference FPS: 36-38 fps
- Foreground coverage for the fixed scene: 40-55%
- Failure case I expect to be worst: glare
- Why: vertical bright window casts bright light, and if the head moves, then there will be a burst of light

## Planning gate

Before asking the agent to write code, explain:

1. Which documented method handles a still image? segmenter.segment image
2. Which documented method handles a video frame, and what timestamp does it
   require?  segmenter.segmentForVideo(image, timestampMs) (internally noted as .Na) it takes the current timestamp 
3. What exact result data becomes the visible mask? the  confidenceMasks[0].getAsFloat32Array() (the model's confidence level for every pixel in the image that are noted as being a person) becomes the visible mask on the person that is highlighted
4. What must be closed or released? 1. result.close() — closes all confidenceMasks + categoryMask (line 7908–7912)
2. mask.close() — close individual mask (line 3420)
3. segmenter.close() — close the segmenter itself (line 4268–4272)

5. How does the plan guarantee only one inference is active?  A simple boolean flag-isProcessing. If multiple frames are being processed, then frames arriving out-of-time will be skipped and the next tick will take place through a simple boolean check through isProcessing.
true -> skip frame, else (false) -> frame passes. after each time a cycle is completed (inference) the flag is set to false to prevent false positives.

- [x] I completed the API contract and documentation trace myself.
- [x] I can answer all five questions without asking the agent to answer for me.
- [x] The agent reviewed the plan and identified no unsupported API assumptions.

Implementation remains blocked while any box is unchecked.

