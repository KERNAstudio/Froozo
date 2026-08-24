import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { outlet } from "@/data/menu";
import froozoMark from "@/assets/froozo-mark.png";
import { AnimatedNavDock } from "./AnimatedNavDock";

export function SiteHeader() {
  const [solid, setSolid] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fully transparent only at the top of the hero, where the photo sits
  // behind it — everywhere else (scrolled, or any other page) there's real
  // content behind the header's gaps, so it needs its own backing or that
  // content bleeds through as you scroll.
  const transparent = pathname === "/" && !solid;

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-brass focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:uppercase focus:tracking-[0.18em] focus:text-char"
      >
        Skip to content
      </a>
      <header
        className={`sticky top-0 z-50 h-24 transition-colors duration-500 md:h-28 ${
          transparent ? "bg-transparent" : "header-glass"
        }`}
      >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-2 px-3 md:gap-6 md:px-10">
        <Link to="/" className="flex shrink-0 flex-col items-start gap-1 text-cream">
          <img src={froozoMark} alt="" className="h-6 w-auto sm:h-7 md:h-9" />
          <span className="font-display text-base font-black uppercase tracking-[0.08em] sm:text-lg md:text-xl">
            Froozo
          </span>
        </Link>

        <AnimatedNavDock />

        <a
          href={outlet.zomato}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-2 rounded-full border border-cream/50 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-cream transition-all hover:border-red active:scale-95 md:inline-flex"
        >
          Order now
          <ArrowRight className="size-3.5 text-red" />
        </a>
      </div>
      </header>
    </>
  );
}
