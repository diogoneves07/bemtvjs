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

/**
 * Automates the dynamic import process of components.
 *
 * @param components
 *
 * An object where the name of the properties must be the name of the components and their values
 * ​​must be a function that imports the component using dynamic import.
 */
export function autoImportComponents(
  components: Record<string, AutoImportCallback>
) {
  for (const k of Object.keys(components)) {
    importComponents.set(k, components[k]);
  }
}
