import { Component } from "../../src/main";

it("Should keep the previous component instance after a time", (done) => {
  const { keepInst, $, onMount, render } = Component("App", {
    count: 0,
  });

  let hasCliked = false;

  onMount(() => {
    if (hasCliked) return;

    hasCliked = true;
    $.count++;

    setTimeout(
      keepInst(() => {
        expect($.count).toBe(1);
        done();
      })
    );
  });

  render();
  render();
});
