import { ComponentThis } from "../components-this";
import {
  dispatchInitedLifeCycle,
  getComponentThisData,
} from "../work-with-components-this";
import getVarsInTemplate from "./get-vars-in-template";
import { SuperComponent } from "./super-component";
import {
  addListenerToComponent,
  getSuperComponentData,
  setRunningComponent,
} from "./work-with-super-component";

export function bindComponentToSuperComponent(
  sComp: SuperComponent,
  c: ComponentThis
) {
  const data = getSuperComponentData(sComp);

  let templatePropertyValues: Map<string, string> = new Map();

  const template = () => {
    setRunningComponent(sComp, c);
    const t = data.initialTemplate() as string;

    const templateValue = getVarsInTemplate(
      t,
      sComp,
      c,
      templatePropertyValues
    );
    setRunningComponent(sComp);
    return templateValue;
  };

  let componentFirstElement: undefined | Element;

  const addClassesToComponent = () => {
    const { firstElement } = getComponentThisData(c);

    if (componentFirstElement === firstElement) return;

    if (firstElement) {
      componentFirstElement = firstElement;
      for (const s of data.classes) {
        if (!firstElement.classList.contains(s)) firstElement.classList.add(s);
      }
    }
  };

  c.onUnmount(() => data.components.delete(c));
  c.onMount(addClassesToComponent);
  c.onUpdate(addClassesToComponent);

  let withoutTypes = c as any;

  for (const l of data.listeners) {
    addListenerToComponent(sComp, l, c);
  }

  for (const l of data.lifeCycles) {
    for (const callback of l[1]) {
      withoutTypes[l[0]](callback);
    }
  }

  for (const [fnName, args] of data.fns) {
    switch (fnName) {
      case "children":
        withoutTypes.children = args[0](withoutTypes.children);
        break;
      case "props":
        withoutTypes.props = args[0](withoutTypes.props);

        break;
      default:
        withoutTypes[fnName](...args);
        break;
    }
  }

  data.components.set(c, {
    vars: { ...data.initVars, children: c.children, props: c.props },
    template,
    templatePropertyValues,
  });

  dispatchInitedLifeCycle(c);
  return template;
}
