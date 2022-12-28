import ComponentInst from "./component-inst";
import getNextComponentDataInTemplate from "./get-next-component-data-in-template";
import processComponentsInTemplate from "./process-components-in-template";

type UpdatedTemplateObject = {
  template: string;
  newComponentsManager: ComponentInst[];
  componentsManagerUpdated: ComponentInst[];
};
export default function processUpdatedTemplate(
  componentInst: ComponentInst
): UpdatedTemplateObject {
  const childComponents = [...componentInst.getChildComponents()];
  const newComponentsManager: ComponentInst[] = [];
  const componentsManagerUpdated: ComponentInst[] = [];

  let template = componentInst.getCurrentTemplateWithHost();

  componentInst.updateLastTemplateValueProperty();
  componentInst.resetComponentsChildContainer();

  let componentData: ReturnType<typeof getNextComponentDataInTemplate>;

  while ((componentData = getNextComponentDataInTemplate(template))) {
    const name = componentData.name;

    const index = childComponents.findIndex((o) => o.name === name);

    if (index > -1) {
      const childComponent = childComponents[index];

      const value = childComponent.getCurrentTemplateWithHost();

      if (childComponent.shouldTemplateBeUpdate()) {
        componentsManagerUpdated.push(childComponent);
        childComponent.updateLastTemplateValueProperty();
      }

      template = componentData.before + value + componentData.after;

      componentInst.addComponentChild(childComponent);

      continue;
    }

    const { newTemplate: componentTemlate, componentsManager } =
      processComponentsInTemplate(
        `${componentData.name}[${componentData.children}]`,
        componentInst
      );

    newComponentsManager.push(...componentsManager);

    template = componentData.before + componentTemlate + componentData.after;
  }

  return { template, newComponentsManager, componentsManagerUpdated };
}
