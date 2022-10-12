import { render, _, hasComponent } from "./src/main";

_("Counter", ({ click$, p, reshare, el, onMount }) => {
  let count: number = p.start || 0;

  const increment = () => count++;
  const getCounterValue = () => count;
  const btn = el("#diogo");

  onMount(() => {
    console.log(btn.it);
  });

  reshare({ getCounterValue });

  click$(increment);

  return () => `button[ id="diogo" ~ Value: strong[${count}]]`;
});

_("DoubleCounter", ({ use, reshare }) => {
  reshare({ username: "Little bird" });
  return () => ` Double value: ${use<() => number>("getCounterValue")() * 2}`;
});

_("Message", ({ children }) => `br[] br[] ${children}`);

_("App", ({ defineProps, share, use }) => {
  const key = defineProps({ start: 20 });

  share({ getCounterValue: () => 0 });
  return () => `Counter${key}[] br[] DoubleCounter[] Message[Diogo Neves]`;
});

// <div>Hello world!</div>
// div[Hello world!]
//
render(`App[]`);

//lazyCompoenentes([impor])
