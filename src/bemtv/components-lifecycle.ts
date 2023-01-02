import ComponentInst from "./component-inst";
import { isRouterComponent } from "./is-router-component";

export function dispatchInitedLifeCycle(c: ComponentInst) {
  c.inited = true;
  c.onInitObservers.dispatch();
  c.onInitObservers.clear();
}
export function dispatchUpdatedLifeCycle(c: ComponentInst) {
  c.onUpdatedObservers.dispatch();

  if (isRouterComponent(c.name)) {
    c.parent && dispatchUpdatedLifeCycle(c.parent);
  }
}

export function dispatchMountedLifeCycle(c: ComponentInst) {
  c.mounted = true;
  c.onMountedObservers.dispatch();
  c.onMountedObservers.clear();
}

export function dispatchUnmountedLifeCycle(c: ComponentInst) {
  c.unmounted = true;
  c.onUnmountedObservers.dispatch();
  c.onUnmountedObservers.clear();
}
