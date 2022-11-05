import { ComponentThis } from "./../components-this";
import { SuperComponent } from "./super-component";
import { LifeCycleCallback } from "./../types/component-this-data";
import {
  ComponentProps,
  SuperComponentListener,
} from "./../types/super-component-data";

export function getSuperComponentData(sComp: SuperComponent) {
  return (sComp as any).__data as SuperComponent["__data"];
}

export function getComponentVars(sComp: SuperComponent) {
  const data = getSuperComponentData(sComp);
  const c = data.componentRunning;
  return c ? data.components.get(c)?.vars || {} : {};
}

export function setRunningComponent(
  sComp: SuperComponent,
  c?: ComponentThis | null
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
  const lifeCallback = (c: ComponentThis) => {
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

export function addListenerToComponent(
  sComp: SuperComponent,
  l: SuperComponentListener,
  c: ComponentThis
) {
  const [listenerFn, listenerObject] = l.args;

  const fn = (e: Event) => {
    setRunningComponent(sComp, c);
    listenerFn(e);
    updateComponentVars(sComp);
    setRunningComponent(sComp);
  };

  const data = getSuperComponentData(sComp);

  const removeListener = (c as any)[l.listener](
    fn,
    listenerObject
  ) as () => void;

  data.removeListeners.get(l)?.push(removeListener);
}

export function addListenerToComponents(
  sComp: SuperComponent,
  listener: SuperComponentListener
) {
  const data = getSuperComponentData(sComp);

  const components = [...data.components.keys()];

  data.removeListeners.set(listener, []);

  for (const c of components) {
    addListenerToComponent(sComp, listener, c);
  }
}

export function removeListenerFromComponents(
  sComp: SuperComponent,
  listener: SuperComponentListener
) {
  getSuperComponentData(sComp)
    .removeListeners.get(listener)
    ?.forEach((fn) => fn());
}

export function resetTemplatePropertyValues(sComp: SuperComponent, p: string) {
  const data = getSuperComponentData(sComp);

  if (!data.componentRunning) return;

  const c = data.components.get(data.componentRunning);

  if (!c) return;

  c.templatePropertyValues.delete(p);
}
