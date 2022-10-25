import { Component } from "../../src/main";
import { resetTestEnvironment } from "./utilities/reset-test-environment";

resetTestEnvironment();

describe("Inject event handlers to component instance", () => {
  it("Should add onclick event listener to element", (done) => {
    Component("App", ({ el, click$ }) => {
      const [appEl, key] = el<HTMLButtonElement>();
      const clickFn = jest.fn();

      click$(clickFn);

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

  it("Should add mousedown event listener to element", (done) => {
    Component("App", ({ el, mousedown$ }) => {
      const [appEl, key] = el<HTMLButtonElement>();

      const simulateMousedown = (e: Element) => {
        e.dispatchEvent(
          new MouseEvent("mousedown", {
            view: window,
            bubbles: true,
            cancelable: true,
          })
        );
      };
      const mousedownFn = jest.fn();

      mousedown$(mousedownFn);

      setTimeout(() => {
        simulateMousedown(appEl.it as Element);
        simulateMousedown(appEl.it as Element);
      }, 100);

      setTimeout(() => {
        expect(mousedownFn).toBeCalledTimes(2);
        done();
      }, 200);

      return () => `button[${key} Click me!]`;
    }).render();
  });

  it("Should remove onclick event listener from element", (done) => {
    Component("App", ({ el, click$ }) => {
      const [appEl, key] = el<HTMLButtonElement>();
      const clickFn = jest.fn();

      const removeClickListener = click$(clickFn);

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
