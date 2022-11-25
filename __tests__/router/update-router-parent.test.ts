import { _ } from "../../src/main";

it("Should trigger the “onUpdate” of the Router's parent component", (done) => {
  const { onUpdate, onMount, template, render } = _`App`();
  const fn = jest.fn();

  onMount(() => {
    const { template, renderRoute, route } = _`AboutUs`();

    route();

    template`mmmm`;

    renderRoute();
  });

  onUpdate(fn);

  onUpdate(() => {
    expect(fn).toBeCalledTimes(1);
    done();
  });

  template`#[]`;

  render();
});
