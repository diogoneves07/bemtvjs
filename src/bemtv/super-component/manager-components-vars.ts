import { PIPE_SYMBOL } from "../pipes/main";
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

function insertPipeSymbol(v: any, p?: undefined | any) {
  p &&
    Object.defineProperties(v, {
      [PIPE_SYMBOL]: {
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
  let pipes: undefined | any;

  if (value && Object.hasOwn(value, PIPE_SYMBOL)) {
    pipes = value[PIPE_SYMBOL];
  }

  if (value instanceof Set) return insertPipeSymbol(new Set([...value]), pipes);
  if (value instanceof Map) return insertPipeSymbol(new Map([...value]), pipes);
  if (Array.isArray(value)) return insertPipeSymbol([...value], pipes);
  if (typeof value === "object") return insertPipeSymbol({ ...value }, pipes);

  return value;
}

export default function managerComponentsVars<O extends Record<string, any>>(
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

      if (typeof p === "symbol") return target[p];

      if (!data.$disableProxies) {
        resetComponentVarsCache(sComp);
        const value = target[name];

        if (!Object.hasOwn(value, SYMBOL_IS_PROXY)) {
          target[name] = Object.hasOwn(value, SYMBOL_IS_CLONE)
            ? value
            : cloneData(value);

          if (isRealObject(target[name])) {
            target[name] = managerComponentsVars(target[name], sComp);
          }
        }
      }
      return target[name];
    },

    set(t, p, n) {
      const name = p as string;
      const target = t as any;

      if (!data.$disableProxies) {
        resetComponentVarsCache(sComp);
      }
      target[name] = n;
      return true;
    },
  });
}
