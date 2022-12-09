import isSelfClosingTag from "./is-self-closing-tag";
import { TagProps } from "./types/template";

export default function mountHTMLTag(tagProps: TagProps) {
  const { tagName, children, attributes, cssClassName } = tagProps;
  let tagAttrs = attributes;
  if (cssClassName) {
    tagAttrs = tagAttrs.replaceAll(/(\s*=\s*)/g, "=");
    const classAttrIndex = tagAttrs.search(/(?<=\s?class=")/);

    if (classAttrIndex > -1) {
      tagAttrs = `${tagAttrs.slice(
        0,
        classAttrIndex
      )}${cssClassName} ${tagAttrs.slice(classAttrIndex)}`;
    } else {
      tagAttrs += ` class = "${cssClassName}" `;
    }
  }

  if (isSelfClosingTag(tagName)) return `<${tagName} ${tagAttrs}/>`;

  return `<${tagName} ${tagAttrs}>${children.trim()}</${tagName}>`;
}
