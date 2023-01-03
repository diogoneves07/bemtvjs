import { LIBRARY_NAME_IN_ERRORS_MESSAGE } from "../globals";

type WatchCallback<V = any> = (value: V, calledTimes: number) => void;
type RemoveWatcher = () => void;

type StateFnLib<V> = {
  (newValue?: V): V;
  $watch: (callback: WatchCallback<V>) => RemoveWatcher;
};

type StateFn<T, A extends Record<string, (c: T, n: T) => T>> = StateFnLib<T> & {
  [K in keyof A]: (value: Parameters<A[K]>[1]) => T;
};

export function createStateFn<T, A extends Record<string, (c: T, n: T) => T>>(
  value: T,
  actions?: A
) {
  const watchers = new Map<WatchCallback, number>();

  let currentValue = value;

  const fn = (newValue?: T) => {
    if (actions) {
      console.error(value);
      throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} The state funtion that init with the value above can only have its value changed through “actions”.`;
    }

    if (newValue === undefined) return currentValue;

    currentValue = newValue;

    watchers.forEach((c, fn) => {
      const calledTimes = c++;
      fn(newValue, calledTimes);
      watchers.set(fn, calledTimes);
    });

    return newValue;
  };

  fn.$watch = (fn: WatchCallback) => {
    fn(currentValue, 0);

    !watchers.has(fn) && watchers.set(fn, 0);

    return (() => watchers.delete(fn)) as RemoveWatcher;
  };

  if (actions) {
    Object.keys(actions).forEach((k) => {
      (fn as any)[k] = (value: T) => {
        currentValue = actions[k](currentValue, value);
        return currentValue;
      };
    });
  }

  return fn as StateFn<T, A>;
}
