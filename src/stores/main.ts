type WatchCallback<V = any> = (value: V, count: number) => void;
type RemoveWatcher = () => void;

type PropsFn<V> = {
  (newValue?: V): V;
  watch: (callback: WatchCallback<V>) => RemoveWatcher;
};

type StoreObject<O extends Record<string, any>> = {
  [P in keyof O]: PropsFn<O[P]>;
};
//! O Contador serve para saber se é a primeira interação
export function store<O extends Record<string, any>>(initStateObject: O) {
  const keys = Object.keys(initStateObject);
  const storeObject = {} as StoreObject<O>;
  const stateObjectClone = { ...initStateObject } as Record<string, any>;

  for (const key of keys) {
    const watchers = new Map<WatchCallback, number>();

    const propFn = (newValue?: any) => {
      if (newValue === undefined) return stateObjectClone[key];

      stateObjectClone[key] = newValue;

      watchers.forEach((c, fn) => {
        const count = c++;
        fn(newValue, count);
        watchers.set(fn, count);
      });

      return newValue;
    };

    propFn.watch = (fn: WatchCallback) => {
      fn(stateObjectClone[key], 0);

      watchers.set(fn, 0);

      return () => watchers?.delete(fn);
    };

    (storeObject as any)[key] = propFn;
  }

  return Object.freeze(storeObject as StoreObject<O>);
}
