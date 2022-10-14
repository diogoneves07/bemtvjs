import { css as goober, setup } from "goober";
import { prefix } from "goober/prefixer";

setup(undefined, prefix);

const lastStyleTextAdded: string[] = [];

export class CSSInJS {
  protected __container = document.createElement("div");
  gooberCSS = goober.bind({ target: this.__container });

  extractLastCSSCreated() {
    const css = this.__container.textContent;
    this.__container.textContent = "";
    return css;
  }
  getLastCSSCreated() {
    return this.__container.textContent;
  }
  applyLastCSSCreated() {
    const css = this.extractLastCSSCreated();
    if (css && !lastStyleTextAdded.includes(css)) {
      const style = document.createElement("style");
      style.textContent = css;
      document.head.appendChild(style);

      lastStyleTextAdded.push(css);

      return true;
    }
    return false;
  }
}
