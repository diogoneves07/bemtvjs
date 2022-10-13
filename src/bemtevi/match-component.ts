import { hasComponent } from "./components";

export function matchComponent(
  component: `${string}[${string}]`,
  alternative: string = ""
) {
  const componentName = component.slice(0, component.indexOf("["));

  if (hasComponent(componentName)) return component;

  return alternative;
}
