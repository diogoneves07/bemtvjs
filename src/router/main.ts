import { _ } from "../main";
import { useRouterTemplate } from "./router";

export { onRouteUnfound } from "./on-route-unfound";

_`Router`().template(() => useRouterTemplate());
