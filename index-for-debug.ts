import { render, _ } from "./src/main";

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

_("Counter:Double", ({ use, reshare }) => {
  reshare({ username: "Little bird" });
  return () => ` Double value: ${use<() => number>("getCounterValue")() * 2}`;
});

_("App", ({ defineProps, share }) => {
  const key = defineProps({ start: 0 });

  share({ getCounterValue: () => 0 });

  return () => `Counter${key}[] br[] {[]} Counter:Double[]`;
});

render(`App[]`);

//autoloadLazyComponents([()=> import('./react/lazy/')])
