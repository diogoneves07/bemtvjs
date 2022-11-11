export { _, hasComponent } from "./bemtv/components-main";
export { discreteTransform } from "./bemtv/discrete-transformations/main";
export {
  orderedListDT as olDT,
  unorderedListDT as ulDT,
  toUL,
  toOL,
} from "./bemtv/discrete-transformations/html-list-dt";
export {
  descriptionListDT as dlDT,
  toDL,
} from "./bemtv/discrete-transformations/description-list-dt";

export { matchComponent as match } from "./bemtv/match-component";
export { autoImportComponents } from "./bemtv/auto-import-components";
export { default as render } from "./bemtv/render";
export { router, r, onRouteUnfound } from "./router/main";
