import { Component } from "../../src/main";

beforeEach(() => {
  jest.spyOn(window, "requestAnimationFrame").mockImplementation((fn) => {
    fn(Date.now());
    return 1;
  });
});

it("Should throw an error because the component does not exit", () => {
  expect(() => {
    Component("App").template`NotExist[]`.render();
  }).toThrow();
});
