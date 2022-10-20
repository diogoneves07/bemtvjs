import { TAG_HOST_NAME } from "./globals";
const SIMPLE_DIV = document.createElement("div");
const SIMPLE_DOCUMENT_FRAGMENT = document.createDocumentFragment();

export default function getPossibleNewNodes(
  newHtml: string
): [keysAndNodes: Record<string, Node[]>, nodes: Node[]] {
  SIMPLE_DIV.innerHTML = newHtml;

  const hosts = SIMPLE_DIV.getElementsByTagName(TAG_HOST_NAME);

  const result: Record<string, Node[]> = {};

  for (const host of Array.from(hosts).reverse()) {
    SIMPLE_DOCUMENT_FRAGMENT.replaceChildren(
      ...(Array.from(host.childNodes) as Node[])
    );

    result[host.id] = Array.from(SIMPLE_DOCUMENT_FRAGMENT.childNodes);

    host.parentElement?.replaceChild(SIMPLE_DOCUMENT_FRAGMENT, host);
  }

  let allElementsOrganized = Array.from(SIMPLE_DIV.childNodes);
  if (allElementsOrganized.length > 1) {
    allElementsOrganized = allElementsOrganized.filter((n) => {
      return n instanceof Text && !n.textContent?.trim() ? false : true;
    });
  }

  SIMPLE_DIV.innerHTML = "";

  return [result, allElementsOrganized];
}
