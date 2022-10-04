import { ComponentListener } from "./types/listeners";
import { ComponentThis, getComponentThisData } from "./components-this";
import { defineComponentInjectedProps } from "./components-injected-props";
import insertEventListener from "./insert-event-listener";
import isComponentName from "./is-component-name";
import isEventListener from "./is-event-listener";

function observerComponentInjectedProps(
  o: Record<string, any>,
  toComponentName: string,
  componentThis: ComponentThis
) {
  return new Proxy(o, {
    set(t, p, newValue) {
      if (typeof p !== "string") return false;

      defineComponentInjectedProps(componentThis, toComponentName, p, newValue);

      t[p] = newValue;
      return true;
    },
  });
}
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

      if (isComponentName(name)) {
        (target as any)[name] = observerComponentInjectedProps(
          {},
          name,
          propxyComponentThis
        );

        return (target as any)[name];
      }

      if (!isEventListener(name)) return;

      const fn = (
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

      (target as any)[name] = fn;

      return fn;
    },
    set(t, p, newValue) {
      if (typeof p === "string" && isComponentName(p)) {
        observerComponentInjectedProps(newValue, name, propxyComponentThis);
      }
      t[p as any] = newValue;

      return true;
    },
  });
  return propxyComponentThis;
}
