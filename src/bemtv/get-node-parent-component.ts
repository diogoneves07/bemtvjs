import getAllNodesInList from "../utilities/get-all-nodes-in-list";
import SimpleComponent from "./simple-component";

export function getNodeParentComponentByInst(c: SimpleComponent, n: Node) {
  const nodes = c.getAllNodes();

  if (nodes.includes(n)) return c;

  if (getAllNodesInList(nodes).includes(n)) return c;

  return false;
}
