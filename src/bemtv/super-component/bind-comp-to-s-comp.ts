import ComponentInst from "../component-inst";
import { dispatchInitedLifeCycle } from "../components-lifecycle";
import { ComponentProps } from "../types/super-component-data";
import getVarsInTemplate from "./get-vars-in-template";
import {
  ElementsWithBindAttrs,
  processBindAttrs,
  setElementsWithBindAttrs,
} from "./process-bind-attrs";
import { SuperComponent } from "./super-component";
import {
  addDOMListenerToComponent,
  getComponentInstFirstElement,
  getSuperComponentData,
  runInComponentInst,
} from "./work-with-super-component";

export function bindComponentToSuperComponent(
  sComp: SuperComponent,
  cInst: ComponentInst
) {
  const sCompData = getSuperComponentData(sComp);

  let componentProps: ComponentProps | undefined;

  let lastFirstElement: undefined | Element;

  const updateFirstElement = () => {
    const firstElement = getComponentInstFirstElement(cInst);

    if (!cInst.parentElement && cInst.nodes[0]?.parentElement) {
      cInst.parentElement = cInst.nodes[0].parentElement;
    }

    if (!firstElement || lastFirstElement === firstElement) return;

    lastFirstElement = firstElement;

    for (const s of sCompData.classes) {
      if (!firstElement.classList.contains(s)) firstElement.classList.add(s);
    }

    const cInstProps = componentProps || sCompData.componentsInst.get(cInst);

    if (cInstProps) {
      const fnsIterator = cInstProps.removeFirstElementDOMListeners.values();

      for (const fn of fnsIterator) fn();

      cInstProps.removeFirstElementDOMListeners.clear();
    }

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
      processBindAttrs(sComp, elementsWithBindAttrs);

      if (!componentProps) {
        componentProps = sCompData.componentsInst.get(cInst) as ComponentProps;
      }

      const { componentVarsCache } = componentProps;

      if (isTemplateFunction || componentVarsCache.size === 0) {
        lastTemplateValue = getVarsInTemplate(sComp, cInst);
      }
    });

    return lastTemplateValue;
  };

  sCompData.componentsInst.set(cInst, {
    vars: {
      ...sCompData.componentsInitVars,
      children: cInst.children,
      props: cInst.props,
    },
    template,
    componentVarsCache: new Map<string, string>(),
    removeFirstElementDOMListeners: new Map(),
  });

  dispatchInitedLifeCycle(cInst);

  cInst.onUnmount(() => sCompData.componentsInst.delete(cInst));

  cInst.onMountWithHighPriority(updateFirstElement);
  cInst.onUpdateWithHighPriority(updateFirstElement);

  cInst.onMountWithHighPriority(updateElementsWithBindAttrs);
  cInst.onUpdateWithHighPriority(updateElementsWithBindAttrs);

  return template;
}
