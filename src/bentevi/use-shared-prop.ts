import { ComponentThis } from "./components-this";
import { getComponentThisData } from "./work-with-components-this";
export default function useSharedProp(
  componentThis: ComponentThis,
  key: string
): unknown | undefined {
  const { sharedData } = getComponentThisData(componentThis);

  if (Object.hasOwn(sharedData, key)) return sharedData[key];

  if (!componentThis.parent) return undefined;

  return useSharedProp(componentThis.parent, key);
}
