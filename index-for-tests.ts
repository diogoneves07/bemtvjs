import { render, _ } from "./src/main";

_("Counter", ({ click$, p, toGlobal }) => {
  let count: number = p.start || 0;

  click$(() => count++);

  toGlobal({ doubleValue: () => count * 2 });

  return () => `button[Cliked: strong[${count}]]`;
});

_("App", ({ defineProps }) => {
  const key = defineProps({ start: 0 });

  return ({ doubleValue = () => 0 }) =>
    `Counter example: Counter${key}[] br[] Double value: ${doubleValue()}`;
});

// <div>Hello world!</div>
// div[Hello world!]
render(`App[]`);
