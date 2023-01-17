import { ALL_COMPONENTS_INST } from "./../bemtv/component-inst-store";
import { ObserverSystem } from "../bemtv/observers-system";
import { isRouterComponent } from "../bemtv/is-router-component";

export type RemoveRouterControl = () => void;

export type RenderNewRoute = () => void;

export type RouterControlFn = (routerControl: RouterControl) => void;

export let isFirstRoute = { value: true };

export class RouterControl {
  componentName: string;
  renderRoute: () => this;
  isFirstRoute: boolean;
  isRendered = false;

  protected __onLoadObservers = new ObserverSystem();

  constructor(name: string, renderRoute: () => void) {
    this.componentName = name;

    this.renderRoute = () => {
      renderRoute();

      isFirstRoute.value = false;

      const routerInst = [...ALL_COMPONENTS_INST].find((i) =>
        isRouterComponent(i.name)
      );
      if (!routerInst) return this;

      const fn = () => {
        if (![...routerInst.componentsInTemplate].find((i) => i.name === name))
          return;

        this.isRendered = true;
        this.__onLoadObservers.dispatch();
        this.__onLoadObservers.clear();
        routerInst.onUpdatedObservers.delete(fn);
      };

      routerInst.onUpdate(fn);

      return this;
    };
    this.isFirstRoute = isFirstRoute.value;
  }

  onLoad(fn: () => void) {
    if (this.isRendered) {
      fn();
      return () => {};
    }
    this.__onLoadObservers.add(fn);

    return () => {
      this.__onLoadObservers.delete(fn);
    };
  }
}

const routerControlers = new ObserverSystem<RouterControlFn>();

export function hasRouterControlers() {
  return routerControlers.size() > 0;
}

export function dispatchToRouterControlers(
  fn: RenderNewRoute,
  componentName: string
) {
  routerControlers.dispatch(new RouterControl(componentName, fn));
}

export function useRouterControl(fn: RouterControlFn): RemoveRouterControl {
  routerControlers.add(fn);
  return () => {
    routerControlers.delete(fn);
  };
}
