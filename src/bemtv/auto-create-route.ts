import createRoute from "../router/create-route";
import { hasComponent } from "./components-main";

export default function autoCreateRoute(routeName: string) {
  const cleanRouteName = routeName.slice(routeName.indexOf(":") + 1);

  if (!hasComponent(routeName)) createRoute(cleanRouteName);
}

export function autoCreateRouteFromTemplates(t: string) {
  t.replaceAll(/#[A-Z][:\w]*/g, (r) => {
    autoCreateRoute(`Router:${r.slice(1)}`);
    return r;
  });
}
