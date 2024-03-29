import { LIBRARY_NAME_IN_ERRORS_MESSAGE } from "../globals";

type WatchCallback<V = any> = (value: V, calledTimes: number) => void;
type RemoveWatcher = () => void;

type StateFn<V> = {
  (newValue?: V): V;
  watch: (callback: WatchCallback<V>) => RemoveWatcher;
};

type SetStateFnValue<V> = (newValue: V) => void;

export function createStateFn<T>(value: T): StateFn<T>;

export function createStateFn<T>(
  value: T,
  hasActions: boolean
): [stateFn: StateFn<T>, setStateFnValue: SetStateFnValue<T>];

/**
 * Allows to manage state.
 *
 * @param initialValue
 * The initial state value.
 *
 * @param hasActions
 * Defines whether the state can only be changed by “actions”.
 *
 * @returns
 * A function that maintains state and allows you to add watchers.
 */
export function createStateFn<T>(initialValue: T, hasActions: boolean = false) {
  const watchers = new Map<WatchCallback, number>();

  let currentValue = initialValue;

  let isSetingWithAction = false;

  const fn = (newValue?: T) => {
    if (newValue === undefined) return currentValue;

    if (hasActions && !isSetingWithAction) {
      console.error("“", initialValue, "”");
      throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} The state funtion that init with the value above can only have its value changed through “actions”.`;
    }

    currentValue = newValue;

    watchers.forEach((c, fn) => {
      const calledTimes = c++;
      fn(newValue, calledTimes);
      watchers.set(fn, calledTimes);
    });

    return newValue;
  };

  fn.watch = (fn: WatchCallback) => {
    fn(currentValue, 0);

    !watchers.has(fn) && watchers.set(fn, 0);

    return () => watchers.delete(fn);
  };

  if (hasActions) {
    return [
      fn,
      (newValue: T) => {
        isSetingWithAction = true;
        fn(newValue);
        isSetingWithAction = false;
      },
    ];
  }
  return fn as StateFn<T>;
}
