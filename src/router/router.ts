import { routerProxy } from "./router-object";
import { match, _ } from "../main";
import { routeToCamelCase } from "./routes-case";
import { dispatchRouteUnfound } from "./on-route-unfound";

const initialRouterTemplate = () => ``;

let routerTemplate = initialRouterTemplate;

export function useRouterTemplate() {
  return routerTemplate();
}

let lastHash: string = "";
export const applyRouter = () => {
  let currentHash = window.location.hash;
  const isRoot = !currentHash || currentHash.length < 3;

  currentHash = isRoot ? "/root" : currentHash;

  if (lastHash === currentHash) return;

  let path = currentHash.split("/")[1];

  if (!path) {
    routerTemplate = initialRouterTemplate;

    return;
  }

  const routeName = routeToCamelCase(path);
  const routeValues = routerProxy[routeName].routeValues;

  if (routeValues) {
    lastHash = currentHash;
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

  dispatchRouteUnfound();
};

// Runs the router before the first page paint.
window.requestAnimationFrame(applyRouter);

window.addEventListener("DOMContentLoaded", applyRouter);
window.addEventListener("popstate", applyRouter);
