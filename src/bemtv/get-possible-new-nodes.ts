import { TAG_HOST_NAME } from "./globals";

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

function setHostAtrribute(
  hostValue: string,
  childNodes: Node[] | NodeListOf<ChildNode>
) {
  childNodes.forEach((n) => {
    if (!(n instanceof Element)) return;

    if (n.tagName.toLowerCase() === "bemtv-host") {
      setHostAtrribute(hostValue, n.childNodes);
      return;
    }

    n.setAttribute(hostValue, "true");
  });
}

export default function getPossibleNewNodes(newHtml: string) {
  SIMPLE_DIV.innerHTML = newHtml;

  const hosts = SIMPLE_DIV.getElementsByTagName(TAG_HOST_NAME);

  for (const host of Array.from(hosts).reverse()) {
    const hostValue = host.id;

    if (!hostValue) continue;

    SIMPLE_DOCUMENT_FRAGMENT.replaceChildren(
      ...(Array.from(host.childNodes) as Node[])
    );

    const childNodes = removeUnnecessarySpace(
      Array.from(SIMPLE_DOCUMENT_FRAGMENT.childNodes)
    );

    setHostAtrribute(hostValue, childNodes);

    host.parentElement?.replaceChild(SIMPLE_DOCUMENT_FRAGMENT, host);
  }

  let allElementsOrganized = removeUnnecessarySpace(
    Array.from(SIMPLE_DIV.childNodes)
  );

  SIMPLE_DIV.innerHTML = "";

  return allElementsOrganized;
}
