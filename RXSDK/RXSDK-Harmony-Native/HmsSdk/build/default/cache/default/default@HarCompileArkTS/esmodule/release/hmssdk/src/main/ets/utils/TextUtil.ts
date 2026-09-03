export enum RichType {
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
    static formHtml(l196: string): RichData[] {
        const m196 = /<a\s+href\s*=\s*['"]\s*(.*?)\s*['"]\s*>(.*?)<\/\s*a\s*>|<img\s+[^>]*src\s*=\s*['"]([^'"]*)['"][^>]*>|<h[1-6][^>]*>(.*?)<\/h[1-6]>|<p[^>]*>(.*?)<\/p>|<br\s*\/>|<font\s+[^>]*>(.*?)<\/font>|<hr\s*\/>|<div\s+[^>]*>(.*?)<\/div>|<i[^>]*>(.*?)<\/i>|<u[^>]*>(.*?)<\/u>|<style[^>]*>(.*?)<\/style>|<script[^>]*>(.*?)<\/script>|([^<]+)/gi;
        const n196: RichData[] = [];
        let o196;
        const p196 = (q196: RegExpExecArray): void => {
            if (q196[1] && q196[2]) {
                n196.push({
                    type: RichType.Link,
                    href: q196[1].trim(),
                    content: q196[2].trim(),
                });
            }
            else if (q196[3]) {
                n196.push({
                    type: RichType.Image,
                    src: q196[3].trim(),
                    content: q196[3].trim(),
                });
            }
            else if (q196[4]) {
                n196.push({
                    type: RichType.Heading,
                    content: q196[4].trim(),
                });
            }
            else if (q196[5]) {
                n196.push({
                    type: RichType.Paragraph,
                    content: q196[5].trim(),
                    children: TextUtil.formHtml(q196[5].trim()),
                });
            }
            else if (q196[6]) {
                n196.push({
                    type: RichType.Break,
                    content: '',
                });
            }
            else if (q196[7]) {
                n196.push({
                    type: RichType.Font,
                    content: q196[7].trim(),
                });
            }
            else if (q196[8]) {
                n196.push({
                    type: RichType.HorizontalRule,
                    content: '',
                });
            }
            else if (q196[9]) {
                n196.push({
                    type: RichType.Div,
                    content: q196[9].trim(),
                    children: TextUtil.formHtml(q196[9].trim()),
                });
            }
            else if (q196[10]) {
                n196.push({
                    type: RichType.Italic,
                    content: q196[10].trim(),
                });
            }
            else if (q196[11]) {
                n196.push({
                    type: RichType.Underline,
                    content: q196[11].trim(),
                });
            }
            else if (q196[12]) {
                n196.push({
                    type: RichType.Style,
                    content: q196[12].trim(),
                });
            }
            else if (q196[13]) {
                n196.push({
                    type: RichType.Script,
                    content: q196[13].trim(),
                });
            }
            else if (q196[14]) {
                const r196 = q196[14];
                if (r196) {
                    n196.push({
                        type: RichType.Text,
                        content: r196,
                    });
                }
            }
        };
        while ((o196 = m196.exec(l196)) !== null) {
            p196(o196);
        }
        return n196;
    }
    static parseHrefHtml(h196: string): RichData[] {
        const i196 = /<a\s+href\s*=\s*['"]\s*(.*?)\s*['"]\s*>(.*?)<\/\s*a\s*>|([^<]+)/gi;
        const j196: RichData[] = [];
        let k196;
        while ((k196 = i196.exec(h196)) !== null) {
            if (k196[1] && k196[2]) {
                j196.push({
                    type: RichType.Link,
                    href: k196[1].trim(),
                    content: k196[2],
                });
            }
            else if (k196[3]) {
                j196.push({
                    type: RichType.Text,
                    content: k196[3],
                });
            }
        }
        return j196;
    }
    static removeBrackets(g196: string): string {
        return g196?.replace(/[《》【】「」]/g, '');
    }
    static isValidEmail(e196: string): boolean {
        const f196 = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return f196.test(e196);
    }
    static isValidPhone(c196: string): boolean {
        const d196 = /^1[3-9]\d{9}$/;
        return d196.test(c196);
    }
    static isValidPhoneNumber(x195: string): boolean {
        const y195 = x195.replace(/[\s\-]/g, '');
        const z195 = y195.replace(/^(\+?00)+/, '+');
        const a196 = [
            /^(?:\+?86)?1[3-9]\d{9}$/,
            /^(?:\+?852)?[69]\d{7}$/,
            /^(?:\+?853)?6\d{7}$/,
            /^(?:\+?886)?09\d{8}$/,
            /^\+?\d{6,15}$/,
        ];
        return a196.some(b196 => b196.test(z195));
    }
}
