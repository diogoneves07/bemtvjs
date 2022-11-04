import isNumber from "./is-number";
import isString from "./is-string";

export default function isStringOrNumber(v: any) {
  return isString(v) || isNumber(v);
}
