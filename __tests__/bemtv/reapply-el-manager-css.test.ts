import { useElManager, _ } from "../../src/main";
import { resetTestEnvironment } from "../test-utilities/reset-test-environment";

resetTestEnvironment();

describe(`
   Checks the reapplication of CSS classes to the element of the “ElementManager.it” property
`, () => {
  it("Should reapply the class inserted via the “ElementManager.css()” method", (done) => {
    const { onMount, onUpdate, template, render } = _`App`();

    const elFn = useElManager();

    let t = `span[${elFn.key} Hey!]`;

    onMount(() => {
      const appEl = elFn();
      appEl.css`color:blue;`;

      t = `span[${elFn.key} Hi!]`;
    });

    onUpdate(() => {
      const appEl = elFn();

      expect(
        window.getComputedStyle(appEl.el as Element).getPropertyValue("color")
      ).toBe("blue");
      done();
    });

    template(() => t);

    render();
  });

  it(`
     Should apply the class inserted through the “ElementManager.css()” method to the new element
  `, (done) => {
    const { onMount, onUpdate, template, render } = _`App`();

    const elFn = useElManager();

    let t = `span[${elFn.key} Hey!]`;

    onMount(() => {
      const appEl = elFn();
      appEl.css`color:blue;`;

      t = `strong[${elFn.key} Hey!]`;
    });

    onUpdate(() => {
      expect(
        window.getComputedStyle(elFn().el as Element).getPropertyValue("color")
      ).toBe("blue");
      done();
    });

    template(() => t);

    render();
  });
});
