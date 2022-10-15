import { LIBRARY_NAME_IN_ERRORS_MESSAGE } from "../globals";
import ComponentInstance from "./component-instance";
import { ComponentThis } from "./components-this";

type GlobalComponentsMap = Map<string, ComponentFn>;

const GLOBAL_COMPONENTS_MAP: GlobalComponentsMap = new Map();

export type ComponentFn =
  | ((self: ComponentThis) => () => string)
  | ((self: ComponentThis) => string);

export type ComponentTemplateCallback = () => string;

export function getComponentFn(componentName: string) {
  return GLOBAL_COMPONENTS_MAP.get(componentName);
}

export function hasComponent(name: string) {
  return GLOBAL_COMPONENTS_MAP.get(name) ? true : false;
}

export function Component<N extends string, C extends ComponentFn>(
  componentName: N,
  componentFn: C
) {
  if (GLOBAL_COMPONENTS_MAP.has(componentName)) {
    throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} This component "${componentName}" name is already in use!`;
  }

  GLOBAL_COMPONENTS_MAP.set(componentName, componentFn);

  return new ComponentInstance(componentName);
}
export const _ = Component;
