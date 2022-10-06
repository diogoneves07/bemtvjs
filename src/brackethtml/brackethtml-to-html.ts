import { LIBRARY_NAME_IN_ERRORS_MESSAGE } from "../globals";
import { KEY_ATTRIBUTE_NAME } from "../bentevi/globals";
import createTagObject from "./create-tag-object";
import getAttributesDefinedByKeys from "./get-attributes-defined-by-keys";
import scapeLiteralLibrarySymbols from "./scape-literal-library-symbols";
import mountHTMLTag from "./mount-html-tag";

const regexTagData = /[a-z-0-9]*\[[^\]\[]*?\]/g;
const regexIsValidTag = /^[a-z](-?[a-z0-9])*/;

function setAttributesDefinedByKeys(
  tagObject: Exclude<ReturnType<typeof createTagObject>, false>,
  attrsDefinedByKeys: string[]
) {
  if (attrsDefinedByKeys) {
    for (const value of attrsDefinedByKeys) {
      tagObject.attributes += ` ${KEY_ATTRIBUTE_NAME}="${value}"`;
    }
  }
  return tagObject;
}

export default function brackethtmlToHTML(pureTemplate: string) {
  let mutableTemplate = scapeLiteralLibrarySymbols(pureTemplate);

  let lastMutableTemplate = "";
  do {
    if (lastMutableTemplate === mutableTemplate) {
      throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} Template is invalid! There are no equality of brackets "[" and "]".`;
    }

    lastMutableTemplate = mutableTemplate;

    mutableTemplate = mutableTemplate.replaceAll(regexTagData, (value) => {
      const leftBracketIndex = value.indexOf("[");

      const tagName = value.slice(0, leftBracketIndex);

      if (!regexIsValidTag.test(tagName)) return "";

      let tagContent = value.slice(leftBracketIndex + 1, -1);

      const { attrs: attrsDefinedByKeys, newTagContent } =
        getAttributesDefinedByKeys(tagContent);

      tagContent = newTagContent;

      let tagObject = createTagObject(tagName, tagContent, true);

      if (!tagObject) return "";

      if (attrsDefinedByKeys) {
        tagObject = setAttributesDefinedByKeys(tagObject, attrsDefinedByKeys);
      }

      return mountHTMLTag(tagObject); // Use "~" to avoid conflict with normal numbers in template
    });
  } while (mutableTemplate.includes("["));

  return mutableTemplate;
}
