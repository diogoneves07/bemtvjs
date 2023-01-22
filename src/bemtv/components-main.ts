import { SuperComponent } from "./super-component/super-component";
import { LIBRARY_NAME_IN_ERRORS_MESSAGE } from "../globals";
import { SuperComponentFactory } from "./super-component/super-component-factory";
import concatTemplateStringArrays from "../utilities/concat-template-string-arrays";
import { getSuperComponentData } from "./super-component/work-with-super-component";

export const ALL_SUPER_COMPONENTS: SuperComponent[] = [];

export function getSuperSimpleComponent(componentName: string) {
  return ALL_SUPER_COMPONENTS.find(
    (s) => getSuperComponentData(s).componentName === componentName
  );
}

/**
 * Check if the component is available.
 *
 * @param name
 * The component name.
 */
export function hasComponent(name: string) {
  return getSuperSimpleComponent(name) ? true : false;
}

/**
 * Defines the component name.
 *
 * @param componentName
 * The component name.
 * It must always start with an uppercase character (CamelCase) and accepts all
 * alphanumeric characters and the `:` symbol.
 *
 * @returns
 * A function to define the component vars.
 */

export function _(componentName: TemplateStringsArray, ...args: string[]) {
  const n = componentName;
  const name = (
    Array.isArray(n)
      ? concatTemplateStringArrays(n as TemplateStringsArray, args).join("")
      : n
  ) as string;

  if (getSuperSimpleComponent(name)) {
    throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} The “${name}” component already exists!`;
  }

  /**
   * Finishes the creation of the component
   * and provides access to an instance of SuperComponent.
   */
  function defineVars<CompVars extends Record<string, any>>(
    compVars?: CompVars
  ) {
    const vars = (compVars || {}) as CompVars;

    Object.freeze(vars);

    const superComponent = SuperComponentFactory<CompVars>(name, vars);

    ALL_SUPER_COMPONENTS.push(superComponent);

    return superComponent;
  }

  return defineVars;
}
