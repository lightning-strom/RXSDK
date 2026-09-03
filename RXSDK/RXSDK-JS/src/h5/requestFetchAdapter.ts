const buildUrl = (url: string, params: any, paramsSerializer?: (params: any) => string) => {
  if (!params) return url
  const query = paramsSerializer
    ? paramsSerializer(params)
    : Object.keys(params)
      .filter(key => params[key] !== undefined && params[key] !== null)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&')

  if (!query) return url
  return `${url}${url.includes('?') ? '&' : '?'}${query}`
}

const normalizeHeaders = (headers: any = {}) => {
  const result: any = {}
  Object.keys(headers).forEach((key) => {
    if (headers[key] !== undefined && headers[key] !== null) {
      result[key] = headers[key]
    }
  })
  return result
}

export default function fetchAdapter(config: any): Promise<any> {
  return new Promise((resolve, reject) => {
    if (typeof fetch === 'undefined') {
      reject(new Error('fetch is not supported'))
      return
    }

    const method = (config.method || 'get').toUpperCase()
    const isGetLike = method === 'GET' || method === 'HEAD'
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null
    const timer = config.timeout && controller
      ? setTimeout(() => controller.abort(), config.timeout)
      : null
    const url = buildUrl(config.url, config.params, config.paramsSerializer)
    const requestOptions: any = {
      method,
      headers: normalizeHeaders(config.headers),
      body: isGetLike ? undefined : config.data,
      credentials: config.withCredentials ? 'include' : 'same-origin',
      signal: controller ? controller.signal : undefined
    }

    fetch(url, requestOptions).then((response) => {
      if (timer) clearTimeout(timer)
      const responseHeaders: any = {}
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value
      })

      return response.text().then((data) => {
        const axiosResponse = {
          data,
          status: response.status,
          statusText: response.statusText,
          headers: responseHeaders,
          config,
          request: requestOptions
        }
        const validateStatus = config.validateStatus
        if (!response.status || !validateStatus || validateStatus(response.status)) {
          resolve(axiosResponse)
        } else {
          const error: any = new Error(`Request failed with status code ${response.status}`)
          error.config = config
          error.request = requestOptions
          error.response = axiosResponse
          error.isAxiosError = true
          reject(error)
        }
      })
    }).catch((error) => {
      if (timer) clearTimeout(timer)
      const normalizedError: any = new Error(error?.name === 'AbortError' ? 'timeout' : (error?.message || 'Network Error'))
      normalizedError.config = config
      normalizedError.request = requestOptions
      normalizedError.code = error?.name === 'AbortError' ? 'ECONNABORTED' : error?.code
      normalizedError.isAxiosError = true
      reject(normalizedError)
    })
  })
}
