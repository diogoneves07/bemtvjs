import { _ } from "../main";
import isString from "../utilities/is-string";
import { applyRouter } from "./router";
import { routeToKebabCase } from "./routes-case";

type RouteObject = { title?: string; use: string; concat?: string };
type RouteValue = string | { title?: string; use: string; concat?: string };
type RouteFallback = string | Omit<RouteObject, "concat">;

type GoToRoute = () => void;
type RouteFn = {
  (main: RouteValue, fallback?: RouteFallback): GoToRoute;
  routeValues?: [m: RouteValue, f?: RouteFallback];
};

const routerObject: Record<string, RouteFn> = {};

export const routerProxy = new Proxy(routerObject, {
  get(t, name) {
    const propName = name as string;
    if (propName in t) return (t as any)[propName];
    if (isString(propName)) {
      const routeFn: RouteFn = (main: RouteValue, fallback?: RouteFallback) => {
        routeFn.routeValues = fallback ? [main, fallback] : [main];

        const routeName = propName;
        const isRoot = routeName === "Root";
        const isRouteObject = typeof main === "object";
        let routePath = isRoot ? "" : routeToKebabCase(routeName);

        if (isRouteObject && main.concat) {
          routePath = routePath + "/" + main.concat;
        }
        _`Router:${routeName}`().template(
          () => `<a href="#/${routePath}">$children</a>`
        );
        return () => {
          window.location.hash = isRoot ? "/" : `/${routePath}`;
          applyRouter();
        };
      };

      t[propName] = routeFn;

      return routeFn;
    }
  },
});
