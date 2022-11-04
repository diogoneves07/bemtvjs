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
import isString from "../../utilities/is-string";

export function SuperComponentFactory<Vars extends Record<string, any>>(
  name: string,
  vars: Vars
) {
  const superComponent = new SuperComponent<Vars>(name, vars);
  const { listeners } = getSuperComponentData(superComponent);

  const propxyComponentThis = new Proxy(superComponent, {
    get(target, propertyName) {
      let propName = propertyName as string;
      const t = target as Record<string, any>;

      if (propName.slice(0, 2) === "on") {
        if (t[propName]) return t[propName];

        return (callback: LifeCycleCallback) => {
          addLifeCycleToComponents(superComponent, propName, callback);
        };
      }

      if (propName in target) {
        if (typeof t[propName] === "function") {
          if (propName === "$") {
            return t[propName];
          }
          return t[propName].bind(superComponent);
        }
        return t[propName];
      }

      if (isString(propName) && isEventListener(propName)) {
        const newEventListener = (
          ...args: [fn: Function, options: AddEventListenerOptions]
        ) => {
          const listenerObject: SuperComponentListener = {
            listener: propName,
            args,
          };

          listeners.add(listenerObject);

          addListenerToComponents(superComponent, listenerObject);

          return () => {
            listeners.delete(listenerObject);
            removeListenerFromComponents(superComponent, listenerObject);
          };
        };

        t[propName] = newEventListener;

        return newEventListener;
      }
      return false;
    },
  });
  return propxyComponentThis;
}
