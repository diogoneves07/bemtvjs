const CACHE: Record<string, boolean> = {};
const SIMPLE_DIV = document.createElement("div");
export default function isSelfClosingTag(tag: string) {
  if (CACHE[tag]) return CACHE[tag];
  SIMPLE_DIV.innerHTML = `<${tag}></${tag}>`;

  const element = SIMPLE_DIV.children[0];
  const check = !element.outerHTML.includes(`</${tag}>`);

  CACHE[tag] = check;
  return check;
}
