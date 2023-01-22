import { BEMTEVI_CSS_IN_JS } from "./globals";
import { SimpleComponentDOMListener } from "./types/listeners";
import { Listeners } from "./types/listeners";
import insertDOMListener from "./insert-dom-listener";
import { css } from "goober";
import { applyElementCSS } from "./work-with-element-manager";
import { CSSClass, onRemoveClass } from "./css-classes";
// import { ObserverSystem } from "./observers-system";

export interface ElementManagerData<E = Element> {
  DOMListeners: Set<SimpleComponentDOMListener>;
  element: E | null;
  CSSClasses: Set<string>;
  //onceItConnectedObservers: ObserverSystem<(el: Element) => void>;
  //onItUpdateObservers: ObserverSystem<(el: Element | null) => void>;
}

export interface ElementManager<E extends Element = Element>
  extends Listeners {}

export class ElementManager<E = Element> {
  protected readonly __data: ElementManagerData<E> = {
    DOMListeners: new Set(),
    CSSClasses: new Set(),
    element: null,
    // onceItConnectedObservers: new ObserverSystem(),
    // onItUpdateObservers: new ObserverSystem(),
  };
  set el(newIt: E | null) {
    const d = this.__data;
    const lastElement = d.element;
    const istheSame = lastElement === newIt;

    d.element = newIt || null;

    //  !istheSame && d.onItUpdateObservers.dispatch(newIt);

    if (!istheSame && lastElement) {
      d.DOMListeners.forEach((o) => {
        o.removeListener && o.removeListener();
      });
    }

    if (!newIt || istheSame) return;

    d.DOMListeners.forEach((o) => {
      o.removeListener = insertDOMListener(newIt, o.listener, o.fn, o.options);
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
  get el() {
    return this.__data.element;
  }

  constructor() {
    this.el = null;
    return this;
  }

  /**
   * Allows to apply style to  the element.
   */
  css(...args: Parameters<typeof css>): CSSClass {
    const element = this.el;

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
