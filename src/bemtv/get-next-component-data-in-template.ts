import { REGEX_COMPONENT_NAME } from "./globals";

type ComponentData = {
  before: string;
  after: string;
  name: string;
  children: string;
  fallback: string;
};

function getRightBracketOfThePairIndex(template: string, bracket: "]" | ")") {
  let isPair = false;
  let count = 0;

  const leftBracket = bracket === "]" ? "[" : "(";

  for (const char of template) {
    if (char === leftBracket) isPair = !isPair;

    if (isPair && char === bracket) break;

    if (char === bracket) isPair = !isPair;

    count++;
  }

  return count;
}

function getComponentData(start: number, end: number, template: string) {
  const t = template.slice(start, end);

  const leftBracketIndex = t.indexOf("[");

  const before = template.slice(0, start);
  let after = template.slice(end);
  const name = t.slice(0, leftBracketIndex);
  const children = t.slice(leftBracketIndex + 1, -1);
  let fallback = "";

  if (after[0] === "(") {
    const i = getRightBracketOfThePairIndex(after, ")");

    fallback = after.slice(1, i);
    after = after.slice(i + 1);
  }

  return {
    before,
    after,
    name,
    children,
    fallback,
  };
}
export default function getNextComponentDataInTemplate(
  template: string
): ComponentData | false {
  const start = template.search(REGEX_COMPONENT_NAME);

  if (start === -1) return false;

  const end =
    start + getRightBracketOfThePairIndex(template.slice(start), "]") + 1;

  return getComponentData(start, end, template);
}

export function getComponentDataByName(name: string, template: string) {
  const start = template.search(name);

  const end =
    start + getRightBracketOfThePairIndex(template.slice(start), "]") + 1;

  return getComponentData(start, end, template);
}

export function getTopLevelComponentsName(template: string): string[] {
  let removeFallbacks = template;

  (function rec() {
    const i = removeFallbacks.indexOf("](");

    if (i === -1) return;

    removeFallbacks =
      removeFallbacks.slice(0, i + 1) +
      removeFallbacks.slice(
        getRightBracketOfThePairIndex(removeFallbacks, ")") + 1
      );

    rec();
  })();

  const l = removeFallbacks.match(/\b[A-Z][\w|:]*(?=\[)/g) || [];

  return l;
}
