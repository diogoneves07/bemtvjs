import { isComponentAutoImport } from "../../src/bemtv/auto-import-components";
import { autoImportComponents, Component } from "../../src/main";

autoImportComponents({
  Counter() {
    /**
     * This is almost a mock for the dynamic import
     * as the expected result is the creation of the component
     * */
    const { template } = Component("Counter");

    template`button[Cliked: 0]`;
  },
});

describe("Auto import components", () => {
  it("Should import the component and use it in the template", (done) => {
    const { onMount, onUpdate, template, render } = Component("App");
    let templateValue = "";

    onMount(() => {
      setTimeout(() => {
        templateValue = "Counter[]";
      }, 100);
    });

    onUpdate(() => {
      expect(document.body.children.length).toBe(1);
      done();
    });

    template(() => templateValue);

    render();
  });

  test("The component should be an auto-import component", () => {
    expect(isComponentAutoImport("Counter")).toBeTruthy();
  });
  test("The component should not be an auto-import component", () => {
    expect(isComponentAutoImport("Message")).toBeFalsy();
  });
});
