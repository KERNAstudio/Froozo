import { Link } from "@tanstack/react-router";
import { outlet } from "@/data/menu";
import { InstagramIcon, SwiggyIcon, ZomatoIcon } from "./BrandIcons";

export function SiteFooter() {
  return (
    <footer className="bg-char text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="script-line text-5xl">More than a Cafe.</p>
          <p className="mt-4 max-w-md text-sm text-cream/70">
            Froozo Cafe, Madhavadhara — an independently run Froozo franchise
            outlet in Visakhapatnam. Everything on our counter is cooked live,
            in front of you, and tweaked to your taste. We speak only for this
            Vizag kitchen, not for the wider Froozo company.
          </p>
        </div>

        <div>
          <p className="ticket-label text-brass">Explore</p>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              { to: "/", label: "Home" },
              { to: "/menu", label: "Menu" },
              { to: "/gallery", label: "Gallery" },
              { to: "/location", label: "Location & Contact" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-cream/75 hover:text-brass">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="ticket-label text-brass">Order & Visit</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={outlet.zomato}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-cream/50 bg-cream px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-char transition-all hover:border-red active:scale-95"
            >
              <ZomatoIcon className="size-4" />
              Zomato
            </a>
            <a
              href={outlet.swiggy}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-cream/50 bg-cream px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-char transition-all hover:border-red active:scale-95"
            >
              <SwiggyIcon className="size-4" />
              Swiggy
            </a>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-cream/75">
            <li>
              <a
                href={outlet.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-brass"
              >
                <InstagramIcon className="size-3.5" />
                Instagram
              </a>
            </li>
            <li className="pt-2 text-xs">{outlet.address}</li>
            <li>
              <a href={outlet.phoneHref} className="text-xs hover:text-brass">
                {outlet.phone}
              </a>
            </li>
            <li className="text-xs">{outlet.hours}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/15 px-5 py-6">
        <p className="mx-auto max-w-7xl text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-cream/55">
          © {new Date().getFullYear()} Froozo Cafe Madhavadhara · Independently
          run franchise outlet · Visakhapatnam, Andhra Pradesh
        </p>
      </div>
    </footer>
  );
}
