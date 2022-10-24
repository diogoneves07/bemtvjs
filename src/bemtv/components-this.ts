import { Listeners } from "./types/listeners";
import generateKey, { REGEX_CUSTOM_ATTR_KEY_VALUE } from "./generate-el-key";
import getElement from "../utilities/get-element";
import { ManagerElFactory } from "./manager-el-factory";
import reshareProps from "./reshare-props";
import useSharedProp from "./use-shared-prop";
import {
  getComponentThisData,
  getElementsForElsManager,
} from "./work-with-components-this";
import {
  ComponentThisData,
  LifeCycleCallback,
  Props,
} from "./types/component-this-data";
import insertEventListener from "./insert-event-listener";

export interface ComponentThis extends Listeners {}

export class ComponentThis {
  __data: ComponentThisData = {
    mounted: false,
    listeners: new Set(),
    firstElement: null,
    mountedFns: new Set<LifeCycleCallback>().add(
      getElementsForElsManager.bind(this)
    ),
    updatedFns: new Set<LifeCycleCallback>().add(
      getElementsForElsManager.bind(this)
    ),
    els: [],
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
  readonly p: Props = this.props;
  /** The component name */
  readonly name: string;

  /** The component children */
  children: string = "";

  constructor(name: string, parent?: ComponentThis) {
    this.name = name;
    this.__data.parent = parent || null;
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
   * @param props
   * An object.
   *
   * @returns
   * A key that can be used before the component's opening square bracket, so the component will
   * receive the declared props
   */
  defineProps<T extends Record<string, any>>(props: T) {
    if (!this.__data.propsDefined) this.__data.propsDefined = new Map();

    const key = this.__data.propsDefined.size.toString();

    this.__data.propsDefined.set(key, props);

    return "_" + key;
  }

  /**
   * Creates an instance to manage a real DOM element.
   *
   * @returns
   * The instance to manage the real DOM element;
   */
  el<E extends Element = Element>(): [
    managerEl: ReturnType<typeof ManagerElFactory<E>>,
    key: string
  ];

  /**
   * Creates an instance to manage a real DOM element.
   *
   * @param selectorOrElement
   * The element of instance
   *
   * @returns
   * The instance to manage the real DOM element;
   */
  el<E extends Element = Element>(
    selectorOrElement?: string | Element
  ): ReturnType<typeof ManagerElFactory<E>>;

  el<E extends Element = Element>(selectorOrElement?: string | Element) {
    const key = generateKey();
    const keyWithoutTokens = (
      key.match(REGEX_CUSTOM_ATTR_KEY_VALUE) as string[]
    )[0];

    const managerEl = ManagerElFactory<E>(keyWithoutTokens);

    this.__data.els.push(managerEl);

    if (!selectorOrElement) return [managerEl, key];

    const data = getComponentThisData(this);
    const { mounted } = data;

    if (mounted) {
      managerEl.it = getElement(selectorOrElement) as E;
    } else {
      data.mountedFns = new Set<any>([
        () => {
          managerEl.it = getElement(selectorOrElement) as E;
        },
        ...data.mountedFns,
      ]);
    }

    return managerEl;
  }

  /**
   * Calls(only once) the callback after template elements are added to the DOM:
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
   * and the changes are applied to the DOM:
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
