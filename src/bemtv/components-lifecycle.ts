import ComponentInst from "./component-inst";

export function dispatchInitedLifeCycle(c: ComponentInst) {
  c.initFns.forEach((f) => f());
  c.initFns.clear();
}
export function dispatchUpdatedLifeCycle(c: ComponentInst) {
  c.updatedFns?.forEach((f) => f());

  if (c.name === "Router") {
    c.parent && dispatchUpdatedLifeCycle(c.parent);
  }
}

export function dispatchMountedLifeCycle(c: ComponentInst) {
  c.mounted = true;
  c.mountedFns.forEach((f) => f());
  c.mountedFns.clear();
}

export function dispatchUnmountedLifeCycle(c: ComponentInst) {
  c.unmountedFns?.forEach((f) => f());
  c.unmountedFns?.clear();
}
