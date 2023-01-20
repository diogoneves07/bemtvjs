import { SuperComponent } from "./super-component";
import { LifeCycleCallback } from "../types/component-inst-data";
import { SuperComponentDOMListener } from "./../types/super-component-data";
import insertDOMListener from "../insert-dom-listener";
import ComponentInst from "../component-inst";
import { setComponentInstRunningOnTop } from "../component-inst-on-top";

export function getSuperComponentData(sComp: SuperComponent) {
  return (sComp as any).__data as SuperComponent["__data"];
}

export function getComponentInstFirstElement(c: ComponentInst) {
  return (c.nodes.find((n) => n instanceof Element) as Element) || null;
}

export function getComponentInstNodes(c: ComponentInst) {
  return c.nodes;
}

const EMPTY_OBJECT = {};
export function getComponentInstRunningVars(sComp: SuperComponent) {
  const data = getSuperComponentData(sComp);
  const c = data.componentInstRunning;
  return c ? c.componentVars || EMPTY_OBJECT : EMPTY_OBJECT;
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

    const vars = getComponentInstRunningVars(sComp);

    data.disableVarsProxies();

    for (const p of data.componentsVarsKeys) {
      (sComp.$ as any)[p] = vars[p];
    }

    data.activateVarsProxies();
  };

  data.componentInstRunning = cInst;

  setComponentInstRunningOnTop(cInst);

  setCompVars();
  callback();

  data.componentInstRunning = lastCInst;

  setComponentInstRunningOnTop(lastCInst);

  setCompVars();
}

export function updateComponentVars(sComp: SuperComponent) {
  const data = getSuperComponentData(sComp);
  const vars = getComponentInstRunningVars(sComp);

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

  for (const c of data.componentsInst) {
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
  const {
    listener,
    fn: callback,
    options: DOMListenerOptions,
  } = DOMListenerObject;

  const fn = (e: Event) => {
    runInComponentInst(sComp, c, () => {
      callback(e);
      updateComponentVars(sComp);
    });
  };

  const removeDOMListener = insertDOMListener(
    firstElement,
    listener,
    fn,
    DOMListenerOptions
  );

  c.removeFirstElementDOMListeners.set(DOMListenerObject, removeDOMListener);
}

export function addDOMListenerToComponents(
  sComp: SuperComponent,
  DOMListenerObject: SuperComponentDOMListener
) {
  const data = getSuperComponentData(sComp);

  for (const c of data.componentsInst) {
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
  const { componentsInst } = getSuperComponentData(sComp);

  for (const c of componentsInst) {
    const removeDOMListener =
      c.removeFirstElementDOMListeners.get(DOMListenerObject);
    if (removeDOMListener) {
      c.removeFirstElementDOMListeners.delete(DOMListenerObject);
      removeDOMListener();
    }
  }
}

export function resetComponentVarsCache(sComp: SuperComponent) {
  const data = getSuperComponentData(sComp);
  const c = data.componentInstRunning;

  if (!c) return;

  c.componentVarsCache.clear();
}
