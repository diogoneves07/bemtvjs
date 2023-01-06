import { KEY_ATTRIBUTE_NAME } from "../../globals";
import getElement from "../../utilities/get-element";
import ComponentInst from "../component-inst";
import {
  getForcedAttrValue,
  isForcedAttr,
  normalizeElKeyAttr,
} from "../generate-forced-el-attrs";
import { ElementInst } from "../element-inst";
import { ElementInstFactory } from "../element-inst-factory";
import { getComponentInstNodes } from "./work-with-super-component";

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

export default function createElementInst<E extends Element = Element>(
  keyOrSelectorOrElement: string | Element,
  c: ComponentInst | null
): ElementInst<E> {
  const elementInst = ElementInstFactory<E>();

  if (keyOrSelectorOrElement instanceof Element) {
    elementInst.it = getElement(keyOrSelectorOrElement) as E | null;
    return elementInst;
  }

  if (!isForcedAttr(keyOrSelectorOrElement)) {
    elementInst.it = getElement(keyOrSelectorOrElement) as E | null;
    return elementInst;
  }

  if (!c) return elementInst;

  const elKey = normalizeElKeyAttr(getForcedAttrValue(keyOrSelectorOrElement));

  let element = findElementInComponentNodes(c, elKey) as E;

  if (!element && !c.mounted) {
    c.onMountWithHighPriority(() => {
      if (!elementInst.it) {
        elementInst.it = (findElementInComponentNodes(c, elKey) as E) || null;
      }
    });
  }

  c.onUpdateWithHighPriority(() => {
    const e = elementInst.it;
    const f = (findElementInComponentNodes(c, elKey) as E) || null;

    if (e !== f) elementInst.it = f;
  });

  elementInst.it = element;

  return elementInst;
}
