import { Component } from "../../src/main";

describe("ManagerEl", () => {
  describe("ManagerEl.it property", () => {
    it("Should use #app element in ManagerEl", (done) => {
      const div = document.createElement("div");
      div.id = "app";
      document.body.appendChild(div);

      Component("App", ({ el }) => {
        const appEl = el("#app");

        setTimeout(() => {
          expect(appEl.it).toBe(div);
          done();
        }, 200);

        return () => ``;
      }).render();
    });

    it("Should use div element in ManagerEl", (done) => {
      const div = document.createElement("div");

      document.body.appendChild(div);

      Component("App1", ({ el }) => {
        const appEl = el(div);

        setTimeout(() => {
          expect(appEl.it).toBe(div);
          done();
        }, 200);

        return () => ``;
      }).render();
    });

    it("Should get element from template and use in ManagerEl", (done) => {
      Component("App2", ({ el }) => {
        const [appEl, key] = el();

        setTimeout(() => {
          expect(appEl.it?.tagName?.toLowerCase()).toBe("button");
          done();
        }, 200);

        return () => `button[ ${key} Click me!]`;
      }).render();
    });

    it("Should be null", (done) => {
      Component("App3", ({ el }) => {
        const [appEl] = el();

        setTimeout(() => {
          expect(appEl.it).toBeNull();
          done();
        }, 200);

        return () => `button[Click me!]`;
      }).render();
    });
  });

  describe("ManagerEl.it method", () => {
    it("Should add style to element", (done) => {
      Component("App4", ({ el }) => {
        const [appEl, key] = el<HTMLButtonElement>();

        appEl.css`font-size:50px;`;

        setTimeout(() => {
          expect(document.getElementsByTagName("style").length).toBe(1);
          expect(appEl.it?.classList.length).toBe(1);

          expect(
            getComputedStyle(appEl.it as HTMLButtonElement).getPropertyValue(
              "font-size"
            )
          ).toBe("50px");
          done();
        }, 200);

        return () => `button[${key} Click me!]`;
      }).render();
    });
  });

  describe("Inject event handlers to ManagerEl instance", () => {
    it("Should add onclick event listener to element", (done) => {
      Component("App5", ({ el }) => {
        const [appEl, key] = el<HTMLButtonElement>();
        const clickFn = jest.fn();

        appEl.click$(clickFn);

        setTimeout(() => {
          appEl.it?.click();
          appEl.it?.click();
        }, 100);

        setTimeout(() => {
          expect(clickFn).toBeCalledTimes(2);
          done();
        }, 200);

        return () => `button[${key} Click me!]`;
      }).render();
    });

    it("Should remove onclick event listener from element", (done) => {
      Component("App6", ({ el }) => {
        const [appEl, key] = el<HTMLButtonElement>();
        const clickFn = jest.fn();

        const removeClickListener = appEl.click$(clickFn);

        setTimeout(() => {
          appEl.it?.click();
          removeClickListener();
          appEl.it?.click();
        }, 100);

        setTimeout(() => {
          expect(clickFn).toBeCalledTimes(1);
          done();
        }, 200);

        return () => `button[${key} Click me!]`;
      }).render();
    });
  });
});
