import { buffer, util } from "@kit.ArkTS";

export class BufferUtil {
  static stringToHex(str: string): string {
    let hex = '';
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      const hexPart = charCode.toString(16).padStart(2, '0');
      hex += hexPart;
    }
    return hex;
  }

  static unit8ArrayToString(src: Uint8Array, encoding: buffer.BufferEncoding = 'utf-8'): string {
    let textDecoder = util.TextDecoder.create(encoding, { ignoreBOM: true })
    let result = textDecoder.decodeToString(src, { stream: true });
    return result;
  }

  static trim(str: string): string {
    return str.trim();
  }

  /**
   * 重复字符串指定的次数
   * @param str 要重复的字符串
   * @param count 重复的次数
   * @returns 重复后的字符串
   */
  static repeat(str: string, count: number): string {
    return str.repeat(count);
  }

  // 将字符串转换为驼峰命名法（camelCase）
  // 首先匹配所有以连字符开头的字符对，把连字符后的字符转换为大写
  // 然后移除所有下划线
  static toCamelCase(str: string): string {
    return str
      .replace(/-./g, match => match.charAt(1).toUpperCase())
      .replace(/_/g, '');
  }

  // 将字符串转换为蛇形命名法（snake_case）
  // 匹配所有大写字母，在其前面添加下划线并转换为小写
  // 移除开头多余的下划线
  static toSnakeCase(str: string): string {
    return str
      .replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
      .replace(/^\_/, ''); // Remove leading underscore
  }

  // 将字符串转换为短横线命名法（kebab-case）
  // 匹配所有大写字母，在其前面添加短横线并转换为小写
  // 移除开头多余的短横线
  static toKebabCase(str: string): string {
    return str
      .replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
      .replace(/^\-/, ''); // Remove leading dash
  }

  // Checks if the string is a valid email format
  static isValidEmail(str: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(str);
  }

  // Capitalizes the first letter of each word
  static capitalizeWords(str: string): string {
    return str.replace(/\b\w/g, match => match.toUpperCase());
  }

  // Converts a string to lowercase
  static toLowerCase(str: string): string {
    return str.toLowerCase();
  }

  // Converts a string to uppercase
  static toUpperCase(str: string): string {
    return str.toUpperCase();
  }

  // /**
  //     * 替换字符串中的所有匹配项
  //     * @param str 要处理的字符串
  //     * @param searchValue 要替换的字符串或正则表达式
  //     * @param replaceValue 替换值
  //     * @returns 替换后的字符串
  //     */
  //    static replaceAll(str: string, searchValue: string | RegExp, replaceValue: string): string {
  //        if (typeof searchValue === 'string') {
  //            return str.split(searchValue).join(replaceValue);
  //        }
  //        return str.replace(searchValue, replaceValue);
  //    }
  // Replaces all instances of a substring in a string
  static replaceAll(str: string, search: string, replacement: string): string {
    return str.split(search).join(replacement);
  }

  // Checks if a string is null or empty
  static isNullOrEmpty(str: string): boolean {
    return !str || str.length === 0;
  }

  static stringToUint8Array(str: string): Uint8Array {
    // let arr = [];
    // for (let i = 0, j = str.length; i < j; ++i) {
    //   arr.push(str.charCodeAt(i));
    // }
    // return new Uint8Array(arr);
    // return Uint8Array.from(str, char => char.charCodeAt(0));
    // return new Uint8Array(buffer.from(str, 'utf-8').buffer);
    return new util.TextEncoder().encodeInto(str);
  }

  // 将字符串转换为 ArrayBuffer
  static stringToArrayBuffer(str: string): ArrayBuffer {
    const buffer = new ArrayBuffer(str.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < str.length; i++) {
      view[i] = str.charCodeAt(i);
    }
    return buffer;
  }

  static uint8ArrayToString(input: Uint8Array): string {
    const decoder = new util.TextDecoder();
    return decoder.decodeToString(input);
  }

  // 将 Uint8Array 转换为 ArrayBuffer
  static uint8ArrayToArrayBuffer(uint8Array: Uint8Array): ArrayBuffer {
    return uint8Array.buffer;
  }

  /**
   * uint8Array 转换为 hex字符串
   * @param uint8Array
   * @returns
   */
  static uint8ArrayToHexString(uint8Array: Uint8Array) {
    // 使用Array.from和toString转换每个字节为16进制并连接
    // return Array.from(uint8Array).map(byte => byte.toString(16).padStart(2, '0')).join('');
    let hexString = '';
    for (let i = 0; i < uint8Array.length; i++) {
      const byte = uint8Array[i].toString(16);
      hexString += byte.length === 1 ? '0' + byte : byte;
    }
    return hexString;
  }

  static uint8ArrayToHexString2(data: Uint8Array): string {
    return buffer.from(data).toString('hex')
  }

  // // Uint8Array转十六进制
  static uint8ArrayToHexString3(data: Uint8Array): string {
    let hexString = '';
    let i: number;
    for (i = 0; i < data.length; i++) {
      let char = ('00' + data[i].toString(16)).slice(-2);
      hexString += char;
    }
    // console.info('Uint8Array转十六进制:' + hexString);
    return hexString;
  }


  static uint8ArrayToHexArray(array: Uint8Array) {
    return Array.from(array).map(byte => byte.toString(16).padStart(2, '0'))
  }

  static isHexString(str: string): boolean {
    const hexRegex = /^[0-9a-fA-F]+$/;
    return hexRegex.test(str);
  }

  static hexToUint8Array(hex: string): Uint8Array {
    const length = hex.length;
    const uint8Array = new Uint8Array(length / 2);
    for (let i = 0; i < length; i += 2) {
      uint8Array[i / 2] = parseInt(hex.substring(i, i + 2), 16);
    }
    return uint8Array;
  }

  // 将 ArrayBuffer 转换为字符串
  static arrayBufferToString(arrayBuffer: ArrayBuffer): string {
    const uint8Array = new Uint8Array(arrayBuffer);
    let str = '';
    for (let i = 0; i < uint8Array.length; i++) {
      str += String.fromCharCode(uint8Array[i]);
    }
    return str;
  }


  // 将 ArrayBuffer 转换为 Uint8Array
  static arrayBufferToUint8Array(arrayBuffer: ArrayBuffer): Uint8Array {
    return new Uint8Array(arrayBuffer);
  }

  static toUint8Array(input: string | Uint8Array | ArrayBuffer): Uint8Array {
    if (input instanceof Uint8Array) {
      return input;
    } else if (input instanceof ArrayBuffer) {
      return new Uint8Array(input);
    }
    return this.stringToUint8Array(input);
  }

  static toArrayBuffer(input: string | Object | ArrayBuffer): ArrayBuffer {
    if (input instanceof ArrayBuffer) {
      return input;
    }
    if (typeof input === "object") {
      input = JSON.stringify(input);
    }
    if (typeof input === "string") {
      return buffer.from(input, 'utf-8').buffer;
    } else {
      return null
    }
  }

  static removeTrailingZeros(buffer: ArrayBuffer): ArrayBuffer {
    const uint8Array = new Uint8Array(buffer);
    let end = uint8Array.length;
    while (end > 0 && uint8Array[end - 1] === 0) {
      end--;
    }
    if (end < uint8Array.length) {
      return buffer.slice(0, end);
    }
    return buffer;
  }
}

export { BufferUtil as StringUtil };