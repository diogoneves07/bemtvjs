import { _, ulDT } from "../../src/main";
import { resetTestEnvironment } from "../test-utilities/reset-test-environment";

resetTestEnvironment();

describe("Check html list discrete transform function", () => {
  const fruitsList = [
    "Fruits",
    [
      "Cherry",
      "Fig",
      "Guava",
      [
        "Cherry",
        "Fig",
        "Guava",
        [
          "Cherry",
          "Fig",
          "Guava",
          [
            "Cherry",
            "Fig",
            "Guava",
            ["Cherry", "Fig", "Guava", ["Cherry", "Fig", "Guava"]],
          ],
        ],
      ],
    ],
    ["Cherry", "Fig", "Guava"],
  ];

  test("With array", (done) => {
    const { onMount, template, render } = _("App", {
      list: ulDT(fruitsList),
    });

    onMount(() => {
      expect(document.body.innerHTML.replace(/[\s]/g, "")).toBe(
        "<ul><li>Fruits<ul><li>Cherry</li><li>Fig</li><li>Guava<ul><li>Cherry</li><li>Fig</li><li>Guava<ul><li>Cherry</li><li>Fig</li><li>Guava<ul><li>Cherry</li><li>Fig</li><li>Guava<ul><li>Cherry</li><li>Fig</li><li>Guava<ul><li>Cherry</li><li>Fig</li><li>Guava</li></ul></li></ul></li></ul></li></ul></li></ul></li></ul></li><ul><li>Cherry</li><li>Fig</li><li>Guava</li></ul></ul>"
      );
      done();
    });

    template(() => `$list`);

    render();
  });

  test("With Set", (done) => {
    const { onMount, template, render } = _("App", {
      list: ulDT(new Set(fruitsList)),
    });

    onMount(() => {
      expect(document.body.innerHTML.replace(/[\s]/g, "")).toBe(
        "<ul><li>Fruits<ul><li>Cherry</li><li>Fig</li><li>Guava<ul><li>Cherry</li><li>Fig</li><li>Guava<ul><li>Cherry</li><li>Fig</li><li>Guava<ul><li>Cherry</li><li>Fig</li><li>Guava<ul><li>Cherry</li><li>Fig</li><li>Guava<ul><li>Cherry</li><li>Fig</li><li>Guava</li></ul></li></ul></li></ul></li></ul></li></ul></li></ul></li><ul><li>Cherry</li><li>Fig</li><li>Guava</li></ul></ul>"
      );
      done();
    });

    template(() => `$list`);

    render();
  });
});
