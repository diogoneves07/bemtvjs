import { Listeners } from "./../types/listeners";
import { css } from "goober";

import { LIBRARY_NAME_IN_ERRORS_MESSAGE } from "./../../globals";
import { ManageEl } from "../manage-el";
import render from "./../render";
import {
  getComponentInstFirstElement,
  setRunningComponent,
  updateComponentVars,
} from "./work-with-super-component";
import { SuperComponentData } from "./../types/super-component-data";
import generateKey from "./../generate-el-key";
import concatTemplateStringArrays from "../../utilities/concat-template-string-arrays";
import createElManager from "./create-el-manager";
import manageComponentsVars from "./manage-components-vars";
import isStringOrNumber from "../../utilities/is-string-or-number";
import { treatArgsInTemplate } from "./treat-args-in-template";
import ComponentInst from "../component-inst";

export type ComponentVars<V extends Record<string, any> = Record<string, any>> =
  V & {
    readonly children: string;
    readonly props: Record<string, any>;
  };
export interface SuperComponent<
  Vars extends Record<string, any> = Record<string, any>
> extends Listeners {
  /**
   * Calls the callback (only once) when the instance is initialized.
   *
   * @param fn
   * The callback.
   */
  onInit(fn: () => void): this;

  /**
   * Calls(only once) the callback after the component template has been mounted in the DOM.
   *
   * @param fn
   * The callback.
   */
  onMount(fn: () => void): this;

  /**
   * Calls the callback after the template update is applied to the DOM.
   *
   * @param fn
   * The callback.
   */
  onUnmount(fn: () => void): this;

  /**
   * Calls the callback after the component is removed/unmounted from the template it was in.
   *
   * @param fn
   * The callback.
   */
  onUpdate(fn: () => void): this;
}

export class SuperComponent<Vars extends Record<string, any>> {
  protected __data: SuperComponentData = {
    componentName: "",
    componentsInitVars: {},
    componentsVarsKeys: ["children", "props"],
    componentsTemplate: () => "",
    isTemplateFunction: false,
    templateHasAlreadyBeenDefined: false,
    DOMListeners: new Set(),
    lifeCycles: new Map(),
    removeDOMListeners: new Map(),
    componentRunning: null,
    components: new Map(),
    $disableProxies: false,
    disableVarsProxies() {
      this.$disableProxies = true;
    },
    activateVarsProxies() {
      this.$disableProxies = false;
    },
    classes: [],
    fns: [],
    sCompProxy: null as any,
    isSigleInstance: false,
  };

  /**
   * Allows you to create `compVars`,
   * which are properties that are isolated for each component render.
   */
  $: ComponentVars<Vars>;

  constructor(name: string, vars?: Vars) {
    const data = this.__data;
    const isSigleInstance = vars === undefined;
    const v = vars || {};

    this.__data.isSigleInstance = isSigleInstance;

    Object.assign(data.componentsInitVars, v);

    data.componentName = name;
    data.componentsVarsKeys.push(...Object.keys(v));

    const sComp = this;
    this.$ = manageComponentsVars({} as ComponentVars<Vars>, sComp);
  }

  /**
   * Allows you to keep the instance running for the execution of a callback.
   * @param callback
   *
   * The callback.
   * @returns
   *
   * A callback that when called executes the function passed.
   */
  keepInst<T extends Function>(callback: T) {
    const keepInstance = this.__data.componentRunning;
    return () => {
      setRunningComponent(this, keepInstance);
      callback();
      updateComponentVars(this);
      setRunningComponent(this);
    };
  }

  /**
   * Allows CSS-In-JS
   */
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
  ): ManageEl<E>;

  /**
   * Creates an instance to manage a real DOM element.
   *
   * @returns
   * A Tuple where the first item is a special key that must be applied to the tag
   * and the second is a function to get the instance.
   */
  useEl<E extends Element = Element>(): [
    elKey: string,
    getEl: () => ManageEl<E>
  ];

  useEl<E extends Element = Element>(selectorOrElement?: string | Element) {
    if (selectorOrElement) {
      return createElManager<E>(
        selectorOrElement,
        this.__data.componentRunning
      );
    }

    const cache = new Map<ComponentInst, ManageEl>();
    const key = generateKey();

    return [
      key,
      () => {
        const c = this.__data.componentRunning;

        if (c && cache.has(c)) return cache.get(c);

        const elManager = createElManager<E>(key, c);

        c && cache.set(c, elManager);
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

  /**
   * Allows you to manipulate the children passed to the component.
   */
  children(fn: (children: string) => string) {
    this.__data.fns.push(["children", [fn]]);
    return this.__data.sCompProxy;
  }

  /**
   * Allows you to manipulate the props passed to the component.
   */
  props(fn: (props: Record<string, any>) => Record<string, any>) {
    this.__data.fns.push(["props", [fn]]);
    return this.__data.sCompProxy;
  }

  /**
   * Defines the component template.
   */
  template(t: string | TemplateStringsArray | (() => string), ...exps: any[]) {
    const data = this.__data;

    if (data.templateHasAlreadyBeenDefined) {
      throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} In the “${data.componentName}” component use the “template()” function only once. \n\n“We currently see this as a way to make your code predictable and less error prone”`;
    }
    data.isTemplateFunction = false;
    data.templateHasAlreadyBeenDefined = true;

    switch (typeof t) {
      case "function":
        data.componentsTemplate = t;
        data.isTemplateFunction = true;

        break;
      case "object":
        let values = treatArgsInTemplate(concatTemplateStringArrays(t, exps));

        const v = values.join("");

        for (const i of values) {
          if (!isStringOrNumber(i)) {
            console.error(values);
            throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} In the “${data.componentName}” component the template with TemplateStringsArray has a value that is not string, number or use transformation functions: “${values}”`;
          }
        }

        data.componentsTemplate = () => v;
        break;
      default:
        data.componentsTemplate = () => t;
        break;
    }

    return this.__data.sCompProxy;
  }

  /**
   * Renders the component somewhere on the page.
   *
   * @param selectorOrElement
   * The element to insert the nodes.
   */
  render = (selectorOrElement?: string | Element) => {
    render(this.__data.componentName + "[]", selectorOrElement);
    return this.__data.sCompProxy;
  };
}
