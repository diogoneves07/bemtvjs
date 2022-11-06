import { _ } from "../main";
import { routerProxy } from "./router-object";
import { useRouterTemplate } from "./router";

export { onRouteUnfound } from "./on-route-unfound";

_("Router").template(() => useRouterTemplate());

export const router = routerProxy;
export const r = router;
