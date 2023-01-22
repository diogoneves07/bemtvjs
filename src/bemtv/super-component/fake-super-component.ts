import SimpleComponent from "../simple-component";
import { FakeSuperComponentInternal } from "../types/fake-super-component";
import {
  runInSimpleComponent,
  updateComponentVars,
} from "./work-with-super-component";

export function createFakeSuperComponent<CompVars extends Record<string, any>>(
  cSimple: SimpleComponent,
  key: string
) {
  const sCompProxy = cSimple.superComponent as any;
  const compVarsProxy = new Proxy(
    {},
    {
      get(_t, p) {
        const k = p as string;
        const value = sCompProxy.$[k];

        if (value instanceof Function) {
          return (...args: any[]) => {
            runInSimpleComponent(
              sCompProxy,
              fakeSuperComponent.__simpleComponent,
              () => {
                value(...args);
              }
            );
          };
        }

        return sCompProxy.$[k];
      },
      set(_t, p, newValue) {
        runInSimpleComponent(
          sCompProxy,
          fakeSuperComponent.__simpleComponent,
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
    { key, isFakeSuperComponent: true, __simpleComponent: cSimple },
    {
      get(t, p) {
        const k = p as string;

        if (Object.hasOwn(t, p)) return (t as any)[p];

        if (typeof sCompProxy[k] === "function") {
          return (...args: any[]) => {
            runInSimpleComponent(
              sCompProxy,
              fakeSuperComponent.__simpleComponent,
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
