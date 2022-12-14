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
  let length = Math.max(nodes1.length, nodes2.length);
  const r: Node[] = [];

  while (length--) {
    const n1 = nodes1[length];
    const n2 = nodes2[length];
    const v = n1?.isConnected ? n1 : n2;

    v?.isConnected && r.unshift(v);
  }

  return r;
}

function getComponentsInstUpdated(
  allNodesRemovedOrUpdated: Node[],
  componentsNodes: Map<string, Node[]>
) {
  const componentsInstUpdated = new Set<ComponentInst>();

  let allComponentsInst = new Set(ALL_COMPONENTS_INST);

  for (const [hostIdValue, nodes] of componentsNodes) {
    const hasAnyNodeConnected = nodes.find((n) => n.isConnected);

    if (!hasAnyNodeConnected) continue;

    for (const c of allComponentsInst) {
      if (c.hostIdValue === hostIdValue) {
        componentsInstUpdated.add(c);

        c.nodes = keepOnlyNodesConnected(c.nodes, nodes);

        allComponentsInst.delete(c);
        break;
      }
    }
  }

  function componentWasUpdated(c: ComponentInst) {
    const nNodes = componentsNodes.get(c.hostIdValue);

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

  function updateNodeParentComponent(c: ComponentInst, n: Node): boolean {
    if (c.nodes.includes(n)) {
      componentWasUpdated(c);
      allComponentsInst.delete(c);
      return true;
    }

    let isChildOfMyChild = false;
    for (const i of c.componentsInTemplate) {
      isChildOfMyChild = updateNodeParentComponent(i, n);
    }

    if (!isChildOfMyChild) {
      if (getAllNodesInList(c.nodes).includes(n)) {
        componentWasUpdated(c);
        allComponentsInst.delete(c);
        return true;
      }
    }

    return isChildOfMyChild;
  }

  for (const c of allComponentsInst) {
    for (const n of allNodesRemovedOrUpdated) {
      updateNodeParentComponent(c, n);
    }
  }

  return componentsInstUpdated;
}

export default function updateUIWithNewTemplate(cInst: ComponentInst) {
  const lastComponentsInTemplate = [...cInst.componentsInTemplate];

  cInst.clearComponentsInTemplateList();

  const r = processUpdatedTemplate(cInst, lastComponentsInTemplate);

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

  const allNodesRemovedOrUpdated = getAllNodesInList([
    ...nodesRemovedOrUpdated,
  ]);

  const componentsInstUpdated = getComponentsInstUpdated(
    allNodesRemovedOrUpdated,
    componentsNodes
  );
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

  cInst.updateLastTemplateValueProperty();

  return {
    newComponentsInst,
    componentsNodes,
    componentsInstUpdated,
  };
}
