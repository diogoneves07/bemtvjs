export type EventMap = WindowEventMap &
  DocumentEventMap &
  HTMLElementEventMap &
  SVGElementEventMap;

export type RemoveListener = () => void;
export type ListenerCallback<Event> = (
  fn: (event: Event) => void,
  options?: AddEventListenerOptions
) => RemoveListener;

export type Listeners = {
  [Property in keyof EventMap as `${string & Property}$`]: ListenerCallback<
    EventMap[Property]
  >;
};

export type SimpleComponentDOMListener = {
  listener: string;
  fn: Function;
  options: AddEventListenerOptions;
  removeListener?: () => void;
};
