import { LIBRARY_NAME_IN_ERRORS_MESSAGE } from "../globals";
import { KEY_ATTRIBUTE_NAME } from "../bemtv/globals";
import createTagObject from "./create-tag-object";
import getAttributesDefinedByKeys from "./get-attributes-defined-by-keys";
import scapeLiteralLibrarySymbols from "./scape-literal-library-symbols";
import mountHTMLTag from "./mount-html-tag";
import unscapeLiteralLibrarySymbols from "./unscape-literal-library-symbols";

const regexTagData = /[a-z-0-9]*\[[^\]\[]*?\]/g;

function setAttributesDefinedByKeys(
  tagObject: Exclude<ReturnType<typeof createTagObject>, false>,
  attrsDefinedByKeys: string[]
) {
  tagObject.attributes += ` ${KEY_ATTRIBUTE_NAME}="${attrsDefinedByKeys.join(
    " "
  )}"`;
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

      let tagContent = value.slice(leftBracketIndex + 1, -1);

      const { attrs: attrsDefinedByKeys, newTagContent } =
        getAttributesDefinedByKeys(tagContent);

      tagContent = newTagContent;

      let tagObject = createTagObject(tagName, tagContent);

      if (attrsDefinedByKeys) {
        tagObject = setAttributesDefinedByKeys(tagObject, attrsDefinedByKeys);
      }

      return mountHTMLTag(tagObject);
    });
  } while (mutableTemplate.includes("["));

  return unscapeLiteralLibrarySymbols(mutableTemplate);
}
