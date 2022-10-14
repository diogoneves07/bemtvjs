import "./request-animation-frame-loop"; // !important

import { BEMTEVI_CSS_IN_JS, TAG_HOST_NAME } from "./globals";
import brackethtmlTranspiler from "../brackethtml/brackethtml-transpiler";
import processComponentsInTemplate from "./process-components-in-template";
import { setComponentManagerNodes } from "./components-manager-nodes";
import { saveRelativeInstances } from "./component-relative-instances";
import { dispatchMountedLifeCycle } from "./work-with-components-this";
import { BRACKETHTML_CSS_IN_JS } from "../brackethtml/globals";

const SIMPLE_DIV = document.createElement("div");
const SIMPLE_DOCUMENT_FRAGMENT = document.createDocumentFragment();

export default function render(
  template: string,
  insert: string | Node = document.body
) {
  const parent =
    typeof insert === "string" ? document.querySelector(insert) : insert;

  if (!parent) return;

  const [pureTemplate, componentsThis, componentsManager] =
    processComponentsInTemplate(template);

  saveRelativeInstances(componentsManager);

  const data = brackethtmlTranspiler(pureTemplate);

  window.requestAnimationFrame(() => {
    SIMPLE_DIV.innerHTML = data.html;

    const hosts = SIMPLE_DIV.getElementsByTagName(TAG_HOST_NAME);

    for (const host of Array.from(hosts).reverse()) {
      SIMPLE_DOCUMENT_FRAGMENT.replaceChildren(
        ...(Array.from(host.childNodes) as Node[])
      );

      setComponentManagerNodes(
        host.id,
        Array.from(SIMPLE_DOCUMENT_FRAGMENT.childNodes)
      );

      host.parentElement?.insertBefore(SIMPLE_DOCUMENT_FRAGMENT, host);
      host.remove();
    }

    for (const node of Array.from(SIMPLE_DIV.childNodes)) {
      parent.appendChild(node);
    }

    SIMPLE_DIV.innerHTML = "";

    BRACKETHTML_CSS_IN_JS.applyLastCSSCreated();

    for (const c of componentsThis) {
      dispatchMountedLifeCycle(c);
    }
  });
}
