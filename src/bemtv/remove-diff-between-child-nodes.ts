import { KEY_ATTRIBUTE_NAME } from "./globals";
import {
  appendNodeToComponentManagerNodes,
  removeNodeFromComponentManagerNodes,
  replaceNodeInComponentManagerNodes,
} from "./components-manager-nodes";
import { reapplyCSSClasses } from "./work-with-manager-el";

function removeDiffBetweenNodesAttrs(newNode: Element, oldNode: Element) {
  const attrsLength = newNode.attributes.length;

  for (let attrIndex = 0; attrIndex < attrsLength; attrIndex++) {
    const newAttr = newNode.attributes.item(attrIndex) as Attr;

    const attrName = newAttr.name.toLowerCase();

    if (newAttr.value === oldNode.getAttribute(attrName)) continue;

    oldNode.setAttribute(attrName, newAttr.value);

    attrName === "class" &&
      newNode.hasAttribute(KEY_ATTRIBUTE_NAME) &&
      reapplyCSSClasses(oldNode);
  }
}
export function removeDiffBetweenChildNodes(
  newChildNodes: Node[],
  oldChildNodes: Node[]
) {
  let newChildNodesArray = newChildNodes;

  const length = newChildNodesArray.length;

  let oldChildNodesArray = oldChildNodes.slice(0, length);

  const parentElement = oldChildNodes[0].parentElement as HTMLElement;

  for (const node of oldChildNodes.slice(length)) {
    parentElement.removeChild(node);
    removeNodeFromComponentManagerNodes(node);
  }

  for (let index = 0; index < length; index++) {
    const newNode = newChildNodesArray[index];
    const oldNode = oldChildNodesArray[index];

    if (!oldNode) {
      parentElement.appendChild(newNode);
      appendNodeToComponentManagerNodes(newNode);
      continue;
    }

    if (newNode.nodeType !== oldNode.nodeType) {
      parentElement.replaceChild(newNode, oldNode);
      replaceNodeInComponentManagerNodes(newNode, oldNode);
      continue;
    }
    if ("tagName" in newNode) {
      if ((newNode as Element).tagName !== (oldNode as Element).tagName) {
        parentElement.replaceChild(newNode, oldNode);
        replaceNodeInComponentManagerNodes(newNode, oldNode);

        continue;
      }
    }
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
      }

      removeDiffBetweenNodesAttrs(newNode, oldNode as Element);

      if (newNode.childNodes[0]) {
        removeDiffBetweenChildNodes(
          Array.from(newNode.childNodes),
          Array.from((oldNode as Element).childNodes)
        );
      }
    }
  }
}
