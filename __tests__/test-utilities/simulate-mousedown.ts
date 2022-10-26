export const simulateMousedown = (
  e: Element | Document | Window = document
) => {
  e.dispatchEvent(
    new MouseEvent("mousedown", {
      view: window,
      bubbles: true,
      cancelable: true,
    })
  );
};
