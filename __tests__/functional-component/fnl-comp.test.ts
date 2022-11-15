import { _ } from "../../src/main";
import { resetTestEnvironment } from "../test-utilities/reset-test-environment";

resetTestEnvironment();
describe("Functional components", () => {
  it("Should create a functional component", (done) => {
    const { render } = _`AppFn`(({ template, onMount }) => {
      onMount(() => {
        expect(document.body.textContent?.trim()).toBe("Hey!");
        done();
      });
      template`Hey!`;
    });

    render();
  });
});
