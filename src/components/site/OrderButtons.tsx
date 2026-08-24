import { outlet } from "@/data/menu";
import { InstagramIcon, SwiggyIcon, ZomatoIcon } from "./BrandIcons";

export function OrderButtons({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <a
        href={outlet.zomato}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-sm bg-cream px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-char transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
      >
        <ZomatoIcon className="size-4" />
        Order on Zomato
      </a>
      <a
        href={outlet.swiggy}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-sm bg-cream px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-char transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
      >
        <SwiggyIcon className="size-4" />
        Order on Swiggy
      </a>
      <a
        href={outlet.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-sm border border-current px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
      >
        <InstagramIcon className="size-4" />
        Instagram
      </a>
    </div>
  );
}
