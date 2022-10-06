import {
  REGEX_CUSTOM_ATTR_KEY,
  REGEX_CUSTOM_ATTR_KEY_VALUE,
} from "./../bentive/generate-el-key";

export default function getAttributesDefinedByKeys(tagContent: string) {
  let attributesDefinedByKeys: string[] | undefined;

  tagContent = tagContent.replaceAll(REGEX_CUSTOM_ATTR_KEY, (key) => {
    const keyWithoutTokens = (
      key.match(REGEX_CUSTOM_ATTR_KEY_VALUE) as string[]
    )[0];
    if (!attributesDefinedByKeys) {
      attributesDefinedByKeys = [keyWithoutTokens];
    } else {
      attributesDefinedByKeys.push(keyWithoutTokens);
    }
    return "";
  });
  return {
    attrs: attributesDefinedByKeys,
    newTagContent: tagContent,
  };
}
