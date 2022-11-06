import isEventListener from "./../is-event-listener";
import { SuperComponent } from "./super-component";
import { LifeCycleCallback } from "../types/component-inst-data";
import { SuperComponentDOMListener } from "./../types/super-component-data";
import {
  addLifeCycleToComponents,
  addDOMListenerToComponents,
  getSuperComponentData,
  removeDOMListenerFromComponents,
} from "./work-with-super-component";
import isString from "../../utilities/is-string";

export function SuperComponentFactory<Vars extends Record<string, any>>(
  name: string,
  vars: Vars
) {
  const superComponent = new SuperComponent<Vars>(name, vars);
  const data = getSuperComponentData(superComponent);
  const { DOMListeners } = data;

  const propxyComponentInst = new Proxy(superComponent, {
    get(target, propertyName) {
      if (!isString(propertyName)) return false;

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

      if (isEventListener(propName)) {
        const newEventListener = (
          callback: Function,
          options?: AddEventListenerOptions
        ) => {
          const DOMListenerObject: SuperComponentDOMListener = {
            type: propName.slice(0, -1),
            options,
            callback,
          };

          DOMListeners.add(DOMListenerObject);

          addDOMListenerToComponents(superComponent, DOMListenerObject);

          return () => {
            DOMListeners.delete(DOMListenerObject);
            removeDOMListenerFromComponents(superComponent, DOMListenerObject);
          };
        };

        t[propName] = newEventListener;

        return newEventListener;
      }
      return false;
    },
  });

  data.sCompProxy = propxyComponentInst;

  return propxyComponentInst;
}
