import { SYSTEM_INFO, USER_INFO } from '@/config'
import v4 from 'uuid/v4'
import { COMMON_ERROR_CODE } from '@/config/const'
import { asyncFunc, printLog } from '@/utils/utils'
import { trackApi } from '@/api/api'
import { formatDate } from '@/utils/day'
import { PLATFORM } from '@/config/enum'
// @ts-ignore
// import { cryptoJS } from '../index.crypto.js'

export const cpkey = '4ca7dacc9332d74e1292c83f0aa3b376'

function crypto(): any {
  // @ts-ignore
  // return cryptoJS()
  return wx.crypto
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

const getDevicecode = () => {
  try {
    var devicecode = wx.getStorageSync('rx_devicecode')
    if (devicecode) {
      // @ts-ignore
      return devicecode.code
    } else {
      let code = v4()
      wx.setStorageSync('rx_devicecode', { code, openIds: {} })
      return code
    }
  } catch (err) {
    return v4()
  }
}

function checkNeedAesEncrypt(url: string) {
  if (!crypto()) {
    return false
  }
  if (!SYSTEM_INFO.CP_OF) {
    return false
  }
  return !url.includes('/v1/sdkconfig/init')
}

// 接口白名单：初始化未成功之前能走请求的接口
const apiWhiteList = ['/v1/sdkconfig/init', '/v1/vcapi/update', '/v1/vcapi/update_module_version']
const refreshCode = [302206, 302207, 302002]

function moveToStart(arr: string[], index: number) {
  // 移除指定索引的元素并获取它
  const element = arr.splice(index, 1)[0]
  // 在数组开始位置插入这个元素
  arr.unshift(element)
  return arr
}

const refreshTokenReq = (): Promise<any> =>
  doRequest({
    method: 'POST',
    url: '/v1/passport/token/refresh'
  })

const getHeaders = (path: string) => {
  const accessWhiteSpace = [
    '/v1/passport/account/login_by_credential',
    '/v1/passport/account/login_by_token'
  ]
  const getDevicecode = () => {
    try {
      var devicecode = wx.getStorageSync('rx_devicecode')
      if (devicecode) {
        // @ts-ignore
        return devicecode.code
      } else {
        let code = v4()
        wx.setStorageSync('rx_devicecode', { code, openIds: {} })
        return code
      }
    } catch (err) {
      return v4()
    }
  }
  const devicecode = getDevicecode()

  let headers: any = {
    ['ruixue-language']: 'zh-CN',
    ['ruixue-cpid']: SYSTEM_INFO.cpid,
    ['ruixue-productid']: SYSTEM_INFO.productId,
    ['ruixue-channelid']: SYSTEM_INFO.channelId,
    ['ruixue-platformid']: '4',
    ['ruixue-devicecode']: devicecode,
    ['ruixue-version']: SYSTEM_INFO.__RX_SDK_VERSION,
    ['ruixue-traceid']: v4(),
    ['ruixue-tzoffset']: SYSTEM_INFO.timezone + ''
  }

  let rxToken = wx.getStorageSync('rxToken')
  if (!accessWhiteSpace.includes(path)) {
    // @ts-ignore
    Reflect.set(headers, 'ruixue-accesstoken', rxToken?.access || '')
  }
  if (path == '/v1/passport/token/refresh') {
    console.log('refresh')
    headers['ruixue-datacount'] = '1'
    // @ts-ignore
    headers['ruixue-refreshtoken'] = rxToken?.refresh
  }
  if (path.includes('/v1/data/api/track')) {
    headers = {
      ['ruixue-datacount']: '1'
    }
  }

  if (checkNeedAesEncrypt(path)) {
    headers['ruixue-encipher'] = '1'
    headers['ruixue-devicecode'] = devicecode
    headers['ruixue-version'] = SYSTEM_INFO.__RX_SDK_VERSION
    headers['ruixue-platformid'] = '4'
  }

  if (SYSTEM_INFO.region_tag) {
    headers['ruixue-region'] = `${SYSTEM_INFO.region_tag}`
  }

  if (SYSTEM_INFO.cp_role_id) {
    headers['ruixue-cp-role-id'] = `${SYSTEM_INFO.cp_role_id}`
  }

  if (SYSTEM_INFO.miniVersion) {
    headers['ruixue-appinfo'] = `version=${SYSTEM_INFO.miniVersion}`
  }
  return headers
}

function removeKeyFromObject(obj: any) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => key !== 'ruixue-encipher')
  )
}

function isJsonString(str: any) {
  try {
    const parsed = JSON.parse(str)
    return true
  } catch (e) {
    return false
  }
}

const retryRequest = (options: any, resolve: any, reject: any) => {
  const header = removeKeyFromObject(options.header)
  printLog(`${options.url}`)
  printLog(`options`, options)
  printLog(`timeout`, SYSTEM_INFO.timeout)
  wx.request({
    ...options,
    header,
    timeout: SYSTEM_INFO.timeout || 7000,
    data: options.data,
    success: (res: any) => {
      printLog(`${options.url}`)
      printLog(`res`, res.data)
      resolve(res.data)
    },
    fail: (res: any) => {
      printLog(`${options.url}`)
      printLog(`err`, res)
      reject(res)
    }
  })
}

function trackEncrypt(options: any, key: string) {
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
        type_tripartite: PLATFORM.WECHAT,
        request_address: options.url || '',
        request_header: options.header || '',
        request_body: options.data || '',
        key
      }
    }
  ]).catch((e) => {
    console.log(e)
  })
}

function trackDecrypt(options: any, res: any, key: string) {
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
        type_tripartite: PLATFORM.WECHAT,
        request_address: options.url || '',
        request_header: options.header || '',
        request_body: options.data || '',
        request_response: res?.data,
        key
      }
    }
  ]).catch((e) => {
    console.log(e)
  })
}

const myRequest = (options: any) => {
  const devicecode = getDevicecode()
  const key = generateMD5(devicecode + cpkey)
  printLog(`${options.url}`)
  printLog(`options`, options)
  return new Promise((resolve, reject) => {
    let data = options.data
    const isAes = checkNeedAesEncrypt(options.url)

    try {
      data = (isAes && options.method.toLowerCase() != 'get') ? AesEncryptBase64String(JSON.stringify(options.data), key, key.slice(0, 16)) : options.data
      if (isAes && options.method.toLowerCase() != 'get') {
        printLog('Encrypt Data:', data)
      }
    } catch (e) {
      trackEncrypt(options, key)
      retryRequest(options, resolve, reject)
      return
    }
    printLog(`timeout`, SYSTEM_INFO.timeout)
    wx.request({
      ...options,
      data,
      timeout: SYSTEM_INFO.timeout || 7000,
      success: (res: any) => {
        if ([302015, 302016].includes(res.data?.code)) {
          printLog('request 解密失败', options.url, res.data?.code)
          trackDecrypt(options, res, key)
          retryRequest(options, resolve, reject)
        } else {
          let data = res.data?.data
          if (isAes && data) {
            try {
              if (res.data?.code === 0) {
                data = AesDecryptBase64String(data, key, key.slice(0, 16))
                printLog('Decrypt Data:', data)
                const result = {
                  ...res.data,
                  data: isJsonString(data) ? JSON.parse(data) : data
                }
                printLog(`${options.url}`)
                printLog(`res`, result)
                resolve(result)
              } else {
                resolve(res.data)
              }
            } catch (e) {
              printLog('response 解密失败', options.url, e)
              trackDecrypt(options, res, key)
              retryRequest(options, resolve, reject)
            }
          } else {
            printLog(`${options.url}`)
            printLog(`res`, res.data)
            resolve(res.data)
          }
        }
      },
      fail: (res: any) => {
        printLog(`${options.url}`)
        printLog(`err`, res)
        reject(res)
      }
    })
  })
}

function isHttpOrHttps(url: string) {
  return /^(http:\/\/|https:\/\/)/.test(url)
}

async function resetOptions(options: any) {
  const _options = JSON.parse(JSON.stringify(options))
  try {
    if (_options.url == '/v1/passport/account/login_by_credential') {
      const { code } = await asyncFunc(wx.login)
      _options.data.ext.code = code
    }
  } catch (e) {
    console.log(e)
  }

  try {
    if (_options.url == '/v1/passport/user/sync_info') {
      const { code } = await asyncFunc(wx.login)
      _options.data.code = code
    }
  } catch (e) {
    console.log(e)
  }

  try {
    if (_options.url == '/v1/passport/captcha/send_auth') {
      const { code } = await asyncFunc(wx.login)
      _options.data.minigame_code = code
    }
  } catch (e) {
    console.log(e)
  }

  return _options
}

export async function doRequest(options: any, urlIndex = 0, refreshNum = 0, enableHttpDNS = false): Promise<any> {
  SYSTEM_INFO.reqUrlIndex = urlIndex
  const path = options.url
  if (!apiWhiteList.find((item: string) => options.url.startsWith(item)) && !SYSTEM_INFO.SDK_INIT_FINISHED) {
    printLog('sdk doRequest options: ', JSON.stringify(options))
    const error: any = {
      msg: '初始化错误，或未初始化',
      code: COMMON_ERROR_CODE.INIT_PARAMS_ERROR,
      thirdcode: COMMON_ERROR_CODE.INIT_PARAMS_ERROR,
      thrdmsg: '初始化错误，或未初始化',
      url: options.url
    }
    throw error
  }
  const headers: any = getHeaders(path)
  const useHttpDNS = !!SYSTEM_INFO.httpDNSServiceId && enableHttpDNS
  const enableHttpDNSOptions = useHttpDNS ? {
    enableHttpDNS: true,
    httpDNSServiceId: SYSTEM_INFO.httpDNSServiceId
  } : {}

  if (useHttpDNS) {
    printLog('---useHttpDNS---')
    printLog(SYSTEM_INFO.httpDNSServiceId)
  }

  try {
    const url = isHttpOrHttps(path) ? path : SYSTEM_INFO.baseUrlList[urlIndex] + path
    const res: any = await myRequest({
      url,
      method: options.method,
      data: options.data || options.params,
      header: {
        ...headers
      },
      enableHttp2: true,
      ...enableHttpDNSOptions
    })
    if (res.code == 0) {
      return res
    }

    if (refreshCode.includes(res.code)) {
      if (refreshNum === 5) {
        refreshNum = 0
        throw { code: 1000000, msg: 'refresh token failed,please login again' }
      } else {
        refreshNum++
        const refreshRes = await refreshTokenReq()
        wx.setStorageSync('rxToken', refreshRes.data)
        const _options = await resetOptions(options)
        return await doRequest(_options, urlIndex, refreshNum, enableHttpDNS)
      }
    } else {
      const msg = res.msg || res.message || res.errorMsg || 'Error'
      const error: any = new Error(msg)
      error.code = res.code || COMMON_ERROR_CODE.UNKNOW_NETWORK_ERROR
      error.data = res.data || res
      error.thirdcode = res.thirdcode
      error.thirdmsg = res.thirdmsg

      error.client_ip = res.client_ip || ''
      error.isServerError = true
      throw error
    }
  } catch (e: any) {
    if (urlIndex < SYSTEM_INFO.baseUrlList.length - 1) {
      urlIndex++
      const _options = await resetOptions(options)
      return await doRequest(_options, urlIndex, refreshNum, enableHttpDNS)
    } else {
      urlIndex = 0
      if (!enableHttpDNS && (e.errMsg?.includes('ERR_NAME_NOT_RESOLVED') || e.errMsg?.includes('ERR_CONNECTION_TIMED_OUT'))) {
        const _options = await resetOptions(options)
        return await doRequest(_options, urlIndex, refreshNum, true)
      }
    }

    const url = isHttpOrHttps(path) ? path : SYSTEM_INFO.baseUrlList[urlIndex] + path
    const error = {
      url,
      request_header: headers,
      request_body: options.data || options.params,
      code: e.code || e.errno || COMMON_ERROR_CODE.UNKNOW_NETWORK_ERROR,
      msg: e.msg || e.message || e.errMsg || 'Error',
      // thirdcode: e.errno || e.code || COMMON_ERROR_CODE.UNKNOW_NETWORK_ERROR,
      // thirdmsg: e.msg || e.message || e.errMsg || 'Error',
      ...e
    }
    throw error
  }
}
