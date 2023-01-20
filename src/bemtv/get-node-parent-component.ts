import getAllNodesInList from "../utilities/get-all-nodes-in-list";
import ComponentInst from "./component-inst";

export function getNodeParentComponentByInst(c: ComponentInst, n: Node) {
  const nodes = c.getAllNodes();

  if (nodes.includes(n)) return c;

  if (getAllNodesInList(nodes).includes(n)) return c;

  return false;
}
