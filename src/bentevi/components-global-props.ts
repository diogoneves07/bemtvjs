let GLOBAL_PROPS: Record<string, any> = {};

export function assignToComponentsGlobalProps(value: Record<string, any>) {
  Object.assign(GLOBAL_PROPS, value);
}

export function getComponentsGlobalProps() {
  return GLOBAL_PROPS;
}
