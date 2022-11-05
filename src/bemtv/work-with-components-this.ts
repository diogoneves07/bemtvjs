import { ComponentThis } from "./components-this";

export function getComponentThisData(componentThis: ComponentThis) {
  return (componentThis as any).__data as ComponentThis["__data"];
}

export function dispatchInitedLifeCycle(componentThis: ComponentThis) {
  const data = getComponentThisData(componentThis);
  data.initFns.forEach((f) => f());
  data.initFns.clear();
}
export function dispatchUpdatedLifeCycle(componentThis: ComponentThis) {
  const data = getComponentThisData(componentThis);

  data.updatedFns?.forEach((f) => f());

  if (componentThis.name === "Router") {
    data.parent && dispatchUpdatedLifeCycle(data.parent);
  }
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
