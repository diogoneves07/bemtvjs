import SimpleComponent from "./simple-component";
import {
  getComponentDataByName,
  getTopLevelComponentsName,
} from "./get-next-component-data-in-template";
import processComponentsInTemplate from "./process-components-in-template";
import {
  runInSimpleComponent,
  updateComponentVars,
} from "./super-component/work-with-super-component";

export default function processUpdatedTemplate(
  simpleComponent: SimpleComponent,
  lastComponentsInTemplate: SimpleComponent[]
) {
  const newSimpleComponents: SimpleComponent[] = [];

  let template = simpleComponent.getCurrentTemplateWithHost();

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
        runInSimpleComponent(s, childComponent, () => {
          s.$.children = children;
          updateComponentVars(s);
        });
      }
      childComponent.children = children;

      simpleComponent.addComponentChild(childComponent);

      continue;
    }

    const { newTemplate: componentTemplate, simpleComponents } =
      processComponentsInTemplate(`${name}[${children}]`, simpleComponent);

    newSimpleComponents.push(...simpleComponents);

    template = before + componentTemplate + after;
  }

  return { template, newSimpleComponents };
}
