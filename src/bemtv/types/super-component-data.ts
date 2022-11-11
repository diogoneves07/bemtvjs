import { Props } from "./component-inst-data";
import { SuperComponent } from "../super-component/super-component";
import ComponentInst from "../component-inst";

export type SuperComponentDOMListener = {
  type: string;
  callback: Function;
  options?: AddEventListenerOptions;
};
export type ComponentProps = {
  vars: Record<string, any>;
  template: SuperComponentData["initialTemplate"];
  componentVarsCache: Map<string, string>;
  removeFirstElementDOMListeners: Map<SuperComponentDOMListener, () => void>;
};

export interface SuperComponentData {
  componentName: string;
  componentsInitVars: Record<string, any>;
  componentsVarsKeys: string[];
  initialTemplate: () => string;
  DOMListeners: Set<SuperComponentDOMListener>;
  lifeCycles: Map<string, ((c: ComponentInst) => void)[]>;
  removeDOMListeners: Map<SuperComponentDOMListener, (() => void)[]>;
  componentRunning: ComponentInst | null;
  components: Map<ComponentInst, ComponentProps>;
  $disableProxies: Boolean;
  classes: string[];
  fns: [fn: string, args: any[]][];
  sCompProxy: SuperComponent;
  propsDefined?: Map<string, Props>;
  disableVarsProxies(): void;
  activateVarsProxies(): void;
}
