let userInactive = false;
let setTimeoutId: number | undefined;
[
  "mousedown",
  "mousemove",
  "keypress",
  "scroll",
  "touchstart",
  "touchmove",
].forEach((l) => {
  document.addEventListener(
    l,
    () => {
      userInactive = false;

      clearTimeout(setTimeoutId);
      setTimeoutId = setTimeout(() => (userInactive = true), 2000);
    },
    true
  );
});

setTimeout(() => (userInactive = true), 2000);

export function isUserInactive() {
  return userInactive;
}
