export type RemoveRouterControl = () => void;

export type RenderNewRoute = () => void;

export type RouterControlFn = (routerControl: RouterControl) => void;

export let isFirstRoute = { value: true };

export class RouterControl {
  componentName: string;
  renderNextRoute: () => this;
  isFirstRoute: boolean;

  constructor(name: string, renderNextRoute: () => void) {
    this.componentName = name;
    this.renderNextRoute = () => {
      renderNextRoute();
      isFirstRoute.value = false;

      return this;
    };
    this.isFirstRoute = isFirstRoute.value;
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
