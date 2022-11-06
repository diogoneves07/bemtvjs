import { AVOIDS_EMPTY_TEMPLATE, LIBRARY_NAME, TAG_HOST_NAME } from "./globals";
import { ComponentTemplateCallback } from "./components-main";
import { ALL_COMPONENTS_INST } from "./component-inst-store";
import normalizeRouterShortcut from "./normalize-router-shortcut";
import { LifeCycleCallback, Props } from "./types/component-inst-data";
import { ComponentListener } from "./types/listeners";
import reshareProps from "./reshare-props";
import useSharedProp from "./use-shared-prop";

function avoidEmptyTemplate(template: string) {
  return template.trim() === "" ? AVOIDS_EMPTY_TEMPLATE : template;
}

export type TemplateCallback = () => string;

export default class ComponentInst {
  key: string;
  lastTemplateValue: string = "";
  getCurrentTemplate: TemplateCallback = () => "";
  updateOnlyAfterThisTime: number;
  shouldForceUpdate: boolean;
  nodes: Node[] = [];
  parent: ComponentInst | null;
  componentsInTemplate: Set<ComponentInst> = new Set();

  propsDefined?: Map<string, Props>;
  unmountedFns?: Set<LifeCycleCallback>;
  mounted: boolean = false;
  sharedData: Record<string, any> = {};
  listeners = new Set<ComponentListener>();
  mountedFns = new Set<LifeCycleCallback>();
  initFns = new Set<LifeCycleCallback>();
  updatedFns = new Set<LifeCycleCallback>();

  /** The component properties */
  readonly props: Props = {};
  /** The component properties */
  readonly name: string;

  /** The component children */
  children: string = "";

  constructor(name: string, parent: ComponentInst | null) {
    this.key = `${LIBRARY_NAME}${ALL_COMPONENTS_INST.size}`;

    this.name = name;

    this.parent = parent;

    this.shouldForceUpdate = false;

    this.updateOnlyAfterThisTime = 0;

    ALL_COMPONENTS_INST.add(this);

    return this;
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
  }
  getCurrentTemplateWithHost() {
    return `${TAG_HOST_NAME}[id = "${this.key}" ~ ${normalizeRouterShortcut(
      this.getCurrentTemplate()
    )}]`;
  }
  updateLastTemplateValueProperty() {
    this.lastTemplateValue = this.getCurrentTemplate();
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
  addComponentChild(c: ComponentInst) {
    this.componentsInTemplate.add(c);
  }
  hasComponentChild(c: ComponentInst) {
    return this.componentsInTemplate.has(c);
  }
  getChildComponents() {
    return this.componentsInTemplate;
  }
  resetComponentsChildContainer() {
    this.componentsInTemplate.clear();
  }

  share<T extends Record<string, any>>(o: T) {
    Object.assign(this.sharedData, o);
  }

  reshare<T extends Record<string, any>>(o: T) {
    reshareProps(this, o);
  }

  use<ReturnType = any>(key: string) {
    return useSharedProp(this, key) as ReturnType;
  }

  onInit(fn: () => void) {
    this.initFns.add(fn);
    return this;
  }

  onMount(fn: () => void) {
    this.mountedFns.add(fn);
    return this;
  }

  onUnmount(fn: () => void) {
    if (!this.unmountedFns) this.unmountedFns = new Set();
    this.unmountedFns.add(fn);
    return this;
  }

  onUpdate(fn: () => void) {
    this.updatedFns.add(fn);
    return this;
  }
}
