import { ALL_SUPER_COMPONENTS } from "../../src/bemtv/components-main";

export function resetTestEnvironment() {
  beforeEach(() => {
    document.body.innerHTML = "";
    ALL_SUPER_COMPONENTS.length = 0;
  });
}

export function resetDocumentBodyAndRemoveComponents(...args: string[]) {
  beforeEach(() => {
    document.body.innerHTML = "";
    args.forEach((n) => {
      const i = ALL_SUPER_COMPONENTS.findIndex(
        (v) => (v as any).__data.componentName === n
      );
      if (i > -1) {
        ALL_SUPER_COMPONENTS.splice(i, 1);
      }
    });
  });
}
