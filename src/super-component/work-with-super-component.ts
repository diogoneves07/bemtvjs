import { SuperComponent } from "./super-component";
import { LifeCycleCallback } from "../bemtv/types/simple-component-data";
import { SuperComponentDOMListener } from "../bemtv/types/super-component-data";
import insertDOMListener from "../bemtv/dom/insert-dom-listener";
import SimpleComponent from "../bemtv/simple-component";
import { setSimpleComponentRunningOnTop } from "../bemtv/simple-component-on-top";

export function getSuperComponentData(sComp: SuperComponent) {
  return (sComp as any).__data as SuperComponent["__data"];
}

export function getSimpleComponentFirstElement(c: SimpleComponent) {
  return (c.getAllNodes().find((n) => n instanceof Element) as Element) || null;
}

export function getSimpleComponentNodes(c: SimpleComponent) {
  return c.getAllNodes();
}

const EMPTY_OBJECT = {};
export function getSimpleComponentRunningVars(sComp: SuperComponent) {
  const data = getSuperComponentData(sComp);
  const c = data.simpleComponentRunning;
  return c ? c.componentVars || EMPTY_OBJECT : EMPTY_OBJECT;
}

export function runInSimpleComponent(
  sComp: SuperComponent,
  cSimple: SimpleComponent | null,
  callback: () => void
) {
  const data = getSuperComponentData(sComp);
  const lastSimpleComponent = data.simpleComponentRunning;

  const setCompVars = () => {
    if (!data.simpleComponentRunning) return;

    const vars = getSimpleComponentRunningVars(sComp);

    data.disableVarsProxies();

    for (const p of data.componentsVarsKeys) {
      (sComp.$ as any)[p] = vars[p];
    }

    data.activateVarsProxies();
  };

  data.simpleComponentRunning = cSimple;

  setSimpleComponentRunningOnTop(cSimple);

  setCompVars();
  callback();

  data.simpleComponentRunning = lastSimpleComponent;

  setSimpleComponentRunningOnTop(lastSimpleComponent);

  setCompVars();
}

export function updateComponentVars(sComp: SuperComponent) {
  const data = getSuperComponentData(sComp);
  const vars = getSimpleComponentRunningVars(sComp);

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
  const lifeCallback = (c: SimpleComponent) => {
    runInSimpleComponent(sComp, c, () => {
      callback();
      updateComponentVars(sComp);
    });
  };

  for (const c of data.simpleComponents) {
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
  c: SimpleComponent
) {
  const {
    listener,
    fn: callback,
    options: DOMListenerOptions,
  } = DOMListenerObject;

  const fn = (e: Event) => {
    runInSimpleComponent(sComp, c, () => {
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

  for (const c of data.simpleComponents) {
    const firstElement = getSimpleComponentFirstElement(c);
    if (firstElement) {
      addDOMListenerToComponent(firstElement, sComp, DOMListenerObject, c);
    }
  }
}

export function removeDOMListenerFromComponents(
  sComp: SuperComponent,
  DOMListenerObject: SuperComponentDOMListener
) {
  const { simpleComponents } = getSuperComponentData(sComp);

  for (const c of simpleComponents) {
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
  const c = data.simpleComponentRunning;

  if (!c) return;

  c.componentVarsCache.clear();
}
