import { _ } from "../../src/main";
import { resetTestEnvironment } from "../test-utilities/reset-test-environment";

resetTestEnvironment();

describe("ManageEl", () => {
  describe("ManageEl.css method", () => {
    it("Should add style to element", (done) => {
      const { useEl, onMount, template, render } = _("App");
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

    it("Should use “onInit” hook to add style to element", (done) => {
      const { useEl, onInit, onMount, template, render } = _("App");
      const [key, el] = useEl<HTMLButtonElement>();

      onInit(() => {
        const appEl = el();
        appEl.css`font-size:50px;`;
      });

      onMount(() => {
        const appEl = el();

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
      const { useEl, onMount, template, render } = _("App");
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
      const { useEl, onMount, template, render } = _("App");
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

    it("Should use “onInit” hook to add onclick event listener to element", (done) => {
      const { useEl, onMount, onInit, template, render } = _("App");
      const [key, el] = useEl<HTMLButtonElement>();

      const clickFn = jest.fn();

      onInit(() => {
        const appEl = el();
        appEl.click$(clickFn);
      });

      onMount(() => {
        const appEl = el();
        appEl.it?.click();

        expect(clickFn).toBeCalledTimes(1);
        done();
      });

      template(() => `button[${key} Click me!]`);

      render();
    });

    it("Should remove onclick event listener from element", (done) => {
      const { useEl, onMount, template, render } = _("App");
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

    it("Should change the elements and remove the listeners from the previous", (done) => {
      const button = document.createElement("button");
      document.body.appendChild(button);

      const { useEl, onMount, template, render } = _("App");
      const [key, el] = useEl<HTMLButtonElement>();

      const clickFn = jest.fn();

      onMount(() => {
        const appEl = el();
        const templateButton = appEl.it;
        appEl.click$(clickFn);
        templateButton?.click();
        appEl.it = button;
        appEl.it?.click();

        templateButton?.click();
        templateButton?.click();

        expect(clickFn).toBeCalledTimes(2);
        done();
      });

      template(() => `button[${key} Click me!]`);

      render();
    });

    it(`Should add “onclick” listener to button element after a time mounted`, (done) => {
      const { useEl, onMount, template, render } = _("App");
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
      const { useEl, onMount, onInit, template, render } = _("App");
      const [key, el] = useEl<HTMLButtonElement>();

      const clickFn1 = jest.fn();
      const clickFn2 = jest.fn();
      let onInitRemoveClickListener: undefined | Function;

      onInit(() => {
        const appEl = el();
        const removeClickListener = appEl.click$(clickFn2);

        removeClickListener();

        onInitRemoveClickListener = appEl.click$(clickFn2);
      });
      onMount(() => {
        const appEl = el();
        const removeClickListener = appEl.click$(clickFn1);

        removeClickListener();

        onInitRemoveClickListener && onInitRemoveClickListener();

        appEl.it?.click();

        expect(clickFn1).toBeCalledTimes(0);
        expect(clickFn2).toBeCalledTimes(0);

        done();
      });

      template(() => `button[${key} Click me!]`);

      render();
    });

    it(`
  Should remove “onclick” listener with “capture:true” from button element immediately after added
`, (done) => {
      const { useEl, onMount, template, render } = _("App");
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
