import { Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export function NotFound() {
  return (
    <>
      <SiteHeader />
      <div id="main" className="flex min-h-[70vh] items-center justify-center bg-char px-4 text-cream">
        <div className="max-w-md text-center">
          <p className="ticket-label text-red">404</p>
          <h1 className="mt-3 text-6xl">Wrong counter.</h1>
          <p className="mt-3 text-sm text-cream/60">
            That page doesn't exist or has moved. Everything else is still on the menu.
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-sm bg-teal px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-cream transition-transform hover:-translate-y-0.5"
            >
              Back to Froozo
            </Link>
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
