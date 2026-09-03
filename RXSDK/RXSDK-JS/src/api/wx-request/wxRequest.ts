import { buildFullPath, buildURL, combineUrl, mergeConfig } from './utils'

export default function wxRequest(config: any): any {
  const { baseURL = '', url = '', headers, data = {} } = config
  config.header = config.headers
  delete config.headers
  const computedConfig = {
    ...(baseURL && {
      // url: combineUrl(url, baseURL),
      url: buildURL(buildFullPath(baseURL, url), config.params, config.paramsSerializer),
    }),
    data,
  }
  config = mergeConfig(config, computedConfig)
  console.info('======================')
  console.info('wxAxios wx.request config:', config)
  return new Promise((resolve, reject) => {
    wx.request({
      ...config,
      success(res) {
        console.info('======================')
        console.info('wxAxios wx.request success res:', res)
        return resolve(res)
      },
      fail(reason) {
        console.info('======================')
        console.info('wxAxios wx.request fail reason:', reason)
        return reject(reason)
      },
    })
  })
}
