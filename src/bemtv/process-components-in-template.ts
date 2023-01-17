import { LIBRARY_NAME_IN_ERRORS_MESSAGE } from "../globals";
import ComponentInst from "./component-inst";
import normalizeComponentName from "./normalize-component-name";
import getNextComponentDataInTemplate from "./get-next-component-data-in-template";
import {
  autoImportComponent,
  isComponentAlreadyImported,
  isComponentAutoImport,
  onComponentImported,
} from "./auto-import-components";
import { usePortal } from "./super-component/portals";
import { bindComponentToSuperComponent } from "./super-component/bind-comp-to-s-comp";

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
      const fallback =
        tFallback || autoImportComponent(realComponentName) || "";

      newTemplate = componentData.before + fallback + componentData.after;

      if (isComponentAutoImport(realComponentName) && parent) {
        parent.isImportingComponent = true;

        onComponentImported(realComponentName, () => {
          if (!parent.isImportingComponent) return;

          parent.isImportingComponent = false;
          parent.forceTemplateUpdate();
        });
      }

      if (fallback) continue;

      throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} The component “${realComponentName}” was not created!`;
    }

    const portalInst = usePortal(name);
    let componentInst: ComponentInst;

    if (portalInst) {
      componentInst = portalInst;
      componentInst.children = children;
      componentInst.parent = parent;
    } else {
      componentInst = new ComponentInst(realComponentName, parent, name);
      componentInst.children = children;

      bindComponentToSuperComponent(componentInst);
    }

    if (parent) parent.addComponentChild(componentInst);

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
