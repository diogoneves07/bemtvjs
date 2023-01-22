import SimpleComponent from "./simple-component";

let simpleComponent: SimpleComponent | null = null;

export function getSimpleComponentRunningOnTop() {
  return simpleComponent;
}

export function setSimpleComponentRunningOnTop(c: SimpleComponent | null) {
  simpleComponent = c;
}
