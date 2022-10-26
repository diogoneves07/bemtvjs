import { Component } from "../../src/main";
import { resetTestEnvironment } from "../test-utilities/reset-test-environment";

resetTestEnvironment();

describe("Checks if changes to templates are applied to the DOM correctly", () => {
  it("Should allow containing nested components", (done) => {
    Component("Strong", () => "strong[Click me!]");
    Component("Button", ({ children }) => `button[${children}]`);

    Component("App", ({ onMount }) => {
      onMount(() => {
        expect(document.body.children[0].tagName.toLowerCase()).toBe("button");
        done();
      });
      return `Button[ Strong[] ]`;
    }).render();
  });
  it("Should remove component Child nodes", (done) => {
    Component("Child", () => "strong[Not Hey!]");

    Component("App", ({ onUpdate }) => {
      let t = "Child[]";
      setTimeout(() => (t = "Hey!"), 100);

      onUpdate(() => {
        expect(document.body.textContent?.trim()).toBe("Hey!");
        done();
      });
      return () => t;
    }).render();
  });

  it("Should replace component Text node with strong element", (done) => {
    Component("App", ({ onUpdate }) => {
      let t = "Hello";
      setTimeout(() => (t = "strong[Hello]"), 100);

      onUpdate(() => {
        expect(document.body.children[0].tagName.toLowerCase()).toBe("strong");
        done();
      });
      return () => t;
    }).render();
  });

  it("Should replace component empty Text node with strong element", (done) => {
    Component("App", ({ onUpdate }) => {
      let t = "";
      setTimeout(() => (t = "strong[Hello]"), 100);

      onUpdate(() => {
        expect(document.body.children[0].tagName.toLowerCase()).toBe("strong");
        done();
      });
      return () => t;
    }).render();
  });

  it("Should replace component span element with strong element", (done) => {
    Component("App", ({ onUpdate }) => {
      let t = "span[Hey]";
      setTimeout(() => (t = "strong[Hello]"), 100);

      onUpdate(() => {
        expect(document.body.children[0].tagName.toLowerCase()).toBe("strong");
        done();
      });
      return () => t;
    }).render();
  });

  it("Should remove diff between elments attributes", (done) => {
    Component("App", ({ onUpdate }) => {
      let t = "span[ class='test' ~ Hey]";
      setTimeout(() => (t = "strong[class='hello' ~ Hello]"), 100);

      onUpdate(() => {
        expect(document.body.children[0].tagName.toLowerCase()).toBe("strong");
        done();
      });
      return () => t;
    }).render();
  });

  it("Should remove diff between SVG elments attributes", (done) => {
    Component("App", ({ onUpdate }) => {
      const firstValue = `svg[ xmlns="http://www.w3.org/2000/svg"  ~ circle[class="red" ~ ]]`;
      const secondValue = `svg[ xmlns="http://www.w3.org/2000/svg" ~ circle[class="blue" ~ ]]`;
      let t = firstValue;
      setTimeout(() => (t = secondValue), 100);

      onUpdate(() => {
        expect(document.getElementsByTagName("circle")[0]).toBeTruthy();
        expect(
          document.getElementsByTagName("circle")[0].getAttribute("class")
        ).toBe("blue");
        done();
      });
      return () => t;
    }).render();
  });

  it("should remove most elements", (done) => {
    Component("App", ({ onUpdate }) => {
      let t = "span[Hey] span[Hey] span[Hey] span[Hey] span[Hey] span[Hey]";
      setTimeout(() => (t = "span[Hello]"), 100);

      onUpdate(() => {
        expect(document.body.children[0].textContent?.trim()).toBe("Hello");
        done();
      });
      return () => t;
    }).render();
  });

  it("Should replace text in component span element", (done) => {
    Component("App", ({ onUpdate }) => {
      let t = "span[Hey]";
      setTimeout(() => (t = "span[Hello]"), 100);

      onUpdate(() => {
        expect(document.body.children[0].textContent?.trim()).toBe("Hello");
        done();
      });
      return () => t;
    }).render();
  });

  it("Should component parent and child update", (done) => {
    let parentText = "";
    let childText = "";

    setTimeout(() => {
      parentText = "He";
      childText = "llo";
    });

    Component("Child", () => () => childText);

    Component("App", ({ onUpdate }) => {
      onUpdate(() => {
        expect(document.body.textContent?.replace(/[\s]/g, "")).toBe("Hello");
        done();
      });
      return () => `${parentText} Child[]`;
    }).render();
  });
});
