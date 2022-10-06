import { ComponentThis, getComponentThisData } from "./components-this";

export default function reshareProps(
  componentThis: ComponentThis,
  props: Record<string, any>
) {
  const { sharedData } = getComponentThisData(componentThis);
  const keys = Object.keys(props);
  keys.slice().forEach((key, index) => {
    if (Object.hasOwn(sharedData, key)) {
      sharedData[key] = props[key];
      keys.splice(index, 1);
    }
  });

  if (!keys.length || !componentThis.parent) return;

  const remainingProps = keys.reduce((p, c) => {
    p[c] = props[c];
    return p;
  }, {} as Record<string, any>);

  reshareProps(componentThis.parent, remainingProps);
}
