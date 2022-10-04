import { render, _ } from "./src/main";

_("Counter", ({ click$, p }) => {
  let count = p.start || 0;
  console.log({ ...p });

  click$(() => count++);

  return () => `button[Cliked: ${count}]`;
});

_("App", ({ defineProps }) => {
  defineProps("a", { start: 90 });
  return () => `Counter example: Counter_a[]`;
});

// <div>Hello world!</div>
// div[Hello world!]
render(`App[]`);
