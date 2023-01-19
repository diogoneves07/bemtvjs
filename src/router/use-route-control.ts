import { ALL_COMPONENTS_INST } from "../bemtv/component-inst-store";
import { ObserverSystem } from "../bemtv/observers-system";
import { isRouterComponent } from "../bemtv/is-router-component";
import { getComponentAutoImportPromise } from "../bemtv/auto-import-components";

export type RemoveRouterControl = () => void;

export type RemoveOnLoad = () => void;

export type RemoveOnRendered = () => void;

export type RenderNewRoute = () => void;

export type RouterControlFn = (routerControl: RouteControl) => void;

export let isFirstRoute = { value: true };

export class RouteControl {
  name: string;
  render: () => this;
  isFirst: boolean;
  isRendered = false;

  protected __onRenderObservers = new ObserverSystem();

  constructor(name: string, render: () => void) {
    this.name = name;

    this.render = () => {
      render();

      isFirstRoute.value = false;

      const routerInst = [...ALL_COMPONENTS_INST].find((i) =>
        isRouterComponent(i.name)
      );
      if (!routerInst) return this;

      const fn = () => {
        if (![...routerInst.componentsInTemplate].find((i) => i.name === name))
          return;

        this.isRendered = true;

        this.__onRenderObservers.dispatch();
        this.__onRenderObservers.clear();

        routerInst.onUpdatedObservers.delete(fn);
      };

      routerInst.onUpdate(fn);

      return this;
    };
    this.isFirst = isFirstRoute.value;
  }

  load() {
    return getComponentAutoImportPromise(this.name);
  }

  onLoad(fn: () => void): RemoveOnLoad {
    const p = getComponentAutoImportPromise(this.name);

    if (!p) {
      fn();

      return () => {};
    }

    let remove = false;

    p.then(() => {
      !remove && fn();
    });

    return () => {
      remove = true;
    };
  }

  onRender(fn: () => void): RemoveOnRendered {
    if (this.isRendered) {
      fn();
      return () => {};
    }
    this.__onRenderObservers.add(fn);

    return () => {
      this.__onRenderObservers.delete(fn);
    };
  }
}

const routeObservers = new ObserverSystem<RouterControlFn>();

export function hasRouterControlers() {
  return routeObservers.size() > 0;
}

export function dispatchToRouterControlers(fn: RenderNewRoute, name: string) {
  routeObservers.dispatch(new RouteControl(name, fn));
}

export function useRouteControl(fn: RouterControlFn): RemoveRouterControl {
  routeObservers.add(fn);
  return () => {
    routeObservers.delete(fn);
  };
}
