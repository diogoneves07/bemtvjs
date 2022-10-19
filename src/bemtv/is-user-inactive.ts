let userInactive = false;
[
  "mousedown",
  "mousemove",
  "keypress",
  "scroll",
  "touchstart",
  "touchmove",
].forEach((l) => {
  document.addEventListener(l, () => (userInactive = false), true);
});

setInterval(() => {
  userInactive = true;
}, 2000);

export function isUserInactive() {
  return userInactive;
}
