import ComponentManager from "./component-manager";
import {
  addToRelativeInstances,
  getRelativeInstances,
} from "./component-relative-instances";
import processUpdatedTemplate from "./process-updated-template";
import { removeDiffAmoungChildNodes } from "./remove-diff-amoung-child-nodes";
import { TAG_HOST_NAME } from "./globals";
import { setNodeComponentKeys } from "./nodes-component-keys";
import templateTreeToHTMLText from "../brackethtml/template-tree-to-html-text";
import makeTemplateTree from "../brackethtml/make-template-tree";
import {
  dispatchMountedLifeCycle,
  dispatchUpdatedLifeCycle,
} from "./work-with-components-this";

const SIMPLE_DIV = document.createElement("div");
const SIMPLE_DOCUMENT_FRAGMENT = document.createDocumentFragment();

export default function updateUIWithNewTemplate(
  componentManager: ComponentManager
) {
  const template = componentManager.getCurrentTemplate();

  const nodes = componentManager.nodes;

  const relativeInstances = getRelativeInstances(componentManager);

  if (!relativeInstances) return;

  const {
    template: pureTemplate,
    newComponentsManager,
    componentsManagerUpdated,
  } = processUpdatedTemplate(componentManager);

  const newTemplateTree = makeTemplateTree(pureTemplate);
  const newHtml = templateTreeToHTMLText(newTemplateTree);

  componentManager.lastTemplateValue = template;

  SIMPLE_DIV.innerHTML = newHtml;

  const hosts = SIMPLE_DIV.getElementsByTagName(TAG_HOST_NAME);

  for (const host of Array.from(hosts)) {
    SIMPLE_DOCUMENT_FRAGMENT.replaceChildren(
      ...(Array.from(host.childNodes) as Node[])
    );

    for (const node of Array.from(SIMPLE_DOCUMENT_FRAGMENT.childNodes)) {
      setNodeComponentKeys(node, host.id);
    }

    host.parentElement?.replaceChild(SIMPLE_DOCUMENT_FRAGMENT, host);
  }

  const possibleNewChildNodes = Array.from(SIMPLE_DIV.childNodes);

  const oldChildNodes = nodes;
  removeDiffAmoungChildNodes(possibleNewChildNodes, oldChildNodes);

  SIMPLE_DIV.innerHTML = "";

  addToRelativeInstances(newComponentsManager, componentManager);

  dispatchUpdatedLifeCycle(componentManager.componentThis);

  for (const c of componentsManagerUpdated) {
    dispatchUpdatedLifeCycle(c.componentThis);
  }

  for (const c of newComponentsManager) {
    dispatchMountedLifeCycle(c.componentThis);
  }
}
