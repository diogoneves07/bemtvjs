import ComponentInst from "./component-inst";
import processUpdatedTemplate from "./process-updated-template";
import { removeDiffBetweenChildNodes } from "./remove-diff-between-child-nodes";
import brackethtmlToHTML from "../brackethtml/brackethtml-to-html";
import getPossibleNewNodes from "./get-possible-new-nodes";
import { getComponentInstParents } from "./get-component-inst-parents";

export default function updateUIWithNewTemplate(componentInst: ComponentInst) {
  const r = processUpdatedTemplate(componentInst);

  if (!r) return r;

  const {
    template: pureTemplate,
    newComponentsManager,
    componentsManagerUpdated,
  } = r;

  const newHtml = brackethtmlToHTML(pureTemplate);

  const [keysAndNodes, possibleNewChildNodes] = getPossibleNewNodes(
    newHtml,
    getComponentInstParents(componentInst)
  );

  const oldChildNodes = componentInst.nodes.slice();

  removeDiffBetweenChildNodes(
    possibleNewChildNodes,
    oldChildNodes,
    keysAndNodes,
    componentInst.parentElement
  );

  return { newComponentsManager, componentsManagerUpdated, keysAndNodes };
}
