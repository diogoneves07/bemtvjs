import { DT_SYMBOL } from "../transformation-functions/main";

export function treatArgsInTemplate(values: any[]) {
  const newValues: any[] = [];
  for (const value of values) {
    if (value && Object.hasOwn(value, DT_SYMBOL)) {
      let v = value;
      for (const tFn of value[DT_SYMBOL]) {
        v = tFn(v);
      }

      newValues.push(v);
      continue;
    }
    newValues.push(value);
  }

  return newValues;
}
