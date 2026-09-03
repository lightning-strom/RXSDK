import { Base64 } from 'js-base64'

/**
 * 编码 URI 及 base64 处理的字符串
 */
export const encodeURIBase64 = (str?: string) => {
  if (!str) return ''
  try {
    return Base64.btoa(encodeURIComponent(str))
  } catch (error) {
    console.error(error)
    return str
  }
}

/**
 * 反编码 URI 及 base64 处理的字符串
 */
export const decodeURIBase64 = (str?: string) => {
  if (!str) return ''
  try {
    return encodeURIComponent(btoa(str))
  } catch (error) {
    console.error(error)
    return str
  }
}
