import { LIBRARY_NAME_IN_ERRORS_MESSAGE } from "./../../globals";
import toKebabCase from "../../utilities/to-kebab-case";
import { PIPE_SYMBOL } from "../pipes/main";
import { ComponentProps } from "../types/super-component-data";
import { getComponentVars } from "./work-with-super-component";
import { SuperComponent } from "./super-component";
import ComponentInst from "../component-inst";

// const varsPrefix = "$";
const varsAttrPrefix = "@";
const regexTemplateVars = /(\$|\@)[\.\w]*[^\(\)\s][\w][\?]?/g;

function errorMessage(varValue: any, c: ComponentInst) {
  console.error(varValue);
  throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} In the “${c.name}” component the template has a value that is not string or number: “${varValue}”`;
}
function getVarsValues(
  name: string,
  sComp: SuperComponent,
  c: ComponentInst,
  templatePropertyValues: Map<string, string>
) {
  const prefix = name[0];
  const isOpitional = name.includes("?");
  const varName = isOpitional ? name.slice(1, -1) : name.slice(1);

  const getLastValue = templatePropertyValues.get(varName);

  if (getLastValue) return getLastValue;

  const vars = getComponentVars(sComp) as ComponentProps["vars"];
  const props = vars.props;
  const hasPathToProp = varName.includes(".");
  const pathToProp = hasPathToProp ? varName.split(".") : false;

  let varValue: any;

  if (prefix === varsAttrPrefix) {
    const varsAndProps = { ...vars, ...props };

    let propName = varName;

    const findPropName = (p: string[]) => {
      return p.reduce((o, p) => {
        propName = p;
        return o[p];
      }, varsAndProps);
    };

    varValue = pathToProp ? findPropName(pathToProp) : varsAndProps[varName];

    if (varValue !== undefined && varValue !== null) {
      varValue = ` ${toKebabCase(propName)} = "${varValue}" `;
    }
  } else {
    varValue = pathToProp
      ? pathToProp.reduce((o, p) => o[p], vars)
      : vars[varName];
  }

  varValue = isOpitional ? "" : varValue;

  if (varValue === undefined || varValue === null) {
    throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} In the “${c.name}” component the template has a variable that not exist or is (null or undefined): “${prefix}${varName}”`;
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
}
export default function getVarsInTemplate(
  template: string,
  sComp: SuperComponent,
  c: ComponentInst,
  templatePropertyValues: Map<string, string>
) {
  let templateValue = template.replaceAll(regexTemplateVars, (p) =>
    getVarsValues(p, sComp, c, templatePropertyValues)
  );

  return templateValue;
}
