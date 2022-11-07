import { Component } from "../../src/main";

it("Should change the children received", (done) => {
  const { children } = Component("Child").template`$children`;

  children(() => "Hey!");

  const { onMount, template, render } = Component("App");

  onMount(() => {
    expect(document.body?.textContent?.trim()).toBe("Hey!");
    done();
  });

  template(() => `Child[Hello world!]`);

  render();
});
