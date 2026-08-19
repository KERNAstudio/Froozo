import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { outlet } from "@/data/menu";

const links = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/gallery", label: "Gallery" },
  { to: "/location", label: "Location" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-cream/15 bg-char/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
        <Link to="/" className="group flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-full bg-teal text-cream">
            <span className="size-2.5 rounded-full bg-brass" />
          </span>
          <span className="leading-none">
            <span className="block font-display text-xl font-extrabold text-cream">
              FROOZO
            </span>
            <span className="ticket-label block text-brass">Madhavadhara</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "bg-cream/10 text-brass" }}
              className="rounded-sm px-3 py-2 font-mono text-xs uppercase tracking-[0.18em] text-cream/75 transition-colors hover:text-brass"
            >
              {l.label}
            </Link>
          ))}
          <a
            href={outlet.zomato}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-3 rounded-sm bg-red px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-cream transition-transform hover:-translate-y-0.5"
          >
            Order now
          </a>
        </nav>

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
              className="block border-b border-cream/10 py-3 font-display text-2xl text-cream"
            >
              {l.label}
            </Link>
          ))}
          <a
            href={outlet.zomato}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 block rounded-sm bg-red px-4 py-3 text-center font-mono text-xs uppercase tracking-[0.18em] text-cream"
          >
            Order now
          </a>
        </nav>
      )}
    </header>
  );
}
