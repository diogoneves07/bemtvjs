import { routeToCamelCase } from "./routes-case";
import { dispatchRouteUnfound } from "./on-route-unfound";
import { hasComponent } from "../bemtv/components-main";
import createRoute from "./create-route";
import hasRoute from "./has-route";
import {
  dispatchToRouteControlers,
  hasRouterControlers,
  isFirstRoute,
} from "./use-route-control";
import { applyRouteOptions } from "./apply-route-options";

const initialRouterTemplate = () => ``;

let routerTemplate = initialRouterTemplate;

const updateRouterTemplate = (
  value: () => string,
  cancelRoute: () => void,
  componentName?: string
) => {
  if (!componentName) {
    routerTemplate = value;

    return;
  }

  if (hasRouterControlers()) {
    dispatchToRouteControlers(
      () => {
        routerTemplate = value;
      },
      componentName,
      cancelRoute
    );
  } else {
    applyRouteOptions(componentName);
    routerTemplate = value;
  }

  isFirstRoute.value = false;
};

export function useRouterTemplate() {
  return routerTemplate();
}

let lastComponentHash = "";
let lastRouteUnfound = " ";
let previousHash = "";

export const applyRouter = () => {
  const locationHash = window.location.hash;

  const cancelRoute = ((p) => () => {
    window.location.hash = p || p + "/";
    previousHash = p;
  })(previousHash);

  previousHash = locationHash;

  const isRoot = !locationHash || locationHash.length < 3;

  if (isRoot && !hasRoute(`Root`) && hasComponent("Root")) {
    createRoute("Root");
  }

  let currentHash = locationHash;

  currentHash = isRoot ? "/root" : currentHash;

  if (lastComponentHash === currentHash) return;

  lastComponentHash = "";

  let path = currentHash.split("/")[1];

  if (!path) {
    updateRouterTemplate(initialRouterTemplate, cancelRoute, "Root");

    lastRouteUnfound = locationHash;

    dispatchRouteUnfound();

    return;
  }

  const routeName = routeToCamelCase(path);

  if (hasRoute(routeName)) {
    if (routeName === "Root") {
      locationHash !== "" && (window.location.hash = "/");
    }

    lastComponentHash = currentHash;
    lastRouteUnfound = locationHash;

    const routeComponent = `${routeName}[]`;

    updateRouterTemplate(() => routeComponent, cancelRoute, routeName);

    return;
  }

  updateRouterTemplate(initialRouterTemplate, cancelRoute);

  if (lastRouteUnfound !== locationHash) {
    lastRouteUnfound = locationHash;

    dispatchRouteUnfound();
  }
};

// Runs the router before the first page paint.
window.requestAnimationFrame(applyRouter);

window.addEventListener("DOMContentLoaded", applyRouter);
window.addEventListener("popstate", applyRouter);
