declare type EventMap = WindowEventMap & DocumentEventMap & HTMLElementEventMap & SVGElementEventMap;
export declare type RemoveListener = () => void;
export declare type ListenerCallback<Event> = (fn: (event: Event) => void, options?: AddEventListenerOptions) => RemoveListener;
export declare type Listeners = {
    [Property in keyof EventMap as `${string & Property}$`]: ListenerCallback<EventMap[Property]>;
};
export declare type ComponentListener = {
    listener: string;
    args: [fn: Function, options: AddEventListenerOptions];
    removeListener?: () => void;
};
export {};
