# Optimization Results

Date: June 16, 2026
Browser: Opera
Machine: Optiplex 7040

## Instructions

1. Run the expression detector with the camera on for 10 seconds. Read the numbers off your screen — do not guess.
2. Fill in the **Baseline** row first, before any code changes.
3. Apply one optimization, re-measure, fill an **After** row. Repeat for each track.
4. Answer the explanation questions in your own words.

---

## Measurements

| Stage            | Render FPS               | Inference latency (ms) | Inferences/sec | Notes             |
| ---------------- | ------------------------ | ---------------------- | -------------- | ----------------- |
| Baseline         | avg 50, lowest 34        | avg 30, peaked 184     | 15             | browser + machine |
| After — Track B  | avg 44, up to 56 w/ face | avg 30, no spikes      | 15, peaked 17  | GPU delegate      |
| After — Track D  | 36                       | 60, peaked 110         | 16 avg         | 640x360 input     |

---

## Explanation (write in your own words)

1. Which line did your change touch, and what does that line do every frame?

 index.js:940 — delegate: "GPU" inside baseOptions in loadModel()-delegated processing and resource use to GPU for better handling of input and to sustain lower latency and also ge the max inferences/sec with the best render fps. This line shares processing with GPU alongide CPU.

 index.js:471-472 — inferenceCanvasEl.width = 640; and inferenceCanvasEl.height = 360; inside syncCanvasSize()
 this track hardcoded a 640x360 res for lower input to the models-lowers pixels shared significantly per frame.
2. *Why* does the change cost less? (Fewer model runs? Smaller input? Different hardware path? Less work drawn per frame?)

Track b-cost CPU less resources and lets GPU complete delegated tasks, alongisde a different hardware path which also results in less work done per frame for the CPU.
Track d-each model run does more work per pixel at 640x360, not fewer runs — inferences/sec stayed the same (15→16) but latency doubled.

3. What trade-off did you accept — what got worse?
Lowering input resolution to 640x360 made render fps worse and raised inference latency. Likely caused by each model run doing more work per pixel at smaller input, not more runs — inferences/sec stayed flat.
Track b raised render fps, alongside less processig done by the CPU (riskd init failure), nothing got worse

4. If a classmate said "just make it faster," what would you tell them to measure first?
Model runs, input res, and extra jargon that is taking up resources.