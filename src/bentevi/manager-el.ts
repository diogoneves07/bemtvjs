import { ComponentListener } from "./types/listeners";
import { applyLastCSSCreated, gooberCSS } from "./css-template";
import { Listeners } from "./types/listeners";
import insertEventListener from "./insert-event-listener";
import { css } from "goober";

interface ManagerElData<E> {
  listeners: Set<ComponentListener>;
  element: E | null;
  CSSClasses: string[];
  applyCSSWhenElementIsAvallable: Parameters<typeof gooberCSS>[];
}
function applyElementCSS(el: Element, args: Parameters<typeof gooberCSS>) {
  applyLastCSSCreated();
  const c = gooberCSS(...args);
  el.classList.add(c);

  return c;
}
export function getManagerElData(m: ManagerEl) {
  return (m as any).__data;
}

export const ALL_ELEMENTS_MANAGER = new WeakMap<Element, ManagerEl>();
export interface ManagerEl<E extends Element = Element> extends Listeners {}

export class ManagerEl<E = Element> {
  readonly key: string;

  protected readonly __data: ManagerElData<E> = {
    listeners: new Set(),
    CSSClasses: [],
    applyCSSWhenElementIsAvallable: [],
    element: null,
  };

  public set _(v: E | null) {
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

  public get _() {
    return this.__data.element;
  }

  constructor(key: string) {
    this._ = null;
    this.key = key;
    return this;
  }

  css(...args: Parameters<typeof css>) {
    const element = this._;

    if (!element) {
      this.__data.applyCSSWhenElementIsAvallable.push(args);
      return this;
    }
    applyElementCSS(element, args);

    return this;
  }
  protected __reapplyCSSClasses() {
    const element = this._;

    if (!element) return;
    for (const c of this.__data.CSSClasses) {
      element.classList.add(c);
    }
  }
}
