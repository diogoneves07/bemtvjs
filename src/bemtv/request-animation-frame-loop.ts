import ComponentManager from "./component-manager";
import {
  ALL_COMPONENTS_MANAGER,
  setComponentManagerNodes,
} from "./components-manager-nodes";
import updatedUIWithNewTemplate from "./update-ui-with-new-template";
import deleteComponentManager from "./delete-component-manager";
import {
  dispatchMountedLifeCycle,
  dispatchUnmountedLifeCycle,
  dispatchUpdatedLifeCycle,
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
  if (!componentManager.parent) return false;
  if (componentManager.parent.hasComponentChild(componentManager)) return false;

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

      hasChanges = true;

      shouldComponentBeUnmounted(componentManager);

      const updatedUI = updatedUIWithNewTemplate(componentManager);
      if (!updatedUI) continue;

      const { newComponentsManager, componentsManagerUpdated, keysAndNodes } =
        updatedUI;

      if (
        !componentManager.shouldForceUpdate ||
        newComponentsManager.length ||
        componentsManagerUpdated.length
      ) {
        dispatchUpdatedLifeCycle(componentManager.componentThis);
      }

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

    if (hasChanges) BRACKETHTML_CSS_IN_JS.applyLastCSSCreated();

    setTimeout(
      () => requestAnimationFrameLoop(),
      isUserInactive() ? alternativeTimeoutForLoop : timeoutForLoop
    );
  });
})();