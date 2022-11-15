import { SuperComponent } from "./super-component/super-component";
import { LIBRARY_NAME_IN_ERRORS_MESSAGE } from "../globals";
import { SuperComponentFactory } from "./super-component/super-component-factory";
import { bindComponentToSuperComponent } from "./super-component/bind-comp-to-s-comp";
import ComponentInst from "./component-inst";
import render from "./render";
import concatTemplateStringArrays from "../utilities/concat-template-string-arrays";

type GlobalComponentsMap = Map<string, ComponentFn>;

type ComponentName = `${Capitalize<string>}${string}` | string;

export const GLOBAL_COMPONENTS_MAP: GlobalComponentsMap = new Map();

export type ComponentFn =
  | ((self: ComponentInst) => () => string)
  | ((self: ComponentInst) => string);

export type ComponentTemplateCallback = () => string;

export function getComponentFn(componentName: string) {
  return GLOBAL_COMPONENTS_MAP.get(componentName);
}

/**
 * Check if the component is available.
 *
 * @param name
 * The component name.
 */
export function hasComponent(name: ComponentName) {
  return GLOBAL_COMPONENTS_MAP.get(name) ? true : false;
}

/**
 *
 * @param componentName
 * The component name.
 * It must always start with an uppercase character (CamelCase) and accepts all
 * alphanumeric characters and the `:` symbol.
 *
 * @param componentFn
 *  The function responsible for managing the component instance.
 *  It must always return a `string` or a function that returns a `string`.
 *
 * @returns
 * The component creation instance.
 */

class ComponentsInst {
  protected __name: string;
  constructor(name: string) {
    this.__name = name;
  }
  render(insert: string | Element = document.body) {
    render(`${this.__name}[]`, insert);
    return this;
  }
}
type SuperComponentFn = (c: SuperComponent) => void;

export function _(n: TemplateStringsArray, ...args: string[]) {
  const name = (
    Array.isArray(n)
      ? concatTemplateStringArrays(n as TemplateStringsArray, args).join("")
      : n
  ) as string;

  function compType(): SuperComponent;

  function compType(compFn: SuperComponentFn): ComponentsInst;

  function compType<V extends Record<string, any>>(
    compVars: V
  ): SuperComponent<V>;

  function compType(compVarsOrCompFn?: Record<string, any> | SuperComponentFn) {
    if (typeof compVarsOrCompFn === "function") {
      const compFn = compVarsOrCompFn;

      if (GLOBAL_COMPONENTS_MAP.has(name)) {
        throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} This component “${name}” name is already in use!`;
      }

      GLOBAL_COMPONENTS_MAP.set(name, (c) => {
        const s = SuperComponentFactory(name);

        compFn(s);

        return bindComponentToSuperComponent(s, c);
      });

      return new ComponentsInst(name);
    }

    const vars = compVarsOrCompFn || {};

    if (GLOBAL_COMPONENTS_MAP.has(name)) {
      throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} This component “${name}” name is already in use!`;
    }

    Object.freeze(vars);

    const superComponent = SuperComponentFactory(name, vars);
    GLOBAL_COMPONENTS_MAP.set(name, (c) =>
      bindComponentToSuperComponent(superComponent, c)
    );

    return superComponent;
  }

  return compType;
}
