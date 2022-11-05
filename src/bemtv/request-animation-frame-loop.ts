import { ALL_COMPONENTS_MANAGER } from "./component-manager-store";
import ComponentManager from "./component-manager";
import { setComponentManagerNodes } from "./components-manager-nodes";
import updatedUIWithNewTemplate from "./update-ui-with-new-template";
import {
  dispatchMountedLifeCycle,
  dispatchUpdatedLifeCycle,
  isMounted,
} from "./work-with-components-inst";
import { BRACKETHTML_CSS_IN_JS } from "../brackethtml/globals";
import shouldComponentBeUnmounted from "./should-component-be-unmounted";

const componentsToDelete: Set<ComponentManager> = new Set();

const framesLimit = 20;

const timeoutForLoop = 1000 / framesLimit;

(function requestAnimationFrameLoop() {
  componentsToDelete.clear();

  requestAnimationFrame(() => {
    let hasChanges = false;
    for (const componentManager of ALL_COMPONENTS_MANAGER) {
      if (!isMounted(componentManager.componentInst)) continue;

      if (!componentManager.shouldTemplateBeUpdate()) {
        shouldComponentBeUnmounted(componentManager);
        continue;
      }

      hasChanges = true;

      shouldComponentBeUnmounted(componentManager);

      const updatedUI = updatedUIWithNewTemplate(componentManager);

      if (updatedUI) {
        const { newComponentsManager, componentsManagerUpdated, keysAndNodes } =
          updatedUI;

        if (
          !componentManager.shouldForceUpdate ||
          newComponentsManager.length ||
          componentsManagerUpdated.length
        ) {
          dispatchUpdatedLifeCycle(componentManager.componentInst);
        }

        for (const c of componentsManagerUpdated) {
          dispatchUpdatedLifeCycle(c.componentInst);
        }

        for (const c of newComponentsManager) {
          if (keysAndNodes[c.key]) {
            setComponentManagerNodes(c.key, keysAndNodes[c.key]);
          }
          dispatchMountedLifeCycle(c.componentInst);
        }
      }
    }

    if (hasChanges) BRACKETHTML_CSS_IN_JS.applyLastCSSCreated();

    setTimeout(() => requestAnimationFrameLoop(), timeoutForLoop);
  });
})();
