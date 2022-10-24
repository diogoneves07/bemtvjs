import { render } from "../../src/main";
import { resetTestEnvironment } from "./utilities/reset-test-environment";
import { createCounterComponent } from "./utilities/Counter";

resetTestEnvironment();

describe("Render the templates", () => {
  it("Should add text in document.body", (done) => {
    render("Hello world!");
    setTimeout(() => {
      expect(document.body.textContent?.trim()).toBe("Hello world!");

      done();
    }, 100);
  });
  it("Should throw an error because the selector is invalid", () => {
    expect(() => {
      render("Hello world!", "");
    }).toThrow();
  });
  it("Should add text in div", (done) => {
    const div = document.createElement("div");
    div.id = "app";

    render("Hello world!", div);

    setTimeout(() => {
      expect(div.textContent?.trim()).toBe("Hello world!");

      done();
    }, 100);
  });
  it("Should add text in div#app", (done) => {
    const div = document.createElement("div");
    div.id = "app";
    document.body.appendChild(div);

    render("Hello world!", "#app");

    setTimeout(() => {
      expect(div.textContent?.trim()).toBe("Hello world!");
      done();
    }, 100);
  });
  it("Should add Counter component in document.body", (done) => {
    createCounterComponent();

    render("Counter[]");

    setTimeout(() => {
      expect(document.body.children.length).toBe(1);
      done();
    }, 100);
  });
});
