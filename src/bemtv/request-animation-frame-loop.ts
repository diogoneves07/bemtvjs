import ComponentManager from "./component-manager";
import { ALL_COMPONENTS_MANAGER } from "./components-manager-nodes";
import updateUIWithNewTemplate from "./update-ui-with-new-template";
import deleteComponentManager from "./delete-component-manager";
import {
  dispatchUnmountedLifeCycle,
  isMounted,
} from "./work-with-components-this";
import { BRACKETHTML_CSS_IN_JS } from "../brackethtml/globals";
import { isUserInactive } from "./is-user-inactive";

const componentsToDelete: Set<ComponentManager> = new Set();

const framesLimit = 20;
const timeoutForLoop = 1000 / framesLimit;
const alternativeFramesLimit = 5;
const alternativeTimeoutForLoop = 1000 / alternativeFramesLimit;

function shouldComponentBeUnmounted(componentManager: ComponentManager) {
  const nodes = componentManager.nodes;

  if (nodes.length) return false;

  dispatchUnmountedLifeCycle(componentManager.componentThis);
  componentsToDelete.add(componentManager);

  return true;
}

(function requestAnimationFrameLoop() {
  componentsToDelete.forEach(deleteComponentManager);
  componentsToDelete.clear();

  requestAnimationFrame(() => {
    let hasChanges = false;
    for (const componentManager of ALL_COMPONENTS_MANAGER) {
      if (!isMounted(componentManager.componentThis)) continue;

      if (!componentManager.shouldTemplateBeUpdate()) {
        shouldComponentBeUnmounted(componentManager);
        continue;
      }

      const nodes = componentManager.nodes;

      if (!nodes.length || !nodes[0].parentElement?.isConnected) {
        shouldComponentBeUnmounted(componentManager);
        continue;
      }

      hasChanges = true;

      updateUIWithNewTemplate(componentManager);

      shouldComponentBeUnmounted(componentManager);
    }

    if (hasChanges) BRACKETHTML_CSS_IN_JS.applyLastCSSCreated();

    setTimeout(
      () => requestAnimationFrameLoop(),
      isUserInactive() ? alternativeTimeoutForLoop : timeoutForLoop
    );
  });
})();
