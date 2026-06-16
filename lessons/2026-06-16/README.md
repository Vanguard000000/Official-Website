# Lessons: Optimize the Pipeline (Computer Vision + Performance)

Date: June 16, 2026

On June 12 you built the **facial-expression detector** in
`mediapipe-lab/sims/face-mesh/index.js`, reading MediaPipe blendshapes. You
turned `outputFaceBlendshapes` on — which costs extra work every frame — and your
benchmark sat around 15 FPS. Today you make it faster and steadier, and you prove
the difference with numbers.

This is a measure → change → measure day. Same demo, same machine, honest
before-and-after.

Work through these in order:

1. [Measure the baseline](01-measure-the-baseline.md)
2. [Pick your optimizations](02-optimization-menu.md)
3. [Prove it and explain](03-prove-and-explain.md)

## Recommended for the expression detector

- **Track C / temporal voting — stop the label flicker.** Your expression label
  probably flips between states frame to frame. Smooth the blendshape
  coefficients (EMA) or require a state to hold for a few frames before you
  switch. This is a real CV technique and it's the most visible win.
- **Track E — measure what blendshapes cost.** You turned `outputFaceBlendshapes`
  on. Measure inference latency with it on vs off — now you know what your feature
  actually costs every frame.
- **Track B — switch to the GPU delegate.** The face-mesh demo sets no
  `delegate`, so it runs on **CPU**. Adding `delegate: "GPU"` to `baseOptions` is
  likely your single biggest latency win — measure CPU vs GPU and write down both.
- **Track A — decouple detection from drawing.** Expressions don't change at 60
  Hz. Run `detectForVideo` ~15× a second and keep the overlay smooth.

Rules of engagement:

- Start a local server from the repo root; do not open the HTML directly.
- Create `lessons/2026-06-16/plan.md` before asking an agent to code.
- Create `lessons/2026-06-16/results.md` after testing. Real numbers only — do not
  let an agent invent performance numbers.
- One commit per optimization, with the measurement in the message.
- For each change you must be able to say which line it touched and why it costs
  less.

## Local server

From the repo root:

```bash
python3 -m http.server 5174
```

Then open:

```text
http://localhost:5174/mediapipe-lab/
```

## End of day deliverables

- `lessons/2026-06-16/plan.md` with predictions written before measuring.
- `lessons/2026-06-16/results.md` with Baseline and After rows.
- At least two optimizations applied and measured separately.
- The expression detector still labels at least three states.
- A 90-second demo: before number, the change, after number, the trade.
