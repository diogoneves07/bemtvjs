import { TAG_HOST_NAME } from "./globals";
import { setNodeComponentKeys } from "./nodes-component-keys";

const SIMPLE_DIV = document.createElement("div");
const SIMPLE_DOCUMENT_FRAGMENT = document.createDocumentFragment();

function removeUnnecessarySpace(a: Node[]) {
  return a.map((n) => {
    if (n instanceof Text && n.textContent && n.textContent?.trim() === "") {
      n.textContent = "";
      return n;
    }
    return n;
  });
}

function setChildNodesKeys(key: string, nodes: Node[]) {
  for (const n of nodes) {
    setNodeComponentKeys(n, key);
    n.childNodes && setChildNodesKeys(key, Array.from(n.childNodes));
  }
}

export default function getPossibleNewNodes(
  newHtml: string
): [keysAndNodes: Record<string, Node[]>, nodes: Node[]] {
  SIMPLE_DIV.innerHTML = newHtml;

  const hosts = SIMPLE_DIV.getElementsByTagName(TAG_HOST_NAME);

  const keysAndNodes: Record<string, Node[]> = {};

  for (const host of Array.from(hosts).reverse()) {
    SIMPLE_DOCUMENT_FRAGMENT.replaceChildren(
      ...(Array.from(host.childNodes) as Node[])
    );

    const childNodes = removeUnnecessarySpace(
      Array.from(SIMPLE_DOCUMENT_FRAGMENT.childNodes)
    );

    setChildNodesKeys(host.id, childNodes);

    keysAndNodes[host.id] = childNodes;
    host.parentElement?.replaceChild(SIMPLE_DOCUMENT_FRAGMENT, host);
  }

  let allElementsOrganized = removeUnnecessarySpace(
    Array.from(SIMPLE_DIV.childNodes)
  );

  SIMPLE_DIV.innerHTML = "";

  return [keysAndNodes, allElementsOrganized];
}
