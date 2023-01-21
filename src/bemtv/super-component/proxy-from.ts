import { LIBRARY_NAME_IN_ERRORS_MESSAGE } from "../../globals";
import ComponentInst from "../component-inst";
import { getSuperComponentInst } from "../components-main";
import { bindComponentToSuperComponent } from "./bind-comp-to-s-comp";
import { createFakeSuperComponent } from "./fake-super-component";
import { FakeSuperComponent } from "../types/fake-super-component";
import concatTemplateStringArrays from "../../utilities/concat-template-string-arrays";

const BRIDGES_STORE = new Map<string, () => ComponentInst>();

let count = 0;

function createProxyFromKey(name: string) {
  return `${name}_${count++}`;
}

export function useProxyFrom(key: string) {
  const i = BRIDGES_STORE.get(key);

  return i && i();
}

function defineProxyFrom(key: string, c: () => ComponentInst) {
  BRIDGES_STORE.set(key, c);
}

export function proxyFrom<CompVars extends Record<string, any>>(
  componentName: string | TemplateStringsArray,
  ...args: (string | number)[]
) {
  let name = "";
  if (typeof componentName === "string") {
    name = componentName;
  } else {
    name = concatTemplateStringArrays(componentName, args).join("");
  }

  const realSuperComponent = getSuperComponentInst(name);

  if (!realSuperComponent)
    throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} The SuperComponent “${name}” was not created!`;

  const key = createProxyFromKey(name);

  let componentInst = new ComponentInst(name, null, key);

  componentInst.defineComponentTemplate(
    bindComponentToSuperComponent(componentInst)
  );

  const fakeSuperComponent = createFakeSuperComponent<CompVars>(
    componentInst,
    key
  );

  let isFirstInst = true;

  defineProxyFrom(key, () => {
    if (isFirstInst) {
      isFirstInst = false;
      return componentInst;
    }
    componentInst = new ComponentInst(name, null, key);

    componentInst.defineComponentTemplate(
      bindComponentToSuperComponent(componentInst)
    );
    fakeSuperComponent.__componentInst = componentInst;

    return componentInst;
  });

  return fakeSuperComponent as FakeSuperComponent<CompVars>;
}
