import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { MenuCategory } from "@/data/menu";

// Reference photos — swap for real shots of this outlet's own plates when available.
const categoryImages: Partial<Record<string, string>> = {
  pizza: "https://images.unsplash.com/photo-1672856398893-2fb52d807874?fit=max&fm=jpg&q=80&w=700",
  burger: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?fit=max&fm=jpg&q=80&w=700",
  "stuffed-nanza": "https://images.unsplash.com/photo-1697155406014-04dc649b0953?fit=max&fm=jpg&q=80&w=700",
  momos: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?fit=max&fm=jpg&q=80&w=700",
  "kulhad-pizza": "https://images.unsplash.com/photo-1604264726154-26480e76f4e1?fit=max&fm=jpg&q=80&w=700",
  shakes: "https://images.unsplash.com/photo-1767114915915-4433437ac280?fit=max&fm=jpg&q=80&w=700",
  mocktails: "https://images.unsplash.com/photo-1655917080333-ab794719f842?fit=max&fm=jpg&q=80&w=700",
  beverages: "https://images.unsplash.com/photo-1683533699004-7f6b9e5a073f?fit=max&fm=jpg&q=80&w=700",
  "waffle-pancakes": "https://images.unsplash.com/photo-1562513872-634b8fae6dbe?fit=max&fm=jpg&q=80&w=700",
  "bubble-waffle": "https://images.unsplash.com/photo-1563009390-639e10013c92?fit=max&fm=jpg&q=80&w=700",
};

function Card({ c, i }: { c: MenuCategory; i: number }) {
  const img = categoryImages[c.id];
  return (
    <Link
      to="/menu"
      hash={c.id}
      className="group relative flex h-72 w-64 shrink-0 flex-col justify-end overflow-hidden border border-cream/15 p-6"
      style={
        img
          ? undefined
          : {
              background:
                i % 2 === 0
                  ? "linear-gradient(150deg, #1F4B47 0%, #171412 80%)"
                  : "linear-gradient(150deg, #C08A4E 0%, #171412 80%)",
            }
      }
    >
      {img && (
        <>
          <img
            src={img}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-char/90 via-char/20 to-char/0" />
        </>
      )}
      <span className="absolute right-4 top-4 z-10 font-mono text-xs text-cream/60">
        {String(i + 1).padStart(2, "0")}
      </span>
      <span className="relative z-10 font-display text-4xl leading-none">{c.title}</span>
      {c.note && (
        <span className="relative z-10 mt-2 line-clamp-2 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-cream/70">
          {c.note}
        </span>
      )}
    </Link>
  );
}

export function CategoryCarousel({ categories }: { categories: MenuCategory[] }) {
  const [paused, setPaused] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);

  const nudge = (dir: 1 | -1) => {
    setPaused(true);
    railRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  return (
    <div className="mt-12 flex items-center gap-2 px-5">
      <button
        type="button"
        aria-label="Scroll categories left"
        onClick={() => nudge(-1)}
        className="hidden shrink-0 rounded-sm border border-cream/20 p-2 text-cream/70 hover:border-brass hover:text-brass sm:block"
      >
        <ChevronLeft className="size-4" />
      </button>
      <div
        ref={railRef}
        className="no-scrollbar overflow-x-auto pb-4"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        <div
          className="marquee flex w-max gap-5"
          style={{ animationPlayState: paused ? "paused" : "running" }}
        >
          {[categories, categories].map((set, si) => (
            <div key={si} className="flex gap-5" aria-hidden={si === 1}>
              {set.map((c, i) => (
                <Card key={`${si}-${c.id}`} c={c} i={i} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        aria-label="Scroll categories right"
        onClick={() => nudge(1)}
        className="hidden shrink-0 rounded-sm border border-cream/20 p-2 text-cream/70 hover:border-brass hover:text-brass sm:block"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
