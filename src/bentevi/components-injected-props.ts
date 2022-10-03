import { ALL_COMPONENTS_MANAGER } from "./components-manager-nodes";
import { getRelativeInstances } from "./component-relative-instances";
import { ComponentThis } from "./components-this";
import normalizeComponentName from "./normalize-component-name";

const COMPONENT_PROPS_INJECTED = new Map<string, Record<string, any>>();

export function getComponentPropsInjected(componentName: string) {
  return COMPONENT_PROPS_INJECTED.get(componentName);
}

export function defineComponentInjectedProps(
  componentThis: ComponentThis,
  toComponentName: string,
  propName: string,
  propValue: any
) {
  const componentManager = ALL_COMPONENTS_MANAGER.find(
    (o) => o.componentThis === componentThis
  );

  const componentPropsInjected = COMPONENT_PROPS_INJECTED.get(toComponentName);

  if (componentPropsInjected) {
    componentPropsInjected[propName] = propValue;
  } else {
    COMPONENT_PROPS_INJECTED.set(toComponentName, { [propName]: propValue });
  }

  if (!componentManager) return;

  const relativeInstances = getRelativeInstances(componentManager);

  if (!relativeInstances) return;

  for (const o of relativeInstances) {
    const c = o.componentThis;
    if (normalizeComponentName(c.name) !== toComponentName) continue;
    c.injectedProps[propName] = propValue;
  }
}
