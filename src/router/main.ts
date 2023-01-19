import { AVOIDS_EMPTY_TEMPLATE } from "../bemtv/globals";
import { _ } from "../main";
import { useRouterTemplate } from "./router";

export { onRouteUnfound } from "./on-route-unfound";

export { useRouteControl } from "./use-route-control";

_`Router`().template(() => useRouterTemplate() + AVOIDS_EMPTY_TEMPLATE);
