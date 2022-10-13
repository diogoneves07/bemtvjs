import { LIBRARY_NAME_IN_ERRORS_MESSAGE } from "./../globals";
import ComponentManager from "./component-manager";
import { ComponentThis } from "./components-this";
import { ComponentFn, getComponentFn } from "./components";
import ComponentThisFactory from "./component-this-factory";
import normalizeComponentName from "./normalize-component-name";
import getKeyInComponentName from "./get-key-in-component-name";
import getNextComponentDataInTemplate from "./get-next-component-data-in-template";
import { getComponentThisProps } from "./work-with-components-this";
import {
  autoImportComponent,
  isComponentAlreadyImported,
  isComponentAutoImport,
} from "./auto-import-components";

type processComponentsResult = [
  result: string,
  componentsThis: ComponentThis[],
  componentsManager: ComponentManager[]
];

type NextComponentData = ReturnType<typeof getNextComponentDataInTemplate>;

function assignPropsToComponentChild(
  child: ComponentThis,
  componentName: string,
  parent: ComponentThis
) {
  const childProps = getComponentThisProps(
    parent,
    getKeyInComponentName(componentName)
  );

  if (childProps) {
    Object.assign(child.props, childProps);
  }
}

function getTemplateWithCurrentPropsValues(
  template: string,
  componentsManager: ComponentManager[]
) {
  let newTemplate = template;
  let componentData: NextComponentData;
  let count = 0;

  while ((componentData = getNextComponentDataInTemplate(newTemplate))) {
    const name = componentData.name;
    const componentManager = componentsManager[count];

    if (!isComponentAlreadyImported(normalizeComponentName(name))) {
      newTemplate = componentData.before + componentData.after;
      continue;
    }

    const value = componentManager.getCurrentTemplateWithHost();

    componentManager.updateLastTemplateValueProperty();

    newTemplate = componentData.before + value + componentData.after;

    count++;
  }

  return newTemplate;
}

function processEachTemplate(
  template: string,
  componentsManager: ComponentManager[],
  parent?: ComponentThis
): ComponentManager[] {
  let newTemplate = template;
  let componentData: NextComponentData;

  while ((componentData = getNextComponentDataInTemplate(newTemplate))) {
    const { name, children, before, after } = componentData;
    const realComponentName = normalizeComponentName(name);

    if (!isComponentAlreadyImported(realComponentName)) {
      newTemplate = componentData.before + componentData.after;

      if (isComponentAutoImport(realComponentName)) {
        autoImportComponent(realComponentName);
        continue;
      }

      throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} The component "${realComponentName}" was not created!`;
    }

    const componentFn = getComponentFn(realComponentName) as ComponentFn;
    const componentThis = ComponentThisFactory(realComponentName, parent);

    componentThis.children = children;

    if (parent) assignPropsToComponentChild(componentThis, name, parent);

    const result = componentFn(componentThis);

    const componentManager = new ComponentManager(componentThis, result);

    componentsManager.push(componentManager);

    processEachTemplate(
      componentManager.getCurrentTemplateWithHost(),
      componentsManager,
      componentThis
    );

    newTemplate = before + after;
  }

  return componentsManager;
}

export default function processComponentsInTemplate(
  template: string,
  firstParent?: ComponentThis
): processComponentsResult {
  const componentsManager = processEachTemplate(template, [], firstParent);

  const newTemplate = getTemplateWithCurrentPropsValues(
    template,
    componentsManager
  );

  const componentsThis = componentsManager.map((o) => o.componentThis);

  return [newTemplate, componentsThis, componentsManager];
}
