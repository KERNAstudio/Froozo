import { useEffect, useRef, useState } from "react";
import { SpriteScrubber } from "./SpriteScrubber";
import { foodConfigs, featuredFood, type FoodConfig } from "./food/foodConfigs";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/**
 * One entry per ingredient, in build order (bottom of the stack first).
 * `settledFrame` is the sprite-sheet frame to display for this step — picked
 * with a safety margin before the next ingredient's lead-in starts entering
 * the shot (a falling cheese corner, a sauce drop) and re-measured directly
 * off this sprite sheet's actual content, not assumed from timing.
 *
 * Scroll maps to a step by equally dividing the scroll track in sevenths
 * (see onScroll below) rather than by which content frame is on screen —
 * content-based boundaries can be just a few frames wide, and a normal fast
 * scroll or trackpad flick can jump clean over that range without the
 * listener ever seeing it, silently skipping a step.
 */
const beats = [
  {
    ingredient: "Bottom Bun",
    settledFrame: 8,
    label: "Froozo Cafe · Madhavadhara, Visakhapatnam",
    title: "Made live.\nMade yours.",
    body: "Toasted on the flat top first — the base every build starts from.",
  },
  {
    ingredient: "Sauce",
    settledFrame: 14,
    label: "Sauce",
    title: "A base coat\nof flavour.",
    body: "House sauce, so every bite after this is already seasoned.",
  },
  {
    ingredient: "Patty",
    settledFrame: 24,
    label: "Patty",
    title: "The kitchen\nis the show.",
    body: "Hits the flat top the moment you order. You hear it before you see it.",
  },
  {
    ingredient: "Cheese",
    settledFrame: 34,
    label: "Cheese",
    title: "Melted in,\nnot microwaved.",
    body: "Goes on while the patty's still hot enough to melt it properly.",
  },
  {
    ingredient: "Tomato + Onion",
    settledFrame: 47,
    label: "Tomato + Onion",
    title: "Say it\nmid-cook.",
    body: "Sliced fresh, added right before it reaches you — sweeter, spicier, your call.",
  },
  {
    ingredient: "Lettuce",
    settledFrame: 52,
    label: "Lettuce",
    title: "Torn to\norder.",
    body: "Never sitting pre-cut in a tray going soft.",
  },
  {
    ingredient: "Top Bun",
    settledFrame: 71,
    label: "Top Bun",
    title: "Built exactly\nhow you like it.",
    body: "Closed up and handed over, off a counter you watched the whole time.",
  },
];

function Switcher({ active, onPick }: { active: FoodConfig; onPick: (f: FoodConfig) => void }) {
  return (
    <div className="absolute left-0 right-0 top-0 z-10 flex flex-wrap gap-2 bg-gradient-to-b from-char/80 to-transparent px-5 py-4 md:px-8 lg:px-16">
      {foodConfigs.map((f) => (
        <button
          key={f.id}
          type="button"
          disabled={!f.sprite}
          onClick={() => f.sprite && onPick(f)}
          className={`rounded-sm border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-colors ${
            f.id === active.id
              ? "border-brass bg-brass/10 text-brass"
              : f.sprite
                ? "border-cream/25 text-cream/75 hover:border-cream/50 hover:text-cream"
                : "cursor-not-allowed border-cream/10 text-cream/30"
          }`}
        >
          {f.label}
          {!f.sprite && <span className="ml-2 text-[0.6rem]">Coming soon</span>}
        </button>
      ))}
    </div>
  );
}

function targetFrameForStep(sprite: FoodConfig["sprite"], step: number) {
  if (!sprite) return 0;
  return Math.min(sprite.lastFrame, beats[step]!.settledFrame);
}

function VisualPane({
  dish,
  targetFrame,
  reduced,
  className = "",
}: {
  dish: FoodConfig;
  targetFrame: number;
  reduced: boolean;
  className?: string;
}) {
  return (
    <div className={`relative w-full ${className}`}>
      {dish.sprite && <SpriteScrubber sheet={dish.sprite} targetFrame={targetFrame} reduced={reduced} />}
    </div>
  );
}

const AMBIENT_BG = "radial-gradient(60% 60% at 50% 45%, #1f4b47 0%, #171412 72%)";

/** How long the displayed step dwells before advancing again while catching up to scroll. */
const STEP_ADVANCE_MS = 320;

export function FoodStory() {
  const [dish, setDish] = useState<FoodConfig>(featuredFood);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const targetStepRef = useRef(0);

  useEffect(() => {
    if (reduced) return;
    const onScroll = () => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -rect.top / Math.max(1, total)));
      targetStepRef.current = Math.min(beats.length - 1, Math.floor(p * beats.length));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced]);

  // Walk the displayed step toward wherever scroll wants it, one at a time —
  // so scrolling past several steps quickly plays through each ingredient in
  // order instead of snapping straight to the destination.
  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      setStep((s) => {
        const target = targetStepRef.current;
        return s === target ? s : s + Math.sign(target - s);
      });
    }, STEP_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [reduced]);

  const beat = beats[step]!;
  const targetFrame = targetFrameForStep(dish.sprite, step);

  return (
    <div id="food" className="bg-char">
      {/* One pinned, scroll-scrubbed pane at every breakpoint: video stacked over text on
          phones, side by side from md up. Same interaction everywhere, not a separate
          mobile fallback. The switcher lives inside this pane so it stays visible for
          the whole scroll, not just the moment you arrive. */}
      <div ref={wrapRef} className="relative" style={{ height: `${beats.length * 100}vh` }}>
        <div
          className="relative sticky top-24 grid h-[calc(100dvh-6rem)] grid-rows-[minmax(0,1fr)_auto] gap-4 overflow-hidden px-5 py-6 md:top-28 md:h-[calc(100dvh-7rem)] md:grid-cols-[26rem_1fr] md:grid-rows-1 md:items-center md:gap-10 md:px-8 md:py-0 lg:grid-cols-[30rem_1fr] lg:px-16"
          style={{ background: AMBIENT_BG }}
        >
          <Switcher active={dish} onPick={setDish} />

          <VisualPane
            dish={dish}
            targetFrame={targetFrame}
            reduced={reduced}
            className="min-h-0 md:order-2 md:h-full md:max-h-[70vh]"
          />
          <div className="flex flex-col justify-center md:order-1">
            <BeatText key={step} beat={beat} step={step} />
          </div>
        </div>
      </div>
    </div>
  );
}

function BeatText({ beat, step }: { beat: (typeof beats)[number]; step: number }) {
  return (
    <div className="beat-enter max-w-sm">
      <p className="ticket-label text-sage">{beat.label}</p>
      <h2 className="script-line mt-4 whitespace-pre-line text-6xl text-cream lg:text-7xl">
        {beat.title}
      </h2>
      <p className="mt-5 text-base text-cream/70 lg:text-lg">{beat.body}</p>
      <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-brass">
        {String(step + 1).padStart(2, "0")} / 0{beats.length}
      </p>
    </div>
  );
}
