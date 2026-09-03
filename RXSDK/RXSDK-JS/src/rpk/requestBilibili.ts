import { SYSTEM_INFO } from '@/config'
import v4 from 'uuid/v4'
import { COMMON_ERROR_CODE } from '@/config/const'
import {
  customGetStorageSync,
  customSetStorageSync,
  isJsonString,
  checkNeedAesEncrypt,
  aesEncryptBase64String,
  aesDecryptBase64String,
  removeKeyFromObject,
  trackDecrypt,
  trackEncrypt,
  getDevicecode,
  cpkey,
  generateMD5
} from '@/rpk/utils'
import { printLog } from '@/utils/utils'

// 接口白名单：初始化未成功之前能走请求的接口
const apiWhiteList = ['/v1/sdkconfig/init', '/v1/vcapi/update', '/v1/vcapi/update_module_version']
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
    ['ruixue-tzoffset']: SYSTEM_INFO.timezone + '',
  }

  let rxToken = customGetStorageSync('rxToken')
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

  return headers
}

const retryRequest = (options: any, resolve: any, reject: any) => {
  const header = removeKeyFromObject(options.header)
  printLog(`${options.url}`)
  printLog(`options`, options)
  bl.request({
    ...options,
    header,
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

const myRequest = (options: any) => {
  const isAes = checkNeedAesEncrypt(options.url)

  const devicecode = getDevicecode()
  const key = generateMD5(devicecode + cpkey)
  printLog(`${options.url}`)
  printLog(`options`, options)
  return new Promise((resolve, reject) => {
    let data = options.data

    try {
      data = (isAes && options.method.toLowerCase() != 'get') ? aesEncryptBase64String(options.data, key) : options.data
      if (isAes && options.method.toLowerCase() != 'get') {
        printLog('Encrypt Data:', data)
      }
    } catch (e) {
      trackEncrypt(options, 'baidu', key)
      retryRequest(options, resolve, reject)
      return
    }

    bl.request({
      ...options,
      data,
      success: (res: any) => {
        if ([302015, 302016].includes(res.data?.code)) {
          printLog('request 解密失败', options.url, res.data?.code)
          trackDecrypt(options, res, 'baidu', key)
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
              trackDecrypt(options, res, 'baidu', key)
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

async function doRequest(options: any, urlIndex = 0, refreshNum = 0, enableHttpDNS = false): Promise<any> {
  SYSTEM_INFO.reqUrlIndex = urlIndex
  const path = options.url

  if (!apiWhiteList.find((item: string) => options.url.startsWith(item)) && !SYSTEM_INFO.SDK_INIT_FINISHED) {
    printLog('sdk doRequest options: ', options)
    const error: any = new Error('初始化错误，或未初始化')
    error.code = COMMON_ERROR_CODE.INIT_PARAMS_ERROR
    return Promise.reject(error)
  }
  const headers: any = getHeaders(path)

  const useHttpDNS = !!SYSTEM_INFO.httpDNSServiceId && enableHttpDNS
  const enableHttpDNSOptions = useHttpDNS ? {
    enableHttpDNS: true,
    httpDNSServiceId: SYSTEM_INFO.httpDNSServiceId
  } : {}

  if (useHttpDNS) {
    console.log('---useHttpDNS---')
    console.log(SYSTEM_INFO.httpDNSServiceId)
  }
  const url = isHttpOrHttps(path) ? path : SYSTEM_INFO.baseUrlList[urlIndex] + path

  try {
    const res: any = await myRequest({
      url,
      method: options.method,
      data: options.data || options.params,
      header: headers
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
          return doRequest(options, urlIndex, refreshNum, enableHttpDNS)
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
  } catch (e: any) {
    if (urlIndex < SYSTEM_INFO.baseUrlList.length - 1) {
      urlIndex++
      return doRequest(options, urlIndex, refreshNum, enableHttpDNS)
    } else {
      urlIndex = 0
      if (!enableHttpDNS && (e.errMsg?.includes('ERR_NAME_NOT_RESOLVED') || e.errMsg?.includes('ERR_CONNECTION_TIMED_OUT'))) {
        return doRequest(options, urlIndex, refreshNum, true)
      }
    }

    return Promise.reject({
      url,
      request_header: headers,
      request_body: options.data || options.params,
      code: e.code || COMMON_ERROR_CODE.UNKNOW_NETWORK_ERROR,
      msg: e.msg || e.message || e.errMsg || 'Error',
      thirdcode: e.code || COMMON_ERROR_CODE.UNKNOW_NETWORK_ERROR,
      thirdmsg: e.msg || e.message || e.errMsg || 'Error',
      ...e
    })
  }
}

export default doRequest
