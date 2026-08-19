import { Link } from "@tanstack/react-router";
import { FoodStory } from "@/components/site/FoodStory";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { OrderButtons } from "@/components/site/OrderButtons";
import { CategoryCarousel } from "@/components/site/CategoryCarousel";
import { menu, outlet } from "@/data/menu";
import { useDocumentMeta } from "@/lib/useDocumentMeta";

export function Home() {
  useDocumentMeta(
    "Froozo Cafe Madhavadhara — Live-Cooked Food in Vizag",
    "Froozo Cafe Madhavadhara, Visakhapatnam: pizza, burgers, momos, shakes and waffles cooked live at the counter and customised to your taste.",
  );

  return (
    <>
      <SiteHeader />
      <main>
        <FoodStory />

        <section className="bg-teal-deep py-24 text-cream">
          <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-4 px-5">
            <div>
              <p className="ticket-label text-brass">On the counter</p>
              <h2 className="mt-3 text-5xl md:text-6xl">Pick a lane.</h2>
            </div>
            <Link
              to="/menu"
              className="rounded-sm border border-cream/30 px-5 py-3 font-mono text-xs uppercase tracking-[0.18em] hover:border-brass hover:text-brass"
            >
              Full menu
            </Link>
          </div>

          <CategoryCarousel categories={menu} />
        </section>

        <section className="bg-oak px-5 py-20 text-char">
          <div className="mx-auto max-w-7xl">
            <p className="ticket-label">Part of the Froozo family</p>
            <p className="mt-4 max-w-2xl text-sm">
              We're one independently run Froozo outlet in Madhavadhara,
              Visakhapatnam. The numbers below belong to the wider Froozo brand
              across India — not to this single cafe.
            </p>
            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              {[
                ["90+", "Froozo outlets nationwide"],
                ["19+", "Cities across India"],
                ["12", "States"],
              ].map(([n, l]) => (
                <div key={l} className="border-t-2 border-char pt-4">
                  <p className="font-display text-6xl">{n}</p>
                  <p className="mt-1 font-mono text-xs uppercase tracking-[0.18em]">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-cream px-5 py-24">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
            <div>
              <p className="ticket-label text-teal">Find us</p>
              <h2 className="mt-3 text-5xl md:text-6xl">
                Madhavadhara,
                <span className="block text-teal">Visakhapatnam.</span>
              </h2>
              <dl className="mt-8 space-y-4 font-mono text-sm">
                <div>
                  <dt className="ticket-label text-smoke">Address</dt>
                  <dd className="mt-1">{outlet.address}</dd>
                </div>
                <div>
                  <dt className="ticket-label text-smoke">Phone</dt>
                  <dd className="mt-1">
                    <a href={outlet.phoneHref} className="hover:text-teal">{outlet.phone}</a>
                  </dd>
                </div>
                <div>
                  <dt className="ticket-label text-smoke">Hours</dt>
                  <dd className="mt-1">{outlet.hours}</dd>
                </div>
              </dl>
              <OrderButtons className="mt-8" />
            </div>
            <div className="min-h-80 border-2 border-char hard-shadow">
              <iframe
                title="Map to Froozo Cafe Madhavadhara"
                src={outlet.mapEmbed}
                loading="lazy"
                className="h-full min-h-80 w-full"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
