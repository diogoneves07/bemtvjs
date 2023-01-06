import { AVOIDS_EMPTY_TEMPLATE, TAG_HOST_NAME } from "./globals";
import { ComponentTemplateCallback } from "./components-main";
import { ALL_COMPONENTS_INST } from "./component-inst-store";
import normalizeRouterShortcut from "./normalize-router-shortcut";
import { LifeCycleCallback } from "./types/component-inst-data";
import { ObserverSystem } from "./observers-system";

function avoidEmptyTemplate(template: string) {
  return template.trim() === "" ? AVOIDS_EMPTY_TEMPLATE : template;
}

export type TemplateCallback = () => string;

let componentsNamesList: string = "";
export default class ComponentInst {
  parentElement: Element | null = null;
  lastTemplateValue: string = "";
  getCurrentTemplate: TemplateCallback = () => "";
  updateOnlyAfterThisTime: number;
  shouldForceUpdate: boolean;
  nodes: Node[] = [];
  parent: ComponentInst | null;
  componentsInTemplate: Set<ComponentInst> = new Set();

  mounted: boolean = false;
  inited: boolean = false;
  unmounted: boolean = false;

  onUnmountedObservers = new ObserverSystem<LifeCycleCallback>();
  onMountedObservers = new ObserverSystem<LifeCycleCallback>();
  onInitObservers = new ObserverSystem<LifeCycleCallback>();
  onUpdatedObservers = new ObserverSystem<LifeCycleCallback>();

  componentVarsCache = new Map<string, string>();
  removeFirstElementDOMListeners = new Map();
  componentVars?: Record<string, any>;
  template?: () => string;

  readonly name: string;

  key: string;

  children: string = "";

  hostAttrName: string;

  constructor(name: string, parent: ComponentInst | null) {
    this.name = name;

    this.parent = parent;

    const count = componentsNamesList.split(name).length - 1;

    // Tem que tomar couidado com os : porque isso vai se transformar em atributo
    this.key = count > 0 ? name + "-" + count : name;

    this.key = this.key.replace(":", "-");

    componentsNamesList += ` ${name} `;

    this.hostAttrName = `bemtv-${this.key.toLowerCase()}`;

    this.shouldForceUpdate = false;

    this.updateOnlyAfterThisTime = 0;

    ALL_COMPONENTS_INST.add(this);
  }

  defineComponentTemplate(callbackOrText: ComponentTemplateCallback | string) {
    const isResultFn = typeof callbackOrText === "function";
    const useTemplate = isResultFn ? callbackOrText : () => callbackOrText;

    const getCurrentTemplate = () => {
      const timeBeforeGenarateTemaplate = Date.now();
      const template = avoidEmptyTemplate(useTemplate());
      const timeAfterGenarateTemaplate = Date.now();

      this.updateOnlyAfterThisTime =
        timeAfterGenarateTemaplate +
        (timeAfterGenarateTemaplate - timeBeforeGenarateTemaplate);

      return template;
    };

    this.getCurrentTemplate = getCurrentTemplate;
    this.lastTemplateValue = getCurrentTemplate();
    return this;
  }

  getCurrentTemplateWithHost() {
    return `${TAG_HOST_NAME}[id = "${
      this.hostAttrName
    }" ~ ${normalizeRouterShortcut(this.getCurrentTemplate())}]`;
  }

  updateLastTemplateValueProperty() {
    this.lastTemplateValue = this.getCurrentTemplate();
    return this;
  }

  shouldTemplateBeUpdate() {
    const shouldForceUpdate = this.shouldForceUpdate;
    let check = false;

    if (shouldForceUpdate) {
      this.shouldForceUpdate = false;
      return true;
    }
    if (Date.now() >= this.updateOnlyAfterThisTime) {
      check = this.lastTemplateValue !== this.getCurrentTemplate();
    }
    return check;
  }

  forceTemplateUpdate() {
    this.shouldForceUpdate = true;
    return this;
  }

  addComponentChild(c: ComponentInst) {
    this.componentsInTemplate.add(c);
    return this;
  }

  hasComponentChild(c: ComponentInst) {
    return this.componentsInTemplate.has(c);
  }

  getChildComponents() {
    return this.componentsInTemplate;
  }

  clearComponentsInTemplateList() {
    this.componentsInTemplate.clear();
    return this;
  }

  onInit(fn: () => void) {
    if (this.inited) return fn();

    this.onInitObservers.add(fn);

    return this;
  }

  onMountWithHighPriority(fn: () => void) {
    if (this.mounted) return fn();

    this.onMountedObservers.addWithPriority(fn);
    return this;
  }

  onMount(fn: () => void) {
    if (this.mounted) return fn();

    this.onMountedObservers.add(fn);

    return this;
  }

  onUnmount(fn: () => void) {
    if (this.unmounted) return fn();

    this.onUnmountedObservers.add(fn);
    return this;
  }

  onUpdateWithHighPriority(fn: () => void) {
    this.onUpdatedObservers.addWithPriority(fn);
    return this;
  }

  onUpdate(fn: () => void) {
    this.onUpdatedObservers.add(fn);
    return this;
  }
}
