import { AVOIDS_EMPTY_TEMPLATE, TAG_HOST_NAME } from "./globals";
import { ALL_SIMPLE_COMPONENTS } from "./simple-component-store";
import normalizeRouterShortcut from "./normalize-router-shortcut";
import { LifeCycleCallback } from "./types/simple-component-data";
import { ObserverSystem } from "./observers-system";
import { SuperComponent } from "../super-component/super-component";

export type TemplateCallback = () => string;

export type ComponentTemplateCallback = () => string;

let componentsNamesList: string = "";

function keepNodesOnly(
  nodesAndComponents: (Node | string)[],
  components: SimpleComponent[]
): Node[] {
  const nodes: Node[] = [];

  for (const n of nodesAndComponents) {
    if (typeof n !== "string") {
      nodes.push(n);
      continue;
    }

    const normalize = components.find((c) => c.hostIdValue === n);

    if (!normalize) continue;

    nodes.push(...(normalize.nodesAndComponents as Node[]));
  }

  if (nodes.find((v) => typeof v === "string")) {
    return keepNodesOnly(nodes, components);
  }

  return nodes;
}
export default class SimpleComponent {
  parentElement: Element | null = null;
  lastTemplateValue: string = "";
  getCurrentTemplate: TemplateCallback = () => "";
  nodesAndComponents: (Node | string)[] = [];
  parent: SimpleComponent | null;
  componentsInTemplate: Set<SimpleComponent> = new Set();

  superComponent?: SuperComponent<Record<string, any>>;

  lastTemplateProcessed: string = "";

  isImportingComponent: boolean = false;

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

  readonly name: string;

  key: string;

  children: string = "";

  hostIdValue: string;

  nameInTemplate: string;

  constructor(
    name: string,
    parent: SimpleComponent | null,
    nameInTemplate: string
  ) {
    this.name = name;

    this.nameInTemplate = nameInTemplate;

    this.parent = parent;

    const count = componentsNamesList.split(name).length - 1;

    this.key = count > 0 ? name + "-" + count : name;

    componentsNamesList += ` ${name} `;

    this.hostIdValue = this.key.toLowerCase();

    ALL_SIMPLE_COMPONENTS.add(this);
  }

  defineComponentTemplate(callbackOrText: ComponentTemplateCallback | string) {
    const isResultFn = typeof callbackOrText === "function";
    const useTemplate = isResultFn ? callbackOrText : () => callbackOrText;

    const getCurrentTemplate = () => {
      const template = AVOIDS_EMPTY_TEMPLATE + useTemplate();

      return template;
    };

    this.getCurrentTemplate = getCurrentTemplate;
    this.lastTemplateValue = getCurrentTemplate();
    return this;
  }

  getCurrentTemplateWithHost() {
    return `${TAG_HOST_NAME}[id = "${
      this.hostIdValue
    }" ~ ${normalizeRouterShortcut(this.getCurrentTemplate())}]`;
  }

  updateLastTemplateValueProperty() {
    this.lastTemplateValue = this.getCurrentTemplate();
    return this;
  }

  shouldTemplateBeUpdate() {
    return this.lastTemplateValue !== this.getCurrentTemplate();
  }

  forceTemplateUpdate() {
    this.lastTemplateValue = "";
    return this;
  }

  addComponentChild(c: SimpleComponent) {
    this.componentsInTemplate.add(c);
    return this;
  }

  hasComponentChild(c: SimpleComponent) {
    return this.componentsInTemplate.has(c);
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

  onInitWithHighPriority(fn: () => void) {
    if (this.inited) return fn();

    this.onInitObservers.addWithPriority(fn);
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

  getAllNodes() {
    return keepNodesOnly(this.nodesAndComponents, [...ALL_SIMPLE_COMPONENTS]);
  }

  defineNodesParentElement() {
    const nodes = this.getAllNodes();

    if (nodes.length === 0) {
      this.parentElement = this.parent?.parentElement || null;
      return;
    }

    const p = (nodes.find((n) => n.parentElement) as Element) || null;

    this.parentElement = p;
  }
}
