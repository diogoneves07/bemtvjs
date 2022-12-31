export class CSSClass {
  class: string = "";

  protected __onRemoveObervers: Set<() => void> = new Set();

  constructor(c: string) {
    this.class = c;
  }

  remove() {
    document.querySelectorAll("." + this.class).forEach((e) => {
      e.classList.remove(this.class);
    });
    this.__onRemoveObervers.forEach((fn) => fn());

    return this;
  }

  _onRemove(fn: () => void) {
    this.__onRemoveObervers.add(fn);
  }
}
