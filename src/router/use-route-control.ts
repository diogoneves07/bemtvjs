import { ObserverSystem } from "../bemtv/observers-system";
import { getComponentAutoImportPromise } from "../bemtv/auto-import-components";
import { applyRouteOptions } from "./apply-route-options";

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

  cancel: () => void;

  protected __onRenderObservers = new ObserverSystem();

  constructor(name: string, render: () => void, cancelRoute: () => void) {
    this.name = name;

    this.cancel = cancelRoute;

    this.render = () => {
      render();

      isFirstRoute.value = false;

      this.load().then(() => {
        requestAnimationFrame(() => {
          applyRouteOptions(name);

          this.isRendered = true;

          this.__onRenderObservers.dispatch();
          this.__onRenderObservers.clear();
        });
      });

      return this;
    };
    this.isFirst = isFirstRoute.value;
  }

  load() {
    return (
      getComponentAutoImportPromise(this.name) ||
      new Promise((r) => {
        r({});
      })
    );
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

export function dispatchToRouteControlers(
  fn: RenderNewRoute,
  name: string,
  cancelRoute: () => void
) {
  routeObservers.dispatch(new RouteControl(name, fn, cancelRoute));
}

export function useRouteControl(fn: RouterControlFn): RemoveRouterControl {
  routeObservers.add(fn);
  return () => {
    routeObservers.delete(fn);
  };
}
