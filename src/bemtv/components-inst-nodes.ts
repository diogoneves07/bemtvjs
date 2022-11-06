import { ALL_COMPONENTS_INST } from "./component-inst-store";
import {
  getNodeComponentKeys,
  setNodeComponentKeys,
} from "./nodes-component-keys";

export function appendNodeToComponentManagerNodes(node: Node) {
  const keys = getNodeComponentKeys(node);

  if (keys) {
    for (const m of ALL_COMPONENTS_INST) {
      if (!keys.includes(m.key)) continue;

      m.nodes.push(node);
    }
  }
}

export function removeNodeFromComponentManagerNodes(node: Node) {
  const keys = getNodeComponentKeys(node);

  if (keys) {
    for (const m of ALL_COMPONENTS_INST) {
      if (!keys.includes(m.key)) continue;

      m.nodes = m.nodes.filter((n) => n !== node);
    }
  }
}

export function replaceNodeInComponentManagerNodes(
  newNode: Node,
  oldNode: Node
) {
  const keys = getNodeComponentKeys(oldNode);
  if (keys) {
    for (const m of ALL_COMPONENTS_INST) {
      if (keys.includes(m.key)) {
        const index = m.nodes.findIndex((n) => n === oldNode);

        m.nodes.splice(index, 1, newNode);
      }
    }
  }
}

export function setComponentManagerNodes(key: string, nodes: Node[]) {
  const componentInst = [...ALL_COMPONENTS_INST].find((o) => o.key === key);

  if (componentInst) {
    for (const node of nodes) {
      setNodeComponentKeys(node, key);
    }

    componentInst.nodes = nodes;
  }
}
