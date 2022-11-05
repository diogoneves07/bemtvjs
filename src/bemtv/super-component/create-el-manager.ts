import getElement from "../../utilities/get-element";
import ComponentManager from "../component-manager";
import { ALL_COMPONENTS_MANAGER } from "../component-manager-store";
import { ComponentInst } from "../components-inst";
import { getElKeyValue, isElKey } from "../generate-el-key";
import { KEY_ATTRIBUTE_NAME } from "../globals";
import { ManagerEl } from "../manager-el";
import { ManagerElFactory } from "../manager-el-factory";

export default function createElManager<E extends Element = Element>(
  keyOrSelectorOrElement: string | Element,
  c: ComponentInst | null
): ManagerEl<E> {
  const managerEl = ManagerElFactory<E>();

  if (keyOrSelectorOrElement instanceof Element) {
    managerEl.it = getElement(keyOrSelectorOrElement) as E | null;
    return managerEl;
  }

  if (!isElKey(keyOrSelectorOrElement)) {
    managerEl.it = getElement(keyOrSelectorOrElement) as E | null;
    return managerEl;
  }

  if (!c) return managerEl;

  const elKey = getElKeyValue(keyOrSelectorOrElement);
  let componentManager: ComponentManager | undefined;

  for (const m of ALL_COMPONENTS_MANAGER) {
    componentManager = m;
    if (m.componentInst === c) break;
  }

  if (!componentManager) return managerEl;

  let element = componentManager.nodes.find((n) => {
    if (!(n instanceof Element)) return;
    if (!n.hasAttribute(KEY_ATTRIBUTE_NAME)) return;
    if (!n.getAttribute(KEY_ATTRIBUTE_NAME)?.includes(elKey)) return;

    return true;
  }) as E;
  managerEl.it = element;
  return managerEl;
}
