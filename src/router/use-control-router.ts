export type RemoveControlRouter = () => void;

export type RenderNewRoute = () => void;

export type ControlRouterFn = (
  renderNewRoute: RenderNewRoute,
  componentName: string
) => void;

const routerControlers = new Set<ControlRouterFn>();

export function hasRouterControlers() {
  return routerControlers.size > 0;
}

export function dispatchToRouterControlers(
  fn: RenderNewRoute,
  componentName: string
) {
  routerControlers.forEach((i) => i(fn, componentName));
}

export function useControlRouter(fn: ControlRouterFn): RemoveControlRouter {
  routerControlers.add(fn);
  return () => {
    routerControlers.delete(fn);
  };
}
