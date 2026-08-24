import { useEffect } from "react";

/**
 * Client-side stand-in for TanStack Start's SSR `head()` route option.
 * Sets document.title and the meta description tag on mount.
 * (This app runs client-only; for real SEO on these routes, a prerender
 * step or an SSR framework would be needed — out of scope for local dev.)
 */
export function useDocumentMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = title;
    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", "description");
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", description);
    }
  }, [title, description]);
}
