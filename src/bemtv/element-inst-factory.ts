import { ComponentListener } from "./types/listeners";
import insertDOMListener from "./insert-dom-listener";
import isEventListener from "./is-event-listener";
import { ElementInst } from "./element-inst";
import { getElementInstData } from "./work-with-element-inst";
import isString from "../utilities/is-string";

export function ElementInstFactory<E extends Element = Element>() {
  const elementInst = new ElementInst<E>();
  const DOMListeners = getElementInstData(elementInst).DOMListeners;

  return new Proxy(elementInst, {
    get(target, name) {
      const propName = name as string;
      let t = target as any;
      if (propName in target) {
        if (typeof t[propName] === "function") {
          return t[propName].bind(elementInst);
        }
        return t[propName];
      }
      if (isString(propName) && isEventListener(propName)) {
        const listenerName = propName.slice(0, -1);
        const newEventListener = (
          ...args: [fn: Function, options: AddEventListenerOptions]
        ) => {
          const DOMListenerObject: ComponentListener = {
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

          if (!elementInst.el) {
            return () => {
              const r = DOMListenerObject?.removeListener;

              DOMListeners.delete(DOMListenerObject);

              r && r();
            };
          }

          const r = insertDOMListener(
            elementInst.el,
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
