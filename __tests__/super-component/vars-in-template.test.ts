import { _ } from "../../src/main";
import { resetTestEnvironment } from "../test-utilities//reset-test-environment";

resetTestEnvironment();

beforeEach(() => {
  jest.spyOn(window, "requestAnimationFrame").mockImplementation((fn) => {
    fn(Date.now());
    return 1;
  });
});

describe("Checks the use of variables within the template", () => {
  it("Should define and use the variables", (done) => {
    const { onMount, template, render } = _`App`({
      count: 0,
    });

    onMount(() => {
      expect(document.body?.textContent?.trim()).toBe("0");
      done();
    });

    template(() => `$count`);

    render();
  });

  it("Should use the variable as attribute and value", (done) => {
    const { onMount, template, render } = _`App`({
      dataUser: 0,
    });

    onMount(() => {
      const span = document.getElementsByTagName("span")[0];
      expect(span.textContent?.trim()).toBe("Hey!");
      expect(span.getAttribute("data-user")).toBe("0");
      done();
    });

    template(() => `span[@dataUser ~ Hey!]`);

    render();
  });

  it("Should get the variables value through chaining", (done) => {
    const { onMount, template, render } = _`App`({
      user: {
        data: {
          name: "unknown",
          src: "img.jpg",
        },
      },
    });

    onMount(() => {
      expect(document.body?.textContent?.trim()).toBe("unknown");
      done();
    });

    template(() => `$user.data.name img[@user.data.src]`);

    render();
  });

  it("Should not allow unknown variables", () => {
    const { template, render } = _`App`({
      user: {
        data: {
          name: "unknown",
        },
      },
    });

    template(() => `$unknownVar $user.data.phoneNumber`);

    expect(() => {
      render();
    }).toThrow();
  });

  it("Should not allow bad values", () => {
    const { template, render } = _`App`({
      user: {
        data: ["unknown", 25],
      },
    });

    template(() => `$user.data`);

    expect(() => {
      render();
    }).toThrow();
  });

  it("Should allow optional variables", (done) => {
    const { onMount, template, render } = _`App`({
      user: {
        data: {
          name: "unknown",
        },
      },
    });

    onMount(() => {
      expect(document.body?.textContent?.trim()).toBe("");
      done();
    });

    template(() => `$unknownVar? $user.data.phoneNumber?`);

    render();
  });
});
