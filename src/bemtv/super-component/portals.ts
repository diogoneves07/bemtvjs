import ComponentInst from "../component-inst";

type PortalFn = (c: ComponentInst) => void;

const PORTALS_STORE = new Map<string, PortalFn>();

let count = 0;

export function definePortal(key: string, fn: PortalFn) {
  PORTALS_STORE.set(key, fn);
}

export function usePortal(key: string) {
  const i = PORTALS_STORE.get(key);

  PORTALS_STORE.delete(key);

  return i;
}
export function createPortalKey(name: string) {
  return `${name}_${count++}`;
}
