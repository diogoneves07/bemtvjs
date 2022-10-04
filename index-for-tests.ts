import { render, _ } from "./src/main";

_("Counter", ({ click$, i }) => {
  let count = 0;

  click$(() => count++);

  return () => `button[Cliked: ${count}]`;
});

_("App", () => {
  return () => `Counter example: Counter[]`;
});

// <div>Hello world!</div>
// div[Hello world!]
render(`App[]`);
