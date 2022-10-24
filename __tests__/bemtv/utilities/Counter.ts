import { Component } from "../../../src/main";

export function createCounterComponent() {
  Component("Counter", () => {
    let count = 0;

    setTimeout(() => count++, 1000);

    return () => `button[Cliked: ${count}]`;
  });
}
