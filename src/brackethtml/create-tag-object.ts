import { gooberCSS } from "../bentevi/css-template";
import { TEMPLATE_SYMBOLS } from "./globals";
import { isTagChildren } from "./is-tag-children";
import { TagProps } from "./types/template";

const regexTagChildren = /(?<=(\n\r?\s*?\n))([\S\s]+)/;

function extractFromText(
  text: string,
  regex: RegExp
): { text: string; value: string } {
  let value = "";
  const newText = text.replace(regex, (v) => {
    value = v;
    return "";
  });

  return { text: newText, value };
}

export default function createTagObject(
  tagName: string,
  tagContent: string
): TagProps | false {
  const tagObject = {
    tagName,
    children: "",
    attributes: "",
    css: "",
    cssClassName: "",
  };

  if (!tagName) return false;

  if (!tagContent) {
    return tagObject;
  }

  const extracted = extractFromText(tagContent, regexTagChildren);

  let text = extracted.text;
  let children = extracted.value;
  let attributes = "";
  let css = "";
  let hasOnlyAttrAndCSS = false;
  let hasOnlyChildren = false;

  if (text[0] === TEMPLATE_SYMBOLS.caret) {
    text = text.slice(1);
    hasOnlyAttrAndCSS = true;
  }

  if (!hasOnlyAttrAndCSS && text[0] === TEMPLATE_SYMBOLS.tilde) {
    text = text.slice(1);
    hasOnlyChildren = true;
  }

  if (!hasOnlyChildren) {
    if (children || hasOnlyAttrAndCSS || !isTagChildren(text)) {
      const lastIndexOfDoubleQuote = text.lastIndexOf('"') + 1;
      attributes = text.slice(0, lastIndexOfDoubleQuote);
      css = text.slice(lastIndexOfDoubleQuote);
    }
  }

  if (!attributes && !children && !css) {
    children = text;
  }
  tagObject.children = children;
  tagObject.attributes = attributes;
  tagObject.cssClassName = css.replaceAll(/\s/g, "") ? gooberCSS`${css}` : "";
  tagObject.css = css;
  return tagObject;
}
