import { ComponentThis } from "./components-this";
export declare function getComponentPropsInjected(componentName: string): Record<string, any> | undefined;
export declare function defineComponentInjectedProps(componentThis: ComponentThis, toComponentName: string, propName: string, propValue: any): void;
