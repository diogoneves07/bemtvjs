import { getLastCSSCreated } from "../bentevi/css-template";
import makeTemplateTree from "./make-template-tree";
import templateTreeToHTMLText from "./template-tree-to-html-text";

export default function brackethtmlTranspiler(template: string) {
  return {
    html: templateTreeToHTMLText(makeTemplateTree(template)),
    css: getLastCSSCreated(),
  };
}
