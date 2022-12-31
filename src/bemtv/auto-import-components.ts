import { getComponentFn } from "./components-main";

type AutoImportCallback = () => void;

type autoImportComponentObject = {
  load: AutoImportCallback;
  suspense: string;
  loadAlreadyRequired?: true;
};
const importComponents = new Map<string, autoImportComponentObject>();

export function isComponentAlreadyImported(name: string) {
  return getComponentFn(name) ? true : false;
}

export function isComponentAutoImport(name: string) {
  return importComponents.get(name) ? true : false;
}

export function autoImportComponent(name: string) {
  const has = importComponents.get(name);

  if (!has) return;

  const { load, loadAlreadyRequired, suspense } = has;

  if (loadAlreadyRequired) return suspense;

  load();

  return suspense;
}

type LazyComponentFn<N extends string> = (name: N) => Promise<any>;

export function lazy<N extends string, C extends LazyComponentFn<N>>(
  componentName: N,
  lazyComponentFn: C,
  suspense: string = ""
) {
  const o: autoImportComponentObject = {
    load: () => {
      o.loadAlreadyRequired = true;
      return lazyComponentFn(componentName);
    },
    suspense,
  };

  importComponents.set(componentName, o);

  return o.load;
}
