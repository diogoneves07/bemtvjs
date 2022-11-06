import ComponentInst from "./component-inst";
export default function useSharedProp(
  c: ComponentInst,
  key: string
): unknown | undefined {
  const { sharedData, parent } = c;

  if (Object.hasOwn(sharedData, key)) return sharedData[key];

  if (!parent) return undefined;

  return useSharedProp(parent, key);
}
