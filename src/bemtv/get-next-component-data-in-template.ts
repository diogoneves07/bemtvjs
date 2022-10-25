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

export default function getNextComponentDataInTemplate(
  allTemplate: string
): ComponentData | false {
  const start = allTemplate.search(REGEX_COMPONENT_NAME);

  if (start === -1) return false;

  const end = start + getComponentRightBracket(allTemplate.slice(start)) + 1;
  const template = allTemplate.slice(start, end);

  const leftBracketIndex = template.indexOf("[");

  const before = allTemplate.slice(0, start);
  const after = allTemplate.slice(end);
  const name = template.slice(0, leftBracketIndex);
  const children = template.slice(leftBracketIndex + 1, -1);

  return {
    before,
    after,
    name,
    children,
  };
}
