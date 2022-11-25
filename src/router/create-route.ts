import { ROUTES_OPTIONS } from "./../bemtv/routes-store";
import { _ } from "../bemtv/components-main";
import { routeToKebabCase } from "./routes-case";

export default function createRoute(routeName: string) {
  const isRoot = routeName === "Root";
  const routeBase = isRoot ? "" : routeToKebabCase(routeName);

  _`Router:${routeName}`().template(() => {
    const routeOptions = ROUTES_OPTIONS.get(routeName);

    let routePath = routeBase;

    if (routeOptions && routeOptions.concat) {
      routePath = isRoot ? "" : routePath + "/" + routeOptions.concat;
    }

    return `<a href="#/${routePath}">$children</a>`;
  });
}
