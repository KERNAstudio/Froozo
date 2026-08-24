import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { MenuCategory } from "@/data/menu";

// Reference photos — swap for real shots of this outlet's own plates when available.
const categoryImages: Partial<Record<string, string>> = {
  pizza: "https://images.unsplash.com/photo-1672856398893-2fb52d807874?fit=max&fm=jpg&q=80&w=700",
  burger: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?fit=max&fm=jpg&q=80&w=700",
  salad: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?fit=max&fm=jpg&q=80&w=700",
  pasta: "https://images.unsplash.com/photo-1516100882582-96c3a05fe590?fit=max&fm=jpg&q=80&w=700",
  "stuffed-nanza": "https://images.unsplash.com/photo-1697155406014-04dc649b0953?fit=max&fm=jpg&q=80&w=700",
  sandwiches: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?fit=max&fm=jpg&q=80&w=700",
  wraps: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?fit=max&fm=jpg&q=80&w=700",
  "bread-buns": "https://images.unsplash.com/photo-1573140401552-3fab0b24306f?fit=max&fm=jpg&q=80&w=700",
  "fries-tornado": "https://images.unsplash.com/photo-1684815495679-f6e6bc0634ec?fit=max&fm=jpg&q=80&w=700",
  nachos: "https://images.unsplash.com/photo-1582169296194-e4d644c48063?fit=max&fm=jpg&q=80&w=700",
  momos: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?fit=max&fm=jpg&q=80&w=700",
  "kulhad-pizza": "https://images.unsplash.com/photo-1604264726154-26480e76f4e1?fit=max&fm=jpg&q=80&w=700",
  maggi: "https://images.unsplash.com/photo-1612927601601-6638404737ce?fit=max&fm=jpg&q=80&w=700",
  shakes: "https://images.unsplash.com/photo-1767114915915-4433437ac280?fit=max&fm=jpg&q=80&w=700",
  mocktails: "https://images.unsplash.com/photo-1655917080333-ab794719f842?fit=max&fm=jpg&q=80&w=700",
  beverages: "https://images.unsplash.com/photo-1683533699004-7f6b9e5a073f?fit=max&fm=jpg&q=80&w=700",
  "waffle-pancakes": "https://images.unsplash.com/photo-1562513872-634b8fae6dbe?fit=max&fm=jpg&q=80&w=700",
  "bubble-waffle": "https://images.unsplash.com/photo-1563009390-639e10013c92?fit=max&fm=jpg&q=80&w=700",
};

const WINDOW = 4; // cards rendered on either side of center
const IDLE_DELAY = 3040; // 20% faster than the strip's original 3800ms self-advance
const DRAG_CLICK_THRESHOLD = 6; // px of movement before a pointerdown counts as a drag, not a click

// Hover-to-scrub speed curve (px/ms), ramping from the dead-zone edge to
// the strip's outer edge.
const MIN_SCRUB_SPEED = 0.2;
const MAX_SCRUB_SPEED = 0.8;
const MAX_FRAME_DT = 50; // clamp so a stalled/backgrounded tab can't jump many cards at once

/** Shortest signed distance from `index` to `center` around a loop of length `n` — float-safe. */
function wrapDelta(d: number, n: number) {
  let r = d % n;
  if (r > n / 2) r -= n;
  else if (r < -n / 2) r += n;
  return r;
}

function mod(a: number, m: number) {
  return ((a % m) + m) % m;
}

export function CategoryCarousel({ categories }: { categories: MenuCategory[] }) {
  // The carousel's position is one continuous number (which index sits at
  // center, and how far past it) rather than a discrete index — every
  // per-card transform (x, depth, rotation, scale, opacity) is derived
  // straight from it, so nothing snaps mid-motion the way it would if only
  // the x-offset were continuous while depth/rotation jumped in whole steps.
  const [centerFloat, setCenterFloat] = useState(0);
  const [compact, setCompact] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [hoverActive, setHoverActive] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const idleRef = useRef<number | undefined>(undefined);
  const wheelLockRef = useRef(0);
  const dragStartXRef = useRef(0);
  const dragStartCenterRef = useRef(0);
  const draggedRef = useRef(false);
  const hoverPRef = useRef(0);
  const hoverActiveRef = useRef(false);
  const draggingRef = useRef(false);
  const centerFloatRef = useRef(0);
  const rafRef = useRef<number | undefined>(undefined);
  const navigate = useNavigate();
  const n = categories.length;

  const reducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const onResize = () => setCompact(window.innerWidth < 640);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const goTo = useCallback((index: number) => {
    const next = mod(Math.round(index), n);
    centerFloatRef.current = next;
    setCenterFloat(next);
  }, [n]);

  const resetIdle = useCallback(() => {
    window.clearTimeout(idleRef.current);
    if (reducedMotion) return;
    idleRef.current = window.setTimeout(() => {
      goTo(Math.round(centerFloatRef.current) + 1);
      resetIdle();
    }, IDLE_DELAY);
  }, [reducedMotion, goTo]);

  useEffect(() => {
    resetIdle();
    return () => window.clearTimeout(idleRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cardWidth = compact ? 160 : 220;
  const cardHeight = compact ? 210 : 290;
  const step = compact ? 92 : 132;

  // Hover-to-scrub: the strip continuously spins toward whichever side the
  // cursor rests on, speeding up toward the outer edge, and holds still
  // while the cursor sits over the center card itself (the dead zone is
  // sized to that card's own on-screen width, not an arbitrary fraction).
  useEffect(() => {
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(now - last, MAX_FRAME_DT);
      last = now;

      if (!draggingRef.current) {
        const trackWidth = trackRef.current?.clientWidth || 1;
        const deadzone = Math.min(0.85, cardWidth / trackWidth);
        const p = hoverPRef.current;
        const abs = Math.abs(p);

        if (abs > deadzone) {
          if (!hoverActiveRef.current) {
            hoverActiveRef.current = true;
            setHoverActive(true);
            window.clearTimeout(idleRef.current);
          }
          const t = Math.min(1, (abs - deadzone) / (1 - deadzone));
          const speedPx = MIN_SCRUB_SPEED + t ** 1.3 * (MAX_SCRUB_SPEED - MIN_SCRUB_SPEED);
          const next = mod(centerFloatRef.current - Math.sign(p) * (speedPx / step) * dt, n);
          centerFloatRef.current = next;
          setCenterFloat(next);
        } else if (hoverActiveRef.current) {
          hoverActiveRef.current = false;
          setHoverActive(false);
          goTo(Math.round(centerFloatRef.current));
          resetIdle();
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current!);
  }, [cardWidth, step, n, goTo, resetIdle]);

  const onTrackMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (draggingRef.current) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = e.clientX - (rect.left + rect.width / 2);
    hoverPRef.current = Math.max(-1, Math.min(1, relX / (rect.width / 2)));
  };

  const onTrackMouseLeave = () => {
    hoverPRef.current = 0;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(Math.round(centerFloat) + 1);
      resetIdle();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(Math.round(centerFloat) - 1);
      resetIdle();
    }
  };

  const onWheel = (e: React.WheelEvent) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) < 12) return;
    const now = Date.now();
    if (now - wheelLockRef.current < 260) return;
    wheelLockRef.current = now;
    goTo(Math.round(centerFloat) + (delta > 0 ? 1 : -1));
    resetIdle();
  };

  // Click-and-drag scrub: grab the strip and pull it left/right to spin
  // through cards, snapping to the nearest one on release. Purely additive
  // on top of the center position — arrows, keyboard, wheel, and card
  // clicks are untouched.
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    // Pointer capture is deliberately NOT taken here — capturing
    // immediately redirects the eventual pointerup (and the click it
    // synthesizes) to the track div instead of the card under the cursor,
    // which silently swallows plain clicks. It's only taken once the
    // pointer actually moves past the click threshold, i.e. once this is
    // confirmed to be a drag rather than a click.
    dragStartXRef.current = e.clientX;
    dragStartCenterRef.current = centerFloatRef.current;
    draggedRef.current = false;
    draggingRef.current = true;
    setDragging(true);
    window.clearTimeout(idleRef.current);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const delta = e.clientX - dragStartXRef.current;
    if (Math.abs(delta) > DRAG_CLICK_THRESHOLD && !draggedRef.current) {
      draggedRef.current = true;
      try {
        trackRef.current?.setPointerCapture(e.pointerId);
      } catch {
        // No active pointer to capture (e.g. a synthetic/untrusted event) —
        // dragging still works via document-level move/up, just without
        // capture continuing the drag past the element's own bounds.
      }
    }
    const next = mod(dragStartCenterRef.current - delta / step, n);
    centerFloatRef.current = next;
    setCenterFloat(next);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    if (draggedRef.current) {
      try {
        trackRef.current?.releasePointerCapture(e.pointerId);
      } catch {
        // Capture was never established — nothing to release.
      }
    }
    draggingRef.current = false;
    setDragging(false);
    goTo(Math.round(centerFloatRef.current));
    resetIdle();
  };

  const noTransition = dragging || hoverActive;

  return (
    <div className="mt-12 px-5">
      <div
        className="filmstrip mx-auto max-w-5xl"
        role="listbox"
        aria-label="Menu categories"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onWheel={onWheel}
        onPointerEnter={() => window.clearTimeout(idleRef.current)}
        onPointerLeave={(e) => {
          if (dragging) {
            endDrag(e);
          } else {
            onTrackMouseLeave();
          }
        }}
      >
        <div
          ref={trackRef}
          className="filmstrip__track mx-auto"
          style={{ height: cardHeight + 16, touchAction: "pan-y", cursor: dragging ? "grabbing" : "grab" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onMouseMove={onTrackMouseMove}
        >
          {categories.map((c, i) => {
            const offset = wrapDelta(i - centerFloat, n);
            if (Math.abs(offset) > WINDOW) return null;
            const abs = Math.abs(offset);
            const isCenter = Math.round(offset) === 0;
            const img = categoryImages[c.id];
            const scale = Math.max(0.55, 1 - abs * 0.14);
            const opacity = Math.max(0.12, 1 - abs * 0.24);
            const translateZ = -abs * 90;
            const rotateY = Math.max(-55, Math.min(55, -offset * 18));
            const translateX = offset * step - cardWidth / 2;

            return (
              <button
                key={c.id}
                type="button"
                role="option"
                aria-selected={isCenter}
                aria-label={c.title}
                className="filmstrip__card"
                style={{
                  width: cardWidth,
                  height: cardHeight,
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${reducedMotion ? 0 : rotateY}deg) scale(${scale})`,
                  opacity,
                  zIndex: 100 - Math.round(abs),
                  pointerEvents: abs > WINDOW - 1 ? "none" : "auto",
                  transition: noTransition ? "none" : undefined,
                }}
                onClick={() => {
                  if (draggedRef.current) {
                    draggedRef.current = false;
                    return;
                  }
                  resetIdle();
                  navigate({ to: "/menu", hash: c.id });
                }}
              >
                {img ? (
                  <img src={img} alt="" loading="lazy" className="filmstrip__img" draggable={false} />
                ) : (
                  <div
                    className="h-full w-full"
                    style={{
                      background:
                        i % 2 === 0
                          ? "linear-gradient(150deg, var(--teal) 0%, var(--char) 80%)"
                          : "linear-gradient(150deg, var(--brass) 0%, var(--char) 80%)",
                    }}
                  />
                )}
                <div className="filmstrip__footer">
                  <span className="filmstrip__badge">{String(i + 1).padStart(2, "0")}</span>
                  <span className="filmstrip__title">{c.title}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          aria-label="Previous category"
          onClick={() => {
            goTo(Math.round(centerFloat) - 1);
            resetIdle();
          }}
          className="rounded-sm border border-cream/20 p-3 text-cream/70 hover:border-brass hover:text-brass"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          aria-label="Next category"
          onClick={() => {
            goTo(Math.round(centerFloat) + 1);
            resetIdle();
          }}
          className="rounded-sm border border-cream/20 p-3 text-cream/70 hover:border-brass hover:text-brass"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  );
}
