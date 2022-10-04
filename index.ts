import { render, _ } from "./src/main";

_("Counter", ({ click$, i }) => {
  let count = 0;

  click$(() => count++);

  return () => `Counter example: button[Cliked: ${count}]`;
});

// <div>Hello world!</div>
// div[Hello world!]
render(`Counter[]`);
