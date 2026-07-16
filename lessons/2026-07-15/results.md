# Results — 2026-07-15

Warm up for 10 seconds. Run the same 10-second test five times before and five
times after. Do not average away a bad run.

| Stage | Run | Processed FPS | Inference latency (ms) | Export valid? | Notes |
| --- | ---: | ---: | ---: | --- | --- |
| Before | 1 | | | | |
| Before | 2 | | | | |
| Before | 3 | | | | |
| Before | 4 | | | | |
| Before | 5 | | | | |
| After | 1 | | | | |
| After | 2 | | | | |
| After | 3 | | | | |
| After | 4 | | | | |
| After | 5 | | | | |

## Summary

| Stage | Median FPS | Median latency | Min–max notes |
| --- | ---: | ---: | --- |
| Before | | | |
| After | | | |

## Proof

- JSON export before / after has the same required fields:
- Pose and hand overlays before / after:
- Which allocations stopped happening every frame?
- What got better, worse, or stayed unchanged?
- If the result was noise or slower, did you revert it?
