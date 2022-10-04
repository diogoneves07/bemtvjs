export interface TagProps {
    tagName: string;
    children: string;
    attributes: string;
    css: string | null;
    cssClassName: string;
}
export interface TagPropsTree extends Omit<TagProps, "children"> {
    children: (string | TagPropsTree)[] | null;
}
