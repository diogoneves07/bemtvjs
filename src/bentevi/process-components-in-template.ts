import { LIBRARY_NAME_IN_ERRORS_MESSAGE } from "./../globals";
import ComponentManager from "./component-manager";
import { ComponentThis, getComponentThisProps } from "./components-this";
import { ComponentTemplateCallback, getComponentCallback } from "./component";
import ComponentThisFactory from "./component-this-factory";
import normalizeComponentName from "./normalize-component-name";
import getKeyInComponentName from "./get-key-in-component-name";
import getNextComponentDataInTemplate from "./get-next-component-data-in-template";

type RunComponentCallbackReturn =
  | [componentThis: ComponentThis, result: string | ComponentTemplateCallback]
  | [componentThis: undefined, result: string | ComponentTemplateCallback];

type processComponentsResult = [
  result: string,
  componentsThis: ComponentThis[],
  componentsManager: ComponentManager[]
];

function runComponentCallback(
  name: string,
  parent?: ComponentThis
): RunComponentCallbackReturn {
  let result = "";
  const realComponentName = normalizeComponentName(name);

  const componentCallback = getComponentCallback(realComponentName);

  if (!componentCallback)
    throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} The component "${realComponentName}" was not created!`;

  const componentThis = ComponentThisFactory(name, parent);

  if (parent) assignPropsToComponentChild(parent, componentThis);

  result = (componentCallback as any).call(componentThis, componentThis);
  return [componentThis, result];
}

function assignPropsToComponentChild(
  parent: ComponentThis,
  child: ComponentThis
) {
  const childProps = getComponentThisProps(
    parent,
    getKeyInComponentName(child.name)
  );

  if (childProps) {
    (child as any).props = Object.assign(child.props, childProps);
  }
}

function getTemplateWithCurrentPropsValues(
  template: string,
  componentsManager: ComponentManager[]
) {
  let newTemplate = template;

  for (const componentManager of componentsManager) {
    const componentData = getNextComponentDataInTemplate(newTemplate);

    if (!componentData) continue;

    const value = componentManager.getCurrentTemplateWithHost();

    componentManager.updateLastTemplateValue();

    newTemplate = componentData.before + value + componentData.after;
  }

  return newTemplate;
}

function processEachTemplate(
  template: string,
  parent?: ComponentThis
): [result: string, componentsManager: ComponentManager[]] {
  const componentsManager: ComponentManager[] = [];

  let newTemplate = template;
  let componentData: ReturnType<typeof getNextComponentDataInTemplate>;

  while ((componentData = getNextComponentDataInTemplate(newTemplate))) {
    const [componentThis, result] = runComponentCallback(
      componentData.name,
      parent
    );

    if (!componentThis) continue;

    componentThis.children = componentData.children;

    const componentManager = new ComponentManager(componentThis, result);

    componentsManager.push(componentManager);

    const currentTemplate = componentManager.getCurrentTemplateWithHost();

    const [componentTemlate, m] = processEachTemplate(
      currentTemplate,
      componentThis
    );

    componentsManager.push(...m);

    newTemplate = componentData.before + componentTemlate + componentData.after;
  }

  return [newTemplate, componentsManager];
}

export default function processComponentsInTemplate(
  template: string,
  firstParent?: ComponentThis
): processComponentsResult {
  const [, componentsManager] = processEachTemplate(template, firstParent);

  const newTemplate = getTemplateWithCurrentPropsValues(
    template,
    componentsManager
  );
  const componentsThis = componentsManager.map((o) => o.componentThis);

  return [newTemplate, componentsThis, componentsManager];
}
