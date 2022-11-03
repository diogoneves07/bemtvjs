import { pipe } from "./main";

function transformToDescriptionList<T extends Record<string, any>>(
  value: T
): string {
  let v = value as Record<string, any>;
  if (typeof v === "string") return v;

  if (v instanceof Map) v = Object.fromEntries(v);
  v = { ...v };
  let str = ``;

  for (const key of Object.keys(v)) {
    v[key] = transformToDescriptionList(v[key]);
    str = `dt[${key}] dd[${v[key]}]`;
  }

  return `dl[${str}]`;
}
export const descriptionListPipe = pipe(transformToDescriptionList);
