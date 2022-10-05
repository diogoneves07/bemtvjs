import { render, _ } from "./src/main";

_("Counter", ({ click$, p, onMount, onUpdate, toParent }) => {
  let count = p.start || 0;

  click$(() => {
    count++;
    toParent({ count });
  });

  toParent({ count });

  return () => `button[Cliked: strong[${count}]]`;
});

_("App", ({ defineProps, i }) => {
  const key = defineProps({ start: 0 });
  return () => {
    return `Counter example: Counter${key}[] br[] Double value: ${
      (i.count || 0) * 2
    }`;
  };
});

// <div>Hello world!</div>
// div[Hello world!]
render(`App[]`);
