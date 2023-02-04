import { getSuperSimpleComponent } from "./components-main";

type LazyComponentFn<N extends string> = (name: N) => Promise<any>;

type SuspenseFn = (has: boolean) => boolean | string;

type AutoImportComponentObject = {
  load: () => Promise<any>;
  fallback?: string | SuspenseFn;
  loadAlreadyRequired?: true;
};
const importComponents = new Map<string, AutoImportComponentObject>();

export function isComponentAlreadyImported(name: string) {
  return getSuperSimpleComponent(name) ? true : false;
}

export function getComponentAutoImportPromise(name: string) {
  const has = importComponents.get(name);
  if (has) {
    return has.load();
  }
  return null;
}

export function isComponentAutoImport(name: string) {
  return importComponents.get(name) ? true : false;
}

export function onComponentImported(name: string, fn: () => void) {
  const has = importComponents.get(name);

  if (!has) return;

  has.load().then(fn);
}

export function autoImportComponent(name: string, currentTemplate?: string) {
  const has = importComponents.get(name);

  if (!has) return;

  const { load, loadAlreadyRequired, fallback } = has;

  let s =
    typeof fallback === "function" ? fallback(!!currentTemplate) : fallback;
  s = s === true ? false : s;

  if (loadAlreadyRequired) return s;

  load();

  return s;
}

/**
 * Allows you to create a component that will be imported only when necessary.
 *
 * @param componentName
 * The component name.
 *
 * @param lazyComponentFn
 * A function that should return a dynamic import promise.
 *
 * @param fallback
 * A fallback to show while the component is being imported.
 *
 * @returns
 *
 * A function that when called imports the component and returns the import promise.
 */
export function lazy<N extends string, C extends LazyComponentFn<N>>(
  componentName: N,
  lazyComponentFn: C,
  fallback?: string | SuspenseFn
) {
  let promise: Promise<any>;

  const o: AutoImportComponentObject = {
    load: () => {
      if (promise) return promise;

      o.loadAlreadyRequired = true;

      promise = lazyComponentFn(componentName) as Promise<any>;

      return promise;
    },
    fallback,
  };

  importComponents.set(componentName, o);

  return o.load;
}
