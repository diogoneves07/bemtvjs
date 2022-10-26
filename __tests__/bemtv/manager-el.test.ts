import { Component } from "../../src/main";
import { resetTestEnvironment } from "../test-utilities//reset-test-environment";

resetTestEnvironment();

describe("ManagerEl", () => {
  describe("ManagerEl.css method", () => {
    it("Should add style to element", (done) => {
      Component("App", ({ el }) => {
        const [appEl, key] = el<HTMLButtonElement>();

        appEl.css`font-size:50px;`;

        setTimeout(() => {
          expect(document.getElementsByTagName("style").length).toBe(1);
          expect(appEl.it?.classList.length).toBe(1);

          expect(
            getComputedStyle(appEl.it as HTMLButtonElement).getPropertyValue(
              "font-size"
            )
          ).toBe("50px");
          done();
        }, 200);

        return () => `button[${key} Click me!]`;
      }).render();
    });

    it("Should add style to element after a time", (done) => {
      Component("App", ({ el }) => {
        const [appEl, key] = el<HTMLButtonElement>();

        setTimeout(() => {
          appEl.css`font-size:50px;`;
        }, 100);

        setTimeout(() => {
          expect(document.getElementsByTagName("style").length).toBe(1);
          expect(appEl.it?.classList.length).toBe(1);

          expect(
            getComputedStyle(appEl.it as HTMLButtonElement).getPropertyValue(
              "font-size"
            )
          ).toBe("50px");
          done();
        }, 200);

        return () => `button[${key} Click me!]`;
      }).render();
    });
  });

  describe("Inject event handlers to ManagerEl instance", () => {
    it("Should add onclick event listener to element", (done) => {
      Component("App", ({ el }) => {
        const [appEl, key] = el<HTMLButtonElement>();
        const clickFn = jest.fn();

        appEl.click$(clickFn);

        setTimeout(() => {
          appEl.it?.click();
          appEl.it?.click();
        }, 100);

        setTimeout(() => {
          expect(clickFn).toBeCalledTimes(2);
          done();
        }, 200);

        return () => `button[${key} Click me!]`;
      }).render();
    });

    it("Should remove onclick event listener from element", (done) => {
      Component("App", ({ el }) => {
        const [appEl, key] = el<HTMLButtonElement>();
        const clickFn = jest.fn();

        const removeClickListener = appEl.click$(clickFn);

        setTimeout(() => {
          appEl.it?.click();
          removeClickListener();
          appEl.it?.click();
        }, 100);

        setTimeout(() => {
          expect(clickFn).toBeCalledTimes(1);
          done();
        }, 200);

        return () => `button[${key} Click me!]`;
      }).render();
    });

    it(`
  Should define strong and then button as first element and add “onclick” listener to it
`, (done) => {
      Component("App", ({ click$ }) => {
        const fn = jest.fn();
        let t = `strong[Hello!]`;
        click$(fn);

        setTimeout(() => {
          t = `button[Click me!]`;
        }, 100);

        setTimeout(() => {
          const btn = document.body.getElementsByTagName("button")[0];
          btn.click();
          expect(fn).toBeCalledTimes(1);
          done();
        }, 200);

        return () => t;
      }).render();
    });

    it(`Should add “onclick” listener to button element after mounted time`, (done) => {
      Component("App", ({ el }) => {
        const fn = jest.fn();
        const [btnEl, btnKey] = el<HTMLButtonElement>();

        setTimeout(() => btnEl.click$(fn), 100);

        setTimeout(() => {
          btnEl.it?.click();
          expect(fn).toBeCalledTimes(1);
          done();
        }, 200);

        return `button[ ${btnKey} Click me!]`;
      }).render();
    });

    it(`
  Should remove “onclick” listener from button element immediately after added
`, (done) => {
      Component("App", ({ el }) => {
        const fn = jest.fn();
        const [btnEl, btnKey] = el<HTMLButtonElement>();

        const removeOnClickListener = btnEl.click$(fn);
        removeOnClickListener();

        setTimeout(() => {
          btnEl.it?.click();
          expect(fn).toBeCalledTimes(0);
          done();
        }, 200);

        return `button[${btnKey} Click me!]`;
      }).render();
    });

    it(`
  Should remove “onclick” listener with “capture:true” from button element immediately after added
`, (done) => {
      Component("App", ({ el }) => {
        const fn = jest.fn();
        const [btnEl, btnKey] = el<HTMLButtonElement>();

        const removeOnClickListener = btnEl.click$(fn, { capture: true });

        setTimeout(() => {
          removeOnClickListener();

          btnEl.it?.click();
          expect(fn).toBeCalledTimes(0);
          done();
        }, 200);

        return `button[${btnKey} Click me!]`;
      }).render();
    });
  });
});
