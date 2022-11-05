import { Component } from "../../src/main";
import { resetTestEnvironment } from "../test-utilities//reset-test-environment";

resetTestEnvironment();

describe("Lifecycle Hooks", () => {
  test("onMount method", (done) => {
    const onMountFn = jest.fn();
    const { onMount, render } = Component("App");

    onMount(onMountFn);

    onMount(() => {
      expect(onMountFn).toBeCalledTimes(1);
      done();
    });

    render();
  });

  test("onUpdate method", (done) => {
    const onUpdateFn = jest.fn();
    let t = `Hey!`;

    const { onMount, onUpdate, template, render } = Component("App");

    onMount(() => {
      t = "Hi!";
    });

    onUpdate(onUpdateFn);

    onUpdate(() => {
      expect(onUpdateFn).toBeCalledTimes(1);
      done();
    });

    template(() => t);

    render();
  });

  test("onUnmount method", (done) => {
    const onUnmountFn = jest.fn();

    const { onUnmount } = Component("Child").template`Hey!`;

    onUnmount(onUnmountFn);

    const { onMount, onUpdate, template, render } = Component("App");
    let t = `Child[]`;

    onMount(() => {
      t = "Hey!";
    });

    onUpdate(() => {
      //* Should use setTimeout because onUpdate trigger first than onUnmount
      setTimeout(() => {
        expect(onUnmountFn).toBeCalledTimes(1);
        done();
      }, 50);
    });

    template(() => t);

    render();
  });
});
