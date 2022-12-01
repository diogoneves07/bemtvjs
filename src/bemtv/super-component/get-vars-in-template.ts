import { LIBRARY_NAME_IN_ERRORS_MESSAGE } from "./../../globals";
import toKebabCase from "../../utilities/to-kebab-case";
import { T_FNS_SYMBOL } from "../transformation-functions/main";
import { ComponentProps } from "../types/super-component-data";
import {
  getComponentVars,
  getSuperComponentData,
} from "./work-with-super-component";
import { SuperComponent } from "./super-component";
import ComponentInst from "../component-inst";

// const varsPrefix = "$";
const varsAttrPrefix = "@";
const regexTemplateVars = /(\$|\@)[\.\w]*[\w][\?]?/g;

function errorMessage(varValue: any, c: ComponentInst) {
  console.error(varValue);
  throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} In the “${c.name}” component the template has a value that is not string or number: “${varValue}”`;
}

function getVarsValues(
  name: string,
  sComp: SuperComponent,
  c: ComponentInst,
  componentVarsCache: Map<string, string>
) {
  const prefix = name[0];
  const isOpitional = name.includes("?");
  const varName = isOpitional ? name.slice(1, -1) : name.slice(1);

  const getLastValue = componentVarsCache.has(varName);

  if (getLastValue) return componentVarsCache.get(varName);

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

  if (varValue === undefined || varValue === null) {
    if (!isOpitional) {
      throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} In the “${c.name}” component the template has a variable that not exist or is (null or undefined): “${prefix}${varName}”`;
    }
    varValue = "";
  }

  if (Object.hasOwn(varValue, T_FNS_SYMBOL)) {
    for (const tFn of varValue[T_FNS_SYMBOL]) {
      varValue = tFn(varValue);
    }

    componentVarsCache.set(prefix + varName, varValue);

    return varValue;
  }

  if (typeof varValue !== "string" && typeof varValue !== "number") {
    errorMessage(varValue, c);
  }

  componentVarsCache.set(prefix + varName, varValue.toString());

  return varValue;
}

export default function getVarsInTemplate(
  sComp: SuperComponent,
  c: ComponentInst
) {
  const sCompData = getSuperComponentData(sComp);
  const { componentVarsCache } = sCompData.components.get(c) as ComponentProps;

  sCompData.disableVarsProxies();

  let templateValue = sCompData
    .componentsTemplate()
    .replaceAll(regexTemplateVars, (p) =>
      getVarsValues(p, sComp, c, componentVarsCache)
    );

  sCompData.activateVarsProxies();

  return templateValue;
}
