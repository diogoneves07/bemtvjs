function isTextPossibleCSS(text: string) {
  const props = text.replaceAll(/\s/g, "").split(";");

  if (props.length === 1) return false;

  const check = props.find((value, index) => {
    if (index % 2 === 1) {
      return value.length > 1 && !value.includes(":");
    }
    return false;
  });

  return !check ? true : false;
}
function isTextPossibleAttrs(text: string) {
  const check = text.split(/["]/g).find((value, index) => {
    if (index % 2 === 0 && value) {
      return !value.includes("=") || value.trim().split(" ").length > 1;
    }
    return false;
  });
  return !check ? true : false;
}
export function isTagChildren(tagData: string) {
  const text = tagData.replaceAll(/(\s*=\s*)/g, "=");
  const lastIndexOfDoubleQuote = text.lastIndexOf('"');
  const possibleAttrs = text.substring(0, lastIndexOfDoubleQuote + 1);
  const possibleCSS =
    lastIndexOfDoubleQuote === -1
      ? text
      : text.substring(lastIndexOfDoubleQuote + 1);
  let hasAttrs = false;

  if (possibleAttrs) {
    hasAttrs = isTextPossibleAttrs(possibleAttrs);

    if (hasAttrs) return false;
  }

  const hasCSS = possibleCSS ? isTextPossibleCSS(possibleCSS) : false;

  return !hasAttrs && !hasCSS;
}
