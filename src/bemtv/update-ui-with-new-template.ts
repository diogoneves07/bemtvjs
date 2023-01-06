import ComponentInst from "./component-inst";
import processUpdatedTemplate from "./process-updated-template";
import { removeDiffBetweenChildNodes } from "./remove-diff-between-child-nodes";
import brackethtmlToHTML from "../brackethtml/brackethtml-to-html";
import getPossibleNewNodes from "./get-possible-new-nodes";
import { getComponentInstNodes } from "./super-component/work-with-super-component";

export default function updateUIWithNewTemplate(componentInst: ComponentInst) {
  const r = processUpdatedTemplate(componentInst);

  if (!r) return r;

  const {
    template: pureTemplate,
    newComponentsManager,
    componentsManagerUpdated,
  } = r;

  const newHtml = brackethtmlToHTML(pureTemplate);

  const possibleNewChildNodes = getPossibleNewNodes(newHtml);

  const oldChildNodes = getComponentInstNodes(componentInst);

  const nodesRemoved = removeDiffBetweenChildNodes(
    possibleNewChildNodes,
    oldChildNodes,
    componentInst.parentElement
  );

  const componentsInTemplate = [...componentInst.componentsInTemplate];

  for (const n of nodesRemoved) {
    if (!(n instanceof Element)) continue;

    const r = componentsInTemplate.find((v) => n.hasAttribute(v.hostAttrName));

    r && componentsManagerUpdated.push(r);
  }
  return {
    newComponentsManager,
    componentsManagerUpdated: new Set(componentsManagerUpdated),
  };
}
