import { LIBRARY_NAME_IN_ERRORS_MESSAGE } from "../globals";
import ComponentInst from "./component-inst";
import { ComponentFn, getComponentFn } from "./components-main";
import normalizeComponentName from "./normalize-component-name";
import getNextComponentDataInTemplate from "./get-next-component-data-in-template";
import {
  autoImportComponent,
  isComponentAlreadyImported,
  isComponentAutoImport,
} from "./auto-import-components";
import { usePortal } from "./super-component/portals";

type NextComponentData = ReturnType<typeof getNextComponentDataInTemplate>;

function processEachTemplate(
  template: string,
  componentsInst: ComponentInst[],
  parent: ComponentInst | null = null
) {
  let newTemplate = template;
  let componentData: NextComponentData;

  while ((componentData = getNextComponentDataInTemplate(newTemplate))) {
    const {
      name,
      children,
      before,
      after,
      fallback: tFallback,
    } = componentData;

    const realComponentName = normalizeComponentName(name);

    if (!isComponentAlreadyImported(realComponentName)) {
      const fallback = autoImportComponent(realComponentName) || "";

      newTemplate =
        componentData.before + (tFallback || fallback) + componentData.after;

      if (tFallback) continue;

      if (isComponentAutoImport(realComponentName)) {
        if (parent) parent.forceTemplateUpdate();

        continue;
      }

      throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} The component “${realComponentName}” was not created!`;
    }

    const componentFn = getComponentFn(realComponentName) as ComponentFn;

    const componentInst = new ComponentInst(realComponentName, parent, name);

    const portal = usePortal(name);

    if (portal) portal(componentInst);

    componentInst.children = children;

    componentInst.defineComponentTemplate(componentFn(componentInst));

    if (parent) {
      parent.addComponentChild(componentInst);
    }

    componentsInst.push(componentInst);

    const { newTemplate: t } = processEachTemplate(
      componentInst.getCurrentTemplateWithHost(),
      componentsInst,
      componentInst
    );

    componentInst.lastTemplateProcessed = t;

    newTemplate = before + t + after;
  }

  return { newTemplate, componentsInst };
}

export default function processComponentsInTemplate(
  template: string,
  firstParent: ComponentInst | null = null
) {
  const { newTemplate, componentsInst } = processEachTemplate(
    template,
    [],
    firstParent
  );

  return {
    newTemplate,
    componentsInst,
  };
}
