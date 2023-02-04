import { LIBRARY_NAME_IN_ERRORS_MESSAGE } from "../globals";
import SimpleComponent from "./simple-component";
import normalizeComponentName from "./normalize-component-name";
import getNextComponentDataInTemplate from "./get-next-component-data-in-template";
import {
  autoImportComponent,
  isComponentAlreadyImported,
  isComponentAutoImport,
  onComponentImported,
} from "./lazy-component";
import { useProxyFrom } from "../super-component/proxy-from";
import { bindComponentToSuperComponent } from "../super-component/bind-comp-to-s-comp";

type NextComponentData = ReturnType<typeof getNextComponentDataInTemplate>;

function processEachTemplate(
  template: string,
  simpleComponents: SimpleComponent[],
  parent: SimpleComponent | null = null
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

    const portalInst = useProxyFrom(name);
    let simpleComponent: SimpleComponent;

    if (portalInst) {
      simpleComponent = portalInst;
      simpleComponent.children = children;
      simpleComponent.parent = parent;
    } else {
      simpleComponent = new SimpleComponent(realComponentName, parent, name);
      simpleComponent.children = children;

      bindComponentToSuperComponent(simpleComponent);
    }

    if (parent) parent.addComponentChild(simpleComponent);

    simpleComponents.push(simpleComponent);

    const { newTemplate: t } = processEachTemplate(
      simpleComponent.getCurrentTemplateWithHost(),
      simpleComponents,
      simpleComponent
    );

    simpleComponent.lastTemplateProcessed = t;

    newTemplate = before + t + after;
  }

  return { newTemplate, simpleComponents };
}

export default function processComponentsInTemplate(
  template: string,
  firstParent: SimpleComponent | null = null
) {
  const { newTemplate, simpleComponents } = processEachTemplate(
    template,
    [],
    firstParent
  );

  return {
    newTemplate,
    simpleComponents,
  };
}
