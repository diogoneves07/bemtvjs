import "./request-animation-frame-loop"; // !important

import brackethtmlTranspiler from "../brackethtml/brackethtml-transpiler";
import processComponentsInTemplate from "./process-components-in-template";
import { setComponentManagerNodes } from "./components-manager-nodes";
import { saveRelativeInstances } from "./component-relative-instances";
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
  insert: string | Node = document.body
) {
  const parent =
    typeof insert === "string" ? document.querySelector(insert) : insert;

  if (!parent) return;

  const {
    newTemplate: pureTemplate,
    componentsThis,
    componentsManager,
  } = processComponentsInTemplate(template);

  saveRelativeInstances(componentsManager);

  const data = brackethtmlTranspiler(pureTemplate);

  window.requestAnimationFrame(() => {
    const [keysAndNodes] = getPossibleNewNodes(data.html);
    const nodes: Node[] = [];

    for (const key of Object.keys(keysAndNodes)) {
      nodes.push(...keysAndNodes[key]);
      setComponentManagerNodes(key, keysAndNodes[key]);
    }

    for (const node of nodes) {
      parent.appendChild(node);
    }

    BRACKETHTML_CSS_IN_JS.applyLastCSSCreated();

    for (const c of componentsThis) {
      dispatchMountedLifeCycle(c);
    }
  });
}
