import { LIBRARY_NAME_IN_ERRORS_MESSAGE } from "./../../globals";
import ComponentInst from "../component-inst";
import { getSuperComponentInst } from "../components-main";
import { bindComponentToSuperComponent } from "./bind-comp-to-s-comp";
import { createFakeSuperComponent } from "./fake-super-component";
import { FakeSuperComponent } from "../types/fake-super-component";

const PORTALS_STORE = new Map<string, () => ComponentInst>();

let count = 0;

function createPortalKey(name: string) {
  return `${name}_${count++}`;
}

export function usePortal(key: string) {
  const i = PORTALS_STORE.get(key);

  return i && i();
}

function definePortal(key: string, c: () => ComponentInst) {
  PORTALS_STORE.set(key, c);
}

export function createPortal<CompVars extends Record<string, any>>(
  componentName: string
) {
  const realSuperComponent = getSuperComponentInst(componentName);

  if (!realSuperComponent)
    throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} The SuperComponent “${componentName}” was not created!`;

  const key = createPortalKey(componentName);

  let componentInst = new ComponentInst(componentName, null, key);

  componentInst.defineComponentTemplate(
    bindComponentToSuperComponent(componentInst)
  );

  const fakeSuperComponent = createFakeSuperComponent<CompVars>(
    componentInst,
    key
  );

  let isFirstInst = true;

  definePortal(key, () => {
    if (isFirstInst) {
      isFirstInst = false;
      return componentInst;
    }
    componentInst = new ComponentInst(componentName, null, key);

    componentInst.defineComponentTemplate(
      bindComponentToSuperComponent(componentInst)
    );
    fakeSuperComponent.__componentInst = componentInst;

    return componentInst;
  });

  return fakeSuperComponent as FakeSuperComponent<CompVars>;
}
