export enum RichType {
  Link = 'link',
  Text = 'text',
  Image = 'img',
  Heading = 'heading', // <h1> to <h6>
  Paragraph = 'paragraph', // <p>
  Break = 'break', // <br/>
  Font = 'font', // <font>
  HorizontalRule = 'hr', // <hr/>
  Div = 'div', // <div>
  Italic = 'italic', // <i>
  Underline = 'underline', // <u>
  Style = 'style', // <style>
  Script = 'script' // <script>
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
  static formHtml(html: string): RichData[] {
    const regex =
      /<a\s+href\s*=\s*['"]\s*(.*?)\s*['"]\s*>(.*?)<\/\s*a\s*>|<img\s+[^>]*src\s*=\s*['"]([^'"]*)['"][^>]*>|<h[1-6][^>]*>(.*?)<\/h[1-6]>|<p[^>]*>(.*?)<\/p>|<br\s*\/>|<font\s+[^>]*>(.*?)<\/font>|<hr\s*\/>|<div\s+[^>]*>(.*?)<\/div>|<i[^>]*>(.*?)<\/i>|<u[^>]*>(.*?)<\/u>|<style[^>]*>(.*?)<\/style>|<script[^>]*>(.*?)<\/script>|([^<]+)/gi;

    const result: RichData[] = [];
    let match;

    const handleMatch = (match: RegExpExecArray): void => {
      // Link 类型
      if (match[1] && match[2]) {
        result.push({
          type: RichType.Link,
          href: match[1].trim(),
          content: match[2].trim(),
        });
      }
      // Image 类型
      else if (match[3]) {
        result.push({
          type: RichType.Image,
          src: match[3].trim(),
          content: match[3].trim(),
        });
      }
      // Heading 类型 (h1-h6)
      else if (match[4]) {
        result.push({
          type: RichType.Heading,
          content: match[4].trim(),
        });
      }
      // Paragraph 类型
      else if (match[5]) {
        result.push({
          type: RichType.Paragraph,
          content: match[5].trim(),
          children: TextUtil.formHtml(match[5].trim()),
        });
      }
      // Break 类型 <br/>
      else if (match[6]) {
        result.push({
          type: RichType.Break,
          content: '',
        });
      }
      // Font 类型
      else if (match[7]) {
        result.push({
          type: RichType.Font,
          content: match[7].trim(),
        });
      }
      // HorizontalRule 类型 <hr/>
      else if (match[8]) {
        result.push({
          type: RichType.HorizontalRule,
          content: '',
        });
      }
      // Div 类型
      else if (match[9]) {
        result.push({
          type: RichType.Div,
          content: match[9].trim(),
          children: TextUtil.formHtml(match[9].trim()),
        });
      }
      // Italic 类型
      else if (match[10]) {
        result.push({
          type: RichType.Italic,
          content: match[10].trim(),
        });
      }
      // Underline 类型
      else if (match[11]) {
        result.push({
          type: RichType.Underline,
          content: match[11].trim(),
        });
      }
      // Style 类型
      else if (match[12]) {
        result.push({
          type: RichType.Style,
          content: match[12].trim(),
        });
      }
      // Script 类型
      else if (match[13]) {
        result.push({
          type: RichType.Script,
          content: match[13].trim(),
        });
      }
      // 普通文本
      else if (match[14]) {
        const textContent = match[14];
        if (textContent) {
          result.push({
            type: RichType.Text,
            content: textContent,
          });
        }
      }
    };

    // 执行正则匹配，并处理每一项
    while ((match = regex.exec(html)) !== null) {
      handleMatch(match);
    }

    return result;
  }

  static parseHrefHtml(richText: string): RichData[] {
    const regex = /<a\s+href\s*=\s*['"]\s*(.*?)\s*['"]\s*>(.*?)<\/\s*a\s*>|([^<]+)/gi;
    const result: RichData[] = [];
    let match;
    // console.log(richText)
    while ((match = regex.exec(richText)) !== null) {
      if (match[1] && match[2]) {
        // 链接匹配
        result.push({
          type: RichType.Link,
          href: match[1].trim(),
          content: match[2],
        });
      } else if (match[3]) {
        // 普通文本匹配
        result.push({
          type: RichType.Text,
          content: match[3],
        });
      }
    }

    return result;
  }

  static removeBrackets(input: string): string {

    return input?.replace(/[《》【】「」]/g, '');
  }

  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  }

  static isValidPhoneNumber(input: string): boolean {
    // 去掉空格、短横线等分隔符
    const normalized = input.replace(/[\s\-]/g, '');

    // 去掉前置多余的占位 +00、00，例如 +0086、0086
    const cleaned = normalized.replace(/^(\+?00)+/, '+');

    // 定义各地区正则
    const regexList = [
      /^(?:\+?86)?1[3-9]\d{9}$/, // 中国大陆
      /^(?:\+?852)?[69]\d{7}$/, // 香港
      /^(?:\+?853)?6\d{7}$/, // 澳门
      /^(?:\+?886)?09\d{8}$/, // 台湾
      /^\+?\d{6,15}$/,// 国际通用
    ];

    // 只要匹配任意一个格式就通过
    return regexList.some(regex => regex.test(cleaned));
  }
}