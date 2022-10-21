import { Component } from "../../src/main";

it("should throw an error, because the component does not exist", () => {
  expect(() => {
    Component("App", () => "NotExist[]").render();
  }).toThrow();
});
