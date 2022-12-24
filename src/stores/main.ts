type WatchCallback<V = any> = (value: V, count: number) => void;
type RemoveWatcher = () => void;

type PropsFn<V> = {
  (newValue?: V): V;
  watch: (callback: WatchCallback<V>) => RemoveWatcher;
};

type StoreObject<O extends Record<string, any>> = {
  [P in keyof O]: PropsFn<O[P]>;
};

export function store<O extends Record<string, any>>(o: O) {
  const keys = Object.keys(o);
  const storeObject = {} as StoreObject<O>;
  const objectClone = { ...o } as Record<string, any>;

  let watchers = new Map<WatchCallback, number>();

  for (const key of keys) {
    const propFn = (newValue?: any) => {
      if (newValue === undefined) return objectClone[key];

      objectClone[key] = newValue;

      watchers.forEach((c, fn) => {
        const count = c++;
        fn(newValue, count);
        watchers.set(fn, count);
      });

      return newValue;
    };

    propFn.watch = (fn: WatchCallback) => {
      fn(objectClone[key], 0);
      watchers.set(fn, 0);

      return () => watchers?.delete(fn);
    };

    (storeObject as any)[key] = propFn;
  }

  return Object.freeze(storeObject as StoreObject<O>);
}
