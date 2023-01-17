import { BEMTEVI_CSS_IN_JS } from "./globals";
import { ComponentListener } from "./types/listeners";
import { Listeners } from "./types/listeners";
import insertDOMListener from "./insert-dom-listener";
import { css } from "goober";
import { applyElementCSS } from "./work-with-element-inst";
import { CSSClass, onRemoveClass } from "./css-classes";
// import { ObserverSystem } from "./observers-system";

export interface ElementInstData<E = Element> {
  DOMlisteners: Set<ComponentListener>;
  element: E | null;
  CSSClasses: Set<string>;
  //onceItConnectedObservers: ObserverSystem<(el: Element) => void>;
  //onItUpdateObservers: ObserverSystem<(el: Element | null) => void>;
}

export interface ElementInst<E extends Element = Element> extends Listeners {}

export class ElementInst<E = Element> {
  protected readonly __data: ElementInstData<E> = {
    DOMlisteners: new Set(),
    CSSClasses: new Set(),
    element: null,
    // onceItConnectedObservers: new ObserverSystem(),
    // onItUpdateObservers: new ObserverSystem(),
  };

  public set it(newIt: E | null) {
    const d = this.__data;
    const lastElement = d.element;
    const istheSame = lastElement === newIt;

    d.element = newIt || null;

    //  !istheSame && d.onItUpdateObservers.dispatch(newIt);

    if (lastElement) {
      d.DOMlisteners.forEach((o) => {
        o.removeListener && o.removeListener();
      });
    }

    if (!newIt || istheSame) return;

    d.DOMlisteners.forEach((o) => {
      o.removeListener = insertDOMListener(newIt, o.listener, ...o.args);
      return o;
    });

    d.CSSClasses.size > 0 && newIt && newIt.classList.add(...d.CSSClasses);

    BEMTEVI_CSS_IN_JS.applyLastCSSCreated();

    //  d.onceItConnectedObservers.dispatch(newIt);

    //  d.onceItConnectedObservers.clear();
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
  css(...args: Parameters<typeof css>): CSSClass {
    const element = this.it;

    const classValue = BEMTEVI_CSS_IN_JS.gooberCSS(...args);

    const classInst = new CSSClass(classValue);

    onRemoveClass(classInst, () => {
      this.__data.CSSClasses.delete(classValue);
    });

    if (!element) {
      this.__data.CSSClasses.add(classValue);

      return classInst;
    }

    this.__data.CSSClasses.add(applyElementCSS(element, args));

    return classInst;
  }

  /* onceItConnected(fn: (el: E) => void) {
    if (this.el) {
      fn(this.el);
      return this;
    }

    this.__data.onceItConnectedObservers.add(fn as any);

    return this;
  }

  onItUpdate(fn: (el: E | null) => void): RemoveOnItUpdate {
    const onItUpdateObservers = this.__data.onItUpdateObservers;

    onItUpdateObservers.add(fn as any);

    return () => {
      onItUpdateObservers.delete(fn as any);
    };
  }*/
}
