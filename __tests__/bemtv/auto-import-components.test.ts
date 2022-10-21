import { isComponentAutoImport } from "../../src/bemtv/auto-import-components";
import { autoImportComponents, Component } from "../../src/main";

autoImportComponents({
  Counter() {
    /**
     * This is almost a mock for the dynamic import
     * as the expected result is the creation of the component
     * */
    Component("Counter", () => {
      let count = 0;
      setTimeout(() => count++, 1000);
      return () => `button[Cliked: ${count}]`;
    });
  },
});

describe("Auto import components", () => {
  it("Should import the component and use it in the template", (done) => {
    Component("App", () => {
      let c = "";

      setTimeout(() => {
        c = "Counter[]";
      }, 100);

      return () => c;
    }).render();

    setTimeout(() => {
      expect(document.body.children.length).toBe(1);
      done();
    }, 400);
  });

  test("The component should be an auto-import component", () => {
    expect(isComponentAutoImport("Counter")).toBeTruthy();
  });
  test("The component should not be an auto-import component", () => {
    expect(isComponentAutoImport("Message")).toBeFalsy();
  });
});
