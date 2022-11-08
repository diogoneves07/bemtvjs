import { Component } from "../../src/main";
import { resetTestEnvironment } from "../test-utilities//reset-test-environment";

resetTestEnvironment();

describe("ManageEl", () => {
  describe("ManageEl.css method", () => {
    it("Should add style to element", (done) => {
      const { useEl, onMount, template, render } = Component("App");
      const [key, el] = useEl<HTMLButtonElement>();

      onMount(() => {
        const appEl = el();
        appEl.css`font-size:50px;`;

        expect(document.getElementsByTagName("style").length).toBe(1);
        expect(appEl.it?.classList.length).toBe(1);
        expect(
          getComputedStyle(appEl.it as HTMLButtonElement).getPropertyValue(
            "font-size"
          )
        ).toBe("50px");
        done();
      });

      template(() => `button[${key} Click me!]`);

      render();
    });

    it("Should add style to element after a time", (done) => {
      const { useEl, onMount, template, render } = Component("App");
      const [key, el] = useEl<HTMLButtonElement>();

      onMount(() => {
        const appEl = el();

        setTimeout(() => {
          appEl.css`font-size:50px;`;
        }, 100);

        appEl.css`font-size:50px;`;

        expect(document.getElementsByTagName("style").length).toBe(1);
        expect(appEl.it?.classList.length).toBe(1);

        expect(
          getComputedStyle(appEl.it as HTMLButtonElement).getPropertyValue(
            "font-size"
          )
        ).toBe("50px");
        done();
      });

      template(() => `button[${key} Click me!]`);

      render();
    });
  });

  describe("Inject event handlers to ManageEl instance", () => {
    it("Should add onclick event listener to element", (done) => {
      const { useEl, onMount, template, render } = Component("App");
      const [key, el] = useEl<HTMLButtonElement>();

      const clickFn = jest.fn();

      onMount(() => {
        const appEl = el();

        appEl.click$(clickFn);

        appEl.it?.click();

        expect(clickFn).toBeCalledTimes(1);
        done();
      });

      template(() => `button[${key} Click me!]`);

      render();
    });

    it("Should remove onclick event listener from element", (done) => {
      const { useEl, onMount, template, render } = Component("App");
      const [key, el] = useEl<HTMLButtonElement>();

      const clickFn = jest.fn();

      onMount(() => {
        const appEl = el();
        const removeClickListener = appEl.click$(clickFn);

        appEl.it?.click();
        removeClickListener();
        appEl.it?.click();

        expect(clickFn).toBeCalledTimes(1);
        done();
      });

      template(() => `button[${key} Click me!]`);

      render();
    });

    it(`Should add “onclick” listener to button element after a time mounted`, (done) => {
      const { useEl, onMount, template, render } = Component("App");
      const [key, el] = useEl<HTMLButtonElement>();

      const clickFn = jest.fn();

      onMount(() => {
        const appEl = el();

        setTimeout(() => appEl.click$(clickFn));

        setTimeout(() => {
          appEl.it?.click();
          expect(clickFn).toBeCalledTimes(1);
          done();
        });
      });

      template(() => `button[${key} Click me!]`);

      render();
    });

    it(`
  Should remove “onclick” listener from button element immediately after added
`, (done) => {
      const { useEl, onMount, template, render } = Component("App");
      const [key, el] = useEl<HTMLButtonElement>();

      const clickFn = jest.fn();

      onMount(() => {
        const appEl = el();
        const removeClickListener = appEl.click$(clickFn);

        removeClickListener();

        appEl.it?.click();

        expect(clickFn).toBeCalledTimes(0);
        done();
      });

      template(() => `button[${key} Click me!]`);

      render();
    });

    it(`
  Should remove “onclick” listener with “capture:true” from button element immediately after added
`, (done) => {
      const { useEl, onMount, template, render } = Component("App");
      const [key, el] = useEl<HTMLButtonElement>();

      const clickFn = jest.fn();

      onMount(() => {
        const appEl = el();
        const removeClickListener = appEl.click$(clickFn, { capture: true });

        removeClickListener();

        appEl.it?.click();

        expect(clickFn).toBeCalledTimes(0);
        done();
      });

      template(() => `button[${key} Click me!]`);

      render();
    });
  });
});
