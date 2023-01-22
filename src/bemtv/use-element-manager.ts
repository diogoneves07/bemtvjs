import { KEY_ATTRIBUTE_NAME, LIBRARY_NAME_IN_ERRORS_MESSAGE } from "../globals";
import { ElementManager } from "./element-manager";
import {
  generateForcedKeyAttr,
  getForcedAttrValue,
  normalizeElKeyAttr,
} from "./generate-forced-el-attrs";
import { getComponentInstRunningOnTop } from "./component-inst-on-top";
import {
  getComponentInstFirstElement,
  getComponentInstNodes,
} from "./super-component/work-with-super-component";
import ComponentInst from "./component-inst";
import { ElementManagerFactory } from "./element-inst-manager";

export type ElementManagerConnected<E extends Element> = Omit<
  ElementManager<E>,
  "el"
> & { el: E };

export type ElementManagerFn<E extends Element = Element> = {
  (): ElementManagerConnected<E>;
  key: string;
};

function findElementInComponentNodes(
  v: ComponentInst | Node[],
  elKey: string
): Element | undefined {
  const nodes = v instanceof ComponentInst ? getComponentInstNodes(v) : v;

  for (const n of nodes) {
    if (!(n instanceof Element)) continue;

    const has = n.getAttribute(KEY_ATTRIBUTE_NAME);

    if (has && has.includes(elKey)) return n;

    const c = findElementInComponentNodes(Array.from(n.children), elKey);

    if (c) return c;
  }
  return;
}

/**
 * Allows access to an instance with methods and properties to manage a real DOM element.
 *
 * @returns
 * A function that when called returns the instance
 * that manipulates the element to which it has been bound.
 */
export function useElManager<E extends Element = Element>() {
  const cache = new Map<string | Element, ElementManager>();
  const key = generateForcedKeyAttr();

  const fn = (() => {
    const v = normalizeElKeyAttr(getForcedAttrValue(key));
    const c = getComponentInstRunningOnTop();

    if (!c)
      throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} “useElManager()” must be used inside a callback known to the component so that it knows which component to get the element from.`;

    const keyCache = v + c.key;

    if (cache.has(keyCache))
      return cache.get(keyCache) as unknown as ElementManagerConnected<E>;

    const elementManager = ElementManagerFactory<E>();

    const fn = () => {
      const e = findElementInComponentNodes(c, v);

      elementManager.el = e as E;
    };

    c.onMountWithHighPriority(fn);

    c.onUpdateWithHighPriority(fn);

    cache.set(keyCache, elementManager);

    return elementManager as unknown as ElementManagerConnected<E>;
  }) as ElementManagerFn<E>;

  fn.key = key;

  return fn;
}

const useFirstElManagerCache = new WeakMap<ComponentInst, ElementManager>();

/**
 * Returns an instance that can manipulate the
 * first element in the DOM of the component that called the function.
 */
export function useFirstElManager<E extends Element = Element>() {
  const c = getComponentInstRunningOnTop();

  const has = c && useFirstElManagerCache.get(c);

  if (has) return has as unknown as ElementManagerConnected<E>;

  if (!c)
    throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} useFirstElManager()” must be used inside a callback known to the component so that it knows which component to get the element from.`;

  const elementManager = ElementManagerFactory<E>();

  const fn = () => {
    const e = getComponentInstFirstElement(c);

    elementManager.el = e as E;
  };

  c.onMountWithHighPriority(fn);

  c.onUpdateWithHighPriority(fn);

  useFirstElManagerCache.set(c, elementManager);

  return elementManager as unknown as ElementManagerConnected<E>;
}
