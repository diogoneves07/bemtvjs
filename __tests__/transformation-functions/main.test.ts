import { _, tFn } from "../../src/main";
import { resetTestEnvironment } from "../test-utilities/reset-test-environment";

resetTestEnvironment();

describe("Check ttFunctions", () => {
  it("Should create and use a ttFunction", (done) => {
    const myDT = tFn((value) => value.join("-"));

    const { onMount, template, render } = _("App", {
      list: myDT(["hello", "world!"]),
    });

    onMount(() => {
      expect(document.body?.textContent?.trim()).toBe("hello-world!");
      done();
    });

    template(() => `$list`);

    render();
  });

  test("Value with multiple ttFunctions", (done) => {
    const dt1 = tFn((value) => value.join("-"));
    const dt2 = tFn((value) => value.replace("-", "@"));

    const { onMount, template, render } = _("App", {
      list: dt2(dt1(["hello", "world!"])),
    });

    onMount(() => {
      expect(document.body?.textContent?.trim()).toBe("hello@world!");
      done();
    });

    template(() => `$list`);

    render();
  });
});
