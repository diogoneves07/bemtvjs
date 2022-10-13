import { LIBRARY_NAME } from "./globals";
let count = 0;
export const SCAPE_FOR_KEYS: { start: string; end: string } = {
  start: "|~",
  end: "~|",
};
export const REGEX_CUSTOM_ATTR_KEY_VALUE = /(?<=\|\~)[\S\s]*(?=\~\|)/g;

export const REGEX_CUSTOM_ATTR_KEY = /\|\~[\S\s]*\~\|/g;

export default function generateKey() {
  return `${SCAPE_FOR_KEYS.start}key-${count++}${SCAPE_FOR_KEYS.end}`;
}
