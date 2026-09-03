import { Logger } from "./Logger";
import { RXUtil } from "./RXUtil";

class Objects {
  checkRequiredParams(params: Record<string, any>, requiredFields?: string[]) {
    return RXUtil.checkRequiredParams(params, requiredFields)
  }

  isEmpty(obj: Object): boolean {
    return !obj || Object.keys(obj).length === 0;
  }

  isMap(value: any): value is Map<any, any> {
    return value instanceof Map;
  }

  isArray(value: any): value is Array<any> {
    return value instanceof Array;
  }

  isArrayBuffer(value: any): value is ArrayBuffer {
    return value instanceof ArrayBuffer;
  }

  isError(value: any): value is Error {
    return value instanceof Error;
  }

  deleteKey(target: object, key: string) {
    if (target) {
      delete target[key]
    }
    return target
  }

  assign(target: object, ...sources: any[]) {
    if (target == null) {
      target = {};
    }
    return Object.assign(target, ...sources)
  }

  /**
   * 深度合并对象，类似 Object.assign，但支持子对象和数组
   * @param {Object} target 目标对象
   * @param {...Object} sources 源对象，可多个
   * @param {Object} [options] 可选配置
   *        options.arrayMerge: 'replace' | 'concat' (默认 'replace')
   * 如果想数组合并：deepAssign(target, { arr: [5] }, { __deepAssignOptions: { arrayMerge: 'concat' } });
   */
  deepAssign(target, ...sources) {
    const options = (sources.length && typeof sources[sources.length - 1] === 'object' && sources[sources.length - 1].__deepAssignOptions)
      ? sources.pop().__deepAssignOptions
      : { arrayMerge: 'replace' };

    if (!target || typeof target !== 'object') {
      target = {};
    }

    sources.forEach(source => {
      if (!source || typeof source !== 'object') {
        return;
      }

      Object.keys(source).forEach(key => {
        const srcVal = source[key];
        const tgtVal = target[key];

        if (srcVal && typeof srcVal === 'object' && !Array.isArray(srcVal)) {
          // 子对象递归合并
          if (!tgtVal || typeof tgtVal !== 'object' || Array.isArray(tgtVal)) {
            target[key] = {};
          }
          this.deepAssign(target[key], srcVal, { __deepAssignOptions: options });
        } else if (Array.isArray(srcVal)) {
          if (Array.isArray(tgtVal) && options.arrayMerge === 'concat') {
            target[key] = tgtVal.concat(srcVal);
          } else {
            target[key] = srcVal; // 默认覆盖
          }
        } else {
          // 原始值直接覆盖
          target[key] = srcVal;
        }
      });
    });

    return target;
  }


  parse<T = any>(text: string): T {
    try {
      const result = JSON.parse(text);
      return result as T
    } catch {
      return text as T
    }
  }

  safeStringify(obj) {
    try {
      // 处理循环引用
      const seen = new WeakSet();
      return JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) {
            return '[Circular]';
          }
          seen.add(value);
        }
        // 处理特殊值
        if (value === undefined) {
          return '[undefined]';
        }
        if (value === null) {
          return '[null]';
        }
        if (typeof value === 'function') {
          return '[Function]';
        }
        if (typeof value === 'symbol') {
          return '[Symbol]';
        }
        if (value instanceof Date) {
          return value.toISOString();
        }
        if (typeof value === 'bigint') {
          return value.toString();
        }
        return value;
      });
    } catch (error) {
      console.error('JSON.stringify error:', error);
      return '';
    }
  }

  stringify(obj) {
    if (typeof obj === 'string') {
      return obj;
    }
    return JSON.stringify(obj, (_, value) => {
      if (value instanceof Map) {
        return {
          __type: "Map",
          ...Object.fromEntries(value)
        };
      } else if (value instanceof Set) {
        return {
          __type: "Set",
          ...Array.from(value).reduce((acc, item, index) => {
            acc[index] = item;
            return acc;
          }, {})
        };
      } else if (value instanceof Error) {
        return {
          __type: "Error",
          code: value["code"],
          name: value.name,
          message: value.message,
          stack: value.stack ? value.stack.split('\n').slice(0, 10)?.join(' ')?.trim() : undefined
        };
      } else if (value instanceof ArrayBuffer) {
        return {
          __type: "ArrayBuffer",
          ...Array.from(new Uint8Array(value)).reduce((acc, byte, index) => {
            acc[index] = byte;
            return acc;
          }, {})
        };
      } else if (value instanceof RegExp) {
        const regExpObj: { __type: "RegExp"; pattern: string; flags: string } = {
          __type: "RegExp",
          pattern: value.source,
          flags: value.flags
        };
        return regExpObj;
      }
      return value;
    });
  }

  mapToRecord(myMap: Map<string, any>): Record<string, any> {
    return Object.fromEntries(
      Array.from(myMap.entries(), ([key, value]) => [
        key,
        value instanceof Map
          ? this.mapToRecord(value)
          : typeof value === "object" && value !== null && !(value instanceof Array)
          ? this.recordToMap(value)
          : value,
      ])
    );
    // return Object.fromEntries(myMap.entries()) as Record<string, any>;
  }

  // Record转为Map
  recordToMap(myRecord: Record<string, any>): Map<string, any> {
    return new Map(
      Object.entries(myRecord).map(([key, value]) => [
        key,
        value instanceof Map
          ? this.mapToRecord(value)
          : typeof value === "object" && value !== null && !(value instanceof Array)
          ? this.recordToMap(value)
          : value,
      ])
    );
    // let myMap: Map<string, any> = new Map();
    // for (const key in myRecord) {
    //   myMap.set(key, myRecord[key]);
    // }
    // return myMap;
  }

  shallowCopy(obj: object): object {
    let newObj = {};
    Object.assign(newObj, obj);
    return newObj;
  }

  deepCopy(obj: object): object {
    let newObj = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
      if (typeof obj[key] === 'object') {
        newObj[key] = this.deepCopy(obj[key]);
      } else {
        newObj[key] = obj[key];
      }
    }
    return newObj;
  }

  eToObject(error: Error): object {
    const serializableError = {
      name: error.name,
      message: error.message,
      stack: error.stack ? error.stack.split('\n').slice(0, 10).join('\n') : undefined,
    };
    return serializableError;
  }

  toObject<T = object>(data: string | Map<any, any> | object | Error | Record<string, any>): T | null {
    if (data instanceof Map) {
      return Array.from(data.entries()).reduce((obj, [key, value]) => {
        (obj as any)[key] = value;
        return obj;
      }, {} as T);
    } else if (data instanceof Error) {
      return this.eToObject(data) as T;
    } else if (typeof data === "object" && data !== null) {
      return data as T;
    } else if (typeof data == 'string') {
      return JSON.parse(data) as T
    } else {
      // 如果 data 是 null、undefined 或其他非对象类型
      Logger.e("Unsupported data type for toObject conversion.");
      return null
    }
  }

  prefixInt(num, length): string {
    return (Array(length).join('0') + num).slice(-length);
  }

  clone(obj: Object) {
    return Object.assign({}, obj);
  }

  deepClone(obj: any) {
    if (obj instanceof Array) {
      return obj.concat()
    } else {
      let objProto = Object.getPrototypeOf(obj);
      return Object.assign(Object.create(objProto), obj);
    }
  }
}

export default new Objects()