import { ElementInst } from "../element-inst";
import { ElementInstFactory } from "../element-inst-factory";

/**
 * Creates and returns an instance to manipulate a real DOM element.
 * @param elementOrSelector
 *
 * A DOM element or selector(same as `document.querySelector()`).
 */
export function createElementInst<E extends Element = Element>(
  elementOrSelector: Element | string
): ElementInst<E> {
  if (elementOrSelector instanceof Element) {
    return createElementInstFromElement<E>(elementOrSelector);
  }

  return createElementInstFromElement<E>(
    document.querySelector(elementOrSelector)
  );
}

export function createElementInstFromElement<E extends Element = Element>(
  e: Element | null
): ElementInst<E> {
  const elementInst = ElementInstFactory<E>();

  elementInst.el = e as E;

  return elementInst;
}
