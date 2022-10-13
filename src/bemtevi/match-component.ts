import { autoImportComponent } from "./auto-import-components";
import { hasComponent } from "./components";
import normalizeComponentName from "./normalize-component-name";

const CACHE: Map<string, true> = new Map();

export function matchComponent(
  component: `${string}[${string}]`,
  alternative: string = ""
) {
  if (CACHE.has(component)) return component;

  const componentName = normalizeComponentName(
    component.slice(0, component.indexOf("["))
  );

  if (hasComponent(componentName)) {
    CACHE.set(component, true);
    return component;
  }

  autoImportComponent(componentName);

  return alternative;
}
