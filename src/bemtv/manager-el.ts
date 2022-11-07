import { BEMTEVI_CSS_IN_JS } from "./globals";
import { ComponentListener } from "./types/listeners";
import { Listeners } from "./types/listeners";
import insertDOMListener from "./insert-dom-listener";
import { css } from "goober";
import { applyElementCSS } from "./work-with-manager-el";

type CSSInJSParameters = Parameters<typeof BEMTEVI_CSS_IN_JS["gooberCSS"]>;
export interface ManagerElData<E> {
  DOMlisteners: Set<ComponentListener>;
  element: E | null;
  CSSClasses: string[];
  applyCSSWhenElementIsAvallable: CSSInJSParameters[];
}

export const ALL_ELEMENTS_MANAGER = new WeakMap<Element, ManagerEl>();
export interface ManagerEl<E extends Element = Element> extends Listeners {}

export class ManagerEl<E = Element> {
  protected readonly __data: ManagerElData<E> = {
    DOMlisteners: new Set(),
    CSSClasses: [],
    applyCSSWhenElementIsAvallable: [],
    element: null,
  };

  public set it(newIt: E | null) {
    if (!newIt || this.__data.element === newIt) return;

    ALL_ELEMENTS_MANAGER.set(newIt as Element, this);

    if (this.__data.element) {
      this.__data.DOMlisteners.forEach(
        (o) => o.removeListener && o.removeListener()
      );
    }

    this.__data.DOMlisteners.forEach((o) => {
      o.removeListener = insertDOMListener(newIt, o.listener, ...o.args);
      return o;
    });

    for (const callCSS of this.__data.applyCSSWhenElementIsAvallable.slice()) {
      this.__data.CSSClasses.push(applyElementCSS(newIt, callCSS));
    }

    newIt && newIt.classList.add(...this.__data.CSSClasses);

    this.__data.applyCSSWhenElementIsAvallable = [];
    this.__data.element = newIt;
  }

  /**
   * The real DOM element.
   */
  public get it() {
    return this.__data.element;
  }

  constructor() {
    this.it = null;
    return this;
  }

  /**
   * Allows to apply style to element.
   */
  css(...args: Parameters<typeof css>) {
    const element = this.it;

    if (!element) {
      this.__data.applyCSSWhenElementIsAvallable.push(args);
      return this;
    }
    this.__data.CSSClasses.push(applyElementCSS(element, args));

    return this;
  }
}
