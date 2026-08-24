import { createRootRoute, createRoute, createRouter, Outlet } from "@tanstack/react-router";
import { Home } from "./routes/Home";
import { MenuPage } from "./routes/Menu";
import { GalleryPage } from "./routes/Gallery";
import { LocationPage } from "./routes/Location";
import { NotFound } from "./routes/NotFound";

const rootRoute = createRootRoute({
  component: () => <Outlet />,
  notFoundComponent: NotFound,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const menuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/menu",
  component: MenuPage,
});

const galleryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/gallery",
  component: GalleryPage,
});

const locationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/location",
  component: LocationPage,
});

const routeTree = rootRoute.addChildren([indexRoute, menuRoute, galleryRoute, locationRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
