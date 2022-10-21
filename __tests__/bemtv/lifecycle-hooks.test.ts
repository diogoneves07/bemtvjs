import { Component } from "../../src/main";

describe("Lifecycle Hooks", () => {
  test("onUnmount method", (done) => {
    const onUnmountFn = jest.fn();

    Component("Child", ({ onUnmount }) => {
      onUnmount(onUnmountFn);
      return () => `Hello world`;
    });

    Component("App3", () => {
      let t = `Child[]`;
      setTimeout(() => (t = "Hey!"), 100);
      return () => t;
    }).render();

    setTimeout(() => {
      expect(onUnmountFn).toBeCalledTimes(1);
      done();
    }, 200);
  });
});
