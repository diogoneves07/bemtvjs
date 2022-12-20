import { KEY_ATTRIBUTE_NAME } from "../../globals";
import getElement from "../../utilities/get-element";
import ComponentInst from "../component-inst";
import {
  getForcedAttrValue,
  isForcedAttr,
  normalizeElKeyAttr,
} from "../generate-forced-el-attrs";
import { ElementInst } from "../element-inst";
import { ManageElFactory } from "../element-inst-factory";

function findElementInComponentNodes(
  nodes: Node[] | Element[],
  elKey: string
): Element | undefined {
  for (const n of nodes) {
    if (!(n instanceof Element)) continue;

    const has = n.getAttribute(KEY_ATTRIBUTE_NAME);

    if (has && has.includes(elKey)) return n;

    const c = findElementInComponentNodes(Array.from(n.children), elKey);

    if (c) return c;
  }
  return;
}

export default function createElManager<E extends Element = Element>(
  keyOrSelectorOrElement: string | Element,
  c: ComponentInst | null
): ElementInst<E> {
  const elManager = ManageElFactory<E>();

  if (keyOrSelectorOrElement instanceof Element) {
    elManager.it = getElement(keyOrSelectorOrElement) as E | null;
    return elManager;
  }

  if (!isForcedAttr(keyOrSelectorOrElement)) {
    elManager.it = getElement(keyOrSelectorOrElement) as E | null;
    return elManager;
  }

  if (!c) return elManager;

  const elKey = normalizeElKeyAttr(getForcedAttrValue(keyOrSelectorOrElement));

  let element = findElementInComponentNodes(c.nodes, elKey) as E;

  if (!element && !c.mounted) {
    c.onMountWithHighPriority(() => {
      if (!elManager.it) {
        elManager.it =
          (findElementInComponentNodes(c.nodes, elKey) as E) || null;
      }
    });
  }

  c.onUpdateWithHighPriority(() => {
    const e = elManager.it;
    const f = (findElementInComponentNodes(c.nodes, elKey) as E) || null;

    if (e !== f) elManager.it = f;
  });

  elManager.it = element;

  return elManager;
}
