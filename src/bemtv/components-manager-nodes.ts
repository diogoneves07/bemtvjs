import ComponentManager from "./component-manager";
import { ALL_COMPONENTS_MANAGER } from "./component-manager-store";
import {
  getNodeComponentKeys,
  setNodeComponentKeys,
} from "./nodes-component-keys";
import { getComponentInstData } from "./work-with-components-inst";

function findAndSetComponentInstFirstElement(
  componentManager: ComponentManager
) {
  const d = getComponentInstData(componentManager.componentInst);

  d.defineFirstElement(null);

  for (const node of componentManager.nodes) {
    if (!(node instanceof Element)) continue;

    d.defineFirstElement(node);
    return;
  }
}

export function appendNodeToComponentManagerNodes(node: Node) {
  const keys = getNodeComponentKeys(node);

  if (keys) {
    for (const m of ALL_COMPONENTS_MANAGER) {
      if (!keys.includes(m.key)) continue;

      m.nodes.push(node);
      findAndSetComponentInstFirstElement(m);
    }
  }
}

export function removeNodeFromComponentManagerNodes(node: Node) {
  const keys = getNodeComponentKeys(node);

  if (keys) {
    for (const m of ALL_COMPONENTS_MANAGER) {
      if (!keys.includes(m.key)) continue;

      m.nodes = m.nodes.filter((n) => n !== node);

      findAndSetComponentInstFirstElement(m);
    }
  }
}

export function replaceNodeInComponentManagerNodes(
  newNode: Node,
  oldNode: Node
) {
  const keys = getNodeComponentKeys(oldNode);
  if (keys) {
    for (const m of ALL_COMPONENTS_MANAGER) {
      if (keys.includes(m.key)) {
        const index = m.nodes.findIndex((n) => n === oldNode);

        m.nodes.splice(index, 1, newNode);

        findAndSetComponentInstFirstElement(m);
      }
    }
  }
}

export function setComponentManagerNodes(key: string, nodes: Node[]) {
  const componentManager = [...ALL_COMPONENTS_MANAGER].find(
    (o) => o.key === key
  );

  if (componentManager) {
    for (const node of nodes) {
      setNodeComponentKeys(node, key);
    }

    componentManager.nodes = nodes;
    findAndSetComponentInstFirstElement(componentManager);
  }
}
