import { _ } from "../../src/main";
import { resetTestEnvironment } from "../test-utilities/reset-test-environment";
import { createCounterComponent } from "../test-utilities/Counter";

resetTestEnvironment();

describe("Shows an alternative if the component is not available", () => {
  test("Component is available", (done) => {
    createCounterComponent();

    const { onMount, template, render } = _`App`();

    onMount(() => {
      expect(document.body.children.length).toBe(1);
      done();
    });

    template`Counter[](is available)`;

    render();
  });

  test("Component is not available", (done) => {
    const { onMount, template, render } = _`App`();

    onMount(() => {
      expect(document.body.textContent?.trim()).toBe("is not available");
      done();
    });

    template`Message[](is not available)`;

    render();
  });
});
