import { BEMTEVI_CSS_IN_JS } from "./globals";
import { ComponentListener } from "./types/listeners";
import { Listeners } from "./types/listeners";
import insertEventListener from "./insert-event-listener";
import { css } from "goober";

type CSSInJSParameters = Parameters<typeof BEMTEVI_CSS_IN_JS["gooberCSS"]>;
interface ManagerElData<E> {
  listeners: Set<ComponentListener>;
  element: E | null;
  CSSClasses: string[];
  applyCSSWhenElementIsAvallable: CSSInJSParameters[];
  reapplyCSSClasses: (m: ManagerEl) => void;
  key: string;
}
export const ALL_ELEMENTS_MANAGER = new WeakMap<Element, ManagerEl>();
export interface ManagerEl<E extends Element = Element> extends Listeners {}
export class ManagerEl<E = Element> {
  protected readonly __data: ManagerElData<E> = {
    listeners: new Set(),
    CSSClasses: [],
    applyCSSWhenElementIsAvallable: [],
    element: null,
    reapplyCSSClasses,
    key: "",
  };

  public set it(v: E | null) {
    if (!v || this.__data.element === v) return;

    ALL_ELEMENTS_MANAGER.set(v as Element, this);

    [...this.__data.listeners].map((o) => {
      o.removeListener = insertEventListener(v, o.listener, ...o.args);
      return o;
    });

    for (const callCSS of this.__data.applyCSSWhenElementIsAvallable.slice()) {
      this.__data.CSSClasses.push(applyElementCSS(v, callCSS));
    }
    this.__data.applyCSSWhenElementIsAvallable = [];
    this.__data.element = v;
  }

  public get it() {
    return this.__data.element;
  }

  constructor(key: string) {
    this.it = null;
    this.__data.key = key;
    return this;
  }

  css(...args: Parameters<typeof css>) {
    const element = this.it;

    if (!element) {
      this.__data.applyCSSWhenElementIsAvallable.push(args);
      return this;
    }
    applyElementCSS(element, args);

    return this;
  }
}

export function getManagerElData(m: ManagerEl) {
  return (m as any).__data as ManagerEl["__data"];
}

function applyElementCSS(el: Element, args: CSSInJSParameters) {
  BEMTEVI_CSS_IN_JS.applyLastCSSCreated();
  const c = BEMTEVI_CSS_IN_JS.gooberCSS(...args);
  el.classList.add(c);

  return c;
}
function reapplyCSSClasses(m: ManagerEl) {
  const element = m.it;

  if (!element) return;
  for (const c of getManagerElData(m).CSSClasses) {
    element.classList.add(c);
  }
}
