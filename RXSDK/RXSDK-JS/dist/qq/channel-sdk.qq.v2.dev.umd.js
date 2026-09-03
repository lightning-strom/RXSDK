;;;console.warn("%cchannelSDK: Your are using Dev version!!!", "font-size: 20px;");;;
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.channelSDK = factory());
})(this, (function () { 'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol, Iterator */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
        return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (g && (g = 0, op[0] && (_ = 0)), _) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    var bind$1 = function bind(fn, thisArg) {
      return function wrap() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        return fn.apply(thisArg, args);
      };
    };

    // utils is a library of generic helper functions non-specific to axios

    var toString$2 = Object.prototype.toString;

    /**
     * Determine if a value is an Array
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an Array, otherwise false
     */
    function isArray$2(val) {
      return toString$2.call(val) === '[object Array]';
    }

    /**
     * Determine if a value is undefined
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if the value is undefined, otherwise false
     */
    function isUndefined$1(val) {
      return typeof val === 'undefined';
    }

    /**
     * Determine if a value is a Buffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Buffer, otherwise false
     */
    function isBuffer$1(val) {
      return val !== null && !isUndefined$1(val) && val.constructor !== null && !isUndefined$1(val.constructor)
        && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
    }

    /**
     * Determine if a value is an ArrayBuffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an ArrayBuffer, otherwise false
     */
    function isArrayBuffer$1(val) {
      return toString$2.call(val) === '[object ArrayBuffer]';
    }

    /**
     * Determine if a value is a FormData
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an FormData, otherwise false
     */
    function isFormData$1(val) {
      return (typeof FormData !== 'undefined') && (val instanceof FormData);
    }

    /**
     * Determine if a value is a view on an ArrayBuffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
     */
    function isArrayBufferView$1(val) {
      var result;
      if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
        result = ArrayBuffer.isView(val);
      } else {
        result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
      }
      return result;
    }

    /**
     * Determine if a value is a String
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a String, otherwise false
     */
    function isString$2(val) {
      return typeof val === 'string';
    }

    /**
     * Determine if a value is a Number
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Number, otherwise false
     */
    function isNumber$1(val) {
      return typeof val === 'number';
    }

    /**
     * Determine if a value is an Object
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an Object, otherwise false
     */
    function isObject$3(val) {
      return val !== null && typeof val === 'object';
    }

    /**
     * Determine if a value is a plain Object
     *
     * @param {Object} val The value to test
     * @return {boolean} True if value is a plain Object, otherwise false
     */
    function isPlainObject(val) {
      if (toString$2.call(val) !== '[object Object]') {
        return false;
      }

      var prototype = Object.getPrototypeOf(val);
      return prototype === null || prototype === Object.prototype;
    }

    /**
     * Determine if a value is a Date
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Date, otherwise false
     */
    function isDate$1(val) {
      return toString$2.call(val) === '[object Date]';
    }

    /**
     * Determine if a value is a File
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a File, otherwise false
     */
    function isFile$1(val) {
      return toString$2.call(val) === '[object File]';
    }

    /**
     * Determine if a value is a Blob
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Blob, otherwise false
     */
    function isBlob$1(val) {
      return toString$2.call(val) === '[object Blob]';
    }

    /**
     * Determine if a value is a Function
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Function, otherwise false
     */
    function isFunction$3(val) {
      return toString$2.call(val) === '[object Function]';
    }

    /**
     * Determine if a value is a Stream
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Stream, otherwise false
     */
    function isStream$1(val) {
      return isObject$3(val) && isFunction$3(val.pipe);
    }

    /**
     * Determine if a value is a URLSearchParams object
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a URLSearchParams object, otherwise false
     */
    function isURLSearchParams$1(val) {
      return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
    }

    /**
     * Trim excess whitespace off the beginning and end of a string
     *
     * @param {String} str The String to trim
     * @returns {String} The String freed of excess whitespace
     */
    function trim$1(str) {
      return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
    }

    /**
     * Determine if we're running in a standard browser environment
     *
     * This allows axios to run in a web worker, and react-native.
     * Both environments support XMLHttpRequest, but not fully standard globals.
     *
     * web workers:
     *  typeof window -> undefined
     *  typeof document -> undefined
     *
     * react-native:
     *  navigator.product -> 'ReactNative'
     * nativescript
     *  navigator.product -> 'NativeScript' or 'NS'
     */
    function isStandardBrowserEnv$1 () { return false }
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
    function forEach$1(obj, fn) {
      // Don't bother if no value provided
      if (obj === null || typeof obj === 'undefined') {
        return;
      }

      // Force an array if not already something iterable
      if (typeof obj !== 'object') {
        /*eslint no-param-reassign:0*/
        obj = [obj];
      }

      if (isArray$2(obj)) {
        // Iterate over array values
        for (var i = 0, l = obj.length; i < l; i++) {
          fn.call(null, obj[i], i, obj);
        }
      } else {
        // Iterate over object keys
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            fn.call(null, obj[key], key, obj);
          }
        }
      }
    }

    /**
     * Accepts varargs expecting each argument to be an object, then
     * immutably merges the properties of each object and returns result.
     *
     * When multiple objects contain the same key the later object in
     * the arguments list will take precedence.
     *
     * Example:
     *
     * ```js
     * var result = merge({foo: 123}, {foo: 456});
     * console.log(result.foo); // outputs 456
     * ```
     *
     * @param {Object} obj1 Object to merge
     * @returns {Object} Result of all merge properties
     */
    function merge$1(/* obj1, obj2, obj3, ... */) {
      var result = {};
      function assignValue(val, key) {
        if (isPlainObject(result[key]) && isPlainObject(val)) {
          result[key] = merge$1(result[key], val);
        } else if (isPlainObject(val)) {
          result[key] = merge$1({}, val);
        } else if (isArray$2(val)) {
          result[key] = val.slice();
        } else {
          result[key] = val;
        }
      }

      for (var i = 0, l = arguments.length; i < l; i++) {
        forEach$1(arguments[i], assignValue);
      }
      return result;
    }

    /**
     * Extends object a by mutably adding to it the properties of object b.
     *
     * @param {Object} a The object to be extended
     * @param {Object} b The object to copy properties from
     * @param {Object} thisArg The object to bind function to
     * @return {Object} The resulting value of object a
     */
    function extend$1(a, b, thisArg) {
      forEach$1(b, function assignValue(val, key) {
        if (thisArg && typeof val === 'function') {
          a[key] = bind$1(val, thisArg);
        } else {
          a[key] = val;
        }
      });
      return a;
    }

    /**
     * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
     *
     * @param {string} content with BOM
     * @return {string} content value without BOM
     */
    function stripBOM(content) {
      if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
      }
      return content;
    }

    var utils$1 = {
      isArray: isArray$2,
      isArrayBuffer: isArrayBuffer$1,
      isBuffer: isBuffer$1,
      isFormData: isFormData$1,
      isArrayBufferView: isArrayBufferView$1,
      isString: isString$2,
      isNumber: isNumber$1,
      isObject: isObject$3,
      isPlainObject: isPlainObject,
      isUndefined: isUndefined$1,
      isDate: isDate$1,
      isFile: isFile$1,
      isBlob: isBlob$1,
      isFunction: isFunction$3,
      isStream: isStream$1,
      isURLSearchParams: isURLSearchParams$1,
      isStandardBrowserEnv: isStandardBrowserEnv$1,
      forEach: forEach$1,
      merge: merge$1,
      extend: extend$1,
      trim: trim$1,
      stripBOM: stripBOM
    };

    function encode$1(val) {
      return encodeURIComponent(val).
        replace(/%3A/gi, ':').
        replace(/%24/g, '$').
        replace(/%2C/gi, ',').
        replace(/%20/g, '+').
        replace(/%5B/gi, '[').
        replace(/%5D/gi, ']');
    }

    /**
     * Build a URL by appending params to the end
     *
     * @param {string} url The base of the url (e.g., http://www.google.com)
     * @param {object} [params] The params to be appended
     * @returns {string} The formatted url
     */
    var buildURL$1 = function buildURL(url, params, paramsSerializer) {
      /*eslint no-param-reassign:0*/
      if (!params) {
        return url;
      }

      var serializedParams;
      if (paramsSerializer) {
        serializedParams = paramsSerializer(params);
      } else if (utils$1.isURLSearchParams(params)) {
        serializedParams = params.toString();
      } else {
        var parts = [];

        utils$1.forEach(params, function serialize(val, key) {
          if (val === null || typeof val === 'undefined') {
            return;
          }

          if (utils$1.isArray(val)) {
            key = key + '[]';
          } else {
            val = [val];
          }

          utils$1.forEach(val, function parseValue(v) {
            if (utils$1.isDate(v)) {
              v = v.toISOString();
            } else if (utils$1.isObject(v)) {
              v = JSON.stringify(v);
            }
            parts.push(encode$1(key) + '=' + encode$1(v));
          });
        });

        serializedParams = parts.join('&');
      }

      if (serializedParams) {
        var hashmarkIndex = url.indexOf('#');
        if (hashmarkIndex !== -1) {
          url = url.slice(0, hashmarkIndex);
        }

        url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
      }

      return url;
    };

    function InterceptorManager() {
      this.handlers = [];
    }

    /**
     * Add a new interceptor to the stack
     *
     * @param {Function} fulfilled The function to handle `then` for a `Promise`
     * @param {Function} rejected The function to handle `reject` for a `Promise`
     *
     * @return {Number} An ID used to remove interceptor later
     */
    InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
      this.handlers.push({
        fulfilled: fulfilled,
        rejected: rejected,
        synchronous: options ? options.synchronous : false,
        runWhen: options ? options.runWhen : null
      });
      return this.handlers.length - 1;
    };

    /**
     * Remove an interceptor from the stack
     *
     * @param {Number} id The ID that was returned by `use`
     */
    InterceptorManager.prototype.eject = function eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    };

    /**
     * Iterate over all the registered interceptors
     *
     * This method is particularly useful for skipping over any
     * interceptors that may have become `null` calling `eject`.
     *
     * @param {Function} fn The function to call for each interceptor
     */
    InterceptorManager.prototype.forEach = function forEach(fn) {
      utils$1.forEach(this.handlers, function forEachHandler(h) {
        if (h !== null) {
          fn(h);
        }
      });
    };

    var InterceptorManager_1 = InterceptorManager;

    var normalizeHeaderName = function normalizeHeaderName(headers, normalizedName) {
      utils$1.forEach(headers, function processHeader(value, name) {
        if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
          headers[normalizedName] = value;
          delete headers[name];
        }
      });
    };

    /**
     * Update an Error with the specified config, error code, and response.
     *
     * @param {Error} error The error to update.
     * @param {Object} config The config.
     * @param {string} [code] The error code (for example, 'ECONNABORTED').
     * @param {Object} [request] The request.
     * @param {Object} [response] The response.
     * @returns {Error} The error.
     */
    var enhanceError$1 = function enhanceError(error, config, code, request, response) {
      error.config = config;
      if (code) {
        error.code = code;
      }

      error.request = request;
      error.response = response;
      error.isAxiosError = true;

      error.toJSON = function toJSON() {
        return {
          // Standard
          message: this.message,
          name: this.name,
          // Microsoft
          description: this.description,
          number: this.number,
          // Mozilla
          fileName: this.fileName,
          lineNumber: this.lineNumber,
          columnNumber: this.columnNumber,
          stack: this.stack,
          // Axios
          config: this.config,
          code: this.code
        };
      };
      return error;
    };

    /**
     * Create an Error with the specified message, config, error code, request and response.
     *
     * @param {string} message The error message.
     * @param {Object} config The config.
     * @param {string} [code] The error code (for example, 'ECONNABORTED').
     * @param {Object} [request] The request.
     * @param {Object} [response] The response.
     * @returns {Error} The created error.
     */
    var createError$1 = function createError(message, config, code, request, response) {
      var error = new Error(message);
      return enhanceError$1(error, config, code, request, response);
    };

    /**
     * Resolve or reject a Promise based on response status.
     *
     * @param {Function} resolve A function that resolves the promise.
     * @param {Function} reject A function that rejects the promise.
     * @param {object} response The response.
     */
    var settle$1 = function settle(resolve, reject, response) {
      var validateStatus = response.config.validateStatus;
      if (!response.status || !validateStatus || validateStatus(response.status)) {
        resolve(response);
      } else {
        reject(createError$1(
          'Request failed with status code ' + response.status,
          response.config,
          null,
          response.request,
          response
        ));
      }
    };

    /**
     * Determines whether the specified URL is absolute
     *
     * @param {string} url The URL to test
     * @returns {boolean} True if the specified URL is absolute, otherwise false
     */
    var isAbsoluteURL$1 = function isAbsoluteURL(url) {
      // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
      // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
      // by any combination of letters, digits, plus, period, or hyphen.
      return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
    };

    /**
     * Creates a new URL by combining the specified URLs
     *
     * @param {string} baseURL The base URL
     * @param {string} relativeURL The relative URL
     * @returns {string} The combined URL
     */
    var combineURLs$1 = function combineURLs(baseURL, relativeURL) {
      return relativeURL
        ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
        : baseURL;
    };

    /**
     * Creates a new URL by combining the baseURL with the requestedURL,
     * only when the requestedURL is not already an absolute URL.
     * If the requestURL is absolute, this function returns the requestedURL untouched.
     *
     * @param {string} baseURL The base URL
     * @param {string} requestedURL Absolute or relative URL to combine
     * @returns {string} The combined full path
     */
    var buildFullPath$1 = function buildFullPath(baseURL, requestedURL) {
      if (baseURL && !isAbsoluteURL$1(requestedURL)) {
        return combineURLs$1(baseURL, requestedURL);
      }
      return requestedURL;
    };

    // Headers whose duplicates are ignored by node
    // c.f. https://nodejs.org/api/http.html#http_message_headers
    var ignoreDuplicateOf = [
      'age', 'authorization', 'content-length', 'content-type', 'etag',
      'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
      'last-modified', 'location', 'max-forwards', 'proxy-authorization',
      'referer', 'retry-after', 'user-agent'
    ];

    /**
     * Parse headers into an object
     *
     * ```
     * Date: Wed, 27 Aug 2014 08:58:49 GMT
     * Content-Type: application/json
     * Connection: keep-alive
     * Transfer-Encoding: chunked
     * ```
     *
     * @param {String} headers Headers needing to be parsed
     * @returns {Object} Headers parsed into an object
     */
    var parseHeaders = function parseHeaders(headers) {
      var parsed = {};
      var key;
      var val;
      var i;

      if (!headers) { return parsed; }

      utils$1.forEach(headers.split('\n'), function parser(line) {
        i = line.indexOf(':');
        key = utils$1.trim(line.substr(0, i)).toLowerCase();
        val = utils$1.trim(line.substr(i + 1));

        if (key) {
          if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
            return;
          }
          if (key === 'set-cookie') {
            parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
          } else {
            parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
          }
        }
      });

      return parsed;
    };

    var xhr = function xhrAdapter(config) {
      return new Promise(function dispatchXhrRequest(resolve, reject) {
        var requestData = config.data;
        var requestHeaders = config.headers;
        var responseType = config.responseType;

        if (utils$1.isFormData(requestData)) {
          delete requestHeaders['Content-Type']; // Let the browser set it
        }

        var request = new XMLHttpRequest();

        // HTTP basic authentication
        if (config.auth) {
          var username = config.auth.username || '';
          var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
          requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
        }

        var fullPath = buildFullPath$1(config.baseURL, config.url);
        request.open(config.method.toUpperCase(), buildURL$1(fullPath, config.params, config.paramsSerializer), true);

        // Set the request timeout in MS
        request.timeout = config.timeout;

        function onloadend() {
          if (!request) {
            return;
          }
          // Prepare the response
          var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
          var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
            request.responseText : request.response;
          var response = {
            data: responseData,
            status: request.status,
            statusText: request.statusText,
            headers: responseHeaders,
            config: config,
            request: request
          };

          settle$1(resolve, reject, response);

          // Clean up request
          request = null;
        }

        if ('onloadend' in request) {
          // Use onloadend if available
          request.onloadend = onloadend;
        } else {
          // Listen for ready state to emulate onloadend
          request.onreadystatechange = function handleLoad() {
            if (!request || request.readyState !== 4) {
              return;
            }

            // The request errored out and we didn't get a response, this will be
            // handled by onerror instead
            // With one exception: request that using file: protocol, most browsers
            // will return status as 0 even though it's a successful request
            if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
              return;
            }
            // readystate handler is calling before onerror or ontimeout handlers,
            // so we should call onloadend on the next 'tick'
            setTimeout(onloadend);
          };
        }

        // Handle browser request cancellation (as opposed to a manual cancellation)
        request.onabort = function handleAbort() {
          if (!request) {
            return;
          }

          reject(createError$1('Request aborted', config, 'ECONNABORTED', request));

          // Clean up request
          request = null;
        };

        // Handle low level network errors
        request.onerror = function handleError() {
          // Real errors are hidden from us by the browser
          // onerror should only fire if it's a network error
          reject(createError$1('Network Error', config, null, request));

          // Clean up request
          request = null;
        };

        // Handle timeout
        request.ontimeout = function handleTimeout() {
          var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
          if (config.timeoutErrorMessage) {
            timeoutErrorMessage = config.timeoutErrorMessage;
          }
          reject(createError$1(
            timeoutErrorMessage,
            config,
            config.transitional && config.transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
            request));

          // Clean up request
          request = null;
        };

        // Add headers to the request
        if ('setRequestHeader' in request) {
          utils$1.forEach(requestHeaders, function setRequestHeader(val, key) {
            if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
              // Remove Content-Type if data is undefined
              delete requestHeaders[key];
            } else {
              // Otherwise add header to the request
              request.setRequestHeader(key, val);
            }
          });
        }

        // Add withCredentials to request if needed
        if (!utils$1.isUndefined(config.withCredentials)) {
          request.withCredentials = !!config.withCredentials;
        }

        // Add responseType to request if needed
        if (responseType && responseType !== 'json') {
          request.responseType = config.responseType;
        }

        // Handle progress if needed
        if (typeof config.onDownloadProgress === 'function') {
          request.addEventListener('progress', config.onDownloadProgress);
        }

        // Not all browsers support upload events
        if (typeof config.onUploadProgress === 'function' && request.upload) {
          request.upload.addEventListener('progress', config.onUploadProgress);
        }

        if (config.cancelToken) {
          // Handle cancellation
          config.cancelToken.promise.then(function onCanceled(cancel) {
            if (!request) {
              return;
            }

            request.abort();
            reject(cancel);
            // Clean up request
            request = null;
          });
        }

        if (!requestData) {
          requestData = null;
        }

        // Send the request
        request.send(requestData);
      });
    };

    var DEFAULT_CONTENT_TYPE = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    function setContentTypeIfUnset(headers, value) {
      if (!utils$1.isUndefined(headers) && utils$1.isUndefined(headers['Content-Type'])) {
        headers['Content-Type'] = value;
      }
    }

    function getDefaultAdapter() {
      var adapter;
      if (typeof XMLHttpRequest !== 'undefined') {
        // For browsers use XHR adapter
        adapter = xhr;
      } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
        // For node use HTTP adapter
        adapter = xhr;
      }
      return adapter;
    }

    function stringifySafely(rawValue, parser, encoder) {
      if (utils$1.isString(rawValue)) {
        try {
          (parser || JSON.parse)(rawValue);
          return utils$1.trim(rawValue);
        } catch (e) {
          if (e.name !== 'SyntaxError') {
            throw e;
          }
        }
      }

      return (encoder || JSON.stringify)(rawValue);
    }

    var defaults = {

      transitional: {
        silentJSONParsing: true,
        forcedJSONParsing: true,
        clarifyTimeoutError: false
      },

      adapter: getDefaultAdapter(),

      transformRequest: [function transformRequest(data, headers) {
        normalizeHeaderName(headers, 'Accept');
        normalizeHeaderName(headers, 'Content-Type');

        if (utils$1.isFormData(data) ||
          utils$1.isArrayBuffer(data) ||
          utils$1.isBuffer(data) ||
          utils$1.isStream(data) ||
          utils$1.isFile(data) ||
          utils$1.isBlob(data)
        ) {
          return data;
        }
        if (utils$1.isArrayBufferView(data)) {
          return data.buffer;
        }
        if (utils$1.isURLSearchParams(data)) {
          setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
          return data.toString();
        }
        if (utils$1.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {
          setContentTypeIfUnset(headers, 'application/json');
          return stringifySafely(data);
        }
        return data;
      }],

      transformResponse: [function transformResponse(data) {
        var transitional = this.transitional;
        var silentJSONParsing = transitional && transitional.silentJSONParsing;
        var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
        var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

        if (strictJSONParsing || (forcedJSONParsing && utils$1.isString(data) && data.length)) {
          try {
            return JSON.parse(data);
          } catch (e) {
            if (strictJSONParsing) {
              if (e.name === 'SyntaxError') {
                throw enhanceError$1(e, this, 'E_JSON_PARSE');
              }
              throw e;
            }
          }
        }

        return data;
      }],

      /**
       * A timeout in milliseconds to abort a request. If set to 0 (default) a
       * timeout is not created.
       */
      timeout: 0,

      xsrfCookieName: 'XSRF-TOKEN',
      xsrfHeaderName: 'X-XSRF-TOKEN',

      maxContentLength: -1,
      maxBodyLength: -1,

      validateStatus: function validateStatus(status) {
        return status >= 200 && status < 300;
      }
    };

    defaults.headers = {
      common: {
        'Accept': 'application/json, text/plain, */*'
      }
    };

    utils$1.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
      defaults.headers[method] = {};
    });

    utils$1.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
      defaults.headers[method] = utils$1.merge(DEFAULT_CONTENT_TYPE);
    });

    var defaults_1 = defaults;

    /**
     * Transform the data for a request or a response
     *
     * @param {Object|String} data The data to be transformed
     * @param {Array} headers The headers for the request or response
     * @param {Array|Function} fns A single function or Array of functions
     * @returns {*} The resulting transformed data
     */
    var transformData = function transformData(data, headers, fns) {
      var context = this || defaults_1;
      /*eslint no-param-reassign:0*/
      utils$1.forEach(fns, function transform(fn) {
        data = fn.call(context, data, headers);
      });

      return data;
    };

    var isCancel = function isCancel(value) {
      return !!(value && value.__CANCEL__);
    };

    /**
     * Throws a `Cancel` if cancellation has been requested.
     */
    function throwIfCancellationRequested(config) {
      if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
      }
    }

    /**
     * Dispatch a request to the server using the configured adapter.
     *
     * @param {object} config The config that is to be used for the request
     * @returns {Promise} The Promise to be fulfilled
     */
    var dispatchRequest = function dispatchRequest(config) {
      throwIfCancellationRequested(config);

      // Ensure headers exist
      config.headers = config.headers || {};

      // Transform request data
      config.data = transformData.call(
        config,
        config.data,
        config.headers,
        config.transformRequest
      );

      // Flatten headers
      config.headers = utils$1.merge(
        config.headers.common || {},
        config.headers[config.method] || {},
        config.headers
      );

      utils$1.forEach(
        ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
        function cleanHeaderConfig(method) {
          delete config.headers[method];
        }
      );

      var adapter = config.adapter || defaults_1.adapter;

      return adapter(config).then(function onAdapterResolution(response) {
        throwIfCancellationRequested(config);

        // Transform response data
        response.data = transformData.call(
          config,
          response.data,
          response.headers,
          config.transformResponse
        );

        return response;
      }, function onAdapterRejection(reason) {
        if (!isCancel(reason)) {
          throwIfCancellationRequested(config);

          // Transform response data
          if (reason && reason.response) {
            reason.response.data = transformData.call(
              config,
              reason.response.data,
              reason.response.headers,
              config.transformResponse
            );
          }
        }

        return Promise.reject(reason);
      });
    };

    /**
     * Config-specific merge-function which creates a new config-object
     * by merging two configuration objects together.
     *
     * @param {Object} config1
     * @param {Object} config2
     * @returns {Object} New object resulting from merging config2 to config1
     */
    var mergeConfig = function mergeConfig(config1, config2) {
      // eslint-disable-next-line no-param-reassign
      config2 = config2 || {};
      var config = {};

      var valueFromConfig2Keys = ['url', 'method', 'data'];
      var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
      var defaultToConfig2Keys = [
        'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
        'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
        'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
        'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
        'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
      ];
      var directMergeKeys = ['validateStatus'];

      function getMergedValue(target, source) {
        if (utils$1.isPlainObject(target) && utils$1.isPlainObject(source)) {
          return utils$1.merge(target, source);
        } else if (utils$1.isPlainObject(source)) {
          return utils$1.merge({}, source);
        } else if (utils$1.isArray(source)) {
          return source.slice();
        }
        return source;
      }

      function mergeDeepProperties(prop) {
        if (!utils$1.isUndefined(config2[prop])) {
          config[prop] = getMergedValue(config1[prop], config2[prop]);
        } else if (!utils$1.isUndefined(config1[prop])) {
          config[prop] = getMergedValue(undefined, config1[prop]);
        }
      }

      utils$1.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
        if (!utils$1.isUndefined(config2[prop])) {
          config[prop] = getMergedValue(undefined, config2[prop]);
        }
      });

      utils$1.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

      utils$1.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
        if (!utils$1.isUndefined(config2[prop])) {
          config[prop] = getMergedValue(undefined, config2[prop]);
        } else if (!utils$1.isUndefined(config1[prop])) {
          config[prop] = getMergedValue(undefined, config1[prop]);
        }
      });

      utils$1.forEach(directMergeKeys, function merge(prop) {
        if (prop in config2) {
          config[prop] = getMergedValue(config1[prop], config2[prop]);
        } else if (prop in config1) {
          config[prop] = getMergedValue(undefined, config1[prop]);
        }
      });

      var axiosKeys = valueFromConfig2Keys
        .concat(mergeDeepPropertiesKeys)
        .concat(defaultToConfig2Keys)
        .concat(directMergeKeys);

      var otherKeys = Object
        .keys(config1)
        .concat(Object.keys(config2))
        .filter(function filterAxiosKeys(key) {
          return axiosKeys.indexOf(key) === -1;
        });

      utils$1.forEach(otherKeys, mergeDeepProperties);

      return config;
    };

    var name = "axios";
    var version = "0.21.4";
    var description = "Promise based HTTP client for the browser and node.js";
    var main = "index.js";
    var scripts = {
    	test: "grunt test",
    	start: "node ./sandbox/server.js",
    	build: "NODE_ENV=production grunt build",
    	preversion: "npm test",
    	version: "npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json",
    	postversion: "git push && git push --tags",
    	examples: "node ./examples/server.js",
    	coveralls: "cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js",
    	fix: "eslint --fix lib/**/*.js"
    };
    var repository = {
    	type: "git",
    	url: "https://github.com/axios/axios.git"
    };
    var keywords = [
    	"xhr",
    	"http",
    	"ajax",
    	"promise",
    	"node"
    ];
    var author = "Matt Zabriskie";
    var license = "MIT";
    var bugs = {
    	url: "https://github.com/axios/axios/issues"
    };
    var homepage = "https://axios-http.com";
    var devDependencies = {
    	coveralls: "^3.0.0",
    	"es6-promise": "^4.2.4",
    	grunt: "^1.3.0",
    	"grunt-banner": "^0.6.0",
    	"grunt-cli": "^1.2.0",
    	"grunt-contrib-clean": "^1.1.0",
    	"grunt-contrib-watch": "^1.0.0",
    	"grunt-eslint": "^23.0.0",
    	"grunt-karma": "^4.0.0",
    	"grunt-mocha-test": "^0.13.3",
    	"grunt-ts": "^6.0.0-beta.19",
    	"grunt-webpack": "^4.0.2",
    	"istanbul-instrumenter-loader": "^1.0.0",
    	"jasmine-core": "^2.4.1",
    	karma: "^6.3.2",
    	"karma-chrome-launcher": "^3.1.0",
    	"karma-firefox-launcher": "^2.1.0",
    	"karma-jasmine": "^1.1.1",
    	"karma-jasmine-ajax": "^0.1.13",
    	"karma-safari-launcher": "^1.0.0",
    	"karma-sauce-launcher": "^4.3.6",
    	"karma-sinon": "^1.0.5",
    	"karma-sourcemap-loader": "^0.3.8",
    	"karma-webpack": "^4.0.2",
    	"load-grunt-tasks": "^3.5.2",
    	minimist: "^1.2.0",
    	mocha: "^8.2.1",
    	sinon: "^4.5.0",
    	"terser-webpack-plugin": "^4.2.3",
    	typescript: "^4.0.5",
    	"url-search-params": "^0.10.0",
    	webpack: "^4.44.2",
    	"webpack-dev-server": "^3.11.0"
    };
    var browser = {
    	"./lib/adapters/http.js": "./lib/adapters/xhr.js"
    };
    var jsdelivr = "dist/axios.min.js";
    var unpkg = "dist/axios.min.js";
    var typings = "./index.d.ts";
    var dependencies = {
    	"follow-redirects": "^1.14.0"
    };
    var bundlesize = [
    	{
    		path: "./dist/axios.min.js",
    		threshold: "5kB"
    	}
    ];
    var _package = {
    	name: name,
    	version: version,
    	description: description,
    	main: main,
    	scripts: scripts,
    	repository: repository,
    	keywords: keywords,
    	author: author,
    	license: license,
    	bugs: bugs,
    	homepage: homepage,
    	devDependencies: devDependencies,
    	browser: browser,
    	jsdelivr: jsdelivr,
    	unpkg: unpkg,
    	typings: typings,
    	dependencies: dependencies,
    	bundlesize: bundlesize
    };

    var _package$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        name: name,
        version: version,
        description: description,
        main: main,
        scripts: scripts,
        repository: repository,
        keywords: keywords,
        author: author,
        license: license,
        bugs: bugs,
        homepage: homepage,
        devDependencies: devDependencies,
        browser: browser,
        jsdelivr: jsdelivr,
        unpkg: unpkg,
        typings: typings,
        dependencies: dependencies,
        bundlesize: bundlesize,
        'default': _package
    });

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    function getCjsExportFromNamespace (n) {
    	return n && n['default'] || n;
    }

    var pkg = getCjsExportFromNamespace(_package$1);

    var validators$2 = {};

    // eslint-disable-next-line func-names
    ['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
      validators$2[type] = function validator(thing) {
        return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
      };
    });

    var deprecatedWarnings = {};
    var currentVerArr = pkg.version.split('.');

    /**
     * Compare package versions
     * @param {string} version
     * @param {string?} thanVersion
     * @returns {boolean}
     */
    function isOlderVersion(version, thanVersion) {
      var pkgVersionArr = thanVersion ? thanVersion.split('.') : currentVerArr;
      var destVer = version.split('.');
      for (var i = 0; i < 3; i++) {
        if (pkgVersionArr[i] > destVer[i]) {
          return true;
        } else if (pkgVersionArr[i] < destVer[i]) {
          return false;
        }
      }
      return false;
    }

    /**
     * Transitional option validator
     * @param {function|boolean?} validator
     * @param {string?} version
     * @param {string} message
     * @returns {function}
     */
    validators$2.transitional = function transitional(validator, version, message) {
      var isDeprecated = version && isOlderVersion(version);

      function formatMessage(opt, desc) {
        return '[Axios v' + pkg.version + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
      }

      // eslint-disable-next-line func-names
      return function(value, opt, opts) {
        if (validator === false) {
          throw new Error(formatMessage(opt, ' has been removed in ' + version));
        }

        if (isDeprecated && !deprecatedWarnings[opt]) {
          deprecatedWarnings[opt] = true;
          // eslint-disable-next-line no-console
          console.warn(
            formatMessage(
              opt,
              ' has been deprecated since v' + version + ' and will be removed in the near future'
            )
          );
        }

        return validator ? validator(value, opt, opts) : true;
      };
    };

    /**
     * Assert object's properties type
     * @param {object} options
     * @param {object} schema
     * @param {boolean?} allowUnknown
     */

    function assertOptions(options, schema, allowUnknown) {
      if (typeof options !== 'object') {
        throw new TypeError('options must be an object');
      }
      var keys = Object.keys(options);
      var i = keys.length;
      while (i-- > 0) {
        var opt = keys[i];
        var validator = schema[opt];
        if (validator) {
          var value = options[opt];
          var result = value === undefined || validator(value, opt, options);
          if (result !== true) {
            throw new TypeError('option ' + opt + ' must be ' + result);
          }
          continue;
        }
        if (allowUnknown !== true) {
          throw Error('Unknown option ' + opt);
        }
      }
    }

    var validator = {
      isOlderVersion: isOlderVersion,
      assertOptions: assertOptions,
      validators: validators$2
    };

    var validators$1 = validator.validators;
    /**
     * Create a new instance of Axios
     *
     * @param {Object} instanceConfig The default config for the instance
     */
    function Axios(instanceConfig) {
      this.defaults = instanceConfig;
      this.interceptors = {
        request: new InterceptorManager_1(),
        response: new InterceptorManager_1()
      };
    }

    /**
     * Dispatch a request
     *
     * @param {Object} config The config specific for this request (merged with this.defaults)
     */
    Axios.prototype.request = function request(config) {
      /*eslint no-param-reassign:0*/
      // Allow for axios('example/url'[, config]) a la fetch API
      if (typeof config === 'string') {
        config = arguments[1] || {};
        config.url = arguments[0];
      } else {
        config = config || {};
      }

      config = mergeConfig(this.defaults, config);

      // Set config.method
      if (config.method) {
        config.method = config.method.toLowerCase();
      } else if (this.defaults.method) {
        config.method = this.defaults.method.toLowerCase();
      } else {
        config.method = 'get';
      }

      var transitional = config.transitional;

      if (transitional !== undefined) {
        validator.assertOptions(transitional, {
          silentJSONParsing: validators$1.transitional(validators$1.boolean, '1.0.0'),
          forcedJSONParsing: validators$1.transitional(validators$1.boolean, '1.0.0'),
          clarifyTimeoutError: validators$1.transitional(validators$1.boolean, '1.0.0')
        }, false);
      }

      // filter out skipped interceptors
      var requestInterceptorChain = [];
      var synchronousRequestInterceptors = true;
      this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
          return;
        }

        synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

        requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
      });

      var responseInterceptorChain = [];
      this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
      });

      var promise;

      if (!synchronousRequestInterceptors) {
        var chain = [dispatchRequest, undefined];

        Array.prototype.unshift.apply(chain, requestInterceptorChain);
        chain = chain.concat(responseInterceptorChain);

        promise = Promise.resolve(config);
        while (chain.length) {
          promise = promise.then(chain.shift(), chain.shift());
        }

        return promise;
      }


      var newConfig = config;
      while (requestInterceptorChain.length) {
        var onFulfilled = requestInterceptorChain.shift();
        var onRejected = requestInterceptorChain.shift();
        try {
          newConfig = onFulfilled(newConfig);
        } catch (error) {
          onRejected(error);
          break;
        }
      }

      try {
        promise = dispatchRequest(newConfig);
      } catch (error) {
        return Promise.reject(error);
      }

      while (responseInterceptorChain.length) {
        promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
      }

      return promise;
    };

    Axios.prototype.getUri = function getUri(config) {
      config = mergeConfig(this.defaults, config);
      return buildURL$1(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
    };

    // Provide aliases for supported request methods
    utils$1.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
      /*eslint func-names:0*/
      Axios.prototype[method] = function(url, config) {
        return this.request(mergeConfig(config || {}, {
          method: method,
          url: url,
          data: (config || {}).data
        }));
      };
    });

    utils$1.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
      /*eslint func-names:0*/
      Axios.prototype[method] = function(url, data, config) {
        return this.request(mergeConfig(config || {}, {
          method: method,
          url: url,
          data: data
        }));
      };
    });

    var Axios_1 = Axios;

    /**
     * A `Cancel` is an object that is thrown when an operation is canceled.
     *
     * @class
     * @param {string=} message The message.
     */
    function Cancel(message) {
      this.message = message;
    }

    Cancel.prototype.toString = function toString() {
      return 'Cancel' + (this.message ? ': ' + this.message : '');
    };

    Cancel.prototype.__CANCEL__ = true;

    var Cancel_1 = Cancel;

    /**
     * A `CancelToken` is an object that can be used to request cancellation of an operation.
     *
     * @class
     * @param {Function} executor The executor function.
     */
    function CancelToken(executor) {
      if (typeof executor !== 'function') {
        throw new TypeError('executor must be a function.');
      }

      var resolvePromise;
      this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
      });

      var token = this;
      executor(function cancel(message) {
        if (token.reason) {
          // Cancellation has already been requested
          return;
        }

        token.reason = new Cancel_1(message);
        resolvePromise(token.reason);
      });
    }

    /**
     * Throws a `Cancel` if cancellation has been requested.
     */
    CancelToken.prototype.throwIfRequested = function throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    };

    /**
     * Returns an object that contains a new `CancelToken` and a function that, when called,
     * cancels the `CancelToken`.
     */
    CancelToken.source = function source() {
      var cancel;
      var token = new CancelToken(function executor(c) {
        cancel = c;
      });
      return {
        token: token,
        cancel: cancel
      };
    };

    var CancelToken_1 = CancelToken;

    /**
     * Syntactic sugar for invoking a function and expanding an array for arguments.
     *
     * Common use case would be to use `Function.prototype.apply`.
     *
     *  ```js
     *  function f(x, y, z) {}
     *  var args = [1, 2, 3];
     *  f.apply(null, args);
     *  ```
     *
     * With `spread` this example can be re-written.
     *
     *  ```js
     *  spread(function(x, y, z) {})([1, 2, 3]);
     *  ```
     *
     * @param {Function} callback
     * @returns {Function}
     */
    var spread = function spread(callback) {
      return function wrap(arr) {
        return callback.apply(null, arr);
      };
    };

    /**
     * Determines whether the payload is an error thrown by Axios
     *
     * @param {*} payload The value to test
     * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
     */
    var isAxiosError = function isAxiosError(payload) {
      return (typeof payload === 'object') && (payload.isAxiosError === true);
    };

    /**
     * Create an instance of Axios
     *
     * @param {Object} defaultConfig The default config for the instance
     * @return {Axios} A new instance of Axios
     */
    function createInstance(defaultConfig) {
      var context = new Axios_1(defaultConfig);
      var instance = bind$1(Axios_1.prototype.request, context);

      // Copy axios.prototype to instance
      utils$1.extend(instance, Axios_1.prototype, context);

      // Copy context to instance
      utils$1.extend(instance, context);

      return instance;
    }

    // Create the default instance to be exported
    var axios$1 = createInstance(defaults_1);

    // Expose Axios class to allow class inheritance
    axios$1.Axios = Axios_1;

    // Factory for creating new instances
    axios$1.create = function create(instanceConfig) {
      return createInstance(mergeConfig(axios$1.defaults, instanceConfig));
    };

    // Expose Cancel & CancelToken
    axios$1.Cancel = Cancel_1;
    axios$1.CancelToken = CancelToken_1;
    axios$1.isCancel = isCancel;

    // Expose all/spread
    axios$1.all = function all(promises) {
      return Promise.all(promises);
    };
    axios$1.spread = spread;

    // Expose isAxiosError
    axios$1.isAxiosError = isAxiosError;

    var axios_1 = axios$1;

    // Allow use of default import syntax in TypeScript
    var default_1 = axios$1;
    axios_1.default = default_1;

    var axios = axios_1;

    var bind = function bind(fn, thisArg) {
      return function wrap() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        return fn.apply(thisArg, args);
      };
    };

    /*global toString:true*/

    // utils is a library of generic helper functions non-specific to axios

    var toString$1 = Object.prototype.toString;

    /**
     * Determine if a value is an Array
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an Array, otherwise false
     */
    function isArray$1(val) {
      return toString$1.call(val) === '[object Array]';
    }

    /**
     * Determine if a value is undefined
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if the value is undefined, otherwise false
     */
    function isUndefined(val) {
      return typeof val === 'undefined';
    }

    /**
     * Determine if a value is a Buffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Buffer, otherwise false
     */
    function isBuffer(val) {
      return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
        && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
    }

    /**
     * Determine if a value is an ArrayBuffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an ArrayBuffer, otherwise false
     */
    function isArrayBuffer(val) {
      return toString$1.call(val) === '[object ArrayBuffer]';
    }

    /**
     * Determine if a value is a FormData
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an FormData, otherwise false
     */
    function isFormData(val) {
      return (typeof FormData !== 'undefined') && (val instanceof FormData);
    }

    /**
     * Determine if a value is a view on an ArrayBuffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
     */
    function isArrayBufferView(val) {
      var result;
      if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
        result = ArrayBuffer.isView(val);
      } else {
        result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
      }
      return result;
    }

    /**
     * Determine if a value is a String
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a String, otherwise false
     */
    function isString$1(val) {
      return typeof val === 'string';
    }

    /**
     * Determine if a value is a Number
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Number, otherwise false
     */
    function isNumber(val) {
      return typeof val === 'number';
    }

    /**
     * Determine if a value is an Object
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an Object, otherwise false
     */
    function isObject$2(val) {
      return val !== null && typeof val === 'object';
    }

    /**
     * Determine if a value is a Date
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Date, otherwise false
     */
    function isDate(val) {
      return toString$1.call(val) === '[object Date]';
    }

    /**
     * Determine if a value is a File
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a File, otherwise false
     */
    function isFile(val) {
      return toString$1.call(val) === '[object File]';
    }

    /**
     * Determine if a value is a Blob
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Blob, otherwise false
     */
    function isBlob(val) {
      return toString$1.call(val) === '[object Blob]';
    }

    /**
     * Determine if a value is a Function
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Function, otherwise false
     */
    function isFunction$2(val) {
      return toString$1.call(val) === '[object Function]';
    }

    /**
     * Determine if a value is a Stream
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Stream, otherwise false
     */
    function isStream(val) {
      return isObject$2(val) && isFunction$2(val.pipe);
    }

    /**
     * Determine if a value is a URLSearchParams object
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a URLSearchParams object, otherwise false
     */
    function isURLSearchParams(val) {
      return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
    }

    /**
     * Trim excess whitespace off the beginning and end of a string
     *
     * @param {String} str The String to trim
     * @returns {String} The String freed of excess whitespace
     */
    function trim(str) {
      return str.replace(/^\s*/, '').replace(/\s*$/, '');
    }

    /**
     * Determine if we're running in a standard browser environment
     *
     * This allows axios to run in a web worker, and react-native.
     * Both environments support XMLHttpRequest, but not fully standard globals.
     *
     * web workers:
     *  typeof window -> undefined
     *  typeof document -> undefined
     *
     * react-native:
     *  navigator.product -> 'ReactNative'
     * nativescript
     *  navigator.product -> 'NativeScript' or 'NS'
     */
    function isStandardBrowserEnv() {
      if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                               navigator.product === 'NativeScript' ||
                                               navigator.product === 'NS')) {
        return false;
      }
      return (
        typeof window !== 'undefined' &&
        typeof document !== 'undefined'
      );
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
    function forEach(obj, fn) {
      // Don't bother if no value provided
      if (obj === null || typeof obj === 'undefined') {
        return;
      }

      // Force an array if not already something iterable
      if (typeof obj !== 'object') {
        /*eslint no-param-reassign:0*/
        obj = [obj];
      }

      if (isArray$1(obj)) {
        // Iterate over array values
        for (var i = 0, l = obj.length; i < l; i++) {
          fn.call(null, obj[i], i, obj);
        }
      } else {
        // Iterate over object keys
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            fn.call(null, obj[key], key, obj);
          }
        }
      }
    }

    /**
     * Accepts varargs expecting each argument to be an object, then
     * immutably merges the properties of each object and returns result.
     *
     * When multiple objects contain the same key the later object in
     * the arguments list will take precedence.
     *
     * Example:
     *
     * ```js
     * var result = merge({foo: 123}, {foo: 456});
     * console.log(result.foo); // outputs 456
     * ```
     *
     * @param {Object} obj1 Object to merge
     * @returns {Object} Result of all merge properties
     */
    function merge(/* obj1, obj2, obj3, ... */) {
      var result = {};
      function assignValue(val, key) {
        if (typeof result[key] === 'object' && typeof val === 'object') {
          result[key] = merge(result[key], val);
        } else {
          result[key] = val;
        }
      }

      for (var i = 0, l = arguments.length; i < l; i++) {
        forEach(arguments[i], assignValue);
      }
      return result;
    }

    /**
     * Function equal to merge with the difference being that no reference
     * to original objects is kept.
     *
     * @see merge
     * @param {Object} obj1 Object to merge
     * @returns {Object} Result of all merge properties
     */
    function deepMerge(/* obj1, obj2, obj3, ... */) {
      var result = {};
      function assignValue(val, key) {
        if (typeof result[key] === 'object' && typeof val === 'object') {
          result[key] = deepMerge(result[key], val);
        } else if (typeof val === 'object') {
          result[key] = deepMerge({}, val);
        } else {
          result[key] = val;
        }
      }

      for (var i = 0, l = arguments.length; i < l; i++) {
        forEach(arguments[i], assignValue);
      }
      return result;
    }

    /**
     * Extends object a by mutably adding to it the properties of object b.
     *
     * @param {Object} a The object to be extended
     * @param {Object} b The object to copy properties from
     * @param {Object} thisArg The object to bind function to
     * @return {Object} The resulting value of object a
     */
    function extend(a, b, thisArg) {
      forEach(b, function assignValue(val, key) {
        if (thisArg && typeof val === 'function') {
          a[key] = bind(val, thisArg);
        } else {
          a[key] = val;
        }
      });
      return a;
    }

    var utils = {
      isArray: isArray$1,
      isArrayBuffer: isArrayBuffer,
      isBuffer: isBuffer,
      isFormData: isFormData,
      isArrayBufferView: isArrayBufferView,
      isString: isString$1,
      isNumber: isNumber,
      isObject: isObject$2,
      isUndefined: isUndefined,
      isDate: isDate,
      isFile: isFile,
      isBlob: isBlob,
      isFunction: isFunction$2,
      isStream: isStream,
      isURLSearchParams: isURLSearchParams,
      isStandardBrowserEnv: isStandardBrowserEnv,
      forEach: forEach,
      merge: merge,
      deepMerge: deepMerge,
      extend: extend,
      trim: trim
    };

    /**
     * Update an Error with the specified config, error code, and response.
     *
     * @param {Error} error The error to update.
     * @param {Object} config The config.
     * @param {string} [code] The error code (for example, 'ECONNABORTED').
     * @param {Object} [request] The request.
     * @param {Object} [response] The response.
     * @returns {Error} The error.
     */
    var enhanceError = function enhanceError(error, config, code, request, response) {
      error.config = config;
      if (code) {
        error.code = code;
      }

      error.request = request;
      error.response = response;
      error.isAxiosError = true;

      error.toJSON = function() {
        return {
          // Standard
          message: this.message,
          name: this.name,
          // Microsoft
          description: this.description,
          number: this.number,
          // Mozilla
          fileName: this.fileName,
          lineNumber: this.lineNumber,
          columnNumber: this.columnNumber,
          stack: this.stack,
          // Axios
          config: this.config,
          code: this.code
        };
      };
      return error;
    };

    /**
     * Create an Error with the specified message, config, error code, request and response.
     *
     * @param {string} message The error message.
     * @param {Object} config The config.
     * @param {string} [code] The error code (for example, 'ECONNABORTED').
     * @param {Object} [request] The request.
     * @param {Object} [response] The response.
     * @returns {Error} The created error.
     */
    var createError = function createError(message, config, code, request, response) {
      var error = new Error(message);
      return enhanceError(error, config, code, request, response);
    };

    /**
     * Resolve or reject a Promise based on response status.
     *
     * @param {Function} resolve A function that resolves the promise.
     * @param {Function} reject A function that rejects the promise.
     * @param {object} response The response.
     */
    var settle = function settle(resolve, reject, response) {
      var validateStatus = response.config.validateStatus;
      if (!validateStatus || validateStatus(response.status)) {
        resolve(response);
      } else {
        reject(createError(
          'Request failed with status code ' + response.status,
          response.config,
          null,
          response.request,
          response
        ));
      }
    };

    function encode(val) {
      return encodeURIComponent(val).
        replace(/%40/gi, '@').
        replace(/%3A/gi, ':').
        replace(/%24/g, '$').
        replace(/%2C/gi, ',').
        replace(/%20/g, '+').
        replace(/%5B/gi, '[').
        replace(/%5D/gi, ']');
    }

    /**
     * Build a URL by appending params to the end
     *
     * @param {string} url The base of the url (e.g., http://www.google.com)
     * @param {object} [params] The params to be appended
     * @returns {string} The formatted url
     */
    var buildURL = function buildURL(url, params, paramsSerializer) {
      /*eslint no-param-reassign:0*/
      if (!params) {
        return url;
      }

      var serializedParams;
      if (paramsSerializer) {
        serializedParams = paramsSerializer(params);
      } else if (utils.isURLSearchParams(params)) {
        serializedParams = params.toString();
      } else {
        var parts = [];

        utils.forEach(params, function serialize(val, key) {
          if (val === null || typeof val === 'undefined') {
            return;
          }

          if (utils.isArray(val)) {
            key = key + '[]';
          } else {
            val = [val];
          }

          utils.forEach(val, function parseValue(v) {
            if (utils.isDate(v)) {
              v = v.toISOString();
            } else if (utils.isObject(v)) {
              v = JSON.stringify(v);
            }
            parts.push(encode(key) + '=' + encode(v));
          });
        });

        serializedParams = parts.join('&');
      }

      if (serializedParams) {
        var hashmarkIndex = url.indexOf('#');
        if (hashmarkIndex !== -1) {
          url = url.slice(0, hashmarkIndex);
        }

        url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
      }

      return url;
    };

    /**
     * Determines whether the specified URL is absolute
     *
     * @param {string} url The URL to test
     * @returns {boolean} True if the specified URL is absolute, otherwise false
     */
    var isAbsoluteURL = function isAbsoluteURL(url) {
      // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
      // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
      // by any combination of letters, digits, plus, period, or hyphen.
      return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
    };

    /**
     * Creates a new URL by combining the specified URLs
     *
     * @param {string} baseURL The base URL
     * @param {string} relativeURL The relative URL
     * @returns {string} The combined URL
     */
    var combineURLs = function combineURLs(baseURL, relativeURL) {
      return relativeURL
        ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
        : baseURL;
    };

    /**
     * Creates a new URL by combining the baseURL with the requestedURL,
     * only when the requestedURL is not already an absolute URL.
     * If the requestURL is absolute, this function returns the requestedURL untouched.
     *
     * @param {string} baseURL The base URL
     * @param {string} requestedURL Absolute or relative URL to combine
     * @returns {string} The combined full path
     */
    var buildFullPath = function buildFullPath(baseURL, requestedURL) {
      if (baseURL && !isAbsoluteURL(requestedURL)) {
        return combineURLs(baseURL, requestedURL);
      }
      return requestedURL;
    };

    /*!
     * axios-miniprogram-adapter 0.3.5 (https://github.com/bigMeow/axios-miniprogram-adapter)
     * API https://github.com/bigMeow/axios-miniprogram-adapter/blob/master/doc/api.md
     * Copyright 2018-2022 bigMeow. All Rights Reserved
     * Licensed under MIT (https://github.com/bigMeow/axios-miniprogram-adapter/blob/master/LICENSE)
     */

    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    // encoder
    function encoder(input) {
        var str = String(input);
        // initialize result and counter
        var block;
        var charCode;
        var idx = 0;
        var map = chars;
        var output = '';
        for (; 
        // if the next str index does not exist:
        //   change the mapping table to "="
        //   check if d has no fractional digits
        str.charAt(idx | 0) || (map = '=', idx % 1); 
        // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
        output += map.charAt(63 & block >> 8 - idx % 1 * 8)) {
            charCode = str.charCodeAt(idx += 3 / 4);
            if (charCode > 0xFF) {
                throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
            }
            block = block << 8 | charCode;
        }
        return output;
    }

    var platFormName = "wechat" /* 微信 */;
    /**
     * 获取各个平台的请求函数
     */
    function getRequest() {
        switch (true) {
            case typeof wx === 'object':
                platFormName = "wechat" /* 微信 */;
                return wx.request.bind(wx);
            case typeof swan === 'object':
                platFormName = "baidu" /* 百度 */;
                return swan.request.bind(swan);
            case typeof dd === 'object':
                platFormName = "dd" /* 钉钉 */;
                // https://open.dingtalk.com/document/orgapp-client/send-network-requests
                return dd.httpRequest.bind(dd);
            case typeof my === 'object':
                /**
                 * remark:
                 * 支付宝客户端已不再维护 my.httpRequest，建议使用 my.request。另外，钉钉客户端尚不支持 my.request。若在钉钉客户端开发小程序，则需要使用 my.httpRequest。
                 * my.httpRequest的请求头默认值为{'content-type': 'application/x-www-form-urlencoded'}。
                 * my.request的请求头默认值为{'content-type': 'application/json'}。
                 * 还有个 dd.httpRequest
                 */
                platFormName = "alipay" /* 支付宝 */;
                return (my.request || my.httpRequest).bind(my);
            default:
                return wx.request.bind(wx);
        }
    }
    /**
     * 处理各平台返回的响应数据，抹平差异
     * @param mpResponse
     * @param config axios处理过的请求配置对象
     * @param request 小程序的调用发起请求时，传递给小程序api的实际配置
     */
    function transformResponse(mpResponse, config, mpRequestOption) {
        var headers = mpResponse.header || mpResponse.headers;
        var status = mpResponse.statusCode || mpResponse.status;
        var statusText = '';
        if (status === 200) {
            statusText = 'OK';
        }
        else if (status === 400) {
            statusText = 'Bad Request';
        }
        var response = {
            data: mpResponse.data,
            status: status,
            statusText: statusText,
            headers: headers,
            config: config,
            request: mpRequestOption
        };
        return response;
    }
    /**
     * 处理各平台返回的错误信息，抹平差异
     * @param error 小程序api返回的错误对象
     * @param reject 上层的promise reject 函数
     * @param config
     */
    function transformError(error, reject, config) {
        switch (platFormName) {
            case "wechat" /* 微信 */:
                if (error.errMsg.indexOf('request:fail abort') !== -1) {
                    // Handle request cancellation (as opposed to a manual cancellation)
                    reject(createError('Request aborted', config, 'ECONNABORTED', ''));
                }
                else if (error.errMsg.indexOf('timeout') !== -1) {
                    // timeout
                    reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED', ''));
                }
                else {
                    // NetWordError
                    reject(createError('Network Error', config, null, ''));
                }
                break;
            case "dd" /* 钉钉 */:
            case "alipay" /* 支付宝 */:
                // https://docs.alipay.com/mini/api/network
                if ([14, 19].includes(error.error)) {
                    reject(createError('Request aborted', config, 'ECONNABORTED', '', error));
                }
                else if ([13].includes(error.error)) {
                    // timeout
                    reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED', '', error));
                }
                else {
                    // NetWordError
                    reject(createError('Network Error', config, null, '', error));
                }
                break;
            case "baidu" /* 百度 */:
                // TODO error.errCode
                reject(createError('Network Error', config, null, ''));
                break;
        }
    }
    /**
     * 将axios的请求配置，转换成各个平台都支持的请求config
     * @param config
     */
    function transformConfig(config) {
        var _a;
        if (["alipay" /* 支付宝 */, "dd" /* 钉钉 */].includes(platFormName)) {
            config.headers = config.header;
            delete config.header;
            if ("dd" /* 钉钉 */ === platFormName && config.method !== 'GET' && ((_a = config.headers) === null || _a === void 0 ? void 0 : _a['Content-Type']) === 'application/json' && Object.prototype.toString.call(config.data) === '[object Object]') {
                // Content-Type为application/json时，data参数只支持json字符串，需要手动调用JSON.stringify进行序列化
                config.data = JSON.stringify(config.data);
            }
        }
        return config;
    }

    var isJSONstr = function (str) {
        try {
            return typeof str === 'string' && str.length && (str = JSON.parse(str)) && Object.prototype.toString.call(str) === '[object Object]';
        }
        catch (error) {
            return false;
        }
    };
    function mpAdapter(config, _a) {
        var _b = (_a === void 0 ? {} : _a).transformRequestOption, transformRequestOption = _b === void 0 ? function (requestOption) { return requestOption; } : _b;
        var request = getRequest();
        return new Promise(function (resolve, reject) {
            var requestTask;
            var requestData = config.data;
            var requestHeaders = config.headers;
            // baidu miniprogram only support upperCase
            var requestMethod = (config.method && config.method.toUpperCase()) || 'GET';
            // miniprogram network request config
            var mpRequestOption = {
                method: requestMethod,
                url: buildURL(buildFullPath(config.baseURL, config.url), config.params, config.paramsSerializer),
                timeout: config.timeout,
                // Listen for success
                success: function (mpResponse) {
                    var response = transformResponse(mpResponse, config, mpRequestOption);
                    settle(resolve, reject, response);
                },
                // Handle request Exception
                fail: function (error) {
                    transformError(error, reject, config);
                },
                complete: function () {
                    requestTask = undefined;
                }
            };
            // HTTP basic authentication
            if (config.auth) {
                var _a = [config.auth.username || '', config.auth.password || ''], username = _a[0], password = _a[1];
                requestHeaders.Authorization = 'Basic ' + encoder(username + ':' + password);
            }
            // Add headers to the request
            utils.forEach(requestHeaders, function setRequestHeader(val, key) {
                var _header = key.toLowerCase();
                if ((typeof requestData === 'undefined' && _header === 'content-type') || _header === 'referer') {
                    // Remove Content-Type if data is undefined
                    // And the miniprogram document said that '设置请求的 header，header 中不能设置 Referer'
                    delete requestHeaders[key];
                }
            });
            mpRequestOption.header = requestHeaders;
            // Add responseType to request if needed
            if (config.responseType) {
                mpRequestOption.responseType = config.responseType;
            }
            if (config.cancelToken) {
                // Handle cancellation
                config.cancelToken.promise.then(function onCanceled(cancel) {
                    if (!requestTask) {
                        return;
                    }
                    requestTask.abort();
                    reject(cancel);
                    // Clean up request
                    requestTask = undefined;
                });
            }
            // Converting JSON strings to objects is handed over to the MiniPrograme
            if (isJSONstr(requestData)) {
                requestData = JSON.parse(requestData);
            }
            if (requestData !== undefined) {
                mpRequestOption.data = requestData;
            }
            requestTask = request(transformRequestOption(transformConfig(mpRequestOption)));
        });
    }

    var SYSTEM_INFO$1 = Object.assign({}, {
        type: 2,
        appid: '',
        developId: '',
        channelid: 'weile',
        deviceCode: 'channel-sdk-js',
        fromChannel: 'minigame',
        platformid: 0,
        channelAppId: '',
        reqUrlIndex: 0,
        publicKey: '',
        timezone: (new Date().getTimezoneOffset() / 60) * -1 || 8,
        __RX_SDK_VERSION: '4.0.5',
        SDK_INIT_FINISHED: false,
        errMsg: {
            default: ''
        },
        _baseUrlList: [],
        single_player_mode: false,
        need_active: false,
        logSwitch: true,
        login_config: {},
        region_tag: '',
        cp_role_id: '',
        isMatch: false,
        miniVersion: '',
        isWxAvailable: true,
        language: 'zh-CN',
        st_offset: ''
    });
    var USER_INFO = {};

    var rngBrowser = createCommonjsModule(function (module) {
    // Unique ID creation requires a high quality random # generator.  In the
    // browser this is a little complicated due to unknown quality of Math.random()
    // and inconsistent support for the `crypto` API.  We do the best we can via
    // feature-detection

    // getRandomValues needs to be invoked in a context where "this" is a Crypto
    // implementation. Also, find the complete implementation of crypto on IE11.
    var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
                          (typeof(msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));

    if (getRandomValues) {
      // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
      var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

      module.exports = function whatwgRNG() {
        getRandomValues(rnds8);
        return rnds8;
      };
    } else {
      // Math.random()-based (RNG)
      //
      // If all else fails, use Math.random().  It's fast, but is of unspecified
      // quality.
      var rnds = new Array(16);

      module.exports = function mathRNG() {
        for (var i = 0, r; i < 16; i++) {
          if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
          rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
        }

        return rnds;
      };
    }
    });

    /**
     * Convert array of 16 byte values to UUID string format of the form:
     * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
     */
    var byteToHex = [];
    for (var i = 0; i < 256; ++i) {
      byteToHex[i] = (i + 0x100).toString(16).substr(1);
    }

    function bytesToUuid(buf, offset) {
      var i = offset || 0;
      var bth = byteToHex;
      // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
      return ([
        bth[buf[i++]], bth[buf[i++]],
        bth[buf[i++]], bth[buf[i++]], '-',
        bth[buf[i++]], bth[buf[i++]], '-',
        bth[buf[i++]], bth[buf[i++]], '-',
        bth[buf[i++]], bth[buf[i++]], '-',
        bth[buf[i++]], bth[buf[i++]],
        bth[buf[i++]], bth[buf[i++]],
        bth[buf[i++]], bth[buf[i++]]
      ]).join('');
    }

    var bytesToUuid_1 = bytesToUuid;

    function v4(options, buf, offset) {
      var i = buf && offset || 0;

      if (typeof(options) == 'string') {
        buf = options === 'binary' ? new Array(16) : null;
        options = null;
      }
      options = options || {};

      var rnds = options.random || (options.rng || rngBrowser)();

      // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
      rnds[6] = (rnds[6] & 0x0f) | 0x40;
      rnds[8] = (rnds[8] & 0x3f) | 0x80;

      // Copy bytes to buffer, if provided
      if (buf) {
        for (var ii = 0; ii < 16; ++ii) {
          buf[i + ii] = rnds[ii];
        }
      }

      return buf || bytesToUuid_1(rnds);
    }

    var v4_1 = v4;

    var ERROR_CODE = 1000000;
    var AD_ERROR_MAP = {
        1000: '后端接口调用失败',
        1001: '参数错误',
        1002: '广告单元无效',
        1003: '内部错误',
        1004: '无合适的广告',
        1005: '广告组件审核中',
        1006: '广告组件被驳回',
        1007: '广告组件被封禁',
        1008: '广告单元已关闭',
    };
    /**
     * https://nctpoatgf0.feishu.cn/docx/WnVFdpQGcohpiLxd94zcDS9unfh
     */
    var COMMON_ERROR_CODE = {
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
        ADD_SHORT_CUT: 7000,
        AD_LOAD_OVERTIME: 10000,
        CANCEL_PAY: 4001,
        PAY_ERROR: 4002,
        UNKNOWN_PAY_ERROR: 4003,
        CANCEL_JUMP_MINIGAME: 4004,
        PAY_GIFT_FINISH: 4005,
        PAY_TYPE_ERROR: 4300,
        LOGIN_FAIL: 3002,
        LOGIN_DENY: 3001,
        UNKNOWN: 9000
    };

    createCommonjsModule(function (module) {
    // Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
    // This work is free. You can redistribute it and/or modify it
    // under the terms of the WTFPL, Version 2
    // For more information see LICENSE.txt or http://www.wtfpl.net/
    //
    // For more information, the home page:
    // http://pieroxy.net/blog/pages/lz-string/testing.html
    //
    // LZ-based compression algorithm, version 1.4.5
    var LZString = (function() {

    // private property
    var f = String.fromCharCode;
    var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
    var baseReverseDic = {};

    function getBaseValue(alphabet, character) {
      if (!baseReverseDic[alphabet]) {
        baseReverseDic[alphabet] = {};
        for (var i=0 ; i<alphabet.length ; i++) {
          baseReverseDic[alphabet][alphabet.charAt(i)] = i;
        }
      }
      return baseReverseDic[alphabet][character];
    }

    var LZString = {
      compressToBase64 : function (input) {
        if (input == null) return "";
        var res = LZString._compress(input, 6, function(a){return keyStrBase64.charAt(a);});
        switch (res.length % 4) { // To produce valid Base64
        default: // When could this happen ?
        case 0 : return res;
        case 1 : return res+"===";
        case 2 : return res+"==";
        case 3 : return res+"=";
        }
      },

      decompressFromBase64 : function (input) {
        if (input == null) return "";
        if (input == "") return null;
        return LZString._decompress(input.length, 32, function(index) { return getBaseValue(keyStrBase64, input.charAt(index)); });
      },

      compressToUTF16 : function (input) {
        if (input == null) return "";
        return LZString._compress(input, 15, function(a){return f(a+32);}) + " ";
      },

      decompressFromUTF16: function (compressed) {
        if (compressed == null) return "";
        if (compressed == "") return null;
        return LZString._decompress(compressed.length, 16384, function(index) { return compressed.charCodeAt(index) - 32; });
      },

      //compress into uint8array (UCS-2 big endian format)
      compressToUint8Array: function (uncompressed) {
        var compressed = LZString.compress(uncompressed);
        var buf=new Uint8Array(compressed.length*2); // 2 bytes per character

        for (var i=0, TotalLen=compressed.length; i<TotalLen; i++) {
          var current_value = compressed.charCodeAt(i);
          buf[i*2] = current_value >>> 8;
          buf[i*2+1] = current_value % 256;
        }
        return buf;
      },

      //decompress from uint8array (UCS-2 big endian format)
      decompressFromUint8Array:function (compressed) {
        if (compressed===null || compressed===undefined){
            return LZString.decompress(compressed);
        } else {
            var buf=new Array(compressed.length/2); // 2 bytes per character
            for (var i=0, TotalLen=buf.length; i<TotalLen; i++) {
              buf[i]=compressed[i*2]*256+compressed[i*2+1];
            }

            var result = [];
            buf.forEach(function (c) {
              result.push(f(c));
            });
            return LZString.decompress(result.join(''));

        }

      },


      //compress into a string that is already URI encoded
      compressToEncodedURIComponent: function (input) {
        if (input == null) return "";
        return LZString._compress(input, 6, function(a){return keyStrUriSafe.charAt(a);});
      },

      //decompress from an output of compressToEncodedURIComponent
      decompressFromEncodedURIComponent:function (input) {
        if (input == null) return "";
        if (input == "") return null;
        input = input.replace(/ /g, "+");
        return LZString._decompress(input.length, 32, function(index) { return getBaseValue(keyStrUriSafe, input.charAt(index)); });
      },

      compress: function (uncompressed) {
        return LZString._compress(uncompressed, 16, function(a){return f(a);});
      },
      _compress: function (uncompressed, bitsPerChar, getCharFromInt) {
        if (uncompressed == null) return "";
        var i, value,
            context_dictionary= {},
            context_dictionaryToCreate= {},
            context_c="",
            context_wc="",
            context_w="",
            context_enlargeIn= 2, // Compensate for the first entry which should not count
            context_dictSize= 3,
            context_numBits= 2,
            context_data=[],
            context_data_val=0,
            context_data_position=0,
            ii;

        for (ii = 0; ii < uncompressed.length; ii += 1) {
          context_c = uncompressed.charAt(ii);
          if (!Object.prototype.hasOwnProperty.call(context_dictionary,context_c)) {
            context_dictionary[context_c] = context_dictSize++;
            context_dictionaryToCreate[context_c] = true;
          }

          context_wc = context_w + context_c;
          if (Object.prototype.hasOwnProperty.call(context_dictionary,context_wc)) {
            context_w = context_wc;
          } else {
            if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
              if (context_w.charCodeAt(0)<256) {
                for (i=0 ; i<context_numBits ; i++) {
                  context_data_val = (context_data_val << 1);
                  if (context_data_position == bitsPerChar-1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else {
                    context_data_position++;
                  }
                }
                value = context_w.charCodeAt(0);
                for (i=0 ; i<8 ; i++) {
                  context_data_val = (context_data_val << 1) | (value&1);
                  if (context_data_position == bitsPerChar-1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else {
                    context_data_position++;
                  }
                  value = value >> 1;
                }
              } else {
                value = 1;
                for (i=0 ; i<context_numBits ; i++) {
                  context_data_val = (context_data_val << 1) | value;
                  if (context_data_position ==bitsPerChar-1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else {
                    context_data_position++;
                  }
                  value = 0;
                }
                value = context_w.charCodeAt(0);
                for (i=0 ; i<16 ; i++) {
                  context_data_val = (context_data_val << 1) | (value&1);
                  if (context_data_position == bitsPerChar-1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else {
                    context_data_position++;
                  }
                  value = value >> 1;
                }
              }
              context_enlargeIn--;
              if (context_enlargeIn == 0) {
                context_enlargeIn = Math.pow(2, context_numBits);
                context_numBits++;
              }
              delete context_dictionaryToCreate[context_w];
            } else {
              value = context_dictionary[context_w];
              for (i=0 ; i<context_numBits ; i++) {
                context_data_val = (context_data_val << 1) | (value&1);
                if (context_data_position == bitsPerChar-1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else {
                  context_data_position++;
                }
                value = value >> 1;
              }


            }
            context_enlargeIn--;
            if (context_enlargeIn == 0) {
              context_enlargeIn = Math.pow(2, context_numBits);
              context_numBits++;
            }
            // Add wc to the dictionary.
            context_dictionary[context_wc] = context_dictSize++;
            context_w = String(context_c);
          }
        }

        // Output the code for w.
        if (context_w !== "") {
          if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
            if (context_w.charCodeAt(0)<256) {
              for (i=0 ; i<context_numBits ; i++) {
                context_data_val = (context_data_val << 1);
                if (context_data_position == bitsPerChar-1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else {
                  context_data_position++;
                }
              }
              value = context_w.charCodeAt(0);
              for (i=0 ; i<8 ; i++) {
                context_data_val = (context_data_val << 1) | (value&1);
                if (context_data_position == bitsPerChar-1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else {
                  context_data_position++;
                }
                value = value >> 1;
              }
            } else {
              value = 1;
              for (i=0 ; i<context_numBits ; i++) {
                context_data_val = (context_data_val << 1) | value;
                if (context_data_position == bitsPerChar-1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else {
                  context_data_position++;
                }
                value = 0;
              }
              value = context_w.charCodeAt(0);
              for (i=0 ; i<16 ; i++) {
                context_data_val = (context_data_val << 1) | (value&1);
                if (context_data_position == bitsPerChar-1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else {
                  context_data_position++;
                }
                value = value >> 1;
              }
            }
            context_enlargeIn--;
            if (context_enlargeIn == 0) {
              context_enlargeIn = Math.pow(2, context_numBits);
              context_numBits++;
            }
            delete context_dictionaryToCreate[context_w];
          } else {
            value = context_dictionary[context_w];
            for (i=0 ; i<context_numBits ; i++) {
              context_data_val = (context_data_val << 1) | (value&1);
              if (context_data_position == bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }


          }
          context_enlargeIn--;
          if (context_enlargeIn == 0) {
            context_enlargeIn = Math.pow(2, context_numBits);
            context_numBits++;
          }
        }

        // Mark the end of the stream
        value = 2;
        for (i=0 ; i<context_numBits ; i++) {
          context_data_val = (context_data_val << 1) | (value&1);
          if (context_data_position == bitsPerChar-1) {
            context_data_position = 0;
            context_data.push(getCharFromInt(context_data_val));
            context_data_val = 0;
          } else {
            context_data_position++;
          }
          value = value >> 1;
        }

        // Flush the last char
        while (true) {
          context_data_val = (context_data_val << 1);
          if (context_data_position == bitsPerChar-1) {
            context_data.push(getCharFromInt(context_data_val));
            break;
          }
          else context_data_position++;
        }
        return context_data.join('');
      },

      decompress: function (compressed) {
        if (compressed == null) return "";
        if (compressed == "") return null;
        return LZString._decompress(compressed.length, 32768, function(index) { return compressed.charCodeAt(index); });
      },

      _decompress: function (length, resetValue, getNextValue) {
        var dictionary = [],
            enlargeIn = 4,
            dictSize = 4,
            numBits = 3,
            entry = "",
            result = [],
            i,
            w,
            bits, resb, maxpower, power,
            c,
            data = {val:getNextValue(0), position:resetValue, index:1};

        for (i = 0; i < 3; i += 1) {
          dictionary[i] = i;
        }

        bits = 0;
        maxpower = Math.pow(2,2);
        power=1;
        while (power!=maxpower) {
          resb = data.val & data.position;
          data.position >>= 1;
          if (data.position == 0) {
            data.position = resetValue;
            data.val = getNextValue(data.index++);
          }
          bits |= (resb>0 ? 1 : 0) * power;
          power <<= 1;
        }

        switch (bits) {
          case 0:
              bits = 0;
              maxpower = Math.pow(2,8);
              power=1;
              while (power!=maxpower) {
                resb = data.val & data.position;
                data.position >>= 1;
                if (data.position == 0) {
                  data.position = resetValue;
                  data.val = getNextValue(data.index++);
                }
                bits |= (resb>0 ? 1 : 0) * power;
                power <<= 1;
              }
            c = f(bits);
            break;
          case 1:
              bits = 0;
              maxpower = Math.pow(2,16);
              power=1;
              while (power!=maxpower) {
                resb = data.val & data.position;
                data.position >>= 1;
                if (data.position == 0) {
                  data.position = resetValue;
                  data.val = getNextValue(data.index++);
                }
                bits |= (resb>0 ? 1 : 0) * power;
                power <<= 1;
              }
            c = f(bits);
            break;
          case 2:
            return "";
        }
        dictionary[3] = c;
        w = c;
        result.push(c);
        while (true) {
          if (data.index > length) {
            return "";
          }

          bits = 0;
          maxpower = Math.pow(2,numBits);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }

          switch (c = bits) {
            case 0:
              bits = 0;
              maxpower = Math.pow(2,8);
              power=1;
              while (power!=maxpower) {
                resb = data.val & data.position;
                data.position >>= 1;
                if (data.position == 0) {
                  data.position = resetValue;
                  data.val = getNextValue(data.index++);
                }
                bits |= (resb>0 ? 1 : 0) * power;
                power <<= 1;
              }

              dictionary[dictSize++] = f(bits);
              c = dictSize-1;
              enlargeIn--;
              break;
            case 1:
              bits = 0;
              maxpower = Math.pow(2,16);
              power=1;
              while (power!=maxpower) {
                resb = data.val & data.position;
                data.position >>= 1;
                if (data.position == 0) {
                  data.position = resetValue;
                  data.val = getNextValue(data.index++);
                }
                bits |= (resb>0 ? 1 : 0) * power;
                power <<= 1;
              }
              dictionary[dictSize++] = f(bits);
              c = dictSize-1;
              enlargeIn--;
              break;
            case 2:
              return result.join('');
          }

          if (enlargeIn == 0) {
            enlargeIn = Math.pow(2, numBits);
            numBits++;
          }

          if (dictionary[c]) {
            entry = dictionary[c];
          } else {
            if (c === dictSize) {
              entry = w + w.charAt(0);
            } else {
              return null;
            }
          }
          result.push(entry);

          // Add w+entry[0] to the dictionary.
          dictionary[dictSize++] = w + entry.charAt(0);
          enlargeIn--;

          w = entry;

          if (enlargeIn == 0) {
            enlargeIn = Math.pow(2, numBits);
            numBits++;
          }

        }
      }
    };
      return LZString;
    })();

    if( module != null ) {
      module.exports = LZString;
    } else if( typeof angular !== 'undefined' && angular != null ) {
      angular.module('LZString', [])
      .factory('LZString', function () {
        return LZString;
      });
    }
    });

    function printLog() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (SYSTEM_INFO$1.logSwitch) {
            console.info(args);
        }
    }
    var qs = {
        stringify: function (obj) {
            var str = '';
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    str += '&' + key + '=' + obj[key];
                }
            }
            return str.slice(1);
        },
        parse: function (params) {
            if (!params)
                return {};
            var query = params.split('&');
            var res = {};
            for (var key in query) {
                if (query.hasOwnProperty(key)) {
                    var arr = query[key].split('=');
                    res[arr[0]] = arr[1];
                }
            }
            return res;
        }
    };
    var asyncFunc = function (func, options, params) {
        return new Promise(function (resolve, reject) {
            func.apply(void 0, __spreadArray([Object.assign({}, options, {
                    success: resolve,
                    fail: reject,
                    cancel: resolve
                })], (params || []), false));
        });
    };
    var getConfigErrMsg = function (code, thirdcode, thirdmsg) {
        var msg = SYSTEM_INFO$1.errMsg[code] || SYSTEM_INFO$1.errMsg.default || '';
        return msg.replace(/\$code\$/g, code || '').replace(/\$thirdcode\$/g, thirdcode || '').replace(/\$thirdmsg\$/g, thirdmsg || '');
    };
    var handleError = function (err, code) {
        err = err || {};
        var _code = code || err.code || err.errCode || err.errorCode || err.err_code || err.error || err.errNo || err.errno || ERROR_CODE;
        var _thirdcode = err.thirdcode || err.thirdCode || err.errCode || err.errorCode || err.err_code || err.errNo || err.errno || err.error || err.code;
        var _thirdmsg = err.message || err.errMsg || err.errorMsg || err.msg || err.errorMessage || err.errorDescription || err.data;
        if (_code == 2001) {
            return {
                isServerError: err.isServerError,
                thirdcode: _thirdcode || 9001,
                thirdmsg: _thirdmsg,
                code: err.isServerError ? _thirdcode : _code,
                msg: err.isServerError ? _thirdmsg : getConfigErrMsg(_code, _thirdcode, _thirdmsg) || _thirdmsg || err || '初始化错误，或未初始化'
            };
        }
        if (err.isServerError) {
            console.log('handleError server error', err.code, err.msg, err.thirdcode, err.thirdmsg);
            return {
                isServerError: err.isServerError,
                thirdcode: err.thirdcode,
                thirdmsg: err.thirdmsg,
                code: err.code || 9001,
                msg: err.msg || err.message
            };
        }
        return {
            isServerError: err.isServerError || false,
            thirdcode: _thirdcode || 9001,
            thirdmsg: _thirdmsg,
            code: _code,
            msg: getConfigErrMsg(_code, _thirdcode, _thirdmsg) || _thirdmsg || err
        };
    };
    /**
     * 编码 URI 及 base64 处理的字符串
     */
    // export const encodeURIBase64 = (str?: string) => {
    //   if (!str) return ''
    //   try {
    //     return btoa(encodeURIComponent(str))
    //   } catch (error) {
    //     console.error(error)
    //     return str
    //   }
    // }
    /**
     * 反编码 URI 及 base64 处理的字符串
     */
    // export const decodeURIBase64 = (str?: string) => {
    //   if (!str) return ''
    //   try {
    //     return decodeURIComponent(atob(str))
    //   } catch (error) {
    //     console.error(error)
    //     return str
    //   }
    // }
    // export const loadScript = function (url: string) {
    //   return new Promise((resolve, reject) => {
    //     const script = document.createElement('script')
    //     const params = url.indexOf('?') > -1 ? '&timestamp=' : '?timestamp='
    //     script.src = `${/^(https?:)?\/\//.test(url) ? '' : '//'}${url}${params}${Date.now()}`
    //     script.onload = resolve
    //     script.onerror = reject
    //     document.body.appendChild(script)
    //   })
    // }
    var formatTrackParams = function (_a) {
        var eventName = _a.eventName, apiName = _a.apiName, _b = _a.reqParams, reqParams = _b === void 0 ? {} : _b, _c = _a.errorInfo, errorInfo = _c === void 0 ? {} : _c, _d = _a.loginInfo, loginInfo = _d === void 0 ? {} : _d, otherParams = __rest(_a, ["eventName", "apiName", "reqParams", "errorInfo", "loginInfo"]);
        var eventNamePrefix = '#rxsdk_';
        return {
            event: eventNamePrefix + eventName,
            properties: __assign({ api_name: apiName, systemInfo: SYSTEM_INFO$1, req_params: __assign({}, reqParams), error_info: __assign({}, errorInfo), login_info: __assign({}, loginInfo) }, otherParams)
        };
    };
    // 内存存储对象
    var memoryStore = {};
    // 过期时间映射
    var expireMap = {};
    // 获取存储
    var customGetStorageSync = function (key) {
        // 检查是否过期
        if (expireMap[key] && Date.now() > expireMap[key]) {
            customRemoveStorageSync(key);
            return null;
        }
        try {
            if (SYSTEM_INFO$1.isWxAvailable) {
                return wx.getStorageSync(key);
            }
            else {
                printLog('memoryStore', memoryStore);
                return memoryStore[key] || null;
            }
        }
        catch (error) {
            return memoryStore[key] || null;
        }
    };
    // 设置存储
    var customSetStorageSync = function (key, value, expire) {
        try {
            if (SYSTEM_INFO$1.isWxAvailable) {
                wx.setStorageSync(key, value);
            }
            else {
                memoryStore[key] = value;
                // printLog('memoryStore', memoryStore)
            }
        }
        catch (error) {
            // 降级到内存存储
            memoryStore[key] = value;
            // printLog('memoryStore', memoryStore)
        }
        // 设置过期时间
        if (expire && typeof expire === 'number') {
            expireMap[key] = Date.now() + expire * 1000;
        }
    };
    // 删除存储
    var customRemoveStorageSync = function (key) {
        try {
            if (SYSTEM_INFO$1.isWxAvailable) {
                wx.removeStorageSync(key);
            }
        }
        catch (error) {
            // 忽略错误
        }
        // 同时删除内存中的数据
        delete memoryStore[key];
        delete expireMap[key];
    };

    // var padStart = function padStart(string: string | number, length: number, pad: string) {
    //   var s = String(string)
    //   if (!s || s.length >= length) return string
    //   return '' + Array(length + 1 - s.length).join(pad) + string
    // }
    function utcOffset(data) {
        // Because a bug at FF24, we're rounding the timezone offset around 15 minutes
        // https://github.com/moment/moment/pull/1871
        return -Math.round(data.getTimezoneOffset() / 15) * 15;
    }
    var padZoneStr = function (data) {
        var negMinutes = -utcOffset(data);
        var minutes = Math.abs(negMinutes);
        var hourOffset = Math.floor(minutes / 60);
        var minuteOffset = minutes % 60;
        // console.log(1111, negMinutes)
        return "".concat(negMinutes <= 0 ? '+' : '-').concat(String(hourOffset).padStart(2, '0'), ":").concat(String(minuteOffset).padStart(2, '0'));
    };
    function formatDate(format, data) {
        if (data === void 0) { data = new Date(); }
        var $Y = String(data.getFullYear());
        var $M = String(data.getMonth() + 1);
        var $D = String(data.getDate());
        var $H = String(data.getHours());
        var $m = String(data.getMinutes());
        var $s = String(data.getSeconds());
        var $ms = String(data.getMilliseconds());
        var zoneStr = padZoneStr(data);
        var matchs = {
            YY: $Y.slice(-2),
            YYYY: $Y,
            M: $M,
            MM: $M.padStart(2, '0'),
            D: $D,
            DD: $D.padStart(2, '0'),
            H: $H,
            HH: $H.padStart(2, '0'),
            m: $m,
            mm: $m.padStart(2, '0'),
            s: $s,
            ss: $s.padStart(2, '0'),
            SSS: $ms.padStart(3, '0'),
            Z: zoneStr,
        };
        return format.replace(/Y{1,4}|M{1,4}|D{1,2}|H{1,2}|m{1,2}|s{1,2}|S{3}|Z{1}/g, function (match) {
            return matchs[match];
        });
    }
    // export function localISOTime() {
    //   // 当前时间
    //   const date = new Date()
    //   const time = date.getTime()
    //   // 与格林威治时时差,并转换为毫秒
    //   const offset = date.getTimezoneOffset() * 60 * 1000 // => 假设当前时区时区为东八区，-480 因为格林尼治时间比本地时间小8h
    //   //算出对应的格林尼治时间
    //   // const GMTDate = time + offset
    //   return new Date(time - offset).toISOString()
    // }

    var PLATFORM;
    (function (PLATFORM) {
        PLATFORM["WECHAT"] = "wechat";
        PLATFORM["QQ"] = "qq";
        PLATFORM["FACEBOOK"] = "facebook";
        PLATFORM["DOUYIN"] = "douyin";
        PLATFORM["MINIGAMEHUAWEI"] = "minigame_huawei";
        PLATFORM["VIVO"] = "minigame_vivo";
        PLATFORM["OPPO"] = "minigame_oppo";
        PLATFORM["ALIPAY"] = "minigame_alipay";
        PLATFORM["TAOBAO"] = "minigame_taobao";
        PLATFORM["KS"] = "minigame_kuaishou";
        PLATFORM["UC"] = "minigame_uc";
        PLATFORM["H54399"] = "h5_4399";
        PLATFORM["MINIGAMEXIAOMI"] = "minigame_xiaomi";
        PLATFORM["MINIGAME4399"] = "minigame_4399";
        PLATFORM["MEITUAN"] = "meituan";
        PLATFORM["MINIGAMEBAIDU"] = "minigame_baidu";
        PLATFORM["MINIGAMEBILIBILI"] = "minigame_bilibili";
    })(PLATFORM || (PLATFORM = {}));

    // @ts-ignore
    // import { cryptoJS } from '../index.crypto.js'
    var cpkey = '4ca7dacc9332d74e1292c83f0aa3b376';
    // 请求队列 Map，用于管理相同参数的请求队列
    var requestQueueMap = new Map();
    // 缓存成功的结果
    var successResultCache = new Map();
    // 缓存配置
    var CACHE_CONFIG = {
        MAX_CACHE_SIZE: 10,
        MAX_CACHE_AGE: 0.1 * 60 * 1000 // 缓存最大存活时间：6秒
    };
    // 清理过期的缓存
    function cleanExpiredCache() {
        try {
            var now_1 = Date.now();
            var keysToDelete_1 = [];
            try {
                successResultCache.forEach(function (item, key) {
                    try {
                        if (now_1 - item.timestamp > CACHE_CONFIG.MAX_CACHE_AGE) {
                            keysToDelete_1.push(key);
                        }
                    }
                    catch (error) {
                        // printLog(`[缓存清理] 检查缓存项失败，跳过，queueKey: ${key}`, error)
                    }
                });
            }
            catch (error) {
                // printLog(`[缓存清理] 遍历缓存失败`, error)
            }
            keysToDelete_1.forEach(function (key) {
                try {
                    successResultCache.delete(key);
                    // printLog(`[缓存清理] 清理过期缓存，queueKey: ${key}`)
                }
                catch (error) {
                    // printLog(`[缓存清理] 删除缓存项失败，queueKey: ${key}`, error)
                }
            });
            // 如果缓存数量超过限制，清理最旧的缓存
            try {
                if (successResultCache.size > CACHE_CONFIG.MAX_CACHE_SIZE) {
                    var sortedEntries = Array.from(successResultCache.entries())
                        .sort(function (a, b) { return a[1].timestamp - b[1].timestamp; });
                    var toDelete = sortedEntries.slice(0, successResultCache.size - CACHE_CONFIG.MAX_CACHE_SIZE);
                    toDelete.forEach(function (_a) {
                        var key = _a[0];
                        try {
                            successResultCache.delete(key);
                            // printLog(`[缓存清理] 缓存数量超过限制，清理最旧缓存，queueKey: ${key}`)
                        }
                        catch (error) {
                            // printLog(`[缓存清理] 删除最旧缓存失败，queueKey: ${key}`, error)
                        }
                    });
                }
            }
            catch (error) {
                // printLog(`[缓存清理] 清理超出限制的缓存失败`, error)
            }
        }
        catch (error) {
            // 清理缓存失败不影响其他功能
            // printLog(`[缓存清理] 清理缓存过程发生异常，但不影响其他功能`, error)
        }
    }
    // 生成请求的唯一标识
    function generateRequestKey(path, data) {
        try {
            var dataStr = '';
            try {
                dataStr = JSON.stringify(data || {});
            }
            catch (error) {
                // JSON.stringify 失败时，使用 toString 作为后备
                // printLog(`[请求队列] JSON.stringify 失败，使用后备方案`, error)
                try {
                    dataStr = String(data || '');
                }
                catch (stringError) {
                    dataStr = '{}';
                    // printLog(`[请求队列] 转换为字符串失败，使用默认值`, stringError)
                }
            }
            return "".concat(path || '', "_").concat(dataStr);
        }
        catch (error) {
            // 如果所有操作都失败，返回一个基于时间戳的唯一标识
            // printLog(`[请求队列] 生成 queueKey 完全失败，使用时间戳`, error)
            return "".concat(path || '', "_").concat(Date.now(), "_").concat(Math.random());
        }
    }
    // 检查结果是否应该被缓存（code === 0 status >  1 即可缓存）
    function shouldCacheResult(result) {
        var _a, _b;
        try {
            if (!result) {
                // printLog(`[缓存检查] result 为空`)
                return false;
            }
            try {
                if (result.code === 0 && ((_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.status) && ((_b = result === null || result === void 0 ? void 0 : result.data) === null || _b === void 0 ? void 0 : _b.status) > 1) {
                    // printLog(`[缓存检查] 满足缓存条件，code: ${result.code}`)
                    return true;
                }
                // printLog(`[缓存检查] code 不为 0, code: ${result.code}`)
                return false;
            }
            catch (error) {
                // printLog(`[缓存检查] 检查 code 失败`, error)
                return false;
            }
        }
        catch (error) {
            // 缓存检查失败，不缓存结果
            // printLog(`[缓存检查] 缓存检查过程异常，不缓存`, error)
            return false;
        }
    }
    // 缓存成功的结果
    function cacheSuccessResult(queueKey, result) {
        try {
            if (shouldCacheResult(result)) {
                try {
                    // 清理过期缓存，防止内存泄漏
                    cleanExpiredCache();
                }
                catch (error) {
                    // printLog(`[缓存设置] 清理过期缓存失败，但不影响当前缓存设置`, error)
                }
                try {
                    // printLog(`[请求队列] 请求成功且 code === 0，缓存结果，queueKey: ${queueKey}, 当前缓存数量: ${successResultCache.size}`)
                    successResultCache.set(queueKey, {
                        result: result,
                        timestamp: Date.now()
                    });
                }
                catch (error) {
                    // printLog(`[缓存设置] 设置缓存失败，queueKey: ${queueKey}`, error)
                }
            }
            else {
                // printLog(`[请求队列] 请求结果不符合缓存条件，不缓存，queueKey: ${queueKey}, code: ${result?.code}`)
            }
        }
        catch (error) {
            // 缓存设置失败不影响请求结果
            // printLog(`[缓存设置] 缓存结果过程发生异常，但不影响请求`, error)
        }
    }
    // 处理队列中的请求（添加异常处理和防止死循环机制）
    var processQueueRetryCount = new Map(); // 记录每个队列的处理次数，防止死循环
    var MAX_PROCESS_RETRY = 100; // 最大处理次数，防止死循环
    function processQueue(queueKey) {
        return __awaiter(this, void 0, void 0, function () {
            var retryCount, queue, queue, item, cacheItem, now, cachedResponse, timeoutPromise, result, error_1, queue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        retryCount = processQueueRetryCount.get(queueKey) || 0;
                        if (retryCount > MAX_PROCESS_RETRY) {
                            // printLog(`[队列处理] 处理次数超过限制，强制清理队列，queueKey: ${queueKey}, 重试次数: ${retryCount}`)
                            try {
                                queue = requestQueueMap.get(queueKey);
                                if (queue) {
                                    // 清理队列中的所有请求
                                    queue.queue.forEach(function (item) {
                                        try {
                                            item.reject(new Error('队列处理次数超过限制，请求被取消'));
                                        }
                                        catch (error) {
                                            // printLog(`[队列处理] 清理队列项失败`, error)
                                        }
                                    });
                                }
                                requestQueueMap.delete(queueKey);
                                successResultCache.delete(queueKey);
                                processQueueRetryCount.delete(queueKey);
                            }
                            catch (error) {
                                // printLog(`[队列处理] 强制清理队列失败`, error)
                            }
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        queue = requestQueueMap.get(queueKey);
                        if (!queue || queue.isProcessing || queue.queue.length === 0) {
                            // 重置重试计数
                            processQueueRetryCount.delete(queueKey);
                            return [2 /*return*/];
                        }
                        queue.isProcessing = true;
                        // 增加重试计数
                        processQueueRetryCount.set(queueKey, retryCount + 1);
                        item = queue.queue.shift();
                        if (!item) {
                            queue.isProcessing = false;
                            processQueueRetryCount.delete(queueKey);
                            // 如果队列为空，删除该队列并清空缓存
                            // 这是队列真正处理完成的标志（队列为空且没有正在处理的请求）
                            try {
                                if (queue.queue.length === 0) {
                                    // printLog(`[队列处理] 队列项为空，队列处理完成，删除队列并清空缓存，queueKey: ${queueKey}`)
                                    requestQueueMap.delete(queueKey);
                                    successResultCache.delete(queueKey);
                                }
                            }
                            catch (error) {
                                // printLog(`[队列处理] 清理队列失败`, error)
                            }
                            return [2 /*return*/];
                        }
                        cacheItem = void 0;
                        try {
                            cacheItem = successResultCache.get(queueKey);
                            // printLog(`[队列处理] 检查缓存，queueKey: ${queueKey}, 缓存是否存在: ${!!cacheItem}`)
                        }
                        catch (error) {
                            // printLog(`[队列处理] 检查缓存失败，继续执行请求`, error)
                        }
                        if (cacheItem) {
                            try {
                                now = Date.now();
                                if (now - cacheItem.timestamp > CACHE_CONFIG.MAX_CACHE_AGE) {
                                    // printLog(`[队列处理] 缓存已过期，清理缓存，queueKey: ${queueKey}`)
                                    try {
                                        successResultCache.delete(queueKey);
                                    }
                                    catch (error) {
                                        // printLog(`[队列处理] 删除过期缓存失败`, error)
                                    }
                                }
                                else {
                                    cachedResponse = __assign(__assign({}, cacheItem.result), { code: 101 });
                                    try {
                                        item.resolve(cachedResponse);
                                    }
                                    catch (error) {
                                        // printLog(`[队列处理] 返回缓存结果失败`, error)
                                    }
                                    queue.isProcessing = false;
                                    // 重置重试计数
                                    processQueueRetryCount.delete(queueKey);
                                    // 处理队列中的下一个请求
                                    try {
                                        if (queue.queue.length > 0) {
                                            // printLog(`[队列处理] 继续处理下一个请求，queueKey: ${queueKey}, 剩余队列长度: ${queue.queue.length}`)
                                            // 使用 setTimeout 防止调用栈溢出
                                            setTimeout(function () {
                                                processQueue(queueKey).catch(function (err) {
                                                    // printLog(`[队列处理] 处理下一个请求失败`, err)
                                                });
                                            }, 0);
                                        }
                                        else {
                                            // 队列为空且没有正在处理的请求，删除该队列并清空缓存
                                            // 这是队列真正处理完成的标志
                                            // printLog(`[队列处理] 队列处理完成（队列为空且无正在处理的请求），删除队列并清空缓存，queueKey: ${queueKey}`)
                                            try {
                                                requestQueueMap.delete(queueKey);
                                                successResultCache.delete(queueKey);
                                            }
                                            catch (error) {
                                                // printLog(`[队列处理] 清理队列和缓存失败`, error)
                                            }
                                        }
                                    }
                                    catch (error) {
                                        // printLog(`[队列处理] 处理队列后续逻辑失败`, error)
                                        // 确保队列状态被重置
                                        try {
                                            queue.isProcessing = false;
                                            if (queue.queue.length === 0) {
                                                requestQueueMap.delete(queueKey);
                                                successResultCache.delete(queueKey);
                                            }
                                        }
                                        catch (cleanupError) {
                                            // printLog(`[队列处理] 清理队列状态失败`, cleanupError)
                                        }
                                    }
                                    return [2 /*return*/];
                                }
                            }
                            catch (error) {
                                // printLog(`[队列处理] 处理缓存逻辑失败，继续执行请求`, error)
                            }
                        }
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, 5, 6]);
                        timeoutPromise = new Promise(function (_, reject) {
                            setTimeout(function () { return reject(new Error('队列请求超时')); }, 30000); // 30秒超时
                        });
                        return [4 /*yield*/, Promise.race([
                                doRequestOriginal(item.options, item.urlIndex, item.refreshNum, item.enableHttpDNS),
                                timeoutPromise
                            ])];
                    case 3:
                        result = _a.sent();
                        // printLog(`[队列处理] 请求成功完成，queueKey: ${queueKey}, 耗时: ${duration}ms`)
                        // 如果请求成功且 data.status > 1，缓存结果
                        try {
                            cacheSuccessResult(queueKey, result);
                        }
                        catch (error) {
                            // printLog(`[队列处理] 缓存结果失败，但不影响请求结果`, error)
                        }
                        try {
                            item.resolve(result);
                        }
                        catch (error) {
                            // printLog(`[队列处理] 返回请求结果失败`, error)
                        }
                        return [3 /*break*/, 6];
                    case 4:
                        error_1 = _a.sent();
                        // printLog(`[队列处理] 请求失败，queueKey: ${queueKey}, 耗时: ${duration}ms`, error)
                        try {
                            item.reject(error_1);
                        }
                        catch (rejectError) {
                            // printLog(`[队列处理] 拒绝请求失败`, rejectError)
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        try {
                            queue.isProcessing = false;
                            // 处理队列中的下一个请求
                            if (queue.queue.length > 0) {
                                // printLog(`[队列处理] 继续处理下一个请求，queueKey: ${queueKey}, 剩余队列长度: ${queue.queue.length}`)
                                // 使用 setTimeout 防止调用栈溢出
                                setTimeout(function () {
                                    processQueue(queueKey).catch(function (err) {
                                        // printLog(`[队列处理] 处理下一个请求失败`, err)
                                        // 如果处理失败，确保队列状态被重置
                                        try {
                                            var failedQueue = requestQueueMap.get(queueKey);
                                            if (failedQueue) {
                                                failedQueue.isProcessing = false;
                                                if (failedQueue.queue.length === 0) {
                                                    requestQueueMap.delete(queueKey);
                                                    successResultCache.delete(queueKey);
                                                    processQueueRetryCount.delete(queueKey);
                                                }
                                            }
                                        }
                                        catch (cleanupError) {
                                            // printLog(`[队列处理] 清理失败队列状态失败`, cleanupError)
                                        }
                                    });
                                }, 0);
                            }
                            else {
                                // 队列为空且没有正在处理的请求，删除该队列并清空缓存
                                // 这是队列真正处理完成的标志
                                // printLog(`[队列处理] 队列处理完成（队列为空且无正在处理的请求），删除队列并清空缓存，queueKey: ${queueKey}`)
                                try {
                                    requestQueueMap.delete(queueKey);
                                    successResultCache.delete(queueKey);
                                    processQueueRetryCount.delete(queueKey);
                                }
                                catch (error) {
                                    // printLog(`[队列处理] 清理队列和缓存失败`, error)
                                }
                            }
                        }
                        catch (error) {
                            // printLog(`[队列处理] finally 块执行失败，强制清理`, error)
                            // 强制清理，防止队列卡死
                            try {
                                queue.isProcessing = false;
                                if (queue.queue.length === 0) {
                                    requestQueueMap.delete(queueKey);
                                    successResultCache.delete(queueKey);
                                    processQueueRetryCount.delete(queueKey);
                                }
                            }
                            catch (cleanupError) {
                                // printLog(`[队列处理] 强制清理失败`, cleanupError)
                            }
                        }
                        return [7 /*endfinally*/];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        _a.sent();
                        // 外层异常捕获，确保不影响其他功能
                        // printLog(`[队列处理] processQueue 执行异常，强制清理队列，queueKey: ${queueKey}`, error)
                        try {
                            queue = requestQueueMap.get(queueKey);
                            if (queue) {
                                queue.isProcessing = false;
                                // 清理队列中的所有请求
                                queue.queue.forEach(function (queueItem) {
                                    try {
                                        queueItem.reject(new Error('队列处理异常，请求被取消'));
                                    }
                                    catch (rejectError) {
                                        // printLog(`[队列处理] 清理队列项失败`, rejectError)
                                    }
                                });
                            }
                            requestQueueMap.delete(queueKey);
                            successResultCache.delete(queueKey);
                            processQueueRetryCount.delete(queueKey);
                        }
                        catch (cleanupError) {
                            printLog("[\u961F\u5217\u5904\u7406] \u5F02\u5E38\u6E05\u7406\u5931\u8D25", cleanupError);
                        }
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    }
    function crypto$1() {
        // @ts-ignore
        // return cryptoJS()
        return wx.crypto;
    }
    /**
     * AES-CBC 加密字符串
     * @param {string} data 需要加密的字符串
     * @param {string} key 加密密钥
     * @param {string} iv 初始化向量
     * @returns {string} 加密后的 Base64 编码字符串
     */
    function AesEncryptBase64String(data, key, iv) {
        var CryptoJS = crypto$1();
        // 将密钥和初始化向量转换为 WordArray
        var keyWordArray = CryptoJS.enc.Utf8.parse(key);
        var ivWordArray = CryptoJS.enc.Utf8.parse(iv);
        // 使用 AES-CBC 加密
        var encrypted = CryptoJS.AES.encrypt(data, keyWordArray, {
            iv: ivWordArray,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        // 返回 Base64 编码的加密结果
        return encrypted.toString();
    }
    /**
     * AES-CBC 解密字符串
     * @param {string} encryptedData 加密后的 Base64 编码字符串
     * @param {string} key 加密密钥
     * @param {string} iv 初始化向量
     * @returns {string} 解密后的原始字符串
     */
    function AesDecryptBase64String(encryptedData, key, iv) {
        var CryptoJS = crypto$1();
        // 将密钥和初始化向量转换为 WordArray
        var keyWordArray = CryptoJS.enc.Utf8.parse(key);
        var ivWordArray = CryptoJS.enc.Utf8.parse(iv);
        // 使用 AES-CBC 解密
        var decrypted = CryptoJS.AES.decrypt(encryptedData, keyWordArray, {
            iv: ivWordArray,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        // 将解密结果转换为 UTF-8 字符串
        return decrypted.toString(CryptoJS.enc.Utf8);
    }
    /**
     * 生成 MD5 加密字符串
     * @param {string} message - 需要加密的字符串
     * @returns {string} - 加密后的 MD5 字符串
     */
    function generateMD5(message) {
        var CryptoJS = crypto$1();
        if (CryptoJS)
            return CryptoJS.MD5(message).toString();
        return '';
    }
    var getDevicecode = function () {
        try {
            var devicecode = customGetStorageSync('rx_devicecode');
            if (devicecode) {
                // @ts-ignore
                return devicecode.code;
            }
            else {
                var code = v4_1();
                customSetStorageSync('rx_devicecode', { code: code, openIds: {} });
                return code;
            }
        }
        catch (err) {
            return v4_1();
        }
    };
    function checkNeedAesEncrypt(url) {
        if (!crypto$1()) {
            return false;
        }
        if (!SYSTEM_INFO$1.CP_OF) {
            return false;
        }
        return !url.includes('/v1/sdkconfig/init');
    }
    // 接口白名单：初始化未成功之前能走请求的接口
    var apiWhiteList = ['/v1/sdkconfig/init', '/v1/vcapi/update', '/v1/vcapi/update_module_version'];
    var refreshCode = [302206, 302207, 302002];
    var refreshTokenReq = function () {
        return doRequest({
            method: 'POST',
            url: '/v1/passport/token/refresh'
        });
    };
    var getHeaders = function (path) {
        var _a, _b;
        var accessWhiteSpace = [
            '/v1/passport/account/login_by_credential',
            '/v1/passport/account/login_by_token'
        ];
        var getDevicecode = function () {
            try {
                var devicecode = customGetStorageSync('rx_devicecode');
                if (devicecode) {
                    // @ts-ignore
                    return devicecode.code;
                }
                else {
                    var code = v4_1();
                    customSetStorageSync('rx_devicecode', { code: code, openIds: {} });
                    return code;
                }
            }
            catch (err) {
                return v4_1();
            }
        };
        var devicecode = getDevicecode();
        var headers = (_a = {},
            _a['ruixue-language'] = 'zh-CN',
            _a['ruixue-cpid'] = SYSTEM_INFO$1.cpid,
            _a['ruixue-productid'] = SYSTEM_INFO$1.productId,
            _a['ruixue-channelid'] = SYSTEM_INFO$1.channelId,
            _a['ruixue-platformid'] = '4',
            _a['ruixue-devicecode'] = devicecode,
            _a['ruixue-version'] = SYSTEM_INFO$1.__RX_SDK_VERSION,
            _a['ruixue-traceid'] = v4_1(),
            _a['ruixue-tzoffset'] = SYSTEM_INFO$1.timezone + '',
            _a);
        var rxToken = customGetStorageSync('rxToken');
        if (!accessWhiteSpace.includes(path)) {
            // @ts-ignore
            Reflect.set(headers, 'ruixue-accesstoken', (rxToken === null || rxToken === void 0 ? void 0 : rxToken.access) || '');
        }
        if (path == '/v1/passport/token/refresh') {
            console.log('refresh');
            headers['ruixue-datacount'] = '1';
            // @ts-ignore
            headers['ruixue-refreshtoken'] = rxToken === null || rxToken === void 0 ? void 0 : rxToken.refresh;
        }
        if (path.includes('/v1/data/api/track')) {
            headers = (_b = {},
                _b['ruixue-datacount'] = '1',
                _b);
        }
        if (checkNeedAesEncrypt(path)) {
            headers['ruixue-encipher'] = '1';
            headers['ruixue-devicecode'] = devicecode;
            headers['ruixue-version'] = SYSTEM_INFO$1.__RX_SDK_VERSION;
            headers['ruixue-platformid'] = '4';
        }
        if (SYSTEM_INFO$1.region_tag) {
            headers['ruixue-region'] = "".concat(SYSTEM_INFO$1.region_tag);
        }
        if (SYSTEM_INFO$1.cp_role_id) {
            headers['ruixue-cp-role-id'] = "".concat(SYSTEM_INFO$1.cp_role_id);
        }
        if (SYSTEM_INFO$1.miniVersion) {
            headers['ruixue-appinfo'] = "version=".concat(SYSTEM_INFO$1.miniVersion);
        }
        return headers;
    };
    function removeKeyFromObject(obj) {
        return Object.fromEntries(Object.entries(obj).filter(function (_a) {
            var key = _a[0];
            return key !== 'ruixue-encipher';
        }));
    }
    function isJsonString(str) {
        try {
            var parsed = JSON.parse(str);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    var retryRequest = function (options, resolve, reject) {
        var header = removeKeyFromObject(options.header);
        printLog("".concat(options.url));
        printLog("options", options);
        printLog("timeout", SYSTEM_INFO$1.timeout || 7000);
        wx.request(__assign(__assign({}, options), { header: header, timeout: SYSTEM_INFO$1.timeout || 7000, data: options.data, success: function (res) {
                printLog("".concat(options.url));
                printLog("res", res.data);
                resolve(res.data);
            }, fail: function (res) {
                printLog("".concat(options.url));
                printLog("err", res);
                reject(res);
            } }));
    };
    function trackEncrypt(options, key) {
        trackApi([
            {
                event: '#rx_error',
                type: 'track',
                time: formatDate('YYYY-MM-DDTHH:mm:ss.SSSZ'),
                uuid: v4_1(),
                sub_channel_id: USER_INFO.subchannelid,
                distinct_id: USER_INFO.openid,
                platform_id: 4,
                product_id: SYSTEM_INFO$1.productId,
                cpid: Number(SYSTEM_INFO$1.cpid),
                channel_id: SYSTEM_INFO$1.channelId,
                devicecode: getDevicecode(),
                properties: {
                    error_action: 'encrypt',
                    error_type: 'sdk',
                    trace_id: v4_1(),
                    rx_version: SYSTEM_INFO$1.__RX_SDK_VERSION,
                    type_tripartite: PLATFORM.WECHAT,
                    request_address: options.url || '',
                    request_header: options.header || '',
                    request_body: options.data || '',
                    key: key
                }
            }
        ]).catch(function (e) {
            console.log(e);
        });
    }
    function trackDecrypt(options, res, key) {
        if (options.url.includes('/v1/data/api/track')) {
            return;
        }
        trackApi([
            {
                event: '#rx_error',
                type: 'track',
                time: formatDate('YYYY-MM-DDTHH:mm:ss.SSSZ'),
                uuid: v4_1(),
                sub_channel_id: USER_INFO.subchannelid,
                distinct_id: USER_INFO.openid,
                platform_id: 4,
                product_id: SYSTEM_INFO$1.productId,
                cpid: Number(SYSTEM_INFO$1.cpid),
                channel_id: SYSTEM_INFO$1.channelId,
                devicecode: getDevicecode(),
                properties: {
                    error_action: 'decrypt',
                    error_type: 'sdk',
                    trace_id: v4_1(),
                    rx_version: SYSTEM_INFO$1.__RX_SDK_VERSION,
                    type_tripartite: PLATFORM.WECHAT,
                    request_address: options.url || '',
                    request_header: options.header || '',
                    request_body: options.data || '',
                    request_response: res === null || res === void 0 ? void 0 : res.data,
                    key: key
                }
            }
        ]).catch(function (e) {
            console.log(e);
        });
    }
    var myRequest = function (options) {
        var devicecode = getDevicecode();
        var key = generateMD5(devicecode + cpkey);
        printLog("".concat(options.url));
        printLog("options", options);
        return new Promise(function (resolve, reject) {
            var data = options.data;
            var isAes = checkNeedAesEncrypt(options.url);
            try {
                data = (isAes && options.method.toLowerCase() != 'get') ? AesEncryptBase64String(JSON.stringify(options.data), key, key.slice(0, 16)) : options.data;
                if (isAes && options.method.toLowerCase() != 'get') {
                    printLog('Encrypt Data:', data);
                }
            }
            catch (e) {
                trackEncrypt(options, key);
                retryRequest(options, resolve, reject);
                return;
            }
            printLog("timeout", SYSTEM_INFO$1.timeout || 7000);
            wx.request(__assign(__assign({}, options), { data: data, timeout: SYSTEM_INFO$1.timeout || 7000, success: function (res) {
                    var _a, _b, _c, _d;
                    if ([302015, 302016].includes((_a = res.data) === null || _a === void 0 ? void 0 : _a.code)) {
                        printLog('request 解密失败', options.url, (_b = res.data) === null || _b === void 0 ? void 0 : _b.code);
                        trackDecrypt(options, res, key);
                        retryRequest(options, resolve, reject);
                    }
                    else {
                        var data_1 = (_c = res.data) === null || _c === void 0 ? void 0 : _c.data;
                        if (isAes && data_1) {
                            try {
                                if (((_d = res.data) === null || _d === void 0 ? void 0 : _d.code) === 0) {
                                    data_1 = AesDecryptBase64String(data_1, key, key.slice(0, 16));
                                    printLog('Decrypt Data:', data_1);
                                    var result = __assign(__assign({}, res.data), { data: isJsonString(data_1) ? JSON.parse(data_1) : data_1 });
                                    printLog("".concat(options.url));
                                    printLog("res", result);
                                    resolve(result);
                                }
                                else {
                                    resolve(res.data);
                                }
                            }
                            catch (e) {
                                printLog('response 解密失败', options.url, e);
                                trackDecrypt(options, res, key);
                                retryRequest(options, resolve, reject);
                            }
                        }
                        else {
                            printLog("".concat(options.url));
                            printLog("res", res.data);
                            resolve(res.data);
                        }
                    }
                }, fail: function (res) {
                    printLog("".concat(options.url));
                    printLog("err", res);
                    reject(res);
                } }));
        });
    };
    function isHttpOrHttps(url) {
        return /^(http:\/\/|https:\/\/)/.test(url);
    }
    function resetOptions(options) {
        return __awaiter(this, void 0, void 0, function () {
            var _options, code, e_1, code, e_2, code, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _options = JSON.parse(JSON.stringify(options));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        if (!(_options.url == '/v1/passport/account/login_by_credential')) return [3 /*break*/, 3];
                        return [4 /*yield*/, asyncFunc(wx.login)];
                    case 2:
                        code = (_a.sent()).code;
                        _options.data.ext.code = code;
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        console.log(e_1);
                        return [3 /*break*/, 5];
                    case 5:
                        _a.trys.push([5, 8, , 9]);
                        if (!(_options.url == '/v1/passport/user/sync_info')) return [3 /*break*/, 7];
                        return [4 /*yield*/, asyncFunc(wx.login)];
                    case 6:
                        code = (_a.sent()).code;
                        _options.data.code = code;
                        _a.label = 7;
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        e_2 = _a.sent();
                        console.log(e_2);
                        return [3 /*break*/, 9];
                    case 9:
                        _a.trys.push([9, 12, , 13]);
                        if (!(_options.url == '/v1/passport/captcha/send_auth')) return [3 /*break*/, 11];
                        return [4 /*yield*/, asyncFunc(wx.login)];
                    case 10:
                        code = (_a.sent()).code;
                        _options.data.minigame_code = code;
                        _a.label = 11;
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        e_3 = _a.sent();
                        console.log(e_3);
                        return [3 /*break*/, 13];
                    case 13: return [2 /*return*/, _options];
                }
            });
        });
    }
    // 原有的 doRequest 逻辑（完全保持不变）
    function doRequestOriginal(options, urlIndex, refreshNum, enableHttpDNS) {
        var _a, _b;
        if (urlIndex === void 0) { urlIndex = 0; }
        if (refreshNum === void 0) { refreshNum = 0; }
        if (enableHttpDNS === void 0) { enableHttpDNS = false; }
        return __awaiter(this, void 0, void 0, function () {
            var path, error, headers, useHttpDNS, enableHttpDNSOptions, url, res, msg, error, e_4, _options, _options, url;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        SYSTEM_INFO$1.reqUrlIndex = urlIndex;
                        path = options.url;
                        if (!apiWhiteList.find(function (item) { return options.url.startsWith(item); }) && !SYSTEM_INFO$1.SDK_INIT_FINISHED) {
                            printLog('sdk doRequest options: ', JSON.stringify(options));
                            error = {
                                msg: '初始化错误，或未初始化',
                                code: COMMON_ERROR_CODE.INIT_PARAMS_ERROR,
                                thirdcode: COMMON_ERROR_CODE.INIT_PARAMS_ERROR,
                                thrdmsg: '初始化错误，或未初始化',
                                url: options.url
                            };
                            return [2 /*return*/, Promise.reject(error)];
                        }
                        headers = getHeaders(path);
                        useHttpDNS = !!SYSTEM_INFO$1.httpDNSServiceId && enableHttpDNS;
                        enableHttpDNSOptions = useHttpDNS ? {
                            enableHttpDNS: true,
                            httpDNSServiceId: SYSTEM_INFO$1.httpDNSServiceId
                        } : {};
                        if (useHttpDNS) {
                            printLog('---useHttpDNS---');
                            printLog(SYSTEM_INFO$1.httpDNSServiceId);
                        }
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 8]);
                        url = isHttpOrHttps(path) ? path : SYSTEM_INFO$1.baseUrlList[urlIndex] + path;
                        return [4 /*yield*/, myRequest(__assign({ url: url, method: options.method, data: options.data || options.params, header: __assign(__assign({}, headers), (options.header || {}) // 支持合并自定义 header
                                ), enableHttp2: true }, enableHttpDNSOptions))];
                    case 2:
                        res = _c.sent();
                        if (res.code == 0) {
                            return [2 /*return*/, Promise.resolve(res)];
                        }
                        if (refreshCode.includes(res.code)) {
                            if (refreshNum === 5) {
                                refreshNum = 0;
                                return [2 /*return*/, Promise.reject({ code: 1000000, msg: 'refresh token failed,please login again' })];
                            }
                            else {
                                refreshNum++;
                                return [2 /*return*/, refreshTokenReq().then(function (refreshRes) { return __awaiter(_this, void 0, void 0, function () {
                                        var _options;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    customSetStorageSync('rxToken', refreshRes.data);
                                                    return [4 /*yield*/, resetOptions(options)];
                                                case 1:
                                                    _options = _a.sent();
                                                    return [2 /*return*/, doRequestOriginal(_options, urlIndex, refreshNum, enableHttpDNS)];
                                            }
                                        });
                                    }); })];
                            }
                        }
                        else {
                            msg = res.msg || res.message || res.errorMsg || 'Error';
                            error = new Error(msg);
                            error.code = res.code || COMMON_ERROR_CODE.UNKNOW_NETWORK_ERROR;
                            error.data = res.data || res;
                            error.thirdcode = res.thirdcode;
                            error.thirdmsg = res.thirdmsg;
                            error.client_ip = res.client_ip || '';
                            error.isServerError = true;
                            return [2 /*return*/, Promise.reject(error)];
                        }
                    case 3:
                        e_4 = _c.sent();
                        if (!(urlIndex < SYSTEM_INFO$1.baseUrlList.length - 1)) return [3 /*break*/, 5];
                        urlIndex++;
                        return [4 /*yield*/, resetOptions(options)];
                    case 4:
                        _options = _c.sent();
                        return [2 /*return*/, doRequestOriginal(_options, urlIndex, refreshNum, enableHttpDNS)];
                    case 5:
                        urlIndex = 0;
                        if (!(!enableHttpDNS && (((_a = e_4.errMsg) === null || _a === void 0 ? void 0 : _a.includes('ERR_NAME_NOT_RESOLVED')) || ((_b = e_4.errMsg) === null || _b === void 0 ? void 0 : _b.includes('ERR_CONNECTION_TIMED_OUT'))))) return [3 /*break*/, 7];
                        return [4 /*yield*/, resetOptions(options)];
                    case 6:
                        _options = _c.sent();
                        return [2 /*return*/, doRequestOriginal(_options, urlIndex, refreshNum, true)];
                    case 7:
                        url = isHttpOrHttps(path) ? path : SYSTEM_INFO$1.baseUrlList[urlIndex] + path;
                        return [2 /*return*/, Promise.reject(__assign({ url: url, request_header: headers, request_body: options.data || options.params, code: e_4.code || e_4.errno || COMMON_ERROR_CODE.UNKNOW_NETWORK_ERROR, msg: e_4.msg || e_4.message || e_4.errMsg || 'Error', thirdcode: e_4.thirdcode || e_4.errno || e_4.code || COMMON_ERROR_CODE.UNKNOW_NETWORK_ERROR, thirdmsg: e_4.thirdmsg || e_4.msg || e_4.message || e_4.errMsg || 'Error' }, e_4))];
                    case 8: return [2 /*return*/];
                }
            });
        });
    }
    // 新的 doRequest 函数，添加队列机制（仅在特定条件下）
    function doRequest(options, urlIndex, refreshNum, enableHttpDNS) {
        if (urlIndex === void 0) { urlIndex = 0; }
        if (refreshNum === void 0) { refreshNum = 0; }
        if (enableHttpDNS === void 0) { enableHttpDNS = false; }
        return __awaiter(this, void 0, void 0, function () {
            var apiFilter, path_1, needQueue, requestData, queueKey_1, cacheItem, now, cachedResponse, queue_1;
            return __generator(this, function (_a) {
                try {
                    apiFilter = ['/v1/ke/user_get_order_info'];
                    path_1 = options === null || options === void 0 ? void 0 : options.url;
                    needQueue = false;
                    try {
                        needQueue = apiFilter.some(function (filter) { var _a; return path_1 && ((_a = path_1 === null || path_1 === void 0 ? void 0 : path_1.includes) === null || _a === void 0 ? void 0 : _a.call(path_1, filter)); });
                    }
                    catch (error) {
                        // printLog(`[请求队列] 检查是否需要队列管理失败，直接执行原逻辑`, error)
                        return [2 /*return*/, doRequestOriginal(options, urlIndex, refreshNum, enableHttpDNS)];
                    }
                    if (needQueue) {
                        try {
                            requestData = options.data || options.params || {};
                            try {
                                queueKey_1 = generateRequestKey(path_1, requestData);
                            }
                            catch (error) {
                                // printLog(`[请求队列] 生成 queueKey 失败，直接执行原逻辑`, error)
                                return [2 /*return*/, doRequestOriginal(options, urlIndex, refreshNum, enableHttpDNS)];
                            }
                            cacheItem = void 0;
                            try {
                                cacheItem = successResultCache.get(queueKey_1);
                                // printLog(`[请求队列] 检查缓存，queueKey: ${queueKey}, 缓存是否存在: ${!!cacheItem}`)
                            }
                            catch (error) {
                                // printLog(`[请求队列] 检查缓存失败，继续执行队列逻辑`, error)
                            }
                            if (cacheItem) {
                                try {
                                    now = Date.now();
                                    if (now - cacheItem.timestamp > CACHE_CONFIG.MAX_CACHE_AGE) {
                                        // printLog(`[请求队列] 缓存已过期，清理缓存，queueKey: ${queueKey}`)
                                        try {
                                            successResultCache.delete(queueKey_1);
                                        }
                                        catch (error) {
                                            // printLog(`[请求队列] 删除过期缓存失败`, error)
                                        }
                                    }
                                    else {
                                        // printLog(`[请求队列] 使用缓存结果，直接返回 code 101（跳过所有队列逻辑），queueKey: ${queueKey}`)
                                        // 直接返回缓存的响应，但 code 改为 101
                                        try {
                                            cachedResponse = __assign(__assign({}, cacheItem.result), { code: 101 });
                                            return [2 /*return*/, Promise.resolve(cachedResponse)];
                                        }
                                        catch (error) {
                                            // printLog(`[请求队列] 构建缓存响应失败，继续执行队列逻辑`, error)
                                        }
                                    }
                                }
                                catch (error) {
                                    // printLog(`[请求队列] 处理缓存逻辑失败，继续执行队列逻辑`, error)
                                }
                            }
                            try {
                                queue_1 = requestQueueMap.get(queueKey_1);
                                if (!queue_1) {
                                    queue_1 = {
                                        isProcessing: false,
                                        queue: []
                                    };
                                    try {
                                        requestQueueMap.set(queueKey_1, queue_1);
                                        // printLog(`[请求队列] 创建新队列，queueKey: ${queueKey}`)
                                    }
                                    catch (error) {
                                        //  printLog(`[请求队列] 创建队列失败，直接执行原逻辑`, error)
                                        return [2 /*return*/, doRequestOriginal(options, urlIndex, refreshNum, enableHttpDNS)];
                                    }
                                }
                            }
                            catch (error) {
                                // printLog(`[请求队列] 获取或创建队列失败，直接执行原逻辑`, error)
                                return [2 /*return*/, doRequestOriginal(options, urlIndex, refreshNum, enableHttpDNS)];
                            }
                            // 如果当前没有正在处理的请求，直接执行
                            if (!queue_1.isProcessing && queue_1.queue.length === 0) {
                                // printLog(`[请求队列] 队列为空，立即执行请求，queueKey: ${queueKey}`)
                                return [2 /*return*/, new Promise(function (resolve, reject) {
                                        try {
                                            // 立即开始处理
                                            queue_1.isProcessing = true;
                                            var startTime_1 = Date.now();
                                            // 添加超时控制，防止请求卡死
                                            var timeoutPromise = new Promise(function (_, timeoutReject) {
                                                setTimeout(function () { return timeoutReject(new Error('队列请求超时')); }, 30000); // 30秒超时
                                            });
                                            // 调用原有的 doRequest 逻辑
                                            Promise.race([
                                                doRequestOriginal(options, urlIndex, refreshNum, enableHttpDNS),
                                                timeoutPromise
                                            ])
                                                .then(function (result) {
                                                try {
                                                    var duration = Date.now() - startTime_1;
                                                    // printLog(`[请求队列] 请求成功完成，queueKey: ${queueKey}, 耗时: ${duration}ms`)
                                                    // 如果请求成功且 data.status > 1，缓存结果
                                                    try {
                                                        cacheSuccessResult(queueKey_1, result);
                                                    }
                                                    catch (error) {
                                                        // printLog(`[请求队列] 缓存结果失败，但不影响请求结果`, error)
                                                    }
                                                    // 验证缓存是否已设置
                                                    try {
                                                        var hasCache = successResultCache.has(queueKey_1);
                                                        // printLog(`[请求队列] 缓存设置完成，queueKey: ${queueKey}, 缓存是否存在: ${hasCache}`)
                                                    }
                                                    catch (error) {
                                                        // printLog(`[请求队列] 验证缓存失败`, error)
                                                    }
                                                    resolve(result);
                                                    // 在 resolve 之后，确保缓存已设置完成，再处理队列中的下一个请求
                                                    try {
                                                        queue_1.isProcessing = false;
                                                        if (queue_1.queue.length > 0) {
                                                            // printLog(`[请求队列] 请求完成，开始处理队列中的下一个请求，queueKey: ${queueKey}, 队列长度: ${queue!.queue.length}`)
                                                            // 处理队列中的下一个请求（缓存已设置，应该能检查到）
                                                            // 使用 setTimeout 防止调用栈溢出
                                                            setTimeout(function () {
                                                                processQueue(queueKey_1).catch(function (err) {
                                                                    // printLog(`[请求队列] 处理下一个请求失败`, err)
                                                                });
                                                            }, 0);
                                                        }
                                                        else {
                                                            // 队列为空，删除队列
                                                            // 注意：这里不清空缓存，因为后续可能还有相同参数的请求，缓存会在 processQueue 中所有请求处理完成时清空
                                                            // printLog(`[请求队列] 队列为空，删除队列（保留缓存供后续请求使用），queueKey: ${queueKey}`)
                                                            try {
                                                                requestQueueMap.delete(queueKey_1);
                                                            }
                                                            catch (error) {
                                                                // printLog(`[请求队列] 删除队列失败`, error)
                                                            }
                                                        }
                                                    }
                                                    catch (error) {
                                                        // printLog(`[请求队列] 处理队列后续逻辑失败`, error)
                                                        // 确保队列状态被重置
                                                        try {
                                                            queue_1.isProcessing = false;
                                                            if (queue_1.queue.length === 0) {
                                                                requestQueueMap.delete(queueKey_1);
                                                            }
                                                        }
                                                        catch (cleanupError) {
                                                            // printLog(`[请求队列] 清理队列状态失败`, cleanupError)
                                                        }
                                                    }
                                                }
                                                catch (error) {
                                                    // printLog(`[请求队列] 处理请求成功回调失败`, error)
                                                    // 确保 reject 被调用
                                                    try {
                                                        reject(error);
                                                    }
                                                    catch (rejectError) {
                                                        // printLog(`[请求队列] reject 失败`, rejectError)
                                                    }
                                                }
                                            })
                                                .catch(function (error) {
                                                try {
                                                    var duration = Date.now() - startTime_1;
                                                    // printLog(`[请求队列] 请求失败，queueKey: ${queueKey}, 耗时: ${duration}ms`, error)
                                                    reject(error);
                                                    queue_1.isProcessing = false;
                                                    // 处理队列中的下一个请求
                                                    try {
                                                        if (queue_1.queue.length > 0) {
                                                            // printLog(`[请求队列] 请求失败，继续处理队列中的下一个请求，queueKey: ${queueKey}, 队列长度: ${queue!.queue.length}`)
                                                            // 使用 setTimeout 防止调用栈溢出
                                                            setTimeout(function () {
                                                                processQueue(queueKey_1).catch(function (err) {
                                                                    // printLog(`[请求队列] 处理下一个请求失败`, err)
                                                                });
                                                            }, 0);
                                                        }
                                                        else {
                                                            // 队列为空，删除队列
                                                            // 注意：这里不清空缓存，因为后续可能还有相同参数的请求，缓存会在 processQueue 中所有请求处理完成时清空
                                                            // printLog(`[请求队列] 队列为空，删除队列（保留缓存供后续请求使用），queueKey: ${queueKey}`)
                                                            try {
                                                                requestQueueMap.delete(queueKey_1);
                                                            }
                                                            catch (error) {
                                                                // printLog(`[请求队列] 删除队列失败`, error)
                                                            }
                                                        }
                                                    }
                                                    catch (error) {
                                                        // printLog(`[请求队列] 处理队列后续逻辑失败`, error)
                                                        // 确保队列状态被重置
                                                        try {
                                                            queue_1.isProcessing = false;
                                                            if (queue_1.queue.length === 0) {
                                                                requestQueueMap.delete(queueKey_1);
                                                            }
                                                        }
                                                        catch (cleanupError) {
                                                            // printLog(`[请求队列] 清理队列状态失败`, cleanupError)
                                                        }
                                                    }
                                                }
                                                catch (error) {
                                                    // printLog(`[请求队列] 处理请求失败回调失败`, error)
                                                }
                                            });
                                        }
                                        catch (error) {
                                            // printLog(`[请求队列] 创建 Promise 失败，直接执行原逻辑`, error)
                                            // 确保队列状态被重置
                                            try {
                                                queue_1.isProcessing = false;
                                            }
                                            catch (cleanupError) {
                                                // printLog(`[请求队列] 重置队列状态失败`, cleanupError)
                                            }
                                            return doRequestOriginal(options, urlIndex, refreshNum, enableHttpDNS);
                                        }
                                    })];
                            }
                            else {
                                // 有正在处理的请求或队列中有请求，加入队列
                                // 注意：这里不需要再检查缓存，因为已经在上面检查过了
                                // printLog(`[请求队列] 请求加入队列，queueKey: ${queueKey}, 当前队列长度: ${queue.queue.length}, 是否正在处理: ${queue.isProcessing}`)
                                return [2 /*return*/, new Promise(function (resolve, reject) {
                                        try {
                                            queue_1.queue.push({
                                                resolve: resolve,
                                                reject: reject,
                                                options: options,
                                                urlIndex: urlIndex,
                                                refreshNum: refreshNum,
                                                enableHttpDNS: enableHttpDNS
                                            });
                                            // printLog(`[请求队列] 请求已加入队列，queueKey: ${queueKey}, 队列长度: ${queue!.queue.length}`)
                                            // 如果当前没有正在处理，开始处理队列
                                            if (!queue_1.isProcessing) {
                                                // printLog(`[请求队列] 开始处理队列，queueKey: ${queueKey}`)
                                                // 使用 setTimeout 防止调用栈溢出
                                                setTimeout(function () {
                                                    processQueue(queueKey_1).catch(function (err) {
                                                        // printLog(`[请求队列] 处理队列失败`, err)
                                                        // 如果处理失败，确保队列状态被重置
                                                        try {
                                                            var failedQueue = requestQueueMap.get(queueKey_1);
                                                            if (failedQueue) {
                                                                failedQueue.isProcessing = false;
                                                            }
                                                        }
                                                        catch (cleanupError) {
                                                            // printLog(`[请求队列] 清理失败队列状态失败`, cleanupError)
                                                        }
                                                    });
                                                }, 0);
                                            }
                                        }
                                        catch (error) {
                                            // printLog(`[请求队列] 加入队列失败，直接执行原逻辑`, error)
                                            // 如果加入队列失败，直接执行原逻辑
                                            doRequestOriginal(options, urlIndex, refreshNum, enableHttpDNS)
                                                .then(resolve)
                                                .catch(reject);
                                        }
                                    })];
                            }
                        }
                        catch (error) {
                            // 队列处理逻辑发生异常，直接执行原逻辑，不影响其他功能
                            // printLog(`[请求队列] 队列处理逻辑异常，直接执行原逻辑`, error)
                            return [2 /*return*/, doRequestOriginal(options, urlIndex, refreshNum, enableHttpDNS)];
                        }
                    }
                }
                catch (error) {
                    // 最外层异常捕获，确保不影响其他功能
                    // printLog(`[请求队列] doRequest 执行异常，直接执行原逻辑`, error)
                    return [2 /*return*/, doRequestOriginal(options, urlIndex, refreshNum, enableHttpDNS)];
                }
                // 不在 apiFilter 中的请求，直接执行原有逻辑（完全不受影响）
                return [2 /*return*/, doRequestOriginal(options, urlIndex, refreshNum, enableHttpDNS)];
            });
        });
    }

    function createFeedbackApi$1(data) {
        return doRequest({
            url: '/v1/feedbackapi/player_feedback/create',
            method: 'POST',
            data: data,
        });
    }
    function getFeedbackListApi(params) {
        return doRequest({
            url: '/v1/feedbackapi/player_feedback/list',
            method: 'GET',
            params: params,
        });
    }
    function getFeedbackDetailApi(params) {
        return doRequest({
            url: '/v1/feedbackapi/player_feedback/detail',
            method: 'GET',
            params: params,
        });
    }
    function collectPropsApi(data) {
        return doRequest({
            url: '/v1/feedbackapi/player_feedback/getprop',
            method: 'PUT',
            data: data,
        });
    }
    function getNoticeApi(params) {
        return doRequest({
            url: '/v1/operationtoolsapi/maintain/get',
            method: 'GET',
            params: params,
        });
    }
    function getPromoterCodeApi(game_id) {
        return doRequest({
            url: '/v1/operationtoolsapi/exchange/game_display',
            method: 'GET',
            params: { game_id: game_id },
        });
    }
    function exchangePromoterCodeApi(cdkey) {
        return doRequest({
            url: '/v1/operationtoolsapi/exchange/exchange',
            method: 'POST',
            data: { cdkey: cdkey },
        });
    }
    function loginByCredentialApi(data) {
        return doRequest({
            url: '/v1/passport/account/login_by_credential',
            method: 'POST',
            data: data,
        });
    }
    function loginByTokenApi(data) {
        return doRequest({
            url: '/v1/passport/account/login_by_token',
            method: 'POST',
            data: data,
        });
    }
    function getShareDataApi(data) {
        return doRequest({
            url: '/v1/operationapi/share/data',
            method: 'POST',
            data: data,
        });
    }
    function orderApi(data) {
        return doRequest({
            url: '/v1/ke/order',
            method: 'POST',
            data: data,
        });
    }
    //发送验证码
    var sendCaptcha = function (data) {
        return doRequest({
            url: '/v1/passport/sms/send_captcha',
            method: 'POST',
            data: data,
        });
    };
    //发送验证码
    var sendCaptchaWithCode = function (data) {
        return doRequest({
            url: '/v1/passport/captcha/send_auth',
            method: 'POST',
            data: data,
        });
    };
    //绑定手机
    var bindPhone = function (data) {
        return doRequest({
            url: '/v1/passport/user/bind_phone',
            method: 'POST',
            data: data,
        });
    };
    //解绑手机
    var unBindPhone = function (data) {
        return doRequest({
            url: '/v1/passport/user/unbind_phone',
            method: 'POST',
            data: data,
        });
    };
    function validateUnbindCodeApi(data) {
        return doRequest({
            url: '/v1/passport/captcha/verify_auth',
            method: 'post',
            data: __assign(__assign({}, data), { purpose: "unbindphone" }),
        });
    }
    function changePhone(data) {
        return doRequest({
            url: '/v1/passport/user/change_phone',
            method: 'post',
            data: data,
        });
    }
    //绑定邮箱
    var bindEmail = function (data) {
        return doRequest({
            url: '/v1/passport/user/bind_email',
            method: 'POST',
            data: data,
        });
    };
    //解绑邮箱
    var UnbindEmail = function (data) {
        return doRequest({
            url: '/v1/passport/user/unbind_email',
            method: 'POST',
            data: data,
        });
    };
    //申请注销
    function deregister(data) {
        return doRequest({
            url: '/v1/passport/user/deregister',
            method: 'POST',
            data: data,
        });
    }
    //取消注销
    function deregisterCancel() {
        return doRequest({
            url: '/v1/passport/user/cancel_deregister',
            method: 'POST',
        });
    }
    //同步用户信息
    function refreshUserInfo(data) {
        return doRequest({
            url: '/v1/passport/user/sync_info',
            method: 'POST',
            data: data,
        });
    }
    //修改用户信息
    function updateInfoApi(data) {
        return doRequest({
            url: '/v1/passport/user/update_info',
            method: 'POST',
            data: data,
        });
    }
    function reportLocationUpdata(data) {
        return doRequest({
            url: '/v1/social/lbs/update',
            method: 'POST',
            data: data,
        });
    }
    function deleteReportLocation(data) {
        return doRequest({
            url: '/v1/social/lbs/delete',
            method: 'POST',
            data: data,
        });
    }
    function getNearlyPeasonByRadius(data) {
        return doRequest({
            url: '/v1/social/lbs/radius',
            method: 'POST',
            data: data,
        });
    }
    /**
    export function getOpenID(data: any) {
      return request({
          url: '/Social/User/GetOpenID',
          method: 'POST',
          data,
      })
    }
     */
    //上报大数据
    var trackApi = function (data) {
        return doRequest({
            method: 'POST',
            url: '/v1/data/api/track',
            data: data,
        });
    };
    var getInfoApi = function () {
        return doRequest({
            method: 'POST',
            url: '/v1/passport/user/get_info',
        });
    };
    var getUserInfoByFieldApi = function (data) {
        if (data === void 0) { data = {}; }
        return doRequest({
            method: 'POST',
            url: '/v1/passport/user/info_by_field',
            data: data,
        });
    };
    var activated = function (data) {
        return doRequest({
            method: 'POST',
            url: '/v1/attribution/user/activated',
            data: data
        });
    };
    // 获取商业化弹窗信息
    var getBusinessRules = function (version) {
        return doRequest({
            url: '/v1/business/rule',
            method: 'GET',
            params: {
                version: version
            }
        });
    };
    // 商业化下单
    var businessOrderApi = function (data) {
        return doRequest({
            method: 'POST',
            url: '/v1/business/p',
            data: data
        });
    };
    //新版通用版本检查 v2
    var updateGameVersionApi = function (data) {
        return doRequest({
            url: "/v1/vcapi/update_module_version",
            method: 'POST',
            data: data,
        });
    };
    //产品包版本检查
    var checkVersionGameLobbyByGet = function (data) {
        return doRequest({
            url: "/v1/vcapi/update/".concat(data.productid, "/").concat(data.channelid, "/").concat(data.clientversion, "/").concat(data.devicecode, "/").concat(data.region),
            method: 'GET',
            params: {
                type: data.type,
                format: data.format
            },
        });
    };
    //产品包版本检查
    var checkVersionGameLobbyByPost = function (data) {
        return doRequest({
            url: "/v1/vcapi/update/".concat(data.productid, "/").concat(data.channelid, "/").concat(data.clientversion, "/").concat(data.devicecode, "/").concat(data.region, "?type=").concat(data.type || '', "&format=").concat(data.format || ''),
            method: 'POST',
            data: {
                games: data.games,
                activities: data.activities
            },
        });
    };
    //游戏版本检查
    var checkGameVersion = function (data) {
        return doRequest({
            url: "/v1/vcapi/update_game/".concat(data.gameid, "/").concat(data.gameversion, "/").concat(data.gamecheckversion),
            method: 'GET',
            data: {
                type: data.type,
                format: data.format
            },
        });
    };
    //活动版本检查
    var checkActivityVersion = function (data) {
        return doRequest({
            url: "/v1/vcapi/update_activity/".concat(data.activityshortname, "/").concat(data.activityversion, "/").concat(data.activitycheckversion),
            method: 'GET',
            data: {
                type: data.type,
                format: data.format
            },
        });
    };
    //分享/广告结果上报
    var schedulingReportApi = function (data) {
        return doRequest({
            url: '/v1/operationapi/scheduling_report',
            method: 'POST',
            data: data
        });
    };
    //分享调度初始化
    var schedulingInitApi = function (data) {
        return doRequest({
            url: '/v1/operationapi/scheduling/init',
            method: 'POST',
            data: data
        });
    };
    // 获取公共属性
    var getInitConf = function (data) {
        return doRequest({
            url: '/v1/sdkconfig/init',
            method: 'POST',
            data: data
        });
    };
    // 获取服务器时间（用于刷新 st_offset）
    var getServerTime = function (data) {
        return doRequest({
            url: '/v1/sdkconfig/detection',
            method: 'POST',
            data: data || {}
        });
    };
    // 获取公共属性
    var getPublicProps = function (version) {
        return doRequest({
            url: '/v1/sdkconfig/sync/event_attrs',
            method: 'GET',
            params: {
                version: version
            }
        });
    };
    // 设置接跳转url并获取短链接
    function getShortUrlApi(data) {
        return doRequest({
            url: '/v1/url/short',
            method: 'POST',
            data: data
        });
    }
    // 查询其他瑞雪用户信息
    function _getInfoApi() {
        return doRequest({
            url: '/v1/passport/user/get_info',
            method: 'post',
            data: {},
        });
    }
    var getTempNoticeApi = function (product_id, channel_id) {
        return doRequest({
            url: "/v1/vcapi/maintain/".concat(product_id, "/").concat(channel_id),
            method: 'GET'
        });
    };
    var getH5LoginConfigApi = function (product_id, channel_id) {
        return doRequest({
            url: "/v1/vcapi/h5_login_config/".concat(product_id, "/").concat(channel_id),
            method: 'GET'
        });
    };
    var tradeQueryApi = function (order_no) {
        return doRequest({
            url: "/v1/ke/sdk/trade_query",
            method: 'GET',
            params: {
                order_no: order_no
            }
        });
    };

    var sendCaptchaParamsCheck = {
        email: {
            type: 'email',
        },
        phone: {
            asyncValidator: function (rule, value) {
                return new Promise(function (resolve, reject) {
                    if (/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(value + '')) {
                        resolve();
                    }
                    else {
                        reject('phone params is not invalid');
                    }
                });
            },
        },
        purpose: {
            type: 'enum',
            enum: [
                'register',
                'bindphone',
                'unbindphone',
                'resetpwd',
                'bindemail',
                'unbindemail',
                'login',
                'setpwd',
            ],
        },
    };
    var bindPhoneParamsCheck = {
        phone: {
            type: 'string',
            required: true,
        },
        captcha_code: {
            type: 'string',
            required: true,
        },
        // password: {
        //   type: 'string',
        //   required: true,
        // },
    };
    var changePhoneParamsCheck = {
        oldphone_captcha: {
            type: 'string',
            required: true,
        },
        newphone: {
            asyncValidator: function (rule, value) {
                return new Promise(function (resolve, reject) {
                    if (/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(value + '')) {
                        resolve();
                    }
                    else {
                        reject('phone params is not invalid');
                    }
                });
            },
        },
        newphone_captcha: {
            type: 'string',
            required: true,
        },
    };
    var verifyCodeParamsCheck = {
        captcha_code: {
            type: 'string',
            required: true,
        }
    };
    var unBindPhoneParamsCheck = {
        phone: {
            type: 'string',
            required: true,
        },
        captcha_code: {
            type: 'string',
            required: true,
        },
    };
    var bindEmailParamsCheck = {
        email: {
            type: 'string',
            required: true,
        },
        captcha_code: {
            type: 'string',
            required: true,
        },
        password: {
            type: 'string',
            required: true,
        },
    };
    var unbindemailParamsCheck = {
        email: {
            type: 'string',
            required: true,
        },
        captcha_code: {
            type: 'string',
            required: true,
        },
    };

    var toString = Object.prototype.toString;
    function is(val, type) {
        return toString.call(val) === "[object ".concat(type, "]");
    }
    function isString(val) {
        return is(val, 'String');
    }
    function isFunction$1(val) {
        return typeof val === 'function';
    }
    function isObject$1(val) {
        return val !== null && is(val, 'Object');
    }
    function isArray(val) {
        return val && Array.isArray(val);
    }
    /**
     * Checks if `value` is `null` or `undefined`.
     */
    function isNil(val) {
        return val == null;
    }
    function isEmpty(val) {
        if (val == null) {
            return true;
        }
        if (isArray(val) || isString(val)) {
            return val.length === 0;
        }
        if (val instanceof Map || val instanceof Set) {
            return val.size === 0;
        }
        if (isObject$1(val)) {
            return Object.keys(val).length === 0;
        }
        return false;
    }
    /**
     * Array
     */
    /**
     * Creates an array with all falsey values removed. The values `false`, `null`,
     * `0`, `""`, `undefined`, and `NaN` are falsey.
     *
     * compact([0, 1, false, 2, '', 3])
     * // => [1, 2, 3]
     */
    function compact(val) {
        if (!val)
            return [];
        return val.filter(function (item) { return item; });
    }
    /**
     * Object
     */
    function pick(obj) {
        var props = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            props[_i - 1] = arguments[_i];
        }
        var flattenProps = props.flat();
        return obj == null
            ? {}
            : flattenProps.reduce(function (iter, prop) { return (prop in obj && (iter[prop] = obj[prop]), iter); }, {});
    }
    function omit(obj) {
        var props = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            props[_i - 1] = arguments[_i];
        }
        // console.log('omit: ', obj, props.flat())
        var flattenProps = props.flat();
        var result = {};
        if (obj == null)
            return result;
        for (var key in obj) {
            if (!flattenProps.includes(key)) {
                result[key] = obj[key];
            }
        }
        return result;
    }

    function TypeOfValue(value) {
        var type = Object.prototype.toString.call(value);
        return type.substring(8, type.length - 1).toLowerCase();
    }
    // export const PubCallBack = {
    //   complete: {
    //     require: true,
    //     asyncValidator: (rule: InternalRuleItem, value: any): Promise<any> => {
    //       return new Promise((resolve, reject) => {
    //         if (isFunction(value)) {
    //           resolve(1)
    //         } else {
    //           reject(`callback complete property must be function type but got ${TypeOfValue(value)}`)
    //         }
    //       })
    //     },
    //   },
    // }
    var initParamsCheck = {
        productId: {
            type: 'string',
            required: true,
        },
        channelId: {
            type: 'string',
            required: true,
        },
        cpid: {
            type: 'string',
            required: true,
        },
        baseUrlList: {
            validator: function (_, value) {
                if (isArray(value)) {
                    if (value.length == 0) {
                        return new Error("baseUrlList params can not an empty Array");
                    }
                    else if (value.length > 2) {
                        return new Error("baseUrlList params maxLength is 2");
                    }
                    else {
                        return true;
                    }
                }
                else {
                    return new Error("baseUrlList params Expecting string[],but got ".concat(TypeOfValue(value)));
                }
            },
        },
        complete: {
            required: true,
            validator: function (_, value) {
                if (isFunction$1(value)) {
                    return true;
                }
                else {
                    return new Error("callback complete property must be function type but got ".concat(TypeOfValue(value)));
                }
            },
        }
    };
    var checkTrackParams = {
        event: {
            type: 'string',
            required: true
        },
        properties: {
            type: 'object'
        }
    };
    var checkAppVersionParams = {
        clientversion: {
            type: 'string',
            required: true,
        },
        devicecode: {
            type: 'string',
            required: true,
        },
        region: {
            type: 'number',
        },
        type: {
            type: 'enum',
            enum: ['js', 'lua', 'u3d'],
        },
        format: {
            type: 'enum',
            enum: ['json', 'lua'],
        },
        games: {
            type: 'object',
        },
        activities: {
            type: 'object',
        },
    };
    var checkGameVersionParams = {
        gameid: {
            type: 'number',
            required: true,
        },
        gameversion: {
            type: 'number',
            required: true,
        },
        gamecheckversion: {
            type: 'number',
        },
        type: {
            type: 'enum',
            enum: ['js', 'lua', 'u3d'],
        },
        format: {
            type: 'enum',
            enum: ['json', 'lua'],
        },
    };
    var checkActivityVersionParams = {
        activityshortname: {
            type: 'string',
            required: true,
        },
        activityversion: {
            type: 'number',
            required: true,
        },
        activitycheckversion: {
            type: 'number',
        },
        type: {
            type: 'enum',
            enum: ['js', 'lua', 'u3d'],
        },
        format: {
            type: 'enum',
            enum: ['json', 'lua'],
        },
    };
    var checkIReqBusinessData = {
        window_key: {
            type: 'string',
            required: true,
        },
        event: {
            type: 'string',
            required: true,
        },
        before_event: {
            type: 'string',
        }
    };
    var checkIReqBusinessOrder = {
        trade_no: {
            type: 'string',
            required: true,
        },
        sign: {
            type: 'string',
            required: true,
        },
    };
    var shareScheduleReportParams = {
        func: {
            type: 'string',
            required: true,
        },
        scheduling_type: {
            type: 'enum',
            enum: ['share', 'ad'],
            required: true,
        },
        scheduling_event: {
            type: 'boolean',
            required: true,
        },
        // scheduling_strategy_id: {
        //   type: 'string',
        //   required: true,
        // },
        properties: {
            type: 'object',
        }
    };
    var shareScheduleInitParams = {
        funcs: {
            type: 'array',
        },
    };

    var formatRegExp = /%[sdj%]/g;
    function format(template) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var i = 0;
        if (typeof template === 'function') {
            return template.apply(null, args);
        }
        if (typeof template === 'string') {
            var str = template.replace(formatRegExp, function (x) {
                switch (x) {
                    case '%s':
                        return String(args[i++]);
                    default:
                        return x;
                }
            });
            return str;
        }
        return template;
    }
    var AsyncValidationError = /** @class */ (function (_super) {
        __extends(AsyncValidationError, _super);
        // fields: Record<string, ValidateError[]>
        function AsyncValidationError(errors) {
            var _this = _super.call(this, 'Async Validation Error') || this;
            _this.errors = errors;
            return _this;
            // this.fields = fields
        }
        return AsyncValidationError;
    }(Error));
    function isNativeStringType(type) {
        return type === 'string' || type === 'email';
    }
    function isEmptyValue(val, type) {
        if (val == null) {
            return true;
        }
        if (type === 'array' && Array.isArray(val) && !val.length) {
            return true;
        }
        if (type && isNativeStringType(type) && typeof val === 'string' && !val) {
            return true;
        }
        return false;
    }

    function newMessages() {
        return {
            required: '%s is required',
            enum: '%s must be one of %s',
            types: {
                string: '%s is not a %s',
                method: '%s is not a %s (function)',
                array: '%s is not an %s',
                object: '%s is not an %s',
                number: '%s is not a %s',
                date: '%s is not a %s',
                boolean: '%s is not a %s',
                integer: '%s is not an %s',
                float: '%s is not a %s',
                regexp: '%s is not a valid %s',
                email: '%s is not a valid %s',
                url: '%s is not a valid %s',
                hex: '%s is not a valid %s',
            },
            string: {
                len: '%s must be exactly %s characters',
                min: '%s must be at least %s characters',
                max: '%s cannot be longer than %s characters',
                range: '%s must be between %s and %s characters',
            },
        };
    }
    var messages = newMessages();

    var required$1 = function (rule, value, source, errors, type) {
        if (rule.required &&
            (!source.hasOwnProperty(rule === null || rule === void 0 ? void 0 : rule.field) ||
                isEmptyValue(value, type || rule.type))) {
            errors.push(format(messages.required, rule === null || rule === void 0 ? void 0 : rule.field));
        }
    };

    var ENUM$1 = 'enum';
    var enumerable$1 = function (rule, value, source, errors) {
        var _a, _b;
        rule[ENUM$1] = Array.isArray(rule[ENUM$1]) ? rule[ENUM$1] : [];
        if (((_a = rule[ENUM$1]) === null || _a === void 0 ? void 0 : _a.indexOf(value)) === -1) {
            errors.push(format(messages[ENUM$1], rule === null || rule === void 0 ? void 0 : rule.field, (_b = rule[ENUM$1]) === null || _b === void 0 ? void 0 : _b.join(', ')));
        }
    };

    var pattern = {
        // http://emailregex.com/
        email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+\.)+[a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}))$/,
    };
    var types = {
        array: function (value) {
            return Array.isArray(value);
        },
        number: function (value) {
            if (isNaN(value)) {
                return false;
            }
            return typeof value === 'number';
        },
        object: function (value) {
            return typeof value === 'object' && !types.array(value);
        },
        method: function (value) {
            return typeof value === 'function';
        },
        email: function (value) {
            return (typeof value === 'string' &&
                value.length <= 320 &&
                !!value.match(pattern.email));
        },
    };
    var type$1 = function (rule, value, source, errors) {
        if (rule.required && value === undefined) {
            required$1(rule, value, source, errors);
            return;
        }
        var custom = [
            'array',
            'object',
            'method',
            'email',
            'number',
        ];
        var ruleType = rule.type;
        if (custom.indexOf(ruleType) > -1) {
            if (!types[ruleType](value)) {
                errors.push(format(messages.types[ruleType], rule.field, rule.type));
            }
            // straight typeof check
        }
        else if (ruleType && typeof value !== rule.type) {
            errors.push(format(messages.types[ruleType], rule.field, rule.type));
        }
    };

    var rules = {
        required: required$1,
        type: type$1,
        enum: enumerable$1,
    };

    var string = function (rule, value, source) {
        // console.log('string rule: ', rule)
        var errors = [];
        var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
        if (validate) {
            // 值为空字符串 并且 不是必填 直接返回
            if (isEmptyValue(value, 'string') && !rule.required) {
                return true;
            }
            // 是必填 检验required
            rules.required(rule, value, source, errors, 'string');
            // 不是必填，但是值不为空，校验类型
            if (!isEmptyValue(value, 'string')) {
                rules.type(rule, value, source, errors);
            }
        }
        return errors;
    };

    var number = function (rule, value, source) {
        // console.log('number rule: ', rule)
        var errors = [];
        var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
        if (validate) {
            if (value === '') {
                value = undefined;
            }
            // 值为空 并且 不是必填 直接返回
            if (isEmptyValue(value) && !rule.required) {
                return true;
            }
            // 是必填 检验required
            rules.required(rule, value, source, errors);
            // 不是必填，但是值不为空，校验类型
            if (value !== undefined) {
                rules.type(rule, value, source, errors);
            }
        }
        return errors;
    };

    var boolean = function (rule, value, source) {
        // console.log('boolean rule: ', rule)
        var errors = [];
        var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
        if (validate) {
            // 值为空 并且 不是必填 直接返回
            if (isEmptyValue(value) && !rule.required) {
                return true;
            }
            // 是必填 检验required
            rules.required(rule, value, source, errors);
            // 不是必填，但是值不为空，校验类型
            if (value !== undefined) {
                rules.type(rule, value, source, errors);
            }
        }
        return errors;
    };

    var array = function (rule, value, source) {
        var errors = [];
        var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
        if (validate) {
            // 值为null/undefined 并且 不是必填 直接返回
            if ((value === undefined || value === null) && !rule.required) {
                return true;
            }
            // 是必填 检验required
            rules.required(rule, value, source, errors, 'array');
            // 不是必填，但是值不为空，校验类型
            if (value !== undefined && value !== null) {
                rules.type(rule, value, source, errors);
            }
        }
        // console.log('string: ', errors)
        return errors;
    };

    var object = function (rule, value, source) {
        // console.log('object rule: ', isEmptyValue(value))
        var errors = [];
        var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
        if (validate) {
            // 值为空 并且 不是必填 直接返回
            if (isEmptyValue(value) && !rule.required) {
                return true;
            }
            // 是必填 检验required
            rules.required(rule, value, source, errors);
            // 不是必填，但是值不为空，校验类型
            if (value !== undefined) {
                rules.type(rule, value, source, errors);
            }
        }
        return errors;
    };

    var ENUM = 'enum';
    var enumerable = function (rule, value, source) {
        // console.log('enum rule: ', rule)
        var errors = [];
        var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
        if (validate) {
            // 值为空 并且 不是必填 直接返回
            if (isEmptyValue(value) && !rule.required) {
                return true;
            }
            // 是必填 检验required
            rules.required(rule, value, source, errors);
            // 不是必填，但是值不为空，校验类型
            if (value !== undefined) {
                rules[ENUM](rule, value, source, errors);
            }
        }
        return errors;
    };

    var type = function (rule, value, source) {
        var ruleType = rule.type;
        var errors = [];
        var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
        if (validate) {
            if (isEmptyValue(value, ruleType) && !rule.required) {
                return true;
            }
            rules.required(rule, value, source, errors, ruleType);
            if (!isEmptyValue(value, ruleType)) {
                rules.type(rule, value, source, errors);
            }
        }
        return errors;
    };

    var required = function (rule, value, source) {
        var errors = [];
        var type = Array.isArray(value) ? 'array' : typeof value;
        rules.required(rule, value, source, errors, type);
        return errors;
    };

    var validators = {
        string: string,
        number: number,
        boolean: boolean,
        array: array,
        object: object,
        enum: enumerable,
        email: type,
        required: required,
    };

    var Schema = /** @class */ (function () {
        function Schema(descriptor) {
            this.rules = {};
            this.define(descriptor);
        }
        Schema.prototype.define = function (rules) {
            if (!rules) {
                throw new Error('Cannot configure a schema with no rules');
            }
            if (typeof rules !== 'object' || Array.isArray(rules)) {
                throw new Error('Rules must be an object');
            }
            this.rules = rules;
        };
        Schema.prototype.validate = function (source) {
            var _this = this;
            if (!this.rules || Object.keys(this.rules).length === 0) {
                return Promise.resolve(source);
            }
            var series = {};
            var keys = Object.keys(this.rules);
            var total = 0;
            var length = keys.length;
            var results = [];
            keys.forEach(function (z) {
                var rule = _this.rules[z];
                var value = source[z];
                rule = __assign({}, rule);
                rule.validator = _this.getValidationMethod(rule);
                if (!rule.validator) {
                    return;
                }
                rule.field = z;
                rule.type = _this.getType(rule);
                series[z] = __assign(__assign({}, series[z]), { rule: rule, value: value, source: source, field: z });
            });
            // console.log('series: ', series)
            return new Promise(function (resolve, reject) {
                keys.forEach(function (key) {
                    var _a;
                    var res;
                    var data = series[key];
                    var rule = data.rule;
                    function cb(e) {
                        if (e === void 0) { e = []; }
                        total++;
                        var errorList = Array.isArray(e) ? e : [e];
                        // console.log('cb:', total, data, errorList)
                        results = results.concat(errorList.map(function (error) {
                            return {
                                message: error,
                                field: data.field,
                                fieldValue: data.value,
                            };
                        }));
                        if (total === length) {
                            console.log('validate finished: ', results, source);
                            return results.length ? reject(new AsyncValidationError(results)) : resolve(source);
                        }
                    }
                    if (rule.asyncValidator) {
                        res = rule.asyncValidator(rule, data.value, data.source);
                    }
                    else if (rule.validator) {
                        try {
                            res = rule.validator(rule, data.value, data.source);
                        }
                        catch (error) {
                            (_a = console.error) === null || _a === void 0 ? void 0 : _a.call(console, 'validator error:', error);
                            throw error;
                        }
                        if (res === true) {
                            cb();
                        }
                        else if (res === false) {
                            cb("".concat(rule.field, " fails"));
                        }
                        else if (res instanceof Array) {
                            cb(res);
                        }
                        else if (res instanceof Error) {
                            cb(res.message);
                        }
                    }
                    if (res && res.then) {
                        res.then(function () { return cb(); }, function (e) { return cb(e); });
                    }
                });
            });
        };
        Schema.prototype.getType = function (rule) {
            if (typeof rule.validator !== 'function' &&
                rule.type &&
                !validators.hasOwnProperty(rule.type)) {
                throw new Error("Unknown rule type ".concat(rule.type));
            }
            return rule.type || 'string';
        };
        Schema.prototype.getValidationMethod = function (rule) {
            if (typeof rule.validator === 'function') {
                return rule.validator;
            }
            var keys = Object.keys(rule);
            if (keys.length === 1 && keys[0] === 'required') {
                return validators.required;
            }
            // @ts-ignore
            return validators[this.getType(rule)] || undefined;
        };
        Schema.validators = validators;
        return Schema;
    }());

    // use for check params is valid
    function checkParamsValid(rules, checkValue) {
        var checkSchema = new Schema(rules);
        return checkSchema.validate(checkValue);
    }
    function invalidInitParams(params, rules) {
        var entries = Object.entries(rules);
        var _loop_1 = function (key, rule) {
            if (isArray(rule)) {
                rule.forEach(function (ruleItem) { return checkRule(ruleItem, params[key], key); });
            }
            else {
                checkRule(rule, params[key], key);
            }
        };
        for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
            var _a = entries_1[_i], key = _a[0], rule = _a[1];
            _loop_1(key, rule);
        }
        /**
         * 查找规则中的字段
         * 如果字段是必传的，看parmas中是否传, 传了校验类型是否正确, 校验是否有validaror，有执行
         * 如果不是必传的，看params中传的类型是否正确, 校验是否有validaror，有执行
         */
        function checkRule(rule, value, key) {
            if (rule === null || rule === void 0 ? void 0 : rule.required) {
                if (isNil(value)) {
                    throw Error("".concat(key, " is required"));
                }
            }
            if ((rule === null || rule === void 0 ? void 0 : rule.type) && typeof value !== (rule === null || rule === void 0 ? void 0 : rule.type))
                throw Error("".concat(key, " is not a ").concat(rule.type));
            if (rule === null || rule === void 0 ? void 0 : rule.validator) {
                // const res = rule.validator(rule, value, () => {}, {}, {})
                var res = rule.validator(rule, value, {});
                if (res === true)
                    return;
                throw res;
            }
        }
    }
    function ThrowError(errors, isJoin) {
        var str = '';
        if (isArray(errors)) {
            errors.forEach(function (o) {
                if (isJoin) {
                    str += "".concat(o.message, "; \n");
                }
                else {
                    console.error(o.message);
                }
            });
        }
        console.log(str);
        if (isJoin) {
            return str;
        }
    }
    function pubCheck(paramsCheck, callback, params) {
        // console.log('pubCheck rules: ', paramsCheck)
        return new Promise(function (resolve, reject) {
            if (!isObject$1(callback) || !callback.hasOwnProperty('complete')) {
                console.error('callback must be Object and had complete property');
                // reject()
                return;
            }
            if (!isFunction$1(callback.complete)) {
                console.error("callback complete property must be function type but got ".concat(TypeOfValue(callback.complete)));
                return;
            }
            checkParamsValid(paramsCheck, params)
                .then(function () {
                console.log('sdk 参数检查通过');
                //passed check
                resolve(1);
            })
                .catch(function (_a) {
                var errors = _a.errors;
                console.error('sdk 参数检查报错：', errors);
                //params is invalid callback to cp
                callback === null || callback === void 0 ? void 0 : callback.complete({
                    code: COMMON_ERROR_CODE.PARAMS_ERROR,
                    data: null,
                    errorMsg: ThrowError(errors, true),
                });
            });
        });
    }

    var getFeedbackApi = function () {
        return doRequest({
            url: '/v1/feedbackapi/kind/list',
            method: 'GET',
        });
    };
    var createFeedbackApi = function (data) {
        return doRequest({
            url: '/v1/feedbackapi/player/create',
            method: 'POST',
            data: data,
        });
    };
    var feedbackEvalApi = function (data) {
        return doRequest({
            url: '/v1/feedbackapi/pleased/update',
            method: 'POST',
            data: data
        });
    };

    // 意见反馈
    var SdkFeedback = /** @class */ (function () {
        function SdkFeedback() {
        }
        Object.defineProperty(SdkFeedback, "I", {
            get: function () {
                return this.instance || (this.instance = new SdkFeedback());
            },
            enumerable: false,
            configurable: true
        });
        SdkFeedback.prototype.getFeedbackKindList = function (_a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var result, err_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, getFeedbackApi()];
                        case 1:
                            result = _b.sent();
                            complete(result);
                            return [3 /*break*/, 3];
                        case 2:
                            err_1 = _b.sent();
                            complete(handleError(err_1));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SdkFeedback.prototype.createFeedback = function (params, _a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var result, err_2;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, createFeedbackApi(__assign(__assign({}, params), { product_id: SYSTEM_INFO$1.productId, channel_id: SYSTEM_INFO$1.channelId }))];
                        case 1:
                            result = _b.sent();
                            complete(result);
                            return [3 /*break*/, 3];
                        case 2:
                            err_2 = _b.sent();
                            complete(handleError(err_2));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SdkFeedback.prototype.satisfactionEvaluation = function (params, _a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var result, err_3;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, feedbackEvalApi(params)];
                        case 1:
                            result = _b.sent();
                            complete(result);
                            return [3 /*break*/, 3];
                        case 2:
                            err_3 = _b.sent();
                            complete(handleError(err_3));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return SdkFeedback;
    }());

    var SdkCommon = /** @class */ (function () {
        function SdkCommon(initParams) {
            // request.defaults.baseURL = initParams.baseUrlList[0]
            // axios.defaults.baseURL = initParams?.baseUrlList?.[0]
            // axios.defaults.timeout = 5000
        }
        Object.defineProperty(SdkCommon, "feedback", {
            // 意见反馈
            get: function () {
                return SdkFeedback.I;
            },
            enumerable: false,
            configurable: true
        });
        //发送验证码
        SdkCommon.prototype.sendCaptcha = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var loginResult, _params, result, result, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 8, , 9]);
                            if (!(params.purpose != 'unbindphone')) return [3 /*break*/, 2];
                            return [4 /*yield*/, pubCheck(sendCaptchaParamsCheck, callback, params)];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            if (!params.auth) return [3 /*break*/, 5];
                            return [4 /*yield*/, asyncFunc(wx.login)];
                        case 3:
                            loginResult = _a.sent();
                            params.auth, _params = __rest(params, ["auth"]);
                            return [4 /*yield*/, sendCaptchaWithCode(__assign(__assign({}, _params), { minigame_code: loginResult.code }))];
                        case 4:
                            result = _a.sent();
                            callback.complete(result);
                            return [3 /*break*/, 7];
                        case 5: return [4 /*yield*/, sendCaptcha(params)];
                        case 6:
                            result = _a.sent();
                            callback.complete(result);
                            _a.label = 7;
                        case 7: return [3 /*break*/, 9];
                        case 8:
                            error_1 = _a.sent();
                            callback.complete(handleError(error_1));
                            return [3 /*break*/, 9];
                        case 9: return [2 /*return*/];
                    }
                });
            });
        };
        //绑定手机
        SdkCommon.prototype.bindPhone = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, pubCheck(bindPhoneParamsCheck, callback, params)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, bindPhone(params)];
                        case 2:
                            result = _a.sent();
                            callback.complete(result);
                            return [3 /*break*/, 4];
                        case 3:
                            error_2 = _a.sent();
                            callback.complete(handleError(error_2));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        SdkCommon.prototype.validateUnbindCode = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, pubCheck(verifyCodeParamsCheck, callback, params)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, validateUnbindCodeApi(params)];
                        case 2:
                            result = _a.sent();
                            callback.complete(result);
                            return [3 /*break*/, 4];
                        case 3:
                            error_3 = _a.sent();
                            callback.complete(handleError(error_3));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        SdkCommon.prototype.changePhone = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, pubCheck(changePhoneParamsCheck, callback, params)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, changePhone(params)];
                        case 2:
                            result = _a.sent();
                            callback.complete(result);
                            return [3 /*break*/, 4];
                        case 3:
                            error_4 = _a.sent();
                            callback.complete(handleError(error_4));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        //解绑手机
        SdkCommon.prototype.unBindPhone = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, pubCheck(unBindPhoneParamsCheck, callback, params)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, unBindPhone(params)];
                        case 2:
                            result = _a.sent();
                            callback.complete(result);
                            return [3 /*break*/, 4];
                        case 3:
                            error_5 = _a.sent();
                            callback.complete(handleError(error_5));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        //绑定邮箱
        SdkCommon.prototype.bindEmail = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var data, error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, pubCheck(bindEmailParamsCheck, callback, params)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, bindEmail(params)];
                        case 2:
                            data = _a.sent();
                            callback.complete(data);
                            return [3 /*break*/, 4];
                        case 3:
                            error_6 = _a.sent();
                            callback.complete(handleError(error_6));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        //解绑邮箱
        SdkCommon.prototype.UnbindEmail = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var data, error_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, pubCheck(unbindemailParamsCheck, callback, params)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, UnbindEmail(params)];
                        case 2:
                            data = _a.sent();
                            callback.complete(data);
                            return [3 /*break*/, 4];
                        case 3:
                            error_7 = _a.sent();
                            callback.complete(handleError(error_7));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        //注销账号
        SdkCommon.prototype.deregister = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_8;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, deregister(params)];
                        case 1:
                            result = _a.sent();
                            callback.complete(result);
                            return [3 /*break*/, 3];
                        case 2:
                            error_8 = _a.sent();
                            callback.complete(handleError(error_8));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        //撤销账号注销申请
        SdkCommon.prototype.deregisterCancel = function (CPcallback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_9;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, deregisterCancel()];
                        case 1:
                            result = _a.sent();
                            CPcallback.complete(result);
                            return [3 /*break*/, 3];
                        case 2:
                            error_9 = _a.sent();
                            CPcallback.complete(handleError(error_9));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        //获得用户信息
        SdkCommon.prototype.getInfo = function (CPcallback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_10;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, getInfoApi()];
                        case 1:
                            result = _a.sent();
                            CPcallback.complete(result);
                            return [3 /*break*/, 3];
                        case 2:
                            error_10 = _a.sent();
                            CPcallback.complete(handleError(error_10));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // 获取指定用户信息
        SdkCommon.prototype.getUserInfoByField = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_11;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, getUserInfoByFieldApi(params)];
                        case 1:
                            result = _a.sent();
                            callback.complete(result);
                            return [3 /*break*/, 3];
                        case 2:
                            error_11 = _a.sent();
                            callback.complete(handleError(error_11));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        //修改瑞雪通行证用户信息。
        SdkCommon.prototype.updateInfo = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_12;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, updateInfoApi(params)];
                        case 1:
                            result = _a.sent();
                            callback.complete(result);
                            return [3 /*break*/, 3];
                        case 2:
                            error_12 = _a.sent();
                            callback.complete(handleError(error_12));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // 游戏大厅版本检查-get
        SdkCommon.prototype.checkAppVersion = function (params, callback) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function () {
                var req, result, data, region_tag, error_13;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, pubCheck(checkAppVersionParams, callback, params)];
                        case 1:
                            _c.sent();
                            req = __assign(__assign({}, params), { productid: SYSTEM_INFO$1.productId, channelid: SYSTEM_INFO$1.channelId, type: (params === null || params === void 0 ? void 0 : params.type) || 'js', format: (params === null || params === void 0 ? void 0 : params.format) || 'json', region: (params === null || params === void 0 ? void 0 : params.region) || 0 });
                            return [4 /*yield*/, checkVersionGameLobbyByGet(req)];
                        case 2:
                            result = _c.sent();
                            try {
                                if (result.code === 0) {
                                    data = JSON.parse(result.data);
                                    region_tag = (_b = (_a = data.login_config) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.region_tag;
                                    if (region_tag) {
                                        SYSTEM_INFO$1.region_tag = region_tag;
                                    }
                                }
                            }
                            catch (e) {
                            }
                            callback.complete(result);
                            return [3 /*break*/, 4];
                        case 3:
                            error_13 = _c.sent();
                            callback.complete(handleError(error_13));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // 游戏大厅版本检查-post
        SdkCommon.prototype.checkVersion = function (params, callback) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function () {
                var req, result, data, region_tag, error_14;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, pubCheck(checkAppVersionParams, callback, params)];
                        case 1:
                            _c.sent();
                            req = __assign(__assign({}, params), { productid: SYSTEM_INFO$1.productId, channelid: SYSTEM_INFO$1.channelId, type: (params === null || params === void 0 ? void 0 : params.type) || 'js', format: (params === null || params === void 0 ? void 0 : params.format) || 'json', region: (params === null || params === void 0 ? void 0 : params.region) || 0 });
                            return [4 /*yield*/, checkVersionGameLobbyByPost(req)];
                        case 2:
                            result = _c.sent();
                            try {
                                if (result.code === 0) {
                                    data = JSON.parse(result.data);
                                    region_tag = (_b = (_a = data.login_config) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.region_tag;
                                    if (region_tag) {
                                        SYSTEM_INFO$1.region_tag = region_tag;
                                    }
                                }
                            }
                            catch (e) {
                            }
                            callback.complete(result);
                            return [3 /*break*/, 4];
                        case 3:
                            error_14 = _c.sent();
                            callback.complete(handleError(error_14));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // 新版通用版本检查 v2
        SdkCommon.prototype.updateGameVersion = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_15;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, updateGameVersionApi(params)];
                        case 1:
                            result = _a.sent();
                            callback.complete(result);
                            return [3 /*break*/, 3];
                        case 2:
                            error_15 = _a.sent();
                            callback.complete(handleError(error_15));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // 游戏版本检查
        SdkCommon.prototype.checkGameVersion = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var req, result, error_16;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, pubCheck(checkGameVersionParams, callback, params)];
                        case 1:
                            _a.sent();
                            req = __assign(__assign({}, params), { gamecheckversion: (params === null || params === void 0 ? void 0 : params.gamecheckversion) || 0, type: (params === null || params === void 0 ? void 0 : params.type) || 'lua', format: (params === null || params === void 0 ? void 0 : params.format) || 'lua' });
                            return [4 /*yield*/, checkGameVersion(req)];
                        case 2:
                            result = _a.sent();
                            callback.complete(result);
                            return [3 /*break*/, 4];
                        case 3:
                            error_16 = _a.sent();
                            callback.complete(handleError(error_16));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // 活动版本检查
        SdkCommon.prototype.checkActivityVersion = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var req, result, error_17;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, pubCheck(checkActivityVersionParams, callback, params)];
                        case 1:
                            _a.sent();
                            req = __assign(__assign({}, params), { activitycheckversion: (params === null || params === void 0 ? void 0 : params.activitycheckversion) || 0, type: (params === null || params === void 0 ? void 0 : params.type) || 'lua', format: (params === null || params === void 0 ? void 0 : params.format) || 'lua' });
                            return [4 /*yield*/, checkActivityVersion(req)];
                        case 2:
                            result = _a.sent();
                            callback.complete(result);
                            return [3 /*break*/, 4];
                        case 3:
                            error_17 = _a.sent();
                            callback.complete(handleError(error_17));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        SdkCommon.prototype.getFeedbackKindList = function (callback) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, SdkCommon.feedback.getFeedbackKindList(callback)];
                });
            });
        };
        SdkCommon.prototype.createFeedback = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, SdkCommon.feedback.createFeedback(params, callback)];
                });
            });
        };
        SdkCommon.prototype.satisfactionEvaluation = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, SdkCommon.feedback.satisfactionEvaluation(params, callback)];
                });
            });
        };
        SdkCommon.prototype.getShortUrl = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_18;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, getShortUrlApi(params)];
                        case 1:
                            result = _a.sent();
                            callback.complete(result);
                            return [3 /*break*/, 3];
                        case 2:
                            error_18 = _a.sent();
                            callback.complete(handleError(error_18));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SdkCommon.prototype._getInfo = function (callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_19;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, _getInfoApi()];
                        case 1:
                            result = _a.sent();
                            callback.complete(result);
                            return [3 /*break*/, 3];
                        case 2:
                            error_19 = _a.sent();
                            callback.complete(handleError(error_19));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SdkCommon.prototype.getTempNotice = function (callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_20;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, getTempNoticeApi(SYSTEM_INFO$1.productId, SYSTEM_INFO$1.channelId)];
                        case 1:
                            result = _a.sent();
                            callback.complete(result);
                            return [3 /*break*/, 3];
                        case 2:
                            error_20 = _a.sent();
                            callback.complete(handleError(error_20));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SdkCommon.prototype.getH5LoginConfig = function (callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_21;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, getH5LoginConfigApi(SYSTEM_INFO$1.productId, SYSTEM_INFO$1.channelId)];
                        case 1:
                            result = _a.sent();
                            callback.complete(result);
                            return [3 /*break*/, 3];
                        case 2:
                            error_21 = _a.sent();
                            callback.complete(handleError(error_21));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SdkCommon.prototype.tradeQuery = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_22;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, tradeQueryApi(params.order_no)];
                        case 1:
                            result = _a.sent();
                            callback.complete(result);
                            return [3 /*break*/, 3];
                        case 2:
                            error_22 = _a.sent();
                            callback.complete(handleError(error_22));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return SdkCommon;
    }());

    var qqgameLoginParamsCheck = {
        version: {
            required: true,
            asyncValidator: function (rule, value) {
                return new Promise(function (resolve, reject) {
                    if (value == 'base' || value == 'normal') {
                        resolve(true);
                    }
                    else {
                        reject("Login function version params Expecting  base or normal ,but got ".concat(value, " "));
                    }
                });
            },
        },
        method: {
            required: true,
            asyncValidator: function (rule, value) {
                return new Promise(function (resolve, reject) {
                    if (value == 'mobileqq') {
                        resolve(true);
                    }
                    else {
                        reject("Login function method params Expecting mobileqq ,but got ".concat(value, " "));
                    }
                });
            },
        },
        login_openid: {
            type: 'string',
        },
        sign_fields: {
            type: 'array',
        },
        button: {
            type: 'object',
        },
        isCheck: {
            type: 'boolean',
        },
        reconnect_login: {
            type: 'boolean',
        }
    };
    var qqgameShareCheckParams = {
        func: {
            type: 'string',
            required: true,
        },
        shareAppType: {
            type: 'enum',
            enum: ['qq', 'qqFastShare', 'qqFastShareList', 'qzone', 'wechatFriends', 'wechatMoment'],
        },
    };
    var qqgamePayCheckParams = {
        pay_type: {
            type: 'enum',
            required: true,
            enum: ['qq_minigame'],
        },
        goods_tag: {
            type: 'string',
            required: true,
        },
        trade_no: {
            type: 'string',
            required: true,
        },
        is_debug: {
            type: 'enum',
            enum: [0, 1],
        },
        indulge_auth: {
            type: 'enum',
            enum: [0, 1],
        },
        env: {
            type: 'enum',
            enum: [0, 1],
        },
        callback_from: {
            type: 'enum',
            enum: [0, 1],
        },
        notify_url: {
            type: 'string',
        },
        noreply: {
            type: 'boolean',
        },
        ext: {
            type: 'object',
        },
    };
    var ReportLoactionCheckParams = {
        types: {
            type: 'array',
            required: true,
        },
        reportSpace: {
            //上报的时间间隔
            type: 'number',
            required: true,
        },
    };
    var DeleteLoactionCheckParams2 = {
        types: {
            type: 'array',
            required: true,
        },
    };
    var getNearlyRediusCheckParams = {
        radius: {
            type: 'number',
            required: true,
        },
        count: {
            type: 'number',
            required: true,
        },
        page: {
            type: 'number',
            required: true,
        },
        page_size: {
            type: 'number',
            required: true,
        },
        type: {
            type: 'string',
            required: true,
        },
        lon: {
            type: 'number',
        },
        lat: {
            type: 'number',
        }, //WGS84 纬度
    };

    /** Detect free variable `global` from Node.js. */
    var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

    var freeGlobal$1 = freeGlobal;

    /** Detect free variable `self`. */
    var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

    /** Used as a reference to the global object. */
    var root = freeGlobal$1 || freeSelf || Function('return this')();

    var root$1 = root;

    /** Built-in value references. */
    var Symbol$1 = root$1.Symbol;

    var Symbol$2 = Symbol$1;

    /** Used for built-in method references. */
    var objectProto$1 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto$1.hasOwnProperty;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString$1 = objectProto$1.toString;

    /** Built-in value references. */
    var symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : undefined;

    /**
     * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the raw `toStringTag`.
     */
    function getRawTag(value) {
      var isOwn = hasOwnProperty.call(value, symToStringTag$1),
          tag = value[symToStringTag$1];

      try {
        value[symToStringTag$1] = undefined;
        var unmasked = true;
      } catch (e) {}

      var result = nativeObjectToString$1.call(value);
      if (unmasked) {
        if (isOwn) {
          value[symToStringTag$1] = tag;
        } else {
          delete value[symToStringTag$1];
        }
      }
      return result;
    }

    /** Used for built-in method references. */
    var objectProto = Object.prototype;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString = objectProto.toString;

    /**
     * Converts `value` to a string using `Object.prototype.toString`.
     *
     * @private
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     */
    function objectToString(value) {
      return nativeObjectToString.call(value);
    }

    /** `Object#toString` result references. */
    var nullTag = '[object Null]',
        undefinedTag = '[object Undefined]';

    /** Built-in value references. */
    var symToStringTag = Symbol$2 ? Symbol$2.toStringTag : undefined;

    /**
     * The base implementation of `getTag` without fallbacks for buggy environments.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    function baseGetTag(value) {
      if (value == null) {
        return value === undefined ? undefinedTag : nullTag;
      }
      return (symToStringTag && symToStringTag in Object(value))
        ? getRawTag(value)
        : objectToString(value);
    }

    /**
     * Checks if `value` is the
     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */
    function isObject(value) {
      var type = typeof value;
      return value != null && (type == 'object' || type == 'function');
    }

    /** `Object#toString` result references. */
    var asyncTag = '[object AsyncFunction]',
        funcTag = '[object Function]',
        genTag = '[object GeneratorFunction]',
        proxyTag = '[object Proxy]';

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
      if (!isObject(value)) {
        return false;
      }
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in Safari 9 which returns 'object' for typed arrays and other constructors.
      var tag = baseGetTag(value);
      return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
    }

    var getSystemInfo = function () {
        if (typeof window !== 'undefined' && !window.qq)
            return {
                system: '',
            };
        return qq.getSystemInfoSync();
    };
    var getUserInfo = function (_a) {
        var screenWidth = _a.screenWidth, screenHeight = _a.screenHeight, button = _a.button, _b = _a.withCredentials, withCredentials = _b === void 0 ? true : _b, _c = _a.lang, lang = _c === void 0 ? 'zh_CN' : _c, _d = _a.autoClose, autoClose = _d === void 0 ? true : _d, _e = _a.isCheck, isCheck = _e === void 0 ? true : _e, setInstance = _a.setInstance;
        return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
            var auth, data, width, height, instance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!isCheck) return [3 /*break*/, 3];
                        return [4 /*yield*/, asyncFunc(qq.getSetting)];
                    case 1:
                        auth = _a.sent();
                        if (!auth.authSetting['scope.userInfo']) return [3 /*break*/, 3];
                        return [4 /*yield*/, asyncFunc(qq.getUserInfo, {
                                withCredentials: withCredentials,
                                lang: lang,
                            })];
                    case 2:
                        data = _a.sent();
                        console.info('sdk getUserInfo by qq.getUserInfo: ', data);
                        console.info('=====================');
                        resolve(data);
                        return [2 /*return*/];
                    case 3:
                        width = 200;
                        height = 40;
                        instance = setInstance(qq.createUserInfoButton(Object.assign({
                            type: 'text',
                            text: '允许获取头像昵称',
                            style: {
                                left: (screenWidth - width) / 2,
                                top: screenHeight - 80 - height / 2,
                                width: width,
                                height: height,
                                lineHeight: height,
                                backgroundColor: '#ffffff',
                                color: '#0bb20c',
                                textAlign: 'center',
                                fontSize: 16,
                                borderRadius: 4,
                                borderColor: '#d9d9da',
                                borderWidth: 1,
                            },
                            withCredentials: withCredentials,
                            lang: lang,
                        }, button)));
                        console.log('instance:', instance);
                        instance &&
                            instance.onTap(function (res) {
                                if (res.errMsg.includes(':ok')) {
                                    console.info('sdk getUserInfo by qq.createUserInfoButton: ', res);
                                    console.info('=====================');
                                    resolve(res);
                                }
                                else {
                                    var error = new Error(res.errMsg);
                                    error.code = COMMON_ERROR_CODE.USER_INFO_AUTH_DENY;
                                    reject(error);
                                }
                                if (autoClose) {
                                    instance && instance.destroy();
                                    setInstance(null);
                                }
                            });
                        return [2 /*return*/];
                }
            });
        }); });
    };
    function getSearchQueries(ifStringify) {
        var _a = wx.getLaunchOptionsSync(), query = _a.query, extraData = _a.referrerInfo.extraData;
        extraData = extraData || {};
        query = __assign(__assign({}, query), extraData);
        return ifStringify ? qs.stringify(query) : query;
    }
    /**
     * @name removeStorageByPrefix
     * @desc 删除指定前缀的storage缓存
     */
    var removeStorageByPrefix = function (prefix, predict) {
        var info = qq.getStorageInfoSync();
        var targetKeys = info.keys.filter(function (key) { return isFunction(predict) ? predict(key) : key.startsWith(prefix); });
        targetKeys.forEach(function (key) { return qq.removeStorageSync(key); });
    };

    var systemInfo = getSystemInfo();
    var getPlatformId = function () {
        var map = { Android: 1, iOS: 2 };
        return (systemInfo.system && map[systemInfo.system.split(' ')[0]]) || 0;
    };
    var SYSTEM_INFO = Object.assign({}, systemInfo, {
        fromChannel: 'qq',
        platformid: getPlatformId(),
    });

    /**
     * 根据服务器时间字符串计算并刷新 st_offset
     */
    var updateStOffsetWithServerTime = function (serverTime) {
        if (!serverTime)
            return;
        var serverTimeNum = Number(serverTime);
        if (!serverTimeNum || isNaN(serverTimeNum))
            return;
        SYSTEM_INFO$1.st_offset = String(serverTimeNum - Date.now());
    };
    /**
     * 调用 /v1/sdkconfig/detection 接口刷新 st_offset
     * 各入口按需注入自己的 api 函数（普通包 / 华为包）
     */
    var refreshStOffset = function (getServerTimeApi) { return __awaiter(void 0, void 0, void 0, function () {
        var res, serverTime, err_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, getServerTimeApi()];
                case 1:
                    res = _b.sent();
                    serverTime = (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.time;
                    updateStOffsetWithServerTime(serverTime);
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _b.sent();
                    console.warn('refreshStOffset failed', err_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var stOffsetRegistered = false;
    /**
     * 小游戏：初始化成功后注册 onShow 监听
     * 切到前台时调用接口刷新 st_offset
     */
    var setupStOffsetRefreshForMiniGame = function (platformGlobal, getServerTimeApi) {
        if (stOffsetRegistered)
            return;
        if (!platformGlobal || typeof platformGlobal.onShow !== 'function')
            return;
        stOffsetRegistered = true;
        platformGlobal.onShow(function () {
            refreshStOffset(getServerTimeApi);
        });
    };

    axios.defaults.adapter = mpAdapter;
    var SdkQQ = /** @class */ (function (_super) {
        __extends(SdkQQ, _super);
        function SdkQQ(initParams) {
            var _this = _super.call(this, initParams) || this;
            _this._rewardAd = null;
            _this._bannerAd = null;
            _this._interstitialAd = null;
            _this._hasAd = {
                banner: undefined,
                interstitial: undefined,
                rewarded: undefined,
            };
            // private _shareMessageToFriendCallback?: WechatMinigame.OnShareMessageToFriendCallback
            _this._userInfoButton = null;
            _this.locationInfomation = null;
            _this.reportLocationTimer = null;
            //用于记录刷新session
            _this.refreshSession = 0;
            // 默认刷新时间 10 分钟
            _this.businessRuleDefaultRefreshTime = 600000;
            // 商业广告规则信息
            _this.businessRulesInfo = {
                // 定时器的编号
                timerId: 0,
                // 时间间隔
                refresh_time: _this.businessRuleDefaultRefreshTime,
                // 主窗口配置信息
                main_window_list: [],
                // 窗口配置信息
                window_list: [],
                // 版本-服务端缓存使用
                version: '',
                // 是否命中缓存
                hit_cache: false,
            };
            // 接口失败次数
            // private businessRuleFailCount = 0
            // test 轮询获取商业化接口数据
            // private intervalNum = 0
            // 商业化接口是否返回结果
            _this.businessRuleInvoking = false;
            // 条件获取商业化窗口队列
            _this.businessWindowsQueue = [];
            // 上报公共属性接口失败次数
            _this.trackPublicPropsFailCount = 0;
            /**
              * initConfig: SDK初始化配置
              * {
              *    [configKey]: 后端配置结构
              * }
              *
              * 例如：sdkconfig/init
              * {
              * "event_public_attr": {
                     "public_attr": {
                       "pay_over": ["property1", "scenes_id", "a"],
                       "event2": ["property1", "property2"],
                       "event3": ["property1", "property2"]
                     },
                     "refresh": 6000,
                     "version": "string"
                 }
              *
              * */
            _this.initConfig = {};
            // 调度埋点
            _this.scheduleInitMap = {};
            // 获取分享数据缓存调度上报参数
            _this.scheuleReportProps = {};
            _this.subChannelId = null;
            _this.isPromoter = false;
            _this.game_id = '';
            _this.promoInfo = {
                timer: null,
                refresh_period_exp: 0,
                polling: 0,
                promo_code: ''
            };
            invalidInitParams(initParams, initParamsCheck);
            console.info('channel sdk check params passed');
            Object.assign(SYSTEM_INFO$1, SYSTEM_INFO, __assign(__assign({}, initParams), { index: 0 }));
            console.info('SYSTEM_INFO: ', SYSTEM_INFO$1);
            // 获取初始化配置
            _this.getInitConfig({ complete: initParams.complete });
            return _this;
        }
        SdkQQ.prototype.addFeedback = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var res, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, createFeedbackApi$1(params)];
                        case 1:
                            res = _a.sent();
                            console.log(res);
                            return [3 /*break*/, 3];
                        case 2:
                            err_1 = _a.sent();
                            callback && callback.complete(handleError(err_1));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SdkQQ.prototype.getFeedbackList = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var res, err_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, getFeedbackListApi(params)];
                        case 1:
                            res = _a.sent();
                            console.log(res);
                            return [3 /*break*/, 3];
                        case 2:
                            err_2 = _a.sent();
                            callback && callback.complete(handleError(err_2));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SdkQQ.prototype.getFeedbackDetail = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var res, err_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, getFeedbackDetailApi(params)];
                        case 1:
                            res = _a.sent();
                            console.log(res);
                            return [3 /*break*/, 3];
                        case 2:
                            err_3 = _a.sent();
                            callback && callback.complete(handleError(err_3));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SdkQQ.prototype.collectProps = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var res, err_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, collectPropsApi(params)];
                        case 1:
                            res = _a.sent();
                            console.log(res);
                            return [3 /*break*/, 3];
                        case 2:
                            err_4 = _a.sent();
                            callback && callback.complete(handleError(err_4));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SdkQQ.prototype.getAnnouncement = function (limit, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var productId, channelId, res, err_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(Number.isInteger(limit) && limit >= 1 && limit <= 100)) {
                                callback && callback.complete(handleError({
                                    code: 2000,
                                    data: null,
                                    message: 'limit 必须填1 - 100整数'
                                }));
                                return [2 /*return*/];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            productId = SYSTEM_INFO$1.productId, channelId = SYSTEM_INFO$1.channelId;
                            return [4 /*yield*/, getNoticeApi({
                                    limit: limit,
                                    product_id: productId,
                                    channel_id: channelId
                                })];
                        case 2:
                            res = _a.sent();
                            console.log(res);
                            return [3 /*break*/, 4];
                        case 3:
                            err_5 = _a.sent();
                            callback && callback.complete(handleError(err_5));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        SdkQQ.prototype.clearPromoterTimer = function () {
            console.log('clearPromoterTimer');
            if (this.promoInfo.timer) {
                clearTimeout(this.promoInfo.timer);
                this.promoInfo.timer = null;
            }
        };
        // 启动定时器
        SdkQQ.prototype.startPromoterTimer = function (callback, autoRefresh) {
            var _this = this;
            if (autoRefresh === void 0) { autoRefresh = true; }
            var delay = this.promoInfo.refresh_period_exp < 1 ? (this.promoInfo.polling ? (this.promoInfo.polling * 1000) : 10000) : (this.promoInfo.refresh_period_exp * 1000);
            console.log('startPromoterTimer', delay);
            this.promoInfo.timer = setTimeout(function () {
                _this.getPromoDisplayKEY(callback, autoRefresh, false);
            }, delay);
        };
        SdkQQ.prototype.getPromoDisplayKEY = function (callback, autoRefresh, immediately) {
            var _this = this;
            if (autoRefresh === void 0) { autoRefresh = false; }
            if (immediately === void 0) { immediately = true; }
            this.clearPromoterTimer();
            var promo_code = this.promoInfo.promo_code;
            getPromoterCodeApi(this.game_id).then(function (res) {
                try {
                    if (res.code == 0) {
                        _this.promoInfo.refresh_period_exp = res.data.refresh_period_exp || 0;
                        _this.promoInfo.polling = res.data.polling || 0;
                        promo_code = res.data.promo_code;
                    }
                }
                catch (e) {
                    _this.promoInfo.refresh_period_exp = 0;
                    _this.promoInfo.polling = 0;
                }
                if (autoRefresh) {
                    _this.startPromoterTimer(callback, autoRefresh);
                }
                if (!immediately && promo_code == _this.promoInfo.promo_code) {
                    return;
                }
                else {
                    _this.promoInfo.promo_code = promo_code;
                }
                callback && callback.complete(res);
            }).catch(function (err) {
                if (err.isServerError) {
                    _this.clearPromoterTimer();
                    callback && callback.complete(handleError(err));
                }
                else {
                    if (autoRefresh) {
                        _this.startPromoterTimer(callback, autoRefresh);
                    }
                    else {
                        callback && callback.complete(handleError(err));
                    }
                }
            });
        };
        SdkQQ.prototype.exchangePromoCDKEY = function (cdkey, callback) {
            exchangePromoterCodeApi(cdkey).then(function (res) {
                callback.complete(res);
            }).catch(function (err) {
                callback.complete(handleError(err));
            });
        };
        SdkQQ.prototype.publicSubchannelCheck = function (res) {
            var _a, _b;
            try {
                var sub_channel = (_b = (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.subcq) === null || _b === void 0 ? void 0 : _b.subc;
                var queryString = getSearchQueries(true);
                var query = queryString ? queryString.split('&') : [];
                console.log(query);
                if ((sub_channel === null || sub_channel === void 0 ? void 0 : sub_channel.length) && (query === null || query === void 0 ? void 0 : query.length)) {
                    for (var a = 0; a < sub_channel.length; a++) {
                        var item = sub_channel[a];
                        var reflectStringArr = item === null || item === void 0 ? void 0 : item.map;
                        if (reflectStringArr === null || reflectStringArr === void 0 ? void 0 : reflectStringArr.length) {
                            var arr = item === null || item === void 0 ? void 0 : item.map;
                            var sub_channel_id = item === null || item === void 0 ? void 0 : item.id;
                            for (var k in arr) {
                                var str = arr[k];
                                console.log(str);
                                for (var c in query) {
                                    if (str.includes(query[c])) {
                                        this.subChannelId = sub_channel_id;
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            catch (err) {
            }
        };
        SdkQQ.prototype.getInitConfig = function (callback) {
            var _a, _b, _c, _d, _e;
            return __awaiter(this, void 0, void 0, function () {
                var initParams, res, config, version, _i, _f, key, prop_version, _serverTime, err_6, error;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            initParams = qq.getStorageSync('rx-init-params') || {};
                            _g.label = 1;
                        case 1:
                            _g.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, getInitConf({ version: (_a = initParams === null || initParams === void 0 ? void 0 : initParams.version) !== null && _a !== void 0 ? _a : {} })];
                        case 2:
                            res = _g.sent();
                            config = res.data || {};
                            version = {};
                            for (_i = 0, _f = Object.keys(config); _i < _f.length; _i++) {
                                key = _f[_i];
                                prop_version = (_c = (_b = config[key]) === null || _b === void 0 ? void 0 : _b.version) !== null && _c !== void 0 ? _c : '';
                                if (prop_version) {
                                    version[key] = prop_version;
                                    this.initConfig[key] = { timerId: 0 };
                                }
                                this.initConfig[key] = __assign(__assign({}, config[key]), this.initConfig[key]);
                            }
                            console.info('SDK initConfig: ', this.initConfig);
                            //检查是否需要传递subchannleid
                            this.publicSubchannelCheck(res);
                            qq.setStorageSync('rx-init-params', { version: version });
                            SYSTEM_INFO$1.SDK_INIT_FINISHED = true;
                            _serverTime = (_e = (_d = res === null || res === void 0 ? void 0 : res.data) === null || _d === void 0 ? void 0 : _d.server) === null || _e === void 0 ? void 0 : _e.time;
                            if (_serverTime) {
                                SYSTEM_INFO$1.st_offset = String(Number(_serverTime) - Date.now());
                            }
                            // 初始化成功后监听应用进入前台，刷新 st_offset
                            setupStOffsetRefreshForMiniGame(typeof qq !== 'undefined' ? qq : null, getServerTime);
                            // 检查是否需要激活
                            this.checkNeedActivate();
                            this.loopGetPublicProps();
                            callback.complete({ code: 0 });
                            return [3 /*break*/, 4];
                        case 3:
                            err_6 = _g.sent();
                            error = new Error('初始化错误，或未初始化');
                            error.code = COMMON_ERROR_CODE.INIT_PARAMS_ERROR;
                            // data: 保留原始错误
                            error.data = {
                                data: err_6,
                            };
                            callback.complete(handleError(error));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // 获取归因数据
        SdkQQ.prototype.getAttributionData = function () {
            var universal = getSearchQueries();
            var source_ad = {};
            if (universal === null || universal === void 0 ? void 0 : universal.ad_platform) {
                switch (universal === null || universal === void 0 ? void 0 : universal.ad_platform) {
                    case 'tencent':
                        source_ad.click_id = universal.gdt_vid;
                        source_ad.ad_rawargs = omit(universal, ['ad_platform', 'gdt_vid']);
                        break;
                    case 'oceanengine':
                        source_ad.click_id = universal.req_id;
                        source_ad.ad_rawargs = omit(universal, ['ad_platform', 'req_id']);
                        break;
                    case 'kuaishou':
                        source_ad.ad_rawargs = omit(universal, ['ad_platform']);
                        break;
                    case 'baidu':
                        source_ad.click_id = universal.bd_vid;
                        source_ad.ad_rawargs = omit(universal, ['ad_platform', 'bd_vid']);
                        break;
                    case 'bili':
                        source_ad.click_id = universal.trackid;
                        break;
                    case 'xiaohongshu':
                        source_ad.click_id = universal.click_id;
                        break;
                }
                source_ad.ad_platform = universal.ad_platform;
            }
            return source_ad;
        };
        //检查是否需要激活
        SdkQQ.prototype.checkNeedActivate = function () {
            return __awaiter(this, void 0, void 0, function () {
                var activeResult, source_ad, distinct_id, req, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            activeResult = qq.getStorageSync('rx-active-result');
                            if (!!activeResult) return [3 /*break*/, 4];
                            source_ad = this.getAttributionData();
                            distinct_id = v4_1();
                            qq.setStorageSync('rx_distinct_id', distinct_id);
                            req = {
                                stage: 'init',
                                distinct_id: distinct_id,
                                source_ad: source_ad,
                            };
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, activated(req)];
                        case 2:
                            result = _a.sent();
                            qq.setStorageSync('rx-active-result', { isSuccess: true, activeResult: result.data });
                            return [3 /*break*/, 4];
                        case 3:
                            _a.sent();
                            qq.setStorageSync('rx-active-result', { isSuccess: false, activeResult: req });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        //格式化queryString
        SdkQQ.prototype.getLoginQsAndGenerateStruct = function () {
            var _a;
            var universal = getSearchQueries();
            var user_source = {};
            if (universal.hasOwnProperty('user_source')) {
                var omitKeys = (universal === null || universal === void 0 ? void 0 : universal.user_source) === 'transmits' ? ['user_source'] : ['user_source', 'type', 'transmits'];
                var leftProps = __assign({}, omit(universal, omitKeys));
                /**
                 * url 上有user_source字段并且除了'user_source', 'type', 'transmits'等字段外还有属性，则将剩余属性全部放到universal['user_source']属性下
                 * 多包了一层'user_source',使用的地方直接 ...
                 */
                if (!isEmpty(leftProps)) {
                    // 用户透传参数
                    if ((universal === null || universal === void 0 ? void 0 : universal.user_source) == 'transmits') {
                        user_source = {
                            user_transmits: Object.assign(leftProps, { transmits: decodeURIComponent(leftProps.transmits || '') })
                        };
                    }
                    else if ((universal === null || universal === void 0 ? void 0 : universal.user_source) == 'attr') {
                        user_source = {
                            user_attrs: leftProps,
                        };
                    }
                    else {
                        user_source = {
                            user_source: (_a = {},
                                _a[universal['user_source']] = leftProps,
                                _a),
                        };
                    }
                    return user_source;
                }
            }
            var subPackageInfo = qq.getStorageSync('rx_sub_package_info');
            if (!isEmpty(subPackageInfo)) {
                user_source = {
                    user_source: {
                        sub_package: subPackageInfo,
                    }
                };
                return user_source;
            }
            return null;
        };
        SdkQQ.prototype.ActivePrefix = function (reqParams) {
            var loginState = qq.getStorageSync('rx-loginState');
            var activeSave = qq.getStorageSync('rx-active-result');
            if (loginState || !activeSave) {
                return reqParams;
            }
            else {
                if (activeSave === null || activeSave === void 0 ? void 0 : activeSave.isSuccess) {
                    return __assign(__assign({}, reqParams), { activate: { result: activeSave === null || activeSave === void 0 ? void 0 : activeSave.activeResult } });
                }
                else {
                    return __assign(__assign({}, reqParams), { activate: { args: activeSave === null || activeSave === void 0 ? void 0 : activeSave.activeResult } });
                }
            }
        };
        /**
         * 用于设置子渠道，通行证记录来源（分包）、子渠道参数
         */
        SdkQQ.prototype.setSubChannelId = function (subChannelId) {
            try {
                qq.setStorageSync('rx_sub_package_info', { sub_channel_id: subChannelId });
                return { code: 0 };
            }
            catch (error) {
                return handleError(error);
            }
        };
        /**
         * 用于设置自定义返回错误 Msg
         */
        SdkQQ.prototype.setErrorMsg = function (errMsg) {
            SYSTEM_INFO$1.errMsg = errMsg;
        };
        /**
         * 清空返回错误 Msg
         */
        SdkQQ.prototype.clearErrorMsg = function () {
            SYSTEM_INFO$1.errMsg = {
                default: ''
            };
        };
        // 登录接口
        SdkQQ.prototype.login = function (params, callback) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function () {
                var needAuth, reqLoginData, code, userInfo, error_1;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            needAuth = (params === null || params === void 0 ? void 0 : params.version) === 'normal';
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 8, , 9]);
                            return [4 /*yield*/, pubCheck(qqgameLoginParamsCheck, callback, params)];
                        case 2:
                            _c.sent();
                            if (!needAuth) return [3 /*break*/, 4];
                            if (this._userInfoButton)
                                return [2 /*return*/];
                            return [4 /*yield*/, this.authorize(params, callback)];
                        case 3:
                            _c.sent();
                            return [2 /*return*/];
                        case 4:
                            reqLoginData = {
                                ext: {},
                            };
                            if (!!params.login_openid) return [3 /*break*/, 6];
                            return [4 /*yield*/, asyncFunc(qq.login)];
                        case 5:
                            code = (_c.sent()).code;
                            reqLoginData.ext.code = code;
                            _c.label = 6;
                        case 6:
                            console.info('sdk login without authorize');
                            console.info('=====================');
                            return [4 /*yield*/, this._login(params, reqLoginData)];
                        case 7:
                            userInfo = _c.sent();
                            try {
                                if ((((_a = userInfo === null || userInfo === void 0 ? void 0 : userInfo.data) === null || _a === void 0 ? void 0 : _a.user_flag) & 1) == 1) {
                                    this.isPromoter = true;
                                    this.game_id = (_b = userInfo === null || userInfo === void 0 ? void 0 : userInfo.data) === null || _b === void 0 ? void 0 : _b.cp_user_id;
                                }
                            }
                            catch (e) { }
                            callback.complete(userInfo);
                            return [3 /*break*/, 9];
                        case 8:
                            error_1 = _c.sent();
                            callback.complete(handleError(error_1));
                            this.track({
                                complete: function (data) {
                                    console.info('login error add complete func when tracked:', data);
                                },
                            }, formatTrackParams({
                                eventName: 'track_err',
                                apiName: 'login',
                                reqParams: params,
                                errorInfo: error_1,
                                loginInfo: USER_INFO,
                            }));
                            return [3 /*break*/, 9];
                        case 9: return [2 /*return*/];
                    }
                });
            });
        };
        // 授权登录接口
        SdkQQ.prototype.authorize = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var reqLoginData, code, data, error_2, userInfo, error_3;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.info('sdk trigger authorize: ', params);
                            console.info('=====================');
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 9, , 10]);
                            return [4 /*yield*/, pubCheck(qqgameLoginParamsCheck, callback, params)];
                        case 2:
                            _a.sent();
                            if (this._userInfoButton)
                                return [2 /*return*/];
                            reqLoginData = {
                                ext: {},
                            };
                            if (!!params.login_openid) return [3 /*break*/, 4];
                            return [4 /*yield*/, asyncFunc(qq.login)];
                        case 3:
                            code = (_a.sent()).code;
                            reqLoginData.ext.code = code;
                            _a.label = 4;
                        case 4:
                            _a.trys.push([4, 6, , 7]);
                            return [4 /*yield*/, getUserInfo({
                                    screenWidth: SYSTEM_INFO$1.screenWidth,
                                    screenHeight: SYSTEM_INFO$1.screenHeight,
                                    button: params === null || params === void 0 ? void 0 : params.button,
                                    withCredentials: true,
                                    setInstance: function (instance) {
                                        _this._userInfoButton = instance;
                                        return instance;
                                    },
                                    autoClose: params === null || params === void 0 ? void 0 : params.autoClose,
                                    isCheck: params === null || params === void 0 ? void 0 : params.isCheck,
                                })];
                        case 5:
                            data = _a.sent();
                            reqLoginData.ext.encryptedData = data.encryptedData;
                            reqLoginData.ext.iv = data.iv;
                            return [3 /*break*/, 7];
                        case 6:
                            error_2 = _a.sent();
                            callback.complete(handleError(error_2));
                            return [2 /*return*/];
                        case 7:
                            console.info('sdk login after authorize data: ', reqLoginData);
                            console.info('=====================');
                            return [4 /*yield*/, this._login(params, reqLoginData)];
                        case 8:
                            userInfo = _a.sent();
                            callback.complete(userInfo);
                            return [2 /*return*/, userInfo];
                        case 9:
                            error_3 = _a.sent();
                            callback.complete(handleError(error_3));
                            this.track({
                                complete: function (data) {
                                    console.info('authorize error add complete func when tracked:', data);
                                },
                            }, formatTrackParams({
                                eventName: 'track_err',
                                apiName: 'authorize',
                                reqParams: params,
                                errorInfo: error_3,
                                loginInfo: USER_INFO,
                            }));
                            return [3 /*break*/, 10];
                        case 10: return [2 /*return*/];
                    }
                });
            });
        };
        SdkQQ.prototype._login = function (params, loginData) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function () {
                var user_source, source_ad, version, sign_fields, now, distinct_idLocal, distinct_id, reqLoginData, userInfo, reflowEnabled, reqLogin, error_4;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 5, , 6]);
                            user_source = this.getLoginQsAndGenerateStruct();
                            source_ad = this.getAttributionData();
                            version = params.version, sign_fields = params.sign_fields;
                            now = new Date().getTime();
                            distinct_idLocal = qq.getStorageSync('rx_distinct_id');
                            distinct_id = distinct_idLocal || v4_1();
                            if (!distinct_idLocal) {
                                qq.setStorageSync('rx_distinct_id', distinct_id);
                            }
                            reqLoginData = __assign(__assign({ ts: now, method: (params === null || params === void 0 ? void 0 : params.method) || 'mobileqq', distinct_id: distinct_id }, user_source), { sign_fields: sign_fields, ext: __assign(__assign({}, loginData === null || loginData === void 0 ? void 0 : loginData.ext), { version: version }) });
                            userInfo = null;
                            if (!params.login_openid) return [3 /*break*/, 2];
                            //二次登录
                            reqLoginData.login_openid = params.login_openid;
                            console.info('sdk 二次登录 api req: ', reqLoginData);
                            return [4 /*yield*/, loginByTokenApi(this.ActivePrefix(reqLoginData))];
                        case 1:
                            userInfo = _c.sent();
                            qq.setStorageSync('rx-loginState', 1);
                            return [3 /*break*/, 4];
                        case 2:
                            reflowEnabled = ((_b = (_a = this.initConfig) === null || _a === void 0 ? void 0 : _a.advertise_switch) === null || _b === void 0 ? void 0 : _b.switch) === 1;
                            reqLogin = reflowEnabled
                                ? __assign(__assign({}, reqLoginData), { device: source_ad }) : __assign({}, reqLoginData);
                            console.info('sdk normal login api req: ', reqLogin);
                            return [4 /*yield*/, loginByCredentialApi(this.ActivePrefix(reqLogin))];
                        case 3:
                            userInfo = _c.sent();
                            qq.setStorageSync('rx-loginState', 1);
                            _c.label = 4;
                        case 4:
                            Object.assign(USER_INFO, userInfo.data);
                            console.info('sdk USER_INFO :', USER_INFO);
                            qq.setStorageSync('rxToken', userInfo.data.token);
                            !(params === null || params === void 0 ? void 0 : params.reconnect_login) &&
                                this.refreshBusinessData({
                                    complete: function () { },
                                }, !(params === null || params === void 0 ? void 0 : params.cancel_business_queue));
                            return [2 /*return*/, userInfo];
                        case 5:
                            error_4 = _c.sent();
                            throw error_4;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        // 支付
        SdkQQ.prototype.pay = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var error, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, pubCheck(qqgamePayCheckParams, callback, params)];
                        case 1:
                            _a.sent();
                            if (params.indulge_auth == 1 && !params.age) {
                                error = new Error('when indulge_auth equal 1,the age must be required');
                                error.code = COMMON_ERROR_CODE.PAY_PARAMS_ERROR;
                                throw error;
                            }
                            this.order(params, callback);
                            return [3 /*break*/, 3];
                        case 2:
                            error_5 = _a.sent();
                            callback.complete(handleError(error_5));
                            this.track({
                                complete: function (data) {
                                    console.info('pay error add complete func when tracked:', data);
                                },
                            }, formatTrackParams({
                                eventName: 'track_err',
                                apiName: 'pay',
                                reqParams: params,
                                errorInfo: error_5,
                                loginInfo: USER_INFO,
                            }));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SdkQQ.prototype.order = function (params, _a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var reqOrder, ext, _b, amount, prepayId, error_6;
                var _this = this;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 3, , 4]);
                            params.ext = (params === null || params === void 0 ? void 0 : params.ext) || {};
                            reqOrder = __assign(__assign({}, params), { currency: 'CNY', openid: USER_INFO.openid, sub_channel_id: USER_INFO.subchannelid, is_debug: params.is_debug || 0, env: params.env || 0, callback_from: 0, ext: __assign(__assign({}, params.ext), { qq_openid: USER_INFO.tid }) });
                            return [4 /*yield*/, orderApi(reqOrder)];
                        case 1:
                            ext = (_c.sent()).data.ext;
                            _b = ext || {}, amount = _b.amount, prepayId = _b.prepayId;
                            return [4 /*yield*/, asyncFunc(qq.requestMidasPayment, {
                                    prepayId: prepayId,
                                    setEnv: params.env || 0,
                                    starCurrency: amount,
                                })];
                        case 2:
                            _c.sent();
                            complete({ code: 0 });
                            this.refreshSession = 0;
                            return [3 /*break*/, 4];
                        case 3:
                            error_6 = _c.sent();
                            if ((error_6 === null || error_6 === void 0 ? void 0 : error_6.code) == 152413 && this.refreshSession < 2) {
                                // session 过期处理
                                this.refreshSession++;
                                this.refreshSessionFunc().then(function () {
                                    _this.pay(params, { complete: complete });
                                });
                            }
                            else {
                                if (error_6.errCode == -2) {
                                    error_6.code = 4001;
                                    error_6.thirdcode = -2;
                                }
                                if (error_6.errCode == -1 || error_6.errCode == -3 || error_6.errCode == -4) {
                                    error_6.code = COMMON_ERROR_CODE.PAY_ERROR;
                                    error_6.thirdcode = -1;
                                }
                                complete(handleError(error_6));
                                this.track({
                                    complete: function (data) {
                                        console.info('order error add complete func when tracked:', data);
                                    },
                                }, formatTrackParams({
                                    eventName: 'track_err',
                                    apiName: 'order',
                                    reqParams: params,
                                    errorInfo: error_6,
                                    loginInfo: USER_INFO,
                                }));
                            }
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // private async payIos(
        //   { params, desc = '', func, title, image, reconfirm, sessionFrom }: ConversationParams,
        //   { complete }: Partial<IMethodParams>
        // ) {
        //   if (func) {
        //     const { data } = await getShareDataApi({
        //       product_id: SYSTEM_INFO.productId,
        //       channel_id: SYSTEM_INFO.channelId,
        //       sub_channel_id: USER_INFO.subchannelid || '',
        //       region: USER_INFO.region || '',
        //       func,
        //       platform: 'wechat',
        //       type: 'mini',
        //     })
        //     if (data) {
        //       title = data.content?.content
        //       image = data.content?.image
        //     }
        //   }
        //   // await asyncFunc(qq.showModal, {
        //   //   title: MODAL_TITLE,
        //   //   content: '请点击确定进入[客服会话]进行充值!',
        //   //   showCancel: false,
        //   // })
        //   const openConversation = async () => {
        //     try {
        //       await asyncFunc(qq.openCustomerServiceConversation, {
        //         showMessageCard: true,
        //         sessionFrom: params,
        //         sendMessageTitle: title,
        //         sendMessagePath: params,
        //         sendMessageImg: image,
        //       })
        //     } catch (error: any) {
        //       const { errMsg } = error
        //       if (errMsg && !errMsg.includes('cancel')) {
        //         throw error
        //       }
        //       const { confirm } = await asyncFunc(qq.showModal, {
        //         title: MODAL_TITLE,
        //         content: `因版本限制, 需通过[客服会话]${desc}, 请您谅解!`,
        //         cancelText: '我知道了',
        //         confirmText: '前往充值',
        //       })
        //       if (confirm) {
        //         await openConversation()
        //       } else {
        //         throw new Error('用户取消')
        //       }
        //     }
        //   }
        //   await openConversation()
        // }
        SdkQQ.prototype.refreshSessionFunc = function () {
            return __awaiter(this, void 0, void 0, function () {
                var code, res, err_8;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, asyncFunc(qq.login)];
                        case 1:
                            code = (_a.sent()).code;
                            return [4 /*yield*/, refreshUserInfo({
                                    version: 'base',
                                    code: code,
                                })];
                        case 2:
                            res = _a.sent();
                            return [2 /*return*/, res];
                        case 3:
                            err_8 = _a.sent();
                            this.track({
                                complete: function (data) {
                                    console.info('refreshSessionFunc error add complete func when tracked:', data);
                                },
                            }, formatTrackParams({
                                eventName: 'track_err',
                                apiName: 'refreshSessionFunc',
                                reqParams: {},
                                errorInfo: err_8,
                                loginInfo: USER_INFO,
                            }));
                            return [2 /*return*/];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        SdkQQ.prototype.setScheuleReportProps = function (data) {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            this.scheuleReportProps = {
                trigger_tag: ((_a = data === null || data === void 0 ? void 0 : data.trigger) === null || _a === void 0 ? void 0 : _a.tag) || '',
                trigger_id: ((_b = data === null || data === void 0 ? void 0 : data.trigger) === null || _b === void 0 ? void 0 : _b.id) || 0,
                trigger_type: ((_c = data === null || data === void 0 ? void 0 : data.trigger) === null || _c === void 0 ? void 0 : _c.type) || 0,
                material_type: ((_d = data === null || data === void 0 ? void 0 : data.content) === null || _d === void 0 ? void 0 : _d.material_type) || '',
                material_id: ((_e = data === null || data === void 0 ? void 0 : data.content) === null || _e === void 0 ? void 0 : _e.material_id) || 0,
                landing_id: ((_f = data === null || data === void 0 ? void 0 : data.content) === null || _f === void 0 ? void 0 : _f.landing_id) || 0,
                strategy_id: ((_g = data === null || data === void 0 ? void 0 : data.strategy) === null || _g === void 0 ? void 0 : _g.id) || 0,
                strategy_type: ((_h = data === null || data === void 0 ? void 0 : data.strategy) === null || _h === void 0 ? void 0 : _h.type) || 0,
                platform: (data === null || data === void 0 ? void 0 : data.platform) || PLATFORM.QQ,
            };
        };
        //获得分享内容
        SdkQQ.prototype.getShareData = function (params, callback, stopCallback) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function () {
                var region, cacheShareData, _c, readCache, cShareData, productId, channelId, platform, transmits, func, type, sub_channel_id, open_id, shareData_1, err_9;
                var _this = this;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, pubCheck(qqgameShareCheckParams, callback, params)];
                        case 1:
                            _d.sent();
                            region = (params === null || params === void 0 ? void 0 : params.region) || USER_INFO.region || '';
                            cacheShareData = qq.getStorageSync("rx_schedule_".concat(USER_INFO.tid, "_").concat(params.func, "_").concat(region));
                            _c = params.readCache, readCache = _c === void 0 ? true : _c;
                            if (readCache && cacheShareData) {
                                cShareData = JSON.parse(cacheShareData);
                                console.info('sdk 缓存分享数据：', cShareData);
                                this.setScheuleReportProps(cShareData === null || cShareData === void 0 ? void 0 : cShareData.data);
                                !stopCallback && callback.complete(cShareData);
                                return [2 /*return*/, cShareData];
                            }
                            productId = SYSTEM_INFO$1.productId, channelId = SYSTEM_INFO$1.channelId;
                            platform = PLATFORM.QQ;
                            transmits = encodeURI(params.transmits || '');
                            func = params.func;
                            type = 'mini';
                            sub_channel_id = USER_INFO.subchannelid || '';
                            open_id = USER_INFO.openid;
                            return [4 /*yield*/, getShareDataApi({
                                    func: func,
                                    transmits: transmits,
                                    product_id: productId,
                                    channel_id: channelId,
                                    platform: platform,
                                    type: type,
                                    region: region,
                                    sub_channel_id: sub_channel_id,
                                    open_id: open_id,
                                })];
                        case 2:
                            shareData_1 = _d.sent();
                            if (((_b = (_a = shareData_1 === null || shareData_1 === void 0 ? void 0 : shareData_1.data) === null || _a === void 0 ? void 0 : _a.scheduling) === null || _b === void 0 ? void 0 : _b.remaining_share_count) <= 0) {
                                this.shareSchedulingInit({}, {
                                    complete: function () {
                                        if (!stopCallback) {
                                            callback.complete(shareData_1);
                                        }
                                        _this.setScheuleReportProps(shareData_1 === null || shareData_1 === void 0 ? void 0 : shareData_1.data);
                                    }
                                });
                                return [2 /*return*/, shareData_1];
                            }
                            if (!stopCallback) {
                                callback.complete(shareData_1);
                            }
                            this.setScheuleReportProps(shareData_1 === null || shareData_1 === void 0 ? void 0 : shareData_1.data);
                            return [2 /*return*/, shareData_1];
                        case 3:
                            err_9 = _d.sent();
                            callback.complete(handleError(err_9));
                            this.track({
                                complete: function (data) {
                                    console.info('getShareData error add complete func when tracked:', data);
                                },
                            }, formatTrackParams({
                                eventName: 'track_err',
                                apiName: 'getShareData',
                                reqParams: params,
                                errorInfo: err_9,
                                loginInfo: USER_INFO,
                            }));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        //分享接口
        SdkQQ.prototype.share = function (params, _a) {
            var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var shareData_2, timeout_1, onHide_1, onShow_1, query, err_10;
                var _this = this;
                return __generator(this, function (_y) {
                    switch (_y.label) {
                        case 0:
                            _y.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, pubCheck(qqgameShareCheckParams, { complete: complete }, params)];
                        case 1:
                            _y.sent();
                            return [4 /*yield*/, this.getShareData(params, { complete: complete }, true)];
                        case 2:
                            shareData_2 = _y.sent();
                            console.info('sdk getShareData info: ', shareData_2);
                            timeout_1 = setTimeout(function () {
                                var error = new Error('分享拉起超时');
                                error.code = COMMON_ERROR_CODE.SHARE_TRIGGER_OVERTIME;
                                error.data = shareData_2;
                                complete(handleError(error));
                            }, 2000);
                            onHide_1 = function () {
                                clearTimeout(timeout_1);
                                qq.offHide(onHide_1);
                            };
                            onShow_1 = function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    qq.offShow(onShow_1);
                                    complete(shareData_2);
                                    return [2 /*return*/];
                                });
                            }); };
                            query = qs.stringify({
                                type: 'rx',
                                user_source: 'share',
                                platform: ((_b = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _b === void 0 ? void 0 : _b.platform) || '',
                                transmits: encodeURIComponent((params === null || params === void 0 ? void 0 : params.transmits) || ''),
                                landing_id: (_d = (_c = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d.landing_id,
                                trigger_id: (_f = (_e = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _e === void 0 ? void 0 : _e.trigger) === null || _f === void 0 ? void 0 : _f.id,
                                trigger_tag: (_h = (_g = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _g === void 0 ? void 0 : _g.trigger) === null || _h === void 0 ? void 0 : _h.tag,
                                trigger_type: (_k = (_j = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _j === void 0 ? void 0 : _j.trigger) === null || _k === void 0 ? void 0 : _k.type,
                                material_type: (_m = (_l = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _l === void 0 ? void 0 : _l.content) === null || _m === void 0 ? void 0 : _m.material_type,
                                material_id: (_p = (_o = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _o === void 0 ? void 0 : _o.content) === null || _p === void 0 ? void 0 : _p.material_id,
                                strategy_type: (_r = (_q = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _q === void 0 ? void 0 : _q.strategy) === null || _r === void 0 ? void 0 : _r.type,
                                strategy_id: (_t = (_s = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _s === void 0 ? void 0 : _s.strategy) === null || _t === void 0 ? void 0 : _t.id,
                                share_time: Math.floor(new Date().getTime() / 1000),
                                share_type: 'mini',
                                inviter_region: USER_INFO.region || '',
                                inviter_openid: USER_INFO.openid,
                                inviter_productid: SYSTEM_INFO$1.productId,
                                inviter_channelid: SYSTEM_INFO$1.channelId,
                                inviter_subchannelid: USER_INFO === null || USER_INFO === void 0 ? void 0 : USER_INFO.subchannelid,
                            });
                            qq.onHide(onHide_1);
                            qq.onShow(onShow_1);
                            console.log('params: ', params);
                            qq.shareAppMessage({
                                title: params.title || ((_v = (_u = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _u === void 0 ? void 0 : _u.content) === null || _v === void 0 ? void 0 : _v.content),
                                imageUrl: params.imageUrl || ((_x = (_w = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _w === void 0 ? void 0 : _w.content) === null || _x === void 0 ? void 0 : _x.image),
                                query: params.query ? "".concat(query, "&").concat(params.query) : query,
                                shareAppType: params.shareAppType || 'qq',
                                complete: function () {
                                    clearTimeout(timeout_1);
                                },
                            });
                            return [3 /*break*/, 4];
                        case 3:
                            err_10 = _y.sent();
                            complete(handleError(err_10));
                            this.track({
                                complete: function (data) {
                                    console.info('share error add complete func when tracked:', data);
                                },
                            }, formatTrackParams({
                                eventName: 'track_err',
                                apiName: 'share',
                                reqParams: params,
                                errorInfo: err_10,
                                loginInfo: USER_INFO,
                            }));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        //数据上报
        SdkQQ.prototype.track = function (callback, params) {
            var _a, _b, _c;
            return __awaiter(this, void 0, void 0, function () {
                var getDevicecode, devicecode, type, time, uuids, platform_id, copyCpid, product_id, cpid, publicPropskey, publicPropsByCache, publicProps, reqarr, result, err_11;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, pubCheck(checkTrackParams, callback, params)];
                        case 1:
                            _d.sent();
                            getDevicecode = function () {
                                var devicecode = qq.getStorageSync('rx_devicecode');
                                if (devicecode) {
                                    return devicecode.code;
                                }
                                else {
                                    var code = v4_1();
                                    qq.setStorageSync('rx_devicecode', { code: code, openIds: {} });
                                    return code;
                                }
                            };
                            devicecode = getDevicecode();
                            type = 'track';
                            time = formatDate('YYYY-MM-DDTHH:mm:ss.SSSZ');
                            uuids = v4_1();
                            platform_id = 4;
                            copyCpid = SYSTEM_INFO$1.cpid, product_id = SYSTEM_INFO$1.productId;
                            cpid = Number(copyCpid);
                            publicPropskey = ((_c = (_b = (_a = this.initConfig) === null || _a === void 0 ? void 0 : _a.event_public_attr) === null || _b === void 0 ? void 0 : _b.public_attr) === null || _c === void 0 ? void 0 : _c[params.event]) || [];
                            publicPropsByCache = qq.getStorageSync('rx_public_props');
                            publicProps = pick(publicPropsByCache, publicPropskey);
                            console.log('公共属性:', publicProps);
                            reqarr = [
                                __assign({ type: type, time: time, uuid: uuids, distinct_id: USER_INFO.openid, sub_channel_id: USER_INFO.subchannelid, platform_id: platform_id, product_id: product_id, ip: '127.0.0.1', cpid: cpid, channel_id: SYSTEM_INFO$1.channelId, devicecode: devicecode }, __assign(__assign({}, params), { properties: __assign(__assign({}, publicProps), params.properties) })),
                            ];
                            !USER_INFO.subchannelid || (reqarr[0].sub_channel_id = USER_INFO.subchannelid);
                            return [4 /*yield*/, trackApi(reqarr)];
                        case 2:
                            result = _d.sent();
                            callback.complete(__assign(__assign({}, result), { data: null, msg: 'track success' }));
                            return [3 /*break*/, 4];
                        case 3:
                            err_11 = _d.sent();
                            callback.complete(handleError(err_11));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        //商业广告
        SdkQQ.prototype.getAllBusinessData = function (callback) {
            return __awaiter(this, void 0, void 0, function () {
                var data, result;
                return __generator(this, function (_a) {
                    try {
                        data = omit(this.businessRulesInfo, 'timerId');
                        result = { code: 0, data: data };
                        callback.complete(result);
                    }
                    catch (error) {
                        callback.complete(handleError(error));
                    }
                    return [2 /*return*/];
                });
            });
        };
        // 轮训商业化广告信息
        // private async loopGetBusinessRules() {
        //   const repeat = (ms: number) => {
        //     this.businessRulesInfo.timerId && clearTimeout(this.businessRulesInfo.timerId)
        //     this.businessRulesInfo.timerId = setTimeout(() => {
        //       // this.intervalNum++
        //       // console.log("setInterval", this.intervalNum);
        //       getRules()
        //       // repeat(ms)
        //     }, ms)
        //   }
        //   const getRules = async () => {
        //     try {
        //       const res = await getBusinessRules(this.businessRulesInfo.version)
        //       const {
        //         refresh_time = this.businessRuleDefaultRefreshTime,
        //         main_window_list = [],
        //         window_list = [],
        //       } = res?.data || {}
        //       this.businessRulesInfo.refresh_time = refresh_time
        //       this.businessRulesInfo.main_window_list = main_window_list
        //       this.businessRulesInfo.window_list = window_list
        //       repeat(this.businessRulesInfo.refresh_time)
        //     } catch (error) {
        //       handleError(error)
        //       if (this.businessRuleFailCount < 1) {
        //         // 首次获取失败3秒后重试
        //         this.businessRuleFailCount += 1
        //         repeat(3000)
        //       } else {
        //         // 再失败每十分钟后重试，直至成功
        //         this.businessRuleFailCount += 1
        //         repeat(600000)
        //       }
        //     }
        //   }
        //   getRules()
        // }
        // 条件获取商业化窗口数据
        SdkQQ.prototype.getBusinessData = function (params, callback) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function () {
                var checkCache, window_key_1, event_1, _c, before_event, _d, cache_1, cacheKey_1, _e, _f, _g, auto_popups, _h, manual_popups, matchWindows, windows, result, error_7;
                var _this = this;
                return __generator(this, function (_j) {
                    switch (_j.label) {
                        case 0:
                            // console.log('sdk businessRulesInfo: ', this.businessRulesInfo)
                            // 如果登录接口内部调用的商业化接口没有返回结果，将此接口按调用次序缓存起来，接口结果回来后一次返回
                            // cp 主动调用商业化接口不管，需要他们自己在接口返回后条件获取商业化窗口数据
                            if (this.businessRuleInvoking) {
                                this.businessWindowsQueue.push(function () { return _this.getBusinessData(params, callback); });
                                return [2 /*return*/];
                            }
                            checkCache = function () {
                                var currentDate = formatDate('YYYY-MM-DD');
                                var cacheKeyPrefix = 'rx_business_popup_';
                                var cacheKey = "".concat(cacheKeyPrefix).concat(currentDate);
                                var cache = qq.getStorageSync(cacheKey);
                                if (!cache) {
                                    cache = {};
                                    qq.setStorageSync(cacheKey, {});
                                }
                                // 删除当天之前的商业化窗口缓存
                                removeStorageByPrefix(cacheKeyPrefix, function (key) { return key.startsWith(cacheKeyPrefix) && !key.endsWith(currentDate); });
                                console.info('sdk business window cacheKey: ', cacheKey, ' cache: ', cache);
                                return { cache: cache, cacheKey: cacheKey };
                            };
                            _j.label = 1;
                        case 1:
                            _j.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, pubCheck(checkIReqBusinessData, callback, params)];
                        case 2:
                            _j.sent();
                            window_key_1 = params.window_key, event_1 = params.event, _c = params.before_event, before_event = _c === void 0 ? '' : _c;
                            _d = checkCache(), cache_1 = _d.cache, cacheKey_1 = _d.cacheKey;
                            _e = ((_a = this.businessRulesInfo.main_window_list) === null || _a === void 0 ? void 0 : _a.filter(function (window) { return window.window_key === window_key_1; }))[0], _f = _e === void 0 ? {} : _e, _g = _f.auto_popups, auto_popups = _g === void 0 ? {} : _g, _h = _f.manual_popups, manual_popups = _h === void 0 ? {} : _h;
                            matchWindows = [];
                            // 匹配自动窗口, 匹配到自动窗口，忽略前置事件
                            matchWindows = (auto_popups === null || auto_popups === void 0 ? void 0 : auto_popups[event_1]) || [];
                            // 匹配手动窗口
                            if (!(matchWindows === null || matchWindows === void 0 ? void 0 : matchWindows.length)) {
                                matchWindows = ((_b = manual_popups === null || manual_popups === void 0 ? void 0 : manual_popups[event_1]) === null || _b === void 0 ? void 0 : _b[before_event]) || [];
                            }
                            console.info('sdk matchWindows: ', matchWindows);
                            windows = compact(matchWindows.map(function (matWindow) {
                                var _a;
                                var windowInfo = (_a = _this.businessRulesInfo.window_list) === null || _a === void 0 ? void 0 : _a.find(function (window) { return window.window_key === matWindow.window_key; });
                                if (windowInfo) {
                                    if (!isNil(matWindow === null || matWindow === void 0 ? void 0 : matWindow.day_limit)) {
                                        // daily_limit 存在说明是自动弹窗
                                        var key = "".concat(window_key_1, "_").concat(event_1, "_").concat(matWindow.window_key);
                                        var count = cache_1[key] || 0;
                                        if ((matWindow === null || matWindow === void 0 ? void 0 : matWindow.day_limit) === count)
                                            return;
                                        cache_1[key] = count + 1;
                                        // console.log(key, cache[key])
                                        qq.setStorageSync(cacheKey_1, cache_1);
                                    }
                                    return windowInfo;
                                }
                            }));
                            console.log('result windows: ', windows);
                            result = { code: 0, data: windows };
                            callback.complete(result);
                            return [3 /*break*/, 4];
                        case 3:
                            error_7 = _j.sent();
                            callback.complete(handleError(error_7));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // 更新商业化窗口数据
        SdkQQ.prototype.refreshBusinessData = function (callback, isRecord) {
            return __awaiter(this, void 0, void 0, function () {
                var res, data, hit_cache, _a, version, _b, refresh_time, _c, main_window_list, _d, window_list, error_8;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            // this.loopGetBusinessRules()
                            isRecord && (this.businessRuleInvoking = true);
                            _e.label = 1;
                        case 1:
                            _e.trys.push([1, 3, 4, 5]);
                            return [4 /*yield*/, getBusinessRules(this.businessRulesInfo.version)];
                        case 2:
                            res = _e.sent();
                            data = (res === null || res === void 0 ? void 0 : res.data) || {};
                            hit_cache = data.hit_cache, _a = data.version, version = _a === void 0 ? '' : _a, _b = data.refresh_time, refresh_time = _b === void 0 ? this.businessRuleDefaultRefreshTime : _b;
                            _c = data.main_window_list, main_window_list = _c === void 0 ? [] : _c, _d = data.window_list, window_list = _d === void 0 ? [] : _d;
                            if (!hit_cache) {
                                this.businessRulesInfo.main_window_list = main_window_list;
                                this.businessRulesInfo.window_list = window_list;
                            }
                            this.businessRulesInfo.refresh_time = refresh_time;
                            this.businessRulesInfo.version = version;
                            this.businessRulesInfo.hit_cache = hit_cache;
                            (callback === null || callback === void 0 ? void 0 : callback.complete) && callback.complete({ code: 0 });
                            return [3 /*break*/, 5];
                        case 3:
                            error_8 = _e.sent();
                            (callback === null || callback === void 0 ? void 0 : callback.complete) && callback.complete(handleError(error_8));
                            return [3 /*break*/, 5];
                        case 4:
                            isRecord && this.dispatchBusinessWindowsQueue();
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        SdkQQ.prototype.dispatchBusinessWindowsQueue = function () {
            return __awaiter(this, void 0, void 0, function () {
                var execute;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.businessRuleInvoking = false;
                            execute = function () {
                                while (_this.businessWindowsQueue.length) {
                                    var queueGetBusinessData = _this.businessWindowsQueue.shift();
                                    queueGetBusinessData();
                                }
                            };
                            return [4 /*yield*/, Promise.resolve(execute())];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        // 商业化下单
        SdkQQ.prototype.requestBusinessOrder = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, err_12;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, pubCheck(checkIReqBusinessOrder, callback, params)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, businessOrderApi(params)];
                        case 2:
                            result = _a.sent();
                            callback.complete(result);
                            return [3 /*break*/, 4];
                        case 3:
                            err_12 = _a.sent();
                            callback.complete(handleError(err_12));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        //同步用户信息
        SdkQQ.prototype.infoSync = function (_a, params) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var code, _b, encryptedData, iv, data, error_9;
                var _this = this;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 4, , 5]);
                            return [4 /*yield*/, asyncFunc(qq.login)];
                        case 1:
                            code = (_c.sent()).code;
                            return [4 /*yield*/, getUserInfo({
                                    screenWidth: SYSTEM_INFO$1.screenWidth,
                                    screenHeight: SYSTEM_INFO$1.screenHeight,
                                    button: params === null || params === void 0 ? void 0 : params.button,
                                    withCredentials: true,
                                    lang: params === null || params === void 0 ? void 0 : params.lang,
                                    setInstance: function (instance) {
                                        _this._userInfoButton = instance;
                                        return instance;
                                    },
                                    autoClose: params === null || params === void 0 ? void 0 : params.autoClose,
                                    isCheck: params === null || params === void 0 ? void 0 : params.isCheck,
                                })];
                        case 2:
                            _b = _c.sent(), encryptedData = _b.encryptedData, iv = _b.iv;
                            return [4 /*yield*/, refreshUserInfo({
                                    code: code,
                                    encryptedData: encryptedData,
                                    iv: iv,
                                    version: (params === null || params === void 0 ? void 0 : params.version) || 'normal',
                                })];
                        case 3:
                            data = _c.sent();
                            complete(data);
                            return [3 /*break*/, 5];
                        case 4:
                            error_9 = _c.sent();
                            complete(handleError(error_9));
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        // 检测是否授权用户信息
        SdkQQ.prototype.isAuthorizeUserInfo = function (_a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    try {
                        qq.getSetting({
                            success: function (res) {
                                complete({
                                    code: 0,
                                    isAuthorize: res.authSetting['scope.userInfo'] === undefined
                                        ? false
                                        : res.authSetting['scope.userInfo'],
                                });
                            },
                            fail: function (err) {
                                complete({ code: 0, isAuthorize: false });
                            },
                        });
                    }
                    catch (error) {
                        complete(handleError(error));
                    }
                    return [2 /*return*/];
                });
            });
        };
        // 取消用户授权
        SdkQQ.prototype.cancelUserInfoAuthorize = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this._userInfoButton && this._userInfoButton.destroy();
                    this._userInfoButton = null;
                    return [2 /*return*/];
                });
            });
        };
        /**
         * 广告相关接口
         */
        //激励广告
        SdkQQ.prototype.rewardedVideoAd = function (data, _a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var fail, ad_1, onClose_1, catchLoadAndShowError_1, error_10;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            fail = function (error) {
                                /**
                                 * 广告错误码两种字段
                                 * 字段1: err_code
                                 * errMsg: "operateWXDataForAd:fail invalid scope"
                                 * err_code: -12001
                                 *
                                 * 字段2: errCode
                                 * errMsg: "广告单元无效"
                                 * errCode: 1002
                                 */
                                error.message = AD_ERROR_MAP[error.errCode] || error.message || error.errMsg;
                                var err = new Error(error.message);
                                // data: 保留原始错误
                                err.data = {
                                    data: error
                                };
                                complete(handleError(err));
                                _this.track({
                                    complete: function (data) {
                                        console.info('rewardedVideoAd error add complete func when tracked:', data);
                                    },
                                }, formatTrackParams({
                                    eventName: 'track_err',
                                    apiName: 'rewardedVideoAd',
                                    reqParams: data,
                                    errorInfo: error,
                                    loginInfo: USER_INFO,
                                }));
                            };
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 4, , 5]);
                            onClose_1 = function (_a) {
                                var isEnded = _a.isEnded;
                                return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_b) {
                                        ad_1.offClose(onClose_1);
                                        complete({
                                            code: 0,
                                            isEnded: isEnded,
                                        });
                                        return [2 /*return*/];
                                    });
                                });
                            };
                            if (!!this._rewardAd) return [3 /*break*/, 3];
                            ad_1 = qq.createRewardedVideoAd({
                                adUnitId: data.adUnitId,
                            });
                            return [4 /*yield*/, new Promise(function (resolve, reject) {
                                    var timer = setTimeout(function () {
                                        reject({ code: COMMON_ERROR_CODE.AD_LOAD_OVERTIME, msg: '广告加载超时' });
                                        clearTimeout(timer);
                                        timer = null;
                                    }, 10000);
                                    ad_1.onLoad(function () {
                                        _this._rewardAd = ad_1;
                                        _this._hasAd.rewarded = true;
                                        resolve();
                                    });
                                    ad_1.onError(function (error) {
                                        _this._hasAd.rewarded = false;
                                        reject(error);
                                    });
                                    ad_1.load();
                                })];
                        case 2:
                            _b.sent();
                            _b.label = 3;
                        case 3:
                            ad_1 = this._rewardAd;
                            if (data.isCheck) {
                                complete(__assign(__assign({ code: 0 }, data), { isEnded: false, ad: ad_1 }));
                            }
                            else {
                                ad_1.onClose(onClose_1);
                                catchLoadAndShowError_1 = function (error) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        fail(error);
                                        return [2 /*return*/];
                                    });
                                }); };
                                // 前面广告如果没加载成功的话，先load加载广告，成功后调用show展示广告
                                if (!this._hasAd.rewarded) {
                                    ad_1.load()
                                        .then(function () {
                                        ad_1.show().catch(function () {
                                            // 失败重试
                                            ad_1.load()
                                                .then(function () { return ad_1.show(); })
                                                .catch(catchLoadAndShowError_1);
                                        });
                                    })
                                        .catch(catchLoadAndShowError_1);
                                    return [2 /*return*/];
                                }
                                // 前面广告如果加载成功的话并且不是只检测是否有广告，调用show展示广告
                                if (!data.isCheck) {
                                    ad_1.show().catch(function () {
                                        // 失败重试
                                        ad_1.load()
                                            .then(function () { return ad_1.show(); })
                                            .catch(catchLoadAndShowError_1);
                                    });
                                }
                            }
                            return [3 /*break*/, 5];
                        case 4:
                            error_10 = _b.sent();
                            fail(error_10);
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        // banner 广告
        SdkQQ.prototype.bannerAd = function (data, _a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var ad_2, error_11, err;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 6, , 7]);
                            if (!this._bannerAd) return [3 /*break*/, 1];
                            ad_2 = this._bannerAd;
                            return [3 /*break*/, 3];
                        case 1:
                            ad_2 = qq.createBannerAd({
                                adIntervals: data.adIntervals,
                                adUnitId: data.adUnitId,
                                style: data.style,
                            });
                            return [4 /*yield*/, new Promise(function (resolve, reject) {
                                    ad_2.onLoad(function () {
                                        _this._bannerAd = ad_2;
                                        _this._hasAd.banner = true;
                                        resolve();
                                    });
                                    ad_2.onError(function (error) {
                                        _this._hasAd.banner = false;
                                        reject(error);
                                    });
                                })];
                        case 2:
                            _b.sent();
                            _b.label = 3;
                        case 3:
                            if (!!data.isCheck) return [3 /*break*/, 5];
                            return [4 /*yield*/, ad_2.show()];
                        case 4:
                            _b.sent();
                            _b.label = 5;
                        case 5:
                            complete(__assign(__assign({ code: 0 }, data), { ad: ad_2 }));
                            return [3 /*break*/, 7];
                        case 6:
                            error_11 = _b.sent();
                            error_11.message = AD_ERROR_MAP[error_11.errCode] || error_11.message || error_11.errMsg;
                            err = new Error(error_11.message);
                            // data: 保留原始错误
                            err.data = {
                                data: error_11
                            };
                            complete(handleError(err));
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        SdkQQ.prototype.hasAd = function (type) {
            if (!type)
                return this._hasAd.rewarded;
            return this._hasAd[type];
        };
        SdkQQ.prototype.getAd = function (type) {
            switch (type) {
                case 'banner':
                    return this._bannerAd;
                case 'interstitial':
                    return this._interstitialAd;
                default:
                    return this._rewardAd;
            }
        };
        // 分享调度初始化
        SdkQQ.prototype.shareSchedulingInit = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var req, res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, pubCheck(shareScheduleInitParams, callback, params)];
                        case 1:
                            _a.sent();
                            req = {
                                func: (params === null || params === void 0 ? void 0 : params.funcs) || [],
                                type: 'mini',
                                open_id: USER_INFO.openid || '',
                            };
                            return [4 /*yield*/, schedulingInitApi(req)];
                        case 2:
                            res = _a.sent();
                            this.scheduleInitMap = (res === null || res === void 0 ? void 0 : res.data) || {};
                            removeStorageByPrefix('rx_schedule');
                            callback.complete(res);
                            return [3 /*break*/, 4];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // 获取埋点调度
        SdkQQ.prototype.getShareScheduling = function (params) {
            var funcs = params === null || params === void 0 ? void 0 : params.funcs;
            if (!funcs)
                return { code: 0, data: this.scheduleInitMap };
            if (funcs && !isArray(funcs)) {
                var error = new Error('funcs must be Array');
                error.code = COMMON_ERROR_CODE.PARAMS_ERROR;
                return handleError(error);
            }
            try {
                console.log('sdk getShareScheduling: ', params, this.scheduleInitMap);
                var data = pick(this.scheduleInitMap, funcs);
                return { code: 0, data: data };
            }
            catch (error) {
                return handleError(error);
            }
        };
        // 看广告完成上报
        SdkQQ.prototype.shareSchedulingReport = function (params, callback) {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var func, region, sub_channel_id, open_id, scheduling_event, Iparams, result_1, error_13;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, pubCheck(shareScheduleReportParams, callback, params)];
                        case 1:
                            _b.sent();
                            func = params.func;
                            region = (params === null || params === void 0 ? void 0 : params.region) || USER_INFO.region || '';
                            sub_channel_id = USER_INFO.subchannelid || '';
                            open_id = USER_INFO.openid || '';
                            scheduling_event = (params === null || params === void 0 ? void 0 : params.scheduling_event) === true ? 'done' : 'fail';
                            Iparams = __assign(__assign({ platform: PLATFORM.QQ, type: 'mini', sub_channel_id: sub_channel_id, open_id: open_id }, params), { region: region, scheduling_event: scheduling_event, properties: __assign(__assign({ region: region }, this.scheuleReportProps), params === null || params === void 0 ? void 0 : params.properties) });
                            return [4 /*yield*/, schedulingReportApi(Iparams)];
                        case 2:
                            result_1 = _b.sent();
                            if (isEmpty(result_1 === null || result_1 === void 0 ? void 0 : result_1.data)) {
                                this.scheduleInitMap = omit(this.scheduleInitMap, func);
                                qq.removeStorageSync("rx_schedule_".concat(USER_INFO.tid, "_").concat(func, "_").concat(region));
                                this.shareSchedulingInit({}, {
                                    complete: function () {
                                        callback.complete(result_1);
                                    }
                                });
                                return [2 /*return*/];
                            }
                            else {
                                this.scheduleInitMap[func] = (_a = result_1 === null || result_1 === void 0 ? void 0 : result_1.data) === null || _a === void 0 ? void 0 : _a.scheduling;
                                qq.setStorageSync("rx_schedule_".concat(USER_INFO.tid, "_").concat(func, "_").concat(region), JSON.stringify(result_1));
                            }
                            callback.complete(result_1);
                            return [3 /*break*/, 4];
                        case 3:
                            error_13 = _b.sent();
                            callback.complete(handleError(error_13));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * 地理位置相关接口
         */
        //获得qq的地理位置
        SdkQQ.prototype.handleLocation = function () {
            return __awaiter(this, void 0, void 0, function () {
                var result, err_13, error;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, asyncFunc(qq.getLocation, { type: 'wgs84' })];
                        case 1:
                            result = _a.sent();
                            this.locationInfomation = result;
                            return [2 /*return*/, result];
                        case 2:
                            err_13 = _a.sent();
                            error = new Error((err_13 === null || err_13 === void 0 ? void 0 : err_13.errMsg) || 'qq.getLocation fail');
                            if (err_13 === null || err_13 === void 0 ? void 0 : err_13.errMsg.includes('deny')) {
                                error.code = COMMON_ERROR_CODE.LOCATION_AUTH_DENY;
                            }
                            else {
                                error.code = COMMON_ERROR_CODE.LOCATION_FAIL;
                            }
                            throw error;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        //获得地理位置授权 (获得地理位置公共方法)
        SdkQQ.prototype.authorizeLocation = function (callback) {
            return __awaiter(this, void 0, void 0, function () {
                var authSetting, location_1, location_2, res, openSetting, location_3, error, error_14;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 13, , 14]);
                            return [4 /*yield*/, asyncFunc(qq.getSetting)];
                        case 1:
                            authSetting = (_a.sent()).authSetting;
                            if (!(authSetting['scope.userLocation'] === true)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.handleLocation()];
                        case 2:
                            location_1 = _a.sent();
                            (callback === null || callback === void 0 ? void 0 : callback.complete) && callback.complete({ code: 0, data: location_1 });
                            return [2 /*return*/, location_1];
                        case 3:
                            if (!(authSetting['scope.userLocation'] === undefined)) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.handleLocation()];
                        case 4:
                            location_2 = _a.sent();
                            (callback === null || callback === void 0 ? void 0 : callback.complete) && callback.complete({ code: 0, data: location_2 });
                            return [2 /*return*/, location_2];
                        case 5:
                            if (!(authSetting['scope.userLocation'] != undefined &&
                                authSetting['scope.userLocation'] != true)) return [3 /*break*/, 12];
                            return [4 /*yield*/, asyncFunc(qq.showModal, {
                                    title: '是否授权当前位置',
                                    content: '需要获取您的地理位置，请确认授权，否则无法相关功能！',
                                })];
                        case 6:
                            res = _a.sent();
                            if (!res.cancel) return [3 /*break*/, 7];
                            qq.showToast({
                                title: '您已拒绝授权!',
                                icon: 'none',
                            });
                            return [3 /*break*/, 11];
                        case 7:
                            if (!res.confirm) return [3 /*break*/, 11];
                            return [4 /*yield*/, asyncFunc(qq.openSetting)];
                        case 8:
                            openSetting = _a.sent();
                            if (!(openSetting.authSetting['scope.userLocation'] === true)) return [3 /*break*/, 10];
                            qq.showToast({
                                title: '授权成功!',
                                icon: 'none',
                            });
                            return [4 /*yield*/, this.handleLocation()];
                        case 9:
                            location_3 = _a.sent();
                            (callback === null || callback === void 0 ? void 0 : callback.complete) && callback.complete({ code: 0, data: location_3 });
                            return [2 /*return*/, location_3];
                        case 10:
                            qq.showToast({
                                title: '授权失败!',
                                icon: 'none',
                            });
                            _a.label = 11;
                        case 11:
                            error = new Error('您已拒绝授权');
                            error.code = COMMON_ERROR_CODE.LOCATION_AUTH_DENY;
                            throw error;
                        case 12: return [3 /*break*/, 14];
                        case 13:
                            error_14 = _a.sent();
                            if (callback === null || callback === void 0 ? void 0 : callback.complete) {
                                callback.complete(handleError(error_14));
                            }
                            else {
                                throw error_14;
                            }
                            return [3 /*break*/, 14];
                        case 14: return [2 /*return*/];
                    }
                });
            });
        };
        //上报的http接口
        SdkQQ.prototype.reportLocationHttpFun = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var location_4, report, error_15;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.authorizeLocation()];
                        case 1:
                            location_4 = _a.sent();
                            return [4 /*yield*/, reportLocationUpdata({
                                    lon: location_4.longitude,
                                    lat: location_4.latitude,
                                    types: params.types,
                                })];
                        case 2:
                            report = _a.sent();
                            return [2 /*return*/, report];
                        case 3:
                            error_15 = _a.sent();
                            if (callback === null || callback === void 0 ? void 0 : callback.complete) {
                                callback.complete(handleError(error_15));
                            }
                            else {
                                throw error_15;
                            }
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        //开始上报经纬度坐标
        SdkQQ.prototype.startReportLoaction = function (params, _a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var resReport, error_16;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, pubCheck(ReportLoactionCheckParams, { complete: complete }, params)];
                        case 1:
                            _b.sent();
                            if (this.reportLocationTimer != null)
                                return [2 /*return*/];
                            params.reportSpace =
                                params.reportSpace < 30000 || params.reportSpace == undefined ? 30000 : params.reportSpace;
                            return [4 /*yield*/, this.reportLocationHttpFun(params)];
                        case 2:
                            resReport = _b.sent();
                            complete(resReport);
                            this.reportLocationTimer = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.reportLocationHttpFun(params)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }, params.reportSpace);
                            return [3 /*break*/, 4];
                        case 3:
                            error_16 = _b.sent();
                            complete(handleError(error_16));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        //停止上报经纬度
        SdkQQ.prototype.stopReportLocation = function () {
            clearInterval(this.reportLocationTimer);
            this.reportLocationTimer = null;
        };
        //删除经纬度坐标
        SdkQQ.prototype.deleteReportLocation = function (params, _a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var result, error_17;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, pubCheck(DeleteLoactionCheckParams2, { complete: complete }, params)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, deleteReportLocation(params)];
                        case 2:
                            result = _b.sent();
                            complete(result);
                            return [3 /*break*/, 4];
                        case 3:
                            error_17 = _b.sent();
                            complete(handleError(error_17));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        //获得半径内用户
        SdkQQ.prototype.getNearlyPeasonByRadius = function (params, _a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var location_5, result, error_18;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 5, , 6]);
                            location_5 = this.locationInfomation;
                            if (!(location_5 == null)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.authorizeLocation()];
                        case 1:
                            location_5 = _b.sent();
                            _b.label = 2;
                        case 2: return [4 /*yield*/, pubCheck(getNearlyRediusCheckParams, { complete: complete }, params)];
                        case 3:
                            _b.sent();
                            return [4 /*yield*/, getNearlyPeasonByRadius(__assign({ lon: location_5.longitude, lat: location_5.latitude }, params))];
                        case 4:
                            result = _b.sent();
                            complete(result);
                            return [3 /*break*/, 6];
                        case 5:
                            error_18 = _b.sent();
                            complete(handleError(error_18));
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * 轮训获取公共属性
         *
         */
        SdkQQ.prototype.loopGetPublicProps = function () {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var event_public_attr, repeat, getPublicPropsConfig;
                var _this = this;
                return __generator(this, function (_b) {
                    event_public_attr = (_a = this.initConfig) === null || _a === void 0 ? void 0 : _a.event_public_attr;
                    if (isEmpty(event_public_attr))
                        return [2 /*return*/];
                    repeat = function (ms) {
                        event_public_attr.timerId && clearTimeout(event_public_attr.timerId);
                        event_public_attr.timerId = setTimeout(function () { return getPublicPropsConfig(); }, ms);
                    };
                    getPublicPropsConfig = function () { return __awaiter(_this, void 0, void 0, function () {
                        var res, _a, _b, refresh, public_attr, _c, version, initParams, error_19;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    _d.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, getPublicProps(event_public_attr.version)];
                                case 1:
                                    res = _d.sent();
                                    _a = (res === null || res === void 0 ? void 0 : res.data) || {}, _b = _a.refresh, refresh = _b === void 0 ? this.businessRuleDefaultRefreshTime : _b, public_attr = _a.public_attr, _c = _a.version, version = _c === void 0 ? '' : _c;
                                    event_public_attr.public_attr = public_attr || event_public_attr.public_attr;
                                    event_public_attr.refresh = refresh;
                                    event_public_attr.version = version;
                                    initParams = qq.getStorageSync('rx-init-params');
                                    // 获取到最新的version后更新到缓存中，下次初始化的时候用这个最新的version请求初始化配置接口
                                    qq.setStorageSync('rx-init-params', __assign(__assign({}, initParams), { version: __assign(__assign({}, initParams.version), { event_public_attr: version }) }));
                                    repeat(event_public_attr.refresh);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_19 = _d.sent();
                                    handleError(error_19);
                                    if (this.trackPublicPropsFailCount < 1) {
                                        // 首次获取失败3秒后重试
                                        this.trackPublicPropsFailCount += 1;
                                        repeat(3000);
                                    }
                                    else {
                                        // 再失败每十分钟后重试，直至成功
                                        this.trackPublicPropsFailCount += 1;
                                        repeat(600000);
                                    }
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); };
                    repeat(event_public_attr === null || event_public_attr === void 0 ? void 0 : event_public_attr.refresh);
                    return [2 /*return*/];
                });
            });
        };
        /**
         * 设置公共属性
         * 设置后CP无需每次上报都传，由SDK填入properties中。
         */
        SdkQQ.prototype.setPublicProperties = function (params) {
            if (!isObject$1(params) || Array.isArray(params)) {
                var error = new Error('params must be object');
                error.code = COMMON_ERROR_CODE.PAY_PARAMS_ERROR;
                return handleError(error);
            }
            try {
                qq.setStorageSync('rx_public_props', params);
                return { code: 0 };
            }
            catch (error) {
                return handleError(error);
            }
        };
        /**
         * 修改设置的公共数据。
         */
        SdkQQ.prototype.updatePublicProperties = function (params) {
            if (!isObject$1(params) || Array.isArray(params)) {
                var error = new Error('params must be object');
                error.code = COMMON_ERROR_CODE.PAY_PARAMS_ERROR;
                return handleError(error);
            }
            try {
                var cache = qq.getStorageSync('rx_public_props');
                qq.setStorageSync('rx_public_props', __assign(__assign({}, cache), params));
                return { code: 0 };
            }
            catch (error) {
                return handleError(error);
            }
        };
        /**
         * 删除公共属性
         */
        SdkQQ.prototype.deletePublicProperties = function (params) {
            if (!Array.isArray(params)) {
                var error = new Error('params must be array');
                error.code = COMMON_ERROR_CODE.PARAMS_ERROR;
                return handleError(error);
            }
            try {
                var cache = qq.getStorageSync('rx_public_props');
                var rest = omit(cache, params);
                qq.setStorageSync('rx_public_props', rest);
                return { code: 0 };
            }
            catch (error) {
                return handleError(error);
            }
        };
        SdkQQ.prototype.getPublicProperties = function () {
            var data = qq.getStorageSync("rx_public_props");
            return { code: 0, data: data };
        };
        return SdkQQ;
    }(SdkCommon));

    return SdkQQ;

}));
//# sourceMappingURL=channel-sdk.qq.v2.dev.umd.js.map
