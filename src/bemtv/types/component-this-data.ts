import { ComponentThis } from "../components-this";
import { ComponentListener } from "./listeners";

export type Props = Record<string, any>;
export type LifeCycleCallback = () => void;

export interface ComponentThisData {
  listeners: Set<ComponentListener>;
  firstElement: Element | null;
  defineFirstElement: (node: Element | null) => void;
  propsDefined?: Map<string, Props>;
  mountedFns: Set<LifeCycleCallback>;
  initFns: Set<LifeCycleCallback>;
  unmountedFns?: Set<LifeCycleCallback>;
  updatedFns: Set<LifeCycleCallback>;
  mounted: boolean;
  sharedData: Record<string, any>;
  parent: ComponentThis | null;
}
