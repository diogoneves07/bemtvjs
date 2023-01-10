import { removeDoubleSpaces } from "../utilities/remove-double-spaces";
import { TAG_HOST_NAME } from "./globals";

const templateElement = document.createElement("template");

function removeUnbreakingChar(n: Node[]) {
  return n.map((o) => {
    if (o instanceof Text) {
      o.textContent = removeDoubleSpaces(o.textContent || "").trim();

      return o;
    }

    return o;
  });
}

export default function getPossibleNewNodes(newHtml: string) {
  templateElement.innerHTML = removeDoubleSpaces(newHtml);

  const hosts = templateElement.content.querySelectorAll(TAG_HOST_NAME);
  const componentsNodes = new Map<string, Node[]>();
  const topHostsChildNoded = new Map<Node, Node[]>();

  for (const host of Array.from(hosts).reverse()) {
    const hostValue = host.id;

    if (!hostValue) continue;

    const childNodes = removeUnbreakingChar(Array.from(host.childNodes));

    componentsNodes.set(hostValue, childNodes);

    if (host.parentElement) {
      for (const n of childNodes.reverse()) {
        (host.parentElement as Element).insertBefore(n, host);
      }
      host.remove();
    } else {
      topHostsChildNoded.set(host, childNodes);
    }
  }

  const possibleNewNodes: Node[] = [];

  for (const n of Array.from(templateElement.content.childNodes)) {
    const tagName = n instanceof Element ? n.tagName.toLowerCase() : "";

    if (tagName === TAG_HOST_NAME) {
      possibleNewNodes.push(...(topHostsChildNoded.get(n) as Node[]));
    } else {
      possibleNewNodes.push(n);
    }
  }

  templateElement.innerHTML = "";

  return { possibleNewNodes, componentsNodes };
}
