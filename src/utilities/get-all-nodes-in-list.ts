export default function getAllNodesInList(nodes: Node[]) {
  const r: Node[] = [];

  for (const n of nodes) {
    r.push(n);

    if (n?.childNodes) {
      r.push(...getAllNodesInList(Array.from(n.childNodes)));
    }
  }

  return r;
}
