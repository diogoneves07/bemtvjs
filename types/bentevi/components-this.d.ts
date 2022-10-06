import { Listeners, ComponentListener } from "./types/listeners";
import { ManagerEl } from "./manager-el";
import { ManagerElFactory } from "./manager-el-factory";
import { GlobalProps } from "./types/global-props";
declare type Props = Record<string, any>;
declare type LifeCycleCallback = () => void;
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
export interface ComponentThis extends Listeners, Props {
}
export declare class ComponentThis {
    __data: ComponentThisData;
    readonly globalProps: GlobalProps;
    readonly g: GlobalProps;
    readonly props: Props;
    readonly p: Props;
    readonly name: string;
    parent: ComponentThis | null;
    children: string;
    constructor(name: string, parent?: ComponentThis);
    $(value: GlobalProps | Record<string, any>): this;
    defineProps(value: Record<string, any>): string;
    defineProps(key: string, value: Record<string, any>): string;
    el<E extends Element = Element>(): [
        managerEl: ReturnType<typeof ManagerElFactory<E>>,
        key: string
    ];
    el<E extends Element = Element>(selectorOrElement?: string | Element): ReturnType<typeof ManagerElFactory<E>>;
    onMount(fn: () => void): this;
    onUnmount(fn: () => void): this;
    onUpdate(fn: () => void): this;
}
export declare function getComponentThisData(componentThis: ComponentThis): ComponentThisData;
export declare function dispatchUpdatedLifeCycle(componentThis: ComponentThis): void;
export declare function dispatchMountedLifeCycle(componentThis: ComponentThis): void;
export declare function dispatchUnmountedLifeCycle(componentThis: ComponentThis): void;
export declare function getComponentThisProps(parent: ComponentThis, key: string): Props | undefined;
export declare function isMounted(componentThis: ComponentThis): boolean;
export declare function setComponentThisFirstElement(componentThis: ComponentThis, newValue: Element | null): void;
export {};
