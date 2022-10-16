export default function isEventListener(v: string) {
  const x = v.slice(-1);
  return x === x.toUpperCase();
}
