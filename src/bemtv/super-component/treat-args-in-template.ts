import { PIPE_SYMBOL } from "../pipes/main";

export function treatArgsInTemplate(values: any[]) {
  const newValues: any[] = [];
  for (const value of values) {
    if (value && Object.hasOwn(value, PIPE_SYMBOL)) {
      let v = value;
      for (const pipe of value[PIPE_SYMBOL]) {
        v = pipe(v);
      }

      newValues.push(v);
      continue;
    }
    newValues.push(value);
  }

  return newValues;
}
