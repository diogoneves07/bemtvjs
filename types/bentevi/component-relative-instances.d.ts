import ComponentManager from "./component-manager";
export declare function saveRelativeInstances(relativeInstances: ComponentManager[]): void;
export declare function addToRelativeInstances(newInstances: ComponentManager | ComponentManager[], relative: ComponentManager): void;
export declare function getRelativeInstances(relative: ComponentManager): ComponentManager[] | undefined;
export declare function removeRelativeInstance(relative: ComponentManager): void;
