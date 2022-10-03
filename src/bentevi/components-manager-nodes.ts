import ComponentManager from "./component-manager";
import {
  getNodeComponentKeys,
  setNodeComponentKeys,
} from "./nodes-component-keys";

export const ALL_COMPONENTS_MANAGER: ComponentManager[] = [];

function setComponentThisFirstElement(componentManager: ComponentManager) {
  for (const node of componentManager.nodes) {
    if (!(node instanceof Element)) continue;

    componentManager.componentThis.firstElement = node;

    return;
  }
}

export function appendNodeToTemplateObject(node: Node) {
  const keys = getNodeComponentKeys(node);

  if (!keys) return;

  for (const m of ALL_COMPONENTS_MANAGER) {
    if (!keys.includes(m.key)) continue;

    m.nodes.push(node);
    setComponentThisFirstElement(m);
  }
}

export function removeNodeFromTemplateObject(node: Node) {
  const keys = getNodeComponentKeys(node);

  if (!keys) return;

  for (const m of ALL_COMPONENTS_MANAGER) {
    if (!keys.includes(m.key)) continue;
    m.nodes = m.nodes.filter((n) => n !== node);

    setComponentThisFirstElement(m);
  }
}

export function replaceNodeInTemplateObject(oldNode: Node, newNode: Node) {
  const keys = getNodeComponentKeys(oldNode);
  if (!keys) return;

  for (const m of ALL_COMPONENTS_MANAGER) {
    if (!keys.includes(m.key)) continue;
    m.nodes = m.nodes.map((n) => (n === oldNode ? newNode : oldNode));
    setComponentThisFirstElement(m);
  }
}

export function setComponentManagerNodes(key: string, nodes: Node[]) {
  const componentManager = ALL_COMPONENTS_MANAGER.find((o) => o.key === key);

  if (!componentManager) return;

  for (const node of nodes) {
    setNodeComponentKeys(node, key);
  }

  componentManager.nodes = nodes;
  setComponentThisFirstElement(componentManager);
}
