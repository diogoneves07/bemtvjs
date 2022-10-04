import { ComponentListener } from "./types/listeners";
import { gooberCSS } from "./css-template";
import { Listeners } from "./types/listeners";
import { css } from "goober";
interface ManagerElData<E> {
    listeners: Set<ComponentListener>;
    element: E | null;
    CSSClasses: string[];
    applyCSSWhenElementIsAvallable: Parameters<typeof gooberCSS>[];
    reapplyCSSClasses: (m: ManagerEl) => void;
}
export declare const ALL_ELEMENTS_MANAGER: WeakMap<Element, ManagerEl<Element>>;
export interface ManagerEl<E extends Element = Element> extends Listeners {
}
export declare class ManagerEl<E = Element> {
    readonly key: string;
    protected readonly __data: ManagerElData<E>;
    set _(v: E | null);
    get _(): E | null;
    constructor(key: string);
    css(...args: Parameters<typeof css>): this;
}
export declare function getManagerElData(m: ManagerEl): ManagerElData<Element>;
export {};
