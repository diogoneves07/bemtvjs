import brackethtmlToHTML from "./brackethtml-to-html";
import { BRACKETHTML_CSS_IN_JS } from "./globals";

export default function brackethtmlTranspiler(template: string) {
  return {
    html: brackethtmlToHTML(template),
    css: BRACKETHTML_CSS_IN_JS.getLastCSSCreated(),
  };
}
