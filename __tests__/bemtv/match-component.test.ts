import { Component, match } from "../../src/main";
import { resetTestEnvironment } from "../test-utilities//reset-test-environment";
import { createCounterComponent } from "../test-utilities//Counter";

resetTestEnvironment();

describe("Shows an alternative if the component is not available", () => {
  test("Component is available", (done) => {
    createCounterComponent();

    Component("App", () => {
      return () => `${match("Counter[]", "is available")} `;
    }).render();
    setTimeout(() => {
      expect(document.body.children.length).toBe(1);
      done();
    }, 100);
  });

  test("Component is not available", (done) => {
    Component("App", () => {
      return () => `${match("Message[]", "is not available")} `;
    }).render();

    setTimeout(() => {
      expect(document.body.textContent?.trim()).toBe("is not available");
      done();
    }, 100);
  });
});
