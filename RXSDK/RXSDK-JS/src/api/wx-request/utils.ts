// @ts-nocheck

function encode(val) {
  return encodeURIComponent(val)
    .replace(/%40/gi, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function mergeConfig(config0 = {}, config1 = {}) {
  return {
    ...config0,
    ...config1,
  }
}

export function combineUrl(url: string, baseURL: string) {
  return `${baseURL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`
}

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
export function combineURLs(baseURL, relativeURL) {
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val: object) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams
}

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
export function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
export function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL)
  }
  return requestedURL
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
export function buildURL(url: string, params: object, paramsSerializer: Function) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url
  }

  var serializedParams
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString()
  } else {
    var parts = []

    forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return
      }

      if (isArray(val)) {
        key = key + '[]'
      } else {
        val = [val]
      }

      forEach(val, function parseValue(v) {
        if (isDate(v)) {
          v = v.toISOString()
        } else if (isObject(v)) {
          v = JSON.stringify(v)
        }
        parts.push(encode(key) + '=' + encode(v))
      })
    })

    serializedParams = parts.join('&')
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#')
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex)
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }

  return url
}

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val: Object) {
  return toString.call(val) === '[object Array]'
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
export function forEach(obj: any, fn: Function) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    obj = [obj]
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj)
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj)
      }
    }
  }
}

export function bind(fn: Function, thisArg: any) {
  return function wrap() {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    return fn.apply(thisArg, args)
  }
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
export function extend(a: any, b: any, thisArg?: any) {
  forEach(b, function assignValue(val: any, key: any) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg)
    } else {
      a[key] = val
    }
  })
  return a
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val: object) {
  return toString.call(val) === '[object Date]'
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val: object) {
  return val !== null && typeof val === 'object'
}

/**
 * 处理各平台返回的响应数据，抹平差异
 * @param mpResponse
 * @param config axios处理过的请求配置对象
 * @param request 小程序的调用发起请求时，传递给小程序api的实际配置
 */
export function transformResponse(mpResponse: any, config: any) {
  var headers = mpResponse.header || mpResponse.headers
  var status = mpResponse.statusCode || mpResponse.status
  var statusText = ''
  if (status === 200) {
    statusText = 'OK'
  } else if (status === 400) {
    statusText = 'Bad Request'
  }
  var response = {
    data: mpResponse.data,
    status: status,
    statusText: statusText,
    headers: headers,
    config: config,
  }
  return response
}

/**
 * 处理各平台返回的错误信息，抹平差异
 * @param error 小程序api返回的错误对象
 * @param config
 */
export function transformError(error: any, config: any) {
  /* 微信 */
  if (error.errMsg.indexOf('request:fail abort') !== -1) {
    // Handle request cancellation (as opposed to a manual cancellation)
    return createError('Request aborted', config, 'ECONNABORTED', '')
  } else if (error.errMsg.indexOf('timeout') !== -1) {
    // timeout
    return createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED', '')
  } else {
    // NetWordError
    return createError('Network Error', config, null, '')
  }
}

function createError(message: any, config: any, code: any, request?: any, response?: any) {
  var error: any = new Error(message)
  error.config = config
  if (code) {
    error.code = code
  }

  error.request = request
  error.response = response
  error.isAxiosError = true

  return error
}
