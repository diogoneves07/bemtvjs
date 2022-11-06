import { ComponentListener } from "./types/listeners";
import insertDOMListener from "./insert-dom-listener";
import isEventListener from "./is-event-listener";
import { ManagerEl } from "./manager-el";
import { getManagerElData } from "./work-with-manager-el";
import isString from "../utilities/is-string";

export function ManagerElFactory<E extends Element = Element>() {
  const managerEl = new ManagerEl<E>();
  const listeners = getManagerElData(managerEl).listeners;

  return new Proxy(managerEl, {
    get(target, name) {
      const propName = name as string;
      if (propName in target) return (target as any)[propName];
      if (isString(propName) && isEventListener(propName)) {
        const newEventListener = (
          ...args: [fn: Function, options: AddEventListenerOptions]
        ) => {
          const DOMListenerObject: ComponentListener = {
            listener: propName.slice(0, -1),
            args,
          };

          listeners.add(DOMListenerObject);

          if (managerEl.it)
            return insertDOMListener(
              managerEl.it,
              DOMListenerObject.listener,
              ...args
            );

          return () => {
            if (!DOMListenerObject.removeListener) {
              listeners.delete(DOMListenerObject);
              return;
            }

            DOMListenerObject.removeListener();
          };
        };
        (target as any)[propName] = newEventListener;
        return newEventListener;
      }
    },
  });
}
