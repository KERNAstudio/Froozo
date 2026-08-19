import { useEffect, useRef } from "react";
import type { SpriteSheet } from "./food/foodConfigs";

export function SpriteScrubber({
  sheet,
  progress,
  reduced,
}: {
  sheet: SpriteSheet;
  progress: React.MutableRefObject<number>;
  reduced: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let lastFrame = -1;
    let ready = false;
    let disposed = false;

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
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!ready) return;
      const p = Math.min(1, Math.max(0, progress.current));
      const frame = Math.min(sheet.lastFrame, Math.max(0, Math.round(p * sheet.lastFrame)));
      if (frame !== lastFrame) {
        lastFrame = frame;
        draw(frame);
      }
    };

    const onResize = () => {
      if (!ready) return;
      draw(lastFrame < 0 ? 0 : lastFrame);
    };

    img.onload = () => {
      if (disposed) return;
      ready = true;
      if (reduced) {
        lastFrame = sheet.lastFrame;
        draw(sheet.lastFrame);
      } else {
        raf = requestAnimationFrame(tick);
      }
    };
    img.src = sheet.src;

    window.addEventListener("resize", onResize);
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [sheet, reduced, progress]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}
