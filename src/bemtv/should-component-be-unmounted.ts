import ComponentInst from "./component-inst";
import { ALL_COMPONENTS_INST } from "./component-inst-store";
import { dispatchUnmountedLifeCycle } from "./components-lifecycle";

export default function shouldComponentBeUnmounted(
  componentInst: ComponentInst
) {
  if (!componentInst.parent) return false;
  if (componentInst.parent.hasComponentChild(componentInst)) return false;

  dispatchUnmountedLifeCycle(componentInst);

  ALL_COMPONENTS_INST.delete(componentInst);

  return true;
}
