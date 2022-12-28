export class CSSClass {
  class: string = "";

  constructor(c: string) {
    this.class = c;
  }

  remove() {
    document.querySelectorAll("." + this.class).forEach((e) => {
      e.classList.remove(this.class);
    });
    return this;
  }

  toggle() {
    document.querySelectorAll("." + this.class).forEach((e) => {
      e.classList.toggle(this.class);
    });
    return this;
  }
}
