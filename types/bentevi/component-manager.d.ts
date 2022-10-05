import { ComponentThis } from "./components-this";
import { ComponentTemplateCallback } from "./component";
export declare type TemplateCallback = () => string;
export default class ComponentManager {
    componentThis: ComponentThis;
    key: string;
    id: number;
    lastTemplateValue: string;
    nodes: Node[];
    getCurrentTemplate: TemplateCallback;
    constructor(componentThis: ComponentThis, callbackOrText: ComponentTemplateCallback | string);
    getCurrentTemplateWithHost(): string;
    updateLastTemplateValue(): void;
    shouldTemplateBeUpdate(): boolean;
}
