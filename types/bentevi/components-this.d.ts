import { Listeners, ComponentListener } from "./types/listeners";
import { ManagerEl } from "./manager-el";
import { ManagerElFactory } from "./manager-el-factory";
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
    sharedData: Record<string, any>;
}
export interface ComponentThis extends Listeners, Props {
}
export declare class ComponentThis {
    __data: ComponentThisData;
    readonly props: Props;
    readonly p: Props;
    readonly name: string;
    parent: ComponentThis | null;
    children: string;
    constructor(name: string, parent?: ComponentThis);
    share(o: Record<string, any>): void;
    reshare(o: Record<string, any>): void;
    use<T>(key: string): T;
    defineProps(o: Record<string, any>): string;
    defineProps(key: string, o: Record<string, any>): string;
    el<E extends Element = Element>(): [
        managerEl: ReturnType<typeof ManagerElFactory<E>>,
        key: string
    ];
    el<E extends Element = Element>(selectorOrElement?: string | Element): ReturnType<typeof ManagerElFactory<E>>;
    onMount(fn: () => void): this;
    onUnmount(fn: () => void): this;
    onUpdate(fn: () => void): this;
}
export {};
