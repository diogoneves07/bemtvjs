import { render } from "../../src/main";
import "./components-for-use-in-tests/Counter";

describe("Renders the templates", () => {
  it("Should add text in document.body", (done) => {
    render("Hello world!");
    setTimeout(() => {
      expect(document.body.textContent?.trim()).toBe("Hello world!");

      done();
    }, 100);
  });
  it("Should add text in div#app", (done) => {
    document.body.textContent = "";

    const div = document.createElement("div");
    div.id = "app";

    render("Hello world!", div);

    setTimeout(() => {
      expect(div.textContent?.trim()).toBe("Hello world!");

      done();
    }, 100);
  });
  it("Should add Counter component in document.body", (done) => {
    document.body.textContent = "";

    render("Counter[]");

    setTimeout(() => {
      expect(document.body.children.length).toBe(1);
      done();
    }, 100);
  });
});
