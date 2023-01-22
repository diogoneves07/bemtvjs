import { ALL_SIMPLE_COMPONENTS } from "./simple-component-store";
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
  for (const simpleComponent of ALL_SIMPLE_COMPONENTS) {
    if (!simpleComponent.parentElement) {
      continue;
    }

    if (!simpleComponent.shouldTemplateBeUpdate()) {
      shouldComponentBeUnmounted(simpleComponent);
      continue;
    }

    hasChanges = true;

    shouldComponentBeUnmounted(simpleComponent);

    const updatedUI = updatedUIWithNewTemplate(simpleComponent);
    requestAnimationFrame(() => {
      if (updatedUI) {
        const {
          newSimpleComponents,
          componentsNodes,
          simpleComponentsUpdated,
        } = updatedUI;

        for (const c of simpleComponentsUpdated) {
          // Checks if the component intends to update naturally.
          if (!c.shouldTemplateBeUpdate()) {
            c.updateLastTemplateValueProperty();

            dispatchUpdatedLifeCycle(c);
          }
        }

        for (const c of newSimpleComponents) {
          c.nodesAndComponents = componentsNodes.get(c.hostIdValue) || [];

          dispatchMountedLifeCycle(c);
        }
      }
    });
  }

  if (hasChanges) BRACKETHTML_CSS_IN_JS.applyLastCSSCreated();
}

requestAnimationFrame(requestAnimationFrameLoop);

setInterval(
  () => requestAnimationFrame(requestAnimationFrameLoop),
  timeoutForLoop
);
