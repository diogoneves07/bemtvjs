import { _ } from "../../src/main";

it("Should pass the props to the child component", (done) => {
  _("Child").template`$props.message`;

  const { defineProps, onMount, template, render } = _("App");

  let p = defineProps({ message: "Hey!" });

  onMount(() => {
    expect(document.body?.textContent?.trim()).toBe("Hey!");
    done();
  });

  template(() => `Child${p}[]`);

  render();
});
