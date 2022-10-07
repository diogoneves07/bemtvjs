import { render, _ } from "./src/main";

_("Counter", ({ click$, p, reshare }) => {
  let count: number = p.start || 0;
  const increment = () => count++;
  const getCounterValue = () => count;

  click$(increment);

  reshare({ getCounterValue });

  return () => `button[Cliked: strong[${count}]]`;
});

_("DoubleCounter", ({ use, reshare }) => {
  reshare({ username: "Little bird" });
  return () => ` Double value: ${use<() => number>("getCounterValue")() * 2}`;
});

_("App", ({ defineProps, share, use, onUpdate }) => {
  const key = defineProps({ start: 0 });

  share({ getCounterValue: () => 0, username: "unknown" });
  return () =>
    `
      h1[Olá, span[ color:blue; ~ ${use("username")}]!] br[]br[]
      Counter example: Counter${key}[] br[] DoubleCounter[] 
    `;
});

// <div>Hello world!</div>
// div[Hello world!]
render(`App[]`.repeat(100));
