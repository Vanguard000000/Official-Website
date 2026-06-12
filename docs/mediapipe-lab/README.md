# MediaPipe Vision Lab

Browser-based computer vision demos powered by Google MediaPipe. Each demo runs
entirely in the browser using on-device machine learning — no server-side
processing, no data sent anywhere.

## What is included

- `index.html`: hub page with links to all three demos.
- `sims/pose-estimation/`: full body pose tracking with kinematic measurements.
- `sims/face-mesh/`: face landmark mesh with customizable overlay styling.
- `sims/gesture-recognition/`: hand landmark tracking with gesture classification.
- `sims/camera-preferences.js`: shared camera selection and persistence helper.
- `vendor/mediapipe/`: vendored MediaPipe Tasks Vision bundle, WASM runtime, and
  local model files (no CDN dependency).

## How to run

Start a local server from the repository root:

```bash
python3 -m http.server 5173
```

Then open:

```text
http://localhost:5173/mediapipe-lab/
```

The camera API requires a secure browser context. `localhost` is trusted by
modern browsers, but opening `index.html` directly from the file system will
break ES module loading, WASM loading, and camera permissions.

## Architecture

Each demo follows the same pattern:

1. **Load the model** — MediaPipe FilesetResolver loads the WASM runtime, then
   the task-specific model (`.task` file) is loaded from the local `vendor/`
   directory.
2. **Open the camera** — `getUserMedia` requests a video stream. The camera
   source selector lets you switch between front, rear, or specific cameras.
3. **Run inference** — Each animation frame, the latest video frame is passed to
   the MediaPipe task. Results (landmarks, gestures, classifications) are
   returned synchronously for that frame.
4. **Render overlay** — Landmark connections and feature points are drawn on a
   2D canvas overlaid on the video element.

## Demos

### Pose Estimation

Tracks 33 body landmarks. Includes a measurement mode for kinematic analysis
(torso lean, knee angle, shoulder alignment). Optional hand landmark tracking
for full hand pose.

### Face Mesh

478 face landmarks with tesselation mesh, contours, and iris tracking.
Customizable overlay color (presets or HSL sliders), node size, and smoothing.
Toggle between full mesh and feature-only rendering.

### Gesture Recognition

Hand landmark tracking combined with MediaPipe's gesture recognizer task.
Classifies hand gestures (open palm, closed fist, thumbs up, etc.) in real time.

## Maintenance

This folder is self-contained and framework-independent. It does not depend on
React, Tailwind, Sass, or site navigation. All imports are module-relative:

- Demo files import MediaPipe from `../../vendor/mediapipe/...`.
- Demo files import camera utilities from `../camera-preferences.js`.
- Each demo loads its own script with `<script type="module" src="./index.js"></script>`.
