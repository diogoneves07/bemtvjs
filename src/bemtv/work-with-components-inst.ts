import { ComponentInst } from "./components-inst";

export function getComponentInstData(componentInst: ComponentInst) {
  return (componentInst as any).__data as ComponentInst["__data"];
}

export function dispatchInitedLifeCycle(componentInst: ComponentInst) {
  const data = getComponentInstData(componentInst);
  data.initFns.forEach((f) => f());
  data.initFns.clear();
}
export function dispatchUpdatedLifeCycle(componentInst: ComponentInst) {
  const data = getComponentInstData(componentInst);

  data.updatedFns?.forEach((f) => f());

  if (componentInst.name === "Router") {
    data.parent && dispatchUpdatedLifeCycle(data.parent);
  }
}

export function dispatchMountedLifeCycle(componentInst: ComponentInst) {
  const data = getComponentInstData(componentInst);
  data.mounted = true;
  data.mountedFns.forEach((f) => f());
  data.mountedFns.clear();
}

export function dispatchUnmountedLifeCycle(componentInst: ComponentInst) {
  const data = getComponentInstData(componentInst);
  data.unmountedFns?.forEach((f) => f());
  data.unmountedFns?.clear();
}

export function getComponentInstProps(parent: ComponentInst, key: string) {
  return getComponentInstData(parent).propsDefined?.get(key);
}
export function isMounted(componentInst: ComponentInst) {
  return getComponentInstData(componentInst).mounted;
}
