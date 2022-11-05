import { LIBRARY_NAME_IN_ERRORS_MESSAGE } from "./../../globals";
import toKebabCase from "../../utilities/to-kebab-case";
import { PIPE_SYMBOL } from "../pipes/main";
import { ComponentProps } from "../types/super-component-data";
import { ComponentThis } from "../components-this";
import { getComponentVars } from "./work-with-super-component";
import { SuperComponent } from "./super-component";

// const varsPrefix = "$";
const varsLikeAttrPrefix = "@";
const regexTemplateVars = /(\$|\@)[\.\w]*[^\(\)\s][\w]/g;

function errorMessage(varValue: any, c: ComponentThis) {
  console.error(varValue);
  throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} In the “${c.name}” component the template has a value that is not string or number: “${varValue}”`;
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

    let varValue: any;

    if (prefix === varsLikeAttrPrefix) {
      const varsAndProps = { ...vars, ...props };

      let propName = varName;

      const findPropName = (p: string[]) => {
        return p.reduce((o, p) => {
          propName = p;
          return o[p];
        }, varsAndProps);
      };

      varValue = pathToProp ? findPropName(pathToProp) : varsAndProps[varName];

      varValue = ` ${toKebabCase(propName)} = "${varValue}" `;
    } else {
      varValue = pathToProp
        ? pathToProp.reduce((o, p) => o[p], vars)
        : vars[varName];
    }

    if (varValue === undefined || varValue === null) {
      throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} In the “${c.name}” component the template has a variable that not exist: “${prefix}${varName}”`;
    }

    if (Object.hasOwn(varValue, PIPE_SYMBOL)) {
      for (const pipe of varValue[PIPE_SYMBOL]) {
        varValue = pipe(varValue);
      }

      templatePropertyValues.set(varName, varValue);

      return varValue;
    }

    if (typeof varValue !== "string" && typeof varValue !== "number") {
      errorMessage(varValue, c);
    }

    templatePropertyValues.set(varName, varValue.toString());

    return varValue;
  });

  return templateValue;
}
