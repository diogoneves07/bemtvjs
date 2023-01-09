import { getComponentFn } from "./components-main";

type AutoImportCallback<R> = () => R;

type LazyComponentFn<N extends string> = (name: N) => Promise<any>;

type SuspenseFn = (has: boolean) => boolean | string;

type AutoImportComponentObject<R> = {
  load: AutoImportCallback<R>;
  fallback?: string | SuspenseFn;
  loadAlreadyRequired?: true;
};
const importComponents = new Map<string, AutoImportComponentObject<any>>();

export function isComponentAlreadyImported(name: string) {
  return getComponentFn(name) ? true : false;
}

export function isComponentAutoImport(name: string) {
  return importComponents.get(name) ? true : false;
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

export function lazy<N extends string, C extends LazyComponentFn<N>>(
  componentName: N,
  lazyComponentFn: C,
  fallback?: string | SuspenseFn
) {
  let promise: Promise<any>;
  const o: AutoImportComponentObject<ReturnType<C>> = {
    load: () => {
      if (o.loadAlreadyRequired && promise) return promise as ReturnType<C>;

      o.loadAlreadyRequired = true;

      promise = lazyComponentFn(componentName) as Promise<any>;

      return promise as ReturnType<C>;
    },
    fallback,
  };

  importComponents.set(componentName, o);

  return o.load;
}
