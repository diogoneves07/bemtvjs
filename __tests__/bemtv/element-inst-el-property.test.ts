import { _, createElementInst, useElementInst } from "../../src/main";
import { resetTestEnvironment } from "../test-utilities/reset-test-environment";

resetTestEnvironment();

describe("ElementInst.el property", () => {
  it("Should use #app element in ElementInst", (done) => {
    const div = document.createElement("div");
    div.id = "app";
    document.body.appendChild(div);

    const { onMount, render } = _`App`();
    const { el } = createElementInst("#app");

    onMount(() => {
      expect(el).toBe(div);
      expect(el?.isConnected).toBeTruthy();

      done();
    });

    render();
  });

  it("Should use div element in ElementInst", (done) => {
    const div = document.createElement("div");

    document.body.appendChild(div);

    const { onMount, render } = _`App`();
    const { el } = createElementInst(div);

    onMount(() => {
      expect(el).toBe(div);
      expect(el?.isConnected).toBeTruthy();

      done();
    });

    render();
  });

  it("Should get element from template and use in ElementInst", (done) => {
    const { onMount, template, render } = _`App`();

    const elInstFn = useElementInst();

    onMount(() => {
      const appEl = elInstFn();
      expect(appEl.el?.tagName?.toLowerCase()).toBe("button");
      done();
    });

    template`button[ ${elInstFn} Click me!]`;

    render();
  });

  it("Should be null", (done) => {
    const { onMount, template, render } = _`App`();

    const elInst = createElementInst("#no-exists");

    onMount(() => {
      expect(elInst.el).toBeNull();
      done();
    });

    template(() => `button[ Click me!]`);

    render();
  });

  it("Should replace the HTML element “span” with “strong”", (done) => {
    const { onMount, onUpdate, template, render } = _`App`();

    const elInstFn = useElementInst();

    let t = `span[${elInstFn.key} class="today" ~ Click me!]`;

    onMount(() => {
      expect(elInstFn().el.tagName?.toLowerCase()).toBe("span");
      t = `strong[${elInstFn.key} class="today" ~ Click me!]`;
    });

    onUpdate(() => {
      expect(elInstFn().el.tagName?.toLowerCase()).toBe("strong");
      done();
    });

    template(() => t);

    render();
  });

  it("Should update element attributes", (done) => {
    const { onMount, onUpdate, template, render } = _`App`();

    const elInstFn = useElementInst();

    let t = `span[${elInstFn.key} class="today" color:red; ~ Click me!]`;

    onMount(() => {
      t = `span[${elInstFn.key} class="today tomorrow" color:red; ~ Click me!]`;
    });

    onUpdate(() => {
      expect(elInstFn().el?.tagName?.toLowerCase()).toBe("span");
      done();
    });

    template(() => t);

    render();
  });

  it("Should use element by selector after a time", (done) => {
    const div = document.createElement("div");
    div.id = "app";
    document.body.appendChild(div);

    const { onMount, template, render } = _`App`();

    onMount(() => {
      const { el } = createElementInst("#app");

      setTimeout(() => {
        expect(el).toBe(div);
        done();
      }, 50);
    });

    template`Hello`;

    render();
  });
});
