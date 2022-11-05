export { pipe } from "./bemtv/pipes/main";
export {
  orderedListPipe as olPipe,
  unorderedListPipe as ulPipe,
} from "./bemtv/pipes/html-list-pipes";
export { descriptionListPipe as dlPipe } from "./bemtv/pipes/description-list-pipe";

export { matchComponent as match } from "./bemtv/match-component";
export { autoImportComponents } from "./bemtv/auto-import-components";
export type { ManagerEl } from "./bemtv/manager-el";
export type { ComponentInst } from "./bemtv/components-inst";
export { Component, _, hasComponent } from "./bemtv/components-main";
export { default as render } from "./bemtv/render";
export { router, r } from "./router/main";
