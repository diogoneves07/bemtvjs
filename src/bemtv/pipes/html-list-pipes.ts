import { pipe } from "./main";

function transformToHTMLList<T extends any[] | Set<any>>(
  value: T,
  ordered = true
) {
  let v = value as string[];

  let parentTag = ordered ? "ol" : "ul";

  if (v instanceof Set) v = [...v];

  if (typeof v === "string") return v;

  v = v.slice();

  (v as any[]).forEach((x, index) => {
    let c = transformToHTMLList(x, ordered);

    if (c.slice && c.slice(0, 3) === `${parentTag}[`) {
      v[index - 1] = `${v[index - 1].slice(0, -1)} ${c} ]`;
      v[index] = "";
      return;
    }
    v[index] = `li[${c}]`;
  });

  return `${parentTag}[${v.join("")}]`;
}

export const orderedListPipe = pipe(<T extends any[] | Set<any>>(value: T) => {
  return transformToHTMLList(value, true);
});
export const unorderedListPipe = pipe(
  <T extends any[] | Set<any>>(value: T) => {
    return transformToHTMLList(value, false);
  }
);
