export const TEMPLATE_SYMBOLS = {
  leftBracket: "[",
  rightBracket: "]",
  caret: "^",
  tilde: "~",
  exclamation: "!",
};
export const TEMPLATE_SYMBOLS_KEYS = Object.keys(TEMPLATE_SYMBOLS);

export const TEMPLATE_SYMBOLS_SCAPE: Record<string, string> =
  TEMPLATE_SYMBOLS_KEYS.reduce((o, v) => ({ ...o, [v]: `<#${v}>` }), {});

export const COMMENT_SYMBOLS_SEQUENCE = { start: "---", middle: "(", end: ")" };
export const SCAPE_SYMBOLS_SEQUENCE = { start: "<", end: ">" };

export const EMPTY_LINE_SYMBOL = "---";
