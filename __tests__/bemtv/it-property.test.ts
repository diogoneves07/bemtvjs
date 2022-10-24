import { Component } from "../../src/main";
import { resetTestEnvironment } from "./utilities/reset-test-environment";

resetTestEnvironment();

describe("ManagerEl.it property", () => {
  it("Should use #app element in ManagerEl", (done) => {
    const div = document.createElement("div");
    div.id = "app";
    document.body.appendChild(div);

    Component("App", ({ el }) => {
      const appEl = el("#app");

      setTimeout(() => {
        expect(appEl.it).toBe(div);
        done();
      }, 200);

      return () => ``;
    }).render();
  });

  it("Should use div element in ManagerEl", (done) => {
    const div = document.createElement("div");

    document.body.appendChild(div);

    Component("App", ({ el }) => {
      const appEl = el(div);

      setTimeout(() => {
        expect(appEl.it).toBe(div);
        done();
      }, 200);

      return () => ``;
    }).render();
  });

  it("Should get element from template and use in ManagerEl", (done) => {
    Component("App", ({ el }) => {
      const [appEl, key] = el();

      setTimeout(() => {
        expect(appEl.it?.tagName?.toLowerCase()).toBe("button");
        done();
      }, 200);

      return () => `button[ ${key} Click me!]`;
    }).render();
  });

  it("Should be null", (done) => {
    Component("App", ({ el }) => {
      const [appEl] = el();

      setTimeout(() => {
        expect(appEl.it).toBeNull();
        done();
      }, 200);

      return () => `button[Click me!]`;
    }).render();
  });

  it("Should replace the HTML elements “span” with “strong”", (done) => {
    Component("App", ({ el }) => {
      const [appEl, key] = el();
      let t = `span[${key} class="today" ~ Click me!]`;

      setTimeout(() => {
        t = `strong[${key} class="today" ~ Click me!]`;
      }, 100);

      setTimeout(() => {
        expect(appEl.it?.tagName?.toLowerCase()).toBe("strong");
        done();
      }, 200);

      return () => t;
    }).render();
  });

  it("Should update element attributes", (done) => {
    Component("App", ({ el }) => {
      const [appEl, key] = el();
      let t = `span[${key} class="today" color:red; ~ Click me!]`;

      setTimeout(() => {
        t = `span[${key} class="today tomorrow" color:red; ~ Click me!]`;
      }, 100);

      setTimeout(() => {
        expect(appEl.it?.tagName?.toLowerCase()).toBe("span");
        done();
      }, 200);

      return () => t;
    }).render();
  });
});
