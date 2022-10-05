import { render, _ } from "./src/main";

_("Counter", ({ click$, p }) => {
  let count = p.start || 0;

  click$(() => count++);

  return () => `button[Cliked: strong[${count}]]`;
});

_("App", ({ defineProps }) => {
  const key = defineProps({ start: 90 });
  return () => `Counter example: Counter${key}[]`;
});

// <div>Hello world!</div>
// div[Hello world!]
render(`App[]`);
