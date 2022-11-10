import { Component } from "../../src/main";
import { resetTestEnvironment } from "../test-utilities/reset-test-environment";

resetTestEnvironment();

describe("sharing API", () => {
  describe("method share()", () => {
    it("Should share “message” property", (done) => {
      (() => {
        const { use, template } = Component("Child");

        template(() => `${use("message")}`);
      })();

      const { share, onMount, template, render } = Component("App");

      share({ message: "Hello" });

      onMount(() => {
        expect(document.body.textContent?.trim()).toBe("Hello");
        done();
      });
      template(() => `Child[]`);

      render();
    });

    test('Parent should not access the "user" property', (done) => {
      (() => {
        const { share } = Component("Child");

        share({ user: "World" });
      })();

      const { use, onMount, template, render } = Component("App");

      onMount(() => {
        expect(document.body.textContent?.trim()).toBe("undefined");
        done();
      });

      template(() => `Child[] ${use("user")}`);

      render();
    });
  });
  describe("method reshare()", () => {
    it("Should update “message” property", (done) => {
      (() => {
        const { reshare } = Component("Child");

        reshare({ message: "Hey!" });
      })();

      const { share, use, onMount, template, render } = Component("App");

      share({ message: "" });

      onMount(() => {
        expect(document.body.textContent?.trim()).toBe("Hey!");
        done();
      });

      template(() => `${use("message")} Child[]`);

      render();
    });

    it("Should not update “message” property", (done) => {
      (() => {
        const { share } = Component("Child");

        share({ message: "Hey!" });
      })();

      const { reshare, use, onMount, template, render } = Component("App");

      reshare({ message: "" });

      onMount(() => {
        expect(document.body.textContent?.trim()).toBe("undefined");
        done();
      });

      template(() => `${use("message")} Child[]`);

      render();
    });
  });

  describe("method use()", () => {
    it("Should use “message” property", (done) => {
      (() => {
        const { use, template } = Component("Child");

        template(() => `${use<string>("message")}`);
      })();

      const { share, onMount, template, render } = Component("App");

      share({ message: "Hey" });

      onMount(() => {
        expect(document.body.textContent?.trim()).toBe("Hey");
        done();
      });

      template(() => `Child[]`);

      render();
    });

    it("Should not use “message” property", (done) => {
      (() => {
        const { share } = Component("Child");

        share({ message: "Hey" });
      })();

      const { use, onMount, template, render } = Component("App");

      onMount(() => {
        expect(document.body.textContent?.trim()).toBe("undefined");
        done();
      });

      template(() => `Child[] ${use("message")}`);

      render();
    });
    test("Use “use()” method outside a DOMListener or hook", () => {
      const { use, share } = Component("App");

      share({ message: "Hey" });

      expect(use("message")).toBe(undefined);
    });
  });
});
