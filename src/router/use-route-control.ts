import { ObserverSystem } from "../bemtv/observers-system";
import { getComponentAutoImportPromise } from "../bemtv/lazy-component";
import { applyRouteOptions } from "./apply-route-options";

export type RemoveRouterControl = () => void;

export type RemoveOnLoad = () => void;

export type RemoveOnRender = () => void;

export type RenderNewRoute = () => void;

export type RouterControlFn = (routerControl: RouteControl) => void;

export let isFirstRoute = { value: true };

export class RouteControl {
  /**
   * The component name of the route.
   */
  name: string;

  /**
   * Renders the route in the Router component.
   */
  render: () => this;

  /**
   * Returns true if it is the first route to be accessed and false otherwise.
   */
  isFirst: boolean;

  /**
   * Returns true if the route is already rendered and false otherwise.
   */
  isRendered = false;

  /**
   * Cancels the current route and return to the previous one.
   */
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

  /**
   * Imports the component of the route.
   *
   * @returns
   * The component import promise.
   */
  load() {
    return (
      getComponentAutoImportPromise(this.name) ||
      new Promise((r) => {
        r({});
      })
    );
  }

  /**
   * Allows you add a listener that will be called once the route is rendered.
   * @param fn
   * The listener.
   *
   * @returns
   * A function that when called removes the listener.
   */
  onRender(fn: () => void): RemoveOnRender {
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

/**
 * Allows to require routing control for each route that will be accessed.
 *
 * @param fn
 * A function that takes as its first argument an instance with methods
 * and properties to control routing.
 *
 * @returns
 * A function that when called removes the route control function.
 */
export function useRouteControl(fn: RouterControlFn): RemoveRouterControl {
  routeObservers.add(fn);
  return () => {
    routeObservers.delete(fn);
  };
}
