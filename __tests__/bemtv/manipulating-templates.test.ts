import { Component } from "../../src/main";
import { resetTestEnvironment } from "./utilities/reset-test-environment";

resetTestEnvironment();

describe("Checks if changes to templates are applied to the DOM correctly", () => {
  it("Should allow containing nested components", (done) => {
    Component("Strong", () => "strong[Click me!]");
    Component("Button", ({ children }) => `button[${children}]`);
    Component("App", () => `Button[ Strong[] ]`).render();

    setTimeout(() => {
      expect(document.body.children[0].tagName.toLowerCase()).toBe("button");
      done();
    }, 200);
  });
  it("Should remove component Child nodes", (done) => {
    Component("Child", () => "strong[Not Hey!]");

    Component("App", () => {
      let t = "Child[]";
      setTimeout(() => (t = "Hey!"), 100);
      return () => t;
    }).render();

    setTimeout(() => {
      expect(document.body.textContent?.trim()).toBe("Hey!");
      done();
    }, 200);
  });

  it("Should replace component Text node with strong element", (done) => {
    Component("App", () => {
      let t = "Hello";
      setTimeout(() => (t = "strong[Hello]"), 100);
      return () => t;
    }).render();

    setTimeout(() => {
      expect(document.body.children[0].tagName.toLowerCase()).toBe("strong");
      done();
    }, 200);
  });

  it("Should replace component empty Text node with strong element", (done) => {
    Component("App", () => {
      let t = "";
      setTimeout(() => (t = "strong[Hello]"), 100);
      return () => t;
    }).render();

    setTimeout(() => {
      expect(document.body.children[0].tagName.toLowerCase()).toBe("strong");
      done();
    }, 200);
  });

  it("Should replace component span element with strong element", (done) => {
    Component("App", () => {
      let t = "span[Hey]";
      setTimeout(() => (t = "strong[Hello]"), 100);
      return () => t;
    }).render();

    setTimeout(() => {
      expect(document.body.children[0].tagName.toLowerCase()).toBe("strong");
      done();
    }, 200);
  });

  it("Should remove diff between elments attributes", (done) => {
    Component("App", () => {
      let t = "span[ class='test' ~ Hey]";
      setTimeout(() => (t = "strong[class='hello' ~ Hello]"), 100);
      return () => t;
    }).render();

    setTimeout(() => {
      expect(document.body.children[0].tagName.toLowerCase()).toBe("strong");
      done();
    }, 200);
  });
  it("Should remove diff between SVG elments attributes", (done) => {
    Component("App", () => {
      const firstValue = `svg[ xmlns="http://www.w3.org/2000/svg"  ~ circle[class="red" ~ ]]`;
      const secondValue = `svg[ xmlns="http://www.w3.org/2000/svg" ~ circle[class="blue" ~ ]]`;
      let t = firstValue;
      setTimeout(() => (t = secondValue), 100);
      return () => t;
    }).render();

    setTimeout(() => {
      expect(document.getElementsByTagName("circle")[0]).toBeTruthy();
      expect(
        document.getElementsByTagName("circle")[0].getAttribute("class")
      ).toBe("blue");
      done();
    }, 200);
  });

  it("should remove most elements", (done) => {
    Component("App", () => {
      let t = "span[Hey] span[Hey] span[Hey] span[Hey] span[Hey] span[Hey]";
      setTimeout(() => (t = "span[Hello]"), 100);
      return () => t;
    }).render();

    setTimeout(() => {
      expect(document.body.children[0].textContent?.trim()).toBe("Hello");
      done();
    }, 200);
  });

  it("Should replace text in component span element", (done) => {
    Component("App", () => {
      let t = "span[Hey]";
      setTimeout(() => (t = "span[Hello]"), 100);
      return () => t;
    }).render();

    setTimeout(() => {
      expect(document.body.children[0].textContent?.trim()).toBe("Hello");
      done();
    }, 200);
  });

  it("Should component parent and child update", (done) => {
    let parentText = "";
    let childText = "";

    Component("Child", () => () => childText);

    Component("App", () => () => `${parentText} Child[]`).render();

    setTimeout(() => {
      parentText = "He";
      childText = "llo";
    }, 100);

    setTimeout(() => {
      expect(document.body.textContent?.replace(/[ ]/g, "")).toBe("Hello");
      done();
    }, 200);
  });
});
