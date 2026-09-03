const toString = Object.prototype.toString

export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`
}

export function isNumber(val: unknown): val is number {
  return is(val, 'Number')
}

export function isString(val: unknown): val is string {
  return is(val, 'String')
}

export function isBoolean(val: unknown): val is boolean {
  return is(val, 'Boolean')
}

export function isFunction(val: unknown): val is Function {
  return typeof val === 'function'
}

export function isObject(val: any): val is Record<any, any> {
  return val !== null && is(val, 'Object')
}

export function isArray(val: any): val is Array<any> {
  return val && Array.isArray(val)
}
/**
 * Checks if `value` is `null` or `undefined`.
 */
export function isNil<T = unknown>(val: T): val is T {
  return val == null
}

export function isEmpty<T = unknown>(val: T): val is T {
  if (val == null) {
    return true
  }

  if (isArray(val) || isString(val)) {
    return val.length === 0
  }

  if (val instanceof Map || val instanceof Set) {
    return val.size === 0
  }

  if (isObject(val)) {
    return Object.keys(val).length === 0
  }

  return false
}

/**
 * Array
 */
/**
 * Creates an array with all falsey values removed. The values `false`, `null`,
 * `0`, `""`, `undefined`, and `NaN` are falsey.
 *
 * compact([0, 1, false, 2, '', 3])
 * // => [1, 2, 3]
 */
export function compact(val: any) {
  if (!val) return []
  return val.filter((item: any) => item)
}

/**
 * Object
 */

export function pick(obj: Record<any, any>, ...props: Array<any>) {
  const flattenProps = props.flat()
  return obj == null
    ? {}
    : flattenProps.reduce(
        (iter: Record<any, any>, prop: string) => (prop in obj && (iter[prop] = obj[prop]), iter),
        {}
      )
}

export function omit(obj: Record<any, any>, ...props: Array<any>) {
  // console.log('omit: ', obj, props.flat())
  const flattenProps = props.flat()
  const result: Record<any, any> = {}
  if (obj == null) return result

  for (const key in obj) {
    if (!flattenProps.includes(key)) {
      result[key] = obj[key]
    }
  }

  return result
}


export function compareVersions(version1: string, version2: string) {
  // 将版本号字符串按 . 分割成数组
  const v1Parts = version1.split('.').map(Number);
  const v2Parts = version2.split('.').map(Number);

  // 获取两个版本号数组的最大长度
  const maxLength = Math.max(v1Parts.length, v2Parts.length);

  // 逐位比较版本号
  for (let i = 0; i < maxLength; i++) {
    // 如果某个版本号数组已经遍历完，对应位置的值视为 0
    const num1 = i < v1Parts.length ? v1Parts[i] : 0;
    const num2 = i < v2Parts.length ? v2Parts[i] : 0;

    if (num1 > num2) {
      return 1; // version1 大于 version2
    } else if (num1 < num2) {
      return -1; // version1 小于 version2
    }
    // 如果当前位相等，继续比较下一位
  }

  return 0; // 两个版本号相等
}
