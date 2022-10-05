import { LIBRARY_NAME_IN_ERRORS_MESSAGE } from "./../globals";
import { GlobalProps } from "./types/global-props";

export let GLOBAL_PROPS: GlobalProps = {};

export function assignToComponentsGlobalProps(
  value: GlobalProps | Record<string, any>
) {
  for (const key of Object.keys(value)) {
    const check = Object.prototype.hasOwnProperty.call(GLOBAL_PROPS, key);

    if (check)
      throw `${LIBRARY_NAME_IN_ERRORS_MESSAGE} “Trying to override global prop” - the "doubleValue" property has already been set as a global property!`;

    (GLOBAL_PROPS as any)[key] = value[key];
  }
}

export function getComponentsGlobalProps() {
  return GLOBAL_PROPS;
}
