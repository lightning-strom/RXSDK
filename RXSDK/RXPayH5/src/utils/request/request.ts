import axios from 'axios'
import { SYSTEM_INFO } from '@/utils/utils'
import { showNotify } from 'vant'
import {
  isJsonString,
  generateMD5,
  cpkey,
  AesEncryptBase64String,
  AesDecryptBase64String
} from './crypto-js'

function aesEncryptBase64String(data: any) {
  return AesEncryptBase64String(JSON.stringify(data), key, key.slice(0, 16))
}

function aesDecryptBase64String(data: any) {
  return AesDecryptBase64String(data, key, key.slice(0, 16))
}

const COMMON_ERROR_CODE = {
  UNKNOW_NETWORK_ERROR: 1000,
  TIMEOUT: 1131,
  REQUEST_ABORTED: 1132,
  NETWORK_ERROR: 1100,
  NOT_FOUND: 1401,
  INTERNAL_SERVER_ERROR: 1500,
  PARAMS_ERROR: 2000,
  INIT_PARAMS_ERROR: 2001,
  API_NOT_EXIST: 2002,
  PAY_PARAMS_ERROR: 4000,
  SHARE_CANCEL: 5001,
  SHARE_TRIGGER_OVERTIME: 5003,
  USER_INFO_AUTH_DENY: 6003,
  LOCATION_FAIL: 6020,
  LOCATION_AUTH_DENY: 6021,
  FRIENDINTERACTION_AUTH_DENY: 6022,
  GAMECLUBDATA_AUTH_DENY: 6023,
  AD_LOAD_OVERTIME: 10000
}


const request = axios.create()

const axiosRequest = (options: any) => {
  const _options: any = {
    url: options.url,
    method: options.method,
    headers: options.headers,
    params: options.params || ''
  }
  if (options.data && options.method.toLowerCase() !== 'get') {
    _options.data = options.data
  }
  return request(_options)
}

let key = ''

export async function service(options: any, lower?: boolean): Promise<any> {
  try {
    const devicecode = SYSTEM_INFO.request_headers['ruixue-devicecode']
    key = generateMD5(devicecode + cpkey)
    const cpof = SYSTEM_INFO.cpof || false
    const version = 'v3.10.0'

    const headers: any = {
      'ruixue-accesstoken': SYSTEM_INFO.request_headers['ruixue-accesstoken'],
      'ruixue-channelid': SYSTEM_INFO.request_headers['ruixue-channelid'],
      'ruixue-productid': SYSTEM_INFO.request_headers['ruixue-productid'],
      'ruixue-cpid': SYSTEM_INFO.request_headers['ruixue-cpid'],
      'ruixue-traceid': SYSTEM_INFO.request_headers['ruixue-traceid'],
      'ruixue-language': SYSTEM_INFO.request_headers['ruixue-language'],
      'ruixue-tzoffset': SYSTEM_INFO.request_headers['ruixue-tzoffset'],
      'ruixue-platformid': 3,
      'ruixue-version': version,
      'ruixue-devicecode': devicecode
    }

    let data = options.data || {}

    try {
      if (cpof && !lower) {
        headers['ruixue-encipher'] = '1'
        headers['ruixue-platformid'] = '3'
        headers['ruixue-devicecode'] = devicecode
        headers['ruixue-version'] = version
        headers['Content-Type'] = 'text/plan'
        data = aesEncryptBase64String(data)
      }
    } catch (err: any) {
      console.log('加密失败', err)
      return service(options, true)
    }

    const result: any = await axiosRequest({
      url: SYSTEM_INFO.domain + options.url,
      method: options.method,
      headers,
      data,
      params: options.params || ''
    })

    const res = result.data

    if (res.code === 0) {
      try {
        if (res.data && cpof && !lower) {
          data = aesDecryptBase64String(res.data)
          res.data = isJsonString(data) ? JSON.parse(data) : data
        }
      } catch (err: any) {
        console.log('前端解密失败', err)
        return service(options, true)
      }
      console.log(res)
      return Promise.resolve(res)
    } else if ([302015, 302016].includes(res.code)) {
      console.log('服务端解密失败', res)
      return service(options, true)
    } else {
      const msg = res.msg || res.message || 'Error'
      showNotify({ type: 'warning', message: msg })
      return Promise.reject({
        code: res.code || COMMON_ERROR_CODE.UNKNOW_NETWORK_ERROR,
        msg,
        data: res.data || res
      })
    }
  } catch (e: any) {
    console.log(e)
    const msg = e.msg || e.message || 'Error'
    showNotify({ type: 'warning', message: msg })
    return Promise.reject({
      code: e.code || COMMON_ERROR_CODE.UNKNOW_NETWORK_ERROR,
      msg
    })
  }
}

export { service as doRequest }