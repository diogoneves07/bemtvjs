import { LIBRARY_NAME_IN_ERRORS_MESSAGE } from "./../globals";
import { KEY_ATTRIBUTE_NAME } from "../bentevi/globals";
import compactArrayJoiningTextItems from "./compact-array-joining-text-items";
import createTagObject from "./create-tag-object";
import getAttributesDefinedByKeys from "./get-attributes-defined-by-keys";
import removeTemplateComments from "./remove-template-comments";
import removeTemplateEmptyLines from "./remove-template-empty-lines";
import scapeLiteralLibrarySymbols from "./scape-literal-library-symbols";
import { TagPropsTree } from "./types/template";

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
}

export default function makeTemplateTree(pureTemplate: string) {
  const TAG_TREE: (TagPropsTree | null)[] = [];

  let mutableTemplate = scapeLiteralLibrarySymbols(
    removeTemplateEmptyLines(removeTemplateComments(pureTemplate))
  ).replaceAll(/\s~\s/g, "\n\n");

  let tagsObjectId = -1;

  const replaceTagIndexByTagObject = (findTagsObjectsId: string[]) => {
    return findTagsObjectsId.map((value) => {
      // "~" Previously used to avoid conflict with normal numbers in template
      if (value.slice(-1) !== "~") return value;

      const possibleIndex = parseFloat(value.slice(0, -1));

      if (isNaN(possibleIndex)) return value;

      const index = possibleIndex;

      const tagChild = TAG_TREE[index];

      //* Set null because the item is a child of another.
      TAG_TREE[index] = null;

      return tagChild;
    }) as TagPropsTree["children"];
  };

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

      const tagObject = createTagObject(tagName, tagContent);

      if (!tagObject) return "";

      attrsDefinedByKeys &&
        setAttributesDefinedByKeys(tagObject, attrsDefinedByKeys);

      tagsObjectId++;

      const findTagsObjectsId = tagObject.children
        ? tagObject.children.split(/([0-9]*~)/)
        : null;

      let children: TagPropsTree["children"] | null = null;

      if (findTagsObjectsId)
        children = replaceTagIndexByTagObject(findTagsObjectsId);

      const newTagValues = tagObject as unknown as TagPropsTree;

      newTagValues.children =
        children && compactArrayJoiningTextItems(children);

      TAG_TREE.push(newTagValues);

      return `${tagsObjectId}~`; // Use "~" to avoid conflict with normal numbers in template
    });
  } while (mutableTemplate.includes("["));

  return TAG_TREE.filter((v) => v) as TagPropsTree[];
}
