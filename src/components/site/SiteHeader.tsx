import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { outlet } from "@/data/menu";
import froozoMark from "@/assets/froozo-mark.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/gallery", label: "Gallery" },
  { to: "/location", label: "Location" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          transparent ? "bg-transparent" : "border-b border-cream/15 bg-char/95 backdrop-blur-sm"
        }`}
      >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-6 px-5 md:px-10">
        <Link to="/" className="flex flex-col items-start gap-1 text-cream">
          <img src={froozoMark} alt="" className="h-9 w-auto" />
          <span className="font-display text-xl font-black uppercase tracking-[0.08em]">Froozo</span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {links.map((l) => {
            const isActive = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`flex flex-col items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] transition-colors ${
                  isActive ? "text-red" : "text-cream/85 hover:text-brass"
                }`}
              >
                {l.label}
                <span className={`size-1 rounded-full bg-red transition-opacity ${isActive ? "opacity-100" : "opacity-0"}`} />
              </Link>
            );
          })}
        </nav>

        <a
          href={outlet.zomato}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-2 rounded-full border border-cream/50 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-cream transition-all hover:border-red active:scale-95 md:inline-flex"
        >
          Order now
          <ArrowRight className="size-3.5 text-red" />
        </a>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
          className="rounded-sm border border-cream/25 p-2 text-cream md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-cream/15 bg-char px-5 pb-5 md:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block border-b border-cream/10 py-3 text-xl font-extrabold uppercase tracking-wide text-cream"
            >
              {l.label}
            </Link>
          ))}
          <a
            href={outlet.zomato}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 rounded-full border border-cream/50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-cream"
          >
            Order now
            <ArrowRight className="size-3.5 text-red" />
          </a>
        </nav>
      )}
      </header>
    </>
  );
}
