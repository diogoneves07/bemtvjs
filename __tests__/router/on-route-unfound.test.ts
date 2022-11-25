import { onRouteUnfound } from "../../src/main";

beforeEach(() => {
  window.location.hash = "";
  jest.spyOn(window, "requestAnimationFrame").mockImplementation((fn) => {
    fn(Date.now());
    return 1;
  });
});
describe("onRouteUnfound", () => {
  it("Should trigger the callback twice", (done) => {
    const fn = jest.fn();

    const remove = onRouteUnfound(() => {
      window.location.hash = "/aaaaaaaa";
      fn();
    });

    setTimeout(() => {
      expect(fn).toBeCalledTimes(2);
      remove();

      done();
    }, 50);
  });

  it("Should trigger the callback once", (done) => {
    const fn = jest.fn();

    const remove = onRouteUnfound(fn);

    window.location.hash = "/bbbbbbbb";

    setTimeout(() => {
      expect(fn).toBeCalledTimes(1);
      remove();
      done();
    }, 50);
  });

  it("Should not trigger the callback", (done) => {
    const fn = jest.fn();

    const removeListener = onRouteUnfound(fn);

    removeListener();

    window.location.hash = "/ccccccc";

    setTimeout(() => {
      expect(fn).toBeCalledTimes(0);

      done();
    }, 50);
  });
});
