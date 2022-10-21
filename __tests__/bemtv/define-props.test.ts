import { Component } from "../../src/main";

it("Should pass the props to the child component", (done) => {
  Component("Child", ({ p }) => p.message);

  Component("App", ({ defineProps }) => {
    let p = defineProps({ message: "Hey!" });
    return () => `Child${p}[]`;
  }).render();

  setTimeout(() => {
    expect(document.body?.textContent?.trim()).toBe("Hey!");
    done();
  }, 100);
});
