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

class ComponentsInst {
  protected __name: string;
  constructor(name: string) {
    this.__name = name;
  }
  /**
   * Renders the component somewhere on the page.
   *
   * @param selectorOrElement
   * The element to insert the nodes.
   */
  render(selectorOrElement: string | Element = document.body) {
    render(`${this.__name}[]`, selectorOrElement);
    return this;
  }
}

type SuperComponentFn = (c: SuperComponent) => void;

/**
 * Defines the component name.
 *
 * @param componentName
 * The component name.
 * It must always start with an uppercase character (CamelCase) and accepts all
 * alphanumeric characters and the `:` symbol.
 *
 * @returns
 * A function to define the component type;
 */

export function _(componentName: TemplateStringsArray, ...args: string[]) {
  const n = componentName;
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

  /**
   * Finishes the creation of the component
   * and provides access to an instance of SuperComponent.
   */
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

      return new Proxy(new ComponentsInst(name), {
        get(target, n) {
          const propName = n as string;
          const t = target as any;

          if (propName in target) {
            if (typeof t[propName] === "function") {
              return t[propName].bind(target);
            }
            return t[propName];
          }
        },
      });
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
