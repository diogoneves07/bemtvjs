import { LIBRARY_NAME_IN_ERRORS_MESSAGE } from "../../globals";
import SimpleComponent from "../simple-component";
import { getSuperSimpleComponent } from "../components-main";
import { bindComponentToSuperComponent } from "./bind-comp-to-s-comp";
import { createFakeSuperComponent } from "./fake-super-component";
import { FakeSuperComponent } from "../types/fake-super-component";
import concatTemplateStringArrays from "../../utilities/concat-template-string-arrays";

const BRIDGES_STORE = new Map<string, () => SimpleComponent>();

let count = 0;

function createProxyFromKey(name: string) {
  return `${name}_${count++}`;
}

export function useProxyFrom(key: string) {
  const i = BRIDGES_STORE.get(key);

  return i && i();
}

function defineProxyFrom(key: string, c: () => SimpleComponent) {
  BRIDGES_STORE.set(key, c);
}

/**
 * Returns a “proxy” of the component that has access to all its resources.
 *
 * @param componentName
 * The component name.
 */
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

  const realSuperComponent = getSuperSimpleComponent(name);

  if (!realSuperComponent)
    throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} The SuperComponent “${name}” was not created!`;

  const key = createProxyFromKey(name);

  let simpleComponent = new SimpleComponent(name, null, key);

  simpleComponent.defineComponentTemplate(
    bindComponentToSuperComponent(simpleComponent)
  );

  const fakeSuperComponent = createFakeSuperComponent<CompVars>(
    simpleComponent,
    key
  );

  let isFirstInst = true;

  defineProxyFrom(key, () => {
    if (isFirstInst) {
      isFirstInst = false;
      return simpleComponent;
    }
    simpleComponent = new SimpleComponent(name, null, key);

    simpleComponent.defineComponentTemplate(
      bindComponentToSuperComponent(simpleComponent)
    );
    fakeSuperComponent.__simpleComponent = simpleComponent;

    return simpleComponent;
  });

  return fakeSuperComponent as FakeSuperComponent<CompVars>;
}
