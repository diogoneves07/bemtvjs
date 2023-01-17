import { ComponentListener } from "./types/listeners";
import insertDOMListener from "./insert-dom-listener";
import isEventListener from "./is-event-listener";
import { ElementInst } from "./element-inst";
import { getElementInstData } from "./work-with-element-inst";
import isString from "../utilities/is-string";

export function ElementInstFactory<E extends Element = Element>() {
  const elementInst = new ElementInst<E>();
  const DOMlisteners = getElementInstData(elementInst).DOMlisteners;

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
        const newEventListener = (
          ...args: [fn: Function, options: AddEventListenerOptions]
        ) => {
          const DOMListenerObject: ComponentListener = {
            listener: propName.slice(0, -1),
            args,
          };

          DOMlisteners.add(DOMListenerObject);

          if (elementInst.el) {
            const r = insertDOMListener(
              elementInst.el,
              DOMListenerObject.listener,
              ...args
            );
            DOMListenerObject.removeListener = r;

            return () => {
              DOMlisteners.delete(DOMListenerObject);
              r();
            };
          }

          return () => {
            const r = DOMListenerObject?.removeListener;

            DOMlisteners.delete(DOMListenerObject);

            r && r();
          };
        };
        (target as any)[propName] = newEventListener;
        return newEventListener;
      }
    },
  });
}
