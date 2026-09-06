# Project cover images

Generated on 2026-09-05 with the built-in `image_gen` tool.

The covers use a 16:10 composition with space around the title and product preview. Astro creates the responsive WebP images.

Optimized with [Squoosh](https://squoosh.app/) using WebP at quality 90. Each image keeps its original dimensions of 1586 × 992 pixels.

| Cover | Original bytes | Optimized bytes | Reduction |
| --- | ---: | ---: | ---: |
| Uppa | 969,674 | 46,364 | 95.2% |
| TypeID PHP | 1,222,633 | 80,432 | 93.4% |
| Bopop | 1,218,522 | 42,226 | 96.5% |

## uppa

Saved asset: [src/assets/projects/uppa.webp](../../src/assets/projects/uppa.webp)

Reference images:
- `src/assets/content/uppa-og-image.jpg`
- `src/assets/content/claude-meter-v2.jpg`

Final prompt:

```text
Use case: precise-object-edit.
Asset type: finished raster project cover for the jewei.net home page.
Primary request: Regenerate the Uppa cover in reference image 1 with much more empty space on its left and right, so its title and dashboard remain intact inside the website's 16:10 image frame. Reference image 2 is the adjacent Claude Meter cover and is a style reference only.
Output: one 1600 x 1000 landscape image, aspect ratio 16:10.
Composition: zoom out the complete Uppa design onto warm off-white paper. Keep ALL meaningful content inside the central 72% of the canvas width, with at least 14% clear background on EACH side. Keep top and bottom margins at least 12%. Two balanced columns: Uppa typography on the left, a compact complete uptime dashboard on the right. Keep the dashboard, all window edges, all words, and all icons comfortably away from the image edges. Preserve enough space between the two columns. Nothing bleeds off the canvas.
Style: match the quiet technical editorial look of the Claude Meter reference, black serif title, sage green details, small neutral sans-serif interface labels, soft paper background, thin rules and restrained shadows. No saturated gradients.
Text verbatim: "Uppa"; "A small uptime monitor at the edge"; "Self-hosted uptime monitoring for Cloudflare Workers."
Dashboard: preserve the meaning of reference 1 with Overall status, a green uptime sparkline, a monitor list and recent incidents. Keep this a coherent small product preview with sparse legible text. Preserve Uppa identity and the original subject. Do not add unrelated products, people, illustrations or features. Do not add an outer frame or crop marks. A finished coherent cover, not a screenshot of a webpage.
```

## typeid-php

Saved asset: [src/assets/projects/typeid-php.webp](../../src/assets/projects/typeid-php.webp)

Reference images:
- `src/assets/content/typeid-cover.jpg`
- `src/assets/content/claude-meter-v2.jpg`

Final prompt:

```text
Use case: precise-object-edit.
Asset type: finished raster project cover for the jewei.net home page.
Primary request: Regenerate the TypeID for PHP cover in reference image 1 with ample left and right margins, so the large title and the code panel stay fully visible in the website's 16:10 image frame. Reference image 2 is an adjacent Claude Meter cover and is a style reference only.
Output: one 1600 x 1000 landscape image, aspect ratio 16:10.
Composition: zoom out the complete original design onto warm off-white paper. ALL meaningful content must fit inside the central 72% of the canvas width, leaving at least 14% empty background on EACH side and at least 12% above and below. Left column: a small green "INTRODUCING" label, a black serif title on two lines "TypeID" and "for PHP", a fine green rule and the description. Right column: a compact complete white code window with three small muted green window dots. Scale the entire group down enough for generous margins and a clear gap between the columns. No cropped letters, no panel or content touching an image edge.
Style: refined technical editorial design matching the supplied Claude Meter image. Warm off-white background, black serif title, sage green accent and restrained syntax colors. Very faint contour lines and tiny plus signs may remain as in reference 1, but avoid visual clutter.
Text verbatim: "INTRODUCING"; "TypeID"; "for PHP"; "Type-safe identifiers"; "for modern PHP applications"; "jewei.net".
Code panel text verbatim, maintain proper punctuation:
use Jewei\TypeID\TypeID;

final class UserId extends TypeID {}
final class OrderId extends TypeID {}

$userId = UserId::generate();
$orderId = OrderId::generate();
Constraints: preserve the TypeID PHP identity and meaning. Render accurate, legible code rather than decorative random characters. No added products, plants, people or outer frame. This is a finished project cover, not a webpage screenshot.
```

## bopop

Saved asset: [src/assets/projects/bopop.webp](../../src/assets/projects/bopop.webp)

Reference images:
- `src/assets/content/bopop-launcher.jpg`
- `src/assets/content/claude-meter-v2.jpg`

Final prompt:

```text
Use case: compositing.
Asset type: finished raster project cover for the jewei.net home page.
Primary request: Make a polished Bopop cover that belongs beside the Claude Meter cover. Reference image 1 is the real Bopop launcher interface, used for product content and interface details. Reference image 2 defines the desired editorial style, paper color, restrained green accents and typography.
Output: one 1600 x 1000 landscape image, aspect ratio 16:10.
Composition: generous warm off-white paper surrounds a balanced two-column composition. All meaningful content stays inside the central 72% of the canvas width, with at least 14% clear space on EACH side and at least 12% at the top and bottom. Left: large black serif title "Bopop", a smaller sage serif subtitle "Press, type, go.", a fine short green rule, and the description "A keyboard-first launcher for macOS." Small understated labels "Swift", "macOS", and "Open source" can sit below. Right: a complete compact Bopop launcher window, based on reference 1, floating on the same paper backdrop. The dark charcoal UI should have a search field, a subdued purple selected result, filters and three readable result rows "Finder", "Safari", "Ghostty", with recognizable app icons. Preserve the actual launcher character and hierarchy. Omit the portrait thumbnail and long filesystem paths to keep the small preview clear. Do not add capabilities that the source app does not show.
Style: quiet technical editorial cover, matching the adjacent Claude Meter composition and pale warm paper. Restrained shadow around the small launcher window. Crisp black serif title, neutral sans-serif support text. The dark UI is contained in a modest preview on the right, not used as the whole background.
Constraints: every title letter and every window edge must fit with spare space. No teal desktop wallpaper, neon glow, saturated background gradients, large decorative illustrations, external mockup frames, crop marks or watermark. One coherent finished project cover.
```
