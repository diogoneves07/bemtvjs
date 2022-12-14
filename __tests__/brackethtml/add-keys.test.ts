import { generateForcedKeyAttr } from "../../src/bemtv/generate-forced-el-attrs";
import brackethtmlTranspiler from "../../src/brackethtml/brackethtml-transpiler";
import { KEY_ATTRIBUTE_NAME } from "../../src/globals";

describe("Checks the use of Brackethtml “keys” braces in tags", () => {
  it(`Should create “${KEY_ATTRIBUTE_NAME}” atrribute in html button tag`, () => {
    const key1 = generateForcedKeyAttr();
    const b = brackethtmlTranspiler(`button[${key1}]`);

    expect(b.html).toContain(KEY_ATTRIBUTE_NAME);
  });

  it(`Should create “${KEY_ATTRIBUTE_NAME}” atrribute with two “keys” in html button tag`, () => {
    const key1 = generateForcedKeyAttr();
    const key2 = generateForcedKeyAttr();
    const b = brackethtmlTranspiler(`button[${key1}${key2}]`);

    expect(b.html).toContain(KEY_ATTRIBUTE_NAME);

    const v = b.html.split("=")[1].match(/"[\s\S]*"/) as string[];
    expect(v[0].split(" ").length).toBe(2);
  });
});
