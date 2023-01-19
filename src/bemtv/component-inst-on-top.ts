import ComponentInst from "./component-inst";

let componentInst: ComponentInst | null = null;

export function getComponentInstRunningOnTop() {
  return componentInst;
}

export function setComponentInstRunningOnTop(c: ComponentInst | null) {
  componentInst = c;
}
