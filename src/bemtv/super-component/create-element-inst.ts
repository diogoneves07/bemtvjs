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

  elementInst.el = e as E;

  return elementInst;
}
