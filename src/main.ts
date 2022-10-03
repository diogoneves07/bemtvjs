import { _ } from "./bentevi/component";
import render from "./bentevi/render";

_("Counter", ({ click$ }) => {
  let count = 0;

  click$(() => count++);

  return () => `div[button[Cliked: ${count}]]`;
});

render(`Counter[]`.repeat(500));
