import { useElManager, _ } from "../../src/main";
import { resetTestEnvironment } from "../test-utilities//reset-test-environment";

resetTestEnvironment();

describe("Inject event handlers to component instance", () => {
  it("Should add onclick event listener to element", (done) => {
    const { click$, onMount, template, render } = _`App`();
    const elFn = useElManager<HTMLButtonElement>();

    const clickFn = jest.fn();

    click$(clickFn);

    onMount(() => {
      const { el } = elFn();

      el.click();

      setTimeout(() => {
        expect(clickFn).toBeCalledTimes(1);
        done();
      }, 50);
    });

    template`button[ ${elFn} Click me!]`;

    render();
  });

  it("Should remove onclick event listener from element", (done) => {
    const { click$, onMount, template, render } = _`App`();
    const elFn = useElManager<HTMLButtonElement>();
    const clickFn = jest.fn();
    const removeClickListener = click$(clickFn);

    onMount(() => {
      const { el } = elFn();

      el.click();
      removeClickListener();
      el.click();

      expect(clickFn).toBeCalledTimes(1);
      done();
    });

    template`button[${elFn} Click me!]`;

    render();
  });
});
