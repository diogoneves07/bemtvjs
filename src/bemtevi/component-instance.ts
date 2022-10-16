import render from "./render";

export default class ComponentInstance {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  /**
   * Renders the component somewhere on the page.
   *
   * @param selectorOrElement
   * The element to insert the nodes
   */
  render(selectorOrElement?: Element | string) {
    render(this.name + "[]", selectorOrElement);
    return this;
  }
}
