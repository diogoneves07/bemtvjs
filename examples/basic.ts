import { render, _ } from "../src/main";
_("Counter", ({ click$ }) => {
  let count = 0;

  click$(() => count++);

  return () => `div[button[Cliked: ${count}]]`;
});

render(`Counter[]`.repeat(500));
