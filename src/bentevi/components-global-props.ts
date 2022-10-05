import { GlobalProps } from "./types/global-props";

let GLOBAL_PROPS: GlobalProps = {};

export function assignToComponentsGlobalProps(value: GlobalProps) {
  Object.assign(GLOBAL_PROPS, value);
}

export function getComponentsGlobalProps() {
  return GLOBAL_PROPS;
}
