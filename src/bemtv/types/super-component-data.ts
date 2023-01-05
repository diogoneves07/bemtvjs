import { SuperComponent } from "../super-component/super-component";
import ComponentInst from "../component-inst";

export type SuperComponentDOMListener = {
  type: string;
  callback: Function;
  options?: AddEventListenerOptions;
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
  componentsInst: Set<ComponentInst>;
  $disableProxies: boolean;
  fns: [fn: string, args: any[]][];
  sCompProxy: SuperComponent;
  disableVarsProxies(): void;
  activateVarsProxies(): void;
  isSigleInstance: boolean;
  routeOptions?: { title?: string; concat?: string };
}
