import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { FoodStory } from "@/components/site/FoodStory";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { CategoryCarousel } from "@/components/site/CategoryCarousel";
import { SealBadge } from "@/components/site/SealBadge";
import { menu } from "@/data/menu";
import { useDocumentMeta } from "@/lib/useDocumentMeta";
import heroPhoto from "@/assets/hero-bg.jpg";

/**
 * Each pinned section here (hero, food story, pick-a-lane) is a tall
 * wrapper holding a shorter `position: sticky` pane, which is what gives
 * it its "hold, then release" feel — but CSS sticky only pins for
 * `wrapperHeight - paneHeight` of scroll; for the remaining tail (one
 * pane's worth) the pane is already unstuck and drifting off while the
 * next section is simultaneously entering from below. Stopping a scroll
 * gesture inside that tail leaves both sections half-visible at once. This
 * watches for the scroll settling inside one of those tails and eases it
 * to whichever clean edge (fully this section, or fully the next) is
 * nearer, so a rest position can never land on the torn half-and-half view.
 *
 */
function useSettleStickyOverlap() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const wrapperIds = ["hero", "food", "lane"];

    // The correction's own `scrollTo` fires `scroll` events for the
    // duration of the animation, which would otherwise re-trigger this
    // same debounce and restart the correction against itself mid-flight.
    // This flag makes the listener ignore scroll events while one of our
    // own corrections is in flight.
    let autoScrolling = false;

    const settle = () => {
      for (const id of wrapperIds) {
        const wrapper = document.getElementById(id);
        const pane = wrapper?.querySelector<HTMLElement>(":scope > div, :scope > section");
        if (!wrapper || !pane) continue;

        const wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY;
        const badStart = wrapperTop + Math.max(0, wrapper.offsetHeight - pane.offsetHeight);
        const badEnd = wrapperTop + wrapper.offsetHeight;
        if (badEnd - badStart < 4) continue; // no real drift tail here

        const y = window.scrollY;
        if (y > badStart + 2 && y < badEnd - 2) {
          const target = y - badStart < badEnd - y ? badStart : badEnd;
          autoScrolling = true;
          window.scrollTo({ top: target, behavior: "smooth" });
          window.setTimeout(() => {
            autoScrolling = false;
          }, 700);
          return;
        }
      }
    };

    let timer: number;
    const onScroll = () => {
      if (autoScrolling) return;
      window.clearTimeout(timer);
      timer = window.setTimeout(settle, 160);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
    };
  }, []);
}

export function Home() {
  useDocumentMeta(
    "Froozo Cafe Madhavadhara — Live-Cooked Food in Vizag",
    "Froozo Cafe Madhavadhara, Visakhapatnam: pizza, burgers, momos, shakes and waffles cooked live at the counter and customised to your taste.",
  );
  useSettleStickyOverlap();

  return (
    <>
      <SiteHeader />
      <main id="main">
        {/* Hero — the entrance. Pulled up behind the sticky header (-mt) so the
            transparent nav overlaps the photo instead of sitting above it.
            Pinned like the food story and pick-a-lane sections: it holds in
            place for a beat of scroll before releasing, at every breakpoint
            (uses `lvh`, not `dvh`, so it doesn't fall short mid-scroll as
            mobile browsers resize the viewport while their address bar
            animates). */}
        <div id="hero" className="relative -mt-24 h-[170vh] md:-mt-28">
          <section className="sticky top-0 flex min-h-lvh items-center justify-center overflow-hidden px-5 py-32 text-center">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroPhoto})` }}
            />

            <a href="#food" aria-label="Scroll to explore" className="absolute inset-0 z-10" />

            <SealBadge className="pointer-events-none absolute bottom-[6%] right-[31%] hidden h-20 w-20 md:block lg:h-24 lg:w-24" />
          </section>
        </div>

        <FoodStory />

        {/* Pinned like the food story: the section locks in place for a beat
            of scroll before releasing into whatever comes next. */}
        <div id="lane" className="relative h-[170vh]">
          <section className="sticky top-0 flex min-h-lvh flex-col justify-center bg-teal py-24 text-cream">
            <div className="mx-auto flex w-full max-w-7xl flex-wrap items-end justify-between gap-4 px-5">
              <div>
                <p className="ticket-label text-brass">On the counter</p>
                <h2 className="mt-3 text-5xl md:text-6xl">Pick a lane.</h2>
              </div>
              <Link
                to="/menu"
                className="rounded-sm border border-cream/30 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] hover:border-brass hover:text-brass"
              >
                Full menu
              </Link>
            </div>

            <CategoryCarousel categories={menu} />
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
