import ComponentInst from "./component-inst";

export default function reshareProps(
  c: ComponentInst,
  props: Record<string, any>
) {
  const { sharedData, parent } = c;

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
