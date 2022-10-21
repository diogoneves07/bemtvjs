import brackethtmlTranspiler from "../../src/brackethtml/brackethtml-transpiler";
import { TEMPLATE_SYMBOLS } from "../../src/brackethtml/globals";

describe("Checks usage rules for Brackethtml", () => {
  it("Should return only html button tag", () => {
    const b = brackethtmlTranspiler("button[]");
    expect(b.html.replace(/[ ]/g, "")).toBe("<button></button>");
    expect(b.css).toBe("");
  });
  it("Should return html button tag and CSS-In-JS", () => {
    const b = brackethtmlTranspiler("button[color:blue; ~ ]");
    expect(b.html.replace(/[  ]/g, " ")).toContain("class");
    expect(b.css).not.toBe("");
  });
  it("Should return html button tag and attributes", () => {
    const b = brackethtmlTranspiler('button[data-test="test" ~ ]');
    expect(b.html).toContain("<button data-test");
    expect(b.css).toBe("");
  });
  it("Should return html button tag and children", () => {
    const b = brackethtmlTranspiler("button[color:blue; span[Hello]]");
    expect(b.html.replace(/[ ]/g, "")).toContain("color:blue;");
    expect(b.css).toBe("");
  });

  it("Should return html button tag, CSS-In-JS, attributes and children", () => {
    const b = brackethtmlTranspiler(
      'button[data-test="test" color:blue; ~  span[Hello]]'
    );
    expect(b.html.replace(/[ ]/g, "")).toContain("<span>Hello</span>");
    expect(b.html).toContain("<button data-test");
    expect(b.css).not.toBe("");
  });

  it("Should combine CSS-In-JS class with “.app”", () => {
    const b = brackethtmlTranspiler('button[class="App" color:blue; ~ ]');
    expect(b.html.replace(/[  ]/g, " ")).toContain("class");
    expect(b.html.replace(/[  ]/g, " ")).toContain("App");
    expect(b.css).not.toBe("");
  });

  test("Normal HTML tags and auto-closing tag", () => {
    const b = brackethtmlTranspiler("button[]");
    const bra = brackethtmlTranspiler("img[] img[]");

    expect(b.html.replace(/[ ]/g, "")).toBe("<button></button>");
    // Should be have two img tags to test the cache
    expect(bra.html.replace(/[ ]/g, "")).toBe("<img/><img/>");
  });

  it("Should contain “~” symbol in button tag", () => {
    const b = brackethtmlTranspiler("button[ (~) ]");
    expect(b.html).toContain("~");
  });

  it(`Should escape these characters ${Object.values(TEMPLATE_SYMBOLS)
    .map((v) => `“${v}”`)
    .join(" ")} in button tag`, () => {
    const characters = Object.values(TEMPLATE_SYMBOLS)
      .map((v) => `(${v})`)
      .join(" ");

    const b = brackethtmlTranspiler(`button[ ${characters} ]`);
    for (const c of Object.values(TEMPLATE_SYMBOLS)) {
      expect(b.html).toContain(c);
    }
  });

  it("Should throw an error", () => {
    expect(() => {
      brackethtmlTranspiler("button[ Hello ");
    }).toThrow();
  });
});
