import ComponentManager from "./component-manager";
export declare const ALL_COMPONENTS_MANAGER: ComponentManager[];
export declare function appendNodeToComponentManagerNodes(node: Node): void;
export declare function removeNodeFromComponentManagerNodes(node: Node): void;
export declare function replaceNodeInComponentManagerNodes(newNode: Node, oldNode: Node): void;
export declare function setComponentManagerNodes(key: string, nodes: Node[]): void;
