import { LIBRARY_NAME_IN_ERRORS_MESSAGE } from "../globals";

const CACHE: Record<string, boolean> = {};

const templateElement = document.createElement("template");

if (!("content" in templateElement)) {
  throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} The HTML “template” element is not supported by this browser, please use a newer version of this browser.`;
}

export default function isSelfClosingTag(tag: string) {
  if (CACHE[tag]) return CACHE[tag];
  templateElement.innerHTML = `<${tag}></${tag}>`;

  const element = templateElement.content.firstElementChild as Element;
  const check = !element.outerHTML.includes(`</${tag}>`);

  CACHE[tag] = check;
  return check;
}
