import { EMPTY_LINE_SYMBOL } from "./globals";

const regexEmptyLine = new RegExp(
  `\\n[\\s?]*?(${EMPTY_LINE_SYMBOL})[\\s?]*?\\n`,
  "g"
);
export default function removeTemplateEmptyLines(template: string) {
  return template.replaceAll(regexEmptyLine, "");
}
