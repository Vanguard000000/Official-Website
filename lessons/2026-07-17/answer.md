# Answer — 2026-07-17

Anchor every answer to source files, line references, executed checks, or saved
results. Assistance may include drafting, explanation, implementation, and
review; observations must still come from an executed check.

## Pipeline explanation

1. Trace one webcam frame from the video element to the displayed output,
   naming each of your functions it passes through. renderLoop() segmenttion.js:375 → processFrame() segmentation.js:286 → segmentForVideo() segmentaton.js:312 → drawMask() segmentation.js:225
2. What does one value in the confidence mask mean? What visibly changes when
   the threshold moves from 0.3 to 0.5 to 0.7? 1.0 means definitely a person and 0 means a definite background. As values increase, the mask shrinks and fits the person instead of bleeding into the surrounding objects.
3. Where exactly does your code select the CPU delegate? (file and line)
segmentation.js:503
4. What happened when the loop ran naively, and why does your mechanism make
   overlapping inference impossible?
   When the loop ran naively, with no guard, the runtime process corrupted and returned 0% foreground coverage (successful frames were rewritten prematurely). This is because requestAnimationFrame runs every 16ms, which is before the total time per inference (87ms), causing a new re-write every 16ms while inferencing actually takes 87ms to complete fully. Without isProcessing, the boolean guard, the segmentForVideo calls start before the last one finishes, which mixes results and results in corrupted foreground coverage -> 0%.
5. Where is CPU time spent, based on your measurements rather than a guess? 
CPU spends most of its time in inferencing, as confirmed by the median latency (frames that were in the median to avoid outlier). This confirmed 55% of time spent in inferencing, and the rest in the post-processing. the Avg was 48ms out of 87ms, which returns 55% time spent in inferencing.
6. Where did the mask fail most clearly, and what is the mechanism — not
   "low light is hard" but *why* it is hard for this model?
The mask failed in naive loop because the isProcessing boolean guard was missing. Corrupted frames overwrote successful frames, returning 0% foreground coverage. In low light, the model relies on edge contrast to distinguish person from background. Low light flattens contrast, so more boundary pixels become ambiguous, and foreground coverage fell to 17%.
7. Which cleanup step prevents the camera or MediaPipe resources from staying
   active? Camera: stream.getTracks().forEach(t => t.stop()) + video.srcObject = null — lines 576–577 in stopCamera(). This releases the webcam hardware so other apps can use it.
MediaPipe: result.close() — line 348 in processFrame(). This runs every frame, closing the confidence masks so they don't accumulate in memory.
8. What is one next change supported by the results? What evidence supports it?
The inferences are the bottleneck and this slows the cycle, creating extra latency. THis is clear from the median latency benchmark that is consistently in the 46 to 50ms zone, which means that inferences took 46% or more of the time per cycle. Moving inference to a web worker will cut down browser locking and being non-responsive during the 48ms interference, and this will reduce median latency.
## Walkthrough preparation

Before the demo, review the implementation against these questions:

- trace one live frame through your own code,
- point to the line where CPU execution is selected,
- explain what a confidence value of 0.62 means and why your threshold is
  where it is,
- explain the mechanism that prevents overlapping inference,
- make one small live change and verify the result.

## Implementation record

- Sources of assistance used: I used the agent for documentation look-up, and in plan.md, I didn't understand some terms like what a segment factory was. And at times, I failed to get why something worked or failed-like the corrupted foreground coverage process that results due to a missing boolean guard.
- Remaining uncertainty:
The gate's meaning when it was set to true or false was confusing for me. I had to review it several times.
