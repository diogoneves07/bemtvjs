export { _, hasComponent } from "./bemtv/components-main";
export { tFn } from "./bemtv/transformation-functions/main";
export {
  tOrderedList as tOL,
  tUnorderedList as tUL,
  toUL,
  toOL,
} from "./bemtv/transformation-functions/html-list-dt";
export {
  tDescriptionList as tDL,
  toDL,
} from "./bemtv/transformation-functions/description-list-dt";

export { matchComponent as match } from "./bemtv/match-component";
export { autoImportComponents } from "./bemtv/auto-import-components";
export { default as render } from "./bemtv/render";
export { router, r, onRouteUnfound } from "./router/main";
