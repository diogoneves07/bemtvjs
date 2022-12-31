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
  template: SuperComponentData["componentsTemplate"];
  componentVarsCache: Map<string, string>;
  removeFirstElementDOMListeners: Map<SuperComponentDOMListener, () => void>;
};

export interface SuperComponentData {
  componentName: string;
  componentsInitVars: Record<string, any>;
  componentsVarsKeys: string[];
  componentsTemplate: () => string;
  isTemplateFunction: boolean;
  templateHasAlreadyBeenDefined: boolean;
  DOMListeners: Set<SuperComponentDOMListener>;
  lifeCycles: Map<string, ((c: ComponentInst) => void)[]>;
  removeDOMListeners: Map<SuperComponentDOMListener, (() => void)[]>;
  componentInstRunning: ComponentInst | null;
  componentsInst: Map<ComponentInst, ComponentProps>;
  $disableProxies: boolean;
  firstElementCSSClasses: Set<string>;
  fns: [fn: string, args: any[]][];
  sCompProxy: SuperComponent;
  propsDefined?: Map<string, Props>;
  disableVarsProxies(): void;
  activateVarsProxies(): void;
  isSigleInstance: boolean;
  routeOptions?: { title?: string; concat?: string };
}
