import { _, dlPipe, olPipe, ulPipe } from "../../src/main";
import { resetTestEnvironment } from "../test-utilities//reset-test-environment";

resetTestEnvironment();

describe("Check the variables for each component", () => {
  it(`Should create clones for each data structure used by 
      the first instance and isolate from the second`, (done) => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const user = {
      name: "unknown",
      age: 23,
      home: {
        city: "unknown",
        country: "unknown",
        dataArray: data,
        dataSet: new Set(data),
        dataMap: new Map(data.map((v) => [v, v * 10])),
      },
    };
    const { $, onMount, render } = _("App", {
      user,
    });

    let isolate = false;

    onMount(() => {
      if (isolate) {
        expect($.user.name).toBe(user.name);
        expect($.user.home.country).toBe(user.home.country);
        expect($.user.home.dataArray.length).toBe(user.home.dataArray.length);
        expect($.user.home.dataSet.size).toBe(user.home.dataSet.size);
        expect($.user.home.dataMap.size).toBe(user.home.dataMap.size);

        expect($.user.home.dataArray !== user.home.dataArray).toBeTruthy();
        expect($.user.home.dataSet !== user.home.dataSet).toBeTruthy();
        expect($.user.home.dataMap !== user.home.dataMap).toBeTruthy();

        done();
        return;
      }

      const o = $.user;

      o.name = "Diogo Neves";
      o.home.country = "Brasil";
      o.home.dataArray.push(10);
      o.home.dataSet.add(10);
      o.home.dataMap.set(10, 10);
      isolate = true;
    });

    render();
    render();
  });

  test(`With data structures using pipes,
        should create clones for each data structure used by 
        the first instance and isolate from the second`, (done) => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const user = dlPipe({
      name: "unknown",
      age: 23,
      home: {
        city: "unknown",
        country: "unknown",
        dataArray: olPipe(data),
        dataSet: ulPipe(new Set(data)),
        dataMap: dlPipe(new Map(data.map((v) => [v, v * 10]))),
      },
    });
    const { $, onMount, render } = _("App", {
      user,
    });

    let isolate = false;

    onMount(() => {
      if (isolate) {
        expect($.user.name).toBe(user.name);
        expect($.user.home.country).toBe(user.home.country);
        expect($.user.home.dataArray.length).toBe(user.home.dataArray.length);
        expect($.user.home.dataSet.size).toBe(user.home.dataSet.size);
        expect($.user.home.dataMap.size).toBe(user.home.dataMap.size);

        expect($.user.home.dataArray !== user.home.dataArray).toBeTruthy();
        expect($.user.home.dataSet !== user.home.dataSet).toBeTruthy();
        expect($.user.home.dataMap !== user.home.dataMap).toBeTruthy();

        done();
        return;
      }

      const o = $.user;

      o.name = "Diogo Neves";
      o.home.country = "Brasil";
      o.home.dataArray.push(10);
      o.home.dataSet.add(10);
      o.home.dataMap.set(10, 10);
      isolate = true;
    });

    render();
    render();
  });

  test(`Create dynamics components variables`, (done) => {
    const { onMount, keepInst, $, render } = _("App", {
      name: "Diogo Neves",
    } as { name: string; count?: number });

    let isolate = false;
    onMount(() => {
      if (isolate) {
        expect($.count).toBeUndefined();
        return;
      }

      isolate = true;

      $.count = 10;
      setTimeout(
        keepInst(() => {
          expect($.count).toBe(10);

          done();
        }),
        50
      );
    });

    render();
    render();
  });
});
