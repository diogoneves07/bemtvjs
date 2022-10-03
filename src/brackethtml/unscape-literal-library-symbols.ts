import {
  TEMPLATE_SYMBOLS_KEYS,
  TEMPLATE_SYMBOLS_SCAPE,
  TEMPLATE_SYMBOLS,
} from "./globals";

export default function unscapeLiteralLibrarySymbols(template: string) {
  let newTemplate = template;
  TEMPLATE_SYMBOLS_KEYS.forEach((key) => {
    newTemplate = newTemplate.replaceAll(
      (TEMPLATE_SYMBOLS_SCAPE as Record<string, string>)[key],
      `${(TEMPLATE_SYMBOLS as Record<string, string>)[key]}`
    );
  });
  return newTemplate;
}
