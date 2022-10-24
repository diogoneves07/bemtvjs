import { Component } from "../../src/main";
import { resetTestEnvironment } from "./utilities/reset-test-environment";

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
  });
});
