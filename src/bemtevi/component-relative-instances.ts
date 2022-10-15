import ComponentManager from "./component-manager";

const RELATIVES_INSTANCES: ComponentManager[][] = [];

export function saveRelativeInstances(relativeInstances: ComponentManager[]) {
  RELATIVES_INSTANCES.push(relativeInstances);
}

export function addToRelativeInstances(
  newInstances: ComponentManager | ComponentManager[],
  relative: ComponentManager
) {
  for (const componentsManager of RELATIVES_INSTANCES) {
    for (const componentManager of componentsManager) {
      if (componentManager !== relative) continue;

      if (Array.isArray(newInstances)) {
        componentsManager.push(...newInstances);
        return;
      }

      componentsManager.push(newInstances);

      return;
    }
  }
}

export function getRelativeInstances(relative: ComponentManager) {
  for (const componentsManager of RELATIVES_INSTANCES) {
    for (const componentManager of componentsManager) {
      if (componentManager === relative) {
        return componentsManager;
      }
    }
  }
  return undefined;
}

export function removeRelativeInstance(relative: ComponentManager) {
  for (const componentsManager of RELATIVES_INSTANCES) {
    const i = componentsManager.indexOf(relative);
    if (i === -1) continue;
    componentsManager.splice(i, 1);
  }
}
