# Project Plan

Date: June 16, 2026

## Instructions

Answer all 4 sections below *before* touching any code. Write your predictions first — being wrong on purpose is how you learn what actually costs time. Then pick at least 2 tracks from `02-optimization-menu.md` and measure each one separately.

---

## 1. Which optimization track(s) am I doing, and in which order?

Track B and D. B first, then D.

## 2. Which exact line(s) in my demo will change?

mediapipe-lab/sims/face-mesh/index.js -> Track B. Lines 912 to 915 (function loadModel)
mediapipe-lab/sims/face-mesh/index.js -> Track D. Lines 465 and 466 (function syncCanvasSize)

## 3. What do I predict will happen to each of the three numbers?

<!-- Predictions before measuring. Fill this out BEFORE you run anything. -->

| Metric | Track B: GPU | Track D: 720p |
| --- | --- | --- |
| Render FPS | up| up|
| Inference latency (ms) |.700 ms down | 1200 ms down|
| Inferences / sec | 30 times pre cycle| 45 times per cycle|

## 4. What might get worse, and how will I check?

Decreasing quality and delegating processing to gpu will trade input (pixels) and processing capability. A missing GPU (dedicated) will prevent model from loading entirely.

How to check:

Track B: Check inference latency (ms) before vs after adding GPU delegate. Watch console for GPU init errors — if GPU is unavailable the model won't load.
Track D: Compare expression detection accuracy at 720p vs full res — sit at normal distance, verify all 4 expressions still detect and the overlay doesn't drift.
