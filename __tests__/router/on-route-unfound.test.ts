import { router } from "./../../src/router/main";
import { onRouteUnfound } from "../../src/main";

beforeEach(() => {
  window.location.hash = "";
});
describe("onRouteUnfound", () => {
  it("Should trigger the callback twice", (done) => {
    const fn = jest.fn();

    onRouteUnfound(fn);

    setTimeout(() => {
      window.location.hash = "/aaaaaaaa";
    });

    setTimeout(() => {
      expect(fn).toBeCalledTimes(2);

      done();
    }, 50);
  });

  it("Should trigger the callback once", (done) => {
    router.Root("Hey!");

    const fn = jest.fn();

    onRouteUnfound(fn);

    setTimeout(() => {
      window.location.hash = "/bbbbbbbb";
    });

    setTimeout(() => {
      expect(fn).toBeCalledTimes(1);

      done();
    }, 50);
  });

  it("Should not trigger the callback", (done) => {
    const fn = jest.fn();

    const removeListener = onRouteUnfound(fn);

    removeListener();

    setTimeout(() => {
      window.location.hash = "/ccccccc";
    });

    setTimeout(() => {
      expect(fn).toBeCalledTimes(0);

      done();
    }, 50);
  });
});
