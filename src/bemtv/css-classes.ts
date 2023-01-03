import { ObserverSystem } from "./observers-system";

export class CSSClass {
  class: string = "";

  protected __onRemoveObervers = new ObserverSystem();

  constructor(c: string) {
    this.class = c;
  }

  remove() {
    document.querySelectorAll("." + this.class).forEach((e) => {
      e.classList.remove(this.class);
    });
    this.__onRemoveObervers.dispatch();

    return this;
  }

  _onRemove(fn: () => void) {
    this.__onRemoveObervers.add(fn);
  }
}
