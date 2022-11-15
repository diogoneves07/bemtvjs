import { _ } from "../../src/main";

it("Should change the children received", (done) => {
  const { children } = _`Child`().template`$children`;

  children(() => "Hey!");

  const { onMount, template, render } = _`App`();

  onMount(() => {
    expect(document.body?.textContent?.trim()).toBe("Hey!");
    done();
  });

  template(() => `Child[Hello world!]`);

  render();
});
