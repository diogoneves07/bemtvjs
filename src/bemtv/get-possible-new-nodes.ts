import { removeDoubleSpaces } from "../utilities/remove-double-spaces";
import { TAG_HOST_NAME } from "./globals";

const templateElement = document.createElement("template");

function getHostElementTagName(n: Node) {
  if (!(n instanceof Element)) return false;

  const tagName = n.tagName.toLowerCase();

  if (tagName !== TAG_HOST_NAME) return false;

  return tagName;
}
function removeUnbreakingChar(n: Node[]) {
  return n.map((o) => {
    if (o instanceof Text) {
      o.textContent = removeDoubleSpaces(o.textContent || "").trim();

      return o;
    }

    return o;
  });
}

function hasNodesInNodes(nodes1: (Node | string)[], nodes2: (Node | string)[]) {
  const start = nodes2.indexOf(nodes1[0]);

  if (start === -1) return false;

  return {
    start,
    end: start + nodes1.length,
  };
}

export default function getPossibleNewNodes(newHtml: string) {
  templateElement.innerHTML = removeDoubleSpaces(newHtml);

  const hosts = Array.from(
    templateElement.content.querySelectorAll(TAG_HOST_NAME)
  ).reverse();
  const componentsNodes = new Map<string, (Node | string)[]>();
  const firstHostsChildNodes = new Map<Node, Node[]>();

  const possibleNewNodes: Node[] = [];

  for (const host of hosts) {
    const hostValue = host.id;

    const childNodes = removeUnbreakingChar(Array.from(host.childNodes));

    componentsNodes.set(hostValue, childNodes);

    if (host.parentElement) {
      for (const n of childNodes) {
        (host.parentElement as Element).insertBefore(n, host);
      }
      host.remove();
    } else {
      firstHostsChildNodes.set(host, childNodes);
    }
  }

  for (const n of Array.from(templateElement.content.childNodes)) {
    const tagName = getHostElementTagName(n);

    if (tagName) {
      possibleNewNodes.push(...(firstHostsChildNodes.get(n) as Node[]));
    } else {
      possibleNewNodes.push(n);
    }
  }

  templateElement.innerHTML = "";

  for (const [hostValue, nodes] of componentsNodes) {
    for (const [hostValue2, nodes2] of componentsNodes) {
      if (hostValue2 === hostValue) continue;

      const result = hasNodesInNodes(nodes, nodes2);

      result && nodes2.splice(result.start, result.end, hostValue);
    }
  }

  return { possibleNewNodes, componentsNodes };
}
