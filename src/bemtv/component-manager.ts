import { LIBRARY_NAME, TAG_HOST_NAME } from "./globals";
import { ALL_COMPONENTS_MANAGER } from "./components-manager-nodes";
import { ComponentThis } from "./components-this";
import { ComponentTemplateCallback } from "./components";

export type TemplateCallback = () => string;

const AVOIDS_EMPTY_TEMPLATE = " &nbsp; ";

function avoidEmptyTemplate(template: string) {
  return template.trim() === "" ? AVOIDS_EMPTY_TEMPLATE : template;
}

export default class ComponentManager {
  componentThis: ComponentThis;
  key: string;
  lastTemplateValue: string;
  nodes: Node[];
  getCurrentTemplate: TemplateCallback;
  updateOnlyAfterThisTime: number;
  shouldForceUpdate: boolean;
  constructor(
    componentThis: ComponentThis,
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

    this.nodes = [];
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
}
