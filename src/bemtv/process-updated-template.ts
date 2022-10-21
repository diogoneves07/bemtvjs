import ComponentManager from "./component-manager";
import getNextComponentDataInTemplate from "./get-next-component-data-in-template";
import processComponentsInTemplate from "./process-components-in-template";

type UpdatedTemplateObject = {
  template: string;
  newComponentsManager: ComponentManager[];
  componentsManagerUpdated: ComponentManager[];
};
export default function processUpdatedTemplate(
  componentManager: ComponentManager
): UpdatedTemplateObject {
  const childComponents = [...componentManager.getChildComponents()];
  const newComponentsManager: ComponentManager[] = [];
  const componentsManagerUpdated: ComponentManager[] = [];

  let template = componentManager.getCurrentTemplateWithHost();

  componentManager.updateLastTemplateValueProperty();
  componentManager.resetComponentsChildContainer();

  let componentData: ReturnType<typeof getNextComponentDataInTemplate>;

  while ((componentData = getNextComponentDataInTemplate(template))) {
    const name = componentData.name;

    const index = childComponents.findIndex(
      (o) => o.componentThis.name === name
    );

    if (index > -1) {
      const childComponent = childComponents[index];

      const value = childComponent.getCurrentTemplateWithHost();

      if (childComponent.shouldTemplateBeUpdate()) {
        componentsManagerUpdated.push(childComponent);
        childComponent.updateLastTemplateValueProperty();
      }

      template = componentData.before + value + componentData.after;

      componentManager.addComponentChild(childComponent);

      continue;
    }

    const {
      newTemplate: componentTemlate,
      componentsManager,
      dynamicImportComponents,
    } = processComponentsInTemplate(
      `${componentData.name}[${componentData.children}]`,
      componentManager
    );

    if (dynamicImportComponents.length > 0) {
      componentManager.shouldForceUpdate = true;
    }

    newComponentsManager.push(...componentsManager);

    template = componentData.before + componentTemlate + componentData.after;
  }

  return { template, newComponentsManager, componentsManagerUpdated };
}
