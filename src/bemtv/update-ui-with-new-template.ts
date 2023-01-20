import ComponentInst from "./component-inst";
import processUpdatedTemplate from "./process-updated-template";
import { removeDiffBetweenChildNodes } from "./remove-diff-between-child-nodes";
import brackethtmlToHTML from "../brackethtml/brackethtml-to-html";
import getPossibleNewNodes from "./get-possible-new-nodes";
import { ALL_COMPONENTS_INST } from "./component-inst-store";
import { isRouterComponent } from "./is-router-component";
import getAllNodesInList from "../utilities/get-all-nodes-in-list";
import { getNodeParentComponentByInst } from "./get-node-parent-component";

function keepOnlyNodesAndComponentsConnected(
  possibleNewNodes: (Node | string)[],
  possibleOldNodes: (Node | string)[]
) {
  let length = Math.max(possibleNewNodes.length, possibleOldNodes.length);
  const r: (Node | string)[] = [];

  while (length--) {
    const possibleNewNode = possibleNewNodes[length];
    const possibleOldNode = possibleOldNodes[length];

    if (typeof possibleNewNode === "string") {
      r.unshift(possibleNewNode);
    } else if (possibleNewNode) {
      if (possibleNewNode?.isConnected) {
        r.unshift(possibleNewNode);
      } else if (possibleOldNode) {
        r.unshift(possibleOldNode);
      }
    }
  }

  return r;
}

function getComponentsInstUpdated(
  allNodesRemovedOrUpdated: Node[],
  componentsNodes: Map<string, (Node | string)[]>
) {
  const componentsInstUpdated = new Set<ComponentInst>();

  let allComponentsInst = new Set(ALL_COMPONENTS_INST);

  for (const [hostIdValue, nodes] of componentsNodes) {
    for (const c of allComponentsInst) {
      if (c.hostIdValue === hostIdValue) {
        componentsInstUpdated.add(c);

        c.nodesAndComponents = keepOnlyNodesAndComponentsConnected(
          nodes,
          c.nodesAndComponents
        );

        allComponentsInst.delete(c);
        break;
      }
    }
  }

  function componentWasUpdated(c: ComponentInst) {
    const nNodes = componentsNodes.get(c.hostIdValue);

    if (!nNodes) return;

    c.nodesAndComponents = keepOnlyNodesAndComponentsConnected(
      nNodes,
      c.nodesAndComponents
    );

    if (isRouterComponent(c.name)) {
      if (!componentsInstUpdated.has(c.parent as any)) {
        componentsInstUpdated.add(c);
      }
      return;
    }
    componentsInstUpdated.add(c);
  }

  for (const c of allComponentsInst) {
    for (const n of allNodesRemovedOrUpdated) {
      const r = getNodeParentComponentByInst(c, n);

      if (r) {
        componentWasUpdated(r);
        allComponentsInst.delete(r);
      }
    }
  }

  return componentsInstUpdated;
}

export default function updateUIWithNewTemplate(cInst: ComponentInst) {
  const lastComponentsInTemplate = [...cInst.componentsInTemplate];

  const oldChildNodes = cInst.getAllNodes();

  cInst.clearComponentsInTemplateList();

  const r = processUpdatedTemplate(cInst, lastComponentsInTemplate);

  const { parentElement } = cInst;

  const { template: pureTemplate, newComponentsInst } = r;

  const newHtml = brackethtmlToHTML(pureTemplate);

  const { possibleNewNodes, componentsNodes } = getPossibleNewNodes(newHtml);

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
