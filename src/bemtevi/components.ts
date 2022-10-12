import { LIBRARY_NAME_IN_ERRORS_MESSAGE } from "../globals";
import { ComponentThis } from "./components-this";

export type ComponentTemplateCallback = () => string;

type ComponentFn =
  | ((self: ComponentThis) => () => string)
  | ((self: ComponentThis) => string);

type GlobalComponentsMap = Map<string, ComponentFn>;

const GLOBAL_COMPONENTS_MAP: GlobalComponentsMap = new Map();

export function getComponentFn(componentName: string) {
  return GLOBAL_COMPONENTS_MAP.get(componentName);
}

export function hasComponent(name: string) {
  return GLOBAL_COMPONENTS_MAP.get(name) ? true : false;
}

export function Component<N extends string, C extends ComponentFn>(
  componentName: N,
  componentFn: C
): void {
  if (GLOBAL_COMPONENTS_MAP.has(componentName)) {
    throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} This component "${componentName}" name is already in use!`;
  }
  GLOBAL_COMPONENTS_MAP.set(componentName, componentFn);
}
export const _ = Component;
