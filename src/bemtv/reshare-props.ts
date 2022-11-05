import { ComponentInst } from "./components-inst";
import { getComponentInstData } from "./work-with-components-inst";

export default function reshareProps(
  componentInst: ComponentInst,
  props: Record<string, any>
) {
  const { sharedData, parent } = getComponentInstData(componentInst);

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
