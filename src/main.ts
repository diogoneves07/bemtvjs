export type { RouteControl } from "./router/use-route-control";

export type { CSSClass } from "./bemtv/css-classes";
export type { ElementManager } from "./bemtv/element-manager";

export { useRouteControl } from "./router/use-route-control";

export { useElManager, useFirstElManager } from "./bemtv/use-element-manager";

export { proxyFrom } from "./bemtv/super-component/proxy-from";

export { createElManager } from "./bemtv/create-element-manager";

export { _, hasComponent } from "./bemtv/components-main";

export { tFn } from "./bemtv/transformation-functions/main";

export {
  tOrderedList as tOl,
  tUnorderedList as tUl,
  toUl,
  toOl,
} from "./bemtv/transformation-functions/html-list-dt";

export {
  tDescriptionList as tDl,
  toDl,
} from "./bemtv/transformation-functions/description-list-dt";

export { lazy } from "./bemtv/auto-import-components";
export { default as render } from "./bemtv/render";
export { onRouteUnfound } from "./router/main";
export { createStateFn as stateFn } from "./state-fn/main";
