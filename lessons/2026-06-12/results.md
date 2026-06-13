# Machine Benchmark Results

Date: June 12, 2026
Browser: Opera (non-GX)
Machine: Optiplex 7040 (Windows)

| Demo | Browser | Model Loaded | Camera Opened | FPS after 10 sec | Notes |
| --- | --- | --- | --- | --- | --- |
| Pose Estimation | Opera | Pass | Pass | 15 | Webcam restrains FPS |
| Face Mesh | Opera | Pass | Pass | 15 | Webcam restrains FPS |
| Gesture Recognition | Opera | Pass | Pass | 16 | Webcam restrains FPS |

Overlay stability: Smooth across all three demos.

---

```
================================================================================
                    MEDIAPIPE MACHINE CHECK — SCORE SHEET
================================================================================

+---------------------------+------------------+------------------+------------------+
|                           | Pose Estimation  |   Face Mesh      |Gesture Recognition|
+---------------------------+------------------+------------------+------------------+
| 1. Model Load (pass/fail) |     Y             |       Y           |      Y            |
+---------------------------+------------------+------------------+------------------+
| 2. Camera Permission      |         P      |       P         |    P           |
|    (pass/fail)            |                  |                  |                  |
+---------------------------+------------------+------------------+------------------+
| 3. Overlay Stability      |             S   |     S            |     S             |
|    (smooth/laggy/unusable)|                  |                  |                  |
+---------------------------+------------------+------------------+------------------+
| 4. FPS after 10 sec       |               15   |        15          |   16               |
+---------------------------+------------------+------------------+------------------+
| 5. Browser & Machine Notes|Works on Opera-Webcam restrains FPS| Works on Opera-Webcam restrains FPS  Works on Opera-Webcam restrains FPS
+---------------------------+------------------+------------------+------------------+

Browser: _______Opera (non-GX)_____________     Machine: ___(Optiplex 7040-Windows)_________________     Date: ___6/12/26_______
```

---

## What did I change, and how do I know it works?

I changed the face mesh tool to detect emotions using user calibrated face detection values that take the user's face's landmarks and subtract the baseline from the blendshapes in each frame, which is how the logic detects deviations in frames. By testing my face in the detector by showing different emotions, I found that the detector worked after calibration and detects four emotions fairly accurately.
