import { BEMTEVI_CSS_IN_JS } from "./globals";
import { ComponentListener } from "./types/listeners";
import { Listeners } from "./types/listeners";
import insertDOMListener from "./insert-dom-listener";
import { css } from "goober";
import { applyElementCSS } from "./work-with-element-inst";
import { CSSClass } from "./css-classes";

type Styles = Partial<HTMLElement["style"]>;
export interface ElementInstData<E> {
  DOMlisteners: Set<ComponentListener>;
  element: E | null;
  CSSClasses: Set<string>;
  inlineStyles: Set<Styles>;
}

export const ALL_ELEMENTS_MANAGER = new WeakMap<Element, ElementInst>();
export interface ElementInst<E extends Element = Element> extends Listeners {}

function setElementInlineStyle(styles: Styles, element: Element) {
  Object.keys(styles).forEach((k) => {
    (element as unknown as HTMLElement).style.setProperty(
      k,
      (styles as any)[k]
    );
  });
}
export class ElementInst<E = Element> {
  protected readonly __data: ElementInstData<E> = {
    DOMlisteners: new Set(),
    CSSClasses: new Set(),
    inlineStyles: new Set(),
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

    this.__data.inlineStyles.forEach((s) => setElementInlineStyle(s, newIt));

    d.CSSClasses.size > 0 && newIt && newIt.classList.add(...d.CSSClasses);

    BEMTEVI_CSS_IN_JS.applyLastCSSCreated();

    this.__data.inlineStyles.clear();
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
  css(...args: Parameters<typeof css>): CSSClass {
    const element = this.it;

    const classValue = BEMTEVI_CSS_IN_JS.gooberCSS(...args);

    const classInst = new CSSClass(classValue);

    classInst._onRemove(() => {
      this.__data.CSSClasses.delete(classValue);
    });

    if (!element) {
      this.__data.CSSClasses.add(classValue);

      return classInst;
    }

    this.__data.CSSClasses.add(applyElementCSS(element, args));

    return classInst;
  }

  style(styles: Styles) {
    const element = this.it;

    if (!element) {
      this.__data.inlineStyles.add({ ...styles });
    } else {
      setElementInlineStyle(styles, element);
    }

    return this;
  }
}
