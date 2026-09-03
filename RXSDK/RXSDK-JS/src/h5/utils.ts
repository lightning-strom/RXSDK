import { handleError, qs } from '@/utils/utils'
import { isFunction } from '@/utils/is'
import v4 from 'uuid/v4'
import { trackApi } from '@/h5/apis'
import { formatDate } from '@/utils/day'
import { SYSTEM_INFO, USER_INFO } from '@/config'
// @ts-ignore
import { cryptoJS } from '../index.crypto.js'
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

/**
 * 生成 MD5 加密字符串
 * @param {string} message - 需要加密的字符串
 * @returns {string} - 加密后的 MD5 字符串
 */
export function generateMD5(message: string) {
  const CryptoJS = crypto()
  if (CryptoJS)
    return CryptoJS.MD5(message).toString()
  return ''
}


/**
 * 获取系统设备信息(同步)
 * */
export const getUCSystemInfoSync = () => {
  const uc = (window as any).uc || null
  if (!uc) return {}
  try {
    const data = uc.getSystemInfoSync()
    return JSON.parse(data)
  } catch (err) {
  }
  return {}
}


function getQueryParams() {
  const url = window.location.href
  const index = url.indexOf('?')
  if (index === -1) return {}
  const queryString = url.substring(index + 1)
  const params: any = {}
  const pairs = queryString.split('&')
  for (const pair of pairs) {
    const [key, value] = pair.split('=')
    params[key] = decodeURIComponent(value || '')
  }
  return params
}

/**
 * @name getSearchQueries
 * @desc 解析并存储 URL 参数
 */
export function getSearchQueries(ifStringify: true): string
export function getSearchQueries(): object
export function getSearchQueries(ifStringify?: true): object | string {
  let query: any = {}
  switch (process.env.TYPE) {
    case 'h5_uc':
      try {
        let launchOptions = uc.getLaunchOptionsSync()
        if (typeof launchOptions === 'string') {
          launchOptions = JSON.parse(launchOptions)
          query = launchOptions.query ? qs.parse(launchOptions.query) : {}
          query = {
            ...query,
            entry: launchOptions.entry,
            state: launchOptions.state
          }
        }
      } catch (e) {
        query = {
          ...query,
          entry: 'unkown'
        }
      }
      break

    case 'h5_huawei':
      query = {}
      break
    default:
      query = getQueryParams()
  }
  return ifStringify ? qs.stringify(query) : query
}

export const customGetStorageSync = (key: string) => {
  const str: any = localStorage.getItem(key)
  try {
    return JSON.parse(str)
  } catch (e) {
    return str
  }
}

export const customSetStorageSync = (key: string, value: any) => {
  localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value)
}

export const removeStorageSync = (key: string) => {
  localStorage.removeItem(key)
}


export const getDevicecode = () => {
  let devicecode = customGetStorageSync('rx_devicecode')
  if (devicecode) {
    return devicecode.code
  } else {
    let code = v4()
    customSetStorageSync('rx_devicecode', { code })
    return code
  }
}

function validateNumber(num: number) {
  const numStr = num.toString();
  const isSixDigits = /^\d{6}$/.test(numStr);
  if (!isSixDigits) {
    return false;
  }
  const thirdDigit = parseInt(numStr[2]);
  const fourthDigit = parseInt(numStr[3]);
  return `${thirdDigit}${fourthDigit}` === '20';
}

export const handleTrackError = (platform: string, error_action: 'rxlog_error_pay' | 'rxlog_error_login' | 'rxlog_error_share' | 'rxlog_error_init' | 'rxlog_error_ad' | '' = '', error: any, code?: any) => {
  const handle_error: any = handleError(error, code)
  if (validateNumber(handle_error.code) || !handle_error.isServerError) {
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
          error_action,
          error_type: 'sdk',
          trace_id: v4(),
          rx_version: SYSTEM_INFO.__RX_SDK_VERSION,
          type_tripartite: platform,
          request_address: handle_error.url || '',
          request_header: handle_error.request_header || '',
          request_body: handle_error.request_body || '',
          error_code: handle_error.code,
          error_message: handle_error.msg || '',
          error_code_tripartite: handle_error.thirdcode || '',
          error_message_tripartite: handle_error.thirdmsg || '',
          cp_userid: USER_INFO.cp_user_id,
          error_ext: '请前往 https://doc.ruixueyun.com/#/view?path=9e58d663-7313-498c-b95c-f8706ec09bdd 查看解决方案'
        }
      }
    ]).catch((e: any)=>{
      console.log(e)
    })
  }
  return {
    code: handle_error.code,
    msg: handle_error.msg,
    thirdcode: handle_error.thirdcode,
    thirdmsg: handle_error.thirdmsg,
  }
}

// 获取localStorage中所有的key
export function getAllKeys() {
  let keys: any[] = []
  for (let i = 0; i < localStorage.length; i++) {
    keys.push(localStorage.key(i))
  }
  return keys
}

export const removeStorageByPrefix = (prefix: string, predict?: Function) => {
  const targetKeys: string[] = getAllKeys().filter((key: any) => isFunction(predict) ? predict(key) : key.startsWith(prefix))
  targetKeys.forEach((key: any) => localStorage.removeItem(key))
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
