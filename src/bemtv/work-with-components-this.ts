import { KEY_ATTRIBUTE_NAME } from "./globals";
import { ComponentThis } from "./components-this";
import { getManagerElData } from "./work-with-manager-el";
import { ManagerEl } from "./manager-el";

export function getComponentThisData(componentThis: ComponentThis) {
  return componentThis.__data;
}
export function dispatchUpdatedLifeCycle(componentThis: ComponentThis) {
  getComponentThisData(componentThis).updatedFns?.forEach((f) => f());
}

export function dispatchMountedLifeCycle(componentThis: ComponentThis) {
  getComponentThisData(componentThis).mounted = true;

  getComponentThisData(componentThis).mountedFns?.forEach((f) => f());
}

export function dispatchUnmountedLifeCycle(componentThis: ComponentThis) {
  getComponentThisData(componentThis).unmountedFns?.forEach((f) => f());
}

export function getComponentThisProps(parent: ComponentThis, key: string) {
  return getComponentThisData(parent).propsDefined?.get(key);
}
export function isMounted(componentThis: ComponentThis) {
  return getComponentThisData(componentThis).mounted;
}

export function getElementsForElsManager(els: ManagerEl<Element>[]) {
  for (const el of els) {
    el.it =
      Array.from(document.querySelectorAll(`[${KEY_ATTRIBUTE_NAME}]`)).find(
        (n) =>
          n.getAttribute(KEY_ATTRIBUTE_NAME)?.includes(getManagerElData(el).key)
      ) || null;
  }
}
