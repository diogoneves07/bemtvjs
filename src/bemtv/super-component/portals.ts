import { LIBRARY_NAME_IN_ERRORS_MESSAGE } from "./../../globals";
import ComponentInst from "../component-inst";
import { getSuperComponentInst } from "../components-main";
import { SuperComponent } from "./super-component";
import {
  runInComponentInst,
  updateComponentVars,
} from "./work-with-super-component";
import { bindComponentToSuperComponent } from "./bind-comp-to-s-comp";

export interface FakeSuperComponent<CompVars extends Record<string, any>>
  extends SuperComponent<CompVars> {
  key: string;
  isSuperComponentFake: true;
  __componentInst: ComponentInst;
}

const PORTALS_STORE = new Map<string, () => ComponentInst>();

let count = 0;

function createPortalKey(name: string) {
  return `${name}_${count++}`;
}

export function usePortal(key: string) {
  const i = PORTALS_STORE.get(key);

  return i && i();
}

function definePortal(key: string, c: () => ComponentInst) {
  PORTALS_STORE.set(key, c);
}

export function createFakeSuperComponent<CompVars extends Record<string, any>>(
  cInst: ComponentInst,
  key: string
) {
  const sCompProxy = cInst.superComponent as any;
  const compVarsProxy = new Proxy(
    {},
    {
      get(_t, p) {
        const k = p as string;
        const value = sCompProxy.$[k];

        if (value instanceof Function) {
          return (...args: any[]) => {
            runInComponentInst(
              sCompProxy,
              fakeSuperComponent.__componentInst,
              () => {
                value(...args);
              }
            );
          };
        }

        return sCompProxy.$[k];
      },
      set(_t, p, newValue) {
        runInComponentInst(
          sCompProxy,
          fakeSuperComponent.__componentInst,
          () => {
            sCompProxy.$[p] = newValue;
            updateComponentVars(sCompProxy);
          }
        );
        return true;
      },
    }
  );

  const fakeSuperComponent = new Proxy(
    { key, isSuperComponentFake: true, __componentInst: cInst },
    {
      get(t, p) {
        const k = p as string;

        if (Object.hasOwn(t, p)) return (t as any)[p];

        if (typeof sCompProxy[k] === "function") {
          return (...args: any[]) => {
            runInComponentInst(
              sCompProxy,
              fakeSuperComponent.__componentInst,
              () => {
                sCompProxy[k](...args);
              }
            );
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

  return fakeSuperComponent as FakeSuperComponent<CompVars>;
}

export function createPortal<CompVars extends Record<string, any>>(
  componentName: string
) {
  const realSuperComponent = getSuperComponentInst(componentName);

  if (!realSuperComponent)
    throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} The SuperComponent “${componentName}” was not created!`;

  const key = createPortalKey(componentName);

  let componentInst = new ComponentInst(componentName, null, key);

  componentInst.defineComponentTemplate(
    bindComponentToSuperComponent(componentInst)
  );

  const fakeSuperComponent = createFakeSuperComponent<CompVars>(
    componentInst,
    key
  );

  let isFirstInst = true;

  definePortal(key, () => {
    if (isFirstInst) {
      isFirstInst = false;
      return componentInst;
    }
    componentInst = new ComponentInst(componentName, null, key);

    componentInst.defineComponentTemplate(
      bindComponentToSuperComponent(componentInst)
    );
    fakeSuperComponent.__componentInst = componentInst;

    return componentInst;
  });

  return fakeSuperComponent;
}
