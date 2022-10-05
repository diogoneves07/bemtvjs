import { TAG_HOST_NAME } from "./globals";
import { ALL_COMPONENTS_MANAGER } from "./components-manager-nodes";
import { ComponentThis } from "./components-this";
import { getComponentsGlobalProps } from "./components-global-props";
import { ComponentTemplateCallback } from "./component";

export type TemplateCallback = () => string;

const AVOIDS_EMPTY_TEMPLATE = "&nbsp;";
export default class ComponentManager {
  componentThis: ComponentThis;
  key: string;
  id: number;
  lastTemplateValue: string;
  nodes: Node[];
  getCurrentTemplate: TemplateCallback;

  constructor(
    componentThis: ComponentThis,
    callbackOrText: ComponentTemplateCallback | string
  ) {
    const isResultFn = typeof callbackOrText === "function";
    const getCurrentTemplate = isResultFn
      ? () => AVOIDS_EMPTY_TEMPLATE + callbackOrText(getComponentsGlobalProps())
      : () => AVOIDS_EMPTY_TEMPLATE + callbackOrText;

    this.id = ALL_COMPONENTS_MANAGER.length;

    this.key = `bh${this.id}`;

    this.componentThis = componentThis;

    this.nodes = [];

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
  updateLastTemplateValue() {
    this.lastTemplateValue = this.getCurrentTemplate();
  }
  shouldTemplateBeUpdate() {
    return this.lastTemplateValue !== this.getCurrentTemplate();
  }
}
