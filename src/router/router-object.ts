import { ROUTES_OPTIONS } from "../bemtv/routes-store";
import { _ } from "../main";
import isString from "../utilities/is-string";
import { routeToKebabCase } from "./routes-case";

type RouteFn = {
  (main: string): void;
};

const routerObject: Record<string, RouteFn> = {};

export const routerProxy = new Proxy(routerObject, {
  get(t, name) {
    const propName = name as string;
    if (propName in t) return (t as any)[propName];

    if (isString(propName)) {
      const routeFn: RouteFn = () => {
        const routeName = propName;
        const isRoot = routeName === "Root";
        let routePath = isRoot ? "" : routeToKebabCase(routeName);

        _`Router:${routeName}`().template(() => {
          const routeOptions = ROUTES_OPTIONS.get(routeName);

          if (routeOptions && routeOptions.concat) {
            routePath = routePath + "/" + routeOptions.concat;
          }

          return `<a href="#/${routePath}">$children</a>`;
        });
      };

      t[propName] = routeFn;

      return routeFn;
    }
  },
});
/**
   return () => {
          window.location.hash = isRoot ? "/" : `/${routePath}`;
          applyRouter();
        };
 */
