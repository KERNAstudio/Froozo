#!/usr/bin/env node
/**
 * Regenerates src/assets/burger-sprite.webp — the chroma-keyed, transparent
 * sprite sheet the hero's SpriteScrubber scrubs through on scroll.
 *
 * Run with:  npm run generate:sprite
 *
 * ─────────────────────────────────────────────────────────────────────────
 * WHERE THE SOURCE CAME FROM
 * ─────────────────────────────────────────────────────────────────────────
 * source/burger-blue-screen.mp4 is an 8s, 1280x720, 24fps AI-generated
 * product shot of a burger assembling on a solid blue background, used
 * specifically because it can be chroma-keyed. Swapping in a different clip
 * is fine, but read "IF YOU SWAP THE SOURCE CLIP" at the bottom first — the
 * key color and the frame timing in FoodStory.tsx are both tuned to *this*
 * footage, not to chroma-keyed video in general.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THE FILTER CHAIN, AND WHY EACH PIECE IS THERE
 * ─────────────────────────────────────────────────────────────────────────
 * fps=9
 *   Downsamples 24fps → 9fps before anything else, so every later filter
 *   (chromakey, despill, scale) runs on 72 frames instead of 192. 72 = 9
 *   cols × 8 rows, which is what makes the tile grid below come out even.
 *
 * chromakey=0x1055A6:0.14:0.05
 *   0x1055A6  — the backdrop's blue, sampled directly from this clip.
 *   0.14      — similarity. The backdrop has a top-to-bottom brightness
 *               gradient but a consistent hue, which is exactly what
 *               chromakey (works in chroma space) handles and colorkey
 *               (plain RGB distance) does not — use chromakey, not colorkey,
 *               if you regenerate this by hand.
 *               DO NOT raise this past ~0.16: past that it starts keying out
 *               the purple onion rings, which sit close to the key color.
 *   0.05      — blend (soft-edge width). Higher than the original 0.03 —
 *               widened specifically to reduce color fringing on complex
 *               edges (lettuce ruffles, onion rings) without touching
 *               similarity.
 *
 * despill=type=blue:mix=0.6:expand=0.35
 *   Neutralizes leftover blue cast on partially-keyed edge pixels. Pushed
 *   up from the original mix=0.5/expand=0.3. Diminishing returns past this —
 *   a test at mix=0.85/expand=0.55 barely moved the measured tint (see
 *   "KNOWN LIMITATION" below), so there's no value grinding this higher.
 *
 * crop=720:720:284:0
 *   Squares the 1280x720 frame to 720x720 and, as a side effect, crops out
 *   the AI generator's watermark that sat in the bottom-right corner.
 *
 * scale=480:480
 *   Downscales after keying/despill, not before — scaling first would still
 *   be safe here since chromakey/despill are per-pixel, but keep this order
 *   if you ever insert a step that reads alpha, since scaling premultiplied
 *   alpha content with a naive filter can smear color from semi-transparent
 *   edge pixels into their neighbors.
 *
 * tile=9x8
 *   Arranges the 72 frames into one 9-column × 8-row sheet (4320×3840 at
 *   this scale). SpriteScrubber reads cols/rows/lastFrame from
 *   src/components/site/food/foodConfigs.ts — if you change this grid, that
 *   config needs to match (cols: 9, rows: 8, lastFrame: 71).
 *
 * ─────────────────────────────────────────────────────────────────────────
 * WHAT THIS SCRIPT DOESN'T FIX — HANDLED IN CODE INSTEAD
 * ─────────────────────────────────────────────────────────────────────────
 * There's a persistent faint reflection in the footage's floor area that no
 * amount of despill/blend tuning fully removes (confirmed: pushing despill
 * much harder barely changed the measured tint — it's motion-blur-blended
 * background+object color, which isn't separable by chroma keying at all).
 * Rather than chase that per-pixel in ffmpeg, SpriteScrubber.tsx applies a
 * soft gradient fade to just the bottom ~18% of every drawn frame in
 * canvas — cheap, frame-independent, and it reads as the product floating
 * rather than being cropped.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * IF YOU SWAP THE SOURCE CLIP
 * ─────────────────────────────────────────────────────────────────────────
 * The `settledFrame` values in FoodStory.tsx's `beats` array (which frame
 * each of the 7 story steps displays) were re-measured by hand against
 * *this* clip's actual timing — don't assume a new clip lines up with them.
 * Re-derive them by rendering the sheet, then for each candidate frame
 * check both:
 *   1. Content — is the right ingredient (and only that ingredient) in
 *      frame? Cheese/tomato/etc. often have a 1-2 frame lead-in sliver
 *      before they're "really" there.
 *   2. Tint — draw the frame to a canvas and scan for blue-tinted pixels
 *      (a > 10 && b > r+15 && b > g+15) to catch motion-blur residue on
 *      moving ingredients, which isn't visible in a casual look at the
 *      sprite sheet image.
 */
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import ffmpegPath from "ffmpeg-static";

const dir = path.dirname(fileURLToPath(import.meta.url));
const source = path.join(dir, "source/burger-blue-screen.mp4");
const output = path.join(dir, "../../src/assets/burger-sprite.webp");

const filters = [
  "fps=9",
  "chromakey=0x1055A6:0.14:0.05",
  "despill=type=blue:mix=0.6:expand=0.35",
  "crop=720:720:284:0",
  "scale=480:480",
  "tile=9x8",
].join(",");

execFileSync(
  ffmpegPath,
  ["-y", "-i", source, "-vf", filters, "-pix_fmt", "yuva420p", "-frames:v", "1", "-quality", "92", output],
  { stdio: "inherit" },
);

console.log(`\nWrote ${path.relative(process.cwd(), output)}`);
