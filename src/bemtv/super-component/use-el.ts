import {
  KEY_ATTRIBUTE_NAME,
  LIBRARY_NAME_IN_ERRORS_MESSAGE,
} from "./../../globals";
import { ElementInst } from "./../element-inst";
import {
  generateForcedKeyAttr,
  getForcedAttrValue,
  normalizeElKeyAttr,
} from "../generate-forced-el-attrs";
import { getComponentInstRunningOnTop } from "../component-inst-in-top";
import {
  getComponentInstFirstElement,
  getComponentInstNodes,
} from "./work-with-super-component";
import ComponentInst from "../component-inst";
import { ElementInstFactory } from "../element-inst-factory";

export type ElementInstConnected<E extends Element> = Omit<
  ElementInst<E>,
  "el"
> & { el: E };

export type ElementInstFn<E extends Element = Element> = {
  (): ElementInstConnected<E>;
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
 * Creates an instance to manage a real DOM element.
 */
export function useElementInst<E extends Element = Element>() {
  const cache = new Map<string | Element, ElementInst>();
  const key = generateForcedKeyAttr();

  const fn = (() => {
    const v = normalizeElKeyAttr(getForcedAttrValue(key));
    const c = getComponentInstRunningOnTop();

    if (!c)
      throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} “useElementInst()” must be used inside a callback known to the component so that it knows which component to get the element from.`;

    const keyCache = v + c.key;

    if (cache.has(keyCache))
      return cache.get(keyCache) as unknown as ElementInstConnected<E>;

    const elementInst = ElementInstFactory<E>();

    const fn = () => {
      const e = findElementInComponentNodes(c, v);

      elementInst.el = e as E;
    };

    c.onMountWithHighPriority(fn);

    c.onUpdateWithHighPriority(fn);

    cache.set(keyCache, elementInst);

    return elementInst as unknown as ElementInstConnected<E>;
  }) as ElementInstFn<E>;

  fn.key = key;

  return fn;
}

const useFirstElementInstCache = new WeakMap<ComponentInst, ElementInst>();

export function useFirstElementInst<E extends Element = Element>() {
  const c = getComponentInstRunningOnTop();

  const has = c && useFirstElementInstCache.get(c);

  if (has) return has as unknown as ElementInstConnected<E>;

  if (!c)
    throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} useFirstElementInst()” must be used inside a callback known to the component so that it knows which component to get the element from.`;

  const elementInst = ElementInstFactory<E>();

  const fn = () => {
    const e = getComponentInstFirstElement(c);

    elementInst.el = e as E;
  };

  c.onMountWithHighPriority(fn);

  c.onUpdateWithHighPriority(fn);

  useFirstElementInstCache.set(c, elementInst);

  return elementInst as unknown as ElementInstConnected<E>;
}
