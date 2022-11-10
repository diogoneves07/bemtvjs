import getElement from "../../utilities/get-element";
import ComponentInst from "../component-inst";
import { getElKeyValue, isElKey } from "../generate-el-key";
import { KEY_ATTRIBUTE_NAME } from "../globals";
import { ManageEl } from "../manage-el";
import { ManageElFactory } from "../manage-el-factory";

function findElementInComponentNodes(nodes: Node[], elKey: string) {
  return nodes.find((n) => {
    if (!(n instanceof Element)) return;
    if (!n.hasAttribute(KEY_ATTRIBUTE_NAME)) return;
    if (!n.getAttribute(KEY_ATTRIBUTE_NAME)?.includes(elKey)) return;

    return true;
  });
}
export default function createElManager<E extends Element = Element>(
  keyOrSelectorOrElement: string | Element,
  c: ComponentInst | null
): ManageEl<E> {
  const elManager = ManageElFactory<E>();

  if (keyOrSelectorOrElement instanceof Element) {
    elManager.it = getElement(keyOrSelectorOrElement) as E | null;
    return elManager;
  }

  if (!isElKey(keyOrSelectorOrElement)) {
    elManager.it = getElement(keyOrSelectorOrElement) as E | null;
    return elManager;
  }

  if (!c) return elManager;

  const elKey = getElKeyValue(keyOrSelectorOrElement);

  let element = findElementInComponentNodes(c.nodes, elKey) as E;

  if (!element) {
    c.onMountWithHighPriority(() => {
      if (!elManager.it) {
        elManager.it =
          (findElementInComponentNodes(c.nodes, elKey) as E) || null;
      }
    });
    return elManager;
  }
  elManager.it = element;

  return elManager;
}
