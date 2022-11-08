import { routerProxy } from "./router-object";
import { match, _ } from "../main";
import { routeToCamelCase } from "./routes-case";
import { dispatchRouteUnfound } from "./on-route-unfound";

const initialRouterTemplate = () => ``;

let routerTemplate = initialRouterTemplate;

export function useRouterTemplate() {
  return routerTemplate();
}

let lastHash = "";
let lastRouteUnfound = " ";

export const applyRouter = () => {
  const locationHash = window.location.hash;
  const isRoot = !locationHash || locationHash.length < 3;

  let currentHash = locationHash;

  currentHash = isRoot ? "/root" : currentHash;
  if (lastHash === currentHash) return;

  let path = currentHash.split("/")[1];

  if (!path) {
    routerTemplate = initialRouterTemplate;

    lastRouteUnfound = locationHash;

    dispatchRouteUnfound();

    return;
  }

  const routeName = routeToCamelCase(path);
  const routeValues = routerProxy[routeName].routeValues;

  if (routeValues) {
    lastHash = currentHash;
    lastRouteUnfound = locationHash;

    const [route, fallback] = routeValues;

    const isRouteObject = typeof route === "object";
    const isFallbackObject = typeof fallback === "object";

    const routeComponent = !isRouteObject ? route : route.use;

    const fallbackComponent = !isFallbackObject
      ? fallback
      : fallback && fallback.use;

    if (routeValues.length > 1) {
      routerTemplate = () => {
        const m = match(routeComponent, fallbackComponent);

        if (m === routeComponent) {
          if (isRouteObject && Object.hasOwn(route, "title")) {
            document.title = route.title as string;
          }
        } else {
          if (isFallbackObject && Object.hasOwn(fallback, "title")) {
            document.title = fallback.title as string;
          }
        }
        return m;
      };
    } else {
      if (isRouteObject && Object.hasOwn(route, "title")) {
        document.title = route.title as string;
      }

      routerTemplate = () => {
        return routeComponent;
      };
    }

    return;
  }

  routerTemplate = initialRouterTemplate;

  if (lastRouteUnfound !== locationHash) {
    lastRouteUnfound = locationHash;

    dispatchRouteUnfound();
  }
};

// Runs the router before the first page paint.
window.requestAnimationFrame(applyRouter);

window.addEventListener("DOMContentLoaded", applyRouter);
window.addEventListener("popstate", applyRouter);
