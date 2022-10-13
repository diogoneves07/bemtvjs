import { getComponentFn } from "./components";

type AutoImportCallback = () => void;

const importComponents = new Map<string, AutoImportCallback | true>();

export function isComponentAlreadyImported(name: string) {
  return getComponentFn(name) ? true : false;
}

export function isComponentAutoImport(name: string) {
  return importComponents.get(name) ? true : false;
}

export function autoImportComponent(name: string) {
  const fn = importComponents.get(name);
  if (!fn || typeof fn !== "function") return;

  fn();

  importComponents.set(name, true);
}

export function autoImportComponents(
  components: Record<string, AutoImportCallback>
) {
  for (const k of Object.keys(components)) {
    importComponents.set(k, components[k]);
  }
}
