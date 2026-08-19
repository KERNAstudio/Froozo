import { Link } from "@tanstack/react-router";
import { outlet } from "@/data/menu";

export function SiteFooter() {
  return (
    <footer className="bg-char text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-4xl leading-none">
            More than a Cafe.
          </p>
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
          <ul className="mt-4 space-y-2 text-sm text-cream/75">
            <li>
              <a href={outlet.zomato} target="_blank" rel="noopener noreferrer" className="hover:text-brass">
                Zomato
              </a>
            </li>
            <li>
              <a href={outlet.swiggy} target="_blank" rel="noopener noreferrer" className="hover:text-brass">
                Swiggy
              </a>
            </li>
            <li>
              <a href={outlet.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-brass">
                Instagram
              </a>
            </li>
            <li className="pt-2 font-mono text-xs">{outlet.address}</li>
            <li>
              <a href={outlet.phoneHref} className="font-mono text-xs hover:text-brass">
                {outlet.phone}
              </a>
            </li>
            <li className="font-mono text-xs">{outlet.hours}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/15 px-5 py-6">
        <p className="mx-auto max-w-7xl font-mono text-[0.68rem] uppercase tracking-[0.18em] text-smoke">
          © {new Date().getFullYear()} Froozo Cafe Madhavadhara · Independently
          run franchise outlet · Visakhapatnam, Andhra Pradesh
        </p>
      </div>
    </footer>
  );
}
