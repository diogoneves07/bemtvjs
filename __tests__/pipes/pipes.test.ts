import { _, pipe } from "../../src/main";
import { resetTestEnvironment } from "../test-utilities/reset-test-environment";

resetTestEnvironment();

describe("Check pipes", () => {
  it("Should create and use a pipe", (done) => {
    const myPipe = pipe((value) => value.join("-"));

    const { onMount, template, render } = _("App", {
      list: myPipe(["hello", "world!"]),
    });

    onMount(() => {
      expect(document.body?.textContent?.trim()).toBe("hello-world!");
      done();
    });

    template(() => `$list`);

    render();
  });

  test("Value with multiple pipes", (done) => {
    const pipe1 = pipe((value) => value.join("-"));
    const pipe2 = pipe((value) => value.replace("-", "@"));

    const { onMount, template, render } = _("App", {
      list: pipe2(pipe1(["hello", "world!"])),
    });

    onMount(() => {
      expect(document.body?.textContent?.trim()).toBe("hello@world!");
      done();
    });

    template(() => `$list`);

    render();
  });
});
