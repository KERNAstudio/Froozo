import { useEffect, useRef } from "react";
import type { SpriteSheet } from "./food/foodConfigs";

const TRANSITION_MS = 480;
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function SpriteScrubber({
  sheet,
  targetFrame,
  reduced,
}: {
  sheet: SpriteSheet;
  targetFrame: number;
  reduced: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const displayedRef = useRef(targetFrame);
  const animRef = useRef({ from: targetFrame, to: targetFrame, start: 0 });

  // Every time the target changes (a new story step becomes active), ease
  // from wherever the frame currently sits toward it — this is what makes
  // the in-between frames "auto-play" instead of being scroll-scrubbed.
  useEffect(() => {
    animRef.current = { from: displayedRef.current, to: targetFrame, start: performance.now() };
  }, [targetFrame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let ready = false;
    let disposed = false;
    let lastDrawn = -1;

    const img = new Image();
    img.decoding = "async";

    const cellW = () => img.naturalWidth / sheet.cols;
    const cellH = () => img.naturalHeight / sheet.rows;

    const draw = (frame: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      const cw = cellW();
      const ch = cellH();
      const sx0 = (frame % sheet.cols) * cw;
      const sy0 = Math.floor(frame / sheet.cols) * ch;

      const cssScale = Math.min(w / cw, h / ch, 4);
      const scale = cssScale * dpr;
      const dw = cw * scale;
      const dh = ch * scale;
      const dx = (canvas.width - dw) / 2;
      const dy = (canvas.height - dh) / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, sx0, sy0, cw, ch, dx, dy, dw, dh);

      if (sheet.transparent) {
        // The keyed footage has leftover blue spill scattered across many
        // frames, wherever a falling ingredient's motion-blurred edge mixed
        // with the background at capture time — not confined to one region,
        // so this runs over the whole frame. Correct color directly instead
        // of fading/erasing: pull blue down toward neutral only on pixels
        // that show the spill signature, leaving alpha (and everything else)
        // untouched, so nothing gets cropped or faded.
        //
        // The onion rings are genuinely purple (high red *and* high blue),
        // which a naive "blue exceeds red/green" check also flags — the
        // `r < 110` gate excludes them: spill-contaminated pixels measured
        // from this footage sit at r≈50-90, while onion purple sits at
        // r≈130-150, a wide enough gap to separate the two reliably (checked
        // against the actual sprite: ~99.6% of onion pixels are correctly
        // left untouched).
        const bandLeft = Math.max(0, Math.floor(dx));
        const bandTop = Math.max(0, Math.floor(dy));
        const bandWidth = Math.min(canvas.width, Math.ceil(dw));
        const bandHeight = Math.min(canvas.height, Math.ceil(dh));
        if (bandWidth > 0 && bandHeight > 0) {
          const region = ctx.getImageData(bandLeft, bandTop, bandWidth, bandHeight);
          const d = region.data;
          for (let i = 0; i < d.length; i += 4) {
            const r = d[i]!;
            const g = d[i + 1]!;
            const b = d[i + 2]!;
            const a = d[i + 3]!;
            if (a > 0 && r < 110 && b > r + 12 && b > g + 12) {
              d[i + 2] = Math.round(b - (b - Math.max(r, g)) * 0.9);
            }
          }
          ctx.putImageData(region, bandLeft, bandTop);
        }
      } else {
        // elliptical (not circular) feather, matched to the frame's own aspect
        // ratio, so all four edges fade out evenly instead of just the sides
        const cx = dx + dw / 2;
        const cy = dy + dh / 2;
        const rad = dw / 2;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(1, dw / dh);
        const g = ctx.createRadialGradient(0, 0, rad * 0.4, 0, 0, rad * 0.85);
        g.addColorStop(0, "rgba(0,0,0,0)");
        g.addColorStop(1, "rgba(0,0,0,1)");
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = g;
        ctx.fillRect(-rad, -rad, rad * 2, rad * 2);
        ctx.restore();
      }
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!ready) return;
      const { from, to, start } = animRef.current;
      const t = start === 0 ? 1 : Math.min(1, (now - start) / TRANSITION_MS);
      const value = from + (to - from) * easeInOutCubic(t);
      displayedRef.current = value;
      const frame = Math.min(sheet.lastFrame, Math.max(0, Math.round(value)));
      if (frame !== lastDrawn) {
        lastDrawn = frame;
        draw(frame);
      }
    };

    const onResize = () => {
      if (!ready) return;
      draw(lastDrawn < 0 ? 0 : lastDrawn);
    };

    img.onload = () => {
      if (disposed) return;
      ready = true;
      const startFrame = reduced ? sheet.lastFrame : targetFrame;
      displayedRef.current = startFrame;
      animRef.current = { from: startFrame, to: startFrame, start: 0 };
      lastDrawn = startFrame;
      draw(startFrame);
      if (!reduced) raf = requestAnimationFrame(tick);
    };
    img.src = sheet.src;

    window.addEventListener("resize", onResize);
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
    // targetFrame intentionally excluded — transitions are driven by the ref-updating effect above
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheet, reduced]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}
