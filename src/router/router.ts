import { routeToCamelCase } from "./routes-case";
import { dispatchRouteUnfound } from "./on-route-unfound";
import { ROUTES_OPTIONS } from "../bemtv/routes-store";
import { hasComponent } from "../bemtv/components-main";
import createRoute from "./create-route";
import hasRoute from "../bemtv/has-route";
import {
  dispatchToRouterControlers,
  hasRouterControlers,
} from "./use-control-router";

const initialRouterTemplate = () => ``;

let routerTemplate = initialRouterTemplate;

const updateRouterTemplate = (value: () => string, componentName: string) => {
  if (hasRouterControlers()) {
    dispatchToRouterControlers(() => {
      routerTemplate = value;
    }, componentName);
  } else {
    routerTemplate = value;
  }
};

export function useRouterTemplate() {
  return routerTemplate();
}

let lastHash = "";
let lastRouteUnfound = " ";

export const applyRouter = () => {
  const locationHash = window.location.hash;
  const isRoot = !locationHash || locationHash.length < 3;

  if (isRoot && !hasRoute(`Root`) && hasComponent("Root")) {
    createRoute("Root");
  }

  let currentHash = locationHash;

  currentHash = isRoot ? "/root" : currentHash;

  if (lastHash === currentHash) return;

  lastHash = "";

  let path = currentHash.split("/")[1];

  if (!path) {
    updateRouterTemplate(initialRouterTemplate, "Root");

    lastRouteUnfound = locationHash;

    dispatchRouteUnfound();

    return;
  }

  const routeName = routeToCamelCase(path);
  const routeOptions = ROUTES_OPTIONS.get(routeName);

  if (hasRoute(routeName)) {
    lastHash = currentHash;
    lastRouteUnfound = locationHash;

    const routeComponent = `${routeName}[]`;

    if (routeOptions && Object.hasOwn(routeOptions, "title")) {
      document.title = routeOptions.title as string;
    }

    updateRouterTemplate(() => routeComponent, routeName);

    return;
  }

  updateRouterTemplate(initialRouterTemplate, routeName);

  if (lastRouteUnfound !== locationHash) {
    lastRouteUnfound = locationHash;

    dispatchRouteUnfound();
  }
};

// Runs the router before the first page paint.
window.requestAnimationFrame(applyRouter);

window.addEventListener("DOMContentLoaded", applyRouter);
window.addEventListener("popstate", applyRouter);
