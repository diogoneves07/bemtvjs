import { ComponentListener } from "./types/listeners";
import { ComponentThis } from "./components-this";
import insertEventListener from "./insert-event-listener";
import isEventListener from "./is-event-listener";
import { getComponentThisData } from "./work-with-components-this";

export default function ComponentThisFactory(
  name: string,
  parent?: ComponentThis
) {
  const componentThis = new ComponentThis(name, parent);

  const componentThisData = getComponentThisData(componentThis);
  const listeners = componentThisData.listeners;

  const propxyComponentThis = new Proxy(componentThis, {
    get(target, name) {
      if (name in target) {
        if (typeof (target as any)[name] === "function") {
          return (target as any)[name].bind(componentThis);
        }
        return (target as any)[name];
      }

      if (typeof name !== "string") return false;

      if (!isEventListener(name)) return;

      const newEventListener = (
        ...args: [fn: Function, options: AddEventListenerOptions]
      ) => {
        const listenerObject: ComponentListener = {
          listener: name.slice(0, -1),
          args,
        };

        listeners.add(listenerObject);

        if (componentThisData.firstElement) {
          return insertEventListener(
            componentThisData.firstElement,
            name,
            ...args
          );
        }

        return () => {
          if (!listenerObject.removeListener) {
            listeners.delete(listenerObject);
            return;
          }

          listenerObject.removeListener();
        };
      };

      (target as any)[name] = newEventListener;

      return newEventListener;
    },
  });
  return propxyComponentThis;
}
