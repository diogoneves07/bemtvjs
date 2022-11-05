import { Component } from "../../src/main";

export function createCounterComponent() {
  Component("Counter").template`button[Cliked: 0]`;
}
