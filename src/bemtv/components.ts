import { LIBRARY_NAME_IN_ERRORS_MESSAGE } from "../globals";
import ComponentInstance from "./component-instance";
import { ComponentThis } from "./components-this";

type GlobalComponentsMap = Map<string, ComponentFn>;

type ComponentName = `${Capitalize<string>}${string}` | string;

export const GLOBAL_COMPONENTS_MAP: GlobalComponentsMap = new Map();

export type ComponentFn =
  | ((self: ComponentThis) => () => string)
  | ((self: ComponentThis) => string);

export type ComponentTemplateCallback = () => string;

export function getComponentFn(componentName: string) {
  return GLOBAL_COMPONENTS_MAP.get(componentName);
}

/**
 * Check if the component is available.
 *
 * @param name
 * The component name.
 */
export function hasComponent(name: ComponentName) {
  return GLOBAL_COMPONENTS_MAP.get(name) ? true : false;
}

/**
 *
 * @param componentName
 * The component name.
 * It must always start with an uppercase character (CamelCase) and accepts all
 * alphanumeric characters and the `:` symbol.
 *
 * @param componentFn
 *  The function responsible for managing the component instance.
 *  It must always return a `string` or a function that returns a `string`.
 *
 * @returns
 * The component creation instance.
 */
export function Component<N extends ComponentName, C extends ComponentFn>(
  componentName: N,
  componentFn: C
) {
  const names = componentName.split(" ");

  for (const n of names) {
    if (GLOBAL_COMPONENTS_MAP.has(n)) {
      throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} This component "${n}" name is already in use!`;
    }

    GLOBAL_COMPONENTS_MAP.set(n, componentFn);
  }
  return new ComponentInstance(names[0]);
}
export const _ = Component;
