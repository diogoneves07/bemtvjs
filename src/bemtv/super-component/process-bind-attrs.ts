import {
  BIND_ATTRIBUTE_NAME,
  LIBRARY_NAME_IN_ERRORS_MESSAGE,
} from "../../globals";
import isNumber from "../../utilities/is-number";
import isString from "../../utilities/is-string";
import ComponentInst from "../component-inst";
import { getNodeComponentKeys } from "../nodes-component-keys";
import createElManager from "./create-el-manager";
import { SuperComponent } from "./super-component";
import {
  getComponentVars,
  runInComponentInst,
  updateComponentVars,
} from "./work-with-super-component";

export type ElementWithBindAttrs = {
  el: Element;
  tagName: string;
  perpertyName: string;
  lastPerpertyValue?: any;
  isString?: any;
  isFormElement: boolean;
  compVar: string;
};

export type ElementsWithBindAttrs = ElementWithBindAttrs[];

function getOrSetPropertyByPath(
  o: Record<string, any>,
  path: string,
  newValue?: any
) {
  let value: string | undefined = undefined;
  let currentObject = o;
  let lastObject = currentObject;
  let lastPropertyName = "";

  for (const k of path.trim().split(".")) {
    if (k) {
      lastPropertyName = k;
      lastObject = currentObject;
      value = currentObject[k];
      currentObject = currentObject[k];
    }
  }

  if (newValue !== undefined) {
    lastObject[lastPropertyName] = newValue;

    return newValue;
  }

  return value;
}

export function getElementsWithBindAttrs(cInst: ComponentInst) {
  const els: [el: Element, propertyValue: string[]][] = [];

  const rec = (nodes: Node[]) => {
    for (const n of nodes) {
      const keys = getNodeComponentKeys(n)?.includes(cInst.key);

      if (!keys) continue;

      if (!(n instanceof Element)) continue;

      const v = n.getAttribute(BIND_ATTRIBUTE_NAME);

      v && els.push([n, v.split(" ")]);

      rec(Array.from(n.children));
    }
  };

  rec(cInst.nodes);

  return els;
}

export function handleFormElement(
  sComp: SuperComponent,
  elementWithBindAttrs: ElementWithBindAttrs,
  propertyPath: string
) {
  const { el, tagName } = elementWithBindAttrs;
  const c = getComponentVars(sComp) as Record<string, any>;
  const compVarValue = getOrSetPropertyByPath(c, propertyPath);

  if (Array.isArray(compVarValue)) {
    if (tagName === "select") {
      compVarValue.length = 0;

      const oList = (el as HTMLSelectElement).querySelectorAll(
        "option:checked"
      );

      for (const o of Array.from(oList) as HTMLOptionElement[]) {
        compVarValue.push(o.value);
      }
    } else if (tagName === "input") {
      const type = el.getAttribute("type");

      if (type === "checkbox") {
        compVarValue.length = 0;

        const name = el.getAttribute("name");

        if (!name) {
          throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} The input checkbox must have a “name” attribute.`;
        }

        const inputs = document.querySelectorAll(
          `input[type="checkbox"][name=${name}]:checked`
        );

        for (const o of Array.from(inputs) as HTMLInputElement[]) {
          compVarValue.push(o.value);
        }
      }
    }
  } else {
    const value = (el as any).value;
    let v = isNumber(compVarValue) ? Number(value) : value;

    getOrSetPropertyByPath(sComp.$, propertyPath, v);

    updateComponentVars(sComp);
  }
}

export function processBindAttrs(
  sComp: SuperComponent,
  elementsWithBindAttrs: ElementsWithBindAttrs
) {
  const c = getComponentVars(sComp) as Record<string, any>;

  for (const bindObject of elementsWithBindAttrs) {
    const { el, lastPerpertyValue, perpertyName, isFormElement, compVar } =
      bindObject;

    if (isFormElement) continue;

    const isAttr = !(perpertyName in el);

    let value = isAttr
      ? el.getAttribute(perpertyName)
      : (el as any)[perpertyName];

    if (bindObject.isString === undefined) {
      bindObject.isString = isString(value);
    }

    value = bindObject.isString ? value.trim() : value;

    const compVarValue = getOrSetPropertyByPath(c, compVar);

    if (compVarValue === value) continue;

    bindObject.lastPerpertyValue = value;

    if (lastPerpertyValue !== value) {
      let v = isNumber(compVarValue) ? Number(value) : value;

      getOrSetPropertyByPath(sComp.$, compVar, v);

      updateComponentVars(sComp);
    }
  }
}

const formElements = ["select", "input", "textarea"];

export function setElementsWithBindAttrs(
  sComp: SuperComponent,
  cInst: ComponentInst,
  elementsWithBindAttrs: ElementsWithBindAttrs
) {
  const c = getComponentVars(sComp) as Record<string, any>;

  const listenerToElementInput = (
    elementWithBindAttrs: ElementWithBindAttrs,
    compVar: string
  ) => {
    runInComponentInst(sComp, cInst, () => {
      handleFormElement(sComp, elementWithBindAttrs, compVar);
    });
  };

  for (const [el, propertyValue] of getElementsWithBindAttrs(cInst)) {
    for (const v of propertyValue) {
      const [perpertyName, compVar] = v.split(":");

      const compVarValue = getOrSetPropertyByPath(c, compVar);

      if (perpertyName === "this" && compVarValue !== el) {
        getOrSetPropertyByPath(sComp.$, compVar, el);
        updateComponentVars(sComp);
        continue;
      }

      if (perpertyName === "el" && compVarValue?.it !== el) {
        getOrSetPropertyByPath(sComp.$, compVar, createElManager(el, cInst));
        updateComponentVars(sComp);
        continue;
      }

      const current = elementsWithBindAttrs.find((o) => {
        return o.el === el && o.compVar === compVar;
      });

      if (current) {
        if (current.el !== el) {
          handleFormElement(sComp, current, compVar);

          current.el.addEventListener("input", () => {
            listenerToElementInput(current, compVar);
          });
        }

        current.el = el;
        current.perpertyName = perpertyName;
      } else {
        const tagName = el.tagName.toLowerCase();

        const elementWithBindAttrs = {
          el,
          perpertyName,
          tagName: el.tagName.toLowerCase(),
          isFormElement: formElements.includes(tagName),
          compVar,
        };

        handleFormElement(sComp, elementWithBindAttrs, compVar);

        el.addEventListener("input", () => {
          listenerToElementInput(elementWithBindAttrs, compVar);
        });

        elementsWithBindAttrs.push(elementWithBindAttrs);
      }
    }
  }

  processBindAttrs(sComp, elementsWithBindAttrs);
}
