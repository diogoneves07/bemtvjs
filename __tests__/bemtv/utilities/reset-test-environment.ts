import { GLOBAL_COMPONENTS_MAP } from "../../../src/bemtv/components";

export function resetTestEnvironment() {
  beforeEach(() => {
    document.body.innerHTML = "";
    GLOBAL_COMPONENTS_MAP.clear();
  });
}
