import { AVOIDS_EMPTY_TEMPLATE, LIBRARY_NAME, TAG_HOST_NAME } from "./globals";
import { ALL_COMPONENTS_MANAGER } from "./components-manager-nodes";
import { ComponentThis } from "./components-this";
import { ComponentTemplateCallback } from "./components";

export type TemplateCallback = () => string;

function avoidEmptyTemplate(template: string) {
  return template.trim() === "" ? AVOIDS_EMPTY_TEMPLATE : template;
}

export default class ComponentManager {
  componentThis: ComponentThis;
  key: string;
  lastTemplateValue: string;
  getCurrentTemplate: TemplateCallback;
  updateOnlyAfterThisTime: number;
  shouldForceUpdate: boolean;

  nodes: Node[] = [];
  parent: ComponentManager | null;
  componentsInTemplate: Set<ComponentManager> = new Set();

  constructor(
    componentThis: ComponentThis,
    parent: ComponentManager | null,
    callbackOrText: ComponentTemplateCallback | string
  ) {
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

    this.key = `${LIBRARY_NAME}${ALL_COMPONENTS_MANAGER.length}`;

    this.componentThis = componentThis;

    this.parent = parent;

    this.shouldForceUpdate = false;

    this.updateOnlyAfterThisTime = 0;

    this.getCurrentTemplate = getCurrentTemplate;
    this.lastTemplateValue = getCurrentTemplate();

    ALL_COMPONENTS_MANAGER.push(this);

    return this;
  }

  getCurrentTemplateWithHost() {
    return `${TAG_HOST_NAME}[id = "${
      this.key
    }" ~ ${this.getCurrentTemplate()}]`;
  }
  updateLastTemplateValueProperty() {
    this.lastTemplateValue = this.getCurrentTemplate();
  }
  shouldTemplateBeUpdate() {
    const shouldForceUpdate = this.shouldForceUpdate;

    if (shouldForceUpdate) {
      this.shouldForceUpdate = false;
      return true;
    }

    return Date.now() > this.updateOnlyAfterThisTime
      ? this.lastTemplateValue !== this.getCurrentTemplate()
      : false;
  }
  addComponentChild(c: ComponentManager) {
    this.componentsInTemplate.add(c);
  }
  hasComponentChild(c: ComponentManager) {
    return this.componentsInTemplate.has(c);
  }
  resetComponentsChildContainer() {
    this.componentsInTemplate.clear();
  }
}