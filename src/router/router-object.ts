import { _ } from "../main";
import isString from "../utilities/is-string";
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
    const propName = name as string;
    if (propName in t) return (t as any)[propName];
    if (isString(propName)) {
      const routeFn: RouteFn = (main: RouteValue, fallback?: RouteValue) => {
        routeFn.routeValues = fallback ? [main, fallback] : [main];

        const routePath = propName;

        _("Router:" + routePath, ({ children }) => {
          return `<a href="#/${routeToKebabCase(routePath)}">${children}</a>`;
        });
        return () => {
          window.location.hash = `/${routeToKebabCase(routePath)}`;
        };
      };

      t[propName] = routeFn;

      return routeFn;
    }
  },
});
