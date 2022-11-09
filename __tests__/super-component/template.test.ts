import { Component } from "../../src/main";
import { resetTestEnvironment } from "../test-utilities//reset-test-environment";

resetTestEnvironment();

describe("Check the ways to define the template", () => {
  describe("Use TemplateStringsArray", () => {
    it("Should define the template", (done) => {
      const { onMount, template, render } = Component("App");

      let count = 0;

      onMount(() => {
        expect(document.body?.textContent?.trim()).toBe("Counter is: 0");
        done();
      });

      template`Counter is: ${count}`;

      render();
    });

    it("Should not define the template", () => {
      const { template } = Component("App");

      // Untreated value or does not use pipes
      const list = [1, 2, 3, 4, 5];

      expect(() => {
        template`Counter is: ${list}`;
      }).toThrow();
    });
  });

  describe("Use a function", () => {
    it("Should define the template", (done) => {
      const { onMount, template, render } = Component("App");

      let count = 0;

      onMount(() => {
        expect(document.body?.textContent?.trim()).toBe("Counter is: 0");
        done();
      });

      template(() => `Counter is: ${count}`);

      render();
    });
  });

  describe("Use a string", () => {
    it("Should define the template", (done) => {
      const { onMount, template, render } = Component("App");

      let count = 0;

      onMount(() => {
        expect(document.body?.textContent?.trim()).toBe("Counter is: 0");
        done();
      });

      template(`Counter is: ${count}`);

      render();
    });
  });
});
