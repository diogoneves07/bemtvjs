import { render, _ } from "./src/main";

_("Counter", ({ click$, p, $ }) => {
  let count: number = p.start || 0;
  const increment = () => count++;

  const getCountValue = () => count;

  click$(increment);

  $({ getCountValue });

  return () => `button[Cliked: strong[${count}]]`;
});

_("DoubleCounter", () => {
  return ({ getCountValue = () => 0 }) =>
    `Double value: ${getCountValue() * 2}`;
});

_("App", ({ defineProps }) => {
  const key = defineProps({ start: 0 });
  return () => `Counter example: Counter${key}[] br[] DoubleCounter[] `;
});

// <div>Hello world!</div>
// div[Hello world!]
render(`App[]`);
