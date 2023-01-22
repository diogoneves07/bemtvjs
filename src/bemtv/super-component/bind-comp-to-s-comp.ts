import { LIBRARY_NAME_IN_ERRORS_MESSAGE } from "./../../globals";
import SimpleComponent from "../simple-component";
import { dispatchInitedLifeCycle } from "../components-lifecycle";
import { getSuperSimpleComponent } from "../components-main";
import getVarsInTemplate from "./get-vars-in-template";
import {
  ElementsWithBindAttrs,
  processElementsWithBindAttrs,
  setElementsWithBindAttrs,
} from "./process-bind-attrs";
import {
  addDOMListenerToComponent,
  getSimpleComponentFirstElement,
  getSuperComponentData,
  runInSimpleComponent,
  updateComponentVars,
} from "./work-with-super-component";

export function bindComponentToSuperComponent(cSimple: SimpleComponent) {
  const sComp = getSuperSimpleComponent(cSimple.name);

  if (!sComp)
    throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} The SuperComponent “${cSimple.name}” was not created!`;

  cSimple.superComponent = sComp;

  const sCompData = getSuperComponentData(sComp);

  let lastFirstElement: undefined | Element;

  const updateFirstElement = () => {
    const firstElement = getSimpleComponentFirstElement(cSimple);

    cSimple.defineNodesParentElement();

    if (!firstElement) return;

    if (lastFirstElement === firstElement) return;

    lastFirstElement = firstElement;

    const fnsIterator = cSimple.removeFirstElementDOMListeners.values();

    for (const fn of fnsIterator) fn();

    cSimple.removeFirstElementDOMListeners.clear();

    for (const l of sCompData.DOMListeners) {
      addDOMListenerToComponent(firstElement, sComp, l, cSimple);
    }
  };

  let withoutTypes = cSimple as any;

  for (const l of sCompData.lifeCycles) {
    for (const callback of l[1]) {
      withoutTypes[l[0]](() => callback(cSimple));
    }
  }

  let lastTemplateValue = "";

  let elementsWithBindAttrs: ElementsWithBindAttrs = [];

  const updateElementsWithBindAttrs = () => {
    runInSimpleComponent(sComp, cSimple, () => {
      setElementsWithBindAttrs(sComp, cSimple, elementsWithBindAttrs);
    });
  };

  const template = () => {
    const { isTemplateFunction } = sCompData;

    runInSimpleComponent(sComp, cSimple, () => {
      processElementsWithBindAttrs(sComp, elementsWithBindAttrs);

      const { componentVarsCache } = cSimple;

      if (isTemplateFunction || componentVarsCache.size === 0) {
        lastTemplateValue = getVarsInTemplate(sComp, cSimple);
      }
    });

    return lastTemplateValue;
  };

  cSimple.componentVars = {
    ...sCompData.componentsInitVars,
    children: cSimple.children,
  };

  sCompData.simpleComponents.add(cSimple);

  sCompData.onInstObservers.dispatch(cSimple);

  dispatchInitedLifeCycle(cSimple);

  cSimple.defineComponentTemplate(template);

  runInSimpleComponent(sComp, cSimple, () => {
    updateComponentVars(sComp);
  });

  cSimple.onUnmount(() => sCompData.simpleComponents.delete(cSimple));

  cSimple.onMountWithHighPriority(updateFirstElement);
  cSimple.onUpdateWithHighPriority(updateFirstElement);

  cSimple.onMountWithHighPriority(updateElementsWithBindAttrs);
  cSimple.onUpdateWithHighPriority(updateElementsWithBindAttrs);

  return template;
}
