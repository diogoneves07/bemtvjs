import { _ } from "../../src/main";
import { resetTestEnvironment } from "../test-utilities//reset-test-environment";

resetTestEnvironment();

describe("Inject event handlers to component instance", () => {
  it("Should add onclick event listener to element", (done) => {
    const { click$, onMount, useEl, template, render } = _`App`();
    const [btnKey, el] = useEl<HTMLButtonElement>();

    const clickFn = jest.fn();

    click$(clickFn);

    onMount(() => {
      const btnEl = el();
      btnEl.it?.click();
      setTimeout(() => {
        expect(clickFn).toBeCalledTimes(1);
        done();
      }, 50);
    });

    template(() => `button[ ${btnKey} Click me!]`);

    render();
  });

  it("Should remove onclick event listener from element", (done) => {
    const { click$, onMount, useEl, template, render } = _`App`();
    const [btnKey, el] = useEl<HTMLButtonElement>();
    const clickFn = jest.fn();
    const removeClickListener = click$(clickFn);

    onMount(() => {
      const btnEl = el();

      btnEl.it?.click();
      removeClickListener();
      btnEl.it?.click();

      expect(clickFn).toBeCalledTimes(1);
      done();
    });

    template(() => `button[${btnKey} Click me!]`);

    render();
  });
});
