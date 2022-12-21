import {
  appendNodeToComponentManagerNodes,
  removeNodeFromComponentManagerNodes,
  replaceNodeInComponentManagerNodes,
} from "./components-inst-nodes";

function removeDiffBetweenNodesAttrs(newNode: Element, oldNode: Element) {
  const attrsLength = newNode.attributes.length;

  for (let attrIndex = 0; attrIndex < attrsLength; attrIndex++) {
    const newAttr = newNode.attributes.item(attrIndex) as Attr;

    const attrName = newAttr.name.toLowerCase();

    if (newAttr.value === oldNode.getAttribute(attrName)) continue;

    oldNode.setAttribute(attrName, newAttr.value);

    if (attrName in oldNode) (oldNode as any)[attrName] = newAttr.value;
  }
}
export function removeDiffBetweenChildNodes(
  newChildNodes: Node[],
  oldChildNodes: Node[],
  instParentElement?: Element | null
) {
  let newChildNodesArray = newChildNodes;

  const length = newChildNodesArray.length;

  let oldChildNodesArray = oldChildNodes.slice(0, length);

  const parentElement = (oldChildNodes[0]?.parentElement ||
    instParentElement) as HTMLElement;

  for (const node of oldChildNodes.slice(length)) {
    node.parentElement && node.parentElement.removeChild(node);
    removeNodeFromComponentManagerNodes(node);
  }

  let lastNode: undefined | Node;
  for (let index = 0; index < length; index++) {
    const newNode = newChildNodesArray[index];
    const oldNode = oldChildNodesArray[index];

    if (!oldNode) {
      !newNode.isConnected &&
        parentElement.insertBefore(newNode, lastNode?.nextSibling || null);
      appendNodeToComponentManagerNodes(newNode);
      lastNode = newNode;
      continue;
    }
    const checkToReplaceNode =
      newNode.nodeType !== oldNode.nodeType ||
      ("tagName" in newNode &&
        (newNode as Element).tagName !== (oldNode as Element).tagName);

    if (checkToReplaceNode) {
      parentElement.replaceChild(newNode, oldNode);
      replaceNodeInComponentManagerNodes(newNode, oldNode);
      lastNode = newNode;

      continue;
    }

    lastNode = oldNode;

    if (newNode instanceof Text) {
      if (newNode.textContent !== oldNode.textContent) {
        oldNode.textContent = newNode.textContent;
      }
      continue;
    }

    if (newNode instanceof Element) {
      if (
        newNode.textContent === newNode.innerHTML &&
        newNode.textContent !== oldNode.textContent
      ) {
        oldNode.textContent = newNode.textContent;
        if ("value" in oldNode && oldNode) {
          const n = oldNode as unknown as Element;
          const tagName = n.tagName;

          if (tagName === "TEXTAREA" || tagName === "INPUT") {
            (oldNode as any).value = oldNode.textContent;
          }
        }
      }

      removeDiffBetweenNodesAttrs(newNode, oldNode as Element);

      if (newNode.childNodes[0]) {
        removeDiffBetweenChildNodes(
          Array.from(newNode.childNodes),
          Array.from((oldNode as Element).childNodes),
          oldNode as Element
        );
      }
    }
  }
}
