import ComponentInst from "../component-inst";
import { dispatchInitedLifeCycle } from "../components-lifecycle";
import getVarsInTemplate from "./get-vars-in-template";
import { SuperComponent } from "./super-component";
import {
  addDOMListenerToComponent,
  getComponentInstFirstElement,
  getSuperComponentData,
  setRunningComponent,
} from "./work-with-super-component";

export function bindComponentToSuperComponent(
  sComp: SuperComponent,
  cInst: ComponentInst
) {
  const sCompData = getSuperComponentData(sComp);

  let templatePropertyValues: Map<string, string> = new Map();

  const template = () => {
    setRunningComponent(sComp, cInst);

    const t = sCompData.initialTemplate() as string;

    const templateValue = getVarsInTemplate(
      t,
      sComp,
      cInst,
      templatePropertyValues
    );
    setRunningComponent(sComp);
    return templateValue;
  };

  let lastFirstElement: undefined | Element;

  const updateFirstElement = () => {
    const firstElement = getComponentInstFirstElement(cInst);

    if (!firstElement || lastFirstElement === firstElement) return;

    lastFirstElement = firstElement;
    for (const s of sCompData.classes) {
      if (!firstElement.classList.contains(s)) firstElement.classList.add(s);
    }

    const cInstProps = sCompData.components.get(cInst);

    if (cInstProps) {
      const fnsIterator = cInstProps.removeFirstElementDOMListeners.values();
      for (const fns of fnsIterator) {
        fns.forEach((f) => f());
      }
      cInstProps.removeFirstElementDOMListeners.clear();
    }

    for (const l of sCompData.DOMListeners) {
      addDOMListenerToComponent(firstElement, sComp, l, cInst);
    }
  };

  cInst.onUnmount(() => sCompData.components.delete(cInst));
  cInst.onMount(updateFirstElement);
  cInst.onUpdate(updateFirstElement);

  let withoutTypes = cInst as any;

  for (const l of sCompData.lifeCycles) {
    for (const callback of l[1]) {
      withoutTypes[l[0]](() => callback(cInst));
    }
  }

  if (sCompData.propsDefined) {
    cInst.propsDefined = sCompData.propsDefined;
  }

  for (const [fnName, args] of sCompData.fns) {
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

  sCompData.components.set(cInst, {
    vars: {
      ...sCompData.initVars,
      children: cInst.children,
      props: cInst.props,
    },
    template,
    templatePropertyValues,
    removeFirstElementDOMListeners: new Map(),
  });

  dispatchInitedLifeCycle(cInst);
  return template;
}
