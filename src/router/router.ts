import { routerProxy } from "./router-object";
import { match, _ } from "../main";
import { routeToCamelCase } from "./routes-case-";

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
    if (Array.isArray(routeValues)) {
      routerTemplate = () => {
        return match(routeValues[0], routeValues[1]);
      };
    } else {
      routerTemplate = () => {
        return routeValues;
      };
    }

    return;
  }
  routerTemplate = initialRouterTemplate;
};

window.addEventListener("DOMContentLoaded", changeRouterTemplate);
window.addEventListener("popstate", changeRouterTemplate);
