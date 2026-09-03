import { SYSTEM_INFO } from '@/config'
import v4 from 'uuid/v4'
import { COMMON_ERROR_CODE } from '@/config/const'
import {
  aesDecryptBase64String,
  aesEncryptBase64String,
  checkNeedAesEncrypt,
  customGetStorageSync,
  customSetStorageSync,
  getDevicecode,
  isJsonString,
  removeKeyFromObject,
  trackDecrypt,
  trackEncrypt,
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
    ['ruixue-tzoffset']: SYSTEM_INFO.timezone + ''
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

const retryRequest = async (options: any, resolve: any, reject: any) => {
  const cloud: any = my.customCloud
  const headers = removeKeyFromObject(options.headers)
  printLog(`${options.path}`)
  printLog(`options`, options)
  try {
    const result = await cloud.application.httpRequest({
      ...options,
      headers
    })
    const res: any = JSON.parse(result)
    printLog(`${options.path}`)
    printLog(`res`, res)
    resolve(res)
  } catch (err) {
    printLog(`${options.path}`)
    printLog(`err`, err)
    reject(err)
  }
}

const myRequest = (options: any) => {
  const devicecode = getDevicecode()
  const key = generateMD5(devicecode + cpkey)
  printLog(`${options.path}`)
  printLog(`options`, options)
  const cloud: any = my.customCloud

  return new Promise(async (resolve, reject) => {
    let data = options.data
    const isAes = checkNeedAesEncrypt(options.path)

    try {
      data = (isAes && options.method.toLowerCase() != 'get') ? aesEncryptBase64String(options.data, key) : options.data
      if (isAes && options.method.toLowerCase() != 'get') {
        printLog('Encrypt Data:', data)
      }
    } catch (e) {
      trackEncrypt(options, 'taobao', key)
      retryRequest(options, resolve, reject)
      return
    }

    try {
      const result = await cloud.application.httpRequest({
        ...options,
        body: data
      })
      const res: any = JSON.parse(result)
      if ([302015, 302016].includes(res.code)) {
        printLog('request 解密失败', options.url, res.data?.code)
        trackDecrypt(options, res, 'taobao', key)
        retryRequest(options, resolve, reject)
      } else {
        let data = res.data
        if (isAes && data) {
          try {
            if (res.code === 0) {
              data = aesDecryptBase64String(data, key)
              printLog('Decrypt Data:', data)
              const result = {
                ...res,
                data: isJsonString(data) ? JSON.parse(data) : data
              }
              printLog(`${options.url}`)
              printLog(`res`, result)
              resolve(result)
            } else {
              resolve(res)
            }
          } catch (e) {
            printLog('response 解密失败', options.url, e)
            trackDecrypt(options, res, 'taobao', key)
            retryRequest(options, resolve, reject)
          }
        } else {
          printLog(`${options.path}`)
          printLog(`res`, res)
          resolve(res)
        }
      }

      resolve(res)
    } catch (err) {
      reject(err)
    }
  })
}

function isHttpOrHttps(url: string) {
  return /^(http:\/\/|https:\/\/)/.test(url)
}

async function doRequest(options: any, urlIndex = 0, refreshNum = 0, enableHttpDNS = false): Promise<any> {
  SYSTEM_INFO.reqUrlIndex = urlIndex
  const cloud: any = my.customCloud
  const path = options.url
  if (!apiWhiteList.find((item: string) => options.url.startsWith(item)) && !SYSTEM_INFO.SDK_INIT_FINISHED) {
    console.info('sdk doRequest options: ', options)
    const error: any = new Error('初始化错误，或未初始化')
    error.code = COMMON_ERROR_CODE.INIT_PARAMS_ERROR
    return Promise.reject(error)
  }
  const headers: any = getHeaders(path)
  const url = isHttpOrHttps(path) ? path : SYSTEM_INFO.baseUrlList[urlIndex] + path

  try {
    const res: any = await myRequest({
      //不需要完整域名，只需要接口访问路径即可
      path,
      method: options.method,
      //POST请求需要指定下请求格式，只支持application/json。 如："content-type":"application/json;charset=UTF-8"
      headers,
      data: options.data || {},
      params: options.params || {},
      //对于一个小程序关联多个云应用的场景，调用非默认云应用，需要指定对应的云应用Id,超时时间单位ms
      exts: {
        cloudAppId: my.customCloudAppId,
        timeout: 5000,
        // 空应用调用需要填写该字段，包括协议头以及端口号（可省略），支持http、https
        domain: SYSTEM_INFO.baseUrlList[urlIndex]
      }
    })

    if (res.code === 0) {
      return Promise.resolve(res)
    }

    if (refreshCode.includes(res.code)) {
      if (refreshNum === 10) {
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
