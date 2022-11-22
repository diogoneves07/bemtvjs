import { BEMTEVI_CSS_IN_JS } from "./globals";
import { ComponentListener } from "./types/listeners";
import { Listeners } from "./types/listeners";
import insertDOMListener from "./insert-dom-listener";
import { css } from "goober";
import { applyElementCSS } from "./work-with-el-manager";

type CSSInJSParameters = Parameters<typeof BEMTEVI_CSS_IN_JS["gooberCSS"]>;
export interface ManageElData<E> {
  DOMlisteners: Set<ComponentListener>;
  element: E | null;
  CSSClasses: string[];
  applyCSSWhenElementIsAvallable: CSSInJSParameters[];
}

export const ALL_ELEMENTS_MANAGER = new WeakMap<Element, ManageEl>();
export interface ManageEl<E extends Element = Element> extends Listeners {}

export class ManageEl<E = Element> {
  protected readonly __data: ManageElData<E> = {
    DOMlisteners: new Set(),
    CSSClasses: [],
    applyCSSWhenElementIsAvallable: [],
    element: null,
  };

  public set it(newIt: E | null) {
    const d = this.__data;
    if (!newIt || d.element === newIt) return;

    ALL_ELEMENTS_MANAGER.set(newIt as Element, this);

    if (d.element) {
      d.DOMlisteners.forEach((o) => {
        o.removeListener && o.removeListener();
      });
    }

    d.DOMlisteners.forEach((o) => {
      o.removeListener = insertDOMListener(newIt, o.listener, ...o.args);
      return o;
    });

    for (const callCSS of d.applyCSSWhenElementIsAvallable.slice()) {
      d.CSSClasses.push(applyElementCSS(newIt, callCSS));
    }

    d.CSSClasses.length > 0 && newIt && newIt.classList.add(...d.CSSClasses);

    d.applyCSSWhenElementIsAvallable = [];
    d.element = newIt;
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
