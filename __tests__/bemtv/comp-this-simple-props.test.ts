import { Component } from "../../src/main";

describe("Checks the values of simple properties of the component instance", () => {
  test("name property", (done) => {
    Component("App", ({ name }) => {
      return () => name;
    }).render();
    setTimeout(() => {
      expect(document.body?.textContent?.trim()).toBe("App");
      done();
    }, 100);
  });

  test("name children", (done) => {
    document.body.textContent = "";

    Component("Child", ({ children }) => children);
    Component("App1", () => "Child[Hey!]").render();

    setTimeout(() => {
      expect(document.body?.textContent?.trim()).toBe("Hey!");
      done();
    }, 100);
  });
});
