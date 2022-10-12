import { ComponentListener } from "./types/listeners";
import insertEventListener from "./insert-event-listener";
import isEventListener from "./is-event-listener";
import { getManagerElData, ManagerEl } from "./manager-el";

export function ManagerElFactory<E extends Element = Element>(key: string) {
  const managerEl = new ManagerEl<E>(key);
  const listeners = getManagerElData(managerEl).listeners;

  return new Proxy(managerEl, {
    get(target, name) {
      if (name in target) return (target as any)[name];
      if (typeof name !== "string" || !isEventListener(name)) return false;

      const fn = (
        ...args: [fn: Function, options: AddEventListenerOptions]
      ) => {
        const listenerObject: ComponentListener = {
          listener: name.slice(0, -1),
          args,
        };

        listeners.add(listenerObject);

        if (managerEl.it)
          return insertEventListener(managerEl.it, name, ...args);

        return () => {
          if (!listenerObject.removeListener) {
            listeners.delete(listenerObject);
            return;
          }

          listenerObject.removeListener();
        };
      };
      (target as any)[name] = fn;
      return fn;
    },
  });
}
