import { _ } from "../../src/main";
import { resetTestEnvironment } from "../test-utilities/reset-test-environment";

resetTestEnvironment();

describe("Lifecycle Hooks", () => {
  test("onInit hook", (done) => {
    const onInitFn = jest.fn();
    const { onInit, render } = _`App`();

    onInit(onInitFn);

    onInit(() => {
      expect(onInitFn).toBeCalledTimes(1);
      done();
    });

    render();
  });

  test("onMount hook", (done) => {
    const onMountFn = jest.fn();
    const { onMount, render } = _`App`();

    onMount(onMountFn);

    onMount(() => {
      expect(onMountFn).toBeCalledTimes(1);
      done();
    });

    render();
  });

  test("onUpdate hook", (done) => {
    const onUpdateFn = jest.fn();
    let t = `Hey!`;

    const { onMount, onUpdate, template, render } = _`App`();

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

  test("onUnmount hook", (done) => {
    const onUnmountFn = jest.fn();

    const { onUnmount } = _`Child`().template`Hey!`;

    onUnmount(onUnmountFn);

    const { onMount, onUpdate, template, render } = _`App`();
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

  it("Should add a lifecycle hook after a time", (done) => {
    const onUpdateFn = jest.fn();
    const { onUpdate, template, render } = _`App`();
    let t = "Hey!";

    setTimeout(() => {
      onUpdate(onUpdateFn);
      onUpdate(() => {
        expect(onUpdateFn).toBeCalledTimes(1);
        done();
      });
      t = "Hi!";
    }, 20);

    template(() => t);
    render();
  });
});
