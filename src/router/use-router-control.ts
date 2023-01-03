import { ALL_COMPONENTS_INST } from "./../bemtv/component-inst-store";
import ComponentInst from "../bemtv/component-inst";
import { ObserverSystem } from "../bemtv/observers-system";
import { isRouterComponent } from "../bemtv/is-router-component";

export type RemoveRouterControl = () => void;

export type RenderNewRoute = () => void;

export type RouterControlFn = (routerControl: RouterControl) => void;

export let isFirstRoute = { value: true };

export class RouterControl {
  componentName: string;
  renderNextRoute: () => this;
  isFirstRoute: boolean;

  isRendered = false;

  onLoadObservers = new ObserverSystem();

  constructor(name: string, renderNextRoute: () => void) {
    this.componentName = name;
    this.renderNextRoute = () => {
      renderNextRoute();
      isFirstRoute.value = false;

      const routerInst = [...ALL_COMPONENTS_INST].find((i) =>
        isRouterComponent(i.name)
      );

      routerInst &&
        routerInst.onUpdate(() => {
          if (
            [...routerInst.componentsInTemplate].find((i) => i.name === name)
          ) {
            this.isRendered = true;
            this.onLoadObservers.dispatch();
          }
        });

      return this;
    };
    this.isFirstRoute = isFirstRoute.value;
  }

  protected __defineComponentInst(c: ComponentInst) {
    const fn = () => {
      const l = [...c.componentsInTemplate].find(
        (i) => i.name === this.componentName
      );

      if (l) {
        c.onUpdatedObservers.delete(fn);
        this.onLoadObservers.dispatch();
        this.onLoadObservers.clear();
      }
    };

    c.onUpdate(fn);

    fn();

    return this;
  }

  onLoad(fn: () => void) {
    if (this.isRendered) {
      fn();
      return () => {};
    }
    this.onLoadObservers.add(fn);

    return () => {
      this.onLoadObservers.delete(fn);
    };
  }
}

const routerControlers = new Set<RouterControlFn>();

export function hasRouterControlers() {
  return routerControlers.size > 0;
}

export function dispatchToRouterControlers(
  fn: RenderNewRoute,
  componentName: string
) {
  routerControlers.forEach((i) => i(new RouterControl(componentName, fn)));
}

export function useRouterControl(fn: RouterControlFn): RemoveRouterControl {
  routerControlers.add(fn);
  return () => {
    routerControlers.delete(fn);
  };
}
