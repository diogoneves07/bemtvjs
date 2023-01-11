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

export default function processUpdatedTemplate(
  componentInst: ComponentInst,
  lastComponentsInTemplate: ComponentInst[]
) {
  const newComponentsInst: ComponentInst[] = [];

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

    const { newTemplate: componentTemlate, componentsInst } =
      processComponentsInTemplate(`${name}[${children}]`, componentInst);

    newComponentsInst.push(...componentsInst);

    template = before + componentTemlate + after;
  }

  return { template, newComponentsInst };
}
