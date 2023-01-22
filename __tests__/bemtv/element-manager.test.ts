import { useElManager, _ } from "../../src/main";
import { resetTestEnvironment } from "../test-utilities/reset-test-environment";

resetTestEnvironment();

describe("ElementManager", () => {
  describe("ElementManager.css method", () => {
    it("Should add style to element", (done) => {
      const { onMount, template, render } = _`App`();
      const elFn = useElManager<HTMLButtonElement>();

      onMount(() => {
        const appEl = elFn();
        appEl.css`font-size:50px;`;

        expect(document.getElementsByTagName("style").length).toBe(1);
        expect(appEl.el.classList.length).toBe(1);
        expect(
          getComputedStyle(appEl.el as HTMLButtonElement).getPropertyValue(
            "font-size"
          )
        ).toBe("50px");
        done();
      });

      template`button[${elFn} Click me!]`;

      render();
    });

    it("Should use “onInit” hook to add style to element", (done) => {
      const { onInit, onMount, template, render } = _`App`();
      const elFn = useElManager<HTMLButtonElement>();

      onInit(() => {
        const appEl = elFn();
        appEl.css`font-size:50px;`;
      });

      onMount(() => {
        const appEl = elFn();

        expect(document.getElementsByTagName("style").length).toBe(1);
        expect(appEl.el.classList.length).toBe(1);
        expect(
          getComputedStyle(appEl.el as HTMLButtonElement).getPropertyValue(
            "font-size"
          )
        ).toBe("50px");
        done();
      });

      template`button[${elFn} Click me!]`;

      render();
    });

    it("Should add style to element after a time", (done) => {
      const { onMount, template, render } = _`App`();
      const elFn = useElManager<HTMLButtonElement>();

      onMount(() => {
        const appEl = elFn();

        setTimeout(() => {
          appEl.css`font-size:50px;`;
        }, 100);

        appEl.css`font-size:50px;`;

        expect(document.getElementsByTagName("style").length).toBe(1);
        expect(appEl.el.classList.length).toBe(1);

        expect(
          getComputedStyle(appEl.el as HTMLButtonElement).getPropertyValue(
            "font-size"
          )
        ).toBe("50px");
        done();
      });

      template`button[${elFn} Click me!]`;

      render();
    });
  });

  describe("Inject event handlers to ElementManager instance", () => {
    it("Should add onclick event listener to element", (done) => {
      const { onMount, template, render } = _`App`();
      const elFn = useElManager<HTMLButtonElement>();

      const clickFn = jest.fn();

      onMount(() => {
        const appEl = elFn();

        appEl.click$(clickFn);

        appEl.el.click();

        expect(clickFn).toBeCalledTimes(1);
        done();
      });

      template`button[${elFn} Click me!]`;

      render();
    });

    it("Should use “onInit” hook to add onclick event listener to element", (done) => {
      const { onMount, onInit, template, render } = _`App`();
      const elFn = useElManager<HTMLButtonElement>();

      const clickFn = jest.fn();

      onInit(() => {
        const appEl = elFn();
        appEl.click$(clickFn);
      });

      onMount(() => {
        const appEl = elFn();
        appEl.el.click();

        expect(clickFn).toBeCalledTimes(1);
        done();
      });

      template`button[${elFn} Click me!]`;

      render();
    });

    it("Should remove onclick event listener from element", (done) => {
      const { onMount, template, render } = _`App`();
      const elFn = useElManager<HTMLButtonElement>();

      const clickFn = jest.fn();

      onMount(() => {
        const appEl = elFn();
        const removeClickListener = appEl.click$(clickFn);

        appEl.el.click();
        removeClickListener();
        appEl.el.click();

        expect(clickFn).toBeCalledTimes(1);
        done();
      });

      template`button[${elFn} Click me!]`;

      render();
    });

    it("Should change the elements and remove the listeners from the previous", (done) => {
      const button = document.createElement("button");
      document.body.appendChild(button);

      const { onMount, template, render } = _`App`();
      const elFn = useElManager<HTMLButtonElement>();

      const clickFn = jest.fn();

      onMount(() => {
        const appEl = elFn();
        const templateButton = appEl.el;
        appEl.click$(clickFn);
        templateButton?.click();
        appEl.el = button;
        appEl.el.click();

        templateButton?.click();
        templateButton?.click();

        expect(clickFn).toBeCalledTimes(2);
        done();
      });

      template`button[${elFn} Click me!]`;

      render();
    });

    it(`Should add “onclick” listener to button element after a time mounted`, (done) => {
      const { onMount, template, render } = _`App`();
      const elFn = useElManager<HTMLButtonElement>();

      const clickFn = jest.fn();

      onMount(() => {
        const appEl = elFn();

        setTimeout(() => appEl.click$(clickFn));

        setTimeout(() => {
          appEl.el.click();
          expect(clickFn).toBeCalledTimes(1);
          done();
        });
      });

      template`button[${elFn} Click me!]`;

      render();
    });

    it(`
  Should remove “onclick” listener from button element immediately after added
`, (done) => {
      const { onMount, onInit, template, render } = _`App`();
      const elFn = useElManager<HTMLButtonElement>();

      const clickFn1 = jest.fn();
      const clickFn2 = jest.fn();
      let onInitRemoveClickListener: undefined | Function;

      onInit(() => {
        const appEl = elFn();
        const removeClickListener = appEl.click$(clickFn2);

        removeClickListener();

        onInitRemoveClickListener = appEl.click$(clickFn2);
      });
      onMount(() => {
        const appEl = elFn();
        const removeClickListener = appEl.click$(clickFn1);

        removeClickListener();

        onInitRemoveClickListener && onInitRemoveClickListener();

        appEl.el.click();

        expect(clickFn1).toBeCalledTimes(0);
        expect(clickFn2).toBeCalledTimes(0);

        done();
      });

      template`button[${elFn} Click me!]`;

      render();
    });

    it(`
  Should remove “onclick” listener with “capture:true” from button element immediately after added
`, (done) => {
      const { onMount, template, render } = _`App`();
      const elFn = useElManager<HTMLButtonElement>();

      const clickFn = jest.fn();

      onMount(() => {
        const appEl = elFn();
        const removeClickListener = appEl.click$(clickFn, { capture: true });

        removeClickListener();

        appEl.el.click();

        expect(clickFn).toBeCalledTimes(0);
        done();
      });

      template`button[${elFn} Click me!]`;

      render();
    });
  });
});
