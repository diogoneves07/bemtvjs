import { Component } from "../../src/main";

it("Should change the props received", (done) => {
  const { props } = Component("Child").template`$props.message`;

  props((p) => {
    p.message = "Changed message!";
    return p;
  });

  const { defineProps, onMount, template, render } = Component("App");

  let p = defineProps({ message: "Hey!" });

  onMount(() => {
    expect(document.body?.textContent?.trim()).toBe("Changed message!");
    done();
  });

  template(() => `Child${p}[]`);

  render();
});
