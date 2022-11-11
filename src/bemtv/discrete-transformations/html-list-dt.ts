import isStringOrNumber from "../../utilities/is-string-or-number";
import { discreteTransform } from "./main";

function transformToHTMLList<T extends any[] | Set<any>>(
  value: T,
  ordered = true
) {
  if (isStringOrNumber(value)) return value.toString();

  let v = value as string[];

  let parentTag = ordered ? "ol" : "ul";

  if (v instanceof Set) v = [...v];

  v = v.slice();

  (v as any[]).forEach((x, index) => {
    let c = transformToHTMLList(x, ordered);

    if (c.slice && c.slice(0, 3) === `${parentTag}[`) {
      const lastValue = v[index - 1];

      v[index - 1] = `${lastValue.slice(0, -1)} ${c}${
        lastValue.trim() ? "]" : ""
      }`;
      v[index] = "";

      return;
    }
    v[index] = `li[${c}]`;
  });

  return `${parentTag}[${v.join("")}]`;
}

export const toOL = <T extends any[] | Set<any>>(value: T) => {
  return transformToHTMLList(value, true);
};
export const orderedListDT = discreteTransform(toOL);

export const toUL = <T extends any[] | Set<any>>(value: T) => {
  return transformToHTMLList(value, false);
};
export const unorderedListDT = discreteTransform(toUL);
