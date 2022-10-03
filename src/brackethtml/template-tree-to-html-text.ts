import mountHTMLTag from "./mount-html-tag";
import { TagPropsTree } from "./types/template";
import unscapeLiteralLibrarySymbols from "./unscape-literal-library-symbols";

export default function templateTreeToHTMLText(templateTree: TagPropsTree[]) {
  let htmlText = "";
  for (const tagProps of templateTree) {
    htmlText += mountHTMLTag(tagProps);
  }
  htmlText = unscapeLiteralLibrarySymbols(htmlText);
  return htmlText;
}
