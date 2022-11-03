import { LIBRARY_NAME_IN_ERRORS_MESSAGE } from "./../globals";

import "./request-animation-frame-loop"; // !important

import brackethtmlTranspiler from "../brackethtml/brackethtml-transpiler";
import processComponentsInTemplate from "./process-components-in-template";
import { setComponentManagerNodes } from "./components-manager-nodes";
import { dispatchMountedLifeCycle } from "./work-with-components-this";
import { BRACKETHTML_CSS_IN_JS } from "../brackethtml/globals";
import getPossibleNewNodes from "./get-possible-new-nodes";

/**
 * Renders the template somewhere on the page.
 *
 * @param template
 * A template.
 * @param insert
 * The element to insert the nodes
 */
export default function render(
  template: string,
  insert: string | Element = document.body
) {
  let parent: Element;

  if (typeof insert === "string") {
    const el = insert ? document.querySelector(insert) : null;
    if (!el) {
      throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} This selector ”${insert}” is invalid or the element does not exist!`;
    }
    parent = el;
  } else {
    parent = insert;
  }

  const { newTemplate: pureTemplate, componentsThis } =
    processComponentsInTemplate(template);

  const brackethtml = brackethtmlTranspiler(pureTemplate);

  window.requestAnimationFrame(() => {
    const [keysAndNodes, n] = getPossibleNewNodes(brackethtml.html);

    for (const key of Object.keys(keysAndNodes)) {
      setComponentManagerNodes(key, keysAndNodes[key]);
    }

    for (const node of n) {
      if (!node.isConnected) {
        parent.appendChild(node);
      }
    }

    BRACKETHTML_CSS_IN_JS.applyLastCSSCreated(brackethtml.css);

    for (const c of componentsThis) {
      dispatchMountedLifeCycle(c);
    }
  });
}
