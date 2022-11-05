import { Component } from "../../src/main";

it("Should throw an error because the component does not exit", () => {
  expect(() => {
    Component("App").template`NotExist[]`.render();
  }).toThrow();
});
