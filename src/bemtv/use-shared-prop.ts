import { ComponentInst } from "./components-inst";
import { getComponentInstData } from "./work-with-components-inst";
export default function useSharedProp(
  componentInst: ComponentInst,
  key: string
): unknown | undefined {
  const { sharedData, parent } = getComponentInstData(componentInst);

  if (Object.hasOwn(sharedData, key)) return sharedData[key];

  if (!parent) return undefined;

  return useSharedProp(parent, key);
}
