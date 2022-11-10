import { _ } from "../../src/main";
import { resetTestEnvironment } from "../test-utilities//reset-test-environment";

resetTestEnvironment();

describe("Template first element", () => {
  it("Should define button as first element and add “onclick” listener to it", (done) => {
    const { click$, onMount, template, render } = _("App");

    const clickFn = jest.fn();

    click$(clickFn);

    onMount(() => {
      const btn = document.body.getElementsByTagName("button")[0];
      btn.click();

      expect(clickFn).toBeCalledTimes(1);
      done();
    });

    template(() => `button[Click me!]`);

    render();
  });

  it(`
     Should define strong and then button as first element and add “onclick” listener to it
  `, (done) => {
    const { click$, onMount, onUpdate, template, render } = _("App");

    const clickFn = jest.fn();
    let t = `strong[Hello!]`;

    click$(clickFn);

    onMount(() => {
      t = `button[Click me!]`;
    });

    onUpdate(() => {
      const btn = document.body.getElementsByTagName("button")[0];
      btn.click();
      expect(clickFn).toBeCalledTimes(1);
      done();
    });

    template(() => t);

    render();
  });

  it(`Should add “onclick” listener to button element after a time mounted`, (done) => {
    const { click$, onMount, template, render } = _("App");

    const clickFn = jest.fn();

    onMount(() => {
      const btn = document.body.getElementsByTagName("button")[0];

      setTimeout(() => click$(clickFn));
      setTimeout(() => {
        btn.click();

        expect(clickFn).toBeCalledTimes(1);
        done();
      });
    });

    template(() => `button[Click me!]`);

    render();
  });

  it(`
     Should remove “onclick” listener from button element immediately after added
  `, (done) => {
    const { click$, onMount, template, render } = _("App");

    const clickFn = jest.fn();

    const removeOnClickListener = click$(clickFn);

    removeOnClickListener();

    onMount(() => {
      const btn = document.body.getElementsByTagName("button")[0];
      btn.click();

      expect(clickFn).toBeCalledTimes(0);
      done();
    });

    template(() => `button[Click me!]`);

    render();
  });
});
