import ComponentInst from "./component-inst";

export function getComponentInstParents(cInst: ComponentInst) {
  let i = cInst;
  const parents: Set<string> = new Set();

  while (i.parent) {
    parents.add(i.key);
    i = i.parent;
  }

  return parents;
}
