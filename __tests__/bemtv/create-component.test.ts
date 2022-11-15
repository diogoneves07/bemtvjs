import { _, hasComponent } from "../../src/main";

describe("Creating a component", () => {
  it("Should create a component", () => {
    _`HelloWorld`();
    expect(hasComponent("HelloWorld")).toBeTruthy();
  });
  it("Should not create a component", () => {
    expect(() => _`HelloWorld`()).toThrow();
  });
});
