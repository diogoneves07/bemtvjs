import { ALL_COMPONENTS_INST } from "./component-inst-store";
import { setComponentManagerNodes } from "./components-inst-nodes";
import updatedUIWithNewTemplate from "./update-ui-with-new-template";
import {
  dispatchMountedLifeCycle,
  dispatchUpdatedLifeCycle,
} from "./components-lifecycle";
import { BRACKETHTML_CSS_IN_JS } from "../brackethtml/globals";
import shouldComponentBeUnmounted from "./should-component-be-unmounted";

const framesLimit = 20;

const timeoutForLoop = 1000 / framesLimit;

function requestAnimationFrameLoop() {
  let hasChanges = false;
  for (const componentInst of ALL_COMPONENTS_INST) {
    if (!componentInst.parentElement) {
      continue;
    }

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
        if (keysAndNodes[c.name]) {
          setComponentManagerNodes(c.name, keysAndNodes[c.name]);
        }
        dispatchMountedLifeCycle(c);
      }
    }
  }

  if (hasChanges) BRACKETHTML_CSS_IN_JS.applyLastCSSCreated();
}

requestAnimationFrame(requestAnimationFrameLoop);

setInterval(
  () => requestAnimationFrame(requestAnimationFrameLoop),
  timeoutForLoop
);
