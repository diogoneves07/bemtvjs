import { BEMTEVI_CSS_IN_JS } from "./globals";
import { ElementInst } from "./element-inst";

type CSSInJSParameters = Parameters<typeof BEMTEVI_CSS_IN_JS["gooberCSS"]>;

export function getElementInstData(m: ElementInst) {
  return (m as any).__data as ElementInst["__data"];
}

export function applyElementCSS(el: Element, args: CSSInJSParameters) {
  const c = BEMTEVI_CSS_IN_JS.gooberCSS(...args);

  !el.classList.contains(c) && el.classList.add(c);

  BEMTEVI_CSS_IN_JS.applyLastCSSCreated();

  return c;
}
