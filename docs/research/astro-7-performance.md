# Astro 7 upgrade performance

Benchmarked on 2026-08-25 at commit `b20b52d`.

## Method

- Host: Apple M2, 16 GiB RAM, macOS 15.6 (`Darwin 24.6.0`, arm64)
- Runtime: Bun 1.4.0, Node.js 26.7.0
- Five runs per benchmark
- Full build: `bun run build`, including Astro and `scripts/generate-markdown.mjs`
- Cold build: remove `dist`, `.astro`, `node_modules/.astro`, and `node_modules/.vite` before every run
- Warm build: preserve Astro and Vite caches between runs
- Astro-only memory: `/usr/bin/time -lp ./node_modules/.bin/astro build` with warm caches. This bypasses Bun's subprocess runner so peak RSS covers the Astro process.
- Compare medians because build times vary with host load and Google font downloads.

## Before upgrade

Dependencies: Astro 6.4.8 and TypeScript 6.0.3.

### Full build wall time

| Run | Cold | Warm |
| ---: | ---: | ---: |
| 1 | 6.37 s | 2.06 s |
| 2 | 4.53 s | 1.69 s |
| 3 | 5.11 s | 1.76 s |
| 4 | 4.04 s | 1.61 s |
| 5 | 4.07 s | 1.61 s |
| **Median** | **4.53 s** | **1.69 s** |

Astro's internal timer reported 30 pages built in 1.10 s on warm run 5.

### Astro-only warm build

| Run | Wall time | Peak RSS |
| ---: | ---: | ---: |
| 1 | 1.87 s | 448.3 MiB |
| 2 | 1.55 s | 450.3 MiB |
| 3 | 1.58 s | 457.4 MiB |
| 4 | 1.72 s | 428.2 MiB |
| 5 | 1.78 s | 453.1 MiB |
| **Median** | **1.72 s** | **450.3 MiB** |

### Build output

| Metric | Value |
| --- | ---: |
| Files | 239 |
| Logical bytes | 8,037,470 |
| HTML bytes | 819,079 |
| CSS bytes | 71,370 |
| JavaScript bytes | 2,176 |
| Allocated disk size | 9.2 MiB |

## After upgrade

Dependencies: Astro 7.2.6 and TypeScript 6.0.3.

### Full build wall time

| Run | Cold | Warm |
| ---: | ---: | ---: |
| 1 | 4.00 s | 1.34 s |
| 2 | 3.46 s | 1.34 s |
| 3 | 3.69 s | 1.39 s |
| 4 | 3.57 s | 1.29 s |
| 5 | 3.55 s | 1.27 s |
| **Median** | **3.57 s** | **1.34 s** |

Astro's internal timer reported 30 pages built in 717 ms on warm run 5.

### Astro-only warm build

| Run | Wall time | Peak RSS |
| ---: | ---: | ---: |
| 1 | 1.29 s | 435.6 MiB |
| 2 | 1.33 s | 435.3 MiB |
| 3 | 1.62 s | 401.5 MiB |
| 4 | 1.48 s | 418.5 MiB |
| 5 | 1.42 s | 436.2 MiB |
| **Median** | **1.42 s** | **435.3 MiB** |

### Build output

| Metric | Value |
| --- | ---: |
| Files | 228 |
| Logical bytes | 6,968,299 |
| HTML bytes | 811,283 |
| CSS bytes | 71,247 |
| JavaScript bytes | 2,176 |
| Allocated disk size | 8.2 MiB |

Astro 7 no longer emits 11 unused original image files alongside their optimized variants. A check of all 30 generated HTML pages found no missing `/_astro/` references.

## Comparison

| Metric | Astro 6.4.8 | Astro 7.2.6 | Change |
| --- | ---: | ---: | ---: |
| Median cold full build | 4.53 s | 3.57 s | **21.2% faster** |
| Median warm full build | 1.69 s | 1.34 s | **20.7% faster** |
| Median warm Astro build | 1.72 s | 1.42 s | **17.4% faster** |
| Median peak RSS | 450.3 MiB | 435.3 MiB | **3.3% lower** |
| Logical output size | 8,037,470 B | 6,968,299 B | **13.3% smaller** |
| Output files | 239 | 228 | **11 fewer** |
