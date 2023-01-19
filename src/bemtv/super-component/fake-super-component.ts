import ComponentInst from "../component-inst";
import { FakeSuperComponentInternal } from "../types/fake-super-component";
import {
  runInComponentInst,
  updateComponentVars,
} from "./work-with-super-component";

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
    { key, isFakeSuperComponent: true, __componentInst: cInst },
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

  return fakeSuperComponent as FakeSuperComponentInternal<CompVars>;
}
