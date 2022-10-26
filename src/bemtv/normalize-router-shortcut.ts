export default function normalizeRouterShortcut(t: string) {
  return t
    .replaceAll("#[", "Router[")
    .replaceAll(/#[A-Z]/g, (v) => "Router:" + v[1]);
}
