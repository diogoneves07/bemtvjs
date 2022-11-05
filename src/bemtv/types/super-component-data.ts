import { Props } from "./component-inst-data";
import { ComponentInst } from "../components-inst";
import { SuperComponent } from "../super-component/super-component";

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
  lifeCycles: Map<string, ((c: ComponentInst) => void)[]>;
  removeListeners: Map<SuperComponentListener, (() => void)[]>;
  componentRunning: ComponentInst | null;
  components: Map<ComponentInst, ComponentProps>;
  $disableProxy: Boolean;
  classes: string[];
  fns: [fn: string, args: any[]][];
  sCompProxy: SuperComponent;
  propsDefined?: Map<string, Props>;
}
