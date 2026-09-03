import { isFunction } from '@/utils/is'
// @ts-ignore
import { cryptoJS } from '@/index.crypto.js'
import { SYSTEM_INFO, USER_INFO } from '@/config'
import { trackApi } from '@/h5/apis'
import { formatDate } from '@/utils/day'
import v4 from 'uuid/v4'

export const cpkey = '4ca7dacc9332d74e1292c83f0aa3b376'

function crypto(): any {
  // @ts-ignore
  return cryptoJS()
}

/**
 * AES-CBC 加密字符串
 * @param {string} data 需要加密的字符串
 * @param {string} key 加密密钥
 * @param {string} iv 初始化向量
 * @returns {string} 加密后的 Base64 编码字符串
 */
export function AesEncryptBase64String(data: any, key: any, iv: any) {
  const CryptoJS = crypto()
  // 将密钥和初始化向量转换为 WordArray
  const keyWordArray = CryptoJS.enc.Utf8.parse(key)
  const ivWordArray = CryptoJS.enc.Utf8.parse(iv)

  // 使用 AES-CBC 加密
  const encrypted = CryptoJS.AES.encrypt(data, keyWordArray, {
    iv: ivWordArray,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })

  // 返回 Base64 编码的加密结果
  return encrypted.toString()
}

/**
 * AES-CBC 解密字符串
 * @param {string} encryptedData 加密后的 Base64 编码字符串
 * @param {string} key 加密密钥
 * @param {string} iv 初始化向量
 * @returns {string} 解密后的原始字符串
 */
export function AesDecryptBase64String(encryptedData: any, key: any, iv: any) {
  const CryptoJS = crypto()
  // 将密钥和初始化向量转换为 WordArray
  const keyWordArray = CryptoJS.enc.Utf8.parse(key)
  const ivWordArray = CryptoJS.enc.Utf8.parse(iv)

  // 使用 AES-CBC 解密
  const decrypted = CryptoJS.AES.decrypt(encryptedData, keyWordArray, {
    iv: ivWordArray,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })

  // 将解密结果转换为 UTF-8 字符串
  return decrypted.toString(CryptoJS.enc.Utf8)
}

export const getSystemInfo = () => {
  if (typeof window !== 'undefined' && !(window as any).qg)
    return {
      system: ''
    }
  return qg.getSystemInfoSync()
}

/**
 * @name getSearchQueries
 * @desc 解析并存储 URL 参数
 */
export function getSearchQueries(ifStringify: true): string
export function getSearchQueries(): object
export function getSearchQueries(ifStringify?: true): object | string {
  return {}
  // let { query, extra } = qg?.getLaunchOptionsSync()
  // extra = extra || {}

  // query = {
  //   ...query,
  //   ...extra,
  // }
  // console.log('测试携带参数', query)
  // return ifStringify ? qs.stringify(query) : query
}

export const storage = {
  get(key: string) {
    const objstr = localStorage.getItem(key)
    if (objstr) {
      try {
        return JSON.parse(objstr) || undefined
      } catch (e) {
        return objstr
      }
    }
    return undefined
  },
  set(key: string, value: any) {
    try {
      return localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      return localStorage.setItem(key, value)
    }
  },
  remove(key: string) {
    localStorage.removeItem(key)
  },
  clear() {
    localStorage.clear()
  }
}

/**
 * @name removeStorageByPrefix
 * @desc 删除指定前缀的storage缓存
 */
export const removeStorageByPrefix = (prefix: string, predict?: Function) => {
  const keys = Object.keys(localStorage)
  const targetKeys: string[] = keys.filter((key: any) => isFunction(predict) ? predict(key) : key.startsWith(prefix))
  targetKeys.forEach((key: any) => storage.remove(key))
}

export const asyncFunc = <F extends (...args: any) => any>(
  func: F,
  options?: Parameters<F>[0],
  params?: Parameters<F>[]
): Promise<any> =>
  new Promise((resolve, reject) => {
    func(Object.assign({}, options, { success: resolve, fail: (msg: any, code: any) => reject({ code, msg }) }), ...(params || []))
  })

export const getCacheKey = (key: string, USER_INFO: any) => {
  return `${key}_${USER_INFO.tid}`
}

export function checkNeedAesEncrypt(url: string) {
  if (!crypto()) {
    return false
  }
  if (!SYSTEM_INFO.CP_OF) {
    return false
  }
  return !url.includes('/v1/sdkconfig/init')
}


export function removeKeyFromObject(obj: any) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => key !== 'ruixue-encipher')
  )
}

export function isJsonString(str: any) {
  try {
    const parsed = JSON.parse(str)
    return true
  } catch (e) {
    return false
  }
}

export function aesEncryptBase64String(data: any, key: string) {
  return AesEncryptBase64String(JSON.stringify(data), key, key.slice(0, 16))
}

export function aesDecryptBase64String(data: any, key: string) {
  return AesDecryptBase64String(data, key, key.slice(0, 16))
}

export function trackEncrypt(options: any, platform: string, key: string) {
  trackApi([
    {
      event: '#rx_error',
      type: 'track',
      time: formatDate('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      uuid: v4(),
      sub_channel_id: USER_INFO.subchannelid,
      distinct_id: USER_INFO.openid,
      platform_id: 4,
      product_id: SYSTEM_INFO.productId,
      cpid: Number(SYSTEM_INFO.cpid),
      channel_id: SYSTEM_INFO.channelId,
      devicecode: getDevicecode(),
      properties: {
        error_action: 'encrypt',
        error_type: 'sdk',
        trace_id: v4(),
        rx_version: SYSTEM_INFO.__RX_SDK_VERSION,
        type_tripartite: platform,
        request_address: options.url || '',
        request_header: options.header || '',
        request_body: options.data || '',
        key
      }
    }
  ]).catch((e: any) => {
    console.log(e)
  })
}

export function trackDecrypt(options: any, res: any, platform: string, key: string) {
  if (options.url.includes('/v1/data/api/track')) {
    return
  }
  trackApi([
    {
      event: '#rx_error',
      type: 'track',
      time: formatDate('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      uuid: v4(),
      sub_channel_id: USER_INFO.subchannelid,
      distinct_id: USER_INFO.openid,
      platform_id: 4,
      product_id: SYSTEM_INFO.productId,
      cpid: Number(SYSTEM_INFO.cpid),
      channel_id: SYSTEM_INFO.channelId,
      devicecode: getDevicecode(),
      properties: {
        error_action: 'decrypt',
        error_type: 'sdk',
        trace_id: v4(),
        rx_version: SYSTEM_INFO.__RX_SDK_VERSION,
        type_tripartite: platform,
        request_address: options.url || '',
        request_header: options.header || '',
        request_body: options.data || '',
        request_response: res?.data,
        key
      }
    }
  ]).catch((e: any) => {
    console.log(e)
  })
}

export const getDevicecode = () => {
  let devicecode = storage.get('rx_devicecode')
  if (devicecode) {
    return devicecode.code
  } else {
    let code = v4()
    storage.set('rx_devicecode', { code })
    return code
  }
}
