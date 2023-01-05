import ComponentInst from "../component-inst";
import { ComponentListener } from "./listeners";

export type LifeCycleCallback = () => void;

export interface ComponentInstData {
  listeners: Set<ComponentListener>;
  onMountedObservers: Set<LifeCycleCallback>;
  onInitObservers: Set<LifeCycleCallback>;
  onUnmountedObservers?: Set<LifeCycleCallback>;
  onUpdatedObservers: Set<LifeCycleCallback>;
  mounted: boolean;
  sharedData: Record<string, any>;
  parent: ComponentInst | null;
}
