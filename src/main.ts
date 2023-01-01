export type { ElementInst } from "./bemtv/element-inst";

export { glob as css } from "goober/global";

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

export { matchComponent as match } from "./bemtv/match-component";
export { lazy } from "./bemtv/auto-import-components";
export { default as render } from "./bemtv/render";
export { onRouteUnfound } from "./router/main";
export { stateFn } from "./state-fn/main";
