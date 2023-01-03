import { getComponentFn } from "./components-main";

type AutoImportCallback = () => void;

type LazyComponentFn<N extends string> = (name: N) => Promise<any>;

type SuspenseFn = (has: boolean) => boolean | string;

type AutoImportComponentObject = {
  load: AutoImportCallback;
  suspense?: string | SuspenseFn;
  loadAlreadyRequired?: true;
};
const importComponents = new Map<string, AutoImportComponentObject>();

export function isComponentAlreadyImported(name: string) {
  return getComponentFn(name) ? true : false;
}

export function isComponentAutoImport(name: string) {
  return importComponents.get(name) ? true : false;
}

export function autoImportComponent(name: string, currentTemplate?: string) {
  const has = importComponents.get(name);

  if (!has) return;

  const { load, loadAlreadyRequired, suspense } = has;

  let s =
    typeof suspense === "function" ? suspense(!!currentTemplate) : suspense;
  s = s === true ? false : s;

  if (loadAlreadyRequired) return s;

  load();

  return s;
}

export function lazy<N extends string, C extends LazyComponentFn<N>>(
  componentName: N,
  lazyComponentFn: C,
  suspense?: string | SuspenseFn
) {
  let promise: Promise<any>;
  const o: AutoImportComponentObject = {
    load: () => {
      if (o.loadAlreadyRequired && promise) return promise;

      o.loadAlreadyRequired = true;

      promise = lazyComponentFn(componentName) as Promise<any>;

      return promise as ReturnType<C>;
    },
    suspense,
  };

  importComponents.set(componentName, o);

  return o.load;
}
