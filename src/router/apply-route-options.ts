import { ROUTES_OPTIONS } from "./routes-store";
import { routeToCamelCase } from "./routes-case";

export function applyRouteOptions(name: string) {
  const routeName = routeToCamelCase(name);

  const routeOptions = ROUTES_OPTIONS.get(routeName);

  if (routeOptions && Object.hasOwn(routeOptions, "title")) {
    document.title = routeOptions.title as string;
  }
}
