import SimpleComponent from "./simple-component";
import processUpdatedTemplate from "./process-updated-template";
import { removeDiffBetweenChildNodes } from "./remove-diff-between-child-nodes";
import brackethtmlToHTML from "../brackethtml/brackethtml-to-html";
import getPossibleNewNodes from "./get-possible-new-nodes";
import { ALL_SIMPLE_COMPONENTS } from "./simple-component-store";
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

function getSimpleComponentsUpdated(
  allNodesRemovedOrUpdated: Node[],
  componentsNodes: Map<string, (Node | string)[]>
) {
  const simpleComponentsUpdated = new Set<SimpleComponent>();

  let allSimpleComponents = new Set(ALL_SIMPLE_COMPONENTS);

  for (const [hostIdValue, nodes] of componentsNodes) {
    for (const c of allSimpleComponents) {
      if (c.hostIdValue === hostIdValue) {
        simpleComponentsUpdated.add(c);

        c.nodesAndComponents = keepOnlyNodesAndComponentsConnected(
          nodes,
          c.nodesAndComponents
        );

        allSimpleComponents.delete(c);
        break;
      }
    }
  }

  function componentWasUpdated(c: SimpleComponent) {
    const nNodes = componentsNodes.get(c.hostIdValue);

    if (!nNodes) return;

    c.nodesAndComponents = keepOnlyNodesAndComponentsConnected(
      nNodes,
      c.nodesAndComponents
    );

    if (isRouterComponent(c.name)) {
      if (!simpleComponentsUpdated.has(c.parent as any)) {
        simpleComponentsUpdated.add(c);
      }
      return;
    }
    simpleComponentsUpdated.add(c);
  }

  for (const c of allSimpleComponents) {
    for (const n of allNodesRemovedOrUpdated) {
      const r = getNodeParentComponentByInst(c, n);

      if (r) {
        componentWasUpdated(r);
        allSimpleComponents.delete(r);
      }
    }
  }

  return simpleComponentsUpdated;
}

export default function updateUIWithNewTemplate(cSimple: SimpleComponent) {
  const lastComponentsInTemplate = [...cSimple.componentsInTemplate];

  const oldChildNodes = cSimple.getAllNodes();

  cSimple.clearComponentsInTemplateList();

  const r = processUpdatedTemplate(cSimple, lastComponentsInTemplate);

  const { parentElement } = cSimple;

  const { template: pureTemplate, newSimpleComponents } = r;

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

  const simpleComponentsUpdated = getSimpleComponentsUpdated(
    allNodesRemovedOrUpdated,
    componentsNodes
  );
  const newComponentsInTemplate = cSimple.componentsInTemplate;

  let hasComponentsInTemplateChanged = true;

  if (lastComponentsInTemplate.length === cSimple.componentsInTemplate.size) {
    if (
      !lastComponentsInTemplate.find((v) => !newComponentsInTemplate.has(v))
    ) {
      hasComponentsInTemplateChanged = false;
    }
  }

  if (hasComponentsInTemplateChanged) {
    simpleComponentsUpdated.add(cSimple);
  }

  cSimple.lastTemplateProcessed = pureTemplate;

  cSimple.updateLastTemplateValueProperty();

  return {
    newSimpleComponents,
    componentsNodes,
    simpleComponentsUpdated,
  };
}
