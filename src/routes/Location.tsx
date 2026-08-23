import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { OrderButtons } from "@/components/site/OrderButtons";
import { outlet } from "@/data/menu";
import { useDocumentMeta } from "@/lib/useDocumentMeta";

export function LocationPage() {
  useDocumentMeta(
    "Location & Contact — Froozo Cafe Madhavadhara, Vizag",
    "Visit Froozo Cafe Madhavadhara, Visakhapatnam. Open 11 AM to 11 PM daily. Call +91 98700 73230 or order on Zomato and Swiggy.",
  );

  return (
    <>
      <SiteHeader />
      <main id="main" className="bg-char text-cream">
        <section className="bg-teal px-5 py-20 text-cream">
          <div className="mx-auto max-w-7xl">
            <p className="ticket-label text-gold">Location & contact</p>
            <h1 className="mt-4 text-6xl md:text-8xl">
              Come watch
              <span className="block text-brass">it cook.</span>
            </h1>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-2">
          <div>
            <dl className="space-y-6">
              <div className="border-b border-cream/15 pb-5">
                <dt className="ticket-label text-brass">Address</dt>
                <dd className="mt-2 font-display text-2xl italic">{outlet.address}</dd>
              </div>
              <div className="border-b border-cream/15 pb-5">
                <dt className="ticket-label text-brass">Phone</dt>
                <dd className="mt-2 text-lg">
                  <a href={outlet.phoneHref} className="hover:text-red">
                    {outlet.phone}
                  </a>
                </dd>
              </div>
              <div className="border-b border-cream/15 pb-5">
                <dt className="ticket-label text-brass">Hours</dt>
                <dd className="mt-2 text-lg">{outlet.hours}</dd>
              </div>
              <div>
                <dt className="ticket-label text-brass">Good to know</dt>
                <dd className="mt-2 text-sm text-cream/65">
                  Froozo Cafe, Madhavadhara is an independently run Froozo
                  franchise outlet in Visakhapatnam. For anything about this cafe
                  — orders, bookings, feedback — call us directly on the number
                  above.
                </dd>
              </div>
            </dl>
            <OrderButtons className="mt-10" />
            <a
              href={outlet.maps}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-xs font-semibold uppercase tracking-[0.18em] text-red underline underline-offset-4"
            >
              Open in Google Maps
            </a>
          </div>

          <div className="min-h-[26rem] border border-brass/30 bg-char p-2">
            <iframe
              title="Map to Froozo Cafe Madhavadhara, Visakhapatnam"
              src={outlet.mapEmbed}
              loading="lazy"
              className="h-full min-h-[25rem] w-full grayscale-[0.35] contrast-[0.95] brightness-90"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>

        <section className="bg-teal-deep px-5 py-20 text-cream">
          <div className="mx-auto max-w-7xl">
            <p className="ticket-label text-brass">Part of the Froozo family</p>
            <p className="mt-4 max-w-2xl text-sm text-cream/75">
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
                <div key={l} className="border-t-2 border-brass/40 pt-4">
                  <p className="font-display text-6xl italic">{n}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-cream/70">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
