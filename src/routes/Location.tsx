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
      <main className="bg-cream">
        <section className="bg-teal-deep px-5 py-20 text-cream">
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
              <div className="border-b border-char/15 pb-5">
                <dt className="ticket-label text-teal">Address</dt>
                <dd className="mt-2 font-display text-2xl">{outlet.address}</dd>
              </div>
              <div className="border-b border-char/15 pb-5">
                <dt className="ticket-label text-teal">Phone</dt>
                <dd className="mt-2 font-mono text-lg">
                  <a href={outlet.phoneHref} className="hover:text-teal">
                    {outlet.phone}
                  </a>
                </dd>
              </div>
              <div className="border-b border-char/15 pb-5">
                <dt className="ticket-label text-teal">Hours</dt>
                <dd className="mt-2 font-mono text-lg">{outlet.hours}</dd>
              </div>
              <div>
                <dt className="ticket-label text-teal">Good to know</dt>
                <dd className="mt-2 text-sm text-smoke">
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
              className="mt-4 inline-block font-mono text-xs uppercase tracking-[0.18em] text-teal underline underline-offset-4"
            >
              Open in Google Maps
            </a>
          </div>

          <div className="min-h-[26rem] border-2 border-char hard-shadow">
            <iframe
              title="Map to Froozo Cafe Madhavadhara, Visakhapatnam"
              src={outlet.mapEmbed}
              loading="lazy"
              className="h-full min-h-[26rem] w-full"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
