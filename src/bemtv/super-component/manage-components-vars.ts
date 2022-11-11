import { DT_SYMBOL } from "../discrete-transformations/main";
import { SuperComponent } from "./super-component";
import {
  getSuperComponentData,
  resetComponentVarsCache,
} from "./work-with-super-component";

const SYMBOL_IS_CLONE = Symbol("Is a clone");
const SYMBOL_IS_PROXY = Symbol("Is a Proxy");

function isRealObject(value: any) {
  if (value instanceof Set) return false;
  if (value instanceof Map) return false;
  if (Array.isArray(value)) return false;

  return !Array.isArray(value) && typeof value === "object";
}

function insertDiscreteTransformSymbol(v: any, p?: undefined | any) {
  p &&
    Object.defineProperties(v, {
      [DT_SYMBOL]: {
        value: p,
        configurable: false,
      },
      [SYMBOL_IS_CLONE]: {
        value: true,
        configurable: false,
      },
    });

  return v;
}
function cloneData(value: any) {
  let dtFns: undefined | any;

  if (value && Object.hasOwn(value, DT_SYMBOL)) {
    dtFns = value[DT_SYMBOL];
  }

  if (value instanceof Set)
    return insertDiscreteTransformSymbol(new Set([...value]), dtFns);
  if (value instanceof Map)
    return insertDiscreteTransformSymbol(new Map([...value]), dtFns);
  if (Array.isArray(value))
    return insertDiscreteTransformSymbol([...value], dtFns);
  if (typeof value === "object")
    return insertDiscreteTransformSymbol({ ...value }, dtFns);

  return value;
}

export default function manageComponentsVars<O extends Record<string, any>>(
  o: O,
  sComp: SuperComponent
) {
  Object.defineProperty(o, SYMBOL_IS_PROXY, {
    value: true,
    configurable: false,
  });

  const data = getSuperComponentData(sComp);

  return new Proxy(o, {
    get(t, p) {
      const name = p as string;
      const target = t as any;

      if (!data.$disableProxies) {
        resetComponentVarsCache(sComp);
        const value = target[name];

        if (value && !Object.hasOwn(value, SYMBOL_IS_PROXY)) {
          target[name] = Object.hasOwn(value, SYMBOL_IS_CLONE)
            ? value
            : cloneData(value);

          if (isRealObject(target[name])) {
            target[name] = manageComponentsVars(target[name], sComp);
          }
        }
      }
      return target[name];
    },

    set(t, p, n, r) {
      const name = p as string;
      const target = t as any;

      if (
        sComp.$ === r &&
        !Object.hasOwn(t, name) &&
        !data.componentsVarsKeys.includes(name)
      ) {
        data.componentsVarsKeys.push(name);
      }

      if (!data.$disableProxies) {
        resetComponentVarsCache(sComp);
      }
      target[name] = n;
      return true;
    },
  });
}
