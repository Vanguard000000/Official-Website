# Results — 2026-07-17

Record evidence as each checkpoint is completed. Do not invent or estimate
measurements. If something does not work, record that result and the error.

## Checkpoint evidence

| Checkpoint | Evidence | What I can explain | Commit |
| --- | --- | --- | --- |
| Runtime and model ready on CPU | | | |
| One still image segmented | | | |
| Raw mask visible | | | |
| Visual effect driven by mask | | | |
| Webcam loop stable | | | |
| Camera and resources stop cleanly | | | |

## Fixed benchmark setup

- Browser and version: Opera 133
- Machine and operating system: Optiplex 7040 Windows 10 Pro 22H2 (64-bit)
- Camera and resolution: K20 USB CAMERA, 1920x1080 ideal 60hz
- Lighting, distance, and background: close distance (11-13 in), mostly clear background, shady lighting (not dark not bright)
- Threshold: 0.50
- Visual effect enabled: color overlay + edge blur
- Warm-up completed: 15 seconds

Warm up for 10 seconds. Then run the same scene for 10 seconds five times.
Keep every run, including bad ones.

| Run | Inferences | Median latency (ms) | p95 latency (ms) | Effective inference FPS | Foreground coverage (%) | Notes |
| ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | 167 | 48.8 | 55.3 | 11.4 | -- | 14.6s |
| 2 | 169 | 50.3 | 58.6 | 11.0 | -- | 15.3s |
| 3 | 175 | 48.1 | 53.5 | 11.6 | -- | 15.1s |
| 4 | 168 | 46.6 | 50.6 | 11.9 | -- | 14.1s |
| 5 | 28 | 46.9 | 53.1 | 11.7 | -- | 2.4s |

## Benchmark summary

- Median latency across all recorded samples:
- p95 latency across all recorded samples:
- Effective inference FPS across all runs:
- Foreground-coverage range:
- What happened during the naive every-frame loop, before my mechanism:
- Were any inference calls overlapping? How did I verify this?

## Failure tests

| Test | What I changed | What happened to the mask | Latency or stability change | Pass, partial, or fail |
| --- | --- | --- | --- | --- |
| Low light | | | | |
| Fast movement | | | | |
| More than one person | | | | |
| Person partly outside the frame | | | | |
| Busy background | | | | |
| Camera permission denied | | | | |
| Camera stopped and restarted | | | | |

## Explanation

The written explanation lives in `answer.md`. Nothing here is complete until
that file is.

## Final evidence

- Module path:
- Commit hash:
- Journal completed:
- Result I would demonstrate:
- Limitation I would state during the demonstration:

