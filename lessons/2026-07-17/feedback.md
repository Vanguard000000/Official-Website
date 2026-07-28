# Segmentation feedback — 2026-07-17

Reviewed against the current `main` branch and published site on 2026-07-27.

## What already works

- The local model and WASM runtime load.
- Still-image and synthetic-webcam inference both return masks.
- Camera permission failures have a visible error overlay.
- Successful video results are closed after they are read.

The inference result exists. The main problems are compositing, interaction
state, benchmark interpretation, and distribution.

## Issues to repair

### 1. Still-image compositing removes the photograph

Reproduction:

1. Load the local person-segmentation page.
2. Upload a photograph.

Observed result: the page displays a green person silhouette on a dark
background instead of the photograph with a mask overlay.

In `segmentStillImage()`, the source image is drawn first. A mask-only
`ImageData` object is then written directly onto the same canvas with
`putImageData()`. Transparent mask-background pixels replace the photograph;
they do not preserve the pixels that were already there.

Keep source imagery and mask pixels on separate drawing surfaces until the
final composite. Verify the alpha behavior of the operation you choose instead
of assuming transparent pixels leave the destination unchanged.

Proof of repair: the uploaded photograph remains visible everywhere, the mask
appears only where intended, and changing the mask color does not erase the
background.

### 2. Still-image controls do not update the current output

After an image is segmented, changing threshold from 0.50 to 0.90 changes the
label but not the canvas pixels. Color and edge controls have the same state
ownership problem: their handlers update variables but do not rerender the
current still result.

Decide which object owns the current source image and mask. On a control
change, either rerender from preserved data or rerun inference deliberately.
Do not retain a closed MediaPipe mask as long-lived state.

Proof of repair: change threshold, color, and edge thickness after one upload.
Each control must visibly update that same image without another file
selection.

### 3. Success status becomes invisible

The status elements live inside `#placeholder`. Both image and camera paths add
the global `.hidden` class to that placeholder, so messages such as “Still
image segmented” and “Camera active” are updated in the DOM but hidden from the
student.

Keep persistent operational status outside the layer that is removed after
loading, or hide only the placeholder background while leaving the status
available.

Proof of repair: loading, ready, image success, camera success, stopped, and
error states are all visible at the time they occur.

### 4. The required raw confidence view is absent

`results.md` says a raw mask was visible, but the current interface only offers
the colored overlay. There is no raw-confidence view or mode selector in the
current module.

Add a real raw view that maps confidence values to visible intensity, or
correct the evidence if that checkpoint was not completed. A binary threshold
silhouette is not the same artifact as the raw confidence mask.

Proof of repair: demonstrate at least three confidence levels in the rendered
mask and explain why the raw view differs from a thresholded overlay.

### 5. The guarded-versus-naive conclusion is not supported

The current video path calls the direct-result form:

```text
result = segmenter.segmentForVideo(video, timestamp)
```

That call returns before JavaScript advances to the next animation-frame
callback. In this implementation, the claimed queue of overlapping
`segmentForVideo()` calls is not created by removing `isProcessing`.

The review’s guarded and “naive” synthetic-camera runs both recorded zero
skipped frames. A 0% foreground result does not, by itself, prove concurrent
mask corruption.

Choose and document the actual API form:

- if inference returns a direct result, measure blocking time and frame
  throughput without claiming overlapping JavaScript calls;
- if using a callback-producing form, implement and instrument a real
  in-flight boundary.

Add counters or timestamps that directly demonstrate the mechanism. Remove the
overlap explanation unless the new evidence proves it.

### 6. Benchmark runs are not fixed at 10 seconds

The five recorded runs lasted 14.1–16.9 seconds even though the plan calls them
fixed 10-second tests. The current benchmark stops when the button is clicked,
and its exported Markdown row is always labeled run 1.

Use one automatic timer, one warm-up rule, and one run counter. Record every
run with the same threshold, effect, scene, and duration. Calculate effective
FPS from completed inferences divided by the measured elapsed seconds.

Proof of repair: five retained rows are each approximately 10 seconds, are
numbered 1–5, and include the exact elapsed time.

### 7. The segmentation module is not published

The current published route returns 404:

```text
https://vanguard000000.github.io/Official-Website/mediapipe-lab/sims/person-segmentation/index.html
```

The source module exists under the repository-root `mediapipe-lab/`, but the
committed `docs/mediapipe-lab/` output does not contain it. The lab launcher
also has no person-segmentation entry.

Inspect `eleventy.config.js`, the passthrough copy, the repository build command,
the committed `docs/` output, and the GitHub Pages source. Do not call the task
deployed until the generated output contains the module and the live URL
returns 200.

Proof of repair: launch it through the published lab index, reload the direct
URL in a fresh browser session, and confirm the model, WASM, and model-file
requests all succeed.

### 8. Tighten lifecycle and conceptual claims

Review these remaining points:

- running-mode changes in the still-image path are not awaited;
- the uploaded image object URL is not revoked;
- the segmenter is never explicitly closed at final shutdown;
- confidence masks represent output categories, not one mask per detected
  person;
- moving inference to a worker may improve interface responsiveness, but it
  does not by itself prove lower model-inference latency.

Update the code where ownership is missing and revise the written answers where
the mechanism exceeds the evidence.

## Stop conditions

Stop and preserve the failing state if:

- the original image disappears during compositing;
- a control changes its label but not its pixels;
- a running-mode change has not completed;
- the benchmark duration or scene changes;
- a published asset returns 404;
- the proposed cause is inferred rather than measured.

## Completion evidence

- [ ] Still-image output preserves the photograph and overlays the mask.
- [ ] Threshold, color, and edge controls rerender the current image.
- [ ] Operational status remains visible.
- [ ] A genuine raw confidence-mask view is demonstrated.
- [ ] The overlap claim is replaced with evidence matching the API form.
- [ ] Five automatically timed 10-second runs are recorded.
- [ ] Repeated image/camera mode changes release their resources.
- [ ] `docs/` contains the built module and the launcher links to it.
- [ ] The published route returns 200 and loads all local assets.
- [ ] `results.md` and `answer.md` contain only claims you can defend from the
      code and recorded observations.
