import render from "./render";

export default class ComponentInstance {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  render(selectorOrElement?: Element | string) {
    render(this.name + "[]", selectorOrElement);
    return this;
  }
}
