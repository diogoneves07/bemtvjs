import { Component } from "../../src/main";
import { resetTestEnvironment } from "../test-utilities//reset-test-environment";

resetTestEnvironment();

describe(`
   Checks the reapplication of CSS classes to the element of the “ManagerEl.it” property
`, () => {
  it("Should reapply the class inserted via the “ManagerEl.css()” method", (done) => {
    Component("App", ({ el }) => {
      const [appEl, key] = el();
      let t = `span[${key} Click me!]`;

      appEl.css`color:blue;`;

      setTimeout(() => {
        t = `span[${key} Click me!]`;
      }, 100);

      setTimeout(() => {
        expect(
          window.getComputedStyle(appEl.it as Element).getPropertyValue("color")
        ).toBe("blue");
        done();
      }, 200);

      return () => t;
    }).render();
  });

  it(`
     Should apply the class inserted through the “ManagerEl.css()” method to the new element
  `, (done) => {
    Component("App", ({ el }) => {
      const [appEl, key] = el();
      let t = `span[${key} Click me!]`;

      appEl.css`color:blue;`;

      setTimeout(() => {
        t = `strong[${key} Click me!]`;
      }, 100);

      setTimeout(() => {
        expect(
          window.getComputedStyle(appEl.it as Element).getPropertyValue("color")
        ).toBe("blue");
        done();
      }, 200);

      return () => t;
    }).render();
  });
});
