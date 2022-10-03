import runInRaf from "./run-in-raf";

let callbacksfn: Map<any, Function> = new Map();
let frameOpen: boolean = true;

/** Calls the callback after repainting. */
export default function runInNextRaf(callbackfn: Function, key?: any) {
  callbacksfn.set(key || Symbol(), callbackfn);
  if (frameOpen) {
    setTimeout(() => {
      frameOpen = false;
      callbacksfn.forEach((callbackfn, k) => {
        runInRaf(callbackfn, k);
      });
      callbacksfn.clear();
      frameOpen = true;
    }, 0);
  }
}
