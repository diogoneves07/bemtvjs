import isEventListener from "./../is-event-listener";
import { SuperComponent } from "./super-component";
import { LifeCycleCallback } from "./../types/component-this-data";
import { SuperComponentListener } from "./../types/super-component-data";
import {
  addLifeCycleToComponents,
  addListenerToComponents,
  getSuperComponentData,
  removeListenerFromComponents,
} from "./work-with-super-component";

export function SuperComponentFactory<Vars extends Record<string, any>>(
  name: string,
  vars: Vars
) {
  const superComponent = new SuperComponent<Vars>(name, vars);
  const { listeners } = getSuperComponentData(superComponent);

  const propxyComponentThis = new Proxy(superComponent, {
    get(target, propertyName) {
      let name = propertyName as string;
      const t = target as Record<string, any>;

      if (name.slice(0, 2) === "on") {
        if (t[name]) return t[name];

        return (callback: LifeCycleCallback) => {
          addLifeCycleToComponents(superComponent, name, callback);
        };
      }

      if (name in target) {
        if (typeof t[name] === "function") {
          if (name === "$") {
            return t[name];
          }
          return t[name].bind(superComponent);
        }
        return t[name];
      }

      if (typeof name === "string" && isEventListener(name)) {
        const newEventListener = (
          ...args: [fn: Function, options: AddEventListenerOptions]
        ) => {
          const listenerObject: SuperComponentListener = {
            listener: name,
            args,
          };

          listeners.add(listenerObject);

          addListenerToComponents(superComponent, listenerObject);

          return () => {
            listeners.delete(listenerObject);
            removeListenerFromComponents(superComponent, listenerObject);
          };
        };

        t[name] = newEventListener;

        return newEventListener;
      }
      return false;
    },
  });
  return propxyComponentThis;
}
