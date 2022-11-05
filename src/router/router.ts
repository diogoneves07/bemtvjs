import { routerProxy } from "./router-object";
import { match, _ } from "../main";
import { routeToCamelCase } from "./routes-case";

const initialRouterTemplate = () => ``;

let routerTemplate = initialRouterTemplate;

export function useRouterTemplate() {
  return routerTemplate();
}

let lastHash: string = "";
export const changeRouterTemplate = () => {
  if (lastHash === window.location.hash) return;

  const path = window.location.hash.split("/");

  if (!path[1]) {
    routerTemplate = initialRouterTemplate;

    return;
  }

  const routeName = routeToCamelCase(path[1]);
  const routeValues = routerProxy[routeName].routeValues;

  if (routeValues) {
    lastHash = window.location.hash;
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
          isRouteObject && (document.title = route.title);
        } else {
          isFallbackObject && (document.title = fallback.title);
        }
        return m;
      };
    } else {
      if (isRouteObject) document.title = route.title;

      routerTemplate = () => {
        return routeComponent;
      };
    }

    return;
  }
  routerTemplate = initialRouterTemplate;
};

window.addEventListener("DOMContentLoaded", changeRouterTemplate);
window.addEventListener("popstate", changeRouterTemplate);
