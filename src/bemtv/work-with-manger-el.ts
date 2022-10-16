import { BEMTEVI_CSS_IN_JS } from "./globals";
import { ManagerEl } from "./manager-el";

type CSSInJSParameters = Parameters<typeof BEMTEVI_CSS_IN_JS["gooberCSS"]>;

export function getManagerElData(m: ManagerEl) {
  return (m as any).__data as ManagerEl["__data"];
}

export function applyElementCSS(el: Element, args: CSSInJSParameters) {
  BEMTEVI_CSS_IN_JS.applyLastCSSCreated();
  const c = BEMTEVI_CSS_IN_JS.gooberCSS(...args);
  el.classList.add(c);

  return c;
}
export function reapplyCSSClasses(m: ManagerEl) {
  const element = m.it;

  if (!element) return;
  for (const c of getManagerElData(m).CSSClasses) {
    element.classList.add(c);
  }
}
