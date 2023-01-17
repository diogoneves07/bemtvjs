import { SuperComponent } from "../super-component/super-component";
import ComponentInst from "../component-inst";
import { ObserverSystem } from "../observers-system";

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
  sCompProxy: SuperComponent;
  disableVarsProxies(): void;
  activateVarsProxies(): void;
  isSigleInstance: boolean;
  routeOptions?: { title?: string; concat?: string };
  onInstObservers: ObserverSystem<(c: ComponentInst) => void>;
}
