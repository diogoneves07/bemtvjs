import { ObserverSystem } from "./observers-system";

export function onRemoveClass(classe: CSSClass, fn: () => void) {
  (classe as any).__onRemoveObervers.add(fn);
}
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
}
