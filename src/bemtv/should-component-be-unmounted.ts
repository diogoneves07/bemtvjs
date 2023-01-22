import SimpleComponent from "./simple-component";
import { ALL_SIMPLE_COMPONENTS } from "./simple-component-store";
import { dispatchUnmountedLifeCycle } from "./components-lifecycle";

export default function shouldComponentBeUnmounted(
  simpleComponent: SimpleComponent
) {
  if (!simpleComponent.parent) return false;

  if (
    !simpleComponent.parent.unmounted &&
    simpleComponent.parent.hasComponentChild(simpleComponent)
  ) {
    return false;
  }

  ALL_SIMPLE_COMPONENTS.delete(simpleComponent);

  dispatchUnmountedLifeCycle(simpleComponent);

  return true;
}
