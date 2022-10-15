import { _ } from "./src/main";

_("Counter", ({ click$ }) => {
  let count = 0;

  click$(() => count++);

  return () => `button[ color:red; ~ Value: strong[${count}]]`;
});

_("App", () => `Counter[]`).render();
