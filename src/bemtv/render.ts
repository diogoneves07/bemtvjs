import { LIBRARY_NAME_IN_ERRORS_MESSAGE } from "./../globals";

import "./request-animation-frame-loop"; // !important

import brackethtmlTranspiler from "../brackethtml/brackethtml-transpiler";
import processComponentsInTemplate from "./process-components-in-template";
import { dispatchMountedLifeCycle } from "./components-lifecycle";
import { BRACKETHTML_CSS_IN_JS } from "../brackethtml/globals";
import getPossibleNewNodes from "./get-possible-new-nodes";
import isString from "../utilities/is-string";

/**
 * Renders the template somewhere on the page.
 *
 * @param template
 * A template.
 * @param insert
 * The element to insert the nodes.
 */
export default function render(
  template: string,
  insert: string | Element = document.body
) {
  let parent: Element;

  if (isString(insert)) {
    const el = insert ? document.querySelector(insert as string) : null;
    if (!el) {
      throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} This selector ”${insert}” is invalid or the element does not exist!`;
    }
    parent = el;
  } else {
    parent = insert as Element;
  }

  requestAnimationFrame(() => {
    const { newTemplate: pureTemplate, componentsInst } =
      processComponentsInTemplate(template);

    const brackethtml = brackethtmlTranspiler(pureTemplate);

    const { possibleNewNodes, componentsNodes } = getPossibleNewNodes(
      brackethtml.html
    );

    for (const node of possibleNewNodes) {
      if (!node.isConnected) {
        parent.appendChild(node);
      }
    }

    BRACKETHTML_CSS_IN_JS.applyLastCSSCreated(brackethtml.css);

    for (const c of componentsInst) {
      c.nodesAndComponents = componentsNodes.get(c.hostIdValue) || [];
      dispatchMountedLifeCycle(c);
    }
  });
}
