import {
  LIBRARY_NAME_IN_ERRORS_MESSAGE,
  START_ATTRIBUTE_NAME,
} from "../globals";

import createTagObject from "./create-tag-object";
import getForcedAttrs from "./get-forced-attrs";
import scapeLiteralLibrarySymbols from "./scape-literal-library-symbols";
import mountHTMLTag from "./mount-html-tag";
import unscapeLiteralLibrarySymbols from "./unscape-literal-library-symbols";

const regexTagData = /[a-z-0-9]*\[[^\]\[]*?\]/g;

function setForcedAttrs(
  tagObject: Exclude<ReturnType<typeof createTagObject>, false>,
  forcedAttrs: string[]
) {
  const attrsType: Record<string, string[]> = {};

  for (const item of forcedAttrs) {
    const t = item.slice(0, item.indexOf("-"));
    const value = item.slice(item.indexOf("-") + 1);
    if (Object.hasOwn(attrsType, t)) {
      attrsType[t].push(value);
    } else {
      attrsType[t] = [value];
    }
  }

  for (const name of Object.keys(attrsType)) {
    tagObject.attributes += ` ${START_ATTRIBUTE_NAME}${name}="${attrsType[
      name
    ].join(" ")}"`;
  }
  return tagObject;
}

export default function brackethtmlToHTML(pureTemplate: string) {
  let mutableTemplate = scapeLiteralLibrarySymbols(pureTemplate);

  let lastMutableTemplate = "";
  do {
    if (lastMutableTemplate === mutableTemplate) {
      throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} Template is invalid! There are no equality of brackets “[“ and “]”.`;
    }

    lastMutableTemplate = mutableTemplate;

    mutableTemplate = mutableTemplate.replaceAll(regexTagData, (value) => {
      const leftBracketIndex = value.indexOf("[");

      const tagName = value.slice(0, leftBracketIndex);

      let tagContent = value.slice(leftBracketIndex + 1, -1);

      const { attrs: forcedAttrs, newTagContent } = getForcedAttrs(tagContent);

      tagContent = newTagContent;

      let tagObject = createTagObject(tagName, tagContent);

      if (forcedAttrs) {
        tagObject = setForcedAttrs(tagObject, forcedAttrs);
      }

      return mountHTMLTag(tagObject);
    });
  } while (mutableTemplate.includes("["));

  return unscapeLiteralLibrarySymbols(mutableTemplate);
}
