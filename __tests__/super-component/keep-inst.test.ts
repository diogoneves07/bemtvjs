import { _ } from "../../src/main";

it("Should keep the previous component instance after a time", (done) => {
  const { keepInst, $, onMount, render } = _`App`({
    count: 0,
  });

  let isolate = false;

  onMount(() => {
    if (isolate) return;

    isolate = true;
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
