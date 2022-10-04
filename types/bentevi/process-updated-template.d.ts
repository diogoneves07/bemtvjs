import ComponentManager from "./component-manager";
declare type UpdatedTemplateObject = {
    template: string;
    newComponentsManager: ComponentManager[];
    componentsManagerUpdated: ComponentManager[];
};
export default function processUpdatedTemplate(componentManager: ComponentManager): UpdatedTemplateObject;
export {};
