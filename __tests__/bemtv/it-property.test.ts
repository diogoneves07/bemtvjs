import { Component } from "../../src/main";
import { resetTestEnvironment } from "../test-utilities//reset-test-environment";

resetTestEnvironment();

describe("ManagerEl.it property", () => {
  it("Should use #app element in ManagerEl", (done) => {
    const div = document.createElement("div");
    div.id = "app";
    document.body.appendChild(div);

    const { useEl, onMount, render } = Component("App");
    const el = useEl("#app");

    onMount(() => {
      expect(el().it).toBe(div);
      done();
    });

    render();
  });

  it("Should use div element in ManagerEl", (done) => {
    const div = document.createElement("div");

    document.body.appendChild(div);

    const { useEl, onMount, render } = Component("App");
    const el = useEl(div);

    onMount(() => {
      expect(el().it).toBe(div);
      done();
    });

    render();
  });

  it("Should get element from template and use in ManagerEl", (done) => {
    const { useEl, onMount, template, render } = Component("App");

    const [appKey, el] = useEl();

    onMount(() => {
      const appEl = el();
      expect(appEl.it?.tagName?.toLowerCase()).toBe("button");
      done();
    });

    template(() => `button[ ${appKey} Click me!]`);

    render();
  });

  it("Should be null", (done) => {
    const { useEl, onMount, template, render } = Component("App");

    const [, el] = useEl();

    onMount(() => {
      const appEl = el();
      expect(appEl.it).toBeNull();
      done();
    });

    template(() => `button[ Click me!]`);

    render();
  });

  it("Should replace the HTML element “span” with “strong”", (done) => {
    const { useEl, onMount, onUpdate, template, render } = Component("App");

    const [appKey, el] = useEl();

    let t = `span[${appKey} class="today" ~ Click me!]`;

    onMount(() => {
      t = `strong[${appKey} class="today" ~ Click me!]`;
    });

    onUpdate(() => {
      expect(el().it?.tagName?.toLowerCase()).toBe("strong");
      done();
    });

    template(() => t);

    render();
  });

  it("Should update element attributes", (done) => {
    const { useEl, onMount, onUpdate, template, render } = Component("App");

    const [appKey, el] = useEl();

    let t = `span[${appKey} class="today" color:red; ~ Click me!]`;

    onMount(() => {
      t = `span[${appKey} class="today tomorrow" color:red; ~ Click me!]`;
    });

    onUpdate(() => {
      expect(el().it?.tagName?.toLowerCase()).toBe("span");
      done();
    });

    template(() => t);

    render();
  });

  it("Should use element by selector after a time", (done) => {
    const div = document.createElement("div");
    div.id = "app";
    document.body.appendChild(div);

    const { useEl, onMount, template, render } = Component("App");

    onMount(() => {
      const el = useEl("#app");

      setTimeout(() => {
        expect(el().it).toBe(div);
        done();
      }, 50);
    });

    template`Hello`;

    render();
  });
});
