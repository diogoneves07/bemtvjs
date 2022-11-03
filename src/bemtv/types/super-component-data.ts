import { ComponentThis } from "../components-this";
import { LifeCycleCallback } from "./component-this-data";

export type SuperComponentListener = {
  listener: string;
  args: [fn: Function, options: AddEventListenerOptions];
};
export type ComponentProps = {
  vars: Record<string, any>;
  template: SuperComponentData["initialTemplate"];
  templatePropertyValues: Map<string, string>;
};

export interface SuperComponentData {
  componentName: string;
  initVars: Record<string, any>;
  initVarsKeys: string[];
  initialTemplate: () => string;
  listeners: Set<SuperComponentListener>;
  lifeCycles: Map<string, LifeCycleCallback[]>;
  removeListeners: Map<SuperComponentListener, (() => void)[]>;
  componentRunning: ComponentThis | null;
  components: Map<ComponentThis, ComponentProps>;
  $disableProxy: Boolean;
  classes: string[];
  fns: [fn: string, args: any[]][];
}
