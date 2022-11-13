import { ComponentListener } from "./types/listeners";
import insertDOMListener from "./insert-dom-listener";
import isEventListener from "./is-event-listener";
import { ManageEl } from "./manage-el";
import { getManageElData } from "./work-with-el-manager";
import isString from "../utilities/is-string";

export function ManageElFactory<E extends Element = Element>() {
  const elManager = new ManageEl<E>();
  const DOMlisteners = getManageElData(elManager).DOMlisteners;

  return new Proxy(elManager, {
    get(target, name) {
      const propName = name as string;
      let t = target as any;
      if (propName in target) {
        if (typeof t[propName] === "function") {
          return t[propName].bind(elManager);
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

          if (elManager.it) {
            const r = insertDOMListener(
              elManager.it,
              DOMListenerObject.listener,
              ...args
            );
            DOMListenerObject.removeListener = r;
            return r;
          }

          return () => {
            if (!DOMListenerObject.removeListener) {
              DOMlisteners.delete(DOMListenerObject);
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
