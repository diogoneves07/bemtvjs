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
import getKeyInComponentName from "./get-key-in-component-name";
import { usePortal } from "./super-component/portals";

type NextComponentData = ReturnType<typeof getNextComponentDataInTemplate>;

function assignPropsToComponentChild(
  child: ComponentInst,
  componentName: string,
  parent: ComponentInst
) {
  const childProps = parent.propsDefined?.get(
    getKeyInComponentName(componentName)
  );

  if (childProps) {
    Object.assign(child.props, childProps);
  }
}

function getTemplateWithCurrentPropsValues(
  template: string,
  componentsManager: ComponentInst[]
) {
  let newTemplate = template;
  let componentData: NextComponentData;
  let count = 0;

  while ((componentData = getNextComponentDataInTemplate(newTemplate))) {
    const name = componentData.name;
    const realComponentName = normalizeComponentName(name);
    const componentInst = componentsManager[count];

    if (!isComponentAlreadyImported(realComponentName)) {
      const suspense = autoImportComponent(realComponentName) || "";

      newTemplate = componentData.before + suspense + componentData.after;
      continue;
    }
    const value = componentInst.getCurrentTemplateWithHost();

    componentInst.updateLastTemplateValueProperty();

    newTemplate = componentData.before + value + componentData.after;

    count++;
  }

  return newTemplate;
}

function processEachTemplate(
  template: string,
  componentsManager: ComponentInst[],
  parent: ComponentInst | null = null
) {
  let newTemplate = template;
  let componentData: NextComponentData;

  while ((componentData = getNextComponentDataInTemplate(newTemplate))) {
    const { name, children, before, after } = componentData;

    const realComponentName = normalizeComponentName(name);

    if (!isComponentAlreadyImported(realComponentName)) {
      const suspense = autoImportComponent(realComponentName) || "";

      newTemplate = componentData.before + suspense + componentData.after;

      if (isComponentAutoImport(realComponentName)) {
        if (parent) parent.forceTemplateUpdate();

        continue;
      }

      throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} The component “${realComponentName}” was not created!`;
    }

    const componentFn = getComponentFn(realComponentName) as ComponentFn;

    const componentInst = new ComponentInst(realComponentName, parent);

    const portal = usePortal(name);

    if (portal) portal(componentInst);

    componentInst.children = children;

    if (parent) {
      assignPropsToComponentChild(componentInst, name, parent);
    }

    componentInst.defineComponentTemplate(componentFn(componentInst));

    if (parent) {
      parent.addComponentChild(componentInst);
    }

    componentsManager.push(componentInst);

    processEachTemplate(
      componentInst.getCurrentTemplateWithHost(),
      componentsManager,
      componentInst
    );

    newTemplate = before + after;
  }

  return componentsManager;
}

export default function processComponentsInTemplate(
  template: string,
  firstParent: ComponentInst | null = null
) {
  const componentsManager = processEachTemplate(template, [], firstParent);

  const newTemplate = getTemplateWithCurrentPropsValues(
    template,
    componentsManager
  );

  return {
    newTemplate,
    componentsManager,
  };
}
