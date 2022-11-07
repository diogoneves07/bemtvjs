import ComponentInst from "../component-inst";
import { ComponentListener } from "./listeners";

export type Props = Record<string, any>;
export type LifeCycleCallback = () => void;

export interface ComponentInstData {
  listeners: Set<ComponentListener>;
  propsDefined?: Map<string, Props>;
  mountedCallbacks: Set<LifeCycleCallback>;
  initCallbacks: Set<LifeCycleCallback>;
  unmountedCallbacks?: Set<LifeCycleCallback>;
  updatedCallbacks: Set<LifeCycleCallback>;
  mounted: boolean;
  sharedData: Record<string, any>;
  parent: ComponentInst | null;
}
