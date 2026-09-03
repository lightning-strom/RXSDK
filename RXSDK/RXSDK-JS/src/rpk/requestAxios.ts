import axios from 'axios'
import { SYSTEM_INFO } from '@/config'
import v4 from 'uuid/v4'
import { COMMON_ERROR_CODE } from '@/config/const'
import {
  aesDecryptBase64String,
  aesEncryptBase64String,
  checkNeedAesEncrypt,
  getDevicecode,
  isJsonString,
  removeKeyFromObject,
  trackDecrypt,
  trackEncrypt,
  cpkey,
  generateMD5,
  customGetStorageSync,
  customSetStorageSync
} from '@/rpk/utils'
import { printLog } from '@/utils/utils'

// 接口白名单：初始化未成功之前能走请求的接口
const apiWhiteList = ['/v1/sdkconfig/init', '/v1/vcapi/update', '/v1/vcapi/update_module_version', '/v1/data/api/track']
const refreshCode = [302206, 302207, 302002]

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
      var devicecode = customGetStorageSync('rx_devicecode')
      if (devicecode) {
        // @ts-ignore
        return devicecode.code
      } else {
        let code = v4()
        customSetStorageSync('rx_devicecode', { code, openIds: {} })
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

  let rxToken = customGetStorageSync('rxToken')
  if (!accessWhiteSpace.includes(path)) {
    // @ts-ignore
    Reflect.set(headers, 'ruixue-accesstoken', rxToken?.access)
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
    headers['Content-Type'] = 'text/plan'
  }

  if (SYSTEM_INFO.region_tag) {
    headers['ruixue-region'] = `${SYSTEM_INFO.region_tag}`
  }

  if (SYSTEM_INFO.cp_role_id) {
    headers['ruixue-cp-role-id'] = `${SYSTEM_INFO.cp_role_id}`
  }

  return headers
}

const requestAxios = axios.create({
  timeout: 60000,
  responseType: 'json',
  withCredentials: false
})

const retryRequest = (options: any, resolve: any, reject: any) => {
  const headers = removeKeyFromObject(options.headers)
  printLog(`${options.url}`)
  printLog(`options`, options)
  requestAxios({
    url: options.url,
    method: options.method,
    headers,
    params: options.params,
    data: options.data
  }).then(res => {
    printLog(`${options.url}`)
    printLog(`res`, res.data)
    resolve(res.data)
  }).catch(err => {
    printLog(`${options.url}`)
    printLog(`err`, JSON.stringify(err))
    reject(err)
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
      data = (isAes && options.method.toLowerCase() != 'get') ? aesEncryptBase64String(options.data, key) : options.data
      if (isAes && options.method.toLowerCase() != 'get') {
        printLog('Encrypt Data:', data)
        printLog('Self Encrypt Data:', aesDecryptBase64String(data, key))
      }
    } catch (e) {
      // @ts-ignore
      trackEncrypt(options, process.env.TYPE, key)
      retryRequest(options, resolve, reject)
      return
    }

    requestAxios({
      url: options.url,
      method: options.method,
      headers: options.headers,
      params: options.params,
      data
    }).then(res => {
      if (res.status == 500) {
        return Promise.reject({
          code: COMMON_ERROR_CODE.INTERNAL_SERVER_ERROR,
          msg: res.statusText
        })
      } else if ([302015, 302016].includes(res.data?.code)) {
        printLog('request 解密失败', options.url, res.data?.code)
        // @ts-ignore
        trackDecrypt(options, res, process.env.TYPE, key)
        retryRequest(options, resolve, reject)
      } else {
        let data = res.data?.data
        if (isAes && data) {
          try {
            if (res.data?.code === 0) {
              data = aesDecryptBase64String(data, key)
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
            // @ts-ignore
            trackDecrypt(options, res, process.env.TYPE, key)
            retryRequest(options, resolve, reject)
          }
        } else {
          printLog(`${options.url}`)
          printLog(`res`, res.data)
          resolve(res.data)
        }
      }
    }).catch(err => {
      reject(err)
    })
  })
}

function isHttpOrHttps(url: string) {
  return /^(http:\/\/|https:\/\/)/.test(url)
}

export async function doRequest(options: any, urlIndex = 0, refreshNum = 0): Promise<any> {
  SYSTEM_INFO.reqUrlIndex = urlIndex
  if (!apiWhiteList.find((item: string) => options.url.startsWith(item)) && !SYSTEM_INFO.SDK_INIT_FINISHED) {
    console.info('sdk doRequest options: ', options)
    const error: any = new Error('初始化错误，或未初始化')
    error.code = COMMON_ERROR_CODE.INIT_PARAMS_ERROR
    return Promise.reject(error)
  }
  const path = options.url
  const headers: any = getHeaders(path)
  const url = isHttpOrHttps(path) ? path : SYSTEM_INFO.baseUrlList[urlIndex] + path
  try {
    const res: any = await myRequest({
      ...options,
      url,
      headers
    })

    if (res.code == 0) {
      return Promise.resolve(res)
    }

    if (refreshCode.includes(res.code)) {
      if (refreshNum === 5) {
        refreshNum = 0
        return Promise.reject({ code: 1000000, msg: 'refresh token failed,please login again' })
      } else {
        refreshNum++
        return refreshTokenReq().then((refreshRes) => {
          customSetStorageSync('rxToken', refreshRes.data)
          return doRequest(options, urlIndex, refreshNum)
        })
      }
    } else {
      const msg = res.msg || res.message || res.errorMsg || 'Error'
      const error: any = new Error(msg)
      error.code = res.code || COMMON_ERROR_CODE.UNKNOW_NETWORK_ERROR
      error.data = res.data || res
      error.thirdcode = res.thirdcode
      error.thirdmsg = res.thirdmsg

      error.isServerError = true
      error.url = url
      error.request_header = headers
      error.request_body = options.data || options.params
      return Promise.reject(error)
    }
  } catch (error: any) {
    if (urlIndex < SYSTEM_INFO.baseUrlList.length - 1) {
      urlIndex++
      return doRequest(options, urlIndex, refreshNum)
    }

    if (error.message == 'Network Error') {
      return Promise.reject({
        code: COMMON_ERROR_CODE.NETWORK_ERROR,
        msg: error.message
      })
    }

    if (error.message == 'timeout') {
      return Promise.reject({
        code: COMMON_ERROR_CODE.TIMEOUT,
        msg: error.message
      })
    }

    if (error.message == 'Request aborted') {
      return Promise.reject({
        code: COMMON_ERROR_CODE.REQUEST_ABORTED,
        msg: error.message
      })
    }

    return Promise.reject({
      url,
      request_header: headers,
      request_body: options.data || options.params,
      code: error.code || COMMON_ERROR_CODE.UNKNOW_NETWORK_ERROR,
      msg: error.msg || error.message || error.errMsg || 'Error',
      thirdcode: error.code || COMMON_ERROR_CODE.UNKNOW_NETWORK_ERROR,
      thirdmsg: error.msg || error.message || error.errMsg || 'Error',
      ...error
    })
  }
}
