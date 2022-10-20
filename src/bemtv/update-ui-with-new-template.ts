import ComponentManager from "./component-manager";
import {
  addToRelativeInstances,
  getRelativeInstances,
} from "./component-relative-instances";
import processUpdatedTemplate from "./process-updated-template";
import { removeDiffAmoungChildNodes } from "./remove-diff-amoung-child-nodes";
import brackethtmlToHTML from "../brackethtml/brackethtml-to-html";
import {
  dispatchMountedLifeCycle,
  dispatchUpdatedLifeCycle,
} from "./work-with-components-this";
import { setNodeComponentKeys } from "./nodes-component-keys";
import getPossibleNewNodes from "./get-possible-new-nodes";
import { setComponentManagerNodes } from "./components-manager-nodes";

export default function updateUIWithNewTemplate(
  componentManager: ComponentManager
) {
  const nodes = componentManager.nodes;

  const relativeInstances = getRelativeInstances(componentManager);

  if (!relativeInstances) return;

  const {
    template: pureTemplate,
    newComponentsManager,
    componentsManagerUpdated,
  } = processUpdatedTemplate(componentManager);

  const newHtml = brackethtmlToHTML(pureTemplate);

  const [keysAndNodes, possibleNewChildNodes] = getPossibleNewNodes(newHtml);

  for (const key of Object.keys(keysAndNodes)) {
    for (const node of keysAndNodes[key]) {
      setNodeComponentKeys(node, key);
    }
  }

  const oldChildNodes = nodes;

  removeDiffAmoungChildNodes(possibleNewChildNodes, oldChildNodes);

  addToRelativeInstances(newComponentsManager, componentManager);

  dispatchUpdatedLifeCycle(componentManager.componentThis);

  for (const c of componentsManagerUpdated) {
    dispatchUpdatedLifeCycle(c.componentThis);
  }

  for (const c of newComponentsManager) {
    if (keysAndNodes[c.key]) {
      setComponentManagerNodes(c.key, keysAndNodes[c.key]);
    }
    dispatchMountedLifeCycle(c.componentThis);
  }
}
