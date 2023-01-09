import {
  autoImportComponent,
  isComponentAlreadyImported,
  isComponentAutoImport,
} from "./auto-import-components";
import ComponentInst from "./component-inst";
import {
  getComponentDataByName,
  getTopLevelComponentsName,
} from "./get-next-component-data-in-template";
import processComponentsInTemplate from "./process-components-in-template";

type UpdatedTemplateObject = {
  template: string;
  newComponentsInst: ComponentInst[];
};

export default function processUpdatedTemplate(
  componentInst: ComponentInst
): UpdatedTemplateObject | false {
  const childComponents = [...componentInst.getChildComponents()];
  const newComponentsInst: ComponentInst[] = [];
  const lastTemplateValue = componentInst.lastTemplateValue;

  let template = componentInst.getCurrentTemplateWithHost();

  componentInst.updateLastTemplateValueProperty();
  componentInst.clearComponentsInTemplateList();

  const topLevelComponentsName = getTopLevelComponentsName(template);

  for (const name of topLevelComponentsName) {
    const { children, after, before } = getComponentDataByName(name, template);

    const index = childComponents.findIndex((o) => o.nameInTemplate === name);

    if (index > -1) {
      const childComponent = childComponents[index];
      let value = childComponent.lastTemplateProcessed;

      if (childComponent.shouldTemplateBeUpdate()) {
        const r = processUpdatedTemplate(childComponent);
        value = r ? r.template : value;
      }

      template = before + value + after;

      componentInst.addComponentChild(childComponent);

      continue;
    }

    if (!isComponentAlreadyImported(name) && isComponentAutoImport(name)) {
      componentInst.forceTemplateUpdate();

      if (!autoImportComponent(name, lastTemplateValue)) return false;
    }

    const { newTemplate: componentTemlate, componentsInst } =
      processComponentsInTemplate(`${name}[${children}]`, componentInst);

    newComponentsInst.push(...componentsInst);

    template = before + componentTemlate + after;
  }

  return { template, newComponentsInst };
}
