import { Listeners } from "./../types/listeners";
import { css } from "goober";

import { LIBRARY_NAME_IN_ERRORS_MESSAGE } from "./../../globals";
import { ManagerEl } from "./../manager-el";
import render from "./../render";
import {
  getComponentInstFirstElement,
  resetTemplatePropertyValues,
  setRunningComponent,
  updateComponentVars,
} from "./work-with-super-component";
import { SuperComponentData } from "./../types/super-component-data";
import generateKey from "./../generate-el-key";
import { treatValueInTemplate } from "./treat-value-in-template";
import concatTemplateStringArrays from "../../utilities/concat-template-string-arrays";
import createElManager from "./create-el-manager";

type ComponentVars<V extends Record<string, any>> = V & {
  readonly children: string;
  readonly props: Record<string, any>;
};
export interface SuperComponent<
  Vars extends Record<string, any> = Record<string, any>
> extends Listeners {
  /**
   * Calls(only once) the callback after template elements are added to the DOM.
   *
   * @param fn
   * The callback
   */
  onMount(fn: () => void): this;

  /**
   * Calls(only once) the callback whenever the template changes
   * and the changes are applied to the DOM.
   *
   * @param fn
   * The callback
   */
  onUnmount(fn: () => void): this;

  /**
   * Calls the callback after all tempĺate elements have been removed from the DOM
   * and component instance will be destroyed.
   *
   * @param fn
   * The callback
   */
  onUpdate(fn: () => void): this;
}

export class SuperComponent<Vars extends Record<string, any>> {
  protected __data = {
    componentName: "",
    initVars: {},
    initVarsKeys: ["children", "props"],
    initialTemplate: () => "",
    DOMListeners: new Set(),
    lifeCycles: new Map(),
    removeDOMListeners: new Map(),
    componentRunning: null,
    components: new Map(),
    $disableProxy: false,
    classes: [],
    fns: [],
  } as unknown as SuperComponentData;

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

  keepInst<T extends Function>(callback: T) {
    const keepInstance = this.__data.componentRunning;
    return () => {
      setRunningComponent(this, keepInstance);
      callback();
      updateComponentVars(this);
      setRunningComponent(this);
    };
  }

  css = (...args: Parameters<typeof css>) => {
    const classValue = css(...args);
    const data = this.__data;
    data.classes.push(classValue);
    for (const c of data.components.keys()) {
      const firstElement = getComponentInstFirstElement(c);

      if (firstElement) {
        firstElement.classList.add(classValue);
      }
    }
    return classValue;
  };

  /**
   * Creates an instance to manage a real DOM element.
   *
   * @returns
   * The instance to manage the real DOM element;
   */
  useEl<E extends Element = Element>(
    selectorOrElement: string | Element
  ): () => ManagerEl<E>;

  useEl<E extends Element = Element>(): [
    elKey: string,
    getEl: () => ManagerEl<E>
  ];

  useEl<E extends Element = Element>(selectorOrElement?: string | Element) {
    if (selectorOrElement)
      return () =>
        createElManager<E>(selectorOrElement, this.__data.componentRunning);

    let elManager: undefined | ManagerEl;

    const key = generateKey();
    return [
      key,
      () => {
        if (elManager && elManager.it) return elManager;
        elManager = createElManager<E>(key, this.__data.componentRunning);
        return elManager;
      },
    ];
  }

  /**
   * Shares the data with itself(this component) and everyone below it.
   *
   * @param o
   * An object.
   */
  share<T extends Record<string, any>>(o: T) {
    this.__data.fns.push(["share", [o]]);
    return this.__data.sCompProxy;
  }

  /**
   * Updates the values ​​of properties that have been shared.
   *
   * @param o
   *  An object.
   */
  reshare<T extends Record<string, any>>(o: T) {
    this.__data.fns.push(["reshare", [o]]);
    return this.__data.sCompProxy;
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
   * receive the declared props.
   */
  defineProps<T extends Record<string, any>>(props: T) {
    if (!this.__data.propsDefined) this.__data.propsDefined = new Map();

    const key = this.__data.propsDefined.size.toString();

    this.__data.propsDefined.set(key, props);

    return "_" + key;
  }

  children(fn: (children: string) => string) {
    this.__data.fns.push(["children", [fn]]);
    return this.__data.sCompProxy;
  }

  props(fn: (props: Record<string, any>) => Record<string, any>) {
    this.__data.fns.push(["props", [fn]]);
    return this.__data.sCompProxy;
  }

  template(t: string | TemplateStringsArray | (() => string), ...exps: any[]) {
    const data = this.__data;
    switch (typeof t) {
      case "function":
        data.initialTemplate = t;
        break;
      case "object":
        const values: string[] = concatTemplateStringArrays(t, exps);

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

    return this.__data.sCompProxy;
  }

  render = (selectorOrElement?: string | Element | undefined) => {
    render(this.__data.componentName + "[]", selectorOrElement);
    return this.__data.sCompProxy;
  };
}
