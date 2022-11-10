import { SuperComponent } from "./super-component/super-component";
import { LIBRARY_NAME_IN_ERRORS_MESSAGE } from "../globals";
import { SuperComponentFactory } from "./super-component/super-component-factory";
import { bindComponentToSuperComponent } from "./super-component/bind-comp-to-s-comp";
import ComponentInst from "./component-inst";

type GlobalComponentsMap = Map<string, ComponentFn>;

type ComponentName = `${Capitalize<string>}${string}` | string;

export const GLOBAL_COMPONENTS_MAP: GlobalComponentsMap = new Map();

export type ComponentFn =
  | ((self: ComponentInst) => () => string)
  | ((self: ComponentInst) => string);

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

export function _<C extends ComponentName, N extends Record<string, any>>(
  componentName: ComponentName | TemplateStringsArray,
  vars?: N
): SuperComponent<N>;

export function _<C extends ComponentName, N extends Record<string, any>>(
  componentName: C | TemplateStringsArray,
  vars: N = {} as N
): SuperComponent<N> {
  const c = (
    Array.isArray(componentName) ? componentName.join("") : componentName
  ) as string;

  if (GLOBAL_COMPONENTS_MAP.has(c)) {
    throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} This component “${c}” name is already in use!`;
  }

  Object.freeze(vars);

  const superComponent = SuperComponentFactory(c, vars);

  GLOBAL_COMPONENTS_MAP.set(c, (c) =>
    bindComponentToSuperComponent(superComponent, c)
  );

  return superComponent;
}
