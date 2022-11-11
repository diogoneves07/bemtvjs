import { _, discreteTransform } from "../../src/main";
import { resetTestEnvironment } from "../test-utilities/reset-test-environment";

resetTestEnvironment();

describe("Check discrete transform functions", () => {
  it("Should create and use a discrete transform function", (done) => {
    const myDT = discreteTransform((value) => value.join("-"));

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

  test("Value with multiple discrete transform functions", (done) => {
    const dt1 = discreteTransform((value) => value.join("-"));
    const dt2 = discreteTransform((value) => value.replace("-", "@"));

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
