import { _ } from "../../src/main";
import { resetTestEnvironment } from "../test-utilities//reset-test-environment";

resetTestEnvironment();

describe("Check the “css()” method", () => {
  it("Should add style to the first element", (done) => {
    const { css, onMount, template, render } = _("App");

    css`
      font-size: 50px;
    `;

    onMount(() => {
      const btn = document.getElementsByTagName("button")[0];

      expect(document.getElementsByTagName("style").length).toBe(1);
      expect(btn.classList.length).toBe(1);
      expect(getComputedStyle(btn).getPropertyValue("font-size")).toBe("50px");

      done();
    });

    template(() => `button[Click me!]`);

    render();
  });

  it("Should add style to the first element after a time", (done) => {
    const { css, onMount, template, render } = _("App");

    setTimeout(() => {
      css`
        font-size: 50px;
      `;
    }, 20);

    onMount(() => {
      const btn = document.getElementsByTagName("button")[0];

      setTimeout(() => {
        expect(document.getElementsByTagName("style").length).toBe(1);
        expect(btn.classList.length).toBe(1);
        expect(getComputedStyle(btn).getPropertyValue("font-size")).toBe(
          "50px"
        );

        done();
      }, 20);
    });

    template(() => `button[Click me!]`);

    render();
  });
});
