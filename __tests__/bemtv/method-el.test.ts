import { Component } from "../../src/main";
import { ManagerEl } from "./../../src/bemtv/manager-el";

describe("el method", () => {
  it("Should return a tuple", () => {
    Component("App", ({ el }) => {
      const m = el();

      expect(m[0]).toBeInstanceOf(ManagerEl);
      expect(typeof m[1]).toBe("string");

      return () => ``;
    }).render();
  });
  it("Should return the ManagerEl instance", () => {
    const div = document.createElement("div");
    div.id = "app";
    document.body.appendChild(div);

    Component("App1", ({ el }) => {
      const m = el("app");

      expect(m).toBeInstanceOf(ManagerEl);

      return () => ``;
    }).render();
  });
});
