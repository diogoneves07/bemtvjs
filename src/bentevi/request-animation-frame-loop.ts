import ComponentManager from "./component-manager";
import { dispatchUnmountedLifeCycle, isMounted } from "./components-this";
import { applyLastCSSCreated } from "./css-template";
import { ALL_COMPONENTS_MANAGER } from "./components-manager-nodes";
import updateUIWithNewTemplate from "./update-ui-with-new-template";
import deleteComponentManager from "./delete-component-manager";

const componentsToDelete: Set<ComponentManager> = new Set();

function shouldComponentBeUnmounted(componentManager: ComponentManager) {
  const nodes = componentManager.nodes;

  if (isMounted(componentManager.componentThis) && !nodes.length) {
    dispatchUnmountedLifeCycle(componentManager.componentThis);
    componentsToDelete.add(componentManager);
    return true;
  }
  return false;
}

(function requestAnimationFrameLoop() {
  componentsToDelete.forEach(deleteComponentManager);
  componentsToDelete.clear();

  requestAnimationFrame(() => {
    let hasChanges = false;
    for (const componentManager of ALL_COMPONENTS_MANAGER) {
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

    if (hasChanges) applyLastCSSCreated();

    requestAnimationFrameLoop();
  });
})();
