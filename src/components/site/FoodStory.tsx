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
 * `frameStart` is the first sprite-sheet frame that shows this ingredient
 * placed — keeps the caption locked to what's actually on screen instead of
 * dividing the scroll track into equal, frame-blind slices.
 */
const beats = [
  {
    ingredient: "Bottom Bun",
    frameStart: 0,
    label: "Froozo Cafe · Madhavadhara, Visakhapatnam",
    title: "Made live.\nMade yours.",
    body: "Toasted on the flat top first — the base every build starts from.",
  },
  {
    ingredient: "Sauce",
    frameStart: 9,
    label: "Sauce",
    title: "A base coat\nof flavour.",
    body: "House sauce, so every bite after this is already seasoned.",
  },
  {
    ingredient: "Patty",
    frameStart: 18,
    label: "Patty",
    title: "The kitchen\nis the show.",
    body: "Hits the flat top the moment you order. You hear it before you see it.",
  },
  {
    ingredient: "Cheese",
    frameStart: 27,
    label: "Cheese",
    title: "Melted in,\nnot microwaved.",
    body: "Goes on while the patty's still hot enough to melt it properly.",
  },
  {
    ingredient: "Tomato + Onion",
    frameStart: 36,
    label: "Tomato + Onion",
    title: "Say it\nmid-cook.",
    body: "Sliced fresh, added right before it reaches you — sweeter, spicier, your call.",
  },
  {
    ingredient: "Lettuce",
    frameStart: 45,
    label: "Lettuce",
    title: "Torn to\norder.",
    body: "Never sitting pre-cut in a tray going soft.",
  },
  {
    ingredient: "Top Bun",
    frameStart: 54,
    label: "Top Bun",
    title: "Built exactly\nhow you like it.",
    body: "Closed up and handed over, off a counter you watched the whole time.",
  },
];

function stageForFrame(frame: number) {
  let s = 0;
  for (let i = 0; i < beats.length; i++) if (frame >= beats[i]!.frameStart) s = i;
  return s;
}

function Switcher({ active, onPick }: { active: FoodConfig; onPick: (f: FoodConfig) => void }) {
  return (
    <div className="flex flex-wrap gap-2 px-5 pt-6 md:px-12">
      {foodConfigs.map((f) => (
        <button
          key={f.id}
          type="button"
          disabled={!f.sprite}
          onClick={() => f.sprite && onPick(f)}
          className={`rounded-sm border px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] transition-colors ${
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

function VisualPane({
  dish,
  progress,
  reduced,
  className = "",
}: {
  dish: FoodConfig;
  progress: React.MutableRefObject<number>;
  reduced: boolean;
  className?: string;
}) {
  return (
    <div className={`relative w-full ${className}`}>
      {dish.sprite && <SpriteScrubber sheet={dish.sprite} progress={progress} reduced={reduced} />}
    </div>
  );
}

const AMBIENT_BG = "radial-gradient(60% 60% at 50% 45%, #1f4b47 0%, #171412 72%)";

export function FoodStory() {
  const [dish, setDish] = useState<FoodConfig>(featuredFood);
  const wrapRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const lastFrame = dish.sprite?.lastFrame ?? 1;
    const onScroll = () => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -rect.top / Math.max(1, total)));
      progress.current = p;
      setStep(stageForFrame(Math.round(p * lastFrame)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced, dish]);

  const beat = beats[step]!;

  return (
    <div className="bg-char">
      <Switcher active={dish} onPick={setDish} />

      {/* One pinned, scroll-scrubbed pane at every breakpoint: video stacked over text on
          phones, side by side from md up. Same interaction everywhere, not a separate
          mobile fallback. */}
      <div ref={wrapRef} className="relative" style={{ height: `${beats.length * 100}vh` }}>
        <div
          className="sticky top-[61px] grid h-[calc(100vh-61px)] grid-rows-[minmax(0,1fr)_auto] gap-4 overflow-hidden px-5 py-6 md:grid-cols-[26rem_1fr] md:grid-rows-1 md:items-center md:gap-10 md:px-8 md:py-0 lg:grid-cols-[30rem_1fr] lg:px-16"
          style={{ background: AMBIENT_BG }}
        >
          <VisualPane
            dish={dish}
            progress={progress}
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
      <h2 className="mt-4 whitespace-pre-line font-display text-5xl leading-[0.9] text-cream lg:text-6xl">
        {beat.title}
      </h2>
      <p className="mt-5 text-base text-cream/70 lg:text-lg">{beat.body}</p>
      <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-brass">
        {String(step + 1).padStart(2, "0")} / 0{beats.length}
      </p>
    </div>
  );
}
