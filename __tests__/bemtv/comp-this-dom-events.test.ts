import { Component } from "../../src/main";

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

  it("Should remove onclick event listener from element", (done) => {
    Component("App1", ({ el, click$ }) => {
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
