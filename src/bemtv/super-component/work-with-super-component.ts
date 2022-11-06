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

export function getComponentVars(sComp: SuperComponent) {
  const data = getSuperComponentData(sComp);
  const c = data.componentRunning;
  return c ? data.components.get(c)?.vars || {} : {};
}

export function setRunningComponent(
  sComp: SuperComponent,
  c?: ComponentInst | null
) {
  const data = getSuperComponentData(sComp);

  data.componentRunning = c || null;

  const keys = data.initVarsKeys;
  const vars = getComponentVars(sComp) as ComponentProps["vars"];

  data.$disableProxy = true;
  keys.forEach((p) => ((sComp.$ as any)[p] = vars[p]));
  data.$disableProxy = false;
}

export function updateComponentVars(sComp: SuperComponent) {
  const data = getSuperComponentData(sComp);
  const vars = getComponentVars(sComp) as ComponentProps["vars"];

  data.$disableProxy = true;
  data.initVarsKeys.forEach((p) => {
    vars[p] = sComp.$[p] as any;
  });

  data.$disableProxy = false;
}

export function addLifeCycleToComponents(
  sComp: SuperComponent,
  name: string,
  callback: LifeCycleCallback
) {
  const data = getSuperComponentData(sComp);
  const lifeCallback = (c: ComponentInst) => {
    setRunningComponent(sComp, c);
    callback();
    setRunningComponent(sComp);
  };

  for (const [c] of data.components) {
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
    setRunningComponent(sComp, c);
    callback(e);
    updateComponentVars(sComp);
    setRunningComponent(sComp);
  };

  const data = getSuperComponentData(sComp);

  const removeDOMListener = insertDOMListener(
    firstElement,
    type,
    fn,
    DOMListenerOptions
  );

  const componentData = data.components.get(c);

  if (!componentData) return;

  const bucket =
    componentData.removeFirstElementDOMListeners.get(DOMListenerObject);

  if (bucket) {
    bucket.push(removeDOMListener);
  } else {
    componentData.removeFirstElementDOMListeners.set(DOMListenerObject, [
      removeDOMListener,
    ]);
  }
}

export function addDOMListenerToComponents(
  sComp: SuperComponent,
  DOMListenerObject: SuperComponentDOMListener
) {
  const data = getSuperComponentData(sComp);

  const components = [...data.components.keys()];

  for (const c of components) {
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
  const components = getSuperComponentData(sComp).components.values();

  for (const o of components) {
    const bucket = o.removeFirstElementDOMListeners.get(DOMListenerObject);
    if (bucket) {
      bucket.forEach((f) => f());
      o.removeFirstElementDOMListeners.delete(DOMListenerObject);
    }
  }
}

export function resetTemplatePropertyValues(sComp: SuperComponent, p: string) {
  const data = getSuperComponentData(sComp);

  if (!data.componentRunning) return;

  const c = data.components.get(data.componentRunning);

  if (!c) return;

  c.templatePropertyValues.delete(p);
}
