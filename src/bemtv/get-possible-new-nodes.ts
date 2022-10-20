import { TAG_HOST_NAME } from "./globals";
const SIMPLE_DIV = document.createElement("div");
const SIMPLE_DOCUMENT_FRAGMENT = document.createDocumentFragment();

function removeUnnecessaryEmptyTextNodes(a: Node[]) {
  if (a.length > 1) {
    const r = a.filter((n) => {
      return n instanceof Text && !n.textContent?.trim() ? false : true;
    });
    return r.length === 0 ? [a[0]] : r;
  }
  return a;
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

    keysAndNodes[host.id] = removeUnnecessaryEmptyTextNodes(
      Array.from(SIMPLE_DOCUMENT_FRAGMENT.childNodes)
    );

    host.parentElement?.replaceChild(SIMPLE_DOCUMENT_FRAGMENT, host);
  }

  let allElementsOrganized = removeUnnecessaryEmptyTextNodes(
    Array.from(SIMPLE_DIV.childNodes)
  );

  SIMPLE_DIV.innerHTML = "";

  return [keysAndNodes, allElementsOrganized];
}
