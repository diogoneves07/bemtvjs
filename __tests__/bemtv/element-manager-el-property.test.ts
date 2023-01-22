import { _, createElManager, useElManager } from "../../src/main";
import { resetTestEnvironment } from "../test-utilities/reset-test-environment";

resetTestEnvironment();

describe("ElementManager.el property", () => {
  it("Should use #app element in ElementManager", (done) => {
    const div = document.createElement("div");
    div.id = "app";
    document.body.appendChild(div);

    const { onMount, render } = _`App`();
    const { el } = createElManager("#app");

    onMount(() => {
      expect(el).toBe(div);
      expect(el?.isConnected).toBeTruthy();

      done();
    });

    render();
  });

  it("Should use div element in ElementManager", (done) => {
    const div = document.createElement("div");

    document.body.appendChild(div);

    const { onMount, render } = _`App`();
    const { el } = createElManager(div);

    onMount(() => {
      expect(el).toBe(div);
      expect(el?.isConnected).toBeTruthy();

      done();
    });

    render();
  });

  it("Should get element from template and use in ElementManager", (done) => {
    const { onMount, template, render } = _`App`();

    const elManagerFn = useElManager();

    onMount(() => {
      const appEl = elManagerFn();
      expect(appEl.el?.tagName?.toLowerCase()).toBe("button");
      done();
    });

    template`button[ ${elManagerFn} Click me!]`;

    render();
  });

  it("Should be null", (done) => {
    const { onMount, template, render } = _`App`();

    const elManager = createElManager("#no-exists");

    onMount(() => {
      expect(elManager.el).toBeNull();
      done();
    });

    template(() => `button[ Click me!]`);

    render();
  });

  it("Should replace the HTML element “span” with “strong”", (done) => {
    const { onMount, onUpdate, template, render } = _`App`();

    const elManagerFn = useElManager();

    let t = `span[${elManagerFn.key} class="today" ~ Click me!]`;

    onMount(() => {
      expect(elManagerFn().el.tagName?.toLowerCase()).toBe("span");
      t = `strong[${elManagerFn.key} class="today" ~ Click me!]`;
    });

    onUpdate(() => {
      expect(elManagerFn().el.tagName?.toLowerCase()).toBe("strong");
      done();
    });

    template(() => t);

    render();
  });

  it("Should update element attributes", (done) => {
    const { onMount, onUpdate, template, render } = _`App`();

    const elManagerFn = useElManager();

    let t = `span[${elManagerFn.key} class="today" color:red; ~ Click me!]`;

    onMount(() => {
      t = `span[${elManagerFn.key} class="today tomorrow" color:red; ~ Click me!]`;
    });

    onUpdate(() => {
      expect(elManagerFn().el?.tagName?.toLowerCase()).toBe("span");
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
      const { el } = createElManager("#app");

      setTimeout(() => {
        expect(el).toBe(div);
        done();
      }, 50);
    });

    template`Hello`;

    render();
  });
});
