import { ElementInst } from "../../src/bemtv/element-inst";
import { _ } from "../../src/main";

import { resetTestEnvironment } from "../test-utilities//reset-test-environment";

resetTestEnvironment();

describe("Bind element props and attrs", () => {
  it("Should get the element", () => {
    const { onMount, $, template, render } = _`App`({
      spanElement: undefined,
    } as { spanElement?: HTMLSpanElement });

    onMount(() => {
      expect($?.spanElement?.tagName).toBe("SPAN");
    });

    template`div[span[ span[ $spanElement<this ] ]]`;

    render();
  });

  it("Should allow to use more than two binds", () => {
    const { onMount, $, template, render } = _`User`({
      my: undefined,
      text: "",
    });

    onMount(() => {
      expect(($.my as any).tagName).toBe("DIV");
      expect($.text).toBe("BemtvJS");
    });

    template`div[ $my<this $text<textContent ~ BemtvJS ]`;

    render();
  });

  it("Should get the ElementInst", () => {
    const { onMount, $, template, render } = _`App`({
      spanInst: undefined,
    } as { spanInst?: ElementInst<HTMLSpanElement> });

    onMount(() => {
      expect($?.spanInst?.it?.tagName).toBe("SPAN");
    });

    template`div[span[ span[ $spanInst<inst ] ]]`;

    render();
  });

  it("Should get the textarea value", () => {
    const { onMount, $, template, render } = _`App`({
      textareaValue: "",
    });

    onMount(() => {
      expect($.textareaValue.trim()).toBe("Bemtv");
    });

    template`textarea[ $textareaValue<value Bemtv]`;

    render();
  });
  it("Should get the select options", () => {
    const { onMount, $, template, render } = _`App`({
      options: [],
      selectElement: undefined,
    } as { selectElement?: HTMLSelectElement; options: string[] });

    const event = new Event("input");

    onMount(() => {
      const a = Array.from(($.selectElement as HTMLSelectElement).options);
      a[2].selected = true;
      a[0].selected = true;

      ($.selectElement as HTMLSelectElement).dispatchEvent(event);

      expect($.options).toContainEqual(["1", "3"]);
    });

    template`select[
        $selectElement<this
        $options<value
      
        multiple="true" ~
      
        option[value="1" ~ 1]
        option[value="2" ~ 2]
        option[value="3" ~ 3]
        option[value="4" ~ 4]]`;

    render();
  });

  it("Should get the checked inputs values", () => {
    const { onMount, $, template, render } = _`App`({
      options: [],
    });

    onMount(() => {
      expect($.options).toContainEqual(["1", "2"]);
    });

    template`
      input[ $inputs<checked type="checkbox" name='test' value="1" checked="true"]
      input[ type="checkbox" name='test' value="2" checked="true"]
      input[ type="checkbox" name='test' value="3"]`;

    render();
  });
});
