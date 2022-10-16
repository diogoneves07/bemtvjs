import { ComponentThis } from "./components-this";
import { getComponentThisData } from "./work-with-components-this";

export default function reshareProps(
  componentThis: ComponentThis,
  props: Record<string, any>
) {
  const { sharedData, parent } = getComponentThisData(componentThis);

  const keys = Object.keys(props);

  keys.slice().forEach((key, index) => {
    if (!Object.hasOwn(sharedData, key)) return;

    sharedData[key] = props[key];
    keys.splice(index, 1);
  });

  if (!keys.length || !parent) return;

  const remainingProps = keys.reduce((p, c) => {
    p[c] = props[c];
    return p;
  }, {} as Record<string, any>);

  reshareProps(parent, remainingProps);
}
