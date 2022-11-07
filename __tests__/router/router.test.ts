import { ALL_COMPONENTS_INST } from "./../../src/bemtv/component-inst-store";
import { resetDocumentBodyAndRemoveComponents } from "../test-utilities/reset-test-environment";
import { Component, router, r } from "../../src/main";

resetDocumentBodyAndRemoveComponents("App", "Router:Root");

beforeEach(() => {
  /**
   * It is necessary to remove the link between the components already created
   * before using the Router again.
   * */
  for (const m of ALL_COMPONENTS_INST) {
    m.parent = null;
  }
  ALL_COMPONENTS_INST.clear();

  window.location.hash = "";
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

  it("Should use route concat property", (done) => {
    router.WithConcat({
      use: "Hello world!",
      title: "",
      concat: "1234567/hey/89",
    })();

    setTimeout(() => {
      expect(window.location.hash).toBe("#/with-concat/1234567/hey/89");
      done();
    }, 50);
  });

  it("Should use route fallback", (done) => {
    const { onMount, template, render } = Component("App");

    onMount(() => {
      expect(document.body.textContent?.trim()).toBe("Loading...");
      expect(window.location.hash).toBe("#/second-route");
      done();
    });

    template`#[]`;

    render();

    router.SecondRoute(
      { use: "Unknown[]", title: "" },
      { use: "Loading...", title: "" }
    )();
  });

  it("Should not use route fallback", (done) => {
    Component("Home").template("Hello");
    const { onMount, template, render } = Component("App");

    onMount(() => {
      expect(document.body.textContent?.trim()).toBe("Hello");
      expect(window.location.hash).toBe("#/not-fallback");
      done();
    });

    template`#[]`;

    render();

    router.NotFallback(
      { use: "Home[]", title: "" },
      { use: "Not", title: "" }
    )();
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
    const { onMount, template, render } = Component("App");

    onMount(() => {
      expect(document.body.textContent?.trim()).toBe("Hey!");
      expect(window.location.hash).toBe("#/fourth-route");
      done();
    });

    template`#[]`;

    render();
    router.FourthRoute("Hey!")();
  });
  it("Should not find the route", (done) => {
    const { onMount, template, render } = Component("App");

    onMount(() => {
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

  it("Should show the Root route", (done) => {
    router.Root("Hello world!");

    const { onMount, template, render } = Component("App");

    onMount(() => {
      expect(document.body.textContent?.trim()).toBe("Hello world!");
      done();
    });

    template`#[]`;

    render();
  });
  it("Should go to the Root route", (done) => {
    const { onMount, template, render } = Component("App");

    onMount(() => {
      expect(document.body.textContent?.trim()).toBe("Hello world!");
      done();
    });

    template`#[]`;

    render();

    router.Root("Hello world!")();
  });
});
