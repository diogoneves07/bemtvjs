export default function normalizeComponentName(name: string) {
  const isAlternativeComponentName = name.includes("_");
  const realComponentName = isAlternativeComponentName
    ? name.slice(0, name.indexOf("_"))
    : name;
  return realComponentName;
}
