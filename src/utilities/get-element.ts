import isString from "./is-string";

export default function getElement(elementSelector: Node | string) {
  if (isString(elementSelector)) {
    return document.querySelector(elementSelector as string);
  }
  return elementSelector;
}
