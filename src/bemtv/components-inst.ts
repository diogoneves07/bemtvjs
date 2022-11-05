import { Listeners } from "./types/listeners";
import reshareProps from "./reshare-props";
import useSharedProp from "./use-shared-prop";
import {
  ComponentInstData,
  LifeCycleCallback,
  Props,
} from "./types/component-inst-data";
import insertEventListener from "./insert-event-listener";

export interface ComponentInst extends Listeners {}

export class ComponentInst {
  protected __data: ComponentInstData = {
    mounted: false,
    listeners: new Set(),
    firstElement: null,
    mountedFns: new Set<LifeCycleCallback>(),
    initFns: new Set<LifeCycleCallback>(),
    updatedFns: new Set<LifeCycleCallback>(),
    sharedData: {},
    parent: null,
    defineFirstElement(newValue: Element | null) {
      const d = this;

      if (d.firstElement === newValue) return;

      if (d.firstElement)
        d.listeners.forEach((o) => o.removeListener && o.removeListener());

      d.firstElement = newValue;

      if (!newValue) return;

      for (const o of d.listeners) {
        o.removeListener = insertEventListener(newValue, o.listener, ...o.args);
      }
    },
  };

  /** The component properties */
  readonly props: Props = {};
  /** The component properties */
  readonly name: string;

  /** The component children */
  children: string = "";

  constructor(name: string, parent?: ComponentInst) {
    this.name = name;

    const d = this.__data;
    d.parent = parent || null;

    return this;
  }

  /**
   * Shares the data with itself(this component) and everyone below it.
   *
   * @param o
   * An object.
   */
  share<T extends Record<string, any>>(o: T) {
    Object.assign(this.__data.sharedData, o);
  }

  /**
   * Updates the values ​​of properties that have been shared.
   *
   * @param o
   *  An object.
   */
  reshare<T extends Record<string, any>>(o: T) {
    reshareProps(this, o);
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
    return useSharedProp(this, key) as ReturnType;
  }

  /**
   * Calls(only once) the callback when the component is initialized.
   *
   * @param fn
   * The callback
   */
  onInit(fn: () => void) {
    this.__data.initFns.add(fn);
    return this;
  }

  /**
   * Calls(only once) the callback after template elements are added to the DOM.
   *
   * @param fn
   * The callback
   */
  onMount(fn: () => void) {
    this.__data.mountedFns.add(fn);
    return this;
  }

  /**
   * Calls(only once) the callback whenever the template changes
   * and the changes are applied to the DOM.
   *
   * @param fn
   * The callback
   */
  onUnmount(fn: () => void) {
    if (!this.__data.unmountedFns) this.__data.unmountedFns = new Set();
    this.__data.unmountedFns.add(fn);
    return this;
  }

  /**
   * Calls the callback after all temĺate elements have been removed from the DOM
   * and component instance will be destroyed.
   *
   * @param fn
   * The callback
   */
  onUpdate(fn: () => void) {
    this.__data.updatedFns.add(fn);
    return this;
  }
}
