# July 17 — CPU Person Segmentation

> **Resume prompt:** read sessions/2026-07-17-transcript.md and sessions/2026-07-17.md

Build a person-segmentation module from a blank implementation. Use the local
MediaPipe runtime and model, run inference on the CPU, and prove how well it
works with measurements and failure tests.

The core workflow is to record the intended behavior, verify the API contract,
implement a bounded path, and test both performance and failure behavior.

## Constraints

- Load `.opencode/skills/api-docs-first/SKILL.md` before planning the code.
- Record the API contract and implementation plan in `plan.md`.
- Do not copy an existing segmentation implementation.
- Use the checked-in MediaPipe files. Do not add a CDN or another library.
- Use the CPU delegate. Do not request GPU acceleration.
- Use scoped commits whose diffs each represent one logical decision.

## Provided files

- Runtime module:
  `mediapipe-lab/vendor/mediapipe/tasks-vision/vision_bundle.mjs`
- WASM directory:
  `mediapipe-lab/vendor/mediapipe/tasks-vision/wasm/`
- Segmentation model:
  `mediapipe-lab/vendor/mediapipe/models/selfie_segmenter.tflite`

You still need to verify the runtime source or version, exported symbols,
method signatures, result shape, and cleanup behavior from local declarations
and primary MediaPipe documentation.

## Work in this order

1. Load `api-docs-first`, inspect the local files, read primary documentation,
   and complete the API contract in `plan.md`.
2. Plan the module's data flow, files, UI states, measurements, and likely
   failure cases.
3. Create `mediapipe-lab/sims/person-segmentation/` with an empty HTML, CSS,
   and JavaScript module. Build only the interface and status states.
4. Load the local MediaPipe runtime and model on the CPU. Show loading, ready,
   and error states.
5. Accept one uploaded image and run one segmentation request.
6. Display the raw mask and add a threshold control.
7. Use the mask for one effect: background blur, replacement, or transparency.
8. Add webcam input and handle permission denial or a missing camera.
9. First run the loop naively — request segmentation for every frame — for 30
    seconds and record what happens to responsiveness and latency in
    `results.md`. Then enforce the mechanism from your plan so overlapping
    inference is impossible, and release the camera and MediaPipe resources
    when stopped. Record why the mechanism prevents overlap.
10. Load `honest-benchmark`, warm up the module, then run the five fixed
    10-second CPU tests in `results.md`.
11. Test low light, fast movement, multiple people, a partly cropped person,
    and a busy background.
12. Explain the pipeline, its limits, and one justified next change in
    `answer.md`.
13. Review the recorded evidence and make the final scoped commit.

## Checkpoints

Use the still-image result to validate the API and mask before adding webcam
state. Record each checkpoint:

1. API contract traced to source
2. Runtime and model ready on CPU
3. One still image segmented
4. Raw mask visible
5. Visual effect driven by the mask
6. Webcam loop stable and stoppable
7. Measurements and failure tests recorded
8. Final walkthrough completed

## Done when

- The module works from a local server without a CDN.
- The still-image and webcam paths both work.
- The raw mask and one mask-based visual effect are visible.
- Loading, permission-denied, no-camera, stopped, and runtime-error states are
  handled.
- The loop never starts overlapping inference calls.
- `plan.md` contains the API contract and prediction.
- `results.md` contains five runs, the naive-loop observation, and failure tests.
- `answer.md` contains the pipeline explanation and limitations.
- Commits are scoped to reviewable decisions.
- The walkthrough traces a live frame, identifies the CPU delegate, explains
  one confidence value, and demonstrates one small verified change.

## Overdrive (optional, after everything above is done)

Only with evidence — same benchmark protocol, recorded in `results.md`:

- Move inference into a worker. Measure what it does to end-to-end latency and
  UI responsiveness, before and after.
- The vendored `wasm/` directory ships a SIMD and a no-SIMD engine. Force the
  no-SIMD fallback and quantify what SIMD is worth on your machine.

---

## Session Transcript — July 18, 2026 (API Contract and Documentation Trace)

**Session focus:** Complete the API contract and documentation trace for the
7-17 person-segmentation lesson by inspecting the vendored MediaPipe bundle.

### 1. Loading the runtime files

The agent loaded all three provided resources:
- **Runtime module:** `vision_bundle.mjs` — a minified 2-line file with all
  MediaPipe vision task classes
- **WASM directory:** Contains `vision_wasm_internal.js`/`.wasm` (SIMD) and
  `vision_wasm_nosimd_internal.js`/`.wasm` (no-SIMD)
- **Model:** `selfie_segmenter.tflite` — the person segmentation model

The bundle was searched for exported symbols. The export line at the bottom
confirmed: `ImageSegmenter`, `ImageSegmenterResult`, `FilesetResolver`, `MPMask`,
`MPImage`, plus landmarkers, detectors, classifiers, and more.

### 2. Formatting the bundle for readability

The user noted the bundle was a single long line. The agent ran prettier to
reformat it into 8,437 readable lines with proper indentation. This made
line-by-line searches possible.

### 3. Plain-English teaching: what each API contract field means

The user said they didn't understand the technical terms in the contract. The
agent translated every field:

| Contract field | Plain meaning |
|---|---|
| API and task | What tool are you using and what does it do? |
| Local version or source | Where is the file on your computer? |
| Import or entry point | What do you type to bring the tool into your code? |
| Constructor or factory | How do you build the tool? |
| Call signature | The exact line that makes it do its job |
| Sync/async behavior | Does the result come back instantly or do you wait? |
| Result shape | What does the answer look like? |
| Lifecycle and cleanup | What do you have to shut down when done? |
| Errors/permissions | What if camera permission is denied? |

### 4. Teaching the "no-AI method" — how to find answers yourself

The user asked how to get answers without AI and without reading 8,000 lines.
The agent taught two methods:

**Method 1 — Ctrl+F search terms:**
| Search term | Finds |
|---|---|
| `ImageSegmenter` | The class, factory names |
| `.segment` | Still-image vs video method names |
| `confidenceMasks` | The result data |
| `.close` | Cleanup calls |
| `getAsFloat32Array` | How to read pixel values |

**Method 2 — Copy existing sim:** Open `pose-estimation/index.html`, swap
`PoseLandmarker` for `ImageSegmenter`, follow the same pattern.

### 5. Walking through the API contract line by line

The user filled in each field. The agent reviewed and corrected:

**Primary documentation** — initially listed WASM files and the model path.
Corrected: those are runtime assets, not documentation. Fixed to the Google
MediaPipe docs URL.

**Call signature** — initially copy-pasted internal code fragments
(`Nc.prototype.segment = Nc.prototype.fa`). Corrected: the call signature is
what you write in your code: `segmenter.segment(image)` and
`segmenter.segmentForVideo(image, timestampMs)`. The internal line is proof
the method exists; the call signature is how you use it.

**Other fields** were correct: result shape (confidenceMasks, getAsFloat32Array),
cleanup (three close calls), permissions (browser getUserMedia errors).

### 6. Documentation trace — finding every source line

The agent guided the user to find each proof in the bundle:

| Row | Line | What was found |
|---|---|---|
| Runtime/WASM loader | 2914 | `FilesetResolver.forVisionTasks = function(t) {...}` |
| Segmenter factory | 8031 | `Nc.createFromOptions = function(t, e) { return Qa(Nc, t, e); }` |
| CPU delegate option | 3013 | `"delegate" in e && ("GPU" === e.delegate ? GPU : CPU)` — CPU is the default/fallback |
| Still-image method | 7966, 8023 | `fa(t, e, n)` = the implementation; `segment = fa` = the public alias |
| Video-frame method | 7970, 8022 | `Na(t, e, n, r)` takes image + timestamp; `segmentForVideo = Na` |
| Running-mode change | 4262 | `setOptions` processes `runningMode: "IMAGE"` or `"VIDEO"`; constructor defaults to IMAGE |
| Confidence-mask result | 7989 | Listener converts engine output to `MPMask[]` via `rc()` |
| Mask data access | 3423 | `mask.getAsFloat32Array()` returns per-pixel 0–1 values |
| Mask cleanup | 3420, 7908–7912 | `mask.close()` + `result.close()` (closes all masks at once) |

**Teaching point — alias vs implementation:**
The user found `segment = fa` at line 8023 and asked why they needed line 7966.
Answer: 8023 is the label (what you call), 7966 is the body (what it does with
your image). Both together are the complete proof.

**Teaching point — what `function(t)` means:**
The user asked about the `t` parameter. Answer: `t` is the argument you pass in.
When you write `FilesetResolver.forVisionTasks("path/to/wasm")`, that string
becomes `t` inside the function.

### 7. Current status at session end

**Completed:**
- [x] API contract (all 11 fields filled and reviewed)
- [x] Documentation trace (9 of 11 rows filled; Segmenter cleanup and Camera
  permission API still empty)
- [x] `vision_bundle.mjs` formatted to 8,437 readable lines
- [x] Journal `2026-07-17.md` created from template

**Remaining:**
- [ ] Fill segmenter cleanup row (line 4272)
- [ ] Fill camera permission API row (browser API, not in bundle)
- [ ] Module plan
- [ ] Test plan
- [ ] Predictions
- [ ] Planning gate answers
- [ ] Implementation (all 8 steps)
