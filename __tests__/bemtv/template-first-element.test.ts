import { Component } from "../../src/main";
import { resetTestEnvironment } from "../test-utilities//reset-test-environment";

resetTestEnvironment();

describe("Template first element", () => {
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

  it(`Should add “onclick” listener to button element after mounted time`, (done) => {
    Component("App", ({ click$ }) => {
      const fn = jest.fn();

      setTimeout(() => click$(fn), 100);

      setTimeout(() => {
        const btn = document.body.getElementsByTagName("button")[0];
        btn.click();
        expect(fn).toBeCalledTimes(1);
        done();
      }, 200);

      return `button[Click me!]`;
    }).render();
  });

  it(`
     Should remove “onclick” listener from button element immediately after added
  `, (done) => {
    Component("App", ({ click$ }) => {
      const fn = jest.fn();

      const removeOnClickListener = click$(fn);
      removeOnClickListener();

      setTimeout(() => {
        const btn = document.body.getElementsByTagName("button")[0];
        btn.click();
        expect(fn).toBeCalledTimes(0);
        done();
      }, 200);

      return `button[Click me!]`;
    }).render();
  });
});
