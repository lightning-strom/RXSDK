import axios, { AxiosRequestConfig, AxiosInstance } from 'axios'
import { getSignature } from '@/utils/encrypt'
import { USER_INFO, SYSTEM_INFO } from '@/config'

const request: AxiosInstance = axios.create({
  baseURL: '',
  timeout: 5000,
})

request.interceptors.request.use((config: AxiosRequestConfig) => {
  const defaultData = (config.url || '').indexOf('sign') > -1 ? {} : {
    type: SYSTEM_INFO.type,
    appid: SYSTEM_INFO.appid,
    channelid: SYSTEM_INFO.channelid,
    platformid: SYSTEM_INFO.platformid,
    deviceCode: SYSTEM_INFO.deviceCode,
    fromChannel: SYSTEM_INFO.fromChannel,
  }
  config.params = Object.assign({}, config.params, getSignature({
    ...USER_INFO,
    ...SYSTEM_INFO,
  }))
  if (config.method === 'post') {
    config.data = Object.assign({}, defaultData, config.data)
  } else if (config.method === 'get') {
    config.params = Object.assign({}, defaultData, config.params)
  }
  console.log(`request - ${config.method} - ${config.url}}: `, config.data, config.params)
  return config
}, (error: Error) => {
  return Promise.reject(error)
})

request.interceptors.response.use(
  (response) => {
    const res = response.data
    console.log(`response - ${response.config.method} - ${response.config.url}}: `, res)
    if (res.code !== 0) {
      const msg = res.msg || 'Error'
      const error: any = new Error(msg)
      error.code = res.code
      error.data = res
      return Promise.reject(error)
    } else {
      return response.data
    }
  },
  async (error) => {
    const response = error.response
    const config = error.config
    if (response) {
      error.message = `${response.statusText}[${response.status}]: ${response.data && response.data.msg}`
    }
    if (config?.url && !config.url.includes('log/up')) {
      console.log(`${config.url}: request error, ${error}, try to post logs.`)
      try {
      } catch (error) {
        console.error(error)
      }
    }
    return Promise.reject(error)
  }
)

export default request
