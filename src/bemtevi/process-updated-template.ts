import ComponentManager from "./component-manager";
import { getRelativeInstances } from "./component-relative-instances";
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
  let template = componentManager.getCurrentTemplateWithHost();
  let relativeInstances = getRelativeInstances(componentManager)?.slice();

  const newComponentsManager: ComponentManager[] = [];
  let componentsManagerUpdated: ComponentManager[] = [];

  if (!relativeInstances)
    return { template, newComponentsManager, componentsManagerUpdated };

  let componentData: ReturnType<typeof getNextComponentDataInTemplate>;

  while ((componentData = getNextComponentDataInTemplate(template))) {
    const name = componentData.name;

    const index = relativeInstances.findIndex(
      (o) => o.componentThis.name === name
    );

    if (index > -1) {
      const relativeInstance = relativeInstances[index];

      const value = relativeInstance.getCurrentTemplateWithHost();

      if (relativeInstance.shouldTemplateBeUpdate()) {
        componentsManagerUpdated.push(relativeInstance);
        relativeInstance.updateLastTemplateValueProperty();
      }

      template = componentData.before + value + componentData.after;

      relativeInstances.splice(index, 1);
      continue;
    }

    const [componentTemlate, , componentsManager] = processComponentsInTemplate(
      `${componentData.name}[${componentData.children}]`,
      componentManager.componentThis
    );

    newComponentsManager.push(...componentsManager);

    template = componentData.before + componentTemlate + componentData.after;
  }

  return { template, newComponentsManager, componentsManagerUpdated };
}
