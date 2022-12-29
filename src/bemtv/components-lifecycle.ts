import ComponentInst from "./component-inst";
import { isRouterComponent } from "./is-router-component";

export function dispatchInitedLifeCycle(c: ComponentInst) {
  c.inited = true;
  c.initCallbacks?.forEach((f) => f());
  c.initCallbacks?.clear();
}
export function dispatchUpdatedLifeCycle(c: ComponentInst) {
  c.updatedCallbacks?.forEach((f) => f());

  if (isRouterComponent(c.name)) {
    c.parent && dispatchUpdatedLifeCycle(c.parent);
  }
}

export function dispatchMountedLifeCycle(c: ComponentInst) {
  c.mounted = true;
  c.mountedCallbacks?.forEach((f) => f());
  c.mountedCallbacks?.clear();
}

export function dispatchUnmountedLifeCycle(c: ComponentInst) {
  c.unmounted = true;
  c.unmountedCallbacks?.forEach((f) => f());
  c.unmountedCallbacks?.clear();
}
