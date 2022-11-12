import isStringOrNumber from "../../utilities/is-string-or-number";
import { tFn } from "./main";

function transformToDescriptionList<T extends Record<string, any>>(
  value: T
): string {
  if (isStringOrNumber(value)) return value.toString();

  let v = value as Record<string, any>;

  if (v instanceof Map) v = Object.fromEntries(v);

  v = { ...v };
  let str = ``;

  for (const key of Object.keys(v)) {
    v[key] = transformToDescriptionList(v[key]);
    str += `dt[${key}] dd[${v[key]}]`;
  }

  return `dl[${str}]`;
}
export const tDescriptionList = tFn(transformToDescriptionList);
export const toDL = transformToDescriptionList;
