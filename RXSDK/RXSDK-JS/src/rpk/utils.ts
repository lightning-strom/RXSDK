import { handleError, qs } from '@/utils/utils'
import { compareVersions, isFunction } from '@/utils/is'
import v4 from 'uuid/v4'
import { trackApi } from '@/rpk/apis'
import { formatDate } from '@/utils/day'
import { SYSTEM_INFO, USER_INFO } from '@/config'
// @ts-ignore
import { cryptoJS } from '../index.crypto.js'
export const cpkey = '4ca7dacc9332d74e1292c83f0aa3b376'

function crypto(): any {
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
    case 'baidu':
      let { query: baiduQuery, referrerInfo: baiduReferrerInfo } = swan.getLaunchOptionsSync()
      const baiduExtra = baiduReferrerInfo?.extraData || {}
      query = {
        ...baiduQuery,
        ...baiduExtra
      }
      break
    case 'alipay':
      let { query: aliQuery, referrerInfo: aliReferrerInfo } = my.getLaunchOptionsSync()
      const aliExtra = aliReferrerInfo?.extraData || {}
      query = {
        ...aliQuery,
        ...aliExtra
      }
      break
    case 'taobao':
      // 淘宝暂时没有 getLaunchOptionsSync 方法
      query = {}
      break
    case 'ks':
      let { query: ksQuery } = ks.getLaunchOptionsSync()
      query = {
        ...ksQuery
      }
      break
    case 'bilibili':
      let { query: blQuery, referrerInfo: blReferrerInfo } = bl.getLaunchOptionsSync()
      const blExtra = blReferrerInfo?.extraData || {}
      query = {
        ...blQuery,
        ...blExtra
      }
      break
    case 'jd':
      let { query: jdQuery, referrerInfo: jdReferrerInfo } = jd.getLaunchOptionsSync()
      const jdExtra = jdReferrerInfo?.extraData || {}
      query = {
        ...jdQuery,
        ...jdExtra
      }
      break
    case 'douyin':
      let { query: ttQuery, referrerInfo: ttReferrerInfo } = tt.getLaunchOptionsSync()
      const ttExtra = ttReferrerInfo?.extraData || {}
      query = {
        ...ttQuery,
        ...ttExtra
      }
      break
    case 'gamebox':
      let {
        query: gameboxQuery,
        referrerInfo: gameboxReferrerInfo
      } = gamebox.getLaunchOptionsSync()
      const gameboxExtra = gameboxReferrerInfo?.extraData || {}
      query = {
        ...gameboxQuery,
        ...gameboxExtra
      }
      break
    case 'meituan':
      let { query: mtQuery } = wx.getLaunchOptionsSync()
      query = {
        ...mtQuery
      }
      break
    case '4399':
      let {
        query: gamebox4399Query,
        referrerInfo: gamebox4399ReferrerInfo
      } = gamebox.getLaunchOptionsSync()
      const gamebox4399Extra = gamebox4399ReferrerInfo?.extraData || {}
      query = {
        ...gamebox4399Query,
        ...gamebox4399Extra
      }
      break
    case 'mgtv':
      let { query: mgtvQuery, path: mgtvPath } = mgtv.getLaunchOptionsSync()
      const deviceInfo = mgtv.getDeviceInfo()
      const compare = compareVersions(deviceInfo.SDKVersion, '1.2.9')
      if(compare === -1 && mgtvPath) {
        const mgQuery = qs.parse(decodeURIComponent(mgtvPath))
        query = {
          ...mgQuery,
          ...mgtvQuery
        }
      } else {
        query = {
          ...mgtvQuery
        }
      }
      break
    default:
      query = getQueryParams()
  }
  return ifStringify ? qs.stringify(query) : query
}

export const customGetStorageSync = (key: string) => {
  switch (process.env.TYPE) {
    case 'baidu':
      return swan.getStorageSync(key)
    case 'alipay':
      const aliRes = my.getStorageSync({ key })
      if (aliRes.success) {
        const ali_str: any = aliRes.data
        try {
          return JSON.parse(ali_str)
        } catch (e) {
          return ali_str
        }
      } else {
        return ''
      }
    case 'taobao':
      const tbRes = my.getStorageSync({ key })
      const tb_str: any = tbRes.data
      try {
        return JSON.parse(tb_str)
      } catch (e) {
        return tb_str
      }
    case 'ks':
      const ksRes = ks.getStorageSync(key)
      try {
        return JSON.parse(ksRes) || ''
      } catch (e) {
        return ksRes || ''
      }
    case 'bilibili':
      return bl.getStorageSync(key)
    case 'jd':
      return jd.getStorageSync(key)
    case 'douyin':
      return tt.getStorageSync(key)
    case 'gamebox':
      return gamebox.getStorageSync(key)
    case '4399':
      return gamebox.getStorageSync(key)
    case 'meituan':
      return wx.getStorageSync(key)
    default:
      const str: any = localStorage.getItem(key)
      try {
        return JSON.parse(str)
      } catch (e) {
        return str
      }
  }
}

export const customSetStorageSync = (key: string, value: any) => {
  switch (process.env.TYPE) {
    case 'baidu':
      swan.setStorageSync(key, value)
      break
    case 'alipay':
      my.setStorageSync({
        key,
        data: value
      })
      break
    case 'taobao':
      my.setStorageSync({
        key,
        data: value
      })
      break
    case 'ks':
      ks.setStorageSync(key, value)
      break
    case 'bilibili':
      bl.setStorageSync(key, value)
      break
    case 'jd':
      jd.setStorageSync(key, value)
      break
    case 'douyin':
      tt.setStorageSync(key, value)
      break
    case 'gamebox':
      gamebox.setStorageSync(key, value)
      break
    case '4399':
      gamebox.setStorageSync(key, value)
      break
    case 'meituan':
      wx.setStorageSync(key, value)
      break
    default:
      localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value)
  }
}

export const removeStorageSync = (key: string) => {
  switch (process.env.TYPE) {
    case 'baidu':
      swan.removeStorageSync(key)
      break
    case 'alipay':
      my.removeStorageSync({ key })
      break
    case 'taobao':
      my.removeStorageSync({ key })
      break
    case 'ks':
      ks.removeStorageSync(key)
      break
    case 'bilibili':
      bl.removeStorageSync(key)
      break
    case 'jd':
      jd.removeStorageSync(key)
      break
    case 'douyin':
      tt.removeStorageSync(key)
      break
    case 'gamebox':
      gamebox.removeStorageSync(key)
      break
    case '4399':
      gamebox.removeStorageSync(key)
      break
    case 'meituan':
      wx.removeStorageSync(key)
      break
    default:
      localStorage.removeItem(key)
  }
}

// 获取localStorage中所有的key
function getAllKeys() {
  let keys: any[] = []
  for (let i = 0; i < localStorage.length; i++) {
    keys.push(localStorage.key(i))
  }
  return keys
}

export const removeStorageByPrefix = (prefix: string, predict?: Function) => {
  let info: any
  let targetKeys: string[] = []
  switch (process.env.TYPE) {
    case 'baidu':
      info = swan.getStorageInfoSync()
      targetKeys = info.keys.filter((key: any) => isFunction(predict) ? predict(key) : key.startsWith(prefix))
      targetKeys.forEach((key: any) => swan.removeStorageSync(key))
      break
    case 'alipay':
      info = my.getStorageInfoSync()
      targetKeys = info.keys.filter((key: any) => isFunction(predict) ? predict(key) : key.startsWith(prefix))
      targetKeys.forEach((key: any) => my.removeStorageSync({ key }))
      break
    case 'taobao':
      info = my.getStorageInfoSync()
      targetKeys = info.keys.filter((key: any) => isFunction(predict) ? predict(key) : key.startsWith(prefix))
      targetKeys.forEach((key: any) => my.removeStorageSync({ key }))
      break
    case 'ks':
      info = ks.getStorageInfoSync()
      targetKeys = info.keys.filter((key: any) => isFunction(predict) ? predict(key) : key.startsWith(prefix))
      targetKeys.forEach((key: any) => ks.removeStorageSync(key))
      break
    case 'bilibili':
      info = bl.getStorageInfoSync()
      targetKeys = info.keys.filter((key: any) => isFunction(predict) ? predict(key) : key.startsWith(prefix))
      targetKeys.forEach((key: any) => bl.removeStorageSync(key))
      break
    case 'jd':
      info = jd.getStorageInfoSync()
      targetKeys = info.keys.filter((key: any) => isFunction(predict) ? predict(key) : key.startsWith(prefix))
      targetKeys.forEach((key: any) => jd.removeStorageSync(key))
      break
    case 'douyin':
      info = tt.getStorageInfoSync()
      targetKeys = info.keys.filter((key: any) => isFunction(predict) ? predict(key) : key.startsWith(prefix))
      targetKeys.forEach((key: any) => tt.removeStorageSync(key))
      break
    case 'gamebox':
      info = gamebox.getStorageInfoSync()
      targetKeys = info.keys.filter((key: any) => isFunction(predict) ? predict(key) : key.startsWith(prefix))
      targetKeys.forEach((key: any) => gamebox.removeStorageSync(key))
      break
    case '4399':
      info = gamebox.getStorageInfoSync()
      targetKeys = info.keys.filter((key: any) => isFunction(predict) ? predict(key) : key.startsWith(prefix))
      targetKeys.forEach((key: any) => gamebox.removeStorageSync(key))
      break
    case 'meituan':
      info = wx.getStorageInfoSync()
      targetKeys = info.keys.filter((key: any) => isFunction(predict) ? predict(key) : key.startsWith(prefix))
      targetKeys.forEach((key: any) => wx.removeStorageSync(key))
      break
    default:
      targetKeys = getAllKeys().filter((key: any) => isFunction(predict) ? predict(key) : key.startsWith(prefix))
      targetKeys.forEach((key: any) => localStorage.removeItem(key))
  }
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

// 支付凭证已经使用过
const VOUCHERUSED = 302408
// 支付凭证无效
const VOUCHEREXPIRED = 302409

export const isDropOrder = (errCode: number) => {
  return (
    [152407, 152401, 182001, 142601, 142602, 152403, 152404].includes(errCode) ||
    (errCode >= 1000 && errCode < 2000)
  )
}

export const expiredVoucherCode = [VOUCHERUSED, VOUCHEREXPIRED]

function validateNumber(num: number) {
  const numStr = num.toString()
  const isSixDigits = /^\d{6}$/.test(numStr)
  if (!isSixDigits) {
    return false
  }
  const thirdDigit = parseInt(numStr[2])
  const fourthDigit = parseInt(numStr[3])
  return `${thirdDigit}${fourthDigit}` === '20'
}

export const handleTrackError = (platform: string, error_action: 'rxlog_error_pay' | 'rxlog_error_login' | 'rxlog_error_share' | 'rxlog_error_init' | 'rxlog_error_ad' | '' = '', error: any, code?: any) => {
  const handle_error: any = handleError(error, code)
  if (validateNumber(handle_error.code) || !handle_error.isServerError) {
    if(!SYSTEM_INFO.isMatch) {
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
            error_ext: '请前往 https://doc.ruixuecloud.com/#/view?path=9e58d663-7313-498c-b95c-f8706ec09bdd 查看解决方案'
          }
        }
      ]).catch((e: any)=>{
        console.log(e)
      })
    }
  }
  return {
    code: handle_error.code,
    msg: handle_error.msg,
    thirdcode: handle_error.thirdcode,
    thirdmsg: handle_error.thirdmsg
  }
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
