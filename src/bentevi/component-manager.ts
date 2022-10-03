import { TAG_HOST_NAME } from "./globals";
import { ALL_COMPONENTS_MANAGER } from "./components-manager-nodes";
import { ComponentThis } from "./components-this";

export type TemplateCallback = () => string;

export default class ComponentManager {
  protected __getCurrentTemplate: TemplateCallback;

  componentThis: ComponentThis;
  key: string;
  id: number;
  lastTemplateValue: string;
  nodes: Node[];

  constructor(
    componentThis: ComponentThis,
    callbackOrText: TemplateCallback | string
  ) {
    const isResultFn = typeof callbackOrText === "function";
    const getCurrentTemplate = isResultFn
      ? callbackOrText
      : () => callbackOrText;

    this.id = ALL_COMPONENTS_MANAGER.length;

    this.key = `bh${this.id}`;

    this.componentThis = componentThis;

    this.nodes = [];

    this.__getCurrentTemplate = getCurrentTemplate;
    this.lastTemplateValue = getCurrentTemplate();

    ALL_COMPONENTS_MANAGER.push(this);

    return this;
  }
  getCurrentTemplate() {
    return this.__getCurrentTemplate();
  }
  getCurrentTemplateWithHost() {
    return `${TAG_HOST_NAME}[id = "${
      this.key
    }" ~ ${this.getCurrentTemplate()}]`;
  }
  updateLastTemplateValue() {
    this.lastTemplateValue = this.getCurrentTemplate();
  }
  shouldTemplateBeUpdate() {
    return this.lastTemplateValue !== this.getCurrentTemplate();
  }
}
