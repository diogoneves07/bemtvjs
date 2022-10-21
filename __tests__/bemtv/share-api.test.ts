import { Component } from "../../src/main";

describe("sharing API", () => {
  describe("method share()", () => {
    it('Should share "message" property', (done) => {
      Component("Child1", ({ use }) => {
        return () => use("message");
      });

      Component("App1", ({ share }) => {
        share({ message: "Hello" });

        return () => `Child1[]`;
      }).render();

      setTimeout(() => {
        expect(document.body.textContent?.trim()).toBe("Hello");
        done();
      }, 100);
    });

    test('Parent should not access the "user" property', (done) => {
      document.body.textContent = "";

      Component("Child2", ({ share }) => {
        share({ user: "World" });
        return () => ``;
      });

      Component("App2", ({ use }) => {
        return () => `Child2[] ${use("user")}`;
      }).render();

      setTimeout(() => {
        expect(document.body.textContent?.trim()).toBe("undefined");
        done();
      }, 100);
    });
  });
  describe("method reshare()", () => {
    it('Should update "message" property', (done) => {
      document.body.textContent = "";

      Component("Child3", ({ reshare }) => {
        reshare({ message: "Hey!" });
        return ``;
      });
      Component("App3", ({ share, use }) => {
        share({ message: "" });
        return () => `${use("message")} Child3[]`;
      }).render();

      setTimeout(() => {
        expect(document.body.textContent?.trim()).toBe("Hey!");
        done();
      }, 100);
    });

    it('Should not update "message" property', (done) => {
      document.body.textContent = "";

      Component("Child4", ({ share }) => {
        share({ message: "Hey!" });
        return ``;
      });
      Component("App4", ({ reshare, use }) => {
        reshare({ message: "" });
        return () => `${use("message")} Child4[]`;
      }).render();

      setTimeout(() => {
        expect(document.body.textContent?.trim()).toBe("undefined");
        done();
      }, 100);
    });
  });

  describe("method use()", () => {
    it('Should use "message" property', (done) => {
      document.body.textContent = "";

      Component("Child5", ({ use }) => {
        return use<string>("message") || "";
      });
      Component("App5", ({ share }) => {
        share({ message: "Hey" });
        return () => `Child5[]`;
      }).render();

      setTimeout(() => {
        expect(document.body.textContent?.trim()).toBe("Hey");
        done();
      }, 100);
    });

    it('Should not use "message" property', (done) => {
      document.body.textContent = "";

      Component("Child6", ({ share }) => {
        share({ message: "Hey" });
        return "";
      });

      Component("App6", ({ use }) => {
        return () => `Child6[] ${use("message")}`;
      }).render();

      setTimeout(() => {
        expect(document.body.textContent?.trim()).toBe("undefined");
        done();
      }, 100);
    });
  });
});
