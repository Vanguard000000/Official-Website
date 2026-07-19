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
| Segmenter cleanup |  | |
| Camera permission API | | |

## Module plan

- Files I will create:
- Input states:
- Processing stages, in order:
- Outputs shown to the user:
- Loading state:
- Ready state:
- Stopped state:
- Permission-denied state:
- Runtime-error state:
- How I will prevent overlapping inference calls:
- How I will stop the camera:
- How I will release MediaPipe results and resources:

## Test plan

- Fixed browser and version:
- Machine and operating system:
- Camera and requested resolution:
- Lighting, distance, and background:
- Warm-up period:
- Benchmark duration and number of runs:
- How median latency will be calculated:
- How p95 latency will be calculated:
- How effective inference FPS will be calculated:
- How foreground coverage will be calculated:

## Predictions

- Median inference latency:
- p95 inference latency:
- Effective inference FPS:
- Foreground coverage for the fixed scene:
- Failure case I expect to be worst:
- Why:

## Planning gate

Before asking the agent to write code, explain:

1. Which documented method handles a still image?
2. Which documented method handles a video frame, and what timestamp does it
   require?
3. What exact result data becomes the visible mask?
4. What must be closed or released?
5. How does the plan guarantee only one inference is active?

- [ ] I completed the API contract and documentation trace myself.
- [ ] I can answer all five questions without asking the agent to answer for me.
- [ ] The agent reviewed the plan and identified no unsupported API assumptions.

Implementation remains blocked while any box is unchecked.

