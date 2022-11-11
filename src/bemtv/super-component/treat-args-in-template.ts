import { DT_SYMBOL } from "../discrete-transformations/main";

export function treatArgsInTemplate(values: any[]) {
  const newValues: any[] = [];
  for (const value of values) {
    if (value && Object.hasOwn(value, DT_SYMBOL)) {
      let v = value;
      for (const discreteTransform of value[DT_SYMBOL]) {
        v = discreteTransform(v);
      }

      newValues.push(v);
      continue;
    }
    newValues.push(value);
  }

  return newValues;
}
