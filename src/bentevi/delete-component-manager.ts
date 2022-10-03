import ComponentManager from "./component-manager";
import { removeRelativeInstance } from "./component-relative-instances";
import { ALL_COMPONENTS_MANAGER } from "./components-manager-nodes";

export default function deleteComponentManager(
  componentManager: ComponentManager
) {
  const i = ALL_COMPONENTS_MANAGER.indexOf(componentManager);

  if (i === -1) return;

  ALL_COMPONENTS_MANAGER.splice(i, 1);
  removeRelativeInstance(componentManager);
}
