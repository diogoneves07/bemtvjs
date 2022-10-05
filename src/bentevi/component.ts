import { GlobalProps } from "./types/global-props";
import { LIBRARY_NAME_IN_ERRORS_MESSAGE } from "./../globals";
import { ComponentThis } from "./components-this";

export type ComponentTemplateCallback = (globalProps: GlobalProps) => string;

type ComponentCallback =
  | ((self: ComponentThis) => (globalProps: GlobalProps) => string)
  | ((self: ComponentThis) => string)
  | ((
      this: ComponentThis,
      self: ComponentThis
    ) => (globalProps: GlobalProps) => string)
  | ((this: ComponentThis, self: ComponentThis) => string);

type GlobalComponentsMap = Map<string, ComponentCallback>;

const GLOBAL_COMPONENTS_MAP: GlobalComponentsMap = new Map();

export function getComponentCallback(componentName: string) {
  return GLOBAL_COMPONENTS_MAP.get(componentName);
}

export function Component<N extends string, C extends ComponentCallback>(
  componentName: N,
  componentCallback: C
): void {
  if (GLOBAL_COMPONENTS_MAP.has(componentName)) {
    throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} This component "${componentName}" name is already in use!`;
  }
  GLOBAL_COMPONENTS_MAP.set(componentName, componentCallback);
}
export const _ = Component;
