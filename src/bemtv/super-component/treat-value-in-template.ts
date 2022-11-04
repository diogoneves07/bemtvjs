import isStringOrNumber from "../../utilities/is-string-or-number";

export function treatValueInTemplate(value: any): string | false {
  let v = value;

  if (v instanceof Set) v = [...v];
  if (v instanceof Map) v = Object.fromEntries(v);
  if (isStringOrNumber(v)) return v.toString();

  if (!Array.isArray(v)) return false;

  return (v.slice() as any[]).map((x) => treatValueInTemplate(x)).join("");
}
