import { ALL_ELEMENTS_MANAGER } from "./manager-el";
import { KEY_ATTRIBUTE_NAME } from "./globals";
import {
  appendNodeToTemplateObject,
  removeNodeFromTemplateObject,
} from "./components-manager-nodes";

function removeDiffNodesAttrs(newNode: Element, oldNode: Element) {
  const attrsLength = newNode.attributes.length;
  for (let attrIndex = 0; attrIndex < attrsLength; attrIndex++) {
    const newAttr = newNode.attributes.item(attrIndex);
    if (!newAttr) continue;

    const attrName = newAttr.name.toLowerCase();

    if (newAttr.value === oldNode.getAttribute(attrName)) continue;

    if (newAttr instanceof SVGElement) {
      oldNode.setAttributeNS(
        "http://www.w3.org/2000/svg",
        attrName,
        newAttr.value
      );
    } else {
      oldNode.setAttribute(attrName, newAttr.value);
    }

    if (
      newNode.hasAttribute(KEY_ATTRIBUTE_NAME) &&
      (attrName === "class" || attrName === "classname")
    ) {
      const m = ALL_ELEMENTS_MANAGER.get(oldNode);
      if (m) {
        (m as any).__reapplyCSSClasses();
      }
    }
  }
}
export function removeDiffAmoungChildNodes(
  newChildNodes: Node[],
  oldChildNodes: Node[]
) {
  let newChildNodesArray = newChildNodes;

  let oldChildNodesArray = oldChildNodes;

  const length = newChildNodesArray.length;

  const parentElement = oldChildNodes[0].parentElement;

  if (!parentElement) return;

  for (const node of oldChildNodesArray.slice(length)) {
    parentElement.removeChild(node);
    removeNodeFromTemplateObject(node);
  }

  for (let index = 0; index < length; index++) {
    const newNode = newChildNodesArray[index];
    const oldNode = oldChildNodesArray[index];

    if (!oldNode) {
      parentElement.appendChild(newNode);
      appendNodeToTemplateObject(newNode);
      continue;
    }

    if ("tagName" in newNode) {
      if ((newNode as Element).tagName !== (oldNode as Element).tagName) {
        parentElement.replaceChild(newNode, oldNode);
        continue;
      }
    }

    if (newNode.nodeType !== oldNode.nodeType) {
      parentElement.replaceChild(newNode, oldNode);
      continue;
    }

    if (newNode instanceof Text) {
      if (newNode.textContent !== oldNode.textContent) {
        oldNode.textContent = newNode.textContent;
      }
      continue;
    }

    if (!(newNode instanceof Element)) return;

    if (
      newNode.textContent === newNode.innerHTML &&
      newNode.textContent !== oldNode.textContent
    ) {
      oldNode.textContent = newNode.textContent;
    }

    removeDiffNodesAttrs(newNode, oldNode as Element);

    if (!newNode.childNodes[0]) return;

    removeDiffAmoungChildNodes(
      Array.from(newNode.childNodes),
      Array.from((oldNode as Element).childNodes)
    );
  }
}
