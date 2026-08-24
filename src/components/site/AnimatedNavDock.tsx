import { useEffect, useRef } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { House, UtensilsCrossed, Images, MapPinned } from "lucide-react";
import { createNavDockController, type NavDockOptions } from "./navDockController";

/**
 * Adapted from ThreeUI's AnimatedTopDock reference: spring-physics pointer
 * proximity, keyboard-focus mirroring and a static fallback on touch/narrow/
 * reduced-motion. Wired to real routes (active state follows the current
 * page) instead of the reference's local click state.
 */
const DOCK_OPTIONS: NavDockOptions = {
  proximity: 90,
  spring: 0.19,
  damping: 0.7,
  widthGrowth: 14,
  heightGrowth: 8,
  drop: 2,
};

const links = [
  { to: "/", label: "Home", icon: House },
  { to: "/menu", label: "Menu", icon: UtensilsCrossed },
  { to: "/gallery", label: "Gallery", icon: Images },
  { to: "/location", label: "Location", icon: MapPinned },
] as const;

export function AnimatedNavDock() {
  const rootRef = useRef<HTMLElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    return createNavDockController(root, () => DOCK_OPTIONS);
  }, []);

  return (
    <nav
      ref={rootRef}
      // Horizontal-scroll safety net, mobile-only (`max-md:`): the
      // hover-grow spring effect never runs below md (see
      // navDockController's canAnimate), so it's safe to make overflow-x
      // non-visible there. It must stay untouched at md+ — setting only
      // overflow-x to a non-visible value forces the browser to also
      // compute overflow-y as non-visible (per the CSS overflow spec), which
      // would clip the desktop hover-grow effect (items popping taller than
      // the pill) if this applied unconditionally.
      className="nav-dock max-md:no-scrollbar max-md:min-w-0 max-md:overflow-x-auto max-md:overflow-y-auto"
      aria-label="Primary"
      data-dock-state="idle"
    >
      {links.map((l) => {
        const isActive = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
        const Icon = l.icon;
        return (
          <Link key={l.to} to={l.to} className="nav-dock__item" data-dock-item aria-pressed={isActive}>
            <Icon className="nav-dock__icon" aria-hidden />
            <span>{l.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
