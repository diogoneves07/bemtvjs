let count = 0;

export const SCAPE_FOR_KEYS: { start: string; end: string } = {
  start: "|~",
  end: "~|",
};
export const REGEX_FORCED_ATTR_VALUE = /(?<=\|\~)[\S\s]*(?=\~\|)/g;

export const REGEX_FORCED_ATTR = /\|\~[\S\s][^\|\~]*\~\|/g;

export function generateForcedBindAttr(value: string) {
  return `${SCAPE_FOR_KEYS.start}bind-${value}${SCAPE_FOR_KEYS.end}`;
}

export function generateForcedKeyAttr() {
  return `${SCAPE_FOR_KEYS.start}keys-${count++}${SCAPE_FOR_KEYS.end}`;
}

export function normalizeElKeyAttr(elKey: string) {
  return elKey.slice(elKey.indexOf("-") + 1);
}

export function isForcedAttr(s: string) {
  return s.slice(0, 2) === SCAPE_FOR_KEYS.start;
}

export function getForcedAttrValue(s: string) {
  return s.slice(2, -2).trim();
}
