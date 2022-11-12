import { _, tDL } from "../../src/main";
import { resetTestEnvironment } from "../test-utilities/reset-test-environment";

resetTestEnvironment();

describe("Check tDL", () => {
  test("With normal object", (done) => {
    const { onMount, template, render } = _("App", {
      list: tDL({
        user: {
          name: "unknown",
          age: 25,
          user: {
            name: "unknown",
            age: 25,
            user: {
              name: "unknown",
              age: 25,
              user: {
                name: "unknown",
                age: 25,
              },
            },
          },
        },
      }),
    });

    onMount(() => {
      expect(document.body.innerHTML.replace(/[\s]/g, "")).toBe(
        "<dl><dt>user</dt><dd><dl><dt>name</dt><dd>unknown</dd><dt>age</dt><dd>25</dd><dt>user</dt><dd><dl><dt>name</dt><dd>unknown</dd><dt>age</dt><dd>25</dd><dt>user</dt><dd><dl><dt>name</dt><dd>unknown</dd><dt>age</dt><dd>25</dd><dt>user</dt><dd><dl><dt>name</dt><dd>unknown</dd><dt>age</dt><dd>25</dd></dl></dd></dl></dd></dl></dd></dl></dd></dl>"
      );
      done();
    });

    template(() => `$list`);

    render();
  });

  test("With Map", (done) => {
    const { onMount, template, render } = _("App", {
      list: tDL(
        new Map(
          Object.entries({
            user: {
              name: "unknown",
              age: 25,
            },
          })
        )
      ),
    });

    onMount(() => {
      expect(document.body.innerHTML.replace(/[\s]/g, "")).toBe(
        "<dl><dt>user</dt><dd><dl><dt>name</dt><dd>unknown</dd><dt>age</dt><dd>25</dd></dl></dd></dl>"
      );
      done();
    });

    template(() => `$list`);

    render();
  });
});
