export default function concatTemplateStringArrays<T extends any[]>(
  a: TemplateStringsArray,
  exps: any[]
) {
  const result: any[] = [];
  exps.forEach((value, index) => result.push(a[index], value));
  result.push(a[a.length - 1]);
  return result as T;
}
