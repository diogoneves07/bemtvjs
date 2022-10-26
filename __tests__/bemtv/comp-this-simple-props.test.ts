import { Component } from "../../src/main";
import { resetTestEnvironment } from "../test-utilities//reset-test-environment";

resetTestEnvironment();

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
    Component("Child", ({ children }) => children);
    Component("App", () => "Child[Hey!]").render();

    setTimeout(() => {
      expect(document.body?.textContent?.trim()).toBe("Hey!");
      done();
    }, 100);
  });
});
