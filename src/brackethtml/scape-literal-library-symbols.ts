import {
  TEMPLATE_SYMBOLS_KEYS,
  TEMPLATE_SYMBOLS_SCAPE,
  TEMPLATE_SYMBOLS,
  SCAPE_SYMBOLS_SEQUENCE,
} from "./globals";

export default function scapeLiteralLibrarySymbols(template: string) {
  let newTemplate = template;
  for (const key of TEMPLATE_SYMBOLS_KEYS) {
    newTemplate = newTemplate.replaceAll(
      `${SCAPE_SYMBOLS_SEQUENCE.start}${
        (TEMPLATE_SYMBOLS as Record<string, string>)[key]
      }${SCAPE_SYMBOLS_SEQUENCE.end}`,
      TEMPLATE_SYMBOLS_SCAPE[key]
    );
  }
  return newTemplate;
}
