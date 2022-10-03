export default function getElement(elementSelector: Node | string) {
  if (typeof elementSelector === "string") {
    return document.querySelector(elementSelector);
  }
  return elementSelector;
}
