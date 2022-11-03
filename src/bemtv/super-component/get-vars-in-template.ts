import { LIBRARY_NAME_IN_ERRORS_MESSAGE } from "./../../globals";
import toKebabCase from "../../utilities/to-kebab-case";
import { PIPE_SYMBOL } from "../pipes/main";
import { ComponentProps } from "../types/super-component-data";
import { ComponentThis } from "../components-this";
import { getComponentVars } from "./work-with-super-component";
import { SuperComponent } from "./super-component";

// const varsPrefix = "$";
const varsLikeAttrPrefix = "@";
const regexTemplateVars = /[$|@][\.\w][^\(\)\s]*/g;

function errorMessage(value: any, c: ComponentThis) {
  console.error(value);
  throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} In the “${c.name}” component the template has a value that is not string or number: “${value}”`;
}
export default function getVarsInTemplate(
  template: string,
  sComp: SuperComponent,
  c: ComponentThis,
  templatePropertyValues: Map<string, string>
) {
  let templateValue = template.replaceAll(regexTemplateVars, (name) => {
    const prefix = name[0];
    const varName = name.slice(1);
    const getLastValue = templatePropertyValues.get(varName);

    if (getLastValue) return getLastValue;

    const vars = getComponentVars(sComp) as ComponentProps["vars"];
    const props = vars.props;

    const hasPathToProp = varName.includes(".");
    const pathToProp = hasPathToProp ? varName.split(".") : false;

    let value: any;

    if (prefix === varsLikeAttrPrefix) {
      const varsAndProps = { ...vars, ...props };

      let propName = varName;

      value = pathToProp
        ? pathToProp.reduce((o, p) => {
            propName = p;
            return o[p];
          }, varsAndProps)
        : varsAndProps[varName];

      value = ` ${toKebabCase(propName)} = "${value}" `;
    } else {
      value = pathToProp
        ? pathToProp.reduce((o, p) => o[p], vars)
        : vars[varName];
    }

    if (value === undefined || value === null) {
      throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} In the “${c.name}” component the template has a property that not exit: “${prefix}${varName}”`;
    }

    if (Object.hasOwn(value, PIPE_SYMBOL)) {
      for (const pipe of value[PIPE_SYMBOL]) {
        value = pipe(value);
      }

      templatePropertyValues.set(varName, value);

      return value;
    }

    if (typeof value !== "string" && typeof value !== "number") {
      errorMessage(value, c);
    }

    templatePropertyValues.set(varName, value.toString());

    return value;
  });

  return templateValue;
}
