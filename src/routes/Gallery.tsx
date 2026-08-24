import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { OrderButtons } from "@/components/site/OrderButtons";
import { outlet } from "@/data/menu";
import { useDocumentMeta } from "@/lib/useDocumentMeta";

type Tile = { label: string; img: string; span?: string };
type Group = { id: string; title: string; blurb: string; tiles: Tile[] };

const groups: Group[] = [
  {
    id: "food",
    title: "Food",
    blurb: "Everything below is cooked to order at the open counter.",
    tiles: [
      { label: "Fresh off the pizza counter", img: "https://images.unsplash.com/photo-1672856398893-2fb52d807874?fit=max&fm=jpg&q=80&w=1200", span: "md:col-span-2 md:row-span-2" },
      { label: "Double Decker burger", img: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?fit=max&fm=jpg&q=80&w=800" },
      { label: "Stuffed Nanza", img: "https://images.unsplash.com/photo-1697155406014-04dc649b0953?fit=max&fm=jpg&q=80&w=800" },
      { label: "Tandoori momos", img: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?fit=max&fm=jpg&q=80&w=1200", span: "md:col-span-2" },
      { label: "Kulhad pizza", img: "https://images.unsplash.com/photo-1604264726154-26480e76f4e1?fit=max&fm=jpg&q=80&w=800" },
    ],
  },
  {
    id: "drinks",
    title: "Drinks",
    blurb: "Shakes blended in front of you, mocktails built at the bar.",
    tiles: [
      { label: "Monster Freak shake", img: "https://images.unsplash.com/photo-1767114915915-4433437ac280?fit=max&fm=jpg&q=80&w=1200", span: "md:col-span-2" },
      { label: "Mocktail bar", img: "https://images.unsplash.com/photo-1655917080333-ab794719f842?fit=max&fm=jpg&q=80&w=800" },
      { label: "Masala chai & coffee", img: "https://images.unsplash.com/photo-1683533699004-7f6b9e5a073f?fit=max&fm=jpg&q=80&w=800" },
    ],
  },
  {
    id: "desserts",
    title: "Desserts",
    blurb: "Waffles, bubble waffles and rolls off the cold plate.",
    tiles: [
      { label: "Loaded waffles", img: "https://images.unsplash.com/photo-1562513872-634b8fae6dbe?fit=max&fm=jpg&q=80&w=800" },
      { label: "Bubble waffle", img: "https://images.unsplash.com/photo-1563009390-639e10013c92?fit=max&fm=jpg&q=80&w=800" },
      { label: "Ice cream rolls", img: "https://images.unsplash.com/photo-1771335239256-2298d899234e?fit=max&fm=jpg&q=80&w=1200", span: "md:col-span-2" },
    ],
  },
  {
    id: "ambience",
    title: "Ambience",
    blurb:
      "Deep teal counter wall with the wood wordmark, honey oak paneling, sage velvet chairs and brass pendants.",
    tiles: [
      { label: "Teal counter wall", img: "https://images.unsplash.com/photo-1770816307611-4147a8be5d2b?fit=max&fm=jpg&q=80&w=1200", span: "md:col-span-2 md:row-span-2" },
      { label: "Oak paneling & seating", img: "https://images.unsplash.com/photo-1778034758206-174d39543b88?fit=max&fm=jpg&q=80&w=800" },
      { label: "Brass pendant light", img: "https://images.unsplash.com/photo-1769773862842-a1150a125766?fit=max&fm=jpg&q=80&w=800" },
      { label: "Sage velvet chairs", img: "https://images.unsplash.com/photo-1631563642459-ae1b71341a5f?fit=max&fm=jpg&q=80&w=1200", span: "md:col-span-2" },
    ],
  },
];

export function GalleryPage() {
  useDocumentMeta(
    "Gallery — Froozo Cafe Madhavadhara, Vizag",
    "Food, drinks, desserts and the room at Froozo Cafe Madhavadhara, Visakhapatnam — teal counter wall, oak paneling and brass pendant light.",
  );

  return (
    <>
      <SiteHeader />
      <main id="main" className="bg-char text-cream">
        <section className="bg-teal px-5 py-20 text-cream">
          <div className="mx-auto max-w-7xl">
            <p className="ticket-label text-brass">Gallery</p>
            <h1 className="mt-4 text-6xl md:text-8xl">
              Shot at
              <span className="block text-brass">the counter.</span>
            </h1>
            <p className="mt-6 max-w-xl text-sm text-cream/70">
              We're photographing this Vizag outlet properly — real food, real
              room, no stock imagery. Until those land, the reference shots
              below stand in for the real thing.
            </p>
          </div>
        </section>

        {groups.map((g, gi) => (
          <section
            key={g.id}
            id={g.id}
            className={`px-5 py-16 ${gi % 2 === 1 ? "bg-brass/10" : ""}`}
          >
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="ticket-label text-brass">0{gi + 1}</p>
                  <h2 className="mt-2 text-4xl md:text-5xl">{g.title}</h2>
                </div>
                <p className="max-w-md text-sm text-cream/65">{g.blurb}</p>
              </div>

              <div className="mt-10 grid auto-rows-[12rem] grid-cols-2 gap-4 md:grid-cols-4">
                {g.tiles.map((t) => (
                  <figure
                    key={t.label}
                    className={`group relative flex items-end overflow-hidden border border-cream/15 ${t.span ?? ""}`}
                  >
                    <img
                      src={t.img}
                      alt={t.label}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-char/80 via-char/0 to-char/0" />
                    <figcaption className="relative p-5 text-[0.68rem] uppercase tracking-[0.18em] text-cream">
                      {t.label}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        ))}

        <section className="border-t border-cream/15 px-5 py-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-4xl md:text-5xl">See today's plates</h2>
            <p className="mt-3 max-w-lg text-sm text-cream/65">
              Our Instagram, <span className="font-semibold">@froozocafe_vizag</span>,
              has the freshest photos from this outlet.
            </p>
            <OrderButtons className="mt-8" />
            <p className="mt-6 text-xs uppercase tracking-[0.16em] text-cream/65">
              {outlet.address}
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
