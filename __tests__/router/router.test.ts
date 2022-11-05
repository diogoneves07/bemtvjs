import { ALL_COMPONENTS_MANAGER } from "./../../src/bemtv/component-manager-store";
import { resetDocumentBodyAndRemoveComponents } from "../test-utilities/reset-test-environment";
import { Component, router, r } from "../../src/main";

resetDocumentBodyAndRemoveComponents("App");

beforeEach(() => {
  /**
   * It is necessary to remove the link between the components already created
   * before using the Router again.
   * */
  for (const m of ALL_COMPONENTS_MANAGER) {
    m.componentThis = null as any;
  }
  ALL_COMPONENTS_MANAGER.clear();
});

describe("Check router functionality", () => {
  it("Should go to the route", () => {
    const goToFirstRoute = r.FirstRoute("");
    goToFirstRoute();
    expect(window.location.hash).toBe("#/first-route");
  });

  it("Should go to the route and change document title", (done) => {
    const goToFirstRoute = r.MyRoute({ title: "My route", use: "" });
    goToFirstRoute();
    setTimeout(() => {
      expect(window.location.hash).toBe("#/my-route");
      expect(document.title.trim()).toBe("My route");
      done();
    }, 50);
  });

  it("Should use route fallback", (done) => {
    const { onUpdate, template, render } = Component("App");

    onUpdate(() => {
      expect(document.body.textContent?.trim()).toBe("Loading...");
      expect(window.location.hash).toBe("#/second-route");
      done();
    });

    template`#[]`;

    render();

    router.SecondRoute("Unknown[]", "Loading...")();
  });
  it("Should create route link", (done) => {
    router.ThirdRoute("Hello world!");

    const { onMount, template, render } = Component("App");

    onMount(() => {
      const a = document.body.children[0] as HTMLAnchorElement;
      expect(a.tagName.toLowerCase()).toBe("a");
      expect(a.getAttribute("href")).toBe("#/third-route");
      done();
    });

    template`#[] #ThirdRoute[link]`;

    render();
  });

  it("Should use route", (done) => {
    const { onUpdate, template, render } = Component("App");

    onUpdate(() => {
      expect(document.body.textContent?.trim()).toBe("Hey!");
      expect(window.location.hash).toBe("#/fourth-route");
      done();
    });

    template`#[]`;

    render();
    router.FourthRoute("Hey!")();
  });
  it("Should not find the route", (done) => {
    const { onUpdate, template, render } = Component("App");

    onUpdate(() => {
      expect(document.body.textContent?.trim()).toBe("");
      done();
    });

    template`#[]`;

    render();
    window.location.hash = "/unknown";
  });

  it("Should route be invalid", (done) => {
    const { onMount, template, render } = Component("App");

    onMount(() => {
      expect(document.body.textContent?.trim()).toBe("");
      done();
    });

    template`#[]`;

    render();

    window.location.hash = "unknown";
  });
});
