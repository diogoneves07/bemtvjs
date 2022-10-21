import { Component } from "../../src/main";

describe("Checks if changes to templates are applied to the DOM correctly", () => {
  it("Should remove component Child nodes", (done) => {
    Component("Child1", () => "strong[Not Hey!]");

    Component("App1", () => {
      let t = "Child1[]";
      setTimeout(() => (t = "Hey!"), 100);
      return () => t;
    }).render();

    setTimeout(() => {
      expect(document.body.textContent?.trim()).toBe("Hey!");
      done();
    }, 200);
  });

  it("Should replace component Text node with strong element", (done) => {
    document.body.textContent = "";
    Component("App2", () => {
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
    document.body.textContent = "";
    Component("App3", () => {
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
    document.body.textContent = "";
    Component("App4", () => {
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
    document.body.textContent = "";
    Component("App5", () => {
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
    document.body.textContent = "";

    Component("App6", () => {
      const firstValue = `svg[ xmlns="http://www.w3.org/2000/svg" class="red" ~ ]`;
      const secondValue = `svg[ xmlns="http://www.w3.org/2000/svg" class="blue" ~ ]`;
      let t = firstValue;
      setTimeout(() => (t = secondValue), 100);
      return () => t;
    }).render();

    setTimeout(() => {
      expect(document.body.children[0].tagName.toLowerCase()).toBe("svg");
      expect(document.body.children[0].getAttribute("class")).toBe("blue");
      done();
    }, 200);
  });

  it("Should replace text in component span element", (done) => {
    document.body.textContent = "";
    Component("App7", () => {
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
    document.body.textContent = "";

    let parentText = "";
    let childText = "";

    Component("Child2", () => () => childText);

    Component("App8", () => () => `${parentText} Child2[]`).render();

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
