export default function insertDOMListener(
  el: Element,
  name: string,
  fn: Function,
  options?: AddEventListenerOptions
) {
  el.addEventListener(name as any, fn as any, options);
  return () => {
    el.removeEventListener(
      name as any,
      fn as any,
      options && options.capture ? true : false
    );
  };
}
