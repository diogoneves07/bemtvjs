import { routerProxy } from "./router-object";
import { _ } from "../main";
import { useRouterTemplate } from "./router";

_("Router", () => () => useRouterTemplate());
export const router = routerProxy;
export const r = router;
