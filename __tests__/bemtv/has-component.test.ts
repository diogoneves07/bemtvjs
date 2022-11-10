import { _, hasComponent } from "../../src/main";

describe("Checks if component exists", () => {
  it("Should component exist", () => {
    _("Message");
    expect(hasComponent("Message")).toBeTruthy();
  });

  it("Should not component exist", () => {
    _("Text");
    expect(hasComponent("Text")).toBeTruthy();
  });
});
