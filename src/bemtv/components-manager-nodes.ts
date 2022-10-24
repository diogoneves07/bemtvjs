import ComponentManager from "./component-manager";
import { ALL_COMPONENTS_MANAGER } from "./component-manager-store";
import {
  getNodeComponentKeys,
  setNodeComponentKeys,
} from "./nodes-component-keys";
import { getComponentThisData } from "./work-with-components-this";

function findAndSetComponentThisFirstElement(
  componentManager: ComponentManager
) {
  const d = getComponentThisData(componentManager.componentThis);

  d.defineFirstElement(null);

  for (const node of componentManager.nodes) {
    if (!(node instanceof Element)) continue;

    d.defineFirstElement(node);
    return;
  }
}

export function appendNodeToComponentManagerNodes(node: Node) {
  const keys = getNodeComponentKeys(node);

  if (!keys) return;

  for (const m of ALL_COMPONENTS_MANAGER) {
    if (!keys.includes(m.key)) continue;

    m.nodes.push(node);
    findAndSetComponentThisFirstElement(m);
  }
}

export function removeNodeFromComponentManagerNodes(node: Node) {
  const keys = getNodeComponentKeys(node);

  if (keys) {
    for (const m of ALL_COMPONENTS_MANAGER) {
      if (!keys.includes(m.key)) continue;

      m.nodes = m.nodes.filter((n) => n !== node);

      findAndSetComponentThisFirstElement(m);
    }
  }
}

export function replaceNodeInComponentManagerNodes(
  newNode: Node,
  oldNode: Node
) {
  const keys = getNodeComponentKeys(oldNode);
  if (!keys) return;

  for (const m of ALL_COMPONENTS_MANAGER) {
    if (!keys.includes(m.key)) continue;

    m.nodes = m.nodes.map((n) => (n === oldNode ? newNode : oldNode));

    findAndSetComponentThisFirstElement(m);
  }
}

export function setComponentManagerNodes(key: string, nodes: Node[]) {
  const componentManager = [...ALL_COMPONENTS_MANAGER].find(
    (o) => o.key === key
  );

  if (!componentManager) return;

  for (const node of nodes) {
    setNodeComponentKeys(node, key);
  }

  componentManager.nodes = nodes;
  findAndSetComponentThisFirstElement(componentManager);
}
