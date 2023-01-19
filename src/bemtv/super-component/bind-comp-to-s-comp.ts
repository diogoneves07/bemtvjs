import { LIBRARY_NAME_IN_ERRORS_MESSAGE } from "./../../globals";
import ComponentInst from "../component-inst";
import { dispatchInitedLifeCycle } from "../components-lifecycle";
import { getSuperComponentInst } from "../components-main";
import getVarsInTemplate from "./get-vars-in-template";
import {
  ElementsWithBindAttrs,
  processElementsWithBindAttrs,
  setElementsWithBindAttrs,
} from "./process-bind-attrs";
import {
  addDOMListenerToComponent,
  getComponentInstFirstElement,
  getSuperComponentData,
  runInComponentInst,
  updateComponentVars,
} from "./work-with-super-component";

export function bindComponentToSuperComponent(cInst: ComponentInst) {
  const sComp = getSuperComponentInst(cInst.name);

  if (!sComp)
    throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} The SuperComponent “${cInst.name}” was not created!`;

  cInst.superComponent = sComp;

  const sCompData = getSuperComponentData(sComp);

  let lastFirstElement: undefined | Element;

  const updateFirstElement = () => {
    const firstElement = getComponentInstFirstElement(cInst);

    cInst.defineNodesParentElement();

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

  cInst.defineComponentTemplate(template);

  sCompData.componentsInst.add(cInst);

  sCompData.onInstObservers.dispatch(cInst);

  dispatchInitedLifeCycle(cInst);

  runInComponentInst(sComp, cInst, () => {
    updateComponentVars(sComp);
  });

  cInst.onUnmount(() => sCompData.componentsInst.delete(cInst));

  cInst.onMountWithHighPriority(updateFirstElement);
  cInst.onUpdateWithHighPriority(updateFirstElement);

  cInst.onMountWithHighPriority(updateElementsWithBindAttrs);
  cInst.onUpdateWithHighPriority(updateElementsWithBindAttrs);

  return template;
}
