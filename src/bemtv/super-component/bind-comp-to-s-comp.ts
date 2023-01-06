import ComponentInst from "../component-inst";
import { dispatchInitedLifeCycle } from "../components-lifecycle";
import getVarsInTemplate from "./get-vars-in-template";
import {
  ElementsWithBindAttrs,
  processElementsWithBindAttrs,
  setElementsWithBindAttrs,
} from "./process-bind-attrs";
import { SuperComponent } from "./super-component";
import {
  addDOMListenerToComponent,
  getComponentInstFirstElement,
  getSuperComponentData,
  runInComponentInst,
  updateComponentVars,
} from "./work-with-super-component";

export function bindComponentToSuperComponent(
  sComp: SuperComponent,
  cInst: ComponentInst
) {
  const sCompData = getSuperComponentData(sComp);

  let lastFirstElement: undefined | Element;

  const updateFirstElement = () => {
    const firstElement = getComponentInstFirstElement(cInst);

    if (!cInst.parentElement && firstElement?.parentElement) {
      cInst.parentElement = firstElement.parentElement;
    }

    if (!firstElement) return;

    if (lastFirstElement === firstElement) return;

    lastFirstElement = firstElement;

    const fnsIterator = cInst.removeFirstElementDOMListeners.values();

    for (const fn of fnsIterator) fn();

    cInst.removeFirstElementDOMListeners.clear();

    for (const l of sCompData.DOMListeners) {
      addDOMListenerToComponent(firstElement, sComp, l, cInst);
    }
  };

  let withoutTypes = cInst as any;

  for (const l of sCompData.lifeCycles) {
    for (const callback of l[1]) {
      withoutTypes[l[0]](() => callback(cInst));
    }
  }

  for (const [fnName, args] of sCompData.fns) {
    switch (fnName) {
      case "children":
        withoutTypes.children = args[0](withoutTypes.children);
        break;

      default:
        withoutTypes[fnName](...args);
        break;
    }
  }

  let lastTemplateValue = "";

  let elementsWithBindAttrs: ElementsWithBindAttrs = [];

  const updateElementsWithBindAttrs = () => {
    runInComponentInst(sComp, cInst, () => {
      setElementsWithBindAttrs(sComp, cInst, elementsWithBindAttrs);
    });
  };

  const template = () => {
    const { isTemplateFunction } = sCompData;

    runInComponentInst(sComp, cInst, () => {
      processElementsWithBindAttrs(sComp, elementsWithBindAttrs);

      const { componentVarsCache } = cInst;

      if (isTemplateFunction || componentVarsCache.size === 0) {
        lastTemplateValue = getVarsInTemplate(sComp, cInst);
      }
    });

    return lastTemplateValue;
  };

  cInst.componentVars = {
    ...sCompData.componentsInitVars,
    children: cInst.children,
  };

  cInst.template = template;

  sCompData.componentsInst.add(cInst);

  runInComponentInst(sComp, cInst, () => {
    updateComponentVars(sComp);
  });

  dispatchInitedLifeCycle(cInst);

  cInst.onUnmount(() => sCompData.componentsInst.delete(cInst));

  cInst.onMountWithHighPriority(updateFirstElement);
  cInst.onUpdateWithHighPriority(updateFirstElement);

  cInst.onMountWithHighPriority(updateElementsWithBindAttrs);
  cInst.onUpdateWithHighPriority(updateElementsWithBindAttrs);

  return template;
}
