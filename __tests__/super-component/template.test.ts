import { _, pipe } from "../../src/main";
import { resetTestEnvironment } from "../test-utilities//reset-test-environment";

resetTestEnvironment();

describe("Check the ways to define the template", () => {
  describe("Use TemplateStringsArray", () => {
    it("Should define the template", (done) => {
      const { onMount, template, render } = _("App");

      let count = 0;

      onMount(() => {
        expect(document.body?.textContent?.trim()).toBe("Counter is: 0");
        done();
      });

      template`Counter is: ${count}`;

      render();
    });

    it("Should not define the template", () => {
      const { template } = _("App");

      // Untreated value or does not use pipes
      const list = [1, 2, 3, 4, 5];

      expect(() => {
        template`Counter is: ${list}`;
      }).toThrow();
    });

    test("Array using pipes in the template", () => {
      const listPipe = pipe((data: number[]) => {
        return data.join("");
      });

      const { template } = _("App");

      const list = listPipe([1, 2, 3, 4, 5]);

      expect(() => {
        template`Counter is: ${list}`;
      }).not.toThrow();
    });
  });

  describe("Use a function", () => {
    it("Should define the template", (done) => {
      const { onMount, template, render } = _("App");

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
      const { onMount, template, render } = _("App");

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
