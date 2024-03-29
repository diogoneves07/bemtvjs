import isEventListener from "../bemtv/is-event-listener";
import { SuperComponent } from "./super-component";
import { LifeCycleCallback } from "../bemtv/types/simple-component-data";
import { SuperComponentDOMListener } from "../bemtv/types/super-component-data";
import {
  addLifeCycleToComponents,
  addDOMListenerToComponents,
  getSuperComponentData,
  removeDOMListenerFromComponents,
} from "./work-with-super-component";
import isString from "../utilities/is-string";
import hasRoute from "../router/has-route";

export function SuperComponentFactory<Vars extends Record<string, any>>(
  name: string,
  vars?: Vars
) {
  const superComponent = new SuperComponent<Vars>(name, vars);
  const data = getSuperComponentData(superComponent);
  const { DOMListeners } = data;

  const propxySimpleComponent = new Proxy(superComponent, {
    get(target, propertyName) {
      if (!isString(propertyName)) return false;

      let propName = propertyName as string;

      const t = target as Record<string, any>;

      if (propName === "onInst") return t[propName];

      if (propName.slice(0, 2) === "on") {
        return (callback: LifeCycleCallback) => {
          addLifeCycleToComponents(superComponent, propName, callback);
        };
      }

      if (propName in target) {
        if (typeof t[propName] === "function") {
          if (!hasRoute(t.componentName)) {
            switch (propName) {
              case "renderRoute":
              case "route":
                t.route();

                break;
            }
          }

          return t[propName].bind(superComponent);
        }
        return t[propName];
      }

      if (isEventListener(propName)) {
        const newEventListener = (
          fn: Function,
          options?: AddEventListenerOptions
        ) => {
          const DOMListenerObject: SuperComponentDOMListener = {
            listener: propName.slice(0, -1),
            options,
            fn: (e: Event) => {
              if (options?.once) {
                DOMListeners.delete(DOMListenerObject);
              }
              return fn(e);
            },
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
    },
  });

  data.sCompProxy = propxySimpleComponent;

  return propxySimpleComponent;
}
