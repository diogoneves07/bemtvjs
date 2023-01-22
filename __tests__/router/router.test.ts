import { resetDocumentBodyAndRemoveComponents } from "../test-utilities/reset-test-environment";
import { _ } from "../../src/main";
import hasRoute from "../../src/bemtv/has-route";
import { ALL_SIMPLE_COMPONENTS } from "../../src/bemtv/simple-component-store";

resetDocumentBodyAndRemoveComponents("App", "Router:Root", "Root");

beforeEach(() => {
  /**
   * It is necessary to remove the link between the components already created
   * before using the Router again.
   * */
  for (const m of ALL_SIMPLE_COMPONENTS) {
    m.parent = null;
  }
  ALL_SIMPLE_COMPONENTS.clear();

  window.location.hash = "";
});

describe("Check router functionality", () => {
  it("Should go to route", () => {
    const { renderRoute } = _`FirstRoute`();

    renderRoute();

    expect(window.location.hash).toBe("#/first-route");
  });

  it("Should go to route and change document title", (done) => {
    const { onMount, renderRoute, route, render } = _`MyRoute`();

    route({
      title: "My route",
    });

    renderRoute();

    onMount(() => {
      expect(window.location.hash).toBe("#/my-route");
      expect(document.title.trim()).toBe("My route");
      done();
    });

    render();
  });

  it("Should use route concat property", (done) => {
    const { renderRoute, route } = _`WithConcat`();

    route({
      concat: "1234567/hey/89",
    });

    renderRoute();

    setTimeout(() => {
      expect(window.location.hash).toBe("#/with-concat/1234567/hey/89");
      done();
    }, 50);
  });

  it("Should use route", (done) => {
    const { renderRoute, onMount, template } = _`FourthRoute`();

    onMount(() => {
      expect(document.body.textContent?.trim()).toBe("Hey!");
      expect(window.location.hash).toBe("#/fourth-route");
      done();
    });

    template`Hey!`;

    _`App`().template`#[]`.render();

    renderRoute();
  });

  it("Should auto create route from templates", () => {
    const { template } = _`EaseRoute`();

    template`Hey!`;

    _`App`().template` #EaseRoute[Link to ease route!]`;

    expect(hasRoute("EaseRoute")).toBeTruthy();
  });

  it("Should auto create Root route", (done) => {
    const { onMount, template } = _`Root`();

    template`Hey!`;

    _`App`().template` #[]`.render();

    onMount(() => {
      expect(document.body.textContent?.trim()).toBe("Hey!");
      done();
    });
  });

  it("Should not find the route", (done) => {
    const { onMount, template, render } = _`App`();

    onMount(() => {
      expect(document.body.textContent?.trim()).toBe("");
      done();
    });

    template`#[]`;

    render();
    window.location.hash = "/unknown";
  });

  it("Should route be invalid", (done) => {
    const { onMount, template, render } = _`App`();

    onMount(() => {
      expect(document.body.textContent?.trim()).toBe("");
      done();
    });

    template`#[]`;

    render();

    window.location.hash = "unknown";
  });
});
