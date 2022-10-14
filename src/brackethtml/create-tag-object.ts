import { TagProps } from "./types/template";
import { BRACKETHTML_CSS_IN_JS } from "./globals";

const reusableObject = {} as TagProps;
const reusableArray: string[] = [];

function reuseObject(tagName: string, o: TagProps) {
  o.children = "";
  o.attributes = "";
  o.cssClassName = "";
  o.css = "";
  o.tagName = tagName;
  return o;
}

function reuseArray(attrsAndCSS: string, children: string) {
  reusableArray[0] = attrsAndCSS;
  reusableArray[1] = children;
  return reusableArray;
}

export default function createTagObject(
  tagName: string,
  tagContent: string,
  recycleObject?: boolean
): TagProps | false {
  const tagObject = recycleObject
    ? reuseObject(tagName, reusableObject)
    : {
        tagName,
        children: "",
        attributes: "",
        css: "",
        cssClassName: "",
      };

  if (!tagName) return false;

  if (!tagContent) return tagObject;

  let values = tagContent.includes(" ~")
    ? tagContent.split(" ~")
    : reuseArray("", tagContent);

  let [attrsAndCSS, children] = values;

  const lastIndexOfDoubleQuote = attrsAndCSS.lastIndexOf('"') + 1;

  let attributes = "";
  let css = "";

  if (lastIndexOfDoubleQuote === 0) {
    css = attrsAndCSS;
  } else {
    attributes = attrsAndCSS.slice(0, lastIndexOfDoubleQuote);
    css = attrsAndCSS.slice(lastIndexOfDoubleQuote);
  }

  tagObject.children = children;
  tagObject.attributes = attributes;
  tagObject.cssClassName = css.replaceAll(/\s/g, "")
    ? BRACKETHTML_CSS_IN_JS.gooberCSS`${css}`
    : "";
  tagObject.css = css;
  return tagObject;
}
