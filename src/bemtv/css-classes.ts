import { ObserverSystem } from "./observers-system";

export function onRemoveClass(classe: CSSClass, fn: () => void) {
  (classe as any).__onRemoveObervers.add(fn);
}
export class CSSClass {
  /**
   * The name of the css class.
   */
  name: string = "";

  protected __onRemoveObervers = new ObserverSystem();

  constructor(c: string) {
    this.name = c;
  }

  /**
   * Removes the class from all elements that contain it.
   */
  remove() {
    document.querySelectorAll("." + this.name).forEach((e) => {
      e.classList.remove(this.name);
    });
    this.__onRemoveObervers.dispatch();

    return this;
  }
}
