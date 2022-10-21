import ComponentManager from "./component-manager";
import { ALL_COMPONENTS_MANAGER } from "./component-manager-store";
import { dispatchUnmountedLifeCycle } from "./work-with-components-this";

export default function shouldComponentBeUnmounted(
  componentManager: ComponentManager
) {
  if (!componentManager.parent) return false;
  if (componentManager.parent.hasComponentChild(componentManager)) return false;

  dispatchUnmountedLifeCycle(componentManager.componentThis);

  ALL_COMPONENTS_MANAGER.delete(componentManager);

  return true;
}