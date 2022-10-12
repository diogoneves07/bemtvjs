import { KEY_ATTRIBUTE_NAME } from "./globals";
import { ComponentThis } from "./components-this";
import insertEventListener from "./insert-event-listener";
import { getManagerElData } from "./manager-el";

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

export function defineComponentThisFirstElement(
  componentThis: ComponentThis,
  newValue: Element | null
) {
  const d = getComponentThisData(componentThis);

  if (!newValue || d.firstElement === newValue) return;

  [...d.listeners].map((o) => {
    o.removeListener = insertEventListener(newValue, o.listener, ...o.args);
    return o;
  });

  d.firstElement = newValue;
}

export function getElementsForElsManager(this: ComponentThis) {
  const els = getComponentThisData(this).els;

  for (const el of els) {
    el.it = document.querySelector(
      `[${KEY_ATTRIBUTE_NAME}="${getManagerElData(el).key}"]`
    );
  }
}
