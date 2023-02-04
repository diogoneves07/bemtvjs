import { SuperComponent } from "../../super-component/super-component";
import SimpleComponent from "../simple-component";
import { ObserverSystem } from "../observers-system";

export type SuperComponentDOMListener = {
  listener: string;
  fn: Function;
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
  lifeCycles: Map<string, ((c: SimpleComponent) => void)[]>;
  removeDOMListeners: Map<SuperComponentDOMListener, (() => void)[]>;
  simpleComponentRunning: SimpleComponent | null;
  simpleComponents: Set<SimpleComponent>;
  $disableProxies: boolean;
  sCompProxy: SuperComponent;
  disableVarsProxies(): void;
  activateVarsProxies(): void;
  routeOptions?: { title?: string; concat?: string };
  onInstObservers: ObserverSystem<(c: SimpleComponent) => void>;
}
