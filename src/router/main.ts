import { routerProxy } from "./router-object";
import { _ } from "../main";
import { useRouterTemplate } from "./router";

export const sComRounter = _("Router").template(() => useRouterTemplate());

export const router = routerProxy;
export const r = router;
