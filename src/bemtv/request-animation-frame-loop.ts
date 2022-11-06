import { ALL_COMPONENTS_INST } from "./component-inst-store";
import ComponentInst from "./component-inst";
import { setComponentManagerNodes } from "./components-inst-nodes";
import updatedUIWithNewTemplate from "./update-ui-with-new-template";
import {
  dispatchMountedLifeCycle,
  dispatchUpdatedLifeCycle,
} from "./components-lifecycle";
import { BRACKETHTML_CSS_IN_JS } from "../brackethtml/globals";
import shouldComponentBeUnmounted from "./should-component-be-unmounted";

const componentsToDelete: Set<ComponentInst> = new Set();

const framesLimit = 20;

const timeoutForLoop = 1000 / framesLimit;

(function requestAnimationFrameLoop() {
  componentsToDelete.clear();

  requestAnimationFrame(() => {
    let hasChanges = false;
    for (const componentInst of ALL_COMPONENTS_INST) {
      if (!componentInst.mounted) continue;

      if (!componentInst.shouldTemplateBeUpdate()) {
        shouldComponentBeUnmounted(componentInst);
        continue;
      }

      hasChanges = true;

      shouldComponentBeUnmounted(componentInst);

      const updatedUI = updatedUIWithNewTemplate(componentInst);

      if (updatedUI) {
        const { newComponentsManager, componentsManagerUpdated, keysAndNodes } =
          updatedUI;

        if (
          !componentInst.shouldForceUpdate ||
          newComponentsManager.length ||
          componentsManagerUpdated.length
        ) {
          dispatchUpdatedLifeCycle(componentInst);
        }

        for (const c of componentsManagerUpdated) {
          dispatchUpdatedLifeCycle(c);
        }

        for (const c of newComponentsManager) {
          if (keysAndNodes[c.key]) {
            setComponentManagerNodes(c.key, keysAndNodes[c.key]);
          }
          dispatchMountedLifeCycle(c);
        }
      }
    }

    if (hasChanges) BRACKETHTML_CSS_IN_JS.applyLastCSSCreated();

    setTimeout(() => requestAnimationFrameLoop(), timeoutForLoop);
  });
})();
