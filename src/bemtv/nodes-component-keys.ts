const NODES_KEYS = new WeakMap<Node, string[]>();

export function getNodeComponentKeys(node: Node) {
  return NODES_KEYS.get(node);
}
export function setNodeComponentKeys(node: Node, key: string) {
  const a = NODES_KEYS.get(node);

  if (a) a.push(key);
  else NODES_KEYS.set(node, [key]);
}
