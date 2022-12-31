const NODES_KEYS = new WeakMap<Node, Set<string>>();

export function getNodeComponentKeys(node: Node) {
  return NODES_KEYS.get(node);
}
export function setNodeComponentKey(node: Node, key: string) {
  const a = NODES_KEYS.get(node);

  if (a) a.add(key);
  else NODES_KEYS.set(node, new Set<string>().add(key));
}
