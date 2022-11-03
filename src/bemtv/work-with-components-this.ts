import { KEY_ATTRIBUTE_NAME } from "./globals";
import { ComponentThis } from "./components-this";
import { getManagerElData } from "./work-with-manager-el";
import { ManagerEl } from "./manager-el";

export function getComponentThisData(componentThis: ComponentThis) {
  return (componentThis as any).__data as ComponentThis["__data"];
}

export function dispatchInitedLifeCycle(componentThis: ComponentThis) {
  const data = getComponentThisData(componentThis);
  data.initFns.forEach((f) => f());
  data.initFns.clear();
}
export function dispatchUpdatedLifeCycle(componentThis: ComponentThis) {
  getComponentThisData(componentThis).updatedFns?.forEach((f) => f());
}

export function dispatchMountedLifeCycle(componentThis: ComponentThis) {
  const data = getComponentThisData(componentThis);
  data.mounted = true;
  data.mountedFns.forEach((f) => f());
  data.mountedFns.clear();
}

export function dispatchUnmountedLifeCycle(componentThis: ComponentThis) {
  const data = getComponentThisData(componentThis);
  data.unmountedFns?.forEach((f) => f());
  data.unmountedFns?.clear();
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
