import { Component } from "../../src/main";
import { resetTestEnvironment } from "../test-utilities/reset-test-environment";

resetTestEnvironment();

describe("Checks if templates are correctly applied to the DOM", () => {
  it("Should allow containing nested components", (done) => {
    Component("Strong").template(() => "strong[Click me!]");

    Component("Button").template(() => `button[$children]`);

    const { onMount, template, render } = Component("App");

    onMount(() => {
      expect(document.body.children[0].tagName.toLowerCase()).toBe("button");
      done();
    });

    template(() => `Button[ Strong[] ]`);

    render();
  });
  it("Should remove component Child nodes", (done) => {
    Component("Child").template`strong[Not Hey!]`;

    const { onMount, onUpdate, template, render } = Component("App");
    let t = "Child[]";

    onMount(() => {
      t = "Hey!";
    });

    onUpdate(() => {
      expect(document.body.textContent?.trim()).toBe("Hey!");
      done();
    });

    template(() => t);

    render();
  });

  it("Should replace component Text node with strong element", (done) => {
    const { onMount, onUpdate, template, render } = Component("App");
    let t = "Hello";

    onMount(() => {
      t = "strong[Hey!]";
    });

    onUpdate(() => {
      expect(document.body.children[0].tagName.toLowerCase()).toBe("strong");
      done();
    });

    template(() => t);

    render();
  });

  it("Should replace component empty Text node with strong element", (done) => {
    const { onMount, onUpdate, template, render } = Component("App");
    let t = "";

    onMount(() => {
      t = "strong[Hey!]";
    });

    onUpdate(() => {
      expect(document.body.children[0].tagName.toLowerCase()).toBe("strong");
      done();
    });

    template(() => t);

    render();
  });

  it("Should replace component span element with strong element", (done) => {
    const { onMount, onUpdate, template, render } = Component("App");
    let t = "span[Hey]";

    onMount(() => {
      t = "strong[Hey!]";
    });

    onUpdate(() => {
      expect(document.body.children[0].tagName.toLowerCase()).toBe("strong");
      done();
    });

    template(() => t);

    render();
  });

  it("Should remove diff between elments attributes", (done) => {
    const { onMount, onUpdate, template, render } = Component("App");
    let t = 'span[ class="test" ~ Hey]';

    onMount(() => {
      t = 'strong[class="hello" ~ Hello]';
    });

    onUpdate(() => {
      const strongElement = document.body.children[0];

      expect(strongElement.tagName.toLowerCase()).toBe("strong");
      expect(strongElement.className.toLowerCase()).toBe("hello");
      done();
    });

    template(() => t);

    render();
  });

  it("Should remove diff between SVG elments attributes", (done) => {
    const { onMount, onUpdate, template, render } = Component("App");

    const firstValue = `svg[ xmlns="http://www.w3.org/2000/svg"  ~ circle[class="red" ~ ]]`;
    const secondValue = `svg[ xmlns="http://www.w3.org/2000/svg" ~ circle[class="blue" ~ ]]`;

    let t = firstValue;

    onMount(() => {
      t = secondValue;
    });

    onUpdate(() => {
      expect(document.getElementsByTagName("circle")[0]).toBeTruthy();
      expect(
        document.getElementsByTagName("circle")[0].getAttribute("class")
      ).toBe("blue");
      done();
    });

    template(() => t);

    render();
  });

  it("should remove most elements", (done) => {
    const { onMount, onUpdate, template, render } = Component("App");
    let t = "span[Hey] span[Hey] span[Hey] span[Hey] span[Hey] span[Hey]";

    onMount(() => {
      t = "span[Hello]";
    });

    onUpdate(() => {
      expect(document.body.children[0].textContent?.trim()).toBe("Hello");
      done();
    });

    template(() => t);

    render();
  });

  it("Should replace text in component span element", (done) => {
    const { onMount, onUpdate, template, render } = Component("App");
    let t = "span[Hey]";

    onMount(() => {
      t = "span[Hello]";
    });

    onUpdate(() => {
      expect(document.body.children[0].textContent?.trim()).toBe("Hello");
      done();
    });

    template(() => t);

    render();
  });

  it("Should component parent and child update", (done) => {
    Component("Child").template(() => childText);

    const { onMount, onUpdate, template, render } = Component("App");
    let parentText = "";
    let childText = "";

    onMount(() => {
      parentText = "He";
      childText = "llo";
    });

    onUpdate(() => {
      expect(document.body.textContent?.replace(/[\s]/g, "")).toBe("Hello");
      done();
    });

    template(() => `${parentText} Child[]`);

    render();
  });
});
