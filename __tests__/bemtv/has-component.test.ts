import { Component, hasComponent } from "../../src/main";

describe("Checks if component exists", () => {
  it("Should component exist", () => {
    Component("Message");
    expect(hasComponent("Message")).toBeTruthy();
  });

  it("Should not component exist", () => {
    Component("Text");
    expect(hasComponent("Text")).toBeTruthy();
  });
});
