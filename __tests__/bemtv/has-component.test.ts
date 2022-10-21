import { Component, hasComponent } from "../../src/main";

describe("Checks if component exists", () => {
  it("Should component exist", () => {
    Component("Message", () => `Hello world!`);
    expect(hasComponent("Message")).toBeTruthy();
  });

  it("Should not component exist", () => {
    Component("Text", () => `Hello world!`);
    expect(hasComponent("Text")).toBeTruthy();
  });
});
