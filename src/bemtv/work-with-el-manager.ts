import { BEMTEVI_CSS_IN_JS } from "./globals";
import { ManageEl } from "./manage-el";

type CSSInJSParameters = Parameters<typeof BEMTEVI_CSS_IN_JS["gooberCSS"]>;

export function getManageElData(m: ManageEl) {
  return (m as any).__data as ManageEl["__data"];
}

export function applyElementCSS(el: Element, args: CSSInJSParameters) {
  const c = BEMTEVI_CSS_IN_JS.gooberCSS(...args);
  el.classList.add(c);

  BEMTEVI_CSS_IN_JS.applyLastCSSCreated();

  return c;
}
