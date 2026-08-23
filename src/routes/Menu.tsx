import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CategoryIcon } from "@/components/site/CategoryIcon";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { OrderButtons } from "@/components/site/OrderButtons";
import { menu } from "@/data/menu";
import { useDocumentMeta } from "@/lib/useDocumentMeta";

export function MenuPage() {
  useDocumentMeta(
    "Menu — Froozo Cafe Madhavadhara, Vizag",
    "The full Froozo Cafe Madhavadhara menu: pizza, burgers, pasta, stuffed nanza, wraps, momos, kulhad pizza, waffles, shakes, mocktails and more.",
  );

  const [active, setActive] = useState(menu[0]!.id);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) document.getElementById(hash)?.scrollIntoView();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      let current = menu[0]!.id;
      for (const c of menu) {
        const el = document.getElementById(c.id);
        if (el && el.getBoundingClientRect().top <= 180) current = c.id;
      }
      if (
        window.innerHeight + window.scrollY >=
        document.body.scrollHeight - 8
      ) {
        current = menu[menu.length - 1]!.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    const chip = rail?.querySelector<HTMLElement>(`[data-cat="${active}"]`);
    if (!rail || !chip) return;
    const left = chip.offsetLeft - rail.clientWidth / 2 + chip.offsetWidth / 2;
    rail.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
  }, [active]);

  return (
    <>
      <SiteHeader />
      <main id="main" className="bg-char text-cream">
        <section className="bg-teal px-5 py-20 text-cream">
          <div className="mx-auto max-w-7xl">
            <p className="ticket-label text-brass">The card · Madhavadhara outlet</p>
            <h1 className="mt-4 text-6xl md:text-8xl">
              Everything,
              <span className="block text-brass">made to order.</span>
            </h1>
            <p className="mt-6 max-w-xl text-sm text-cream/70">
              Nothing here is pre-cooked. Order it, watch it happen, and tell the
              chef how you want it — sweeter, spicier, extra cheese. Pure veg
              kitchen.
            </p>
          </div>
        </section>

        <nav className="sticky top-24 z-40 flex items-center gap-1 border-y border-cream/15 bg-char/95 px-2 backdrop-blur md:top-28">
          <button
            type="button"
            aria-label="Scroll categories left"
            onClick={() => railRef.current?.scrollBy({ left: -240, behavior: "smooth" })}
            className="hidden shrink-0 rounded-sm p-3 text-cream/60 hover:bg-brass/15 hover:text-cream sm:block"
          >
            <ChevronLeft className="size-5" />
          </button>
          <div
            ref={railRef}
            className="no-scrollbar mx-auto flex max-w-7xl flex-nowrap gap-2 overflow-x-auto overscroll-x-contain px-3 py-3"
          >
            {menu.map((c) => (
              <a
                key={c.id}
                data-cat={c.id}
                href={`#${c.id}`}
                className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-sm px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] transition-colors ${
                  active === c.id
                    ? "bg-brass text-char"
                    : "text-cream/60 hover:bg-brass/15 hover:text-cream"
                }`}
              >
                <CategoryIcon id={c.id} className="size-3.5" />
                {c.title}
              </a>
            ))}
          </div>
          <button
            type="button"
            aria-label="Scroll categories right"
            onClick={() => railRef.current?.scrollBy({ left: 240, behavior: "smooth" })}
            className="hidden shrink-0 rounded-sm p-3 text-cream/60 hover:bg-brass/15 hover:text-cream sm:block"
          >
            <ChevronRight className="size-5" />
          </button>
        </nav>

        <div className="mx-auto max-w-7xl px-5 py-16">
          {menu.map((c) => (
            <section key={c.id} id={c.id} className="scroll-mt-44 border-t border-cream/15 py-14 first:border-t-0 first:pt-0">
              <div className="grid gap-10 md:grid-cols-[minmax(0,16rem)_1fr]">
                <div>
                  <div
                    className="grid size-16 place-items-center rounded-sm border border-brass/30 text-cream"
                    style={{ background: "var(--gradient-teal)" }}
                  >
                    <CategoryIcon id={c.id} className="size-7 text-brass" />
                  </div>
                  <h2 className="mt-5 text-4xl md:text-5xl">{c.title}</h2>
                  {c.note && (
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-red">
                      {c.note}
                    </p>
                  )}
                </div>

                <ul className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
                  {c.items.map((item) => (
                    <li
                      key={item.name + (item.detail ?? "")}
                      className={
                        item.featured
                          ? "border-l-2 border-red bg-brass/10 py-2 pl-4"
                          : ""
                      }
                    >
                      <div className="flex items-baseline gap-2">
                        <span className="font-display text-xl italic">{item.name}</span>
                        {item.featured && (
                          <span className="rounded-sm bg-brass px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-char">
                            Signature
                          </span>
                        )}
                        <span className="dotted-rule flex-1 text-cream/20" />
                        <span className="shrink-0 text-sm text-cream/50">xxx</span>
                      </div>
                      {item.detail && (
                        <p className="mt-1 text-sm text-cream/65">{item.detail}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
        </div>

        <section className="bg-teal px-5 py-20 text-cream">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-5xl md:text-6xl">Hungry already?</h2>
            <OrderButtons className="mt-8" />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
