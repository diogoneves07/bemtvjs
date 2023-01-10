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
import {
  runInComponentInst,
  updateComponentVars,
} from "./super-component/work-with-super-component";

type UpdatedTemplateObject = {
  template: string;
  newComponentsInst: ComponentInst[];
};

export default function processUpdatedTemplate(
  componentInst: ComponentInst,
  lastComponentsInTemplate: ComponentInst[]
): UpdatedTemplateObject | false {
  const newComponentsInst: ComponentInst[] = [];
  const lastTemplateValue = componentInst.lastTemplateValue;

  let template = componentInst.getCurrentTemplateWithHost();

  const topLevelComponentsName = getTopLevelComponentsName(template);

  for (const name of topLevelComponentsName) {
    const { children, after, before } = getComponentDataByName(name, template);

    const index = lastComponentsInTemplate.findIndex(
      (o) => o.nameInTemplate === name
    );

    if (index > -1) {
      const childComponent = lastComponentsInTemplate[index];
      const s = childComponent.superComponent;

      template = before + childComponent.lastTemplateProcessed + after;

      if (childComponent.children !== children && s) {
        runInComponentInst(s, childComponent, () => {
          s.$.children = children;
          updateComponentVars(s);
        });
      }
      childComponent.children = children;

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
