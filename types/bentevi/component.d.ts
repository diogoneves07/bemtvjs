import { ComponentThis } from "./components-this";
export declare type ComponentTemplateCallback = () => string;
declare type ComponentCallback = ((self: ComponentThis) => () => string) | ((self: ComponentThis) => string) | ((this: ComponentThis, self: ComponentThis) => () => string) | ((this: ComponentThis, self: ComponentThis) => string);
export declare function getComponentCallback(componentName: string): ComponentCallback | undefined;
export declare function Component<N extends string, C extends ComponentCallback>(componentName: N, componentCallback: C): void;
export declare const _: typeof Component;
export {};
