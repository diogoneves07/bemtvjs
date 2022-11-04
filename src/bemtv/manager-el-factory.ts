import { ComponentListener } from "./types/listeners";
import insertEventListener from "./insert-event-listener";
import isEventListener from "./is-event-listener";
import { ManagerEl } from "./manager-el";
import { getManagerElData } from "./work-with-manager-el";
import isString from "../utilities/is-string";

export function ManagerElFactory<E extends Element = Element>(key: string) {
  const managerEl = new ManagerEl<E>(key);
  const listeners = getManagerElData(managerEl).listeners;

  return new Proxy(managerEl, {
    get(target, name) {
      const propName = name as string;
      if (propName in target) return (target as any)[propName];
      if (isString(propName) && isEventListener(propName)) {
        const newEventListener = (
          ...args: [fn: Function, options: AddEventListenerOptions]
        ) => {
          const listenerObject: ComponentListener = {
            listener: propName.slice(0, -1),
            args,
          };

          listeners.add(listenerObject);

          if (managerEl.it)
            return insertEventListener(
              managerEl.it,
              listenerObject.listener,
              ...args
            );

          return () => {
            if (!listenerObject.removeListener) {
              listeners.delete(listenerObject);
              return;
            }

            listenerObject.removeListener();
          };
        };
        (target as any)[propName] = newEventListener;
        return newEventListener;
      }
    },
  });
}
