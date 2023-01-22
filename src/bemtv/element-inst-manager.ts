import { SimpleComponentDOMListener } from "./types/listeners";
import insertDOMListener from "./insert-dom-listener";
import isEventListener from "./is-event-listener";
import { ElementManager } from "./element-manager";
import { getElementManagerData } from "./work-with-element-manager";
import isString from "../utilities/is-string";

export function ElementManagerFactory<E extends Element = Element>() {
  const elementManager = new ElementManager<E>();
  const DOMListeners = getElementManagerData(elementManager).DOMListeners;

  return new Proxy(elementManager, {
    get(target, name) {
      const propName = name as string;
      let t = target as any;
      if (propName in target) {
        if (typeof t[propName] === "function") {
          return t[propName].bind(elementManager);
        }
        return t[propName];
      }
      if (isString(propName) && isEventListener(propName)) {
        const listenerName = propName.slice(0, -1);
        const newEventListener = (
          ...args: [fn: Function, options: AddEventListenerOptions]
        ) => {
          const DOMListenerObject: SimpleComponentDOMListener = {
            listener: listenerName,
            options: args[1],
            fn: (e: Event) => {
              if (args[1]?.once) {
                DOMListeners.delete(DOMListenerObject);
              }
              return args[0](e);
            },
          };

          DOMListeners.add(DOMListenerObject);

          if (!elementManager.el) {
            return () => {
              const r = DOMListenerObject?.removeListener;

              DOMListeners.delete(DOMListenerObject);

              r && r();
            };
          }

          const r = insertDOMListener(
            elementManager.el,
            DOMListenerObject.listener,
            ...args
          );

          DOMListenerObject.removeListener = r;

          return () => {
            DOMListeners.delete(DOMListenerObject);
            r();
          };
        };
        (target as any)[propName] = newEventListener;
        return newEventListener;
      }
    },
  });
}
