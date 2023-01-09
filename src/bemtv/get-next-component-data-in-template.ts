import { REGEX_COMPONENT_NAME } from "./globals";

type ComponentData = {
  before: string;
  after: string;
  name: string;
  children: string;
};

function getComponentRightBracket(template: string) {
  let isPair = false;
  let count = 0;
  for (const char of template) {
    if (char === "[") isPair = !isPair;

    if (isPair && char === "]") break;

    if (char === "]") isPair = !isPair;

    count++;
  }

  return count;
}

function getComponentData(start: number, end: number, template: string) {
  const t = template.slice(start, end);

  const leftBracketIndex = t.indexOf("[");

  const before = template.slice(0, start);
  const after = template.slice(end);
  const name = t.slice(0, leftBracketIndex);
  const children = t.slice(leftBracketIndex + 1, -1);

  return {
    before,
    after,
    name,
    children,
  };
}
export default function getNextComponentDataInTemplate(
  template: string
): ComponentData | false {
  const start = template.search(REGEX_COMPONENT_NAME);

  if (start === -1) return false;

  const end = start + getComponentRightBracket(template.slice(start)) + 1;

  return getComponentData(start, end, template);
}

export function getComponentDataByName(name: string, template: string) {
  const start = template.search(name);

  const end = start + getComponentRightBracket(template.slice(start)) + 1;

  return getComponentData(start, end, template);
}

export function getTopLevelComponentsName(template: string): string[] {
  const l = template.match(/\b[A-Z][\w|:]*(?=\[)/g);

  return l || [];
}
