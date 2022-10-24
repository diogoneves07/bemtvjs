import { Component } from "../../src/main";
import { resetTestEnvironment } from "./utilities/reset-test-environment";

resetTestEnvironment();

describe("Define template first element", () => {
  it("Should define button as first element and add “onclick” listener to it", (done) => {
    Component("App", ({ click$ }) => {
      const fn = jest.fn();
      click$(fn);

      setTimeout(() => {
        const btn = document.body.getElementsByTagName("button")[0];
        btn.click();
        expect(fn).toBeCalledTimes(1);
        done();
      }, 100);
      return `button[Click me!]`;
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
});
