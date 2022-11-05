import { ComponentListener } from "./types/listeners";
import { ComponentInst } from "./components-inst";
import insertEventListener from "./insert-event-listener";
import isEventListener from "./is-event-listener";
import { getComponentInstData } from "./work-with-components-inst";
import isString from "../utilities/is-string";

export default function ComponentInstFactory(
  name: string,
  parent?: ComponentInst
) {
  const componentInst = new ComponentInst(name, parent);

  const componentInstData = getComponentInstData(componentInst);
  const listeners = componentInstData.listeners;

  const propxyComponentInst = new Proxy(componentInst, {
    get(target, name) {
      const propName = name as string;
      if (name in target) {
        if (typeof (target as any)[name] === "function") {
          return (target as any)[name].bind(componentInst);
        }
        return (target as any)[name];
      }

      if (isString(propName) && isEventListener(propName)) {
        const newEventListener = (
          ...args: [fn: Function, options: AddEventListenerOptions]
        ) => {
          const listenerObject: ComponentListener = {
            listener: propName.slice(0, -1),
            args,
          };

          listeners.add(listenerObject);

          if (componentInstData.firstElement) {
            return insertEventListener(
              componentInstData.firstElement,
              listenerObject.listener,
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
      }
    },
  });
  return propxyComponentInst;
}
