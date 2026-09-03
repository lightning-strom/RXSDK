export declare enum RichType {
    Link = "link",
    Text = "text",
    Image = "img",
    Heading = "heading",
    Paragraph = "paragraph",
    Break = "break",
    Font = "font",
    HorizontalRule = "hr",
    Div = "div",
    Italic = "italic",
    Underline = "underline",
    Style = "style",
    Script = "script"
}
export type RichData = {
    type: RichType;
    href?: string;
    src?: string;
    alt?: string;
    content?: string;
    style?: string;
    children?: RichData[];
};
export default class TextUtil {
    static formHtml(l196: string): RichData[];
    static parseHrefHtml(h196: string): RichData[];
    static removeBrackets(g196: string): string;
    static isValidEmail(e196: string): boolean;
    static isValidPhone(c196: string): boolean;
    static isValidPhoneNumber(x195: string): boolean;
}
