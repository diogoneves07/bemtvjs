import { GLOBAL_COMPONENTS_MAP } from "../../src/bemtv/components";

export function resetTestEnvironment() {
  beforeEach(() => {
    document.body.innerHTML = "";
    GLOBAL_COMPONENTS_MAP.clear();
  });
}

export function resetDocumentBodyAndRemoveComponents(...args: string[]) {
  beforeEach(() => {
    document.body.innerHTML = "";
    args.forEach((n) => GLOBAL_COMPONENTS_MAP.delete(n));
  });
}
