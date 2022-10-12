export const TEMPLATE_SYMBOLS = {
  leftBracket: "[",
  rightBracket: "]",
  tilde: "~",
  brackets: "[]",
};

export const TEMPLATE_SYMBOLS_KEYS = Object.keys(TEMPLATE_SYMBOLS);

export const SCAPE_SYMBOLS_SEQUENCE = { start: "{", end: "}" };

export const TEMPLATE_SYMBOLS_SCAPE: Record<string, string> =
  TEMPLATE_SYMBOLS_KEYS.reduce(
    (o, v) => ({
      ...o,
      [v]: `${SCAPE_SYMBOLS_SEQUENCE.start}#${v}${SCAPE_SYMBOLS_SEQUENCE.end}`,
    }),
    {}
  );
