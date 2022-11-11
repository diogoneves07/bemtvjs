import ComponentInst from "../component-inst";
import { dispatchInitedLifeCycle } from "../components-lifecycle";
import { ComponentProps } from "../types/super-component-data";
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

  let componentVarsCache: Map<string, string> = new Map();

  let lastTemplateValue = "";

  let componentProps: ComponentProps | undefined;

  const template = () => {
    setRunningComponent(sComp, cInst);

    if (!componentProps) {
      componentProps = sCompData.components.get(cInst) as ComponentProps;
    }

    const { componentVarsCache } = componentProps;

    if (!componentVarsCache.size) {
      lastTemplateValue = getVarsInTemplate(sComp, cInst);
    }

    setRunningComponent(sComp);
    return lastTemplateValue;
  };

  let lastFirstElement: undefined | Element;

  const updateFirstElement = () => {
    const firstElement = getComponentInstFirstElement(cInst);

    if (!firstElement || lastFirstElement === firstElement) return;

    lastFirstElement = firstElement;
    for (const s of sCompData.classes) {
      if (!firstElement.classList.contains(s)) firstElement.classList.add(s);
    }

    const cInstProps = componentProps || sCompData.components.get(cInst);

    if (cInstProps) {
      const fnsIterator = cInstProps.removeFirstElementDOMListeners.values();

      for (const fn of fnsIterator) fn();

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
      ...sCompData.componentsInitVars,
      children: cInst.children,
      props: cInst.props,
    },
    template,
    componentVarsCache,
    removeFirstElementDOMListeners: new Map(),
  });

  dispatchInitedLifeCycle(cInst);

  return template;
}
