import { ROUTES_OPTIONS } from "./../routes-store";
import { Listeners } from "./../types/listeners";
import { css } from "goober";

import { LIBRARY_NAME_IN_ERRORS_MESSAGE } from "./../../globals";
import render from "./../render";
import {
  getSimpleComponentFirstElement,
  runInSimpleComponent,
  updateComponentVars,
} from "./work-with-super-component";
import { SuperComponentData } from "./../types/super-component-data";
import concatTemplateStringArrays from "../../utilities/concat-template-string-arrays";
import manageComponentsVars from "./manage-components-vars";
import isStringOrNumber from "../../utilities/is-string-or-number";
import { treatArgsInTemplate } from "./treat-args-in-template";
import autoCreateRoute, {
  autoCreateRouteFromTemplates,
} from "../auto-create-route";
import { routeToKebabCase } from "../../router/routes-case";
import { CSSClass, onRemoveClass } from "../css-classes";
import { proxyFrom } from "./proxy-from";
import { ObserverSystem } from "../observers-system";
import SimpleComponent from "../simple-component";
import { FakeSuperComponent } from "../types/fake-super-component";
import { createFakeSuperComponent } from "./fake-super-component";

export type ComponentVars<V extends Record<string, any> = Record<string, any>> =
  V & {
    children: string;
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
    componentsVarsKeys: ["children"],
    componentsTemplate: () => "",
    isTemplateFunction: false,
    templateHasAlreadyBeenDefined: false,
    DOMListeners: new Set(),
    lifeCycles: new Map(),
    removeDOMListeners: new Map(),
    simpleComponentRunning: null,
    simpleComponents: new Set(),
    $disableProxies: false,
    disableVarsProxies() {
      this.$disableProxies = true;
    },
    activateVarsProxies() {
      this.$disableProxies = false;
    },
    sCompProxy: null as any,
    onInstObservers: new ObserverSystem(),
  };

  /**
   * Allows you to create `compVars`,
   * which are properties that are isolated for each component render.
   */
  $: ComponentVars<Vars>;

  constructor(name: string, vars?: Vars) {
    const data = this.__data;
    const v = vars || {};

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
    const keepInstance = this.__data.simpleComponentRunning;
    return () => {
      runInSimpleComponent(this, keepInstance, () => {
        callback();
        updateComponentVars(this.__data.sCompProxy);
      });
    };
  }

  /**
   * Runs a function for all instances of the component.
   */
  run(fn: () => void) {
    const sCompProxy = this.__data.sCompProxy;

    sCompProxy.onInit(fn);

    return sCompProxy;
  }

  /**
   * Allows receiving a proxy to work with each instance of the component separately.
   *
   * @param
   * A function that will be called whenever an instance is created.
   */
  onInst(fn: (proxy: FakeSuperComponent<Vars>) => void) {
    const d = this.__data;
    const sCompProxy = d.sCompProxy;

    const run = (c: SimpleComponent) => {
      const fakeSuperComponent = createFakeSuperComponent<Vars>(c, "");

      fn(fakeSuperComponent);

      d.onInstObservers.delete(run);
    };

    d.onInstObservers.add(run);

    return sCompProxy;
  }

  /**
   * Allows CSS-In-JS.
   */
  css = (...args: Parameters<typeof css>) => {
    const classValue = css(...args);

    const classInst = new CSSClass(classValue);
    const sCompProxy = this.__data.sCompProxy;

    let block = false;

    const fn = () => {
      const c = this.__data.simpleComponentRunning;

      if (block) {
        if (c) c.onUpdatedObservers?.delete(fn);

        return;
      }

      const firstElement = c && getSimpleComponentFirstElement(c);

      if (firstElement && !firstElement.classList.contains(classValue)) {
        firstElement.classList.add(classValue);
      }
    };

    onRemoveClass(classInst, () => {
      block = true;
    });

    sCompProxy.onMount(fn);
    sCompProxy.onUpdate(fn);

    return classInst;
  };

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

    autoCreateRouteFromTemplates(data.componentsTemplate());

    return this.__data.sCompProxy;
  }

  /**
   * Renders the component somewhere on the page.
   *
   * @param selectorOrElement
   * The element to insert the nodes.
   */
  render(selectorOrElement?: string | Element) {
    render(this.__data.componentName + "[]", selectorOrElement);
    return this.__data.sCompProxy;
  }

  route(routeOptions?: SuperComponentData["routeOptions"]) {
    const d = this.__data;
    const { componentName } = d;
    const routeName = `Router:${componentName}`;

    ROUTES_OPTIONS.set(componentName, routeOptions || {});

    d.routeOptions = routeOptions;

    autoCreateRoute(routeName);

    return this.__data.sCompProxy;
  }

  renderRoute() {
    const d = this.__data;
    const { componentName } = d;
    const isRoot = componentName === "Root";
    const routeOptions = ROUTES_OPTIONS.get(componentName);
    const concat =
      routeOptions && routeOptions.concat ? `/${routeOptions.concat}` : "";

    window.location.hash = isRoot
      ? "/"
      : `/${routeToKebabCase(componentName)}${concat}`;

    return this.__data.sCompProxy;
  }

  /**
   * Returns a “proxy” of this component that has access to all its resources.
   */
  proxy() {
    return proxyFrom<Vars>(this.__data.componentName);
  }
}
