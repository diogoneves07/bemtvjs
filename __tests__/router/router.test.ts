import { resetDocumentBodyAndRemoveComponents } from "../test-utilities/reset-test-environment";
import { Component, router, r } from "../../src/main";

resetDocumentBodyAndRemoveComponents("App");

describe("Check router functionality", () => {
  it("Should go to the route", () => {
    const goToFirstRoute = r.FirstRoute("");
    goToFirstRoute();
    expect(window.location.hash).toBe("#/first-route");
  });

  it("Should use route fallback", (done) => {
    router.SecondRoute("Unknown[]", "Loading...")();
    Component("App", () => "#[]").render();

    setTimeout(() => {
      expect(document.body.textContent?.trim()).toBe("Loading...");
      expect(window.location.hash).toBe("#/second-route");
      done();
    }, 100);
  });

  it("Should create route link", (done) => {
    router.ThirdRoute("Hello world!");

    Component("App", () => "#[] #ThirdRoute[link]").render();

    setTimeout(() => {
      const a = document.body.children[0] as HTMLAnchorElement;
      expect(a.tagName.toLowerCase()).toBe("a");
      expect(a.getAttribute("href")).toBe("#/third-route");
      done();
    }, 100);
  });

  it("Should use route", (done) => {
    router.FourthRoute("Hey!")();
    Component("App", () => "#[]").render();

    setTimeout(() => {
      expect(document.body.textContent?.trim()).toBe("Hey!");
      expect(window.location.hash).toBe("#/fourth-route");
      done();
    }, 100);
  });

  it("Should not find the route", (done) => {
    window.location.hash = "/unknown";
    Component("App", () => "#[]").render();

    setTimeout(() => {
      expect(document.body.textContent?.trim()).toBe("");
      done();
    }, 100);
  });

  it("Should route be invalid", (done) => {
    window.location.hash = "unknown";
    Component("App", () => "#[]").render();

    setTimeout(() => {
      expect(document.body.textContent?.trim()).toBe("");
      done();
    }, 100);
  });
});
