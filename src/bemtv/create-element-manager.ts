import { ElementManager } from "./element-manager";
import { ElementManagerFactory } from "./element-inst-manager";

/**
 * Creates and returns an instance to manipulate a real DOM element.
 * @param elementOrSelector
 *
 * A DOM element or selector(same as `document.querySelector()`).
 */
export function createElManager<E extends Element = Element>(
  elementOrSelector: Element | string
): ElementManager<E> {
  if (elementOrSelector instanceof Element) {
    return createElManagerFromElement<E>(elementOrSelector);
  }

  return createElManagerFromElement<E>(
    document.querySelector(elementOrSelector)
  );
}

export function createElManagerFromElement<E extends Element = Element>(
  e: Element | null
): ElementManager<E> {
  const elementManager = ElementManagerFactory<E>();

  elementManager.el = e as E;

  return elementManager;
}
