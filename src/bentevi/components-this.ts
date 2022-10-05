import { KEY_ATTRIBUTE_NAME } from "./globals";
import { Listeners, ComponentListener } from "./types/listeners";
import {
  assignToComponentsGlobalProps,
  getComponentsGlobalProps,
} from "./components-global-props";
import generateKey, { REGEX_CUSTOM_ATTR_KEY_VALUE } from "./generate-el-key";
import getElement from "../utilities/get-element";
import { ManagerEl } from "./manager-el";
import insertEventListener from "./insert-event-listener";
import { ManagerElFactory } from "./manager-el-factory";

type GlobalProps = Record<string, any>;
type Props = Record<string, any>;
type InjectedProps = Record<string, any>;
type LifeCycleCallback = () => void;

interface ComponentThisData {
  listeners: Set<ComponentListener>;
  firstElement: Element | null;
  propsDefined?: Map<string, Props>;
  mountedFns: Set<LifeCycleCallback>;
  unmountedFns?: Set<LifeCycleCallback>;
  updatedFns: Set<LifeCycleCallback>;
  mounted: boolean;
  els: ManagerEl[];
}

export interface ComponentThis extends Listeners, Props {}

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
  };

  readonly globalProps: GlobalProps = getComponentsGlobalProps();
  readonly g: GlobalProps = this.globalProps;
  readonly props: Props = {};
  readonly p: Props = this.props;
  readonly injectedProps: InjectedProps = {};
  readonly i: InjectedProps = this.injectedProps;
  readonly name: string;

  parent: ComponentThis | null = null;
  children: string = "";

  constructor(name: string, parent?: ComponentThis) {
    this.name = name;
    this.parent = parent || null;
    return this;
  }

  toGlobal(value: Record<string, any>) {
    assignToComponentsGlobalProps(value);
    return this;
  }

  toParent(value: Record<string, any>) {
    this.parent && Object.assign(this.parent.injectedProps, value);
    return this;
  }

  defineProps(value: Record<string, any>): string;
  defineProps(key: string, value: Record<string, any>): string;
  defineProps(
    keyOrProps: (string | number) | Record<string, any>,
    value?: Record<string, any>
  ) {
    const isKey = typeof keyOrProps === "string";
    const props = (isKey ? value : keyOrProps) as Record<string, any>;

    if (!this.__data.propsDefined) this.__data.propsDefined = new Map();

    const key = isKey ? keyOrProps : this.__data.propsDefined.size;

    this.__data.propsDefined.set(key.toString(), props);

    return "_" + key.toString();
  }

  el<E extends Element = Element>(): [
    managerEl: ReturnType<typeof ManagerElFactory<E>>,
    key: string
  ];

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

    managerEl._ = getElement(selectorOrElement) as E;
    return managerEl;
  }

  onMount(fn: () => void) {
    this.__data.mountedFns.add(fn);
    return this;
  }

  onUnmount(fn: () => void) {
    if (!this.__data.unmountedFns) this.__data.unmountedFns = new Set();
    this.__data.unmountedFns.add(fn);
    return this;
  }

  onUpdate(fn: () => void) {
    this.__data.updatedFns.add(fn);
    return this;
  }
}

export function getComponentThisData(componentThis: ComponentThis) {
  return componentThis.__data;
}
export function dispatchUpdatedLifeCycle(componentThis: ComponentThis) {
  getComponentThisData(componentThis).updatedFns?.forEach((f) => f());
}

export function dispatchMountedLifeCycle(componentThis: ComponentThis) {
  getComponentThisData(componentThis).mounted = true;

  getComponentThisData(componentThis).mountedFns?.forEach((f) => f());
}

export function dispatchUnmountedLifeCycle(componentThis: ComponentThis) {
  getComponentThisData(componentThis).unmountedFns?.forEach((f) => f());
}

export function getComponentThisProps(parent: ComponentThis, key: string) {
  return getComponentThisData(parent).propsDefined?.get(key);
}
export function isMounted(componentThis: ComponentThis) {
  return getComponentThisData(componentThis).mounted;
}

export function setComponentThisFirstElement(
  componentThis: ComponentThis,
  newValue: Element | null
) {
  const d = getComponentThisData(componentThis);

  if (!newValue || d.firstElement === newValue) return;

  [...d.listeners].map((o) => {
    o.removeListener = insertEventListener(newValue, o.listener, ...o.args);
    return o;
  });

  d.firstElement = newValue;
}

function getElementsForElsManager(this: ComponentThis) {
  const els: ComponentThis["els"] = getComponentThisData(this).els;

  for (const el of els) {
    el._ = document.querySelector(`[${KEY_ATTRIBUTE_NAME}="${el.key}"]`);
  }
}
