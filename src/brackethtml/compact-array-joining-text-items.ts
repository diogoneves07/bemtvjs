export default function compactArrayJoiningTextItems(children: any[]) {
  if (!children) return children;
  const newValues: any[] = [];

  for (const child of children) {
    if (!child) continue;
    const lastValueAdded = newValues.at(-1);
    if (typeof lastValueAdded === "string" && typeof child === "string") {
      newValues[newValues.length - 1] = lastValueAdded + child;
    } else {
      newValues.push(child);
    }
  }
  return newValues;
}
