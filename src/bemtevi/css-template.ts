import * as goober from "goober";
import { prefix } from "goober/prefixer";

goober.setup(undefined, prefix);

const STYLE_SHEET_CONTAINER = document.createElement("div");

export const gooberCSS = goober.css.bind({ target: STYLE_SHEET_CONTAINER });

export function extractLastCSSCreated() {
  const css = STYLE_SHEET_CONTAINER.textContent;
  STYLE_SHEET_CONTAINER.textContent = "";
  return css;
}
export function getLastCSSCreated() {
  return STYLE_SHEET_CONTAINER.textContent;
}

const lastStyleTextAdded: string[] = [];

export function applyLastCSSCreated() {
  const css = extractLastCSSCreated();
  if (css && !lastStyleTextAdded.includes(css)) {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    lastStyleTextAdded.push(css);

    return true;
  }
  return false;
}
