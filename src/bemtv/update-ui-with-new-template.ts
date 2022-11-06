import ComponentInst from "./component-inst";
import processUpdatedTemplate from "./process-updated-template";
import { removeDiffBetweenChildNodes } from "./remove-diff-between-child-nodes";
import brackethtmlToHTML from "../brackethtml/brackethtml-to-html";
import { setNodeComponentKeys } from "./nodes-component-keys";
import getPossibleNewNodes from "./get-possible-new-nodes";

export default function updateUIWithNewTemplate(componentInst: ComponentInst) {
  const nodes = componentInst.nodes;

  const {
    template: pureTemplate,
    newComponentsManager,
    componentsManagerUpdated,
  } = processUpdatedTemplate(componentInst);

  const newHtml = brackethtmlToHTML(pureTemplate);

  const [keysAndNodes, possibleNewChildNodes] = getPossibleNewNodes(newHtml);

  for (const key of Object.keys(keysAndNodes)) {
    for (const node of keysAndNodes[key]) {
      setNodeComponentKeys(node, key);
    }
  }

  const oldChildNodes = nodes;

  removeDiffBetweenChildNodes(possibleNewChildNodes, oldChildNodes);

  return { newComponentsManager, componentsManagerUpdated, keysAndNodes };
}
