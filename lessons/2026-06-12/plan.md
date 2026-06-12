# Project Plan

Date: June 12, 2026

## 1. Which project am I choosing?

Track 2: Facial Expression Detector — use the face mesh demo to detect expressions from MediaPipe blendshapes.

## 2. Which file or files in `mediapipe-lab/` will change?

`mediapipe-lab/sims/face-mesh/index.js` — enabled `outputFaceBlendshapes: true` and added `detectExpressionFromBlendshapes()`.
`mediapipe-lab/sims/face-mesh/index.html` — added `<span id="expression-label">` in the stats bar.

## 3. What is the smallest version that would count as working?

Detect 3+ visible states from blendshape coefficients with no calibration required.

## 4. How will I test it?

Open `localhost:5174/mediapipe-lab/sims/face-mesh/`, enable camera, make expressions and verify the label in the stats bar.

## 5. What should I avoid adding?

No landmark math, no data collector, no calibration — blendshapes handle all of that.

## Method

I used 8 existing blendshapes from MediaPipe's 52 blendshape stockpile to detect 4 facial expressions:

| Expression | Blendshapes | Threshold |
|------------|------------|-----------|
| Mouth Open | `jawOpen` | > 0.5 |
| Smile | `mouthSmileLeft`, `mouthSmileRight` | > 0.4 (avg) |
| Brows Up | `browInnerUp` | > 0.4 |
| Squint | `eyeSquintLeft`, `eyeSquintRight` | > 0.4 (avg) |

Smile also guards against frown with `mouthFrownLeft + mouthFrownRight < 0.15`.
Shows "uncertain" when no threshold is met.
