import { css } from "goober";

import { LIBRARY_NAME_IN_ERRORS_MESSAGE } from "./../../globals";
import { ManagerEl } from "./../manager-el";
import { KEY_ATTRIBUTE_NAME } from "./../globals";
import { ALL_COMPONENTS_MANAGER } from "./../component-manager-store";
import ComponentInstance from "./../component-instance";
import { ComponentThis } from "./../components-this";
import render from "./../render";
import {
  resetTemplatePropertyValues,
  setRunningComponent,
  updateComponentVars,
} from "./work-with-super-component";
import { SuperComponentData } from "./../types/super-component-data";
import generateKey, { getElKeyValue, isElKey } from "./../generate-el-key";
import ComponentManager from "./../component-manager";
import { treatValueInTemplate } from "./treat-value-in-template";

type ReauseSomeMethods = Omit<
  ComponentThis,
  | "__data"
  | "el"
  | "defineProps"
  | "children"
  | "share"
  | "reshare"
  | "use"
  | "props"
>;

type ComponentVars<V extends Record<string, any>> = V & {
  children: string;
  props: Record<string, any>;
};
export interface SuperComponent<
  Vars extends Record<string, any> = Record<string, any>
> extends ReauseSomeMethods {}

export class SuperComponent<Vars extends Record<string, any>> {
  protected __data: SuperComponentData = {
    componentName: "",
    initVars: {},
    initVarsKeys: ["children", "props"],
    initialTemplate: () => "",
    listeners: new Set(),
    lifeCycles: new Map(),
    removeListeners: new Map(),
    componentRunning: null,
    components: new Map(),
    $disableProxy: false,
    classes: [],
    fns: [],
  };

  $: ComponentVars<Vars>;

  constructor(name: string, vars: Vars) {
    const data = this.__data;

    Object.assign(data.initVars, vars);
    data.componentName = name;
    data.initVarsKeys.push(...Object.keys(vars));

    const t = this;
    this.$ = new Proxy({} as ComponentVars<Vars>, {
      get(target, p) {
        let k = p as string;
        if (!data.$disableProxy) {
          resetTemplatePropertyValues(t, k);
        }
        return target[k];
      },
      set(target, p, n) {
        let k = p as string;

        if (!data.$disableProxy) {
          resetTemplatePropertyValues(t, k);
        }
        (target as any)[k] = n;
        return true;
      },
    });
  }

  fn<T extends Function>(callback: T) {
    const keepInstance = this.__data.componentRunning;
    return () => {
      setRunningComponent(this, keepInstance);
      callback();
      updateComponentVars(this);
      setRunningComponent(this);
    };
  }

  css = (...args: Parameters<typeof css>) => {
    this.__data.classes.push(css(...args));
    return this;
  };

  keyEl() {
    return generateKey();
  }

  /**
   * Creates an instance to manage a real DOM element.
   *
   * @returns
   * The instance to manage the real DOM element;
   */
  el(selectorOrElement: string | Element) {
    const c = this.__data.componentRunning;
    const fallback = new ManagerEl("");

    if (!c) return fallback;

    if (selectorOrElement instanceof Element) return c.el(selectorOrElement);

    if (!isElKey(selectorOrElement)) return c.el(selectorOrElement);

    const elKey = getElKeyValue(selectorOrElement);
    let componentManager: ComponentManager | undefined;

    for (const m of ALL_COMPONENTS_MANAGER) {
      componentManager = m;
      if (m.componentThis === c) break;
    }

    if (!componentManager) return fallback;

    let element = componentManager.nodes.find((n) => {
      if (!(n instanceof Element)) return false;
      if (!n.hasAttribute(KEY_ATTRIBUTE_NAME)) return false;
      if (!n.getAttribute(KEY_ATTRIBUTE_NAME)?.includes(elKey)) return false;

      return true;
    }) as Element;

    return c.el(element);
  }

  /**
   * Shares the data with itself(this component) and everyone below it.
   *
   * @param o
   * An object.
   */
  share<T extends Record<string, any>>(o: T) {
    this.__data.fns.push(["share", [o]]);
    return this;
  }

  /**
   * Updates the values ​​of properties that have been shared.
   *
   * @param o
   *  An object.
   */
  reshare<T extends Record<string, any>>(o: T) {
    this.__data.fns.push(["reshare", [o]]);
    return this;
  }

  /**
   * Allows you to use properties that have been shared.
   * @param key
   * The property name.
   *
   * @returns
   * The property value or undefined.
   */
  use<ReturnType = any>(key: string) {
    const c = this.__data.componentRunning;
    return c ? c.use<ReturnType>(key) : undefined;
  }

  /**
   * @param props
   * An object.
   *
   * @returns
   * A key that can be used before the component's opening square bracket, so the component will
   * receive the declared props
   */
  defineProps<T extends Record<string, any>>(props: T) {
    this.__data.fns.push(["defineProps", [props]]);
    return this;
  }

  children(fn: (children: string) => string) {
    this.__data.fns.push(["children", [fn]]);
  }

  props(fn: (props: Record<string, any>) => Record<string, any>) {
    this.__data.fns.push(["props", [fn]]);
  }

  template(t: string | TemplateStringsArray | (() => string), ...exps: any[]) {
    const data = this.__data;
    switch (typeof t) {
      case "function":
        data.initialTemplate = t;
        break;
      case "object":
        const values: string[] = [];

        exps.forEach((value, index) => values.push(t[index], value));

        values.push(t[t.length - 1]);

        const v = treatValueInTemplate(values);

        if (!v) {
          console.error(values);
          throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} In the “${data.componentRunning?.name}” component the template has a value that is not string, number or uses pipes: ${values}`;
        }
        data.initialTemplate = () => v;
        break;
      default:
        data.initialTemplate = () => t;
        break;
    }

    return this;
  }

  render = ((selectorOrElement?: string | Element | undefined) => {
    render(this.__data.componentName + "[]", selectorOrElement);
    return this;
  }) as ComponentInstance["render"];
}
