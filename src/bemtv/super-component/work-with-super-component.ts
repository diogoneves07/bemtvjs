import { SuperComponent } from "./super-component";
import { LifeCycleCallback } from "../types/component-inst-data";
import {
  ComponentProps,
  SuperComponentDOMListener,
} from "./../types/super-component-data";
import insertDOMListener from "../insert-dom-listener";
import ComponentInst from "../component-inst";

export function getSuperComponentData(sComp: SuperComponent) {
  return (sComp as any).__data as SuperComponent["__data"];
}

export function getComponentInstFirstElement(c: ComponentInst) {
  for (const node of c.nodes) {
    if (node instanceof Element) return node;
  }

  return null;
}

const EMPTY_OBJECT = {};
export function getComponentVars(sComp: SuperComponent) {
  const data = getSuperComponentData(sComp);
  const c = data.componentInstRunning;
  return c ? data.componentsInst.get(c)?.vars || EMPTY_OBJECT : EMPTY_OBJECT;
}

export function runInComponentInst(
  sComp: SuperComponent,
  cInst: ComponentInst | null,
  callback: () => void
) {
  const data = getSuperComponentData(sComp);
  const lastCInst = data.componentInstRunning;

  const setCompVars = () => {
    if (!data.componentInstRunning) return;

    const vars = getComponentVars(sComp) as ComponentProps["vars"];

    data.disableVarsProxies();

    for (const p of data.componentsVarsKeys) {
      (sComp.$ as any)[p] = vars[p];
    }

    data.activateVarsProxies();
  };

  data.componentInstRunning = cInst;

  setCompVars();
  callback();

  data.componentInstRunning = lastCInst;
  setCompVars();
}

export function updateComponentVars(sComp: SuperComponent) {
  const data = getSuperComponentData(sComp);
  const vars = getComponentVars(sComp) as ComponentProps["vars"];

  data.disableVarsProxies();
  for (const p of data.componentsVarsKeys) {
    vars[p] = sComp.$[p] as any;
  }
  data.activateVarsProxies();
}

export function addLifeCycleToComponents(
  sComp: SuperComponent,
  name: string,
  callback: LifeCycleCallback
) {
  const data = getSuperComponentData(sComp);
  const lifeCallback = (c: ComponentInst) => {
    runInComponentInst(sComp, c, () => {
      callback();
      updateComponentVars(sComp);
    });
  };

  for (const [c] of data.componentsInst) {
    (c as any)[name](() => lifeCallback(c));
  }

  const h = data.lifeCycles.get(name);

  if (h) {
    h.push(lifeCallback);
    return;
  }

  data.lifeCycles.set(name, [lifeCallback]);
}

export function addDOMListenerToComponent(
  firstElement: Element,
  sComp: SuperComponent,
  DOMListenerObject: SuperComponentDOMListener,
  c: ComponentInst
) {
  const { type, callback, options: DOMListenerOptions } = DOMListenerObject;

  const fn = (e: Event) => {
    runInComponentInst(sComp, c, () => {
      callback(e);
      updateComponentVars(sComp);
    });
  };

  const data = getSuperComponentData(sComp);

  const removeDOMListener = insertDOMListener(
    firstElement,
    type,
    fn,
    DOMListenerOptions
  );

  const componentData = data.componentsInst.get(c);

  if (!componentData) return;

  componentData.removeFirstElementDOMListeners.set(
    DOMListenerObject,
    removeDOMListener
  );
}

export function addDOMListenerToComponents(
  sComp: SuperComponent,
  DOMListenerObject: SuperComponentDOMListener
) {
  const data = getSuperComponentData(sComp);

  for (const c of data.componentsInst.keys()) {
    const firstElement = getComponentInstFirstElement(c);
    if (firstElement) {
      addDOMListenerToComponent(firstElement, sComp, DOMListenerObject, c);
    }
  }
}

export function removeDOMListenerFromComponents(
  sComp: SuperComponent,
  DOMListenerObject: SuperComponentDOMListener
) {
  const components = getSuperComponentData(sComp).componentsInst.values();

  for (const o of components) {
    const removeDOMListener =
      o.removeFirstElementDOMListeners.get(DOMListenerObject);
    if (removeDOMListener) {
      o.removeFirstElementDOMListeners.delete(DOMListenerObject);
      removeDOMListener();
    }
  }
}

export function resetComponentVarsCache(sComp: SuperComponent) {
  const data = getSuperComponentData(sComp);

  if (!data.componentInstRunning) return;

  const c = data.componentsInst.get(data.componentInstRunning);

  if (!c) return;

  c.componentVarsCache.clear();
}
