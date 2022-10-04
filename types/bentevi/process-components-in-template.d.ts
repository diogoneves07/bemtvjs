import ComponentManager from "./component-manager";
import { ComponentThis } from "./components-this";
declare type processComponentsResult = [
    result: string,
    componentsThis: ComponentThis[],
    componentsManager: ComponentManager[]
];
export default function processComponentsInTemplate(template: string, firstParent?: ComponentThis): processComponentsResult;
export {};
