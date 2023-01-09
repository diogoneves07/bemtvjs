import ComponentInst from "./component-inst";
import processUpdatedTemplate from "./process-updated-template";
import { removeDiffBetweenChildNodes } from "./remove-diff-between-child-nodes";
import brackethtmlToHTML from "../brackethtml/brackethtml-to-html";
import getPossibleNewNodes from "./get-possible-new-nodes";
import { ALL_COMPONENTS_INST } from "./component-inst-store";
import { isRouterComponent } from "./is-router-component";

function getAllNodesInList(nodes: Node[]) {
  const r: Node[] = [];

  for (const n of nodes) {
    r.push(n);

    if (n?.childNodes) {
      r.push(...getAllNodesInList(Array.from(n.childNodes)));
    }
  }

  return r;
}

function keepOnlyNodesConnected(nodes1: Node[], nodes2: Node[]) {
  const n1Length = nodes1.length;
  const n2Length = nodes2.length;

  let length = n1Length > n2Length ? n1Length : n2Length;
  const r: Node[] = [];

  while (length--) {
    const n1 = nodes1[length];
    const n2 = nodes2[length];
    const v = n1?.isConnected ? n1 : n2;

    v?.isConnected && r.push(v);
  }

  return r;
}

export default function updateUIWithNewTemplate(cInst: ComponentInst) {
  const lastComponentsInTemplate = [...cInst.componentsInTemplate];

  const r = processUpdatedTemplate(cInst);

  if (!r) return r;

  const { parentElement } = cInst;

  const { template: pureTemplate, newComponentsInst } = r;

  const newHtml = brackethtmlToHTML(pureTemplate);
  const { possibleNewNodes, componentsNodes } = getPossibleNewNodes(newHtml);

  const oldChildNodes = cInst.nodes;

  const nodesRemovedOrUpdated = removeDiffBetweenChildNodes(
    possibleNewNodes,
    oldChildNodes,
    parentElement
  );

  let allNodesRemovedOrUpdated = getAllNodesInList([...nodesRemovedOrUpdated]);

  const componentsInstUpdated = new Set<ComponentInst>();

  const all = new Set(ALL_COMPONENTS_INST);

  function componentWasUpdated(c: ComponentInst) {
    const nNodes = componentsNodes[c.hostIdValue];

    if (!nNodes) return;

    c.nodes = keepOnlyNodesConnected(c.nodes, nNodes);

    if (isRouterComponent(c.name)) {
      if (!componentsInstUpdated.has(c.parent as any)) {
        componentsInstUpdated.add(c);
      }
      return;
    }
    componentsInstUpdated.add(c);
  }

  function updateNodeParentCompnent(c: ComponentInst, n: Node): boolean {
    if (c.nodes.includes(n)) {
      componentWasUpdated(c);
      all.delete(c);
      return true;
    }

    let isChildOfMyChild = false;
    for (const i of c.componentsInTemplate) {
      isChildOfMyChild = updateNodeParentCompnent(i, n);
    }

    if (!isChildOfMyChild) {
      if (getAllNodesInList(c.nodes).includes(n)) {
        componentWasUpdated(c);
        all.delete(c);
        return true;
      }
    }
    return isChildOfMyChild;
  }

  for (const n of allNodesRemovedOrUpdated) {
    for (const c of all) {
      updateNodeParentCompnent(c, n);
    }
  }

  const newComponentsInTemplate = cInst.componentsInTemplate;
  let hasComponentsInTemplateChanged = true;

  if (lastComponentsInTemplate.length === cInst.componentsInTemplate.size) {
    if (
      !lastComponentsInTemplate.find((v) => !newComponentsInTemplate.has(v))
    ) {
      hasComponentsInTemplateChanged = false;
    }
  }

  if (hasComponentsInTemplateChanged) {
    componentsInstUpdated.add(cInst);
  }

  cInst.lastTemplateProcessed = pureTemplate;

  return {
    newComponentsInst,
    componentsNodes,
    componentsInstUpdated,
  };
}
