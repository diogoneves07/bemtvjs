import { LIBRARY_NAME_IN_ERRORS_MESSAGE } from "./../../globals";
import toKebabCase from "../../utilities/to-kebab-case";
import { T_FNS_SYMBOL } from "../transformation-functions/main";
import {
  getSimpleComponentRunningVars,
  getSuperComponentData,
} from "./work-with-super-component";
import { SuperComponent } from "./super-component";
import SimpleComponent from "../simple-component";
import { generateForcedBindAttr } from "../generate-forced-el-attrs";

//const VARS_PREFIX = "$";
const VARS_AND_ATTR_PREFIX = "@";
const BIND_PROPS_PREFIX = "<";

const regexTemplateVars = /(\$|\@)[\.\w]*[\w][\?\<]?[\w]*/g;

function errorMessage(varValue: any, c: SimpleComponent) {
  console.error(varValue);
  throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} In the “${c.name}” component the template has a value that is not string or number: “${varValue}”`;
}

function isBindingElementProps(p: string) {
  if (!p.includes(BIND_PROPS_PREFIX)) return false;

  const [varName, elPropertyOrAttr] = p.split(BIND_PROPS_PREFIX);
  const varNameWithoutPrefix = varName.slice(1);

  const forcedBindAttr = generateForcedBindAttr(
    `${elPropertyOrAttr}:${varNameWithoutPrefix}`
  );

  return `${forcedBindAttr}`;
}

function getVarsValues(
  name: string,
  sComp: SuperComponent,
  c: SimpleComponent,
  componentVarsCache: Map<string, string>
) {
  const bindingElementProps = isBindingElementProps(name);

  if (bindingElementProps) return bindingElementProps;

  const prefix = name[0];
  const isOpitional = name.includes("?");
  const varName = isOpitional ? name.slice(1, -1) : name.slice(1);

  const getLastValue = componentVarsCache.has(varName);

  if (getLastValue) return componentVarsCache.get(varName);

  const vars = getSimpleComponentRunningVars(sComp);

  const hasPathToProp = varName.includes(".");
  const pathToProp = hasPathToProp ? varName.split(".") : false;

  let varValue: any;

  if (prefix === VARS_AND_ATTR_PREFIX) {
    const varsAndProps = { ...vars };

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
    if (pathToProp) varValue = pathToProp.reduce((o, p) => o && o[p], vars);
    else varValue = vars[varName];
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
  c: SimpleComponent
) {
  const sCompData = getSuperComponentData(sComp);
  const { componentVarsCache } = c;

  sCompData.disableVarsProxies();

  let templateValue = sCompData
    .componentsTemplate()
    .replaceAll(regexTemplateVars, (p) =>
      getVarsValues(p, sComp, c, componentVarsCache)
    )
    .replaceAll(regexTemplateVars, (p) =>
      getVarsValues(p, sComp, c, componentVarsCache)
    );

  sCompData.activateVarsProxies();

  return templateValue;
}
