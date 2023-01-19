import getAllNodesInList from "../utilities/get-all-nodes-in-list";
import ComponentInst from "./component-inst";

export function getNodeParentComponentByInst(c: ComponentInst, n: Node) {
  if (c.nodes.includes(n)) return c;

  if (getAllNodesInList(c.nodes).includes(n)) return c;

  return false;
}
