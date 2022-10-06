import { Listeners, ComponentListener } from "./types/listeners";
import generateKey, { REGEX_CUSTOM_ATTR_KEY_VALUE } from "./generate-el-key";
import getElement from "../utilities/get-element";
import { ManagerEl } from "./manager-el";
import { ManagerElFactory } from "./manager-el-factory";
import reshareProps from "./reshare-props";
import useSharedProp from "./use-shared-prop";
import { getElementsForElsManager } from "./work-with-components-this";

type Props = Record<string, any>;
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
  sharedData: Record<string, any>;
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
    sharedData: {},
  };

  readonly props: Props = {};
  readonly p: Props = this.props;
  readonly name: string;

  parent: ComponentThis | null = null;
  children: string = "";

  constructor(name: string, parent?: ComponentThis) {
    this.name = name;
    this.parent = parent || null;
    return this;
  }

  share(o: Record<string, any>) {
    Object.assign(this.__data.sharedData, o);
  }

  reshare(o: Record<string, any>) {
    reshareProps(this, o);
  }

  use<T>(key: string) {
    return useSharedProp(this, key) as T;
  }

  defineProps(o: Record<string, any>): string;
  defineProps(key: string, o: Record<string, any>): string;
  defineProps(
    keyOrProps: (string | number) | Record<string, any>,
    o?: Record<string, any>
  ) {
    const isKey = typeof keyOrProps === "string";
    const props = (isKey ? o : keyOrProps) as Record<string, any>;

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
