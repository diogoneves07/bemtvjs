import {
  REGEX_FORCED_ATTR,
  REGEX_FORCED_ATTR_VALUE,
} from "../bemtv/generate-forced-el-attrs";

export default function getForcedAttrs(tagContent: string) {
  let forcedAttrs: string[] | undefined;

  tagContent = tagContent.replaceAll(REGEX_FORCED_ATTR, (key) => {
    const cleanAttrs = (key.match(REGEX_FORCED_ATTR_VALUE) as string[])[0];
    if (!forcedAttrs) {
      forcedAttrs = [cleanAttrs];
    } else {
      forcedAttrs.push(cleanAttrs);
    }
    return "";
  });

  return {
    attrs: forcedAttrs,
    newTagContent: tagContent,
  };
}
