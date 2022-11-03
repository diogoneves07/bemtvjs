export default function toKebabCase(string: string): string {
  const rdashAlpha = /(-?[A-Z])/g;
  return string.replace(rdashAlpha, (_all, letter: string) => {
    const l = letter.toLowerCase();
    return letter.includes("-") ? l : `-${l}`;
  });
}
