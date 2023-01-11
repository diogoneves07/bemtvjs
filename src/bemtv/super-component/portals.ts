import ComponentInst from "../component-inst";
import { SuperComponent } from "./super-component";
import {
  runInComponentInst,
  updateComponentVars,
} from "./work-with-super-component";

type GetComponentInstPortalFn = (c: ComponentInst) => void;

type UsePortalFn<CompVars extends Record<string, any>> = {
  (c: PortalFn<CompVars>): void;
  key: string;
};
const PORTALS_STORE = new Map<string, GetComponentInstPortalFn>();

let count = 0;

export function usePortal(key: string) {
  const i = PORTALS_STORE.get(key);

  return i;
}

function definePortal(key: string, fn: GetComponentInstPortalFn) {
  PORTALS_STORE.set(key, fn);
}

function createPortalKey(name: string) {
  return `${name}_${count++}`;
}

//['div', {}, {}]

type PortalFn<V extends Record<string, any>> = (
  superComponent: SuperComponent<V>
) => void;

function createFakeSuperComponent(cInst: ComponentInst) {
  const sCompProxy = cInst.superComponent as any;
  const compVarsProxy = new Proxy(
    {},
    {
      get(_t, p) {
        const k = p as string;
        const value = sCompProxy.$[k];

        if (value instanceof Function) {
          return (...args: any[]) => {
            runInComponentInst(sCompProxy, cInst, () => {
              value(...args);
            });
          };
        }

        return sCompProxy.$[k];
      },
      set(_t, p, newValue) {
        runInComponentInst(sCompProxy, cInst, () => {
          sCompProxy.$[p] = newValue;
          updateComponentVars(sCompProxy);
        });
        return true;
      },
    }
  );

  const fakeSuperComponent = new Proxy(
    {},
    {
      get(_t, p) {
        const k = p as string;

        if (typeof sCompProxy[k] === "function") {
          return (...args: any[]) => {
            runInComponentInst(sCompProxy, cInst, () => {
              sCompProxy[k](...args);
            });
          };
        }

        return compVarsProxy;
      },
      set(_t, p, newValue) {
        sCompProxy[p] = newValue;
        return true;
      },
    }
  );

  return fakeSuperComponent;
}

export function createPortal<CompVars extends Record<string, any>>(
  componentName: string
) {
  let componentInst: ComponentInst | null = null;
  let fakeSuperComponent: SuperComponent<CompVars> | null = null;

  const fnList = new Set<PortalFn<any>>();

  const key = createPortalKey(componentName);

  const useComponentInst = (c: ComponentInst) => {
    componentInst = c;

    fakeSuperComponent = createFakeSuperComponent(
      c
    ) as SuperComponent<CompVars>;

    c.onInitWithHighPriority(() => {
      fnList.forEach((f) => f(fakeSuperComponent as any));
    });
  };

  definePortal(key, useComponentInst);

  const fn = ((f) => {
    if (componentInst) {
      f(fakeSuperComponent as SuperComponent<CompVars>);
      return;
    }

    fnList.add(f);
  }) as UsePortalFn<CompVars>;

  fn.key = key;

  return fn;
}
