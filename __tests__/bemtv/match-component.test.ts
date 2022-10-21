import { Component, match } from "../../src/main";
import "./components-for-use-in-tests/Counter";

describe("Shows an alternative if the component is not available", () => {
  test("Component is available", (done) => {
    Component("App1", () => {
      return () => `${match("Counter[]", "is available")} `;
    }).render();
    setTimeout(() => {
      expect(document.body.children.length).toBe(1);
      done();
    }, 100);
  });

  test("Component is not available", (done) => {
    document.body.innerHTML = "";

    Component("App2", () => {
      return () => `${match("Message[]", "is not available")} `;
    }).render();

    setTimeout(() => {
      expect(document.body.textContent?.trim()).toBe("is not available");
      done();
    }, 100);
  });
});
