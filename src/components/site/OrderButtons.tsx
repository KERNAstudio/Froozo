import { outlet } from "@/data/menu";

export function OrderButtons({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <a
        href={outlet.zomato}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-sm bg-red px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-cream transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
      >
        Order on Zomato
      </a>
      <a
        href={outlet.swiggy}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-sm bg-sage px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-char transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
      >
        Order on Swiggy
      </a>
      <a
        href={outlet.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-sm border border-current px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
      >
        Instagram
      </a>
    </div>
  );
}
