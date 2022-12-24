import ComponentInst from "./component-inst";
import processUpdatedTemplate from "./process-updated-template";
import { removeDiffBetweenChildNodes } from "./remove-diff-between-child-nodes";
import brackethtmlToHTML from "../brackethtml/brackethtml-to-html";
import getPossibleNewNodes from "./get-possible-new-nodes";

export default function updateUIWithNewTemplate(componentInst: ComponentInst) {
  const {
    template: pureTemplate,
    newComponentsManager,
    componentsManagerUpdated,
  } = processUpdatedTemplate(componentInst);

  const newHtml = brackethtmlToHTML(pureTemplate);

  const [keysAndNodes, possibleNewChildNodes] = getPossibleNewNodes(newHtml);

  const oldChildNodes = componentInst.nodes.slice();

  removeDiffBetweenChildNodes(
    possibleNewChildNodes,
    oldChildNodes,
    componentInst.parentElement
  );

  return { newComponentsManager, componentsManagerUpdated, keysAndNodes };
}
