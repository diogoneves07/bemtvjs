type RouteUnfound = () => void;
type RemoveRouteUnfound = () => void;

const fns = new Set<RouteUnfound>();

/**
 * Allow capturing route not found error.
 */
export function onRouteUnfound(fn: RouteUnfound): RemoveRouteUnfound {
  fns.add(fn);

  return () => {
    fns.delete(fn);
  };
}

export function dispatchRouteUnfound() {
  fns.forEach((fn) => fn());
}
