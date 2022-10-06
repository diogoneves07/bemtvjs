import { getLastCSSCreated } from "../bentevi/css-template";
import brackethtmlToHTML from "./brackethtml-to-html";

export default function brackethtmlTranspiler(template: string) {
  return {
    html: brackethtmlToHTML(template),
    css: getLastCSSCreated(),
  };
}
