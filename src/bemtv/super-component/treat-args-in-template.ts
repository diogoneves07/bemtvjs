import { T_FNS_SYMBOL } from "../transformation-functions/main";

export function treatArgsInTemplate(values: any[]) {
  const newValues: any[] = [];
  for (const value of values) {
    if (value && Object.hasOwn(value, T_FNS_SYMBOL)) {
      let v = value;
      for (const tFn of value[T_FNS_SYMBOL]) {
        v = tFn(v);
      }

      newValues.push(v);
      continue;
    }
    if (typeof value === "function" && value.key) {
      newValues.push(value.key);
      continue;
    }
    newValues.push(value);
  }

  return newValues;
}
