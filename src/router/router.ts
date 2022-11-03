import { routerProxy } from "./router-object";
import { match, _ } from "../main";
import { routeToCamelCase } from "./routes-case";

const initialRouterTemplate = () => ``;

let routerTemplate = initialRouterTemplate;

export function useRouterTemplate() {
  return routerTemplate();
}

const changeRouterTemplate = () => {
  const path = window.location.hash.split("/");

  if (!path[1]) return;

  const routeName = routeToCamelCase(path[1]);
  const routeValues = routerProxy[routeName].routeValues;

  if (routeValues) {
    const [route, fallback] = routeValues;
    const isRouteObject = typeof route === "object";
    const isFallbackObject = typeof fallback === "object";

    const routeComponent = !isRouteObject ? route : route._;

    const fallbackComponent = !isFallbackObject
      ? fallback
      : fallback && fallback._;

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
