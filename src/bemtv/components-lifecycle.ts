import SimpleComponent from "./simple-component";
import { isRouterComponent } from "./is-router-component";

export function dispatchInitedLifeCycle(c: SimpleComponent) {
  c.inited = true;
  c.onInitObservers.dispatch();
  c.onInitObservers.clear();
}
export function dispatchUpdatedLifeCycle(c: SimpleComponent) {
  c.onUpdatedObservers.dispatch();

  if (isRouterComponent(c.name)) {
    c.parent && dispatchUpdatedLifeCycle(c.parent);
  }
}

export function dispatchMountedLifeCycle(c: SimpleComponent) {
  c.mounted = true;
  c.onMountedObservers.dispatch();
  c.onMountedObservers.clear();
}

export function dispatchUnmountedLifeCycle(c: SimpleComponent) {
  c.unmounted = true;
  c.onUnmountedObservers.dispatch();
  c.onUnmountedObservers.clear();
}
