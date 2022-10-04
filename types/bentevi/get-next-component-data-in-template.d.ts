declare type ComponentData = {
    before: string;
    after: string;
    name: string;
    children: string;
};
export default function getNextComponentDataInTemplate(allTemplate: string): ComponentData | false;
export {};
