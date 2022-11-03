export function treatValueInTemplate(value: any): string | false {
  let v = value;

  if (typeof v === "string") return v;
  if (v instanceof Set) v = [...v];
  if (v instanceof Map) v = Object.fromEntries(v);
  if (!Array.isArray(v)) return false;

  return (v.slice() as any[]).map((x) => treatValueInTemplate(x)).join("");
}
