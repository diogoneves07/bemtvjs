import { Component } from "../../src/main";
import { resetTestEnvironment } from "../test-utilities//reset-test-environment";

resetTestEnvironment();

describe("sharing API", () => {
  describe("method share()", () => {
    it('Should share "message" property', (done) => {
      Component("Child", ({ use }) => {
        return () => use("message");
      });

      Component("App", ({ share }) => {
        share({ message: "Hello" });

        return () => `Child[]`;
      }).render();

      setTimeout(() => {
        expect(document.body.textContent?.trim()).toBe("Hello");
        done();
      }, 100);
    });

    test('Parent should not access the "user" property', (done) => {
      Component("Child", ({ share }) => {
        share({ user: "World" });
        return () => ``;
      });

      Component("App", ({ use }) => {
        return () => `Child[] ${use("user")}`;
      }).render();

      setTimeout(() => {
        expect(document.body.textContent?.trim()).toBe("undefined");
        done();
      }, 100);
    });
  });
  describe("method reshare()", () => {
    it('Should update "message" property', (done) => {
      Component("Child", ({ reshare }) => {
        reshare({ message: "Hey!" });
        return ``;
      });
      Component("App", ({ share, use }) => {
        share({ message: "" });
        return () => `${use("message")} Child[]`;
      }).render();

      setTimeout(() => {
        expect(document.body.textContent?.trim()).toBe("Hey!");
        done();
      }, 100);
    });

    it('Should not update "message" property', (done) => {
      Component("Child", ({ share }) => {
        share({ message: "Hey!" });
        return ``;
      });
      Component("App", ({ reshare, use }) => {
        reshare({ message: "" });
        return () => `${use("message")} Child[]`;
      }).render();

      setTimeout(() => {
        expect(document.body.textContent?.trim()).toBe("undefined");
        done();
      }, 100);
    });
  });

  describe("method use()", () => {
    it('Should use "message" property', (done) => {
      Component("Child", ({ use }) => {
        return use<string>("message") || "";
      });
      Component("App", ({ share }) => {
        share({ message: "Hey" });
        return () => `Child[]`;
      }).render();

      setTimeout(() => {
        expect(document.body.textContent?.trim()).toBe("Hey");
        done();
      }, 100);
    });

    it('Should not use "message" property', (done) => {
      Component("Child", ({ share }) => {
        share({ message: "Hey" });
        return "";
      });

      Component("App", ({ use }) => {
        return () => `Child[] ${use("message")}`;
      }).render();

      setTimeout(() => {
        expect(document.body.textContent?.trim()).toBe("undefined");
        done();
      }, 100);
    });
  });
});
