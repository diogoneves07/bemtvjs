import { removeDoubleSpaces } from "../utilities/remove-double-spaces";
import { TAG_HOST_NAME } from "./globals";

const templateElement = document.createElement("template");

export default function getPossibleNewNodes(newHtml: string) {
  templateElement.innerHTML = removeDoubleSpaces(newHtml);

  const hosts = templateElement.content.querySelectorAll(TAG_HOST_NAME);
  const componentsNodes: Record<string, Node[]> = {};

  for (const host of Array.from(hosts).reverse()) {
    const hostValue = host.id;

    if (!hostValue) continue;

    const childNodes = Array.from(host.childNodes);

    componentsNodes[hostValue] = childNodes;

    if (host.parentElement) {
      for (const n of childNodes.reverse()) {
        (host.parentElement as Element).insertBefore(n, host);
      }
      host.remove();
    }
  }

  const possibleNewNodes: Node[] = [];

  for (const n of Array.from(templateElement.content.childNodes)) {
    const tagName = n instanceof Element ? n.tagName.toLowerCase() : "";

    if (tagName === TAG_HOST_NAME) {
      possibleNewNodes.push(...Array.from(n.childNodes));
    } else {
      possibleNewNodes.push(n);
    }
  }

  templateElement.innerHTML = "";
  return { possibleNewNodes, componentsNodes };
}
