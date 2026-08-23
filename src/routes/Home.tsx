import { Link } from "@tanstack/react-router";
import { FoodStory } from "@/components/site/FoodStory";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { CategoryCarousel } from "@/components/site/CategoryCarousel";
import { SealBadge } from "@/components/site/SealBadge";
import { menu } from "@/data/menu";
import { useDocumentMeta } from "@/lib/useDocumentMeta";
import heroPhoto from "@/assets/hero-bg.jpg";

export function Home() {
  useDocumentMeta(
    "Froozo Cafe Madhavadhara — Live-Cooked Food in Vizag",
    "Froozo Cafe Madhavadhara, Visakhapatnam: pizza, burgers, momos, shakes and waffles cooked live at the counter and customised to your taste.",
  );

  return (
    <>
      <SiteHeader />
      <main id="main">
        {/* Hero — the entrance. Pulled up behind the sticky header (-mt) so the
            transparent nav overlaps the photo instead of sitting above it. */}
        <section className="relative -mt-24 flex min-h-dvh items-center justify-center overflow-hidden px-5 py-32 text-center md:-mt-28">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroPhoto})` }}
          />

          <a href="#food" aria-label="Scroll to explore" className="absolute inset-0 z-10" />

          <SealBadge className="pointer-events-none absolute bottom-[6%] right-[31%] hidden h-20 w-20 md:block lg:h-24 lg:w-24" />
        </section>

        <FoodStory />

        <section className="bg-teal py-24 text-cream">
          <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-4 px-5">
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
      </main>
      <SiteFooter />
    </>
  );
}
