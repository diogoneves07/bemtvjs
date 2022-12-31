import { ALL_COMPONENTS_INST } from "./component-inst-store";
import {
  getNodeComponentKeys,
  setNodeComponentKey,
} from "./nodes-component-keys";

export function appendNodeToComponentManagerNodes(node: Node) {
  const keys = getNodeComponentKeys(node);

  const nodeParents: Node[] = [];
  let n: Node | null = node;

  while (n) {
    n.parentNode && nodeParents.push(n.parentNode);
    n = n.parentNode;
  }

  if (keys) {
    for (const m of ALL_COMPONENTS_INST) {
      if (!keys.has(m.key)) continue;

      const check = m.nodes.find((i) => nodeParents.includes(i));

      !check && m.nodes.push(node);
    }
  }
}

export function removeNodeFromComponentManagerNodes(node: Node) {
  const keys = getNodeComponentKeys(node);

  if (keys) {
    for (const m of ALL_COMPONENTS_INST) {
      if (!keys.has(m.key)) continue;

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
      if (keys.has(m.key)) {
        const index = m.nodes.findIndex((n) => n === oldNode);

        index > -1 && m.nodes.splice(index, 1, newNode);
      }
    }
  }
}

export function setComponentManagerNodes(key: string, nodes: Node[]) {
  const componentInst = [...ALL_COMPONENTS_INST].find((o) => o.key === key);

  if (componentInst) {
    for (const node of nodes) {
      setNodeComponentKey(node, key);
    }

    componentInst.nodes = nodes;
  }
}
