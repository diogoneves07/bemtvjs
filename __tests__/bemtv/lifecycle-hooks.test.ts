import { Component } from "../../src/main";
import { resetTestEnvironment } from "./utilities/reset-test-environment";

resetTestEnvironment();

describe("Lifecycle Hooks", () => {
  test("onMount method", (done) => {
    const onMountFn = jest.fn();

    Component("App", ({ onMount }) => {
      onMount(onMountFn);
      return "Hello";
    }).render();

    setTimeout(() => {
      expect(onMountFn).toBeCalledTimes(1);
      done();
    }, 100);
  });

  test("onUpdate method", (done) => {
    const onUpdateFn = jest.fn();

    Component("App", ({ onUpdate }) => {
      onUpdate(onUpdateFn);

      let t = `Hello`;
      setTimeout(() => (t = "Hey!"), 100);
      return () => t;
    }).render();

    setTimeout(() => {
      expect(onUpdateFn).toBeCalledTimes(1);
      done();
    }, 200);
  });

  test("onUnmount method", (done) => {
    const onUnmountFn = jest.fn();

    Component("Child", ({ onUnmount }) => {
      onUnmount(onUnmountFn);
      return () => `Hello world`;
    });

    Component("App", () => {
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
