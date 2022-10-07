type ComponentData = {
  before: string;
  after: string;
  name: string;
  children: string;
};

const regexComponentName = /\b[A-Z]\w*?\[/;

function getAloneRightBracket(template: string) {
  let check = false;
  let count = 0;
  for (const char of template) {
    if (char === "[") {
      check = true;
    } else if (char === "]") {
      if (check) return count;
      check = false;
    }
    count++;
  }
  return -1;
}

export default function getNextComponentDataInTemplate(
  allTemplate: string
): ComponentData | false {
  const start = allTemplate.search(regexComponentName);

  if (start === -1) return false;

  const end = start + getAloneRightBracket(allTemplate.slice(start)) + 1;
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
