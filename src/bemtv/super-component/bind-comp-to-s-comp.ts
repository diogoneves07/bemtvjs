import { LIBRARY_NAME_IN_ERRORS_MESSAGE } from "../../globals";
import toKebabCase from "../../utilities/to-kebab-case";
import { ComponentThis } from "../components-this";
import { PIPE_SYMBOL } from "../pipes/main";
import { ComponentProps } from "../types/super-component-data";
import { getComponentThisData } from "../work-with-components-this";
import { SuperComponent } from "./super-component";
import {
  addListenerToComponent,
  getSuperComponentData,
  setRunningComponent,
  getComponentVars,
} from "./work-with-super-component";

export function bindComponentToSuperComponent(
  sComp: SuperComponent,
  c: ComponentThis
) {
  const data = getSuperComponentData(sComp);

  const templatePropertyValues: Map<string, string> = new Map();

  const getVarsInTemplate = (p: string) => {
    const prefix = p[0];
    const property = p.slice(1);
    const getLastValue = templatePropertyValues.get(property);

    if (getLastValue) return getLastValue;

    const vars = getComponentVars(sComp) as ComponentProps["vars"];
    const props = vars.props;

    const hasPathToProp = property.includes(".");
    const pathToProp = hasPathToProp ? property.split(".") : false;

    let value: any;

    if (prefix === "@") {
      const varsAndProps = { ...vars, ...props };
      let propName = property;

      value = pathToProp
        ? pathToProp.reduce((o, p) => {
            propName = p;
            return o[p];
          }, varsAndProps)
        : varsAndProps[property];

      value = ` ${toKebabCase(propName)} = "${value}" `;
    } else {
      value = pathToProp
        ? pathToProp.reduce((o, p) => o[p], vars)
        : vars[property];
    }

    if (Object.hasOwn(value, PIPE_SYMBOL)) {
      for (const pipe of value[PIPE_SYMBOL]) {
        value = pipe(value);
      }

      templatePropertyValues.set(property, value);

      return value;
    }

    if (typeof value !== "string" && typeof value !== "number") {
      console.error(value);
      throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} In the "${c.name}" component the template has a value that is not string, number or uses pipes: ${value}`;
    }

    templatePropertyValues.set(property, value.toString());

    return value;
  };

  const template = () => {
    setRunningComponent(sComp, c);
    let templateValue = data.initialTemplate() as string;

    templateValue = templateValue.replaceAll(/[$|@][.\w]*/g, getVarsInTemplate);

    setRunningComponent(sComp);
    return templateValue;
  };

  let componentFirstElement: undefined | Element;

  const addClassesToComponent = () => {
    const { firstElement } = getComponentThisData(c);

    if (componentFirstElement === firstElement) return;

    if (firstElement) {
      componentFirstElement = firstElement;
      for (const s of data.classes) {
        if (!firstElement.classList.contains(s)) firstElement.classList.add(s);
      }
    }
  };

  c.onUnmount(() => data.components.delete(c));
  c.onMount(addClassesToComponent);
  c.onUpdate(addClassesToComponent);

  let withoutTypes = c as any;

  for (const l of data.listeners) {
    addListenerToComponent(sComp, l, c);
  }

  for (const l of data.lifeCycles) {
    for (const callback of l[1]) {
      withoutTypes[l[0]](callback);
    }
  }

  for (const [fnName, args] of data.fns) {
    switch (fnName) {
      case "children":
        withoutTypes.children = args[0](withoutTypes.children);
        break;
      case "props":
        withoutTypes.props = args[0](withoutTypes.props);

        break;
      default:
        withoutTypes[fnName](...args);
        break;
    }
  }

  data.components.set(c, {
    vars: { ...data.initVars, children: c.children, props: c.props },
    template,
    templatePropertyValues,
  });

  return template;
}
