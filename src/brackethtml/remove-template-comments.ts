import { COMMENT_SYMBOLS_SEQUENCE } from "./globals";

const regexComments = new RegExp(
  `(${COMMENT_SYMBOLS_SEQUENCE.start})\\${COMMENT_SYMBOLS_SEQUENCE.middle}[\\S\\s]+?\\${COMMENT_SYMBOLS_SEQUENCE.end}`,
  "g"
);
export default function removeTemplateComments(template: string) {
  return template.replaceAll(regexComments, "");
}
