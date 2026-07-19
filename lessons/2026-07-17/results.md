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
| 1 | 167 | 48.8 | 55.3 | 11.4 | 22.6 | 14.6s |
| 2 | 169 | 50.3 | 58.6 | 11.0 | 22.6 | 15.3s |
| 3 | 175 | 48.1 | 53.5 | 11.6 | 22.6 | 15.1s |
| 4 | 168 | 46.6 | 50.6 | 11.9 | 22.6 | 14.1s |
| 5 | 195 | 46.5 | 50.8 | 11.6 | 22.6 | 16.9s |

## Benchmark summary

- Median latency across all recorded samples: 48.06ms
- p95 latency across all recorded samples:  53.8 ms
- Effective inference FPS across all runs:  11.5
- Foreground-coverage range: 22.6%
- What happened during the naive every-frame loop, before my mechanism: With the guard disabled, 395 inferences completed in 37.6s at 10.5 FPS. Foreground coverage = 0% — overlapping calls corrupted the mask. Without the isProcessing gate, multiple segmentForVideo calls ran concurrently, causing mask data loss. Skipped frames = 0 (no guard to skip anything).
- Were any inference calls overlapping? How did I verify this?
Yes, because without the guard, segmentForVideo runs on every requestAnimationFrame without waiting, and skipped frames = 0 confirms nothing was blocked. The 0% coverage proves the mask data was corrupted by concurrent access.

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

