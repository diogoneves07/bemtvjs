import { _ } from "../../src/main";
import { resetTestEnvironment } from "../test-utilities//reset-test-environment";

resetTestEnvironment();

describe("Check the “useEl()” method", () => {
  it("Should use the element in template", (done) => {
    const { useEl, onMount, template, render } = _`App`();
    const [key, el] = useEl<HTMLButtonElement>();

    onMount(() => {
      const appEl = el();

      expect(appEl.it?.isConnected).toBeTruthy();

      done();
    });

    template(() => `button[${key} Click me!]`);

    render();
  });

  it("Should use the element", (done) => {
    const div = document.createElement("div");

    document.body.appendChild(div);

    const { useEl, onMount, template, render } = _`App`();

    const appEl = useEl<HTMLDivElement>(div);

    onMount(() => {
      expect(appEl.it?.isConnected).toBeTruthy();
      expect(appEl.it === div).toBeTruthy();

      done();
    });

    template(() => `button[Click me!]`);

    render();
  });

  it("Should use the selector element in template", (done) => {
    const div = document.createElement("div");

    document.body.appendChild(div);
    div.id = "app";

    const { useEl, onMount, template, render } = _`App`();

    const appEl = useEl<HTMLDivElement>("#app");

    onMount(() => {
      expect(appEl.it?.isConnected).toBeTruthy();
      expect(appEl.it === div).toBeTruthy();

      done();
    });

    template(() => `button[Click me!]`);

    render();
  });
});
