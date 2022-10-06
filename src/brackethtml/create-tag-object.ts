import { gooberCSS } from "../bentevi/css-template";
import { TagProps } from "./types/template";

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

  let values = tagContent.includes(" ~")
    ? tagContent.split(" ~")
    : ["", tagContent];

  let [attrsAndCSS, children] = values;

  const lastIndexOfDoubleQuote = attrsAndCSS.lastIndexOf('"') + 1;

  let attributes = "";
  let css = "";

  if (lastIndexOfDoubleQuote === 0) {
    attributes = attrsAndCSS;
  } else {
    attributes = attrsAndCSS.slice(0, lastIndexOfDoubleQuote);
    css = attrsAndCSS.slice(lastIndexOfDoubleQuote);
  }

  tagObject.children = children;
  tagObject.attributes = attributes;
  tagObject.cssClassName = css.replaceAll(/\s/g, "") ? gooberCSS`${css}` : "";
  tagObject.css = css;
  return tagObject;
}
