import SimpleComponent from "../simple-component";
import { SimpleComponentDOMListener } from "./listeners";

export type LifeCycleCallback = () => void;

export interface SimpleComponentData {
  listeners: Set<SimpleComponentDOMListener>;
  onMountedObservers: Set<LifeCycleCallback>;
  onInitObservers: Set<LifeCycleCallback>;
  onUnmountedObservers?: Set<LifeCycleCallback>;
  onUpdatedObservers: Set<LifeCycleCallback>;
  mounted: boolean;
  sharedData: Record<string, any>;
  parent: SimpleComponent | null;
}
