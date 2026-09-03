import { buffer } from "@kit.ArkTS";
import { cryptoFramework } from '@kit.CryptoArchitectureKit';

export class Util {
  static async buildSignatureTest(secret: string, data: string): Promise<string> {
    let plantText = data;
    let mac = cryptoFramework.createMac("SHA1");
    let symKeyGenerator = cryptoFramework.createSymKeyGenerator("HMAC");
    let key = symKeyGenerator.convertKey({ data: this.stringToUTF8Array(secret) });
    return key.then((symKey) => {
      let promiseMacInit = mac.init(symKey);
      return promiseMacInit;
    }).then(() => {
      return mac.update({ data: new Uint8Array(buffer.from(plantText, 'utf-8').buffer) });
    }).then(() => {
      return mac.doFinal();
    }).then((output) => {
      return buffer.from(output.data).toString("base64")
    })
  }

  static stringToUTF8Array(str: string) {
    return new Uint8Array(buffer.from(str, 'utf-8').buffer)
  }

  static parseHtml(richText: string) {
    const regex = /(<a href='(.*?)'>(.*?)<\/a>)|([^<]+)/g;
    let match;
    const result = [];

    while ((match = regex.exec(richText)) !== null) {
      if (match[1]) {
        // 匹配到链接
        result.push({ type: 'link', href: match[2], content: match[3] });
      } else if (match[4]) {
        // 匹配到普通文本
        result.push({ type: 'text', content: match[4] });
      }
    }
    return result
  }
}