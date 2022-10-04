import { ComponentThis } from "./components-this";
export declare type TemplateCallback = () => string;
export default class ComponentManager {
    componentThis: ComponentThis;
    key: string;
    id: number;
    lastTemplateValue: string;
    nodes: Node[];
    getCurrentTemplate: TemplateCallback;
    constructor(componentThis: ComponentThis, callbackOrText: TemplateCallback | string);
    getCurrentTemplateWithHost(): string;
    updateLastTemplateValue(): void;
    shouldTemplateBeUpdate(): boolean;
}
