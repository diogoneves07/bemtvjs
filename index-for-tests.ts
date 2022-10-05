import { render, _ } from "./src/main";

_("Counter", ({ click$, p, $ }) => {
  let count: number = p.start || 0;
  const increment = () => count++;
  const doubleValue = () => count * 2;

  click$(increment);

  $({ doubleValue });
  $({ doubleValue });

  return () => `button[Cliked: strong[${count}]]`;
});

_("DoubleCounter", () => {
  return ({ doubleValue = () => 0 }) => `Double value: ${doubleValue()}`;
});

_("App", ({ defineProps }) => {
  const key = defineProps({ start: 0 });
  return () => `Counter example: Counter${key}[] br[] DoubleCounter[] `;
});

// <div>Hello world!</div>
// div[Hello world!]
render(`App[]`);
