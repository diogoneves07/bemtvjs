import { _ } from "../main";
import { routeToKebabCase } from "./routes-case";

type RouteValue = string | { title: string; use: string };
type GoToRoute = () => void;
type RouteFn = {
  (main: RouteValue, fallback?: RouteValue): GoToRoute;
  routeValues?: RouteValue[];
};

const routerObject: Record<string, RouteFn> = {};

export const routerProxy = new Proxy(routerObject, {
  get(t, name) {
    if (name in t) return (t as any)[name];
    if (typeof name === "string") {
      const routeFn: RouteFn = (main: RouteValue, fallback?: RouteValue) => {
        routeFn.routeValues = fallback ? [main, fallback] : [main];

        const routePath = name;

        _("Router:" + routePath, ({ children }) => {
          return `<a href="#/${routeToKebabCase(routePath)}">${children}</a>`;
        });
        return () => {
          window.location.hash = `/${routeToKebabCase(routePath)}`;
        };
      };

      t[name] = routeFn;

      return routeFn;
    }
  },
});
