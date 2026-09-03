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

    var toString = Object.prototype.toString;
    function is(val, type) {
        return toString.call(val) === "[object ".concat(type, "]");
    }
    function isString(val) {
        return is(val, 'String');
    }
    function isBoolean(val) {
        return is(val, 'Boolean');
    }
    function isFunction$1(val) {
        return typeof val === 'function';
    }
    function isObject(val) {
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
        if (isObject(val)) {
            return Object.keys(val).length === 0;
        }
        return false;
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

    var setcustomCheck = {
        custom: {
            type: 'string',
            required: true,
        },
    };
    var relationTypesCheck = function (rule, value) {
        return new Promise(function (resolve, reject) {
            if (!isObject(value)) {
                reject('types must be Object');
            }
            for (var key in value) {
                var item = value[key];
                if (!isBoolean(item)) {
                    reject('types member value must be boolean');
                }
            }
            resolve(true);
        });
    };
    var relationCommonRule = {
        //对方 OpenID
        target: {
            type: 'string',
            required: true,
        },
        // CP 自定义关系类型
        type: {
            type: 'string',
            required: true,
        },
        //用户给Target设置的备注信息（最长512字符）
        target_remarks: {
            type: 'string',
        },
        //Target给用户设置的备注信息（最长512字符）
        user_remarks: {
            type: 'string',
        },
    };
    var addRelationCheck = __assign({ types: {
            //CP 自定义关系类型列表，其值是一个 map 简直对列表，格式为：
            required: true,
            asyncValidator: relationTypesCheck,
        } }, omit(relationCommonRule, 'type'));
    var deleteRelationCheck = __assign({ types: {
            //CP 自定义关系类型列表，其值是一个 map 简直对列表，格式为：
            required: true,
            asyncValidator: relationTypesCheck,
        } }, pick(relationCommonRule, 'target'));
    var updateremarksCheck = omit(relationCommonRule, 'user_remarks');
    var hasRelationCheck = pick(relationCommonRule, ['target', 'type']);
    var relationListCheck = pick(relationCommonRule, 'type');
    var addFriendCheck = omit(relationCommonRule, 'type');
    var delfriendCheck = pick(relationCommonRule, 'target');
    var updatefriendremarksCheck = pick(relationCommonRule, ['target', 'target_remarks']);
    var addscoreCheck = {
        rank_id: {
            type: 'string',
            required: true,
        },
        score: {
            type: 'number',
            required: true,
        },
    };
    var queryuserrankCheck = {
        rank_id: {
            type: 'string',
            required: true,
        },
        open_id: {
            type: 'string',
            required: true,
        },
    };
    var getranklimitlistCheck = {
        rank_id: {
            type: 'string',
            required: true,
        },
        start_rank: {
            type: 'number',
            required: true,
        },
        end_rank: {
            type: 'number',
            required: true,
        },
    };
    var getranklistCheck = {
        rank_id: {
            type: 'string',
            required: true,
        },
    };

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

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

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
    var MODAL_TITLE = '温馨提示';
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
    var TM_TYPE = {
        CLIENT: 1,
        SERVER: 0, // 服务端上报
    };

    var lzString = createCommonjsModule(function (module) {
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
    // 检查wx存储方法是否可用
    // 辅助函数：判断是否为函数
    function isFunction(fn) {
        return typeof fn === 'function';
    }
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
    // 删除存储（别名方法，保持与wx API一致）
    var removeStorageSync = function (key) {
        customRemoveStorageSync(key);
    };
    // 根据前缀删除存储
    var removeStorageByPrefix = function (prefix, predict) {
        var targetKeys = [];
        try {
            if (SYSTEM_INFO$1.isWxAvailable) {
                var info = wx.getStorageInfoSync();
                targetKeys = info.keys.filter(function (key) {
                    return isFunction(predict) ? predict(key) : key.startsWith(prefix);
                });
                targetKeys.forEach(function (key) { return wx.removeStorageSync(key); });
            }
        }
        catch (error) {
            // 忽略错误
        }
        // 同时删除内存中的数据
        var memoryKeys = Object.keys(memoryStore);
        targetKeys = memoryKeys.filter(function (key) {
            return isFunction(predict) ? predict(key) : key.startsWith(prefix);
        });
        targetKeys.forEach(function (key) {
            delete memoryStore[key];
            delete expireMap[key];
        });
    };
    // 上报数据存储相关常量
    var TRACK_KEYS_STORAGE_KEY = 'rx_track_collect_keys'; // 存储所有时间戳key的列表
    var TRACK_DATA_PREFIX = 'rx_track_collect_'; // 数据存储key前缀
    var TRACK_LOCK_KEY = 'rx_track_collect_lock'; // 当前被锁定的时间戳key（单个）
    var MAX_ITEMS_PER_KEY = 100; // 每个key最多存储的数据条数
    var MAX_KEYS = 5; // 最多存储的时间戳数量（严格控制）
    // 定时器ID
    var trackReportTimerId = null;
    // 当前定时器间隔
    var currentTrackInterval = 60000;
    // 最小上报间隔（毫秒）
    var MIN_FLUSH_INTERVAL = 100;
    // 默认上报间隔（1分钟）
    var DEFAULT_FLUSH_INTERVAL = 60000;
    // 上报API函数引用
    var currentTrackApiFunc = null;
    // 默认缓存数据上限
    var DEFAULT_MAX_CACHE_COUNT = 100;
    // 最小缓存数据上限
    var MIN_MAX_CACHE_COUNT = 100;
    // 最大缓存数据上限
    var MAX_MAX_CACHE_COUNT = 1000;
    // 当前缓存数据上限
    var currentMaxCacheCount = DEFAULT_MAX_CACHE_COUNT;
    // 是否正在执行立即上报（用于暂停定时上报）
    var isImmediateReporting = false;
    // 上报失败冷却时间（毫秒），防止失败后频繁重试
    var REPORT_FAIL_COOLDOWN = 10000;
    // 上次上报失败时间
    var lastReportFailTime = 0;
    // 锁超时时间（毫秒），超过此时间的锁自动失效
    var LOCK_TIMEOUT = 30000;
    /**
     * 将上报数据存入storage
     * key为时间戳，每个key最多存100条数据，严格控制最多5个时间戳
     * 如果当前key被锁定（正在上报中），则创建新的时间戳继续写入
     * 如果已达到5个上限且无法删除，则丢弃新数据
     * 注意：此函数内部已做完善的异常处理，不会抛出错误
     */
    var saveTrackDataToStorage = function (data) {
        try {
            // 数据验证，防止存储无效数据
            if (data === undefined || data === null) {
                console.warn('存储数据为空，跳过');
                return;
            }
            // 获取当前所有时间戳key列表
            var trackKeys = [];
            try {
                trackKeys = customGetStorageSync(TRACK_KEYS_STORAGE_KEY) || [];
                // 确保是数组
                if (!Array.isArray(trackKeys)) {
                    trackKeys = [];
                }
            }
            catch (e) {
                console.error('获取时间戳列表失败，使用空数组:', e);
                trackKeys = [];
            }
            // 获取被锁定的时间戳key（单个，正在上报中的），使用超时机制
            var lockedKey_1 = getValidLock() || '';
            // 获取最新的时间戳key
            var currentKey = trackKeys.length > 0 ? trackKeys[trackKeys.length - 1] : null;
            var currentData = [];
            if (currentKey) {
                try {
                    currentData = customGetStorageSync("".concat(TRACK_DATA_PREFIX).concat(currentKey)) || [];
                    // 确保是数组
                    if (!Array.isArray(currentData)) {
                        currentData = [];
                    }
                }
                catch (e) {
                    console.error('获取当前时间戳数据失败，使用空数组:', e);
                    currentData = [];
                }
            }
            // 判断是否需要创建新的时间戳key：
            // 1. 当前key不存在
            // 2. 当前key已满100条
            // 3. 当前key被锁定（正在上报中）
            var isCurrentKeyLocked = currentKey === lockedKey_1;
            var needNewKey = !currentKey || currentData.length >= MAX_ITEMS_PER_KEY || isCurrentKeyLocked;
            if (needNewKey) {
                // 严格控制5个上限
                if (trackKeys.length >= MAX_KEYS) {
                    // 找到最旧的未被锁定的key删除
                    var oldestKeyIndex = trackKeys.findIndex(function (key) { return key !== lockedKey_1; });
                    if (oldestKeyIndex !== -1) {
                        var oldestKey = trackKeys.splice(oldestKeyIndex, 1)[0];
                        try {
                            customRemoveStorageSync("".concat(TRACK_DATA_PREFIX).concat(oldestKey));
                        }
                        catch (e) {
                            // 忽略删除错误
                        }
                        console.log('删除最旧的未锁定时间戳:', oldestKey);
                    }
                    else {
                        // 所有key都被锁定（理论上最多只有1个被锁定），丢弃新数据
                        console.warn('已达到5个时间戳上限且无法删除，丢弃新数据');
                        return;
                    }
                }
                var newKey = String(Date.now());
                // 添加新的时间戳key
                trackKeys.push(newKey);
                try {
                    customSetStorageSync(TRACK_KEYS_STORAGE_KEY, trackKeys);
                }
                catch (e) {
                    console.error('保存时间戳列表失败:', e);
                    return;
                }
                // 存储数据到新的key
                try {
                    customSetStorageSync("".concat(TRACK_DATA_PREFIX).concat(newKey), [data]);
                }
                catch (e) {
                    console.error('保存数据失败:', e);
                    return;
                }
            }
            else {
                // 当前key未满且未被锁定，追加数据
                currentData.push(data);
                try {
                    customSetStorageSync("".concat(TRACK_DATA_PREFIX).concat(currentKey), currentData);
                }
                catch (e) {
                    console.error('保存数据失败:', e);
                    return;
                }
            }
            console.log('数据已存储, 当前时间戳数量:', trackKeys.length);
        }
        catch (error) {
            console.error('存储数据失败:', error);
        }
    };
    /**
     * 锁定指定的时间戳key，防止继续写入
     * 存储结构：{ key: string, lockedAt: number }
     */
    var lockTrackKey = function (key) {
        customSetStorageSync(TRACK_LOCK_KEY, {
            key: key,
            lockedAt: Date.now()
        });
    };
    /**
     * 解锁时间戳key
     */
    var unlockTrackKey = function () {
        customRemoveStorageSync(TRACK_LOCK_KEY);
    };
    /**
     * 获取有效的锁（如果锁已超时，自动解锁并返回 null）
     * @returns 锁定的 key，如果无锁或锁已超时返回 null
     */
    var getValidLock = function () {
        try {
            var lock = customGetStorageSync(TRACK_LOCK_KEY);
            // 没有锁
            if (!lock) {
                return null;
            }
            // 兼容旧数据：如果是字符串格式（旧版本的锁），当作已超时处理
            if (typeof lock === 'string') {
                console.warn('检测到旧版本锁格式，自动清除:', lock);
                unlockTrackKey();
                return null;
            }
            // 检查锁是否超时
            var lockAge = Date.now() - lock.lockedAt;
            if (lockAge > LOCK_TIMEOUT) {
                console.warn("\u9501\u5DF2\u8D85\u65F6 (".concat(Math.round(lockAge / 1000), "\u79D2)\uFF0C\u81EA\u52A8\u89E3\u9501:"), lock.key);
                unlockTrackKey();
                return null;
            }
            // 锁有效
            return lock.key;
        }
        catch (e) {
            console.error('获取锁失败:', e);
            return null;
        }
    };
    /**
     * 删除已上报的数据（单个时间戳）
     */
    var removeTrackData = function (key) {
        try {
            var trackKeys = customGetStorageSync(TRACK_KEYS_STORAGE_KEY) || [];
            // 从列表中移除该key
            trackKeys = trackKeys.filter(function (k) { return k !== key; });
            customSetStorageSync(TRACK_KEYS_STORAGE_KEY, trackKeys);
            // 删除对应的数据
            customRemoveStorageSync("".concat(TRACK_DATA_PREFIX).concat(key));
            // 解锁
            unlockTrackKey();
            console.log('数据已删除, 剩余时间戳数量:', trackKeys.length);
        }
        catch (error) {
            console.error('删除数据失败:', error);
        }
    };
    /**
     * 获取当前缓存数据总量
     * @returns 所有时间戳中的数据总条数
     */
    var getTotalCacheCount = function () {
        try {
            var trackKeys = customGetStorageSync(TRACK_KEYS_STORAGE_KEY) || [];
            var totalCount = 0;
            for (var _i = 0, trackKeys_1 = trackKeys; _i < trackKeys_1.length; _i++) {
                var key = trackKeys_1[_i];
                var data = customGetStorageSync("".concat(TRACK_DATA_PREFIX).concat(key)) || [];
                if (Array.isArray(data)) {
                    totalCount += data.length;
                }
            }
            return totalCount;
        }
        catch (error) {
            console.error('获取缓存数据总量失败:', error);
            return 0;
        }
    };
    /**
     * 更新缓存数据上限
     * @param maxCount 新的缓存上限，必须是100-1000之间的正整数
     */
    var updateMaxCacheCount = function (maxCount) {
        // 确保在有效范围内
        var validCount = Math.min(Math.max(Math.round(maxCount), MIN_MAX_CACHE_COUNT), MAX_MAX_CACHE_COUNT);
        if (validCount !== currentMaxCacheCount) {
            currentMaxCacheCount = validCount;
        }
    };
    /**
     * 触发立即上报（当缓存数据达到上限时调用）
     * 暂停定时上报，执行一次完整上报，完成后重启定时器
     * 注意：此函数内部已做完善的异常处理，不会抛出错误
     */
    var triggerImmediateReport = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // 前置检查，快速返回
                    if (!currentTrackApiFunc) {
                        console.warn('无法触发立即上报：定时器未初始化');
                        return [2 /*return*/];
                    }
                    if (isImmediateReporting) {
                        console.log('正在执行立即上报，跳过');
                        return [2 /*return*/];
                    }
                    // 设置标志位要在 try 外面，确保即使后续代码出错也能正确设置
                    isImmediateReporting = true;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    // 暂停定时上报
                    if (trackReportTimerId) {
                        try {
                            clearInterval(trackReportTimerId);
                        }
                        catch (e) {
                            // 忽略清除定时器的错误
                        }
                        trackReportTimerId = null;
                        console.log('暂停定时上报，开始立即上报');
                    }
                    // 执行上报（已有内部异常处理）
                    return [4 /*yield*/, reportTrackDataOnce(currentTrackApiFunc)];
                case 2:
                    // 执行上报（已有内部异常处理）
                    _a.sent();
                    console.log('立即上报完成，重启定时器');
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error('立即上报异常:', error_1);
                    // 记录失败时间，防止频繁重试
                    lastReportFailTime = Date.now();
                    return [3 /*break*/, 5];
                case 4:
                    // 确保标志位被重置
                    isImmediateReporting = false;
                    // 重启定时器（使用 try-catch 保护）
                    try {
                        if (currentTrackApiFunc && !trackReportTimerId) {
                            trackReportTimerId = setInterval(function () {
                                try {
                                    if (!isImmediateReporting) {
                                        console.log('定时上报数据');
                                        reportTrackDataOnce(currentTrackApiFunc);
                                    }
                                }
                                catch (e) {
                                    console.error('定时上报回调异常:', e);
                                }
                            }, currentTrackInterval);
                            console.log('定时上报已重启，间隔:', currentTrackInterval, '毫秒');
                        }
                    }
                    catch (e) {
                        console.error('重启定时器失败:', e);
                    }
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    /**
     * 检查是否需要立即上报（缓存数据量达到上限）
     * @returns 是否需要立即上报
     */
    var shouldTriggerImmediateReport = function () {
        try {
            // 如果正在上报中，不触发
            if (isImmediateReporting) {
                return false;
            }
            // 如果上次上报失败且在冷却时间内，不触发
            if (lastReportFailTime > 0 && (Date.now() - lastReportFailTime) < REPORT_FAIL_COOLDOWN) {
                return false;
            }
            var totalCount = getTotalCacheCount();
            return totalCount >= currentMaxCacheCount;
        }
        catch (error) {
            console.error('检查是否需要立即上报失败:', error);
            return false;
        }
    };
    /**
     * 压缩数据
     * @param data 要压缩的数据
     * @returns 压缩后的 base64 字符串，失败返回空字符串
     */
    var compressData = function (data) {
        try {
            var jsonStr = JSON.stringify(data);
            return lzString.compressToBase64(jsonStr) || '';
        }
        catch (error) {
            console.error('压缩数据失败:', error);
            return '';
        }
    };
    /**
     * 上报单个时间戳的数据
     * @param trackApiFunc 上报API函数
     * @param key 时间戳key
     * @returns 是否上报成功
     */
    var reportSingleTimestamp = function (trackApiFunc, key) { return __awaiter(void 0, void 0, void 0, function () {
        var data, compressedData, originalSize, compressedSize, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    data = customGetStorageSync("".concat(TRACK_DATA_PREFIX).concat(key)) || [];
                    if (data.length === 0) {
                        // 数据为空，直接删除该key
                        removeTrackData(key);
                        return [2 /*return*/, true];
                    }
                    // 锁定当前时间戳
                    lockTrackKey(key);
                    compressedData = compressData(data);
                    // 压缩失败，跳过本次上报，解锁并返回失败
                    if (!compressedData) {
                        console.error('压缩数据为空，跳过上报:', key);
                        unlockTrackKey();
                        lastReportFailTime = Date.now();
                        return [2 /*return*/, false];
                    }
                    originalSize = 0;
                    try {
                        originalSize = JSON.stringify(data).length;
                    }
                    catch (e) {
                        // 忽略统计错误
                    }
                    compressedSize = compressedData.length;
                    if (originalSize > 0) {
                        console.log("\u4E0A\u62A5\u6570\u636E, \u65F6\u95F4\u6233: ".concat(key, ", \u6570\u636E\u6761\u6570: ").concat(data.length, ", \u539F\u59CB\u5927\u5C0F: ").concat(originalSize, " \u5B57\u8282, \u538B\u7F29\u540E: ").concat(compressedSize, " \u5B57\u8282, \u538B\u7F29\u7387: ").concat(((1 - compressedSize / originalSize) * 100).toFixed(1), "%"));
                    }
                    else {
                        console.log("\u4E0A\u62A5\u6570\u636E, \u65F6\u95F4\u6233: ".concat(key, ", \u6570\u636E\u6761\u6570: ").concat(data.length, ", \u538B\u7F29\u540E: ").concat(compressedSize, " \u5B57\u8282"));
                    }
                    // 调用上报API
                    return [4 /*yield*/, trackApiFunc(compressedData)
                        // 上报成功，删除已上报的数据（会自动解锁）
                    ];
                case 1:
                    // 调用上报API
                    _a.sent();
                    // 上报成功，删除已上报的数据（会自动解锁）
                    removeTrackData(key);
                    // 上报成功，重置失败冷却时间
                    lastReportFailTime = 0;
                    console.log('时间戳上报成功:', key);
                    return [2 /*return*/, true];
                case 2:
                    error_2 = _a.sent();
                    console.error('时间戳上报失败:', key, error_2);
                    // 上报失败，解锁，记录失败时间
                    unlockTrackKey();
                    lastReportFailTime = Date.now();
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // 每次上报的最大时间戳数量
    var MAX_REPORT_KEYS_PER_ROUND = 5;
    /**
     * 简单上报（忽略锁、缓存等逻辑，直接上报）
     * 用于记录执行日志，无论成功失败都不影响主流程
     * @param trackApiFunc 上报API函数
     * @param data 要上报的数据
     */
    var reportSimple = function (trackApiFunc, data) { return __awaiter(void 0, void 0, void 0, function () {
        var compressedData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!trackApiFunc || !data)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    compressedData = compressData(Array.isArray(data) ? data : [data]);
                    if (!compressedData) return [3 /*break*/, 3];
                    return [4 /*yield*/, trackApiFunc(compressedData)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    /**
     * 执行分批上报（按时间戳顺序逐个上报，每轮最多5个）
     * 每次触发时，按先后顺序逐个上报时间戳数据，每轮最多上报5个时间戳
     * 注意：此函数内部已做完善的异常处理，不会抛出错误
     * @param trackApiFunc 上报API函数
     */
    var reportTrackDataOnce = function (trackApiFunc) { return __awaiter(void 0, void 0, void 0, function () {
        var reportStatus, reportedCount, errorMsg, lockedKey, trackKeys, keysToReport, remainingCount, _i, keysToReport_1, key, success, e_2, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    reportStatus = 'started';
                    reportedCount = 0;
                    errorMsg = '';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 8, 9, 10]);
                    lockedKey = getValidLock();
                    if (lockedKey) {
                        console.log('有正在上报中的时间戳，跳过本次:', lockedKey);
                        reportStatus = 'skipped_locked';
                        return [2 /*return*/];
                    }
                    trackKeys = [];
                    try {
                        trackKeys = customGetStorageSync(TRACK_KEYS_STORAGE_KEY) || [];
                    }
                    catch (e) {
                        console.error('获取时间戳列表失败:', e);
                        reportStatus = 'error_get_keys';
                        return [2 /*return*/];
                    }
                    if (!Array.isArray(trackKeys) || trackKeys.length === 0) {
                        console.log('没有需要上报的数据');
                        reportStatus = 'no_data';
                        return [2 /*return*/];
                    }
                    keysToReport = trackKeys.slice(0, MAX_REPORT_KEYS_PER_ROUND);
                    remainingCount = trackKeys.length - keysToReport.length;
                    console.log("\u5F00\u59CB\u5206\u6279\u4E0A\u62A5, \u672C\u8F6E\u4E0A\u62A5 ".concat(keysToReport.length, " \u4E2A\u65F6\u95F4\u6233").concat(remainingCount > 0 ? ", \u5269\u4F59 ".concat(remainingCount, " \u4E2A\u7B49\u5F85\u4E0B\u8F6E\u4E0A\u62A5") : ''));
                    _i = 0, keysToReport_1 = keysToReport;
                    _a.label = 2;
                case 2:
                    if (!(_i < keysToReport_1.length)) return [3 /*break*/, 7];
                    key = keysToReport_1[_i];
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, reportSingleTimestamp(trackApiFunc, key)];
                case 4:
                    success = _a.sent();
                    if (!success) {
                        // 上报失败，停止本次上报任务，等待下次触发
                        console.log('上报失败，停止本次上报任务');
                        reportStatus = 'partial_fail';
                        return [3 /*break*/, 7];
                    }
                    reportedCount++;
                    return [3 /*break*/, 6];
                case 5:
                    e_2 = _a.sent();
                    console.error('单个时间戳上报异常:', key, e_2);
                    errorMsg = String(e_2);
                    reportStatus = 'error_single';
                    // 尝试解锁，防止锁死
                    try {
                        unlockTrackKey();
                    }
                    catch (unlockError) {
                        // 忽略解锁错误
                    }
                    return [3 /*break*/, 7];
                case 6:
                    _i++;
                    return [3 /*break*/, 2];
                case 7:
                    if (reportStatus === 'started') {
                        reportStatus = 'success';
                    }
                    console.log("\u672C\u8F6E\u4E0A\u62A5\u5B8C\u6210, \u6210\u529F\u4E0A\u62A5 ".concat(reportedCount, " \u4E2A\u65F6\u95F4\u6233"));
                    return [3 /*break*/, 10];
                case 8:
                    error_3 = _a.sent();
                    console.error('上报任务异常:', error_3);
                    reportStatus = 'error';
                    errorMsg = String(error_3);
                    // 尝试解锁，防止锁死
                    try {
                        unlockTrackKey();
                    }
                    catch (unlockError) {
                        // 忽略解锁错误
                    }
                    return [3 /*break*/, 10];
                case 9:
                    // 只有在有数据的情况下才记录执行日志（没有数据时不上报）
                    if (reportStatus !== 'no_data') {
                        try {
                            reportSimple(currentTrackApiFunc, {
                                type: 'track',
                                event: '#rxsdk_report_log',
                                uuid: v4_1(),
                                distinct_id: USER_INFO.openid,
                                platform_id: 4,
                                product_id: SYSTEM_INFO$1.productId,
                                cpid: Number(SYSTEM_INFO$1.cpid),
                                channel_id: SYSTEM_INFO$1.channelId,
                                devicecode: SYSTEM_INFO$1.deviceCode || '',
                                properties: {
                                    status: reportStatus,
                                    count: reportedCount,
                                    error: errorMsg || undefined
                                }
                            });
                        }
                        catch (error) {
                            // 忽略日志上报错误
                        }
                    }
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    }); };
    /**
     * 启动定时上报定时器
     * @param trackApiFunc 上报API函数（接收压缩后的字符串）
     * @param interval 上报间隔，默认1分钟（60000毫秒）
     */
    var startTrackReportTimer = function (trackApiFunc, interval) {
        if (interval === void 0) { interval = DEFAULT_FLUSH_INTERVAL; }
        // 保存API函数引用，用于后续动态更新间隔
        currentTrackApiFunc = trackApiFunc;
        // 确保间隔不小于最小值
        var validInterval = Math.max(interval, MIN_FLUSH_INTERVAL);
        currentTrackInterval = validInterval;
        // 如果已有定时器，先清除
        if (trackReportTimerId) {
            clearInterval(trackReportTimerId);
            trackReportTimerId = null;
        }
        // 初始化时先清除可能残留的锁（防止上次异常退出导致锁未释放）
        try {
            unlockTrackKey();
            console.log('初始化时清除残留锁');
        }
        catch (e) {
            // 忽略清除锁的错误
        }
        console.log('启动定时上报定时器, 间隔:', validInterval, '毫秒');
        // 启动定时器
        trackReportTimerId = setInterval(function () {
            try {
                // 如果正在执行立即上报，跳过本次定时上报
                if (isImmediateReporting) {
                    console.log('正在执行立即上报，跳过定时上报');
                    return;
                }
                console.log('定时上报数据');
                reportTrackDataOnce(trackApiFunc);
            }
            catch (error) {
                console.error('定时上报回调异常:', error);
            }
        }, validInterval);
    };
    /**
     * 动态更新上报间隔
     * @param interval 新的上报间隔（毫秒），最小值为200毫秒
     */
    var updateTrackReportInterval = function (interval) {
        // 确保间隔不小于最小值
        var validInterval = Math.max(interval, MIN_FLUSH_INTERVAL);
        // 如果间隔没有变化，不需要重启定时器
        if (validInterval === currentTrackInterval) {
            return;
        }
        // 如果没有API函数引用，无法重启定时器
        if (!currentTrackApiFunc) {
            console.warn('无法更新上报间隔：定时器未初始化');
            return;
        }
        console.log('更新上报间隔:', currentTrackInterval, '->', validInterval, '毫秒');
        // 重启定时器
        startTrackReportTimer(currentTrackApiFunc, validInterval);
    };

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
    function getAdShareDataApi(data) {
        return doRequest({
            url: '/v1/operationapi/ad/data',
            method: 'POST',
            data: data
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
    var uploadGameInteractionInfoApi = function (data) {
        return doRequest({
            url: '/v1/social/gameinteraction/info',
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
    //客户端支付成功回调给服务端
    var payCallback = function (url, data) {
        return doRequest({
            method: 'POST',
            url: url,
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
    // 上报压缩后的大数据（带 content-encoding: lz 请求头）
    var trackCompressedApi = function (data) {
        return doRequest({
            method: 'POST',
            url: '/v1/data/api/track',
            data: data,
            header: {
                'content-encoding': 'lz'
            }
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
    var msgSecCheckApi = function (data) {
        return doRequest({
            method: 'POST',
            url: '/v1/risk/sensitive/weixin_content/scan',
            data: data
        });
    };
    var mediaCheckAsyncApi = function (data) {
        return doRequest({
            method: 'POST',
            url: '/v1/risk/sensitive/media/check',
            data: data
        });
    };
    var activated = function (data) {
        return doRequest({
            method: 'POST',
            url: '/v1/attribution/user/activated',
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
    var getPhoneNumberApi = function (code) {
        return doRequest({
            url: '/v1/passport/user/bind_phone/minigame_code',
            method: 'POST',
            data: { code: code }
        });
    };
    var changePhoneNumberApi = function (code) {
        return doRequest({
            url: '/v1/passport/user/change_phone/minigame_code',
            method: 'POST',
            data: { code: code }
        });
    };
    var getAdSourceApi = function () {
        return doRequest({
            url: '/v1/attribution/adsource',
            method: 'GET'
        });
    };
    // 上报微信订阅消息
    var requestSubscribeMessageApi = function (data) {
        return doRequest({
            url: '/v1/thirdparty/api/wx_sub_msg_report',
            method: 'POST',
            data: data
        });
    };
    // 游戏区服信息查询
    function getGameAreaApi(area_id) {
        return doRequest({
            url: '/v1/report/sdk/cp/game_area',
            method: 'GET',
            params: {
                area_id: area_id
            },
        });
    }
    // 游戏区服信息修改
    function putGameAreaApi(data) {
        return doRequest({
            url: '/v1/report/sdk/cp/game_area',
            method: 'PUT',
            data: data,
        });
    }
    // 创建游戏区服
    function createGameAreaApi(data) {
        return doRequest({
            url: '/v1/report/sdk/cp/game_area',
            method: 'POST',
            data: data,
        });
    }
    // 删除游戏区服
    function delGameAreaApi(data) {
        return doRequest({
            url: '/v1/report/sdk/cp/game_area',
            method: 'DELETE',
            data: data,
        });
    }
    // 查询区服列表信息
    function getGameAreaListApi() {
        return doRequest({
            url: '/v1/report/sdk/cp/game_area/list',
            method: 'GET',
        });
    }
    // 创建角色
    function createGameCharacterApi(data) {
        return doRequest({
            url: '/v1/report/sdk/cp/game_character',
            method: 'POST',
            data: data
        });
    }
    // 修改游戏角色信息
    function putGameCharacterApi(data) {
        return doRequest({
            url: '/v1/report/sdk/cp/game_character',
            method: 'PUT',
            data: data
        });
    }
    // 删除游戏角色
    function delGameCharacterApi(data) {
        return doRequest({
            url: '/v1/report/sdk/cp/game_character',
            method: 'DELETE',
            data: data
        });
    }
    // 查询账号下角色信息列表
    function getGameCharacterAccountApi(params) {
        return doRequest({
            url: '/v1/report/sdk/cp/game_character/account',
            method: 'GET',
            params: params
        });
    }
    // 查询账号下某个区服下的角色信息列表
    function getGameCharacterApi(params) {
        return doRequest({
            url: '/v1/report/sdk/cp/game_character/account/area',
            method: 'GET',
            params: params
        });
    }
    // 查询具体角色信息
    function getGameAccountAreaCharacterApi(params) {
        return doRequest({
            url: '/v1/report/sdk/cp/game_character/account/area/character',
            method: 'GET',
            params: params
        });
    }
    // 兑换道具
    function itemRedemptionApi(data) {
        return doRequest({
            url: '/v1/operationtoolsapi/user_data_operation_platform/item_redemption',
            method: 'POST',
            data: data
        });
    }
    // 邮件列表
    function getEmailListApi(data) {
        return doRequest({
            url: '/v1/operationtoolsapi/rxmail/cpuser/list',
            method: 'POST',
            data: data
        });
    }
    // 邮件详情
    function getEmailDetailApi(data) {
        return doRequest({
            url: '/v1/operationtoolsapi/rxmail/cpuser/detail',
            method: 'POST',
            data: data
        });
    }
    // 邮件领取
    function receiveEmailApi(data) {
        return doRequest({
            url: '/v1/operationtoolsapi/rxmail/cpuser/receive',
            method: 'POST',
            data: data
        });
    }
    // 邮件删除
    function delEmailApi(data) {
        return doRequest({
            url: '/v1/operationtoolsapi/rxmail/cpuser/delete',
            method: 'POST',
            data: data
        });
    }
    // 设置接跳转url并获取短链接
    function getShortUrlApi(data) {
        return doRequest({
            url: '/v1/url/short',
            method: 'POST',
            data: data
        });
    }
    // 动态消息-创建被分享动态消息的
    function createActivityIdApi(data) {
        return doRequest({
            url: '/v1/thirdparty/sdk/create_activity_id',
            method: 'POST',
            data: data
        });
    }
    // 动态消息-创建被分享动态消息的
    function setDynamicMsgApi(data) {
        return doRequest({
            url: '/v1/thirdparty/sdk/set_updatable_msg',
            method: 'POST',
            data: data
        });
    }
    // 获取文本短链
    function getShortTextApi(short_name) {
        return doRequest({
            url: '/v1/text/short',
            method: 'GET',
            params: {
                short_name: short_name
            }
        });
    }
    // 获取文本短链
    function getUrlParseApi(params) {
        return doRequest({
            url: '/v1/operationapi/url/parse',
            method: 'GET',
            params: params
        });
    }
    // 设置文本短链
    function setShortTextApi(text) {
        return doRequest({
            url: '/v1/text/short',
            method: 'POST',
            data: {
                text: text
            }
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
    function searchGameAccountApi() {
        return doRequest({
            url: '/v1/report/sdk/cp_role',
            method: 'get'
        });
    }
    // 动态消息-chatTool
    function setChatToolMsgApi(data) {
        return doRequest({
            url: '/v1/thirdparty/sdk/chat_tool_msg_send',
            method: 'POST',
            data: data
        });
    }
    var getIpApi = function () {
        return doRequest({
            url: '/',
            method: 'GET'
        });
    };
    var getOrderStatusApi = function (order_no) {
        return doRequest({
            url: '/v1/ke/user_get_order_info',
            method: 'GET',
            params: { order_no: order_no }
        });
    };
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
    var getDevicecode$1 = function () {
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
                devicecode: getDevicecode$1(),
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
                devicecode: getDevicecode$1(),
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
        var devicecode = getDevicecode$1();
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
    // 清理所有残留的队列和缓存（用于调试和清理）
    function clearAllQueuesAndCache() {
        try {
            var queueCount = requestQueueMap.size;
            var cacheCount = successResultCache.size;
            requestQueueMap.clear();
            successResultCache.clear();
            // printLog(`[请求队列] 清理所有队列和缓存，队列数量: ${queueCount}, 缓存数量: ${cacheCount}`)
        }
        catch (error) {
        }
    }

    var setcustomApi = function (data) {
        return doRequest({
            url: '/v1/social/user/setcustom',
            method: 'POST',
            data: data,
        });
    };
    var addRelationApi = function (data) {
        return doRequest({
            url: '/v1/social/relation/add',
            method: 'POST',
            data: data,
        });
    };
    var deleteRelationApi = function (data) {
        return doRequest({
            url: '/v1/social/relation/delete',
            method: 'POST',
            data: data,
        });
    };
    var updateremarksApi = function (data) {
        return doRequest({
            url: '/v1/social/relation/updateremarks',
            method: 'POST',
            data: data,
        });
    };
    var hasrelationApi = function (data) {
        return doRequest({
            url: '/v1/social/relation/hasrelation',
            method: 'POST',
            data: data,
        });
    };
    var relationListApi = function (data) {
        return doRequest({
            url: '/v1/social/relation/list',
            method: 'POST',
            data: data,
        });
    };
    var addfriendApi = function (data) {
        return doRequest({
            url: '/v1/social/relation/addfriend',
            method: 'POST',
            data: data,
        });
    };
    var delfriendApi = function (data) {
        return doRequest({
            url: '/v1/social/relation/delfriend',
            method: 'POST',
            data: data,
        });
    };
    var updatefriendremarksApi = function (data) {
        return doRequest({
            url: '/v1/social/relation/updatefriendremarks',
            method: 'POST',
            data: data,
        });
    };
    var isfriendApi = function (data) {
        return doRequest({
            url: '/v1/social/relation/isfriend',
            method: 'POST',
            data: data,
        });
    };
    var friendsApi = function () {
        return doRequest({
            url: '/v1/social/relation/friends',
            method: 'POST',
        });
    };
    var addscoreApi = function (data) {
        return doRequest({
            url: '/v1/social/rank/addscore',
            method: 'POST',
            data: data,
        });
    };
    var setscoreApi = function (data) {
        return doRequest({
            url: '/v1/social/rank/setscore',
            method: 'POST',
            data: data,
        });
    };
    var queryuserrankApi = function (data) {
        return doRequest({
            url: '/v1/social/rank/queryuserrank',
            method: 'POST',
            data: data,
        });
    };
    var getranklistApi = function (data) {
        return doRequest({
            url: '/v1/social/rank/getranklist',
            method: 'POST',
            data: data,
        });
    };
    var friendsrankApi = function (data) {
        return doRequest({
            url: '/v1/social/rank/friendsrank',
            method: 'POST',
            data: data,
        });
    };
    var opendataAesdecodeApi = function (data) {
        return doRequest({
            url: '/v1/social/wxrank/aesdecode',
            method: 'POST',
            data: data,
        });
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
            if (!isObject(callback) || !callback.hasOwnProperty('complete')) {
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

    //社交关系
    var SdkSocial = /** @class */ (function () {
        function SdkSocial() {
            this.refreshSession = 0; //用于记录刷新session
        }
        Object.defineProperty(SdkSocial, "I", {
            get: function () {
                return this.instance || (this.instance = new SdkSocial());
            },
            enumerable: false,
            configurable: true
        });
        //用户管理
        SdkSocial.prototype.setcustom = function (params, _a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var result, err_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, pubCheck(setcustomCheck, { complete: complete }, params)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, setcustomApi({ custom: params.custom })];
                        case 2:
                            result = _b.sent();
                            console.log(result);
                            complete(result);
                            return [3 /*break*/, 4];
                        case 3:
                            err_1 = _b.sent();
                            complete(handleError(err_1));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        //添加自定义关系
        SdkSocial.prototype.addRelation = function (params, _a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var result, err_2;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, pubCheck(addRelationCheck, { complete: complete }, params)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, addRelationApi(params)];
                        case 2:
                            result = _b.sent();
                            complete(result);
                            return [3 /*break*/, 4];
                        case 3:
                            err_2 = _b.sent();
                            complete(handleError(err_2));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        //删除自定义关系
        SdkSocial.prototype.deleteRelation = function (params, _a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var result, err_3;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, pubCheck(deleteRelationCheck, { complete: complete }, params)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, deleteRelationApi(params)];
                        case 2:
                            result = _b.sent();
                            complete(result);
                            return [3 /*break*/, 4];
                        case 3:
                            err_3 = _b.sent();
                            complete(handleError(err_3));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        //更新自定关系备注
        SdkSocial.prototype.updateremarks = function (params, _a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var result, err_4;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, pubCheck(updateremarksCheck, { complete: complete }, params)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, updateremarksApi(params)];
                        case 2:
                            result = _b.sent();
                            complete(result);
                            return [3 /*break*/, 4];
                        case 3:
                            err_4 = _b.sent();
                            complete(handleError(err_4));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        //判断两用户是否存在某自定关系
        SdkSocial.prototype.hasRelation = function (params, _a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var result, err_5;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, pubCheck(hasRelationCheck, { complete: complete }, params)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, hasrelationApi(params)];
                        case 2:
                            result = _b.sent();
                            complete(result);
                            return [3 /*break*/, 4];
                        case 3:
                            err_5 = _b.sent();
                            complete(handleError(err_5));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        //获取自定关系列表
        SdkSocial.prototype.relationList = function (params, _a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var result, err_6;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, pubCheck(relationListCheck, { complete: complete }, params)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, relationListApi({ type: params.type })];
                        case 2:
                            result = _b.sent();
                            complete(result);
                            return [3 /*break*/, 4];
                        case 3:
                            err_6 = _b.sent();
                            complete(handleError(err_6));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        //添加好友关系
        SdkSocial.prototype.addFriend = function (params, _a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var result, err_7;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, pubCheck(addFriendCheck, { complete: complete }, params)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, addfriendApi(params)];
                        case 2:
                            result = _b.sent();
                            complete(result);
                            return [3 /*break*/, 4];
                        case 3:
                            err_7 = _b.sent();
                            complete(handleError(err_7));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        //删除好友关系
        SdkSocial.prototype.delfriend = function (params, _a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var result, err_8;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, pubCheck(delfriendCheck, { complete: complete }, params)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, delfriendApi(params)];
                        case 2:
                            result = _b.sent();
                            complete(result);
                            return [3 /*break*/, 4];
                        case 3:
                            err_8 = _b.sent();
                            complete(handleError(err_8));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        //更新好友备注
        SdkSocial.prototype.updatefriendremarks = function (params, _a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var result, err_9;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, pubCheck(updatefriendremarksCheck, { complete: complete }, params)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, updatefriendremarksApi(params)];
                        case 2:
                            result = _b.sent();
                            complete(result);
                            return [3 /*break*/, 4];
                        case 3:
                            err_9 = _b.sent();
                            complete(handleError(err_9));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        //判断两用户是否为好友
        SdkSocial.prototype.isfriend = function (params, _a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var result, err_10;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, pubCheck(delfriendCheck, { complete: complete }, params)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, isfriendApi(params)];
                        case 2:
                            result = _b.sent();
                            complete(result);
                            return [3 /*break*/, 4];
                        case 3:
                            err_10 = _b.sent();
                            complete(handleError(err_10));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        //获取好友关系列表
        SdkSocial.prototype.friends = function (_a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var result, err_11;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, friendsApi()];
                        case 1:
                            result = _b.sent();
                            complete(result);
                            return [3 /*break*/, 3];
                        case 2:
                            err_11 = _b.sent();
                            complete(handleError(err_11));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * 排行榜相关接口
         */
        //增加用户分数
        SdkSocial.prototype.addscore = function (params, _a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var result, err_12;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, pubCheck(addscoreCheck, { complete: complete }, params)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, addscoreApi(params)];
                        case 2:
                            result = _b.sent();
                            complete(result);
                            return [3 /*break*/, 4];
                        case 3:
                            err_12 = _b.sent();
                            complete(handleError(err_12));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        //设置用户分数
        SdkSocial.prototype.setscore = function (params, _a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var result, err_13;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, pubCheck(addscoreCheck, { complete: complete }, params)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, setscoreApi(params)];
                        case 2:
                            result = _b.sent();
                            complete(result);
                            return [3 /*break*/, 4];
                        case 3:
                            err_13 = _b.sent();
                            complete(handleError(err_13));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        //查询用户分数
        SdkSocial.prototype.queryuserrank = function (params, _a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var result, err_14;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, pubCheck(queryuserrankCheck, { complete: complete }, params)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, queryuserrankApi(params)];
                        case 2:
                            result = _b.sent();
                            complete(result);
                            return [3 /*break*/, 4];
                        case 3:
                            err_14 = _b.sent();
                            complete(handleError(err_14));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        //获取排行榜列表
        SdkSocial.prototype.getranklist = function (params, _a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var result, err_15;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, pubCheck(getranklimitlistCheck, { complete: complete }, params)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, getranklistApi(params)];
                        case 2:
                            result = _b.sent();
                            complete(result);
                            return [3 /*break*/, 4];
                        case 3:
                            err_15 = _b.sent();
                            complete(handleError(err_15));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        //获取好友排行榜列表
        SdkSocial.prototype.friendsrank = function (params, _a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var result, err_16;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, pubCheck(getranklistCheck, { complete: complete }, params)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, friendsrankApi(params)];
                        case 2:
                            result = _b.sent();
                            complete(result);
                            return [3 /*break*/, 4];
                        case 3:
                            err_16 = _b.sent();
                            complete(handleError(err_16));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * 开放数据相关接口
         */
        //是否授权使用你的微信朋友信息
        SdkSocial.prototype.authorizeWxFriendInteraction = function (callback) {
            return __awaiter(this, void 0, void 0, function () {
                function authDenyed(err) {
                    var error = new Error((err === null || err === void 0 ? void 0 : err.errMsg) || 'authorize WxFriendInteraction:fail auth deny');
                    error.code = COMMON_ERROR_CODE.FRIENDINTERACTION_AUTH_DENY;
                    if (callback === null || callback === void 0 ? void 0 : callback.complete) {
                        callback.complete(handleError(error));
                        return;
                    }
                    throw error;
                }
                var authSetting, res, openSetting, err_17;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 10, , 11]);
                            return [4 /*yield*/, asyncFunc(wx.getSetting)];
                        case 1:
                            authSetting = (_a.sent()).authSetting;
                            console.log('authSetting: ', authSetting['scope.WxFriendInteraction']);
                            if (!(authSetting['scope.WxFriendInteraction'] === true)) return [3 /*break*/, 2];
                            //console.log('已经同意授权授权')
                            (callback === null || callback === void 0 ? void 0 : callback.complete) && callback.complete({ code: 0 });
                            return [2 /*return*/, true];
                        case 2:
                            if (!(authSetting['scope.WxFriendInteraction'] === undefined)) return [3 /*break*/, 4];
                            // scope.WxFriendInteraction === undefined代表用户未授权且第一次登陆
                            //console.log('从未授权过')
                            return [4 /*yield*/, asyncFunc(wx.authorize, { scope: 'scope.WxFriendInteraction' })];
                        case 3:
                            // scope.WxFriendInteraction === undefined代表用户未授权且第一次登陆
                            //console.log('从未授权过')
                            _a.sent();
                            (callback === null || callback === void 0 ? void 0 : callback.complete) && callback.complete({ code: 0 });
                            return [2 /*return*/, true];
                        case 4:
                            if (!(authSetting['scope.WxFriendInteraction'] != undefined &&
                                authSetting['scope.WxFriendInteraction'] != true)) return [3 /*break*/, 9];
                            return [4 /*yield*/, asyncFunc(wx.showModal, {
                                    title: '申请使用你的微信朋友信息',
                                    // content: '需要获取您的微信朋友信息，请确认授权，否则无法相关功能！',
                                    cancelText: '拒绝',
                                    confirmText: '允许',
                                })];
                        case 5:
                            res = _a.sent();
                            if (!res.cancel) return [3 /*break*/, 6];
                            wx.showToast({
                                title: '您已拒绝授权!',
                                icon: 'none',
                            });
                            return [3 /*break*/, 8];
                        case 6:
                            if (!res.confirm) return [3 /*break*/, 8];
                            return [4 /*yield*/, asyncFunc(wx.openSetting)];
                        case 7:
                            openSetting = _a.sent();
                            if (openSetting.authSetting['scope.WxFriendInteraction'] === true) {
                                wx.showToast({
                                    title: '授权成功!',
                                    icon: 'none',
                                });
                                (callback === null || callback === void 0 ? void 0 : callback.complete) && callback.complete({ code: 0 });
                                return [2 /*return*/, true];
                            }
                            else {
                                wx.showToast({
                                    title: '授权失败!',
                                    icon: 'none',
                                });
                            }
                            _a.label = 8;
                        case 8: return [2 /*return*/, authDenyed()];
                        case 9: return [3 /*break*/, 11];
                        case 10:
                            err_17 = _a.sent();
                            return [2 /*return*/, authDenyed(err_17)];
                        case 11: return [2 /*return*/];
                    }
                });
            });
        };
        SdkSocial.prototype.getUserInteractiveStorage = function (params, _a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var _b, iv, encryptedData, res, err_18;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 4, , 5]);
                            return [4 /*yield*/, this.authorizeWxFriendInteraction()];
                        case 1:
                            _c.sent();
                            return [4 /*yield*/, asyncFunc(wx.getUserInteractiveStorage, {
                                    keyList: (params === null || params === void 0 ? void 0 : params.keyList) || [],
                                })];
                        case 2:
                            _b = _c.sent(), iv = _b.iv, encryptedData = _b.encryptedData;
                            return [4 /*yield*/, opendataAesdecodeApi({ iv: iv, encrypted_data: encryptedData })];
                        case 3:
                            res = _c.sent();
                            complete(res);
                            return [3 /*break*/, 5];
                        case 4:
                            err_18 = _c.sent();
                            complete(handleError(err_18));
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        //是否授权使用你的游戏圈数据
        SdkSocial.prototype.authorizeWxGameClubData = function (callback) {
            return __awaiter(this, void 0, void 0, function () {
                function authDenyed(err) {
                    var error = new Error((err === null || err === void 0 ? void 0 : err.errMsg) || 'authorize gameClubData:fail auth deny');
                    error.code = COMMON_ERROR_CODE.GAMECLUBDATA_AUTH_DENY;
                    if (callback === null || callback === void 0 ? void 0 : callback.complete) {
                        callback.complete(handleError(error));
                        return;
                    }
                    throw error;
                }
                var authSetting, res, openSetting, err_19;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 10, , 11]);
                            return [4 /*yield*/, asyncFunc(wx.getSetting)];
                        case 1:
                            authSetting = (_a.sent()).authSetting;
                            console.log('authSetting: ', authSetting['scope.gameClubData']);
                            if (!(authSetting['scope.gameClubData'] === true)) return [3 /*break*/, 2];
                            //console.log('已经同意授权授权')
                            (callback === null || callback === void 0 ? void 0 : callback.complete) && callback.complete({ code: 0 });
                            return [2 /*return*/, true];
                        case 2:
                            if (!(authSetting['scope.gameClubData'] === undefined)) return [3 /*break*/, 4];
                            //console.log('从未授权过')
                            return [4 /*yield*/, asyncFunc(wx.authorize, { scope: 'scope.gameClubData' })];
                        case 3:
                            //console.log('从未授权过')
                            _a.sent();
                            (callback === null || callback === void 0 ? void 0 : callback.complete) && callback.complete({ code: 0 });
                            return [2 /*return*/, true];
                        case 4:
                            if (!(authSetting['scope.gameClubData'] != undefined &&
                                authSetting['scope.gameClubData'] != true)) return [3 /*break*/, 9];
                            return [4 /*yield*/, asyncFunc(wx.showModal, {
                                    title: '申请使用你的游戏圈加入、发表、点赞数据',
                                    cancelText: '拒绝',
                                    confirmText: '允许',
                                })];
                        case 5:
                            res = _a.sent();
                            if (!res.cancel) return [3 /*break*/, 6];
                            wx.showToast({
                                title: '您已拒绝授权!',
                                icon: 'none',
                            });
                            return [3 /*break*/, 8];
                        case 6:
                            if (!res.confirm) return [3 /*break*/, 8];
                            return [4 /*yield*/, asyncFunc(wx.openSetting)];
                        case 7:
                            openSetting = _a.sent();
                            if (openSetting.authSetting['scope.gameClubData'] === true) {
                                wx.showToast({
                                    title: '授权成功!',
                                    icon: 'none',
                                });
                                (callback === null || callback === void 0 ? void 0 : callback.complete) && callback.complete({ code: 0 });
                                return [2 /*return*/, true];
                            }
                            else {
                                wx.showToast({
                                    title: '授权失败!',
                                    icon: 'none',
                                });
                            }
                            _a.label = 8;
                        case 8: return [2 /*return*/, authDenyed()];
                        case 9: return [3 /*break*/, 11];
                        case 10:
                            err_19 = _a.sent();
                            return [2 /*return*/, authDenyed(err_19)];
                        case 11: return [2 /*return*/];
                    }
                });
            });
        };
        //获得游戏圈数据
        SdkSocial.prototype.getGameClubData = function (params, _a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var sessionOverdue, _b, iv, encryptedData, res, err_20;
                var _this = this;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            sessionOverdue = function (err) { return __awaiter(_this, void 0, void 0, function () {
                                var result;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!((err === null || err === void 0 ? void 0 : err.code) == 192802 && this.refreshSession < 2)) return [3 /*break*/, 2];
                                            this.refreshSession++;
                                            return [4 /*yield*/, this.refreshSessionFunc()];
                                        case 1:
                                            result = _a.sent();
                                            if (result == 1) {
                                                this.getGameClubData(params, { complete: complete });
                                            }
                                            else {
                                                complete(handleError(err));
                                            }
                                            return [3 /*break*/, 3];
                                        case 2:
                                            complete(handleError(err));
                                            _a.label = 3;
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); };
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 5, , 6]);
                            return [4 /*yield*/, this.authorizeWxGameClubData()];
                        case 2:
                            _c.sent();
                            return [4 /*yield*/, asyncFunc(wx.getGameClubData, {
                                    dataTypeList: (params === null || params === void 0 ? void 0 : params.dataTypeList) || [],
                                })];
                        case 3:
                            _b = _c.sent(), iv = _b.iv, encryptedData = _b.encryptedData, _b.signature;
                            return [4 /*yield*/, opendataAesdecodeApi({ iv: iv, encrypted_data: encryptedData })];
                        case 4:
                            res = _c.sent();
                            this.refreshSession = 0;
                            complete(res);
                            return [3 /*break*/, 6];
                        case 5:
                            err_20 = _c.sent();
                            sessionOverdue(err_20);
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        SdkSocial.prototype.setUserCloudStorage = function (params, _a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var err_21;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, asyncFunc(wx.setUserCloudStorage, {
                                    KVDataList: (params === null || params === void 0 ? void 0 : params.KVDataList) || [],
                                })];
                        case 1:
                            _b.sent();
                            complete({ code: 0 });
                            return [3 /*break*/, 3];
                        case 2:
                            err_21 = _b.sent();
                            complete(handleError(err_21));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SdkSocial.prototype.getUserCloudStorage = function (params, _a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var res, err_22;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, asyncFunc(wx.getUserCloudStorage, {
                                    keyList: (params === null || params === void 0 ? void 0 : params.keyList) || [],
                                })];
                        case 1:
                            res = _b.sent();
                            complete({ code: 0, data: (res === null || res === void 0 ? void 0 : res.KVDataList) || [] });
                            return [3 /*break*/, 3];
                        case 2:
                            err_22 = _b.sent();
                            complete(handleError(err_22));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SdkSocial.prototype.removeUserCloudStorage = function (params, _a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var err_23;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, asyncFunc(wx.removeUserCloudStorage, {
                                    keyList: (params === null || params === void 0 ? void 0 : params.keyList) || [],
                                })];
                        case 1:
                            _b.sent();
                            complete({ code: 0 });
                            return [3 /*break*/, 3];
                        case 2:
                            err_23 = _b.sent();
                            complete(handleError(err_23));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SdkSocial.prototype.getUserCloudStorageKeys = function (_a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var res, err_24;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, asyncFunc(wx.getUserCloudStorageKeys)];
                        case 1:
                            res = _b.sent();
                            complete({ code: 0, data: (res === null || res === void 0 ? void 0 : res.keys) || [] });
                            return [3 /*break*/, 3];
                        case 2:
                            err_24 = _b.sent();
                            complete(handleError(err_24));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SdkSocial.prototype.getFriendCloudStorage = function (params, _a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var res, err_25;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, asyncFunc(wx.getFriendCloudStorage, {
                                    keyList: (params === null || params === void 0 ? void 0 : params.keyList) || [],
                                })];
                        case 1:
                            res = _b.sent();
                            complete({ code: 0, data: (res === null || res === void 0 ? void 0 : res.data) || [] });
                            return [3 /*break*/, 3];
                        case 2:
                            err_25 = _b.sent();
                            complete(handleError(err_25));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SdkSocial.prototype.getPotentialFriendList = function (_a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var res, err_26;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, asyncFunc(wx.getPotentialFriendList)];
                        case 1:
                            res = _b.sent();
                            complete({ code: 0, data: (res === null || res === void 0 ? void 0 : res.list) || [] });
                            return [3 /*break*/, 3];
                        case 2:
                            err_26 = _b.sent();
                            complete(handleError(err_26));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SdkSocial.prototype.refreshSessionFunc = function () {
            return __awaiter(this, void 0, void 0, function () {
                var code;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, asyncFunc(wx.login)];
                        case 1:
                            code = (_a.sent()).code;
                            return [4 /*yield*/, refreshUserInfo({
                                    version: 'base',
                                    code: code,
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, 1];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, -1];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        return SdkSocial;
    }());

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

    var wegameShareCheckParams = {
        func: {
            type: 'string',
            required: true,
        },
    };
    var compensateOrderCheckParams = {
        notify_url: {
            type: 'string',
        },
        wx_openid: {
            type: 'string',
            required: true,
        },
        order_no: {
            type: 'string',
            required: true,
        },
        amount: {
            type: 'number',
            required: true,
        },
        env: {
            type: 'enum',
            enum: [0, 1],
        },
        zone_id: {
            type: 'string',
            required: true,
        },
        pf: {
            type: 'enum',
            required: true,
            enum: ['android'],
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
    var msgSecCheck = {
        content: {
            type: 'string',
            required: true,
        },
        scene: {
            type: 'enum',
            required: true,
            enum: [1, 2, 3, 4],
        },
        title: {
            type: 'string',
        },
        nickname: {
            type: 'string',
        },
        signature: {
            type: 'string',
        },
    };
    var mediaCheckAsyncCheck = {
        urls: {
            type: 'array',
            required: true,
        },
        scenes: {
            type: 'array',
            required: true,
        },
    };
    var wegamePayCheckParams = {
        pay_type: {
            type: 'enum',
            required: true,
            enum: ['minigame', 'minigame_friend', 'wxpub', 'minigame_v2', 'midas_game_item', 'aums', 'jump_miniprogram', 'wechath5', 'minigame_meituan', 'midas_payment_game_item'],
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
        mode: {
            type: 'enum',
            enum: ['coins', 'goods'],
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
        sessionFromExt: {
            type: 'object',
        },
    };

    var getSystemInfo = function () {
        try {
            if (typeof window !== 'undefined' && !window.wx)
                return {
                    system: '',
                };
            return wx.getSystemInfoSync();
        }
        catch (e) {
            return {};
        }
    };
    function getSearchQueries(ifStringify) {
        var _a = wx.getLaunchOptionsSync(), query = _a.query, extraData = _a.referrerInfo.extraData;
        extraData = extraData || {};
        query = __assign(__assign({}, query), extraData);
        return ifStringify ? qs.stringify(query) : query;
    }

    // 支付凭证已经使用过
    var VOUCHERUSED = 302408;
    // 支付凭证无效
    var VOUCHEREXPIRED = 302409;
    function fibonacci(n) {
        var _a;
        if (n === 1)
            return 1;
        var first = 1, second = 1;
        for (var i = 3; i <= n; i++) {
            _a = [second, first + second], first = _a[0], second = _a[1];
        }
        return second;
    }
    var useSupplementOrder = function () {
        var timeoutId = null;
        var start = 0;
        // 自动补单五次
        var max = 5;
        // 是否正处于自动补单中
        var isSupplying = false;
        // 无效的支付凭证错误码
        var expiredVoucherCode = [VOUCHERUSED, VOUCHEREXPIRED];
        var toggleSupplyStatus = function (bool) { return isSupplying = bool; };
        var isDropOrder = function (errCode) {
            return ([152407, 152401, 182001, 142601, 142602, 152403, 152404].includes(errCode) ||
                (errCode >= 1000 && errCode < 2000));
        };
        var dynamicSupplementOrder = function () { return __awaiter(void 0, void 0, void 0, function () {
            var isHasCompensateOrder, notify_url, wx_openid, order_no, amount, env, zone_id, pf, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        isHasCompensateOrder = customGetStorageSync("rx_".concat(USER_INFO.tid));
                        if (!isHasCompensateOrder) return [3 /*break*/, 5];
                        console.info('sdk 进入自动补单', start);
                        toggleSupplyStatus(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        notify_url = isHasCompensateOrder.notify_url, wx_openid = isHasCompensateOrder.wx_openid, order_no = isHasCompensateOrder.order_no, amount = isHasCompensateOrder.amount, env = isHasCompensateOrder.env, zone_id = isHasCompensateOrder.zone_id, pf = isHasCompensateOrder.pf;
                        return [4 /*yield*/, payCallback(notify_url, {
                                wx_openid: wx_openid,
                                order_no: order_no,
                                amount: amount,
                                env: env,
                                zone_id: zone_id,
                                pf: pf,
                            })
                            // 补单成功后删除补单凭证，清除补单状态和定时器
                        ];
                    case 2:
                        _a.sent();
                        // 补单成功后删除补单凭证，清除补单状态和定时器
                        removeStorageSync("rx_".concat(USER_INFO.tid));
                        reset();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        if (expiredVoucherCode.includes(err_1 === null || err_1 === void 0 ? void 0 : err_1.code)) {
                            // 如果支付回调接口失败的原因是支付凭证已经用过或者是失效，清除补单支付凭证
                            removeStorageSync("rx_".concat(USER_INFO.tid));
                            reset();
                            return [2 /*return*/];
                        }
                        // console.log('res: ')
                        repeat(fibonacci(start));
                        return [3 /*break*/, 4];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        /**
                         * 进入场景
                         * 自动补单轮训中，手动调用支付接口，触发补单，成功后删除补单凭证，自动补单轮训下次找不到补单凭证，需要清除补单状态和定时器
                         */
                        reset();
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        var repeat = function (ms) {
            timeoutId && clearTimeout(timeoutId);
            start++;
            if (start > max) {
                toggleSupplyStatus(false);
                return;
            }
            timeoutId = setTimeout(function () { return dynamicSupplementOrder(); }, ms * 5000);
        };
        var handleDynamicSupplementOrder = function () {
            if (isSupplying) {
                console.info('sdk 自动补单进行中，请勿cue');
                return;
            }
            // dynamicSupplementOrder()
            repeat(fibonacci(start));
        };
        var reset = function () {
            start = 1;
            timeoutId && clearTimeout(timeoutId);
            toggleSupplyStatus(false);
        };
        return {
            expiredVoucherCode: expiredVoucherCode,
            isDropOrder: isDropOrder,
            handleDynamicSupplementOrder: handleDynamicSupplementOrder,
            dynamicSupplementOrder: dynamicSupplementOrder,
        };
    };

    var systemInfo = getSystemInfo();
    var getPlatformId = function () {
        var map = { android: 1, ios: 2, windows: 3, mac: 4 };
        return map[systemInfo.platform] || 0;
    };
    var SYSTEM_INFO = Object.assign({}, systemInfo, {
        fromChannel: 'minigame',
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

    var showMap = {};
    function arrayBufferToJson(arrayBuffer) {
        try {
            var uint8Array = new Uint8Array(arrayBuffer);
            var text = '';
            for (var i = 0; i < uint8Array.length; i++) {
                text += String.fromCharCode(uint8Array[i]);
            }
            try {
                return JSON.parse(text);
            }
            catch (error) {
                return {};
            }
        }
        catch (err) {
            return {};
        }
    }
    function formatTime(milliseconds) {
        var totalSeconds = Math.floor(milliseconds / 1000);
        var hours = Math.floor(totalSeconds / 3600);
        totalSeconds = totalSeconds % 3600;
        var minutes = Math.floor(totalSeconds / 60);
        var seconds = totalSeconds % 60;
        return "".concat(hours, "\u5C0F\u65F6").concat(minutes, "\u5206").concat(seconds, "\u79D2");
    }
    var _a = useSupplementOrder(), expiredVoucherCode = _a.expiredVoucherCode, isDropOrder = _a.isDropOrder, handleDynamicSupplementOrder = _a.handleDynamicSupplementOrder;
    var getDevicecode = function () {
        var devicecode = customGetStorageSync('rx_devicecode');
        if (devicecode) {
            return devicecode.code;
        }
        else {
            var code = v4_1();
            customSetStorageSync('rx_devicecode', { code: code, openIds: {} });
            return code;
        }
    };
    function validateNumber(num) {
        var numStr = num.toString();
        var isSixDigits = /^\d{6}$/.test(numStr);
        if (!isSixDigits) {
            return false;
        }
        var thirdDigit = parseInt(numStr[2]);
        var fourthDigit = parseInt(numStr[3]);
        return "".concat(thirdDigit).concat(fourthDigit) === '20';
    }
    var handleTrackError = function (error_action, error, code, type) {
        if (error_action === void 0) { error_action = ''; }
        var error_exception = '';
        try {
            error_exception = JSON.stringify(error.exception || {});
        }
        catch (e) {
        }
        var handle_error = handleError(error, code);
        if (validateNumber(handle_error.code) || !handle_error.isServerError) {
            // 使用实例的 subChannelId
            var sub_channel_id = (sdkWegameInstance === null || sdkWegameInstance === void 0 ? void 0 : sdkWegameInstance.subChannelId) || '';
            trackApi([
                {
                    event: '#rx_error',
                    type: 'track',
                    time: formatDate('YYYY-MM-DDTHH:mm:ss.SSSZ'),
                    uuid: v4_1(),
                    sub_channel_id: sub_channel_id,
                    distinct_id: USER_INFO.openid,
                    platform_id: 4,
                    product_id: SYSTEM_INFO$1.productId,
                    cpid: Number(SYSTEM_INFO$1.cpid),
                    channel_id: SYSTEM_INFO$1.channelId,
                    devicecode: getDevicecode(),
                    properties: __assign(__assign({}, (type ? { type: type } : {})), { error_action: error_action, error_exception: error_exception, error_type: 'sdk', trace_id: v4_1(), rx_version: SYSTEM_INFO$1.__RX_SDK_VERSION, type_tripartite: PLATFORM.WECHAT, request_address: handle_error.url || '', request_header: handle_error.request_header || '', request_body: handle_error.request_body || '', error_code: handle_error.code, error_message: handle_error.msg || '', error_code_tripartite: handle_error.thirdcode || '', error_message_tripartite: handle_error.thirdmsg || '', cp_userid: USER_INFO.cp_user_id, error_ext: '请前往 https://doc.ruixueyun.com/#/view?path=9e58d663-7313-498c-b95c-f8706ec09bdd 查看解决方案' })
                }
            ]).catch(function (e) {
                console.log(e);
            });
        }
        return __assign(__assign(__assign({ code: handle_error.code, msg: handle_error.msg }, (handle_error.thirdcode !== undefined ? { thirdcode: handle_error.thirdcode } : {})), (handle_error.thirdmsg !== undefined ? { thirdmsg: handle_error.thirdmsg } : {})), { thirdexception: error.exception || {} });
    };
    var onReportFail = function (result) {
        console.error('onReportFail', result);
        handleTrackError('rxlog_error_ad', __assign(__assign({}, result), { exception: result }), undefined, 'rxlog_error_gdt');
    };
    var handleGdtTrackResult = function (result) {
        console.log('handleGdtTrackResult', result);
        if (result && result.code !== 0) {
            onReportFail(result);
        }
        return result;
    };
    var tencent_sdk = null;
    // 存储 SdkWegame 实例，供 handleTrackError 使用
    var sdkWegameInstance = null;
    //微信小游戏sdk
    var SdkWegame = /** @class */ (function (_super) {
        __extends(SdkWegame, _super);
        function SdkWegame(initParams) {
            var _this = this;
            var _a, _b, _c;
            _this = _super.call(this, initParams) || this;
            _this._ad = null;
            _this._bannerAd = null;
            _this._interstitialAd = null;
            _this._hasAd = {
                banner: undefined,
                interstitial: undefined,
                rewarded: undefined,
            };
            _this.locationInfomation = null;
            _this.reportLocationTimer = null;
            _this.refreshSession = 0; //用于记录刷新session
            // 上报公共属性接口失败次数
            _this.trackPublicPropsFailCount = 0;
            _this.funcs = [];
            _this.back_flow_day = 0;
            _this.directAdStatus = {};
            _this.directAdGdtReportQueue = [];
            _this.initConfig = {};
            // 调度埋点
            _this.scheduleInitMap = {};
            // 获取分享数据缓存调度上报参数
            _this.scheuleReportProps = {};
            // 将请求实例暴露
            _this.requestInstance = doRequest;
            // 海报分享参数
            _this.queryPoster = {};
            // 是否支持支付广点通上报
            _this.isSupportGDTReport = true;
            //子渠道id
            _this.subChannelId = null;
            // 上报大数据类型
            _this.dataTrackType = [];
            _this.deviceInfo = null;
            /**
             * 是否登录
             * 使用场景：登录后不允许通过SDK设置子渠道id
             */
            _this.isLogin = false;
            _this.isPromoter = false;
            _this.game_id = '';
            _this.promoInfo = {
                timer: null,
                refresh_period_exp: 0,
                polling: 0,
                promo_code: ''
            };
            // 腾讯广告sdk实例
            _this.tencent_sdk = null;
            _this.create_conn = false;
            // 定义全局的SocketTask实例
            _this.socket_task = null;
            // 心跳检测的时间间隔（单位：毫秒）
            _this.HEARTBEAT_INTERVAL = 3 * 60 * 1000;
            // 存储心跳定时器的标识
            _this.heartbeat_timer = null;
            // 最大重连次数
            _this.MAX_CONNECT_NUMBER = 20;
            // 已经连接次数
            _this.socket_connect_number = 1;
            // 重连时间间隔（单位：毫秒）
            _this.RECONNECT_INTERVAL = 5000;
            // socket游标
            _this.socket_index = 0;
            // socket游标列表
            _this.socket_ws_list = [];
            // socket是否正在发起重连中
            _this.reconnecting = false;
            // socket是否断开不再重连
            _this.no_more_reconnection = false;
            try {
                // 保存实例到全局变量，供 handleTrackError 使用
                sdkWegameInstance = _this;
                wx.setStorageSync('check_support_setStorageSync', 'Support setStorageSync');
                printLog('Support setStorageSync');
                SYSTEM_INFO$1.isWxAvailable = true;
            }
            catch (e) {
                SYSTEM_INFO$1.isWxAvailable = false;
                printLog('Not supported setStorageSync', e);
            }
            console.log('微信小游戏sdk-基础API');
            invalidInitParams(initParams, initParamsCheck);
            console.info('channel sdk check params passed');
            Object.assign(SYSTEM_INFO$1, SYSTEM_INFO, __assign(__assign({}, initParams), { index: 0 }));
            _this.isSupportGDTReport = (_a = SYSTEM_INFO$1 === null || SYSTEM_INFO$1 === void 0 ? void 0 : SYSTEM_INFO$1.isSupportGDTReport) !== null && _a !== void 0 ? _a : true;
            try {
                var accountInfo = wx.getAccountInfoSync();
                console.info(accountInfo === null || accountInfo === void 0 ? void 0 : accountInfo.miniProgram);
                if ((_b = accountInfo === null || accountInfo === void 0 ? void 0 : accountInfo.miniProgram) === null || _b === void 0 ? void 0 : _b.version) {
                    SYSTEM_INFO$1.miniVersion = (_c = accountInfo === null || accountInfo === void 0 ? void 0 : accountInfo.miniProgram) === null || _c === void 0 ? void 0 : _c.version;
                }
            }
            catch (e) {
            }
            // 获取初始化配置
            _this.getInitConfig({ complete: initParams.complete });
            return _this;
        }
        SdkWegame.prototype.saveDeviceInfo = function () {
            try {
                // @ts-ignore
                this.deviceInfo = wx.getDeviceInfo();
            }
            catch (e) {
                return;
            }
        };
        SdkWegame.prototype.addFeedback = function (params, callback) {
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
                            callback && callback.complete(handleTrackError('', err_1));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SdkWegame.prototype.getPhoneNumber = function (params, callback) {
            // @ts-ignore
            wx.getPhoneNumber({
                isRealtime: params.isRealtime || false,
                phoneNumberNoQuotaToast: params.phoneNumberNoQuotaToast || true,
                complete: function (res) {
                    if (res.code) {
                        getPhoneNumberApi(res.code).then(function (res) {
                            callback && callback.complete(res);
                        }).catch(function (err) {
                            callback && callback.complete(handleTrackError('', err));
                        });
                    }
                    else {
                        callback && callback.complete(handleTrackError('', res));
                    }
                }
            });
        };
        SdkWegame.prototype.changePhoneNumber = function (params, callback) {
            // @ts-ignore
            wx.getPhoneNumber({
                isRealtime: params.isRealtime || false,
                phoneNumberNoQuotaToast: params.phoneNumberNoQuotaToast || true,
                complete: function (res) {
                    if (res.code) {
                        changePhoneNumberApi(res.code).then(function (res) {
                            callback && callback.complete(res);
                        }).catch(function (err) {
                            callback && callback.complete(handleTrackError('', err));
                        });
                    }
                    else {
                        callback && callback.complete(handleTrackError('', res));
                    }
                }
            });
        };
        SdkWegame.prototype.getFeedbackList = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var res, err_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, getFeedbackListApi(params)];
                        case 1:
                            res = _a.sent();
                            callback && callback.complete(res);
                            return [3 /*break*/, 3];
                        case 2:
                            err_2 = _a.sent();
                            callback && callback.complete(handleTrackError('', err_2));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SdkWegame.prototype.getFeedbackDetail = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var res, err_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, getFeedbackDetailApi(params)];
                        case 1:
                            res = _a.sent();
                            callback && callback.complete(res);
                            return [3 /*break*/, 3];
                        case 2:
                            err_3 = _a.sent();
                            callback && callback.complete(handleTrackError('', err_3));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SdkWegame.prototype.collectProps = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var res, err_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, collectPropsApi(params)];
                        case 1:
                            res = _a.sent();
                            callback && callback.complete(res);
                            return [3 /*break*/, 3];
                        case 2:
                            err_4 = _a.sent();
                            callback && callback.complete(handleTrackError('', err_4));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SdkWegame.prototype.getAnnouncement = function (limit, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var productId, channelId, res, err_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(Number.isInteger(limit) && limit >= 1 && limit <= 100)) {
                                callback && callback.complete(handleTrackError('', {
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
                            callback && callback.complete(res);
                            return [3 /*break*/, 4];
                        case 3:
                            err_5 = _a.sent();
                            callback && callback.complete(handleTrackError('', err_5));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        SdkWegame.prototype.clearPromoterTimer = function () {
            console.log('clearPromoterTimer');
            if (this.promoInfo.timer) {
                clearTimeout(this.promoInfo.timer);
                this.promoInfo.timer = null;
            }
        };
        // 启动定时器
        SdkWegame.prototype.startPromoterTimer = function (callback, autoRefresh) {
            var _this = this;
            if (autoRefresh === void 0) { autoRefresh = true; }
            var delay = this.promoInfo.refresh_period_exp < 1 ? (this.promoInfo.polling ? (this.promoInfo.polling * 1000) : 10000) : (this.promoInfo.refresh_period_exp * 1000);
            console.log('startPromoterTimer', delay);
            this.promoInfo.timer = setTimeout(function () {
                _this.getPromoDisplayKEY(callback, autoRefresh, false);
            }, delay);
        };
        SdkWegame.prototype.getPromoDisplayKEY = function (callback, autoRefresh, immediately) {
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
                    callback && callback.complete(handleTrackError('', err));
                }
                else {
                    if (autoRefresh) {
                        _this.startPromoterTimer(callback, autoRefresh);
                    }
                    else {
                        callback && callback.complete(handleTrackError('', err));
                    }
                }
            });
        };
        SdkWegame.prototype.exchangePromoCDKEY = function (cdkey, callback) {
            exchangePromoterCodeApi(cdkey).then(function (res) {
                callback.complete(res);
            }).catch(function (err) {
                callback.complete(handleTrackError('', err));
            });
        };
        SdkWegame.prototype.checkIsPromoter = function () {
            return this.isPromoter;
        };
        SdkWegame.prototype.publicSubchannelCheck = function (res) {
            var _a, _b;
            try {
                var sub_channel = (_b = (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.subcq) === null || _b === void 0 ? void 0 : _b.subc;
                var queryString = getSearchQueries(true);
                var query = queryString ? queryString.split('&') : [];
                if ((sub_channel === null || sub_channel === void 0 ? void 0 : sub_channel.length) && (query === null || query === void 0 ? void 0 : query.length)) {
                    for (var a = 0; a < sub_channel.length; a++) {
                        var item = sub_channel[a];
                        var reflectStringArr = item === null || item === void 0 ? void 0 : item.map;
                        if (reflectStringArr === null || reflectStringArr === void 0 ? void 0 : reflectStringArr.length) {
                            var arr = item === null || item === void 0 ? void 0 : item.map;
                            var sub_channel_id = item === null || item === void 0 ? void 0 : item.id;
                            for (var k in arr) {
                                var str = arr[k];
                                for (var c in query) {
                                    if (str.includes(query[c])) {
                                        this.subChannelId = sub_channel_id;
                                        console.log(this.subChannelId);
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
        SdkWegame.prototype.getDirectAdStatusSync = function () {
            var wxInstance = typeof wx !== 'undefined' ? wx : null;
            if (typeof (wxInstance === null || wxInstance === void 0 ? void 0 : wxInstance.getDirectAdStatusSync) !== 'function')
                return;
            return wxInstance.getDirectAdStatusSync();
        };
        SdkWegame.prototype.onDirectAdStatusChange = function (listener) {
            var wxInstance = typeof wx !== 'undefined' ? wx : null;
            if (typeof (wxInstance === null || wxInstance === void 0 ? void 0 : wxInstance.onDirectAdStatusChange) !== 'function')
                return;
            wxInstance.onDirectAdStatusChange(listener);
        };
        SdkWegame.prototype.normalizeDirectAdStatus = function (statusInfo) {
            var status = {};
            var keys = ['isInMask', 'isInDirectGameAd', 'isEndByAbnormal'];
            keys.forEach(function (key) {
                if (typeof (statusInfo === null || statusInfo === void 0 ? void 0 : statusInfo[key]) === 'boolean') {
                    status[key] = statusInfo[key];
                }
            });
            return status;
        };
        SdkWegame.prototype.getDirectAdStatusParams = function (statusInfo) {
            if (statusInfo === void 0) { statusInfo = this.directAdStatus; }
            var status = this.normalizeDirectAdStatus(statusInfo);
            var params = {};
            var keyMap = {
                isInMask: 'is_in_mask',
                isInDirectGameAd: 'is_in_direct_game_ad',
                isEndByAbnormal: 'is_end_by_abnormal',
            };
            Object.keys(status).forEach(function (key) {
                params[keyMap[key]] = status[key] ? '1' : '0';
            });
            return params;
        };
        SdkWegame.prototype.withDirectAdStatus = function (params) {
            var _a, _b, _c;
            var directAdStatus = this.getDirectAdStatusParams();
            if (Object.keys(directAdStatus).length === 0)
                return params;
            return __assign(__assign({}, params), { ext: __assign(__assign({}, ((params === null || params === void 0 ? void 0 : params.ext) || {})), { custom_ext: __assign(__assign({}, (((_a = params === null || params === void 0 ? void 0 : params.ext) === null || _a === void 0 ? void 0 : _a.custom_ext) || {})), { bigdata_ext: __assign(__assign({}, (((_c = (_b = params === null || params === void 0 ? void 0 : params.ext) === null || _b === void 0 ? void 0 : _b.custom_ext) === null || _c === void 0 ? void 0 : _c.bigdata_ext) || {})), directAdStatus) }) }) });
        };
        SdkWegame.prototype.withDirectAdBigdataExt = function (params) {
            var _a;
            var directAdStatus = this.getDirectAdStatusParams();
            if (Object.keys(directAdStatus).length === 0)
                return params;
            return __assign(__assign({}, params), { custom_ext: __assign(__assign({}, ((params === null || params === void 0 ? void 0 : params.custom_ext) || {})), { bigdata_ext: __assign(__assign({}, (((_a = params === null || params === void 0 ? void 0 : params.custom_ext) === null || _a === void 0 ? void 0 : _a.bigdata_ext) || {})), directAdStatus) }) });
        };
        SdkWegame.prototype.trackDirectAdStatus = function (statusInfo) {
            if (!statusInfo || typeof statusInfo !== 'object')
                return;
            this.track({
                complete: function () { },
            }, {
                event: '#direct_ad',
                properties: this.getDirectAdStatusParams(statusInfo),
            });
        };
        SdkWegame.prototype.reportOrQueueDirectAdGdtEvent = function (report) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.directAdStatus.isInMask && this.directAdStatus.isInDirectGameAd) {
                                this.directAdGdtReportQueue.push(report);
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, report()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        SdkWegame.prototype.flushDirectAdGdtReportQueue = function () {
            return __awaiter(this, void 0, void 0, function () {
                var reports, _i, reports_1, report, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            reports = this.directAdGdtReportQueue.splice(0);
                            _i = 0, reports_1 = reports;
                            _a.label = 1;
                        case 1:
                            if (!(_i < reports_1.length)) return [3 /*break*/, 6];
                            report = reports_1[_i];
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, report()];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            e_1 = _a.sent();
                            console.error('direct ad gdt report error:', e_1);
                            return [3 /*break*/, 5];
                        case 5:
                            _i++;
                            return [3 /*break*/, 1];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        SdkWegame.prototype.handleDirectAdStatus = function (statusInfo, isStatusChange) {
            if (isStatusChange === void 0) { isStatusChange = false; }
            if (!statusInfo || typeof statusInfo !== 'object')
                return;
            this.directAdStatus = this.normalizeDirectAdStatus(statusInfo);
            this.trackDirectAdStatus(statusInfo);
            var isMaskBroken = !this.directAdStatus.isInMask && this.directAdStatus.isInDirectGameAd;
            var isContinuePlaying = isStatusChange
                && statusInfo.isInMask === false
                && statusInfo.isInDirectGameAd === false
                && statusInfo.isEndByAbnormal === false;
            if (isMaskBroken || isContinuePlaying) {
                this.flushDirectAdGdtReportQueue();
            }
        };
        SdkWegame.prototype.setupDirectAdStatus = function () {
            var _this = this;
            try {
                var statusInfo = this.getDirectAdStatusSync();
                if (statusInfo) {
                    console.log('getDirectAdStatusSync:', statusInfo);
                    this.handleDirectAdStatus(statusInfo);
                }
            }
            catch (e) {
                console.error('getDirectAdStatusSync error:', e);
            }
            try {
                this.onDirectAdStatusChange(function (res) {
                    console.log('onDirectAdStatusChange:', res);
                    _this.handleDirectAdStatus(res, true);
                });
            }
            catch (e) {
                console.error('onDirectAdStatusChange error:', e);
            }
        };
        SdkWegame.prototype.getInitConfig = function (callback) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
            return __awaiter(this, void 0, void 0, function () {
                var initParams, res, config, version, _i, _q, key, prop_version, _serverTime, e_2, err_6, error;
                return __generator(this, function (_r) {
                    switch (_r.label) {
                        case 0:
                            initParams = customGetStorageSync('rx-init-params') || {};
                            _r.label = 1;
                        case 1:
                            _r.trys.push([1, 8, , 9]);
                            return [4 /*yield*/, getInitConf({ version: (_a = initParams === null || initParams === void 0 ? void 0 : initParams.version) !== null && _a !== void 0 ? _a : {} })];
                        case 2:
                            res = _r.sent();
                            config = res.data || {};
                            version = {};
                            for (_i = 0, _q = Object.keys(config); _i < _q.length; _i++) {
                                key = _q[_i];
                                prop_version = (_c = (_b = config[key]) === null || _b === void 0 ? void 0 : _b.version) !== null && _c !== void 0 ? _c : '';
                                if (prop_version) {
                                    version[key] = prop_version;
                                    this.initConfig[key] = { timerId: 0 };
                                }
                                this.initConfig[key] = config[key];
                            }
                            // console.info('SDK initConfig: ', this.initConfig)
                            //检查是否需要传递subchannleid
                            this.publicSubchannelCheck(res);
                            customSetStorageSync('rx-init-params', { version: version });
                            SYSTEM_INFO$1.SDK_INIT_FINISHED = true;
                            SYSTEM_INFO$1.CP_OF = ((_e = (_d = res === null || res === void 0 ? void 0 : res.data) === null || _d === void 0 ? void 0 : _d.cp) === null || _e === void 0 ? void 0 : _e.of) || false;
                            _serverTime = (_g = (_f = res === null || res === void 0 ? void 0 : res.data) === null || _f === void 0 ? void 0 : _f.server) === null || _g === void 0 ? void 0 : _g.time;
                            if (_serverTime) {
                                SYSTEM_INFO$1.st_offset = String(Number(_serverTime) - Date.now());
                            }
                            // 初始化成功后监听应用进入前台，刷新 st_offset
                            setupStOffsetRefreshForMiniGame(typeof wx !== 'undefined' ? wx : null, getServerTime);
                            this.setupDirectAdStatus();
                            this.saveDeviceInfo();
                            if (!SYSTEM_INFO$1.isWxAvailable) {
                                this.track({
                                    complete: function (data) {
                                        console.log(data);
                                    },
                                }, {
                                    event: "#storage_error",
                                    properties: {},
                                });
                            }
                            // 检查是否需要激活
                            this.checkNeedActivate();
                            if (!(((_k = (_j = (_h = this.initConfig) === null || _h === void 0 ? void 0 : _h.advertise_channel) === null || _j === void 0 ? void 0 : _j.gdt) === null || _k === void 0 ? void 0 : _k.tm) == TM_TYPE.CLIENT)) return [3 /*break*/, 7];
                            _r.label = 3;
                        case 3:
                            _r.trys.push([3, 6, , 7]);
                            if (((_m = (_l = this.initConfig) === null || _l === void 0 ? void 0 : _l.advertise_switch) === null || _m === void 0 ? void 0 : _m.switch) == 1) {
                                this.back_flow_day = ((_p = (_o = this.initConfig) === null || _o === void 0 ? void 0 : _o.advertise_switch) === null || _p === void 0 ? void 0 : _p.window_days) || 0;
                            }
                            return [4 /*yield*/, this.initTencentSdk()];
                        case 4:
                            _r.sent();
                            return [4 /*yield*/, this.reportOrQueueDirectAdGdtEvent(function () {
                                    handleGdtTrackResult(tencent_sdk === null || tencent_sdk === void 0 ? void 0 : tencent_sdk.onAppStart());
                                })];
                        case 5:
                            _r.sent();
                            return [3 /*break*/, 7];
                        case 6:
                            e_2 = _r.sent();
                            console.log(e_2);
                            return [3 /*break*/, 7];
                        case 7:
                            // 启动定时上报定时器，默认每隔1分钟上报一次收集的数据（使用压缩）
                            startTrackReportTimer(trackCompressedApi);
                            // 小程序隐藏时触发一次上报（切后台、退出等场景）
                            try {
                                wx.onHide(function () {
                                    triggerImmediateReport();
                                });
                            }
                            catch (e) {
                                console.error('注册 onHide 上报失败:', e);
                            }
                            callback.complete({ code: 0 });
                            return [3 /*break*/, 9];
                        case 8:
                            err_6 = _r.sent();
                            error = __assign(__assign({}, (err_6 || {})), { msg: '初始化错误，或未初始化', code: COMMON_ERROR_CODE.INIT_PARAMS_ERROR, thirdcode: err_6.code || err_6.errCode, message: err_6.message || err_6.msg || err_6.errMsg, thirdmsg: err_6.message || err_6.msg || err_6.errMsg });
                            // data: 保留原始错误
                            error.data = {
                                data: err_6
                            };
                            callback.complete(handleTrackError('rxlog_error_init', error));
                            return [3 /*break*/, 9];
                        case 9: return [2 /*return*/];
                    }
                });
            });
        };
        SdkWegame.prototype.setCpOf = function (bool) {
            SYSTEM_INFO$1.CP_OF = bool;
        };
        SdkWegame.prototype.getCpOf = function () {
            return SYSTEM_INFO$1.CP_OF || false;
        };
        // 获取归因数据
        SdkWegame.prototype.getAttributionData = function () {
            var universal = getSearchQueries();
            var source_ad = {};
            var deviceInfo = {};
            try {
                // @ts-ignore
                deviceInfo = wx.getDeviceInfo();
                source_ad.device_info = deviceInfo;
            }
            catch (e) {
            }
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
                    default:
                        source_ad.ad_rawargs = omit(universal, ['ad_platform']);
                        source_ad.ad_platform = universal.ad_platform;
                }
                source_ad.ad_platform = universal.ad_platform;
            }
            else {
                return {
                    device_info: deviceInfo,
                    ad_rawargs: universal
                };
            }
            return source_ad;
        };
        SdkWegame.prototype.checkNeedActivate = function () {
            return __awaiter(this, void 0, void 0, function () {
                var activeResult, source_ad, user_source, distinct_id, req, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            activeResult = customGetStorageSync('rx-active-result');
                            if (!!activeResult) return [3 /*break*/, 4];
                            source_ad = this.getAttributionData();
                            user_source = this.getAttributionData();
                            distinct_id = v4_1();
                            customSetStorageSync('rx_distinct_id', distinct_id);
                            req = {
                                stage: 'init',
                                distinct_id: distinct_id,
                                source_ad: source_ad,
                                user_source: user_source,
                            };
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, activated(req)];
                        case 2:
                            result = _a.sent();
                            customSetStorageSync('rx-active-result', { isSuccess: true, activeResult: result.data });
                            return [3 /*break*/, 4];
                        case 3:
                            _a.sent();
                            customSetStorageSync('rx-active-result', { isSuccess: false, activeResult: req });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        //格式化queryString
        SdkWegame.prototype.getLoginQsAndGenerateStruct = function (query) {
            var _a;
            if (query === void 0) { query = ''; }
            var universal = query || getSearchQueries();
            console.info('===============queryString', universal);
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
                            user_attrs: leftProps
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
            var subPackageInfo = customGetStorageSync('rx_sub_package_info');
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
        SdkWegame.prototype.ActivePrefix = function (reqParams) {
            var loginState = customGetStorageSync('rx-loginState');
            var activeSave = customGetStorageSync('rx-active-result');
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
        SdkWegame.prototype.setSubChannelId = function (subChannelId) {
            try {
                // 登录后不允许设置子渠道id
                if (this.isLogin) {
                    return { code: -1, msg: '登录后不允许设置子渠道id' };
                }
                customSetStorageSync('rx_sub_package_info', { sub_channel_id: subChannelId });
                return { code: 0 };
            }
            catch (error) {
                return handleTrackError('', error);
            }
        };
        /**
         * 用于设置自定义返回错误 Msg
         */
        SdkWegame.prototype.setErrorMsg = function (errMsg) {
            SYSTEM_INFO$1.errMsg = errMsg;
        };
        /**
         * 清空返回错误 Msg
         */
        SdkWegame.prototype.clearErrorMsg = function () {
            SYSTEM_INFO$1.errMsg = {
                default: ''
            };
        };
        SdkWegame.prototype.login = function (params, callback) {
            return this.authorize(params, callback);
        };
        //授权接口
        SdkWegame.prototype.authorize = function (params, callback) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
            return __awaiter(this, void 0, void 0, function () {
                var user_source, source_ad, messageToFriendQuery, queryResult, e_3, version, desc, sign_fields, now, distinct_idLocal, distinct_id, _q, custom_ext, rest_ext, reqLoginData, queryJson, code, data, userInfo, getLaunchParams, query, scene, sceneParams, rxValue, _r, query, reflowEnabled, reqLogin, e_4, e_5, e_6, err_9;
                return __generator(this, function (_s) {
                    switch (_s.label) {
                        case 0:
                            user_source = this.getLoginQsAndGenerateStruct();
                            source_ad = this.getAttributionData();
                            _s.label = 1;
                        case 1:
                            _s.trys.push([1, 4, , 5]);
                            messageToFriendQuery = this.getMessageToFriendQuery().query;
                            if (!messageToFriendQuery) return [3 /*break*/, 3];
                            return [4 /*yield*/, getShortTextApi(messageToFriendQuery)];
                        case 2:
                            queryResult = _s.sent();
                            if (queryResult.code === 0 && queryResult.data.text) {
                                // @ts-ignore
                                user_source = this.getLoginQsAndGenerateStruct(qs.parse(queryResult.data.text));
                            }
                            _s.label = 3;
                        case 3: return [3 /*break*/, 5];
                        case 4:
                            e_3 = _s.sent();
                            console.log(e_3);
                            return [3 /*break*/, 5];
                        case 5:
                            _s.trys.push([5, 33, 34, 35]);
                            // await pubCheck(wegameLoginParamsCheck, callback, params)
                            params.version = params.version || 'normal';
                            version = params.version, desc = params.desc, sign_fields = params.sign_fields;
                            now = new Date().getTime();
                            distinct_idLocal = customGetStorageSync('rx_distinct_id');
                            distinct_id = distinct_idLocal || v4_1();
                            if (!distinct_idLocal) {
                                customSetStorageSync('rx_distinct_id', distinct_id);
                            }
                            _q = params.ext || {}, custom_ext = _q.custom_ext, rest_ext = __rest(_q, ["custom_ext"]);
                            reqLoginData = __assign(__assign({ ts: now, method: 'minigame', distinct_id: distinct_id }, user_source), { sign_fields: sign_fields, migrate_args: params === null || params === void 0 ? void 0 : params.migrate_args, custom_ext: custom_ext || {}, ext: __assign(__assign({}, (rest_ext || {})), { version: version }) });
                            try {
                                if (this.subChannelId !== null) {
                                    queryJson = getSearchQueries();
                                    if ((user_source === null || user_source === void 0 ? void 0 : user_source.user_source) === 'guide' || !(user_source === null || user_source === void 0 ? void 0 : user_source.user_source)) {
                                        reqLoginData.user_source = {
                                            guide: __assign(__assign({}, user_source), { subchannelid: this.subChannelId })
                                        };
                                        if (queryJson) {
                                            reqLoginData.user_source.guide = __assign(__assign({}, reqLoginData.user_source.guide), queryJson);
                                        }
                                    }
                                }
                            }
                            catch (err) {
                            }
                            if (!!params.login_openid) return [3 /*break*/, 7];
                            return [4 /*yield*/, asyncFunc(wx.login)];
                        case 6:
                            code = (_s.sent()).code;
                            reqLoginData.ext.code = code;
                            _s.label = 7;
                        case 7:
                            if (!(version == 'normal')) return [3 /*break*/, 9];
                            return [4 /*yield*/, asyncFunc(wx.getUserProfile, {
                                    lang: 'zh_CN',
                                    desc: desc || '用于获取昵称和头像',
                                })];
                        case 8:
                            data = _s.sent();
                            reqLoginData.ext.encryptedData = data.encryptedData;
                            reqLoginData.ext.iv = data.iv;
                            _s.label = 9;
                        case 9:
                            userInfo = null;
                            try {
                                getLaunchParams = wx.getLaunchOptionsSync();
                                reqLoginData.open_source = (getLaunchParams === null || getLaunchParams === void 0 ? void 0 : getLaunchParams.scene) ? (getLaunchParams === null || getLaunchParams === void 0 ? void 0 : getLaunchParams.scene) + '' : undefined;
                            }
                            catch (err) { }
                            _s.label = 10;
                        case 10:
                            _s.trys.push([10, 15, , 16]);
                            query = wx.getLaunchOptionsSync().query;
                            scene = decodeURIComponent((query === null || query === void 0 ? void 0 : query.scene) || '');
                            sceneParams = scene ? qs === null || qs === void 0 ? void 0 : qs.parse(scene) : {};
                            if (!('rx' in sceneParams)) return [3 /*break*/, 14];
                            rxValue = sceneParams === null || sceneParams === void 0 ? void 0 : sceneParams.rx;
                            _s.label = 11;
                        case 11:
                            _s.trys.push([11, 13, , 14]);
                            _r = this;
                            return [4 /*yield*/, getUrlParseApi({ identity: rxValue })];
                        case 12:
                            _r.queryPoster = _s.sent();
                            reqLoginData.user_source = __assign(__assign({}, reqLoginData === null || reqLoginData === void 0 ? void 0 : reqLoginData.user_source), (_a = this.queryPoster) === null || _a === void 0 ? void 0 : _a.data);
                            return [3 /*break*/, 14];
                        case 13:
                            _s.sent();
                            return [3 /*break*/, 14];
                        case 14: return [3 /*break*/, 16];
                        case 15:
                            _s.sent();
                            return [3 /*break*/, 16];
                        case 16:
                            try {
                                query = getSearchQueries();
                                if (query.subscribetaskid) {
                                    reqLoginData.async_msg = {
                                        minigame_subscribe: {
                                            subscribe_task_id: query.subscribetaskid
                                        }
                                    };
                                }
                            }
                            catch (err) {
                            }
                            reqLoginData = this.withDirectAdBigdataExt(reqLoginData);
                            if (!params.login_openid) return [3 /*break*/, 18];
                            //二次登录
                            reqLoginData.login_openid = params.login_openid;
                            console.info('double login req: ', reqLoginData);
                            return [4 /*yield*/, loginByTokenApi(this.ActivePrefix(reqLoginData))];
                        case 17:
                            userInfo = _s.sent();
                            customSetStorageSync('rx-loginState', 1);
                            return [3 /*break*/, 20];
                        case 18:
                            reflowEnabled = ((_c = (_b = this.initConfig) === null || _b === void 0 ? void 0 : _b.advertise_switch) === null || _c === void 0 ? void 0 : _c.switch) === 1;
                            reqLogin = reflowEnabled ? __assign(__assign({}, reqLoginData), { device: source_ad }) : __assign({}, reqLoginData);
                            return [4 /*yield*/, loginByCredentialApi(this.ActivePrefix(reqLogin))];
                        case 19:
                            userInfo = _s.sent();
                            customSetStorageSync('rx-loginState', 1);
                            _s.label = 20;
                        case 20:
                            Object.assign(USER_INFO, userInfo.data);
                            customSetStorageSync('rxToken', userInfo.data.token);
                            handleDynamicSupplementOrder();
                            try {
                                if ((((_d = userInfo === null || userInfo === void 0 ? void 0 : userInfo.data) === null || _d === void 0 ? void 0 : _d.user_flag) & 1) == 1) {
                                    this.isPromoter = true;
                                    this.game_id = (_e = userInfo === null || userInfo === void 0 ? void 0 : userInfo.data) === null || _e === void 0 ? void 0 : _e.cp_user_id;
                                }
                            }
                            catch (e) { }
                            if (!(((_h = (_g = (_f = this.initConfig) === null || _f === void 0 ? void 0 : _f.advertise_channel) === null || _g === void 0 ? void 0 : _g.gdt) === null || _h === void 0 ? void 0 : _h.tm) == TM_TYPE.CLIENT)) return [3 /*break*/, 32];
                            _s.label = 21;
                        case 21:
                            _s.trys.push([21, 23, , 24]);
                            return [4 /*yield*/, this.reportGdtLogin((_j = userInfo.data) === null || _j === void 0 ? void 0 : _j.tid)];
                        case 22:
                            _s.sent();
                            return [3 /*break*/, 24];
                        case 23:
                            e_4 = _s.sent();
                            console.log(e_4);
                            return [3 /*break*/, 24];
                        case 24:
                            _s.trys.push([24, 27, , 28]);
                            if (!((((_k = userInfo.data) === null || _k === void 0 ? void 0 : _k.flag) & (1 << 0)) == 1)) return [3 /*break*/, 26];
                            return [4 /*yield*/, this.reportRegister()];
                        case 25:
                            _s.sent();
                            _s.label = 26;
                        case 26: return [3 /*break*/, 28];
                        case 27:
                            e_5 = _s.sent();
                            console.log(e_5);
                            return [3 /*break*/, 28];
                        case 28:
                            _s.trys.push([28, 31, , 32]);
                            console.log('距离上次登录相差：', formatTime(Math.floor((Date.now() - (((_l = userInfo.data) === null || _l === void 0 ? void 0 : _l.last_login_time) || 0) * 1000))));
                            if (!(((_m = userInfo.data) === null || _m === void 0 ? void 0 : _m.last_login_time) && this.back_flow_day && (Date.now() - (((_o = userInfo.data) === null || _o === void 0 ? void 0 : _o.last_login_time) || 0) * 1000) >= (this.back_flow_day * 3600 * 24 * 1000))) return [3 /*break*/, 30];
                            return [4 /*yield*/, this.reportReActive(this.back_flow_day)];
                        case 29:
                            _s.sent();
                            _s.label = 30;
                        case 30: return [3 /*break*/, 32];
                        case 31:
                            e_6 = _s.sent();
                            console.log(e_6);
                            return [3 /*break*/, 32];
                        case 32:
                            callback.complete(userInfo);
                            try {
                                this.reportPurchaseByCache();
                            }
                            catch (e) {
                            }
                            try {
                                // 更改登录状态为已登录
                                this.isLogin = true;
                            }
                            catch (error) {
                            }
                            return [2 /*return*/, userInfo];
                        case 33:
                            err_9 = _s.sent();
                            callback.complete(handleTrackError('rxlog_error_login', err_9, ((_p = err_9.errMsg) === null || _p === void 0 ? void 0 : _p.includes('fail auth deny')) ? COMMON_ERROR_CODE.LOGIN_DENY : COMMON_ERROR_CODE.LOGIN_FAIL));
                            this.track({
                                complete: function (data) {
                                },
                            }, formatTrackParams({
                                eventName: 'track_err',
                                apiName: 'authorize',
                                reqParams: params,
                                errorInfo: err_9,
                                loginInfo: USER_INFO,
                            }));
                            return [3 /*break*/, 35];
                        case 34:
                            // 清理上报支付订单接口所有队列和缓存
                            clearAllQueuesAndCache();
                            // 清空rx_sub_package_info
                            customRemoveStorageSync('rx_sub_package_info');
                            return [7 /*endfinally*/];
                        case 35: return [2 /*return*/];
                    }
                });
            });
        };
        SdkWegame.prototype.setScheuleReportProps = function (data) {
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
                platform: (data === null || data === void 0 ? void 0 : data.platform) || PLATFORM.WECHAT,
            };
        };
        // 获得海报分享参数
        SdkWegame.prototype.getQueryPoster = function (callback) {
            try {
                callback.complete(this.queryPoster);
            }
            catch (error) {
                callback.complete(error);
            }
        };
        //获得分享内容
        SdkWegame.prototype.getShareData = function (params, callback, stopCallback) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function () {
                var region, cacheShareData, _c, readCache, cShareData, productId, channelId, platform, transmits, func, type, sub_channel_id, open_id, shareData_1, remaining_share_count, err_10;
                var _this = this;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 5, , 9]);
                            return [4 /*yield*/, pubCheck(wegameShareCheckParams, callback, params)];
                        case 1:
                            _d.sent();
                            region = (params === null || params === void 0 ? void 0 : params.region) || USER_INFO.region || '';
                            cacheShareData = customGetStorageSync("rx_schedule_".concat(USER_INFO.tid, "_").concat(params.func, "_").concat(region));
                            _c = params.readCache, readCache = _c === void 0 ? false : _c;
                            if (readCache && cacheShareData) {
                                cShareData = JSON.parse(cacheShareData);
                                console.info('sdk 缓存分享数据：', cShareData);
                                this.setScheuleReportProps(cShareData === null || cShareData === void 0 ? void 0 : cShareData.data);
                                !stopCallback && callback.complete(cShareData);
                                return [2 /*return*/, cShareData];
                            }
                            productId = SYSTEM_INFO$1.productId, channelId = SYSTEM_INFO$1.channelId;
                            platform = PLATFORM.WECHAT;
                            transmits = encodeURI(params.transmits || '');
                            func = params.func;
                            type = 'mini';
                            sub_channel_id = this.subChannelId || '';
                            open_id = USER_INFO.openid;
                            return [4 /*yield*/, getShareDataApi(this.withDirectAdStatus({
                                    func: func,
                                    transmits: transmits,
                                    product_id: productId,
                                    channel_id: channelId,
                                    platform: platform,
                                    type: type,
                                    region: region,
                                    sub_channel_id: sub_channel_id,
                                    open_id: open_id,
                                    custom_ext: params.custom_ext || {}
                                }))];
                        case 2:
                            shareData_1 = _d.sent();
                            remaining_share_count = ((_b = (_a = shareData_1 === null || shareData_1 === void 0 ? void 0 : shareData_1.data) === null || _a === void 0 ? void 0 : _a.scheduling) === null || _b === void 0 ? void 0 : _b.remaining_share_count) || 0;
                            console.log('getShareData剩余次数为' + remaining_share_count);
                            if (!(remaining_share_count <= 0)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.shareSchedulingInit({}, {
                                    complete: function () {
                                        if (!stopCallback) {
                                            callback.complete(shareData_1);
                                        }
                                        _this.setScheuleReportProps(shareData_1 === null || shareData_1 === void 0 ? void 0 : shareData_1.data);
                                    }
                                })];
                        case 3:
                            _d.sent();
                            return [2 /*return*/, shareData_1];
                        case 4:
                            if (!stopCallback) {
                                callback.complete(shareData_1);
                            }
                            this.setScheuleReportProps(shareData_1 === null || shareData_1 === void 0 ? void 0 : shareData_1.data);
                            return [2 /*return*/, shareData_1];
                        case 5:
                            err_10 = _d.sent();
                            if (!(err_10.code == 305407)) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.shareSchedulingInit({}, {
                                    complete: function () {
                                        if (!stopCallback) {
                                            callback.complete(handleTrackError('rxlog_error_share', err_10));
                                        }
                                    }
                                })];
                        case 6:
                            _d.sent();
                            return [3 /*break*/, 8];
                        case 7:
                            if (!stopCallback) {
                                callback.complete(handleTrackError('rxlog_error_share', err_10));
                            }
                            _d.label = 8;
                        case 8:
                            this.track({
                                complete: function (data) {
                                },
                            }, formatTrackParams({
                                eventName: 'track_err',
                                apiName: 'getShareData',
                                reqParams: params,
                                errorInfo: err_10,
                                loginInfo: USER_INFO,
                            }));
                            return [2 /*return*/, handleTrackError('rxlog_error_share', err_10)];
                        case 9: return [2 /*return*/];
                    }
                });
            });
        };
        SdkWegame.prototype.isImageUrl = function (url) {
            // 定义常见图片文件扩展名的正则表达式
            var imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i;
            // 定义 URL 协议的正则表达式，通常为 http 或 https
            var urlProtocol = /^(http|https):\/\//i;
            // 先检查是否有有效的协议
            if (!urlProtocol.test(url)) {
                return false;
            }
            // 再检查是否包含图片扩展名
            return imageExtensions.test(url);
        };
        SdkWegame.prototype.downloadImage = function (imageUrl) {
            return new Promise(function (resolve, reject) {
                wx.downloadFile({
                    // @ts-ignore
                    url: imageUrl,
                    success: function (res) {
                        resolve(res.tempFilePath);
                    },
                    fail: function (err) {
                        reject(err);
                    }
                });
            });
        };
        SdkWegame.prototype.getMessageToFriendQuery = function () {
            var query = getSearchQueries();
            return {
                query: query.query,
                shareMessageToFriendScene: query.shareMessageToFriendScene
            };
        };
        SdkWegame.prototype.fetchMessageToFriendQuery = function (callback) {
            return __awaiter(this, void 0, void 0, function () {
                var messageToFriendQuery, shareMessageToFriendScene, queryResult, err_11;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            messageToFriendQuery = this.getMessageToFriendQuery().query;
                            shareMessageToFriendScene = this.getMessageToFriendQuery().shareMessageToFriendScene;
                            if (!messageToFriendQuery) return [3 /*break*/, 2];
                            return [4 /*yield*/, getShortTextApi(messageToFriendQuery)];
                        case 1:
                            queryResult = _a.sent();
                            if (queryResult.code === 0 && queryResult.data.text) {
                                callback.complete({
                                    code: 0,
                                    data: {
                                        query: qs.parse(queryResult.data.text),
                                        shareMessageToFriendScene: shareMessageToFriendScene
                                    }
                                });
                                return [2 /*return*/];
                            }
                            _a.label = 2;
                        case 2:
                            callback.complete({
                                code: 0,
                                data: {
                                    query: {},
                                    shareMessageToFriendScene: ''
                                }
                            });
                            return [3 /*break*/, 4];
                        case 3:
                            err_11 = _a.sent();
                            callback.complete(handleTrackError('', err_11));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        SdkWegame.prototype.shareMessageToFriend = function (params, callback) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2;
            return __awaiter(this, void 0, void 0, function () {
                var shareCheckParams, shareData_2, imageUrl, image, _3, query, queryResult, ctx, onShareMessageToFriend_1, err_12;
                var _this = this;
                return __generator(this, function (_4) {
                    switch (_4.label) {
                        case 0:
                            _4.trys.push([0, 10, , 11]);
                            shareCheckParams = {
                                func: {
                                    type: 'string',
                                    required: true,
                                },
                                shareMessageToFriendScene: {
                                    type: 'number',
                                    required: true,
                                }
                            };
                            return [4 /*yield*/, pubCheck(shareCheckParams, callback, params)];
                        case 1:
                            _4.sent();
                            return [4 /*yield*/, this.getShareData(params, callback, true)];
                        case 2:
                            shareData_2 = _4.sent();
                            console.log('sdk getShareData:', shareData_2);
                            imageUrl = params.imageUrl || ((_b = (_a = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.image);
                            if (!this.isImageUrl(imageUrl)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.downloadImage(imageUrl)];
                        case 3:
                            _3 = _4.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            _3 = imageUrl;
                            _4.label = 5;
                        case 5:
                            image = _3;
                            wx.updateShareMenu({
                                isUpdatableMessage: false
                            });
                            query = qs.stringify({
                                type: 'rx',
                                user_source: 'share',
                                platform: ((_c = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _c === void 0 ? void 0 : _c.platform) || '',
                                transmits: encodeURIComponent((params === null || params === void 0 ? void 0 : params.transmits) || ''),
                                landing_id: ((_e = (_d = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _d === void 0 ? void 0 : _d.content) === null || _e === void 0 ? void 0 : _e.landing_id) || '',
                                trigger_id: ((_g = (_f = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _f === void 0 ? void 0 : _f.trigger) === null || _g === void 0 ? void 0 : _g.id) || '',
                                trigger_tag: ((_j = (_h = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _h === void 0 ? void 0 : _h.trigger) === null || _j === void 0 ? void 0 : _j.tag) || '',
                                trigger_type: ((_l = (_k = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _k === void 0 ? void 0 : _k.trigger) === null || _l === void 0 ? void 0 : _l.type) || '',
                                material_type: ((_o = (_m = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _m === void 0 ? void 0 : _m.content) === null || _o === void 0 ? void 0 : _o.material_type) || '',
                                material_id: ((_q = (_p = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _p === void 0 ? void 0 : _p.content) === null || _q === void 0 ? void 0 : _q.material_id) || '',
                                strategy_type: ((_s = (_r = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _r === void 0 ? void 0 : _r.strategy) === null || _s === void 0 ? void 0 : _s.type) || '',
                                strategy_id: ((_u = (_t = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _t === void 0 ? void 0 : _t.strategy) === null || _u === void 0 ? void 0 : _u.id) || '',
                                material_name: ((_w = (_v = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _v === void 0 ? void 0 : _v.content) === null || _w === void 0 ? void 0 : _w.title) || '',
                                trigger_name: ((_y = (_x = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _x === void 0 ? void 0 : _x.trigger) === null || _y === void 0 ? void 0 : _y.title) || '',
                                strategy_name: ((_0 = (_z = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _z === void 0 ? void 0 : _z.strategy) === null || _0 === void 0 ? void 0 : _0.name) || '',
                                share_time: Math.floor(new Date().getTime() / 1000),
                                share_type: 'mini',
                                inviter_region: USER_INFO.region || '',
                                inviter_openid: USER_INFO.openid || '',
                                inviter_productid: SYSTEM_INFO$1.productId,
                                inviter_channelid: SYSTEM_INFO$1.channelId,
                                inviter_subchannelid: this.subChannelId || '',
                            });
                            query = params.query ? "".concat(query, "&").concat(params.query) : query;
                            _4.label = 6;
                        case 6:
                            _4.trys.push([6, 8, , 9]);
                            return [4 /*yield*/, setShortTextApi(query)];
                        case 7:
                            queryResult = _4.sent();
                            query = queryResult.data.short_name;
                            console.log('queryResult', queryResult);
                            return [3 /*break*/, 9];
                        case 8:
                            _4.sent();
                            query = '';
                            return [3 /*break*/, 9];
                        case 9:
                            wx.setMessageToFriendQuery({
                                shareMessageToFriendScene: params.shareMessageToFriendScene,
                                // @ts-ignore
                                query: query
                            });
                            ctx = wx.getOpenDataContext();
                            ctx.postMessage({
                                event: 'rx_shareMessageToFriend',
                                openid: params.openId || '',
                                imageUrl: image,
                                title: params.title || ((_2 = (_1 = shareData_2 === null || shareData_2 === void 0 ? void 0 : shareData_2.data) === null || _1 === void 0 ? void 0 : _1.content) === null || _2 === void 0 ? void 0 : _2.content)
                            });
                            onShareMessageToFriend_1 = function (res) {
                                console.log(res);
                                // @ts-ignore
                                wx.offShareMessageToFriend(onShareMessageToFriend_1);
                                if (res.success) {
                                    callback.complete(shareData_2);
                                    _this.reportShareAppMessage('APP_MESSAGE');
                                }
                                else {
                                    if (res.errMsg.includes('cancel')) {
                                        callback.complete(handleTrackError('rxlog_error_share', res, 5001));
                                    }
                                    else {
                                        callback.complete(handleTrackError('rxlog_error_share', res));
                                    }
                                }
                            };
                            wx.onShareMessageToFriend(onShareMessageToFriend_1);
                            return [3 /*break*/, 11];
                        case 10:
                            err_12 = _4.sent();
                            callback.complete(handleTrackError('rxlog_error_share', err_12));
                            return [3 /*break*/, 11];
                        case 11: return [2 /*return*/];
                    }
                });
            });
        };
        SdkWegame.prototype.showShareImageMenu = function (params, callback) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function () {
                var shareData_3, imageUrl, image, _c, err_13;
                var _this = this;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 6, , 7]);
                            return [4 /*yield*/, pubCheck(wegameShareCheckParams, callback, params)];
                        case 1:
                            _d.sent();
                            return [4 /*yield*/, this.getShareData(params, callback, true)];
                        case 2:
                            shareData_3 = _d.sent();
                            console.log('sdk getShareData:', shareData_3);
                            imageUrl = params.imageUrl || ((_b = (_a = shareData_3 === null || shareData_3 === void 0 ? void 0 : shareData_3.data) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.image);
                            if (!this.isImageUrl(imageUrl)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.downloadImage(imageUrl)];
                        case 3:
                            _c = _d.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            _c = imageUrl;
                            _d.label = 5;
                        case 5:
                            image = _c;
                            wx.updateShareMenu({
                                isUpdatableMessage: false
                            });
                            wx.showShareImageMenu({
                                path: image,
                                needShowEntrance: params.needShowEntrance || true,
                                style: params.style || 'default',
                                success: function (res) {
                                    callback.complete(shareData_3);
                                    _this.reportShareAppMessage('APP_MESSAGE');
                                },
                                fail: function (err) {
                                    console.log(err);
                                    if (err.errMsg.includes('cancel')) {
                                        callback.complete(handleTrackError('rxlog_error_share', err, 5001));
                                    }
                                    else {
                                        callback.complete(handleTrackError('rxlog_error_share', err));
                                    }
                                }
                            });
                            return [3 /*break*/, 7];
                        case 6:
                            err_13 = _d.sent();
                            callback.complete(handleTrackError('rxlog_error_share', err_13));
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        //分享接口
        SdkWegame.prototype.share = function (params, callback) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4;
            return __awaiter(this, void 0, void 0, function () {
                var key, key_1, shareData_4, _5, autoReport_1, onHide_1, onShow_1, query, err_14;
                var _this = this;
                return __generator(this, function (_6) {
                    switch (_6.label) {
                        case 0:
                            _6.trys.push([0, 6, , 7]);
                            if (!params.func) return [3 /*break*/, 2];
                            return [4 /*yield*/, pubCheck(wegameShareCheckParams, callback, params)];
                        case 1:
                            _6.sent();
                            _6.label = 2;
                        case 2:
                            key = Date.now() + '';
                            for (key_1 in showMap) {
                                try {
                                    wx.offShow(showMap[key_1]);
                                }
                                catch (e) {
                                    console.log(e);
                                }
                            }
                            if (!params.func) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.getShareData(params, callback, true)];
                        case 3:
                            _5 = _6.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            _5 = { code: 0 };
                            _6.label = 5;
                        case 5:
                            shareData_4 = _5;
                            console.log('sdk getShareData:', shareData_4);
                            autoReport_1 = (_b = (_a = params.autoReport) !== null && _a !== void 0 ? _a : params.auto_report) !== null && _b !== void 0 ? _b : true;
                            wx.updateShareMenu({
                                isUpdatableMessage: false
                            });
                            onHide_1 = function () {
                                wx.offHide(onHide_1);
                            };
                            onShow_1 = function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    wx.offShow(onShow_1);
                                    callback.complete(shareData_4);
                                    if (params.func && autoReport_1) {
                                        this.shareSchedulingReport({
                                            func: params.func,
                                            region: params.region,
                                            transmits: params.transmits,
                                            scheduling_event: true,
                                            scheduling_type: 'share',
                                            properties: params.properties
                                        }, {
                                            complete: function (res) {
                                                console.log(res);
                                            }
                                        });
                                    }
                                    return [2 /*return*/];
                                });
                            }); };
                            query = qs.stringify({
                                type: 'rx',
                                user_source: 'share',
                                platform: ((_c = shareData_4 === null || shareData_4 === void 0 ? void 0 : shareData_4.data) === null || _c === void 0 ? void 0 : _c.platform) || '',
                                transmits: encodeURIComponent((params === null || params === void 0 ? void 0 : params.transmits) || ''),
                                landing_id: ((_e = (_d = shareData_4 === null || shareData_4 === void 0 ? void 0 : shareData_4.data) === null || _d === void 0 ? void 0 : _d.content) === null || _e === void 0 ? void 0 : _e.landing_id) || '',
                                trigger_id: ((_g = (_f = shareData_4 === null || shareData_4 === void 0 ? void 0 : shareData_4.data) === null || _f === void 0 ? void 0 : _f.trigger) === null || _g === void 0 ? void 0 : _g.id) || '',
                                trigger_tag: ((_j = (_h = shareData_4 === null || shareData_4 === void 0 ? void 0 : shareData_4.data) === null || _h === void 0 ? void 0 : _h.trigger) === null || _j === void 0 ? void 0 : _j.tag) || '',
                                trigger_type: ((_l = (_k = shareData_4 === null || shareData_4 === void 0 ? void 0 : shareData_4.data) === null || _k === void 0 ? void 0 : _k.trigger) === null || _l === void 0 ? void 0 : _l.type) || '',
                                material_type: ((_o = (_m = shareData_4 === null || shareData_4 === void 0 ? void 0 : shareData_4.data) === null || _m === void 0 ? void 0 : _m.content) === null || _o === void 0 ? void 0 : _o.material_type) || '',
                                material_id: ((_q = (_p = shareData_4 === null || shareData_4 === void 0 ? void 0 : shareData_4.data) === null || _p === void 0 ? void 0 : _p.content) === null || _q === void 0 ? void 0 : _q.material_id) || '',
                                strategy_type: ((_s = (_r = shareData_4 === null || shareData_4 === void 0 ? void 0 : shareData_4.data) === null || _r === void 0 ? void 0 : _r.strategy) === null || _s === void 0 ? void 0 : _s.type) || '',
                                strategy_id: ((_u = (_t = shareData_4 === null || shareData_4 === void 0 ? void 0 : shareData_4.data) === null || _t === void 0 ? void 0 : _t.strategy) === null || _u === void 0 ? void 0 : _u.id) || '',
                                material_name: ((_w = (_v = shareData_4 === null || shareData_4 === void 0 ? void 0 : shareData_4.data) === null || _v === void 0 ? void 0 : _v.content) === null || _w === void 0 ? void 0 : _w.title) || '',
                                trigger_name: ((_y = (_x = shareData_4 === null || shareData_4 === void 0 ? void 0 : shareData_4.data) === null || _x === void 0 ? void 0 : _x.trigger) === null || _y === void 0 ? void 0 : _y.title) || '',
                                strategy_name: ((_0 = (_z = shareData_4 === null || shareData_4 === void 0 ? void 0 : shareData_4.data) === null || _z === void 0 ? void 0 : _z.strategy) === null || _0 === void 0 ? void 0 : _0.name) || '',
                                share_time: Math.floor(new Date().getTime() / 1000),
                                share_type: 'mini',
                                inviter_region: USER_INFO.region || '',
                                inviter_openid: USER_INFO.openid || '',
                                inviter_productid: SYSTEM_INFO$1.productId,
                                inviter_channelid: SYSTEM_INFO$1.channelId,
                                inviter_subchannelid: this.subChannelId || '',
                            });
                            query = params.query ? "".concat(query, "&").concat(params.query) : query;
                            wx.onHide(onHide_1);
                            wx.onShow(onShow_1);
                            showMap[key] = onShow_1;
                            this.reportShareAppMessage('APP_MESSAGE');
                            wx.shareAppMessage({
                                title: params.title || params.content || ((_2 = (_1 = shareData_4 === null || shareData_4 === void 0 ? void 0 : shareData_4.data) === null || _1 === void 0 ? void 0 : _1.content) === null || _2 === void 0 ? void 0 : _2.content),
                                imageUrl: params.imageUrl || params.image || ((_4 = (_3 = shareData_4 === null || shareData_4 === void 0 ? void 0 : shareData_4.data) === null || _3 === void 0 ? void 0 : _3.content) === null || _4 === void 0 ? void 0 : _4.image),
                                query: query,
                            });
                            return [3 /*break*/, 7];
                        case 6:
                            err_14 = _6.sent();
                            callback.complete(handleTrackError('rxlog_error_share', err_14));
                            this.track({
                                complete: function (data) {
                                    console.info('share error add complete func when tracked:', data);
                                },
                            }, formatTrackParams({
                                eventName: 'track_err',
                                apiName: 'share',
                                reqParams: params,
                                errorInfo: err_14,
                                loginInfo: USER_INFO,
                            }));
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        //分享海报接口
        SdkWegame.prototype.sharePoster = function (params, callback) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function () {
                var shareData, err_15;
                var _this = this;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 4, , 5]);
                            // 判断params中至少存在func或者imageUrl中的一个
                            if (!(params === null || params === void 0 ? void 0 : params.func) && !(params === null || params === void 0 ? void 0 : params.imageUrl)) {
                                callback.complete({ code: 5000, msg: '参数错误 至少存在func或者imageUrl中的一个' });
                                return [2 /*return*/];
                            }
                            if (!(params === null || params === void 0 ? void 0 : params.func)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.getShareData(__assign(__assign({}, params), { get_qrcode: true }), callback, true)];
                        case 1:
                            shareData = _c.sent();
                            wx.downloadFile({
                                url: (_b = (_a = shareData === null || shareData === void 0 ? void 0 : shareData.data) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.image,
                                success: function (res) {
                                    _this.handleShareImageMenu(res === null || res === void 0 ? void 0 : res.tempFilePath, params === null || params === void 0 ? void 0 : params.needShowEntrance, callback);
                                }
                            });
                            return [3 /*break*/, 3];
                        case 2:
                            // 使用传入的图片url，url需要时本地地址或者微信下载的临时地址
                            this.handleShareImageMenu(params === null || params === void 0 ? void 0 : params.imageUrl, params === null || params === void 0 ? void 0 : params.needShowEntrance, callback);
                            _c.label = 3;
                        case 3: return [3 /*break*/, 5];
                        case 4:
                            err_15 = _c.sent();
                            callback.complete(handleTrackError('rxlog_error_share', err_15));
                            this.track({
                                complete: function (data) {
                                    console.info('share error add complete func when tracked:', data);
                                },
                            }, formatTrackParams({
                                eventName: 'track_err',
                                apiName: 'share',
                                reqParams: params,
                                errorInfo: err_15,
                                loginInfo: USER_INFO,
                            }));
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        // 海报分享图片
        SdkWegame.prototype.handleShareImageMenu = function (imageUrl, needShowEntrance, callback) {
            if (needShowEntrance === void 0) { needShowEntrance = false; }
            wx.showShareImageMenu({
                path: imageUrl,
                needShowEntrance: needShowEntrance,
                success: function (data) {
                    callback.complete({ code: 0, msg: '分享成功', data: data });
                },
                fail: function (err) {
                    var _a;
                    handleTrackError('rxlog_error_share', err);
                    if ((_a = err === null || err === void 0 ? void 0 : err.errMsg) === null || _a === void 0 ? void 0 : _a.includes('fail cancel')) {
                        callback.complete({ code: 5001, msg: '取消分享' });
                    }
                    else {
                        callback.complete(__assign({ code: 5002, msg: '三方分享错误', thirdmsg: err === null || err === void 0 ? void 0 : err.errMsg }, ((err === null || err === void 0 ? void 0 : err.errno) && { thirdcode: err.errno })));
                    }
                }
            });
        };
        //cp方主动补单
        SdkWegame.prototype.compensatePayOrder = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var notify_url, wx_openid, order_no, amount, env, zone_id, pf, err_16;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, pubCheck(compensateOrderCheckParams, callback, params)];
                        case 1:
                            _a.sent();
                            notify_url = params.notify_url, wx_openid = params.wx_openid, order_no = params.order_no, amount = params.amount, env = params.env, zone_id = params.zone_id, pf = params.pf;
                            return [4 /*yield*/, payCallback(notify_url, {
                                    wx_openid: wx_openid,
                                    order_no: order_no,
                                    amount: amount,
                                    env: env,
                                    zone_id: zone_id,
                                    pf: pf,
                                })];
                        case 2:
                            _a.sent();
                            removeStorageSync("rx_".concat(USER_INFO.tid));
                            callback.complete({ code: 0 });
                            return [3 /*break*/, 4];
                        case 3:
                            err_16 = _a.sent();
                            if (expiredVoucherCode.includes(err_16 === null || err_16 === void 0 ? void 0 : err_16.code)) {
                                // 如果支付回调接口失败的原因是支付凭证已经用过或者是失效，清除补单支付凭证
                                removeStorageSync("rx_".concat(USER_INFO.tid));
                                callback.complete({ code: 0, originErr: handleTrackError('rxlog_error_pay', err_16) });
                                return [2 /*return*/];
                            }
                            callback.complete(handleTrackError('rxlog_error_pay', err_16));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        //查询是否需要补单
        SdkWegame.prototype.checkHasCompensatePayOrder = function () {
            var check = customGetStorageSync("rx_".concat(USER_INFO.tid));
            if (isEmpty(check)) {
                return { code: -1, msg: 'null', data: null };
            }
            else {
                return { code: 0, msg: 'had', check: check };
            }
        };
        SdkWegame.prototype.exchangeItemProp = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, itemRedemptionApi(params)];
                        case 1:
                            result = _a.sent();
                            callback.complete(result);
                            return [3 /*break*/, 3];
                        case 2:
                            error_2 = _a.sent();
                            callback.complete(handleError(error_2));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SdkWegame.prototype.requestMerchantTransfer = function (params, callback) {
            try {
                // @ts-ignore
                wx.requestMerchantTransfer({
                    mchId: params.mchId,
                    appId: params.appId || wx.getAccountInfoSync().miniProgram.appId,
                    package: params.package,
                    success: function (res) {
                        console.log('success:', res);
                        callback.complete({
                            code: 0,
                            msg: res.errMsg
                        });
                    },
                    fail: function (err) {
                        handleTrackError('requestMerchantTransfer', err);
                        callback.complete({
                            code: err.errno,
                            msg: err.errMsg,
                            thirdcode: err.errno,
                            thirdmsg: err.errMsg,
                        });
                    }
                });
            }
            catch (err) {
                callback.complete(handleTrackError('requestMerchantTransfer', err));
            }
        };
        // 获取同玩互动好友列表
        SdkWegame.prototype.getRelationFriendList = function (params, callback) {
            var _this = this;
            if (params === void 0) { params = {}; }
            var _a = params || {}, _b = _a.guideAuthWhenDeny, guideAuthWhenDeny = _b === void 0 ? true : _b, _c = _a.authModalTitle, authModalTitle = _c === void 0 ? '授权提示' : _c, _d = _a.authModalContent, authModalContent = _d === void 0 ? '需要获取互动好友信息，请在设置中开启授权' : _d;
            // getRelationFriendList 需基础库 3.16.0 及以上，低版本需做兼容处理
            // @ts-ignore
            if (typeof wx.getRelationFriendList !== 'function') {
                var errMsg = 'getRelationFriendList:fail 当前微信版本过低，请升级到最新微信版本后重试（需基础库 3.16.2 及以上）';
                console.warn(errMsg);
                callback.complete(handleTrackError('', { errMsg: errMsg }));
                return;
            }
            // @ts-ignore
            wx.getRelationFriendList({
                success: function (res) { return __awaiter(_this, void 0, void 0, function () {
                    var result, err_17;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log('getRelationFriendList success:', res);
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, uploadGameInteractionInfoApi({
                                        iv: res.iv,
                                        encrypted_data: res.encryptedData,
                                        signature: res.signature,
                                        raw_data: res.rawData || params.raw_data || '',
                                        cp_user_id: params.cp_user_id,
                                    })];
                            case 2:
                                result = _a.sent();
                                callback.complete(result);
                                return [3 /*break*/, 4];
                            case 3:
                                err_17 = _a.sent();
                                callback.complete(handleTrackError('', err_17));
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); },
                fail: function (err) {
                    console.log('getRelationFriendList fail:', err);
                    // 判断是否为用户拒绝授权导致的失败，引导用户前往设置页面重新开启授权
                    if (guideAuthWhenDeny && err.errMsg && err.errMsg.indexOf('auth deny') !== -1) {
                        // @ts-ignore
                        wx.showModal({
                            title: authModalTitle,
                            content: authModalContent,
                            success: function (modalRes) {
                                if (modalRes.confirm) {
                                    // @ts-ignore
                                    wx.openSetting();
                                }
                            },
                        });
                    }
                    callback.complete(handleTrackError('', err));
                },
            });
        };
        //支付接口
        SdkWegame.prototype.pay = function (params, callback) {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return __awaiter(this, void 0, void 0, function () {
                var orderReq, requestMidasPaymentReq, compensateOrderReq, sessionOverdue, pay_type, reqOrder_1, _j, isHasCompensateOrder, notify_url, wx_openid, order_no_1, amount, env, zone_id, pf, orderForTrack, err_18, result_1, res_1, ext, notify_url, order_no_2, price_1, requestMidasPaymentParams, payCallbackReq, err_19, key, payParams, result, res_2, ext, price_2, requestMidasPaymentParams, err_20, miniorder, changeNumberKey, key, _k, goods_tag, order_nos, price, path, existingData, cacheList, onHide_2, onShow_2, shareInfo, short_url, appId, res_3, onShow_3, resData, _l, goods_tags, order_no, priceFen, url, sessionFromStr, err_21;
                var _this = this;
                return __generator(this, function (_m) {
                    switch (_m.label) {
                        case 0:
                            console.log(SYSTEM_INFO$1.baseUrlList[SYSTEM_INFO$1.reqUrlIndex]);
                            sessionOverdue = function (err, trackEvent) { return __awaiter(_this, void 0, void 0, function () {
                                var result;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!((err === null || err === void 0 ? void 0 : err.code) == 152413 && this.refreshSession < 2)) return [3 /*break*/, 2];
                                            this.refreshSession++;
                                            return [4 /*yield*/, this.refreshSessionFunc()];
                                        case 1:
                                            result = _a.sent();
                                            if (result == 1) {
                                                this.pay(params, callback);
                                            }
                                            else {
                                                callback.complete(handleTrackError('rxlog_error_pay', err));
                                                this.track({
                                                    complete: function (data) {
                                                        console.info('refresh sessionKey fail when sessionKey expires in pay :', data);
                                                    },
                                                }, formatTrackParams({
                                                    eventName: trackEvent || 'track_err',
                                                    apiName: 'pay',
                                                    reqParams: params,
                                                    errorInfo: err,
                                                    loginInfo: USER_INFO,
                                                    orderReq: orderReq,
                                                    requestMidasPaymentReq: requestMidasPaymentReq,
                                                    compensateOrderReq: compensateOrderReq,
                                                }));
                                            }
                                            return [3 /*break*/, 3];
                                        case 2:
                                            console.log('err 123');
                                            console.log(err);
                                            if (err.errCode == -2) {
                                                err.code = 4001;
                                                err.thirdcode = -2;
                                                callback.complete(handleTrackError('rxlog_error_pay', err));
                                                return [2 /*return*/];
                                            }
                                            callback.complete(handleTrackError('rxlog_error_pay', err, COMMON_ERROR_CODE.PAY_ERROR));
                                            this.track({
                                                complete: function (data) {
                                                    console.info('pay error add complete func when tracked:', data);
                                                },
                                            }, formatTrackParams({
                                                eventName: trackEvent || 'track_err',
                                                apiName: 'pay',
                                                reqParams: params,
                                                errorInfo: err,
                                                loginInfo: USER_INFO,
                                                orderReq: orderReq,
                                                requestMidasPaymentReq: requestMidasPaymentReq,
                                                compensateOrderReq: compensateOrderReq,
                                            }));
                                            _a.label = 3;
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); };
                            _m.label = 1;
                        case 1:
                            _m.trys.push([1, 46, 48, 49]);
                            return [4 /*yield*/, pubCheck(wegamePayCheckParams, callback, params)];
                        case 2:
                            _m.sent();
                            if (params.indulge_auth == 1 && !params.age) {
                                throw Error('when indulge_auth equal 1,the age must be required');
                            }
                            pay_type = params.pay_type;
                            reqOrder_1 = __assign(__assign(__assign({}, params), { currency: 'CNY', openid: USER_INFO.openid, sub_channel_id: this.subChannelId, is_debug: params.is_debug || 0, env: params.env || 0 }), (!isEmpty(this.deviceInfo) ? { device_info: this.deviceInfo } : {}));
                            _j = pay_type;
                            switch (_j) {
                                case 'minigame': return [3 /*break*/, 3];
                                case 'minigame_v2': return [3 /*break*/, 3];
                                case 'midas_game_item': return [3 /*break*/, 21];
                                case 'minigame_friend': return [3 /*break*/, 30];
                                case 'wxpub': return [3 /*break*/, 33];
                                case 'jump_miniprogram': return [3 /*break*/, 36];
                                case 'wechath5': return [3 /*break*/, 38];
                                case 'aums': return [3 /*break*/, 40];
                                case 'midas_payment_game_item': return [3 /*break*/, 43];
                            }
                            return [3 /*break*/, 44];
                        case 3:
                            isHasCompensateOrder = customGetStorageSync("rx_".concat(USER_INFO.tid));
                            if (!isHasCompensateOrder) return [3 /*break*/, 9];
                            console.info('sdk 支付pay进入补单');
                            _m.label = 4;
                        case 4:
                            _m.trys.push([4, 6, , 8]);
                            notify_url = isHasCompensateOrder.notify_url, wx_openid = isHasCompensateOrder.wx_openid, order_no_1 = isHasCompensateOrder.order_no, amount = isHasCompensateOrder.amount, env = isHasCompensateOrder.env, zone_id = isHasCompensateOrder.zone_id, pf = isHasCompensateOrder.pf;
                            orderForTrack = customGetStorageSync("rx_".concat(USER_INFO.tid, "_track"));
                            compensateOrderReq = isHasCompensateOrder;
                            try {
                                this.track({
                                    complete: function () { },
                                }, formatTrackParams(__assign({ eventName: 'notify', apiName: 'pay_callback', reqParams: params, errorInfo: {}, loginInfo: USER_INFO, payCallbackReq: __assign({}, compensateOrderReq), state: '开始验证', desc: 'enter supplement order process from invoking pay' }, orderForTrack)));
                            }
                            catch (err) { }
                            return [4 /*yield*/, payCallback(notify_url, {
                                    wx_openid: wx_openid,
                                    order_no: order_no_1,
                                    amount: amount,
                                    env: env,
                                    zone_id: zone_id,
                                    pf: pf,
                                })];
                        case 5:
                            _m.sent();
                            try {
                                this.track({
                                    complete: function () { },
                                }, formatTrackParams({
                                    eventName: 'removeTransactionObserver',
                                    apiName: 'pay_success',
                                    reqParams: params,
                                    errorInfo: {},
                                    loginInfo: USER_INFO,
                                }));
                            }
                            catch (err) { }
                            removeStorageSync("rx_".concat(USER_INFO.tid));
                            callback.complete({ code: 0 });
                            return [3 /*break*/, 8];
                        case 6:
                            err_18 = _m.sent();
                            if (expiredVoucherCode.includes(err_18 === null || err_18 === void 0 ? void 0 : err_18.code)) {
                                // 如果支付回调接口失败的原因是支付凭证已经用过或者是失效，清除补单支付凭证，直接下单
                                removeStorageSync("rx_".concat(USER_INFO.tid));
                                this.pay(params, callback);
                                return [2 /*return*/];
                            }
                            //新加入的逻辑
                            return [4 /*yield*/, sessionOverdue(err_18, 'payresult')
                                //新加入的逻辑
                            ];
                        case 7:
                            //新加入的逻辑
                            _m.sent();
                            //新加入的逻辑
                            return [2 /*return*/];
                        case 8: return [3 /*break*/, 20];
                        case 9:
                            reqOrder_1.callback_from = 1;
                            reqOrder_1.ext = __assign(__assign({}, reqOrder_1.ext), {
                                wx_openid: USER_INFO.tid,
                                zone_id: '1',
                                pf: 'android',
                            });
                            orderReq = reqOrder_1;
                            return [4 /*yield*/, orderApi(this.withDirectAdStatus(reqOrder_1))];
                        case 10:
                            result_1 = _m.sent();
                            this.track({
                                complete: function () { },
                            }, formatTrackParams(__assign({ eventName: 'requestproduct', apiName: 'pay_order', state: '下单成功', reqParams: params, errorInfo: {}, loginInfo: USER_INFO, orderReq: orderReq, orderRes: (result_1 === null || result_1 === void 0 ? void 0 : result_1.data) || {} }, ((result_1 === null || result_1 === void 0 ? void 0 : result_1.data) || {}))));
                            res_1 = result_1.data;
                            ext = res_1.ext, notify_url = res_1.notify_url, order_no_2 = res_1.order_no, price_1 = res_1.price;
                            if (!(ext.amount > ext.balance)) return [3 /*break*/, 12];
                            requestMidasPaymentParams = {
                                mode: 'game',
                                offerId: ext.offer_id,
                                currencyType: 'CNY',
                                platform: 'android',
                                buyQuantity: ext.amount,
                                zoneId: params.zoneId || '1',
                                env: params.env || 0,
                                outTradeNo: order_no_2,
                            };
                            console.info('wx.requestMidasPayment params: ', requestMidasPaymentParams);
                            requestMidasPaymentReq = requestMidasPaymentParams;
                            return [4 /*yield*/, asyncFunc(wx.requestMidasPayment, requestMidasPaymentParams)];
                        case 11:
                            _m.sent();
                            this._reportPurchase(price_1);
                            _m.label = 12;
                        case 12:
                            if (!callback.paySuccCallback) return [3 /*break*/, 14];
                            return [4 /*yield*/, Promise.resolve(callback.paySuccCallback())];
                        case 13:
                            _m.sent();
                            _m.label = 14;
                        case 14:
                            _m.trys.push([14, 16, , 20]);
                            payCallbackReq = {
                                wx_openid: USER_INFO.tid,
                                order_no: order_no_2,
                                amount: ext.amount,
                                env: params.env || 0,
                                zone_id: params.zoneId || '1',
                                pf: 'android',
                            };
                            this.track({
                                complete: function () { },
                            }, formatTrackParams(__assign({ eventName: 'notify', apiName: 'pay_callback', reqParams: params, errorInfo: {}, loginInfo: USER_INFO, payCallbackReq: __assign({ notify_url: notify_url }, payCallbackReq), state: '开始验证' }, ((result_1 === null || result_1 === void 0 ? void 0 : result_1.data) || {}))));
                            return [4 /*yield*/, payCallback(notify_url, payCallbackReq)];
                        case 15:
                            _m.sent();
                            return [3 /*break*/, 20];
                        case 16:
                            err_19 = _m.sent();
                            if (!isDropOrder(err_19 === null || err_19 === void 0 ? void 0 : err_19.code)) return [3 /*break*/, 17];
                            key = "rx_".concat(USER_INFO.tid);
                            payParams = {
                                notify_url: notify_url,
                                wx_openid: USER_INFO.tid,
                                order_no: order_no_2,
                                amount: ext.amount,
                                env: params.env || 0,
                                zone_id: params.zoneId || '1',
                                pf: 'android',
                            };
                            this.track({
                                complete: function () { },
                            }, formatTrackParams(__assign(__assign({ eventName: 'payresult', apiName: 'pay_callback_fail', reqParams: params, errorInfo: err_19, loginInfo: USER_INFO, payCallbackReq: __assign({}, payParams) }, ((result_1 === null || result_1 === void 0 ? void 0 : result_1.data) || {})), { desc: 'paycallback dropped order, about to enter the automatic supplement order process' })));
                            customSetStorageSync(key, payParams);
                            try {
                                customSetStorageSync(key + '_track', result_1 === null || result_1 === void 0 ? void 0 : result_1.data);
                            }
                            catch (err) {
                            }
                            err_19.data = err_19.data || {};
                            err_19.data = __assign(__assign({}, err_19.data), { payParams: payParams });
                            handleDynamicSupplementOrder();
                            callback.complete(handleTrackError('rxlog_error_pay', err_19));
                            // await sessionOverdue(err)
                            return [2 /*return*/];
                        case 17: 
                        //非补单的逻辑
                        return [4 /*yield*/, sessionOverdue(err_19, 'payresult')];
                        case 18:
                            //非补单的逻辑
                            _m.sent();
                            return [2 /*return*/];
                        case 19: return [3 /*break*/, 20];
                        case 20: return [3 /*break*/, 45];
                        case 21:
                            reqOrder_1.callback_from = 1;
                            reqOrder_1.ext = __assign(__assign({}, reqOrder_1.ext), {
                                wx_openid: USER_INFO.tid,
                                zone_id: '1',
                                pf: 'android',
                            });
                            orderReq = reqOrder_1;
                            return [4 /*yield*/, orderApi(this.withDirectAdStatus(reqOrder_1))];
                        case 22:
                            result = _m.sent();
                            this.track({
                                complete: function () { },
                            }, formatTrackParams(__assign({ eventName: 'requestproduct', apiName: 'pay_order', state: '下单成功', reqParams: params, errorInfo: {}, loginInfo: USER_INFO, orderReq: orderReq, orderRes: (result === null || result === void 0 ? void 0 : result.data) || {} }, ((result === null || result === void 0 ? void 0 : result.data) || {}))));
                            _m.label = 23;
                        case 23:
                            _m.trys.push([23, 27, , 29]);
                            res_2 = result.data;
                            ext = res_2.ext, price_2 = res_2.price;
                            requestMidasPaymentParams = {
                                paySig: ext.paySig,
                                signData: ext.signData,
                                signature: ext.signature
                            };
                            console.info('wx.requestMidasPaymentGameItem params: ', requestMidasPaymentParams);
                            requestMidasPaymentReq = requestMidasPaymentParams;
                            // @ts-ignore
                            return [4 /*yield*/, asyncFunc(wx.requestMidasPaymentGameItem, requestMidasPaymentParams)];
                        case 24:
                            // @ts-ignore
                            _m.sent();
                            this._reportPurchase(price_2);
                            if (!callback.paySuccCallback) return [3 /*break*/, 26];
                            return [4 /*yield*/, Promise.resolve(callback.paySuccCallback())];
                        case 25:
                            _m.sent();
                            _m.label = 26;
                        case 26: return [3 /*break*/, 29];
                        case 27:
                            err_20 = _m.sent();
                            //非补单的逻辑
                            return [4 /*yield*/, sessionOverdue(err_20, 'payresult')];
                        case 28:
                            //非补单的逻辑
                            _m.sent();
                            return [2 /*return*/];
                        case 29: return [3 /*break*/, 45];
                        case 30:
                            reqOrder_1.ext = __assign(__assign({}, reqOrder_1.ext), {
                                wx_openid: USER_INFO.tid,
                                zone_id: '1',
                                pf: 'android',
                            });
                            orderReq = reqOrder_1;
                            return [4 /*yield*/, orderApi(this.withDirectAdStatus(reqOrder_1))];
                        case 31:
                            miniorder = (_m.sent()).data.ext.miniorder;
                            changeNumberKey = ['env', 'buyQuantity', 'timeStamp'];
                            for (key in miniorder) {
                                if (changeNumberKey.includes(key)) {
                                    miniorder[key] = Number(miniorder[key]);
                                }
                            }
                            return [4 /*yield*/, asyncFunc(wx.requestMidasFriendPayment, __assign({}, miniorder))];
                        case 32:
                            _m.sent();
                            return [3 /*break*/, 45];
                        case 33:
                            if (params.direct_send) {
                                reqOrder_1.ext = {
                                    customer: 1,
                                    'direct_send': params.direct_send,
                                    'title': params.title,
                                    'desc': params.desc,
                                    'image': params.image,
                                    'latest_order_valid': (params === null || params === void 0 ? void 0 : params.latest_order_valid) || false
                                };
                            }
                            else {
                                reqOrder_1.ext = {
                                    customer: 1
                                };
                            }
                            orderReq = reqOrder_1;
                            return [4 /*yield*/, orderApi(this.withDirectAdStatus(reqOrder_1))];
                        case 34:
                            _k = (_m.sent()).data, goods_tag = _k.goods_tag, order_nos = _k.order_no, price = _k.price;
                            path = SYSTEM_INFO$1.baseUrlList[SYSTEM_INFO$1.reqUrlIndex] +
                                "/v1/ke/wa/wxpub/order?order_no=".concat(order_nos, "&channel_id=").concat(SYSTEM_INFO$1.channelId, "&money=").concat(price, "&product_id=").concat(SYSTEM_INFO$1.productId, "&time=") +
                                Math.ceil(new Date().getTime() / 1000) +
                                "&rx_openid=".concat(USER_INFO.openid, "&goods_tag=").concat(goods_tag);
                            console.info('sdk 跳转链接: ', path);
                            try {
                                existingData = customGetStorageSync('rx_cache_order_price');
                                cacheList = [];
                                // 如果存在数据，确保是数组格式
                                if (existingData) {
                                    cacheList = Array.isArray(existingData) ? existingData : [existingData];
                                }
                                // 将新数据插入到数组最前面
                                cacheList.unshift({
                                    order_nos: order_nos,
                                    price: price
                                });
                                // 如果超过5条数据，只保留前5条
                                if (cacheList.length > 5) {
                                    cacheList = cacheList.slice(0, 5);
                                }
                                // 保存更新后的数据
                                customSetStorageSync('rx_cache_order_price', cacheList);
                                onHide_2 = function () {
                                    wx.offHide(onHide_2);
                                };
                                onShow_2 = function () { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        wx.offShow(onShow_2);
                                        this.reportPurchaseByCache();
                                        return [2 /*return*/];
                                    });
                                }); };
                                wx.onHide(onHide_2);
                                wx.onShow(onShow_2);
                            }
                            catch (e) {
                            }
                            return [4 /*yield*/, this._openCustomerServiceConversation({}, {
                                    params: "",
                                    desc: '充值',
                                    func: params.func,
                                    reconfirm: true,
                                    sessionFrom: JSON.stringify(__assign(__assign({}, params === null || params === void 0 ? void 0 : params.sessionFromExt), { ruixue_openid: USER_INFO.openid, sub_channel_id: this.subChannelId, url: path, ui: 'ruixue_pay_wxpub', goods_tag: goods_tag, order_no: order_nos, price: String(price), priceYuan: String(price / 100) })),
                                }, !!params.func)];
                        case 35:
                            shareInfo = _m.sent();
                            try {
                                this.track({
                                    complete: function () { },
                                }, formatTrackParams({
                                    eventName: 'opencustomer',
                                    apiName: 'pay_callback',
                                    reqParams: {
                                        params: "",
                                        desc: '客服调用参数上报',
                                        func: params.func,
                                        reconfirm: true,
                                        sessionFrom: JSON.stringify(__assign(__assign({}, params === null || params === void 0 ? void 0 : params.sessionFromExt), { ruixue_openid: USER_INFO.openid, sub_channel_id: this.subChannelId, url: path, ui: 'ruixue_pay_wxpub', goods_tag: goods_tag, order_no: order_nos, price: String(price), priceYuan: String(price / 100) })),
                                        shareInfo: JSON.stringify(shareInfo)
                                    },
                                    errorInfo: {},
                                    loginInfo: USER_INFO,
                                    payCallbackReq: {},
                                    order_no: order_nos,
                                    goods_tag: goods_tag,
                                    goods_price: String(price),
                                }));
                            }
                            catch (err) { }
                            return [3 /*break*/, 45];
                        case 36:
                            short_url = SYSTEM_INFO$1.short_domain || params.short_url;
                            if (params.preview_image && !short_url) {
                                throw Error('when preview_image is true,the short_domain must be required');
                            }
                            if (!params.miniprogram_name) {
                                throw Error('when pay_type is jump_miniprogram,the miniprogram_name must be required');
                            }
                            appId = wx.getAccountInfoSync().miniProgram.appId;
                            reqOrder_1.ext = __assign(__assign({}, reqOrder_1.ext), { short_url: short_url || '', miniprogram_appid: appId, miniprogram_args: params.miniprogram_args || {}, miniprogram_name: params.miniprogram_name || '' });
                            console.log('order params');
                            console.log(reqOrder_1);
                            return [4 /*yield*/, orderApi(this.withDirectAdStatus(reqOrder_1))];
                        case 37:
                            res_3 = _m.sent();
                            onShow_3 = function (_a) {
                                var referrerInfo = _a.referrerInfo;
                                return __awaiter(_this, void 0, void 0, function () {
                                    var appid, status, err;
                                    var _b;
                                    return __generator(this, function (_c) {
                                        console.log('---referrerInfo---', referrerInfo);
                                        wx.offShow(onShow_3);
                                        appid = referrerInfo === null || referrerInfo === void 0 ? void 0 : referrerInfo.appId;
                                        status = (_b = referrerInfo === null || referrerInfo === void 0 ? void 0 : referrerInfo.extraData) === null || _b === void 0 ? void 0 : _b.status;
                                        err = {};
                                        if (appid == res_3.data.ext.jump_appid) {
                                            if (status === 0) {
                                                callback.complete({
                                                    code: 0
                                                });
                                            }
                                            else if (status == 4002) {
                                                err.code = COMMON_ERROR_CODE.PAY_ERROR;
                                                err.thirdcode = -1;
                                                err.msg = '支付失败';
                                                callback.complete(handleTrackError('rxlog_error_pay', err));
                                            }
                                            else if (status == 4001) {
                                                err.code = 4001;
                                                err.thirdcode = -2;
                                                err.msg = '取消支付';
                                                callback.complete(handleTrackError('rxlog_error_pay', err));
                                            }
                                            else {
                                                err.code = COMMON_ERROR_CODE.UNKNOWN_PAY_ERROR;
                                                err.thirdcode = COMMON_ERROR_CODE.UNKNOWN_PAY_ERROR;
                                                err.msg = '未知支付状态';
                                                callback.complete(handleTrackError('rxlog_error_pay', err));
                                            }
                                        }
                                        else {
                                            err.code = COMMON_ERROR_CODE.UNKNOWN_PAY_ERROR;
                                            err.thirdcode = COMMON_ERROR_CODE.UNKNOWN_PAY_ERROR;
                                            err.msg = '未知支付状态';
                                            callback.complete(handleTrackError('rxlog_error_pay', err));
                                        }
                                        return [2 /*return*/];
                                    });
                                });
                            };
                            if (params.preview_image) {
                                wx.previewImage({
                                    current: 'data:image/png;base64,' + ((_b = (_a = res_3.data) === null || _a === void 0 ? void 0 : _a.ext) === null || _b === void 0 ? void 0 : _b.wxacode_base64),
                                    urls: ['data:image/png;base64,' + ((_d = (_c = res_3.data) === null || _c === void 0 ? void 0 : _c.ext) === null || _d === void 0 ? void 0 : _d.wxacode_base64)],
                                    success: function () {
                                        wx.onShow(onShow_3);
                                    },
                                    fail: function (err) {
                                        callback.complete(handleTrackError('rxlog_error_pay', err));
                                    }
                                });
                            }
                            else {
                                try {
                                    wx.navigateToMiniProgram({
                                        appId: (_f = (_e = res_3.data) === null || _e === void 0 ? void 0 : _e.ext) === null || _f === void 0 ? void 0 : _f.jump_appid,
                                        path: "pages/order/order-detail/index?data=".concat(res_3.data.ext.data, "&domain=").concat(encodeURIComponent(SYSTEM_INFO$1.baseUrlList[SYSTEM_INFO$1.reqUrlIndex]), "&goods_name=").concat(res_3.data.goods_name, "&price=").concat(res_3.data.price, "&name=").concat(params.miniprogram_name),
                                        envVersion: params.envVersion || 'release',
                                        success: function () {
                                            wx.onShow(onShow_3);
                                        },
                                        fail: function (e) {
                                            console.log(e);
                                            wx.offShow(onShow_3);
                                            if (e.errMsg == 'navigateToMiniProgramWithoutTapCheck:fail cancel') {
                                                callback.complete(handleTrackError('rxlog_error_pay', {
                                                    code: COMMON_ERROR_CODE.CANCEL_JUMP_MINIGAME,
                                                    msg: '取消跳转小程序支付',
                                                    thirdcode: COMMON_ERROR_CODE.CANCEL_JUMP_MINIGAME
                                                }));
                                            }
                                            else {
                                                callback.complete(handleTrackError('rxlog_error_pay', e));
                                            }
                                        }
                                    });
                                }
                                catch (e) {
                                    console.log(e);
                                    wx.offShow(onShow_3);
                                    callback.complete(handleTrackError('rxlog_error_pay', e));
                                }
                            }
                            return [2 /*return*/];
                        case 38:
                            reqOrder_1.ext = {
                                "miniprogram": true
                            };
                            orderReq = reqOrder_1;
                            return [4 /*yield*/, orderApi(this.withDirectAdStatus(reqOrder_1))];
                        case 39:
                            resData = _m.sent();
                            callback.complete({
                                code: 0,
                                pay_url: (_h = (_g = resData.data) === null || _g === void 0 ? void 0 : _g.ext) === null || _h === void 0 ? void 0 : _h.pay_url
                            });
                            return [2 /*return*/];
                        case 40:
                            reqOrder_1.ext = {
                                pay_type: 'h5',
                            };
                            orderReq = reqOrder_1;
                            return [4 /*yield*/, orderApi(this.withDirectAdStatus(reqOrder_1))];
                        case 41:
                            _l = (_m.sent()).data, goods_tags = _l.goods_tag, order_no = _l.order_no, priceFen = _l.price, url = _l.ext.url;
                            sessionFromStr = JSON.stringify(__assign(__assign({}, params === null || params === void 0 ? void 0 : params.sessionFromExt), { url: url, ui: 'ruixue_pay_aums_h5', ruixue_openid: USER_INFO.openid, goods_tag: goods_tags, order_no: order_no, price: String(priceFen), priceYuan: String(priceFen / 100) }));
                            console.log('sdk 打开客服 sessionFrom参数', sessionFromStr);
                            try {
                                this.track({
                                    complete: function () { },
                                }, formatTrackParams({
                                    eventName: 'opencustomer',
                                    apiName: 'pay_callback',
                                    reqParams: {
                                        params: "",
                                        desc: '云闪付 客服调用参数上报',
                                        func: params.func,
                                        reconfirm: true,
                                        sessionFrom: JSON.stringify(__assign(__assign({}, params === null || params === void 0 ? void 0 : params.sessionFromExt), { ruixue_openid: USER_INFO.openid, url: url, ui: 'ruixue_pay_wxpub', goods_tag: goods_tag, order_no: order_nos, price: String(price), priceYuan: String(price / 100) })),
                                    },
                                    errorInfo: {},
                                    loginInfo: USER_INFO,
                                    payCallbackReq: {},
                                    order_no: order_nos,
                                    goods_tag: goods_tag,
                                    goods_price: String(price),
                                }));
                            }
                            catch (err) { }
                            return [4 /*yield*/, this._openCustomerServiceConversation({}, {
                                    params: "",
                                    desc: '充值',
                                    func: params.func,
                                    reconfirm: true,
                                    sessionFrom: sessionFromStr,
                                })];
                        case 42:
                            _m.sent();
                            return [3 /*break*/, 45];
                        case 43:
                            // 判断是否支持 Ios wx.requestMidasPaymentGameItem
                            try {
                                // @ts-ignore
                                if (wx.checkIsSupportMidasPayment) {
                                    // @ts-ignore
                                    wx.checkIsSupportMidasPayment({
                                        success: function (res) { return __awaiter(_this, void 0, void 0, function () {
                                            var result_order, res_4, ext, price_3, requestMidasPaymentParams, err_22;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        if (!res.data.allow_pay) return [3 /*break*/, 9];
                                                        reqOrder_1.callback_from = 1;
                                                        reqOrder_1.ext = __assign(__assign({}, reqOrder_1.ext), {
                                                            wx_openid: USER_INFO.tid,
                                                            zone_id: '1',
                                                            pf: 'android',
                                                        });
                                                        orderReq = reqOrder_1;
                                                        // mode 为 coins 时，使用 minigame_v2 支付，否则使用 midas_game_item 支付
                                                        reqOrder_1.pay_type = (params === null || params === void 0 ? void 0 : params.mode) === 'coins' ? 'minigame_v2' : 'midas_game_item';
                                                        return [4 /*yield*/, orderApi(this.withDirectAdStatus(reqOrder_1))];
                                                    case 1:
                                                        result_order = _a.sent();
                                                        this.track({
                                                            complete: function () { },
                                                        }, formatTrackParams(__assign({ eventName: 'requestproduct', apiName: 'pay_order', state: '下单成功', reqParams: params, errorInfo: {}, loginInfo: USER_INFO, orderReq: orderReq, orderRes: (result_order === null || result_order === void 0 ? void 0 : result_order.data) || {} }, ((result_order === null || result_order === void 0 ? void 0 : result_order.data) || {}))));
                                                        _a.label = 2;
                                                    case 2:
                                                        _a.trys.push([2, 6, , 8]);
                                                        res_4 = result_order.data;
                                                        ext = res_4.ext, price_3 = res_4.price;
                                                        requestMidasPaymentParams = {
                                                            paySig: ext.paySig,
                                                            signData: __assign({ mode: params === null || params === void 0 ? void 0 : params.mode }, ext.signData),
                                                            signature: ext.signature
                                                        };
                                                        console.info('wx.requestMidasPaymentGameItem params: ', requestMidasPaymentParams);
                                                        requestMidasPaymentReq = requestMidasPaymentParams;
                                                        // @ts-ignore
                                                        return [4 /*yield*/, asyncFunc(wx.requestMidasPaymentGameItem, requestMidasPaymentParams)];
                                                    case 3:
                                                        // @ts-ignore
                                                        _a.sent();
                                                        this._reportPurchase(price_3);
                                                        if (!callback.paySuccCallback) return [3 /*break*/, 5];
                                                        return [4 /*yield*/, Promise.resolve(callback.paySuccCallback())];
                                                    case 4:
                                                        _a.sent();
                                                        _a.label = 5;
                                                    case 5: return [3 /*break*/, 8];
                                                    case 6:
                                                        err_22 = _a.sent();
                                                        //非补单的逻辑
                                                        return [4 /*yield*/, sessionOverdue(err_22, 'payresult')];
                                                    case 7:
                                                        //非补单的逻辑
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                    case 8: return [3 /*break*/, 10];
                                                    case 9:
                                                        callback.complete({ code: COMMON_ERROR_CODE.PAY_TYPE_ERROR, msg: '当前环境不支持该支付方式', data: params });
                                                        _a.label = 10;
                                                    case 10: return [2 /*return*/];
                                                }
                                            });
                                        }); },
                                        fail: function (err) {
                                            callback.complete({ code: -1, msg: 'requestMidasPaymentGameItem 支付方式支付失败', data: params });
                                        }
                                    });
                                }
                                else {
                                    callback.complete({ code: COMMON_ERROR_CODE.PAY_TYPE_ERROR, msg: '当前环境不支持该支付方式', data: params });
                                }
                            }
                            catch (error) {
                                callback.complete({ code: -1, msg: '支付失败' });
                            }
                            return [3 /*break*/, 45];
                        case 44:
                            callback.complete(handleTrackError('rxlog_error_pay', { code: 4000, msg: "\u672A\u77E5\u7684\u652F\u4ED8\u65B9\u5F0F ".concat(pay_type) }));
                            return [2 /*return*/];
                        case 45:
                            callback.complete({ code: 0 });
                            this.refreshSession = 0;
                            return [3 /*break*/, 49];
                        case 46:
                            err_21 = _m.sent();
                            //新加入的逻辑
                            return [4 /*yield*/, sessionOverdue(err_21, 'payresult')];
                        case 47:
                            //新加入的逻辑
                            _m.sent();
                            return [3 /*break*/, 49];
                        case 48:
                            // 清理上报支付订单接口所有队列和缓存
                            clearAllQueuesAndCache();
                            return [7 /*endfinally*/];
                        case 49: return [2 /*return*/];
                    }
                });
            });
        };
        SdkWegame.prototype._openCustomerServiceConversation = function (_a, _b, showMessageCard) {
            var _c, _d;
            var complete = _a.complete;
            var params = _b.params, _e = _b.desc, desc = _e === void 0 ? '' : _e, func = _b.func, title = _b.title, image = _b.image, reconfirm = _b.reconfirm, _f = _b.sessionFrom, sessionFrom = _f === void 0 ? "{}" : _f;
            if (showMessageCard === void 0) { showMessageCard = true; }
            return __awaiter(this, void 0, void 0, function () {
                var shareInfo, infoResult, ip, access_token, devicecode, e_8, e_9, data, openConversation_1, error_3;
                var _this = this;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            shareInfo = {};
                            infoResult = {};
                            ip = '';
                            access_token = '';
                            devicecode = getDevicecode();
                            if (!(desc !== '充值')) return [3 /*break*/, 8];
                            _g.label = 1;
                        case 1:
                            _g.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, getIpApi()];
                        case 2:
                            _g.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            e_8 = _g.sent();
                            ip = e_8.client_ip;
                            return [3 /*break*/, 4];
                        case 4:
                            _g.trys.push([4, 6, , 7]);
                            return [4 /*yield*/, _getInfoApi()];
                        case 5:
                            infoResult = _g.sent();
                            return [3 /*break*/, 7];
                        case 6:
                            e_9 = _g.sent();
                            console.log(e_9);
                            return [3 /*break*/, 7];
                        case 7:
                            try {
                                access_token = customGetStorageSync('rxToken').access;
                            }
                            catch (e) {
                                console.log(e);
                            }
                            console.log('sessionFrom', sessionFrom);
                            if (typeof sessionFrom === 'object') {
                                sessionFrom = __assign(__assign({}, sessionFrom), { r_mode: "".concat((infoResult === null || infoResult === void 0 ? void 0 : infoResult.data.r_mode) || 0), ip: ip, devicecode: devicecode, access_token: access_token });
                            }
                            else {
                                try {
                                    sessionFrom = __assign(__assign({}, JSON.parse(sessionFrom)), { r_mode: "".concat((infoResult === null || infoResult === void 0 ? void 0 : infoResult.data.r_mode) || 0), ip: ip, devicecode: devicecode, access_token: access_token });
                                    sessionFrom = JSON.stringify(sessionFrom);
                                }
                                catch (e) {
                                    console.log(e);
                                }
                            }
                            _g.label = 8;
                        case 8:
                            try {
                                console.info(JSON.parse(sessionFrom));
                            }
                            catch (e) {
                                console.info(sessionFrom);
                            }
                            _g.label = 9;
                        case 9:
                            _g.trys.push([9, 13, , 14]);
                            if (!func) return [3 /*break*/, 11];
                            return [4 /*yield*/, getShareDataApi(this.withDirectAdStatus({
                                    product_id: SYSTEM_INFO$1.productId,
                                    channel_id: SYSTEM_INFO$1.channelId,
                                    sub_channel_id: this.subChannelId || '',
                                    region: USER_INFO.region || '',
                                    func: func,
                                    platform: PLATFORM.WECHAT,
                                    type: 'mini',
                                }))];
                        case 10:
                            data = (_g.sent()).data;
                            if (data) {
                                title = (_c = data.content) === null || _c === void 0 ? void 0 : _c.content;
                                image = (_d = data.content) === null || _d === void 0 ? void 0 : _d.image;
                                shareInfo = data.content || {};
                            }
                            _g.label = 11;
                        case 11:
                            openConversation_1 = function () { return __awaiter(_this, void 0, void 0, function () {
                                var result, error_4, errMsg, confirm_1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 8]);
                                            return [4 /*yield*/, asyncFunc(wx.openCustomerServiceConversation, {
                                                    showMessageCard: showMessageCard,
                                                    sessionFrom: sessionFrom,
                                                    sendMessageTitle: title,
                                                    sendMessagePath: params,
                                                    sendMessageImg: image,
                                                })
                                                //新增逻辑
                                            ];
                                        case 1:
                                            result = _a.sent();
                                            //新增逻辑
                                            complete && complete({ code: 0, data: __assign(__assign({}, result), { params: params }) });
                                            return [3 /*break*/, 8];
                                        case 2:
                                            error_4 = _a.sent();
                                            errMsg = error_4.errMsg;
                                            if (errMsg && !errMsg.includes('cancel')) {
                                                if (complete) {
                                                    complete(handleTrackError('', error_4));
                                                }
                                                else {
                                                    throw error_4;
                                                }
                                            }
                                            if (!reconfirm) return [3 /*break*/, 4];
                                            return [4 /*yield*/, asyncFunc(wx.showModal, {
                                                    title: MODAL_TITLE,
                                                    content: "\u56E0\u7248\u672C\u9650\u5236, \u9700\u901A\u8FC7[\u5BA2\u670D\u4F1A\u8BDD]".concat(desc, ", \u8BF7\u60A8\u8C05\u89E3!"),
                                                    cancelText: '我知道了',
                                                    confirmText: '立即前往',
                                                })];
                                        case 3:
                                            (confirm_1 = (_a.sent()).confirm);
                                            _a.label = 4;
                                        case 4:
                                            if (!confirm_1) return [3 /*break*/, 6];
                                            return [4 /*yield*/, openConversation_1()];
                                        case 5:
                                            _a.sent();
                                            return [3 /*break*/, 7];
                                        case 6:
                                            if (complete) {
                                                console.log('触发2');
                                                complete(handleTrackError('', error_4));
                                            }
                                            else {
                                                throw new Error('用户取消');
                                            }
                                            _a.label = 7;
                                        case 7: return [3 /*break*/, 8];
                                        case 8: return [2 /*return*/];
                                    }
                                });
                            }); };
                            return [4 /*yield*/, openConversation_1()];
                        case 12:
                            _g.sent();
                            return [3 /*break*/, 14];
                        case 13:
                            error_3 = _g.sent();
                            if (complete) {
                                complete(handleTrackError('', error_3));
                            }
                            else {
                                handleTrackError('', error_3);
                            }
                            this.track({
                                complete: function (data) {
                                    console.info('_openCustomerServiceConversation error add complete func when tracked:', data);
                                },
                            }, formatTrackParams({
                                eventName: 'track_err',
                                apiName: '_openCustomerServiceConversation',
                                reqParams: {
                                    params: params,
                                    desc: desc,
                                    func: func,
                                    title: title,
                                    image: image,
                                    reconfirm: reconfirm,
                                    sessionFrom: sessionFrom,
                                },
                                errorInfo: error_3,
                                loginInfo: USER_INFO,
                            }));
                            return [3 /*break*/, 14];
                        case 14: return [2 /*return*/, shareInfo];
                    }
                });
            });
        };
        SdkWegame.prototype.schedulingAction = function (params, callback) {
            var _a, _b, _c, _d, _e, _f;
            return __awaiter(this, void 0, void 0, function () {
                var func, schedulingRes, scheduling_type, shareData, adUnitId, ad_type_1, err_23;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            _g.trys.push([0, 2, , 3]);
                            func = params === null || params === void 0 ? void 0 : params.func;
                            schedulingRes = this.getShareScheduling({ funcs: [func] });
                            scheduling_type = ((_b = (_a = schedulingRes === null || schedulingRes === void 0 ? void 0 : schedulingRes.data) === null || _a === void 0 ? void 0 : _a[func]) === null || _b === void 0 ? void 0 : _b.scheduling_type) || 'share';
                            console.log('sdk schedulingAction scheduling_type:', func, scheduling_type);
                            return [4 /*yield*/, this.getShareData(params, callback, true)];
                        case 1:
                            shareData = _g.sent();
                            console.log('sdk getShareData:', shareData);
                            if (scheduling_type === 'ad') {
                                adUnitId = params.adUnitId || ((_d = (_c = shareData === null || shareData === void 0 ? void 0 : shareData.data) === null || _c === void 0 ? void 0 : _c.ad_content) === null || _d === void 0 ? void 0 : _d.identify);
                                ad_type_1 = params.adUnitId || ((_f = (_e = shareData === null || shareData === void 0 ? void 0 : shareData.data) === null || _e === void 0 ? void 0 : _e.ad_content) === null || _f === void 0 ? void 0 : _f.ad_type);
                                switch (ad_type_1) {
                                    case 'custom_cell':
                                        this.createCustomAd({
                                            adUnitId: adUnitId,
                                            custom_ext: params.custom_ext,
                                            style: params.cellStyle || params.style || {}
                                        }, {
                                            complete: 
                                            // @ts-ignore
                                            function (args) {
                                                callback.complete(__assign({ scheduling_type: 'ad', ad_type: ad_type_1 }, (args || {})));
                                            }
                                        });
                                        break;
                                    case 'custom_cells':
                                        this.createCustomAd({
                                            adUnitId: adUnitId,
                                            custom_ext: params.custom_ext,
                                            style: params.cellsStyle || params.style || {}
                                        }, {
                                            complete: 
                                            // @ts-ignore
                                            function (args) {
                                                callback.complete(__assign({ scheduling_type: 'ad', ad_type: ad_type_1 }, (args || {})));
                                            }
                                        });
                                        break;
                                    case 'custom_matrix':
                                        this.createCustomAd({
                                            adUnitId: adUnitId,
                                            custom_ext: params.custom_ext,
                                            style: params.matrixStyle || params.style || {}
                                        }, {
                                            complete: 
                                            // @ts-ignore
                                            function (args) {
                                                callback.complete(__assign({ scheduling_type: 'ad', ad_type: ad_type_1 }, (args || {})));
                                            }
                                        });
                                        break;
                                    case 'custom_banner':
                                        this.createCustomAd({
                                            adUnitId: adUnitId,
                                            custom_ext: params.custom_ext,
                                            style: params.bannerStyle || params.style || {}
                                        }, {
                                            complete: 
                                            // @ts-ignore
                                            function (args) {
                                                callback.complete(__assign({ scheduling_type: 'ad', ad_type: ad_type_1 }, (args || {})));
                                            }
                                        });
                                        break;
                                    case 'interstitial':
                                        this.interstitialAd({
                                            adUnitId: adUnitId,
                                            custom_ext: params.custom_ext
                                        }, {
                                            complete: 
                                            // @ts-ignore
                                            function (args) {
                                                callback.complete(__assign({ scheduling_type: 'ad', ad_type: ad_type_1 }, (args || {})));
                                            }
                                        });
                                        break;
                                    default:
                                        this.rewardedVideoAd({
                                            adUnitId: adUnitId,
                                            custom_ext: params.custom_ext
                                        }, {
                                            complete: 
                                            // @ts-ignore
                                            function (args) {
                                                callback.complete(__assign({ scheduling_type: 'ad', ad_type: ad_type_1 }, (args || {})));
                                            }
                                        });
                                }
                            }
                            else if (scheduling_type === 'share') {
                                this.share(params, {
                                    complete: 
                                    // @ts-ignore
                                    function (args) {
                                        callback.complete(__assign({ scheduling_type: 'share' }, (args || {})));
                                    }
                                });
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            err_23 = _g.sent();
                            callback.complete(handleTrackError('rxlog_error_share', err_23));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        //获得分享内容
        SdkWegame.prototype.getAdShareData = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var region, productId, channelId, platform, transmits, func, type, sub_channel_id, open_id, shareData, err_24;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            region = (params === null || params === void 0 ? void 0 : params.region) || USER_INFO.region || '';
                            productId = SYSTEM_INFO$1.productId, channelId = SYSTEM_INFO$1.channelId;
                            platform = 'wechat';
                            transmits = encodeURI(params.transmits || '');
                            func = params.func;
                            type = 'mini';
                            sub_channel_id = this.subChannelId || '';
                            open_id = USER_INFO.openid;
                            return [4 /*yield*/, getAdShareDataApi({
                                    func: func,
                                    transmits: transmits,
                                    product_id: productId,
                                    channel_id: channelId,
                                    platform: platform,
                                    type: type,
                                    region: region,
                                    sub_channel_id: sub_channel_id,
                                    open_id: open_id,
                                    custom_ext: params.custom_ext
                                })];
                        case 1:
                            shareData = _a.sent();
                            callback && callback.complete(shareData);
                            return [2 /*return*/, shareData];
                        case 2:
                            err_24 = _a.sent();
                            callback && callback.complete(handleTrackError('', err_24));
                            return [2 /*return*/, err_24];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SdkWegame.prototype.createCustomAd = function (data, _a) {
            var _b, _c;
            var complete = _a.complete, failCallback = _a.fail;
            return __awaiter(this, void 0, void 0, function () {
                var adShareData, adUnitId, customAd, p, _error;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            console.log('createCustomAd');
                            adShareData = {};
                            if (!(!data.adUnitId && data.func)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.getAdShareData({
                                    func: data.func,
                                    custom_ext: data.custom_ext || {}
                                })];
                        case 1:
                            adShareData = _d.sent();
                            console.log('ad share data', adShareData);
                            _d.label = 2;
                        case 2:
                            adUnitId = data.adUnitId || ((_c = (_b = adShareData === null || adShareData === void 0 ? void 0 : adShareData.data) === null || _b === void 0 ? void 0 : _b.ad_content) === null || _c === void 0 ? void 0 : _c.identify);
                            console.log('adUnitId:', adUnitId);
                            customAd = wx.createCustomAd({ adUnitId: adUnitId, style: data.style });
                            if (customAd) {
                                customAd.onClose(function (res) {
                                    customAd.destroy();
                                    // complete({
                                    //   code: 1,
                                    //   msg: '原生模板广告关闭'
                                    // })
                                });
                                customAd.onError(function (err) {
                                    console.log(err);
                                    customAd.destroy();
                                });
                                p = customAd.show();
                                p.then(function () {
                                    complete && complete({
                                        code: 0,
                                        msg: '原生模板广告显示',
                                        ad: customAd
                                    });
                                }).catch(function (error) {
                                    console.log("show custom ad failed, error");
                                    console.log(error);
                                    var _error = handleTrackError('rxlog_error_ad', {
                                        code: -1,
                                        msg: error.errMsg,
                                        thirdcode: error.errCode,
                                        thirdmsg: error.errMsg,
                                    });
                                    complete(_error);
                                    failCallback && failCallback(_error);
                                });
                            }
                            else {
                                _error = handleTrackError('rxlog_error_ad', {
                                    code: -1,
                                    msg: '创建广告组件失败'
                                });
                                complete(_error);
                                failCallback && failCallback(_error);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        //激励广告
        SdkWegame.prototype.rewardedVideoAd = function (data, _a) {
            var _b, _c;
            var complete = _a.complete, failCallback = _a.fail;
            return __awaiter(this, void 0, void 0, function () {
                var adShareData, adUnitId, fail, ad_1, onClose_1, catchLoadAndShowError_1, error_5;
                var _this = this;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            console.log('rewardedVideoAd');
                            adShareData = {};
                            if (!(!data.adUnitId && data.func)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.getAdShareData({
                                    func: data.func,
                                    custom_ext: data.custom_ext || {}
                                })];
                        case 1:
                            adShareData = _d.sent();
                            console.log('ad share data', adShareData);
                            _d.label = 2;
                        case 2:
                            adUnitId = data.adUnitId || ((_c = (_b = adShareData === null || adShareData === void 0 ? void 0 : adShareData.data) === null || _b === void 0 ? void 0 : _b.ad_content) === null || _c === void 0 ? void 0 : _c.identify);
                            console.log('adUnitId:', adUnitId);
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
                                var handle_err = handleTrackError('rxlog_error_ad', error);
                                complete(handle_err);
                                failCallback && failCallback(handle_err);
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
                            _d.label = 3;
                        case 3:
                            _d.trys.push([3, 6, , 7]);
                            onClose_1 = function (_a) {
                                var isEnded = _a.isEnded;
                                return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_b) {
                                        ad_1.offClose(onClose_1);
                                        if (isEnded) {
                                            complete({
                                                code: 0,
                                                data: null,
                                                msg: isEnded,
                                                isEnded: isEnded,
                                            });
                                        }
                                        else {
                                            complete({
                                                code: -1,
                                                data: null,
                                                msg: isEnded,
                                                isEnded: isEnded,
                                            });
                                        }
                                        try {
                                            if (data.destroyAd) {
                                                ad_1.destroy();
                                                console.info('destroy ad');
                                                this._ad = null;
                                                // @ts-ignore
                                                ad_1 = null;
                                            }
                                        }
                                        catch (e) {
                                        }
                                        return [2 /*return*/];
                                    });
                                });
                            };
                            if (!!this._ad) return [3 /*break*/, 5];
                            ad_1 = wx.createRewardedVideoAd({
                                adUnitId: adUnitId,
                                multiton: data.multiton || false
                            });
                            return [4 /*yield*/, new Promise(function (resolve, reject) {
                                    var timer = setTimeout(function () {
                                        reject({ code: 1000000, msg: 'adLoadTimeout' });
                                        clearTimeout(timer);
                                        timer = null;
                                    }, 10000);
                                    ad_1.onLoad(function () {
                                        _this._ad = ad_1;
                                        _this._hasAd.rewarded = true;
                                        resolve();
                                    });
                                    ad_1.onError(function (error) {
                                        _this._hasAd.rewarded = false;
                                        reject(error);
                                        try {
                                            if (data.destroyAd) {
                                                ad_1.destroy();
                                                console.info('destroy ad');
                                                _this._ad = null;
                                                // @ts-ignore
                                                ad_1 = null;
                                            }
                                        }
                                        catch (e) {
                                        }
                                    });
                                    ad_1.load();
                                })];
                        case 4:
                            _d.sent();
                            console.info(this._ad);
                            _d.label = 5;
                        case 5:
                            ad_1 = this._ad;
                            if (data.isCheck) {
                                complete(__assign(__assign({ code: 0 }, data), { adUnitId: adUnitId, isEnded: false, ad: ad_1 }));
                            }
                            else {
                                ad_1.onClose(onClose_1);
                                catchLoadAndShowError_1 = function (error) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        fail(error);
                                        return [2 /*return*/];
                                    });
                                }); };
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
                                if (!data.isCheck) {
                                    ad_1.show().catch(function () {
                                        // 失败重试
                                        ad_1.load()
                                            .then(function () { return ad_1.show(); })
                                            .catch(catchLoadAndShowError_1);
                                    });
                                }
                            }
                            return [3 /*break*/, 7];
                        case 6:
                            error_5 = _d.sent();
                            fail(error_5);
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        //插入广告
        SdkWegame.prototype.interstitialAd = function (data, _a) {
            var _b, _c;
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var adShareData, adUnitId, ad_2, error_6, err;
                var _this = this;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            console.log('interstitialAd');
                            adShareData = {};
                            if (!(!data.adUnitId && data.func)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.getAdShareData({
                                    func: data.func,
                                    custom_ext: data.custom_ext || {}
                                })];
                        case 1:
                            adShareData = _d.sent();
                            console.log('ad share data', adShareData);
                            _d.label = 2;
                        case 2:
                            adUnitId = data.adUnitId || ((_c = (_b = adShareData === null || adShareData === void 0 ? void 0 : adShareData.data) === null || _b === void 0 ? void 0 : _b.ad_content) === null || _c === void 0 ? void 0 : _c.identify);
                            console.log('adUnitId:', adUnitId);
                            _d.label = 3;
                        case 3:
                            _d.trys.push([3, 9, , 10]);
                            if (!this._interstitialAd) return [3 /*break*/, 4];
                            ad_2 = this._interstitialAd;
                            return [3 /*break*/, 6];
                        case 4:
                            ad_2 = wx.createInterstitialAd({
                                adUnitId: adUnitId,
                            });
                            return [4 /*yield*/, new Promise(function (resolve, reject) {
                                    ad_2.onLoad(function () {
                                        _this._interstitialAd = ad_2;
                                        _this._hasAd.interstitial = true;
                                        resolve(undefined);
                                    });
                                    ad_2.onError(function (error) {
                                        _this._hasAd.interstitial = false;
                                        reject(error);
                                    });
                                })];
                        case 5:
                            _d.sent();
                            _d.label = 6;
                        case 6:
                            if (!!data.isCheck) return [3 /*break*/, 8];
                            return [4 /*yield*/, ad_2.show()];
                        case 7:
                            _d.sent();
                            _d.label = 8;
                        case 8:
                            complete(__assign(__assign({ code: 0 }, data), { ad: ad_2 }));
                            return [3 /*break*/, 10];
                        case 9:
                            error_6 = _d.sent();
                            error_6.message = AD_ERROR_MAP[error_6.errCode] || error_6.message || error_6.errMsg;
                            err = new Error(error_6.message);
                            // data: 保留原始错误
                            err.data = {
                                data: error_6
                            };
                            complete(handleTrackError('rxlog_error_ad', error_6));
                            this.track({
                                complete: function (data) {
                                    console.info('interstitialAd error add complete func when tracked:', data);
                                },
                            }, formatTrackParams({
                                eventName: 'track_err',
                                apiName: 'interstitialAd',
                                reqParams: data,
                                errorInfo: error_6,
                                loginInfo: USER_INFO,
                            }));
                            return [3 /*break*/, 10];
                        case 10: return [2 /*return*/];
                    }
                });
            });
        };
        //banner 广告
        SdkWegame.prototype.bannerAd = function (data, _a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var ad_3, error_7, err;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 6, , 7]);
                            if (!this._bannerAd) return [3 /*break*/, 1];
                            ad_3 = this._bannerAd;
                            return [3 /*break*/, 3];
                        case 1:
                            ad_3 = wx.createBannerAd({
                                adIntervals: data.adIntervals,
                                adUnitId: data.adUnitId,
                                style: data.style,
                            });
                            return [4 /*yield*/, new Promise(function (resolve, reject) {
                                    ad_3.onLoad(function () {
                                        _this._bannerAd = ad_3;
                                        _this._hasAd.banner = true;
                                        resolve(undefined);
                                    });
                                    ad_3.onError(function (error) {
                                        _this._hasAd.banner = false;
                                        reject(error);
                                    });
                                })];
                        case 2:
                            _b.sent();
                            _b.label = 3;
                        case 3:
                            if (!!data.isCheck) return [3 /*break*/, 5];
                            return [4 /*yield*/, ad_3.show()];
                        case 4:
                            _b.sent();
                            _b.label = 5;
                        case 5:
                            complete(__assign(__assign({ code: 0 }, data), { ad: ad_3 }));
                            return [3 /*break*/, 7];
                        case 6:
                            error_7 = _b.sent();
                            error_7.message = AD_ERROR_MAP[error_7.errCode] || error_7.message || error_7.errMsg;
                            err = new Error(error_7.message);
                            // data: 保留原始错误
                            err.data = {
                                data: error_7
                            };
                            complete(handleTrackError('rxlog_error_ad', error_7));
                            this.track({
                                complete: function (data) {
                                    console.info('bannerAd error add complete func when tracked:', data);
                                },
                            }, formatTrackParams({
                                eventName: 'track_err',
                                apiName: 'bannerAd',
                                reqParams: data,
                                errorInfo: error_7,
                                loginInfo: USER_INFO,
                            }));
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        // 分享调度初始化
        SdkWegame.prototype.shareSchedulingInit = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var req, res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, pubCheck(shareScheduleInitParams, callback, params)];
                        case 1:
                            _a.sent();
                            this.funcs = (params === null || params === void 0 ? void 0 : params.funcs) || [];
                            req = {
                                func: this.funcs,
                                type: 'mini',
                                open_id: USER_INFO.openid || ''
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
        SdkWegame.prototype.getShareScheduling = function (params) {
            var funcs = params === null || params === void 0 ? void 0 : params.funcs;
            if (!funcs)
                return { code: 0, data: this.scheduleInitMap };
            if (funcs && !isArray(funcs)) {
                var error = new Error('funcs must be Array');
                error.code = COMMON_ERROR_CODE.PARAMS_ERROR;
                return handleTrackError('', error);
            }
            try {
                console.log('sdk getShareScheduling: ', params, this.scheduleInitMap);
                var data = pick(this.scheduleInitMap, funcs);
                return { code: 0, data: data };
            }
            catch (error) {
                return handleTrackError('', error);
            }
        };
        // 看广告完成上报
        SdkWegame.prototype.shareSchedulingReport = function (params, callback) {
            var _a, _b, _c;
            return __awaiter(this, void 0, void 0, function () {
                var func, region, sub_channel_id, open_id, scheduling_event, Iparams, result_2, remaining_share_count, error_9;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 8, , 9]);
                            return [4 /*yield*/, pubCheck(shareScheduleReportParams, callback, params)];
                        case 1:
                            _d.sent();
                            func = params.func;
                            region = (params === null || params === void 0 ? void 0 : params.region) || USER_INFO.region || '';
                            sub_channel_id = this.subChannelId || '';
                            open_id = USER_INFO.openid || '';
                            scheduling_event = (params === null || params === void 0 ? void 0 : params.scheduling_event) === true ? 'done' : 'fail';
                            Iparams = this.withDirectAdBigdataExt(__assign(__assign({ platform: PLATFORM.WECHAT, type: 'mini', sub_channel_id: sub_channel_id, open_id: open_id }, params), { region: region, scheduling_event: scheduling_event, properties: __assign({ region: region }, params === null || params === void 0 ? void 0 : params.properties) }));
                            //ad不上报上一次的分享数据
                            if (params.scheduling_type == 'share') {
                                Iparams.properties = __assign(__assign({}, this.scheuleReportProps), Iparams.properties);
                            }
                            return [4 /*yield*/, schedulingReportApi(Iparams)];
                        case 2:
                            result_2 = _d.sent();
                            if (!isEmpty(result_2 === null || result_2 === void 0 ? void 0 : result_2.data)) return [3 /*break*/, 4];
                            this.scheduleInitMap = omit(this.scheduleInitMap, func);
                            removeStorageSync("rx_schedule_".concat(USER_INFO.tid, "_").concat(func, "_").concat(region));
                            return [4 /*yield*/, this.shareSchedulingInit({}, {
                                    complete: function () {
                                        console.log('shareSchedulingInit');
                                        callback.complete(result_2);
                                    }
                                })];
                        case 3:
                            _d.sent();
                            return [2 /*return*/];
                        case 4:
                            remaining_share_count = ((_b = (_a = result_2 === null || result_2 === void 0 ? void 0 : result_2.data) === null || _a === void 0 ? void 0 : _a.scheduling) === null || _b === void 0 ? void 0 : _b.remaining_share_count) || 0;
                            if (!(remaining_share_count <= 0)) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.shareSchedulingInit({}, {
                                    complete: function () {
                                        console.log('shareSchedulingInit');
                                        callback.complete(result_2);
                                    }
                                })];
                        case 5:
                            _d.sent();
                            return [2 /*return*/];
                        case 6:
                            this.scheduleInitMap[func] = (_c = result_2 === null || result_2 === void 0 ? void 0 : result_2.data) === null || _c === void 0 ? void 0 : _c.scheduling;
                            customSetStorageSync("rx_schedule_".concat(USER_INFO.tid, "_").concat(func, "_").concat(region), JSON.stringify(result_2));
                            _d.label = 7;
                        case 7:
                            callback.complete(result_2);
                            return [3 /*break*/, 9];
                        case 8:
                            error_9 = _d.sent();
                            callback.complete(handleTrackError('', error_9));
                            return [3 /*break*/, 9];
                        case 9: return [2 /*return*/];
                    }
                });
            });
        };
        SdkWegame.prototype.refreshSessionFunc = function () {
            return __awaiter(this, void 0, void 0, function () {
                var code;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, asyncFunc(wx.login)];
                        case 1:
                            code = (_a.sent()).code;
                            return [4 /*yield*/, refreshUserInfo({
                                    version: 'base',
                                    code: code,
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, 1];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, -1];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        //同步用户信息
        SdkWegame.prototype.infoSync = function (CPcallback, info) {
            return __awaiter(this, void 0, void 0, function () {
                var code, _a, encryptedData, iv, result, error_10;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 4, , 5]);
                            return [4 /*yield*/, asyncFunc(wx.login)];
                        case 1:
                            code = (_b.sent()).code;
                            return [4 /*yield*/, asyncFunc(wx.getUserProfile, {
                                    lang: 'zh_CN',
                                    desc: (info === null || info === void 0 ? void 0 : info.desc) || '用于获取昵称和头像',
                                })];
                        case 2:
                            _a = _b.sent(), encryptedData = _a.encryptedData, iv = _a.iv;
                            return [4 /*yield*/, refreshUserInfo({
                                    code: code,
                                    encryptedData: encryptedData,
                                    iv: iv,
                                    version: (info === null || info === void 0 ? void 0 : info.version) || 'normal'
                                })];
                        case 3:
                            result = _b.sent();
                            CPcallback.complete(result);
                            return [3 /*break*/, 5];
                        case 4:
                            error_10 = _b.sent();
                            CPcallback.complete(handleTrackError('', error_10));
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        SdkWegame.prototype.userInfoSilentSync = function (CPcallback, info) {
            return __awaiter(this, void 0, void 0, function () {
                var authSetting, methodParams, error_11;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 6, , 7]);
                            return [4 /*yield*/, asyncFunc(wx.getSetting)
                                // console.info('======scope.userInfo======', authSetting['scope.userInfo'])
                            ];
                        case 1:
                            authSetting = (_a.sent()).authSetting;
                            methodParams = (CPcallback === null || CPcallback === void 0 ? void 0 : CPcallback.complete) ? { complete: CPcallback.complete } : {};
                            if (!(authSetting['scope.userInfo'] === true)) return [3 /*break*/, 3];
                            // 允许授权过
                            return [4 /*yield*/, this._userInfoSilentSync(methodParams, info)];
                        case 2:
                            // 允许授权过
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 3: 
                        // 从未进入过小游戏（authSetting['scope.userInfo'] === undefined） 和 拒绝授权过（authSetting['scope.userInfo'] === false）
                        // 小游戏内使用 wx.authorize({scope: "scope.userInfo"})，不会弹出授权窗口(本地开发者工具会弹出来，真机调试不行)
                        return [4 /*yield*/, this.infoSync(methodParams, info)];
                        case 4:
                            // 从未进入过小游戏（authSetting['scope.userInfo'] === undefined） 和 拒绝授权过（authSetting['scope.userInfo'] === false）
                            // 小游戏内使用 wx.authorize({scope: "scope.userInfo"})，不会弹出授权窗口(本地开发者工具会弹出来，真机调试不行)
                            _a.sent();
                            _a.label = 5;
                        case 5: return [3 /*break*/, 7];
                        case 6:
                            error_11 = _a.sent();
                            (CPcallback === null || CPcallback === void 0 ? void 0 : CPcallback.complete) && CPcallback.complete(handleTrackError('', error_11));
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        SdkWegame.prototype._userInfoSilentSync = function (callback, info) {
            return __awaiter(this, void 0, void 0, function () {
                var code, _a, encryptedData, iv, result, error_12;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 4, , 5]);
                            return [4 /*yield*/, asyncFunc(wx.login)];
                        case 1:
                            code = (_b.sent()).code;
                            return [4 /*yield*/, asyncFunc(wx.getUserInfo, {
                                    lang: 'zh_CN',
                                })];
                        case 2:
                            _a = _b.sent(), encryptedData = _a.encryptedData, iv = _a.iv;
                            return [4 /*yield*/, refreshUserInfo({
                                    code: code,
                                    encryptedData: encryptedData,
                                    iv: iv,
                                    version: (info === null || info === void 0 ? void 0 : info.version) || 'normal'
                                })];
                        case 3:
                            result = _b.sent();
                            (callback === null || callback === void 0 ? void 0 : callback.complete) && callback.complete(result);
                            return [3 /*break*/, 5];
                        case 4:
                            error_12 = _b.sent();
                            (callback === null || callback === void 0 ? void 0 : callback.complete) && callback.complete(handleTrackError('', error_12));
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        //获得wx的地理位置
        SdkWegame.prototype.handleLoacation = function () {
            return __awaiter(this, void 0, void 0, function () {
                var error, result, err_26, error;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(wx.getFuzzyLocation)) {
                                error = new Error('wx.getFuzzyLocation not exist');
                                error.code = COMMON_ERROR_CODE.API_NOT_EXIST;
                                throw error;
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, asyncFunc(wx.getFuzzyLocation, { type: 'wgs84' })];
                        case 2:
                            result = _a.sent();
                            this.locationInfomation = { longitude: result.longitude, latitude: result.latitude };
                            return [2 /*return*/, result];
                        case 3:
                            err_26 = _a.sent();
                            error = new Error((err_26 === null || err_26 === void 0 ? void 0 : err_26.errMsg) || 'wx.getLocation fail');
                            if (err_26 === null || err_26 === void 0 ? void 0 : err_26.errMsg.includes('deny')) {
                                error.code = COMMON_ERROR_CODE.LOCATION_AUTH_DENY;
                            }
                            else {
                                error.code = COMMON_ERROR_CODE.LOCATION_FAIL;
                            }
                            throw error;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        //获得地理位置授权 (获得地理位置公共方法)
        SdkWegame.prototype.authorizeLocation = function (callback) {
            return __awaiter(this, void 0, void 0, function () {
                var authSetting, location_1, location_2, res, openSetting, location_3, error, error_13;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 13, , 14]);
                            return [4 /*yield*/, asyncFunc(wx.getSetting)];
                        case 1:
                            authSetting = (_a.sent()).authSetting;
                            if (!(authSetting['scope.userFuzzyLocation'] === true)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.handleLoacation()];
                        case 2:
                            location_1 = _a.sent();
                            (callback === null || callback === void 0 ? void 0 : callback.complete) && callback.complete({ code: 0, data: location_1 });
                            return [2 /*return*/, location_1];
                        case 3:
                            if (!(authSetting['scope.userFuzzyLocation'] === undefined)) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.handleLoacation()];
                        case 4:
                            location_2 = _a.sent();
                            (callback === null || callback === void 0 ? void 0 : callback.complete) && callback.complete({ code: 0, data: location_2 });
                            return [2 /*return*/, location_2];
                        case 5:
                            if (!(authSetting['scope.userFuzzyLocation'] != undefined &&
                                authSetting['scope.userFuzzyLocation'] != true)) return [3 /*break*/, 12];
                            return [4 /*yield*/, asyncFunc(wx.showModal, {
                                    title: '是否授权当前位置',
                                    content: '需要获取您的地理位置，请确认授权，否则无法相关功能！',
                                })];
                        case 6:
                            res = _a.sent();
                            if (!res.cancel) return [3 /*break*/, 7];
                            wx.showToast({
                                title: '您已拒绝授权!',
                                icon: 'none',
                            });
                            return [3 /*break*/, 11];
                        case 7:
                            if (!res.confirm) return [3 /*break*/, 11];
                            return [4 /*yield*/, asyncFunc(wx.openSetting)];
                        case 8:
                            openSetting = _a.sent();
                            if (!(openSetting.authSetting['scope.userFuzzyLocation'] === true)) return [3 /*break*/, 10];
                            wx.showToast({
                                title: '授权成功!',
                                icon: 'none',
                            });
                            return [4 /*yield*/, this.handleLoacation()];
                        case 9:
                            location_3 = _a.sent();
                            (callback === null || callback === void 0 ? void 0 : callback.complete) && callback.complete({ code: 0, data: location_3 });
                            return [2 /*return*/, location_3];
                        case 10:
                            wx.showToast({
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
                            error_13 = _a.sent();
                            // 传了回调函数就不往后透传错误
                            if (callback === null || callback === void 0 ? void 0 : callback.complete) {
                                callback.complete(handleTrackError('', error_13));
                            }
                            else {
                                throw error_13;
                            }
                            return [3 /*break*/, 14];
                        case 14: return [2 /*return*/];
                    }
                });
            });
        };
        //上报的http接口
        SdkWegame.prototype.reportLocationHttpFun = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, report, error_14;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.authorizeLocation()];
                        case 1:
                            result = _a.sent();
                            return [4 /*yield*/, reportLocationUpdata({
                                    lon: result.longitude,
                                    lat: result.latitude,
                                    types: params.types,
                                })];
                        case 2:
                            report = _a.sent();
                            return [2 /*return*/, report];
                        case 3:
                            error_14 = _a.sent();
                            if (callback === null || callback === void 0 ? void 0 : callback.complete) {
                                callback.complete(handleTrackError('', error_14));
                            }
                            else {
                                throw error_14;
                            }
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        //开始上报经纬度坐标
        SdkWegame.prototype.startReportLoaction = function (params, _a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var resReport, error_15;
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
                            error_15 = _b.sent();
                            complete(handleTrackError('', error_15));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        //停止上报经纬度
        SdkWegame.prototype.stopReportLocation = function () {
            clearInterval(this.reportLocationTimer);
            this.reportLocationTimer = null;
        };
        //删除经纬度坐标
        SdkWegame.prototype.deleteReportLocation = function (params, _a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var result, error_16;
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
                            error_16 = _b.sent();
                            complete(handleTrackError('', error_16));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        //获得半径内用户
        SdkWegame.prototype.getNearlyPeasonByRadius = function (params, _a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var location_4, result, error_17;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 5, , 6]);
                            location_4 = this.locationInfomation;
                            if (!(location_4 == null)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.authorizeLocation()];
                        case 1:
                            location_4 = _b.sent();
                            _b.label = 2;
                        case 2: return [4 /*yield*/, pubCheck(getNearlyRediusCheckParams, { complete: complete }, params)];
                        case 3:
                            _b.sent();
                            return [4 /*yield*/, getNearlyPeasonByRadius(__assign({ lon: location_4.longitude, lat: location_4.latitude }, params))];
                        case 4:
                            result = _b.sent();
                            complete(result);
                            return [3 /*break*/, 6];
                        case 5:
                            error_17 = _b.sent();
                            complete(handleTrackError('', error_17));
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        //大数据上报
        //数据上报
        SdkWegame.prototype.track = function (callback, params) {
            var _a, _b, _c;
            return __awaiter(this, void 0, void 0, function () {
                var getDevicecode_1, devicecode, type, time, uuids, platform_id, copyCpid, product_id, cpid, publicPropskey, publicPropsByCache, publicProps, new_properties, version, reqarr, result, err_27;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, pubCheck(checkTrackParams, callback, params)];
                        case 1:
                            _d.sent();
                            getDevicecode_1 = function () {
                                var devicecode = customGetStorageSync('rx_devicecode');
                                if (devicecode) {
                                    return devicecode.code;
                                }
                                else {
                                    var code = v4_1();
                                    customSetStorageSync('rx_devicecode', { code: code, openIds: {} });
                                    return code;
                                }
                            };
                            devicecode = getDevicecode_1();
                            type = 'track';
                            time = formatDate('YYYY-MM-DDTHH:mm:ss.SSSZ');
                            uuids = v4_1();
                            platform_id = 4;
                            copyCpid = SYSTEM_INFO$1.cpid, product_id = SYSTEM_INFO$1.productId;
                            cpid = Number(copyCpid);
                            publicPropskey = ((_c = (_b = (_a = this.initConfig) === null || _a === void 0 ? void 0 : _a.event_public_attr) === null || _b === void 0 ? void 0 : _b.public_attr) === null || _c === void 0 ? void 0 : _c[params.event]) || [];
                            publicPropsByCache = customGetStorageSync('rx_public_props');
                            publicProps = pick(publicPropsByCache, publicPropskey);
                            new_properties = {};
                            if (SYSTEM_INFO$1.region_tag) {
                                new_properties.rx_region_tag = "".concat(SYSTEM_INFO$1.region_tag);
                            }
                            if (SYSTEM_INFO$1.cp_role_id) {
                                new_properties['#role_id'] = "".concat(SYSTEM_INFO$1.cp_role_id);
                            }
                            try {
                                version = SYSTEM_INFO$1.miniVersion;
                                if (version) {
                                    new_properties['rx_app_info'] = {
                                        version: version
                                    };
                                }
                            }
                            catch (e) {
                            }
                            new_properties.st_offset = "".concat(SYSTEM_INFO$1.st_offset || '');
                            reqarr = [
                                __assign({ type: type, time: time, uuid: uuids, sub_channel_id: this.subChannelId || '', distinct_id: USER_INFO.openid, platform_id: platform_id, product_id: product_id, cpid: cpid, channel_id: SYSTEM_INFO$1.channelId, devicecode: devicecode }, __assign(__assign({}, params), { properties: __assign(__assign(__assign(__assign({}, new_properties), publicProps), params.properties), this.getDirectAdStatusParams()) })),
                            ];
                            !this.subChannelId || (reqarr[0].sub_channel_id = this.subChannelId);
                            return [4 /*yield*/, trackApi(reqarr)];
                        case 2:
                            result = _d.sent();
                            callback.complete(__assign(__assign({}, result), { data: null, msg: 'track success' }));
                            return [3 /*break*/, 4];
                        case 3:
                            err_27 = _d.sent();
                            callback.complete(handleError(err_27));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        //大数据上报 数据上报 V2
        SdkWegame.prototype.dataTrack = function (callback, params) {
            var _a, _b, _c;
            return __awaiter(this, void 0, void 0, function () {
                var flushIntervalNum, intervalMs, maxCacheCountNum, getDevicecode_2, devicecode, type, time, uuids, platform_id, copyCpid, product_id, cpid, publicPropskey, publicPropsByCache, publicProps, new_properties, version, reqarr, err_28;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, pubCheck(checkTrackParams, callback, params)
                                // 如果传递了flushInterval参数，动态更新上报间隔
                                // flushInterval单位是秒，需要转换成毫秒，只能是正整数
                            ];
                        case 1:
                            _d.sent();
                            // 如果传递了flushInterval参数，动态更新上报间隔
                            // flushInterval单位是秒，需要转换成毫秒，只能是正整数
                            if ((params === null || params === void 0 ? void 0 : params.flushInterval) !== undefined) {
                                flushIntervalNum = Number(params.flushInterval);
                                // 检查是否可以转换为有效数字且为正数
                                if (!isNaN(flushIntervalNum) && isFinite(flushIntervalNum) && flushIntervalNum > 0) {
                                    intervalMs = Math.round(flushIntervalNum) * 1000;
                                    updateTrackReportInterval(intervalMs);
                                }
                                // 如果无法转换或值不符合条件，不更新间隔，使用默认值
                            }
                            // 如果传递了maxCacheCount参数，更新缓存数据上限
                            // maxCacheCount只能是正整数，范围100-1000
                            if ((params === null || params === void 0 ? void 0 : params.maxCacheCount) !== undefined) {
                                maxCacheCountNum = Number(params.maxCacheCount);
                                // 检查是否可以转换为有效数字且为正数
                                if (!isNaN(maxCacheCountNum) && isFinite(maxCacheCountNum) && maxCacheCountNum > 0) {
                                    // 四舍五入转换为正整数
                                    updateMaxCacheCount(Math.round(maxCacheCountNum));
                                }
                                // 如果无法转换或值不符合条件，不更新，使用默认值
                            }
                            getDevicecode_2 = function () {
                                var devicecode = customGetStorageSync('rx_devicecode');
                                if (devicecode) {
                                    return devicecode.code;
                                }
                                else {
                                    var code = v4_1();
                                    customSetStorageSync('rx_devicecode', { code: code, openIds: {} });
                                    return code;
                                }
                            };
                            devicecode = getDevicecode_2();
                            type = ((params === null || params === void 0 ? void 0 : params.type) && this.dataTrackType.includes(params === null || params === void 0 ? void 0 : params.type)) ? params === null || params === void 0 ? void 0 : params.type : 'track';
                            time = formatDate('YYYY-MM-DDTHH:mm:ss.SSSZ');
                            uuids = v4_1();
                            platform_id = 4;
                            copyCpid = SYSTEM_INFO$1.cpid, product_id = SYSTEM_INFO$1.productId;
                            cpid = Number(copyCpid);
                            publicPropskey = ((_c = (_b = (_a = this.initConfig) === null || _a === void 0 ? void 0 : _a.event_public_attr) === null || _b === void 0 ? void 0 : _b.public_attr) === null || _c === void 0 ? void 0 : _c[params.event]) || [];
                            publicPropsByCache = customGetStorageSync('rx_public_props');
                            publicProps = pick(publicPropsByCache, publicPropskey);
                            new_properties = {};
                            if (SYSTEM_INFO$1.region_tag) {
                                new_properties.rx_region_tag = "".concat(SYSTEM_INFO$1.region_tag);
                            }
                            if (SYSTEM_INFO$1.cp_role_id) {
                                new_properties['#role_id'] = "".concat(SYSTEM_INFO$1.cp_role_id);
                            }
                            try {
                                version = SYSTEM_INFO$1.miniVersion;
                                if (version) {
                                    new_properties['rx_app_info'] = {
                                        version: version
                                    };
                                }
                            }
                            catch (e) {
                            }
                            new_properties.st_offset = "".concat(SYSTEM_INFO$1.st_offset || '');
                            reqarr = [
                                __assign({ type: type, time: time, uuid: uuids, sub_channel_id: this.subChannelId || '', distinct_id: USER_INFO.openid, platform_id: platform_id, product_id: product_id, cpid: cpid, channel_id: SYSTEM_INFO$1.channelId, devicecode: devicecode }, __assign(__assign({}, params), { properties: __assign(__assign(__assign(__assign({}, new_properties), publicProps), params.properties), this.getDirectAdStatusParams()) })),
                            ];
                            !this.subChannelId || (reqarr[0].sub_channel_id = this.subChannelId);
                            // let result = await trackApi(reqarr)
                            // 收集reqarr数据，用于后续上报
                            saveTrackDataToStorage(reqarr[0]);
                            // 检查缓存数据是否达到上限，如果达到则立即上报
                            if (shouldTriggerImmediateReport()) {
                                triggerImmediateReport();
                            }
                            callback.complete({ code: 0, data: null, msg: 'trackDelay success' });
                            return [3 /*break*/, 3];
                        case 2:
                            err_28 = _d.sent();
                            callback.complete(handleError(err_28));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        //内容安全
        SdkWegame.prototype.msgSecCheck = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, err_29;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, pubCheck(msgSecCheck, callback, params)];
                        case 1:
                            _a.sent();
                            params = Object.assign(params, { openid: USER_INFO.tid, version: 2 });
                            return [4 /*yield*/, msgSecCheckApi(params)];
                        case 2:
                            result = _a.sent();
                            callback.complete(result);
                            return [3 /*break*/, 4];
                        case 3:
                            err_29 = _a.sent();
                            callback.complete(handleTrackError('', err_29));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // 内容安全 - 异步校验图片/音频是否含有违法违规内容。
        SdkWegame.prototype.mediaCheckAsync = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, err_30;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, pubCheck(mediaCheckAsyncCheck, callback, params)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, mediaCheckAsyncApi(params)];
                        case 2:
                            result = _a.sent();
                            callback.complete(result);
                            return [3 /*break*/, 4];
                        case 3:
                            err_30 = _a.sent();
                            callback.complete(handleTrackError('', err_30));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * 设置公共属性
         * 设置后CP无需每次上报都传，由SDK填入properties中。
         */
        SdkWegame.prototype.setPublicProperties = function (params) {
            if (!isObject(params) || Array.isArray(params)) {
                var error = new Error('params must be object');
                error.code = COMMON_ERROR_CODE.PARAMS_ERROR;
                return handleTrackError('', error);
            }
            try {
                customSetStorageSync('rx_public_props', params);
                return { code: 0 };
            }
            catch (error) {
                return handleTrackError('', error);
            }
        };
        /**
         * 修改设置的公共数据。
         */
        SdkWegame.prototype.updatePublicProperties = function (params) {
            if (!isObject(params) || Array.isArray(params)) {
                var error = new Error('params must be object');
                error.code = COMMON_ERROR_CODE.PARAMS_ERROR;
                return handleTrackError('', error);
            }
            try {
                var cache = customGetStorageSync('rx_public_props');
                customSetStorageSync('rx_public_props', __assign(__assign({}, cache), params));
                return { code: 0 };
            }
            catch (error) {
                return handleTrackError('', error);
            }
        };
        /**
         * 删除公共属性
         */
        SdkWegame.prototype.deletePublicProperties = function (params) {
            if (!Array.isArray(params)) {
                var error = new Error('params must be array');
                error.code = COMMON_ERROR_CODE.PARAMS_ERROR;
                return handleTrackError('', error);
            }
            try {
                var cache = customGetStorageSync('rx_public_props');
                var rest = omit(cache, params);
                customSetStorageSync('rx_public_props', rest);
                return { code: 0 };
            }
            catch (error) {
                return handleTrackError('', error);
            }
        };
        SdkWegame.prototype.getPublicProperties = function () {
            var data = customGetStorageSync("rx_public_props");
            return { code: 0, data: data };
        };
        //公共的解密接口
        SdkWegame.prototype.decryptionDate = function (params, _a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var sessionOverdue, res, err_31;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            sessionOverdue = function (err) { return __awaiter(_this, void 0, void 0, function () {
                                var result;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!((err === null || err === void 0 ? void 0 : err.code) == 192802 && this.refreshSession < 2)) return [3 /*break*/, 2];
                                            this.refreshSession++;
                                            return [4 /*yield*/, this.refreshSessionFunc()];
                                        case 1:
                                            result = _a.sent();
                                            if (result == 1) {
                                                this.decryptionDate(params, { complete: complete });
                                            }
                                            else {
                                                complete(handleTrackError('', err));
                                            }
                                            return [3 /*break*/, 3];
                                        case 2:
                                            complete(handleTrackError('', err));
                                            _a.label = 3;
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); };
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, opendataAesdecodeApi({ iv: params.iv, encrypted_data: params.encrypted_data })];
                        case 2:
                            res = _b.sent();
                            this.refreshSession = 0;
                            complete(res);
                            return [3 /*break*/, 4];
                        case 3:
                            err_31 = _b.sent();
                            sessionOverdue(err_31);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        //获得设备码接口
        SdkWegame.prototype.getUserDeviceCode = function () {
            try {
                var devicecode = customGetStorageSync('rx_devicecode');
                if (devicecode) {
                    return { code: 0, data: devicecode.code };
                }
                else {
                    var devicecode_1 = v4_1();
                    customSetStorageSync('rx_devicecode', { code: devicecode_1, openIds: {} });
                    return { code: 0, data: devicecode_1 };
                }
            }
            catch (err) {
                return v4_1();
            }
        };
        SdkWegame.prototype.getHeaders = function () {
            var _a;
            var _b;
            return _a = {},
                _a['ruixue-language'] = 'zh-CN',
                _a['ruixue-cpid'] = SYSTEM_INFO$1.cpid,
                _a['ruixue-productid'] = SYSTEM_INFO$1.productId,
                _a['ruixue-channelid'] = SYSTEM_INFO$1.channelId,
                _a['ruixue-platformid'] = '4',
                _a['ruixue-devicecode'] = getDevicecode(),
                _a['ruixue-version'] = SYSTEM_INFO$1.__RX_SDK_VERSION,
                _a['ruixue-traceid'] = v4_1(),
                _a['ruixue-tzoffset'] = SYSTEM_INFO$1.timezone + '',
                _a['ruixue-accesstoken'] = (_b = USER_INFO.token) === null || _b === void 0 ? void 0 : _b.access,
                _a;
        };
        SdkWegame.prototype.initTencentSdk = function () {
            var _this = this;
            return new Promise(function (resolve) {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
                // 0服务端上报 1客户端上报
                if (((_c = (_b = (_a = _this.initConfig) === null || _a === void 0 ? void 0 : _a.advertise_channel) === null || _b === void 0 ? void 0 : _b.gdt) === null || _c === void 0 ? void 0 : _c.tm) == TM_TYPE.CLIENT || _this.create_conn) {
                    // @ts-ignore
                    if (!tencent_sdk && wx.TencentSDK && ((_f = (_e = (_d = _this.initConfig) === null || _d === void 0 ? void 0 : _d.advertise_channel) === null || _e === void 0 ? void 0 : _e.gdt) === null || _f === void 0 ? void 0 : _f.sid)) {
                        var params = {
                            user_action_set_id: Number((_h = (_g = _this.initConfig) === null || _g === void 0 ? void 0 : _g.advertise_channel) === null || _h === void 0 ? void 0 : _h.gdt.sid),
                            secret_key: (_k = (_j = _this.initConfig) === null || _j === void 0 ? void 0 : _j.advertise_channel) === null || _k === void 0 ? void 0 : _k.gdt.sk,
                            appid: (_m = (_l = _this.initConfig) === null || _l === void 0 ? void 0 : _l.advertise_channel) === null || _m === void 0 ? void 0 : _m.gdt.wxid,
                            auto_track: true,
                            on_report_fail: onReportFail
                        };
                        if (USER_INFO.tid) {
                            params.openid = USER_INFO.tid;
                        }
                        // @ts-ignore
                        tencent_sdk = new wx.TencentSDK(params);
                        var initResult = tencent_sdk === null || tencent_sdk === void 0 ? void 0 : tencent_sdk.getInitResult();
                        if (initResult && !initResult.inited) {
                            handleTrackError('rxlog_error_ad', __assign(__assign({}, initResult), { message: initResult.initErrMsg, exception: initResult }), undefined, 'rxlog_error_gdt');
                        }
                        setTimeout(function () {
                            resolve(true);
                        }, 100);
                    }
                    else {
                        resolve(true);
                    }
                }
                else {
                    resolve(true);
                }
            });
        };
        SdkWegame.prototype.reportAddToFavorites = function (type) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.initTencentSdk()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.reportOrQueueDirectAdGdtEvent(function () {
                                    handleGdtTrackResult(tencent_sdk === null || tencent_sdk === void 0 ? void 0 : tencent_sdk.track('ADD_TO_WISHLIST', {
                                        type: type,
                                    }));
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        SdkWegame.prototype.reportShareAppMessage = function (target) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.initTencentSdk()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.reportOrQueueDirectAdGdtEvent(function () {
                                    handleGdtTrackResult(tencent_sdk === null || tencent_sdk === void 0 ? void 0 : tencent_sdk.track('SHARE', {
                                        target: target,
                                    }));
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        SdkWegame.prototype.reportPurchase = function (amount, needReportMidas) {
            if (needReportMidas === void 0) { needReportMidas = false; }
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!needReportMidas) return [3 /*break*/, 2];
                            return [4 /*yield*/, this._reportPurchase(amount)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                        case 2: return [2 /*return*/];
                    }
                });
            });
        };
        SdkWegame.prototype._reportPurchase = function (amount) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.initTencentSdk()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.reportOrQueueDirectAdGdtEvent(function () {
                                    handleGdtTrackResult(tencent_sdk === null || tencent_sdk === void 0 ? void 0 : tencent_sdk.onPurchase(amount));
                                })];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        SdkWegame.prototype.compareVersions = function (version1, version2) {
            // 将版本号字符串按 . 分割成数组
            var v1Parts = version1.replace('v', '').split('.').map(Number);
            var v2Parts = version2.replace('v', '').split('.').map(Number);
            // 获取两个版本号数组的最大长度
            var maxLength = Math.max(v1Parts.length, v2Parts.length);
            // 逐位比较版本号
            for (var i = 0; i < maxLength; i++) {
                // 如果某个版本号数组已经遍历完，对应位置的值视为 0
                var num1 = i < v1Parts.length ? v1Parts[i] : 0;
                var num2 = i < v2Parts.length ? v2Parts[i] : 0;
                if (num1 > num2) {
                    return 1; // version1 大于 version2
                }
                else if (num1 < num2) {
                    return -1; // version1 小于 version2
                }
                // 如果当前位相等，继续比较下一位
            }
            return 0; // 两个版本号相等
        };
        SdkWegame.prototype.getOrderStatus = function (order_nos) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, getOrderStatusApi(order_nos)];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SdkWegame.prototype.reportPurchaseByCache = function () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return __awaiter(this, void 0, void 0, function () {
                var rx_cache_order, uniqueOrders, MAX_PROCESS_COUNT, ordersToProcess, remainingOrders, _i, ordersToProcess_1, order, res, e_12;
                return __generator(this, function (_j) {
                    switch (_j.label) {
                        case 0:
                            _j.trys.push([0, 8, 9, 10]);
                            if (!this.isSupportGDTReport)
                                return [2 /*return*/];
                            return [4 /*yield*/, this.initTencentSdk()];
                        case 1:
                            _j.sent();
                            rx_cache_order = customGetStorageSync("rx_cache_order_price") || [];
                            // 验证数据格式并限制处理数量，防止死循环
                            if (!rx_cache_order || !Array.isArray(rx_cache_order) || rx_cache_order.length === 0) {
                                // removeStorageSync('rx_cache_order_price')
                                return [2 /*return*/];
                            }
                            uniqueOrders = (_a = rx_cache_order === null || rx_cache_order === void 0 ? void 0 : rx_cache_order.filter) === null || _a === void 0 ? void 0 : _a.call(rx_cache_order, function (order, index, self) {
                                return index === (self === null || self === void 0 ? void 0 : self.findIndex(function (t) { return (t === null || t === void 0 ? void 0 : t.order_nos) === (order === null || order === void 0 ? void 0 : order.order_nos); }));
                            });
                            MAX_PROCESS_COUNT = 5;
                            ordersToProcess = (_b = uniqueOrders === null || uniqueOrders === void 0 ? void 0 : uniqueOrders.slice) === null || _b === void 0 ? void 0 : _b.call(uniqueOrders, 0, MAX_PROCESS_COUNT);
                            remainingOrders = [];
                            _i = 0, ordersToProcess_1 = ordersToProcess;
                            _j.label = 2;
                        case 2:
                            if (!(_i < ordersToProcess_1.length)) return [3 /*break*/, 7];
                            order = ordersToProcess_1[_i];
                            // 验证订单数据格式，防止无效数据导致错误
                            if (!order || typeof order !== 'object' || !(order === null || order === void 0 ? void 0 : order.order_nos) || !(order === null || order === void 0 ? void 0 : order.price)) {
                                // 无效数据不保留，直接丢弃
                                return [3 /*break*/, 6];
                            }
                            _j.label = 3;
                        case 3:
                            _j.trys.push([3, 5, , 6]);
                            return [4 /*yield*/, getOrderStatusApi(order === null || order === void 0 ? void 0 : order.order_nos)
                                // 订单支付成功
                            ];
                        case 4:
                            res = _j.sent();
                            // 订单支付成功
                            if (res && (res === null || res === void 0 ? void 0 : res.code) === 0 && ((_c = res === null || res === void 0 ? void 0 : res.data) === null || _c === void 0 ? void 0 : _c.status) && ((_d = res === null || res === void 0 ? void 0 : res.data) === null || _d === void 0 ? void 0 : _d.status) > 1) {
                                try {
                                    this._reportPurchase(order === null || order === void 0 ? void 0 : order.price);
                                    // 支付成功，不添加到保留数组中（即从缓存中移除）
                                }
                                catch (reportError) {
                                    // 上报失败不影响其他订单处理，但保留当前订单
                                    (_e = remainingOrders === null || remainingOrders === void 0 ? void 0 : remainingOrders.push) === null || _e === void 0 ? void 0 : _e.call(remainingOrders, order);
                                }
                            }
                            else {
                                // 支付未成功，保留订单
                                if (res && (res === null || res === void 0 ? void 0 : res.code) !== 101) {
                                    (_f = remainingOrders === null || remainingOrders === void 0 ? void 0 : remainingOrders.push) === null || _f === void 0 ? void 0 : _f.call(remainingOrders, order);
                                }
                            }
                            return [3 /*break*/, 6];
                        case 5:
                            _j.sent();
                            // 查询失败，保留在数组中（单个订单失败不影响其他订单）
                            (_g = remainingOrders === null || remainingOrders === void 0 ? void 0 : remainingOrders.push) === null || _g === void 0 ? void 0 : _g.call(remainingOrders, order);
                            return [3 /*break*/, 6];
                        case 6:
                            _i++;
                            return [3 /*break*/, 2];
                        case 7:
                            // 保存剩余数据，添加容错处理
                            try {
                                if ((remainingOrders === null || remainingOrders === void 0 ? void 0 : remainingOrders.length) > 0) {
                                    // 有剩余订单数据，保留剩余数据
                                    console.info('有剩余订单数据，保留剩余数据', remainingOrders);
                                    customSetStorageSync('rx_cache_order_price', (_h = remainingOrders === null || remainingOrders === void 0 ? void 0 : remainingOrders.slice) === null || _h === void 0 ? void 0 : _h.call(remainingOrders, 0, MAX_PROCESS_COUNT));
                                }
                                else {
                                    // 如果没有剩余数据，清除缓存
                                    removeStorageSync('rx_cache_order_price');
                                }
                            }
                            catch (saveError) {
                                // 保存失败不影响其他功能，只记录日志
                                console.info('保存缓存订单失败', saveError);
                            }
                            return [3 /*break*/, 10];
                        case 8:
                            e_12 = _j.sent();
                            // 外层异常捕获，确保不影响其他功能
                            console.info('reportPurchaseByCache 执行异常', e_12);
                            return [3 /*break*/, 10];
                        case 9: return [7 /*endfinally*/];
                        case 10: return [2 /*return*/];
                    }
                });
            });
        };
        SdkWegame.prototype.reportRegister = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.reportOrQueueDirectAdGdtEvent(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.initTencentSdk()];
                                        case 1:
                                            _a.sent();
                                            console.log('on_register');
                                            handleGdtTrackResult(tencent_sdk === null || tencent_sdk === void 0 ? void 0 : tencent_sdk.onRegister());
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        SdkWegame.prototype.reportGdtLogin = function (openid) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.reportOrQueueDirectAdGdtEvent(function () {
                                console.log('set_open_id:', openid);
                                handleGdtTrackResult(tencent_sdk === null || tencent_sdk === void 0 ? void 0 : tencent_sdk.setOpenId(openid));
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        SdkWegame.prototype.reportGdt = function (key, object) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.initTencentSdk()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.reportOrQueueDirectAdGdtEvent(function () {
                                    if (object) {
                                        handleGdtTrackResult(tencent_sdk === null || tencent_sdk === void 0 ? void 0 : tencent_sdk.track(key, object));
                                    }
                                    else {
                                        handleGdtTrackResult(tencent_sdk === null || tencent_sdk === void 0 ? void 0 : tencent_sdk.track(key));
                                    }
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        SdkWegame.prototype.reportCreateRole = function (role_id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.initTencentSdk()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.reportOrQueueDirectAdGdtEvent(function () {
                                    console.log('on_create_role:', role_id);
                                    handleGdtTrackResult(tencent_sdk === null || tencent_sdk === void 0 ? void 0 : tencent_sdk.onCreateRole(role_id));
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        SdkWegame.prototype.reportTutorialFinish = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.initTencentSdk()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.reportOrQueueDirectAdGdtEvent(function () {
                                    console.log('on_tutorial_finish');
                                    handleGdtTrackResult(tencent_sdk === null || tencent_sdk === void 0 ? void 0 : tencent_sdk.onTutorialFinish());
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        SdkWegame.prototype.reportReActive = function (back_flow_day) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.reportOrQueueDirectAdGdtEvent(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.initTencentSdk()];
                                        case 1:
                                            _a.sent();
                                            console.log('on_re_active:', back_flow_day);
                                            handleGdtTrackResult(tencent_sdk === null || tencent_sdk === void 0 ? void 0 : tencent_sdk.track('RE_ACTIVE', { backFlowDay: back_flow_day }));
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        SdkWegame.prototype.reportUpdateLevel = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.initTencentSdk()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.reportOrQueueDirectAdGdtEvent(function () {
                                    console.log('on_update_level:', data);
                                    handleGdtTrackResult(tencent_sdk === null || tencent_sdk === void 0 ? void 0 : tencent_sdk.track('UPDATE_LEVEL', data));
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        SdkWegame.prototype.reportViewContent = function (item) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.initTencentSdk()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.reportOrQueueDirectAdGdtEvent(function () {
                                    console.log('on_view_content:', item);
                                    handleGdtTrackResult(tencent_sdk === null || tencent_sdk === void 0 ? void 0 : tencent_sdk.track('VIEW_CONTENT', {
                                        // 关键场景访问：商城
                                        item: item
                                    }));
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        SdkWegame.prototype.initWebSocket = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    getAdSourceApi().then(function (ad_source) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                        return __generator(this, function (_l) {
                            this.create_conn = ((_a = ad_source === null || ad_source === void 0 ? void 0 : ad_source.data) === null || _a === void 0 ? void 0 : _a.create_conn) || false;
                            if (((_b = ad_source === null || ad_source === void 0 ? void 0 : ad_source.data) === null || _b === void 0 ? void 0 : _b.create_conn) && ((_e = (_d = (_c = this.initConfig) === null || _c === void 0 ? void 0 : _c.advertise_channel) === null || _d === void 0 ? void 0 : _d.gdt) === null || _e === void 0 ? void 0 : _e.sid) && ((_h = (_g = (_f = this.initConfig) === null || _f === void 0 ? void 0 : _f.websocket) === null || _g === void 0 ? void 0 : _g.ws_list) === null || _h === void 0 ? void 0 : _h.length)) {
                                this.socket_index = 0;
                                this.socket_ws_list = (_k = (_j = this.initConfig) === null || _j === void 0 ? void 0 : _j.websocket) === null || _k === void 0 ? void 0 : _k.ws_list;
                                this.socket_connect_number = 1;
                                this.reconnecting = false;
                                this.no_more_reconnection = false;
                                this.connectWebSocket();
                            }
                            return [2 /*return*/];
                        });
                    }); }).catch(function (e) {
                        console.log(e);
                    });
                    return [2 /*return*/];
                });
            });
        };
        // 连接WebSocket服务器
        SdkWegame.prototype.connectWebSocket = function () {
            var _this = this;
            // WebSocket已设置断开不再重连，后续不做处理
            if (this.no_more_reconnection) {
                console.log('WebSocket已设置断开不再重连');
                return;
            }
            // WebSocket连接次数已到20次，后续不做处理
            if (this.socket_connect_number > this.MAX_CONNECT_NUMBER) {
                console.log('WebSocket连接次数已到20次');
                return;
            }
            var socket_header = this.getHeaders();
            var socket_url = this.socket_ws_list[this.socket_index];
            console.log('WebSocket连接次数：', this.socket_connect_number);
            console.log('WebSocket连接参数：', {
                socket_url: socket_url,
                socket_header: socket_header
            });
            this.no_more_reconnection = false;
            this.socket_task = wx.connectSocket({
                url: socket_url,
                header: socket_header,
                success: function (res) {
                    console.log('WebSocket连接创建成功：', res);
                },
                fail: function () { }
            });
            // 监听WebSocket连接打开事件
            this.socket_task.onOpen(function (res) {
                console.log('WebSocket连接打开：', res);
                // 开启心跳检测
                _this.startHeartbeat();
            });
            // 监听WebSocket连接错误事件
            this.socket_task.onError(function (err) {
                console.log('WebSocket连接错误：', err);
                _this.reconnectWebSocket(err);
            });
            // 监听WebSocket连接关闭事件
            this.socket_task.onClose(function (err) {
                console.log('WebSocket连接已关闭：', err);
                // WebSocket已设置断开不再重连，后续不做处理
                if (_this.no_more_reconnection) {
                    console.log('WebSocket已设置断开不再重连');
                    return;
                }
                _this.reconnectWebSocket(err, false);
            });
            // 监听WebSocket接收到消息事件
            this.socket_task.onMessage(function (res) { return __awaiter(_this, void 0, void 0, function () {
                var data_1, uuid, _a, e_13;
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 22, , 23]);
                            data_1 = arrayBufferToJson(res.data);
                            console.log('收到服务端消息data：', data_1);
                            if (!((data_1 === null || data_1 === void 0 ? void 0 : data_1.msg_type) === 1)) return [3 /*break*/, 20];
                            uuid = data_1.uuid;
                            console.log('收到服务端消息uuid：', uuid, customGetStorageSync('rx_socket_uuid'));
                            if (!['start', 're_active', 'tutorial_finish', 'pay', 'register'].includes((_b = data_1.body) === null || _b === void 0 ? void 0 : _b.event)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.initTencentSdk()];
                        case 1:
                            _d.sent();
                            _d.label = 2;
                        case 2:
                            if (!(customGetStorageSync('rx_socket_uuid') != uuid)) return [3 /*break*/, 18];
                            _a = (_c = data_1.body) === null || _c === void 0 ? void 0 : _c.event;
                            switch (_a) {
                                case 'start': return [3 /*break*/, 3];
                                case 're_active': return [3 /*break*/, 5];
                                case 'tutorial_finish': return [3 /*break*/, 7];
                                case 'pay': return [3 /*break*/, 9];
                                case 'register': return [3 /*break*/, 11];
                                case 'create_game_role': return [3 /*break*/, 13];
                            }
                            return [3 /*break*/, 15];
                        case 3: return [4 /*yield*/, this.reportOrQueueDirectAdGdtEvent(function () {
                                handleGdtTrackResult(tencent_sdk === null || tencent_sdk === void 0 ? void 0 : tencent_sdk.onAppStart());
                            })];
                        case 4:
                            _d.sent();
                            this.socketTaskSend('on_app_start');
                            return [3 /*break*/, 17];
                        case 5: return [4 /*yield*/, this.reportOrQueueDirectAdGdtEvent(function () {
                                var _a, _b;
                                handleGdtTrackResult(tencent_sdk === null || tencent_sdk === void 0 ? void 0 : tencent_sdk.track('RE_ACTIVE', { backFlowDay: parseInt((_b = (_a = data_1.body) === null || _a === void 0 ? void 0 : _a.info) === null || _b === void 0 ? void 0 : _b.back_flow_day) }));
                            })];
                        case 6:
                            _d.sent();
                            this.socketTaskSend('on_re_active');
                            return [3 /*break*/, 17];
                        case 7: return [4 /*yield*/, this.reportOrQueueDirectAdGdtEvent(function () {
                                handleGdtTrackResult(tencent_sdk === null || tencent_sdk === void 0 ? void 0 : tencent_sdk.onTutorialFinish());
                            })];
                        case 8:
                            _d.sent();
                            this.socketTaskSend('on_tutorial_finish');
                            return [3 /*break*/, 17];
                        case 9: return [4 /*yield*/, this.reportOrQueueDirectAdGdtEvent(function () {
                                var _a, _b;
                                handleGdtTrackResult(tencent_sdk === null || tencent_sdk === void 0 ? void 0 : tencent_sdk.onPurchase(parseInt((_b = (_a = data_1.body) === null || _a === void 0 ? void 0 : _a.info) === null || _b === void 0 ? void 0 : _b.amount)));
                            })];
                        case 10:
                            _d.sent();
                            this.socketTaskSend('on_purchase');
                            return [3 /*break*/, 17];
                        case 11: return [4 /*yield*/, this.reportOrQueueDirectAdGdtEvent(function () {
                                handleGdtTrackResult(tencent_sdk === null || tencent_sdk === void 0 ? void 0 : tencent_sdk.onRegister());
                            })];
                        case 12:
                            _d.sent();
                            this.socketTaskSend('on_register');
                            return [3 /*break*/, 17];
                        case 13: return [4 /*yield*/, this.reportOrQueueDirectAdGdtEvent(function () {
                                var _a, _b;
                                handleGdtTrackResult(tencent_sdk === null || tencent_sdk === void 0 ? void 0 : tencent_sdk.onCreateRole((_b = (_a = data_1.body) === null || _a === void 0 ? void 0 : _a.info) === null || _b === void 0 ? void 0 : _b.role_id));
                            })];
                        case 14:
                            _d.sent();
                            this.socketTaskSend('create_game_role');
                            return [3 /*break*/, 17];
                        case 15:
                            this.socketTaskSend('on_other_event');
                            return [4 /*yield*/, this.reportOrQueueDirectAdGdtEvent(function () {
                                    var _a, _b;
                                    handleGdtTrackResult(tencent_sdk === null || tencent_sdk === void 0 ? void 0 : tencent_sdk.track((_a = data_1.body) === null || _a === void 0 ? void 0 : _a.event, (_b = data_1.body) === null || _b === void 0 ? void 0 : _b.info));
                                })];
                        case 16:
                            _d.sent();
                            _d.label = 17;
                        case 17: return [3 /*break*/, 19];
                        case 18:
                            this.socketTaskSend('on_not_handled');
                            _d.label = 19;
                        case 19:
                            customSetStorageSync('rx_socket_uuid', uuid);
                            return [3 /*break*/, 21];
                        case 20:
                            if ((data_1 === null || data_1 === void 0 ? void 0 : data_1.msg_type) === -1) {
                                this.socketTaskSend('on_close');
                                this.disconnectWebSocket();
                            }
                            _d.label = 21;
                        case 21: return [3 /*break*/, 23];
                        case 22:
                            e_13 = _d.sent();
                            console.log(e_13);
                            return [3 /*break*/, 23];
                        case 23: return [2 /*return*/];
                    }
                });
            }); });
        };
        // 开启心跳检测
        SdkWegame.prototype.startHeartbeat = function () {
            var _this = this;
            clearTimeout(this.heartbeat_timer);
            this.heartbeat_timer = setInterval(function () {
                _this.socket_task.send({
                    data: JSON.stringify({
                        msg_type: 1000,
                        msg: 'on_heartbeat'
                    })
                });
            }, this.HEARTBEAT_INTERVAL);
        };
        // 断开存在的WebSocket连接
        SdkWegame.prototype.disconnectWebSocket = function (no_more_reconnection) {
            if (no_more_reconnection === void 0) { no_more_reconnection = true; }
            this.no_more_reconnection = no_more_reconnection;
            clearTimeout(this.heartbeat_timer);
            try {
                if (this.socket_task) {
                    this.socket_task.close();
                }
            }
            catch (e) {
                console.log(e);
            }
        };
        // 断开WebSocket后主动重连
        SdkWegame.prototype.activeWebSocket = function () {
            if (!this.no_more_reconnection) {
                return;
            }
            this.no_more_reconnection = false;
            this.connectWebSocket();
        };
        SdkWegame.prototype.reconnectWebSocket = function (err, plus_socket_index) {
            var _this = this;
            if (plus_socket_index === void 0) { plus_socket_index = true; }
            // 如果重连中，不做处理
            if (this.reconnecting) {
                return;
            }
            // socket正在发起重连中
            this.reconnecting = true;
            // 关闭心跳检测定时器
            clearInterval(this.heartbeat_timer);
            // 连接失败后可以设置重试机制，比如延迟一段时间后重新连接
            setTimeout(function () {
                if (plus_socket_index) {
                    // 连接游标加一，如果游标越界则上报
                    _this.socket_index++;
                    if (_this.socket_index > _this.socket_ws_list.length - 1) {
                        _this.track({
                            complete: function (data) {
                                console.info(data);
                            },
                        }, formatTrackParams({
                            eventName: 'wssFail',
                            apiName: 'connectWebSocket',
                            errorInfo: err,
                            loginInfo: USER_INFO,
                        }));
                        return;
                    }
                }
                // socket连接次数加一
                _this.socket_connect_number++;
                // 重新发起连接
                _this.connectWebSocket();
                // socket已发起重连
                _this.reconnecting = false;
            }, this.RECONNECT_INTERVAL);
        };
        // 通知服务端当前消息已处理
        SdkWegame.prototype.socketTaskSend = function (msg) {
            if (msg === void 0) { msg = ''; }
            this.socket_task.send({
                data: JSON.stringify({
                    msg_type: 99,
                    msg: msg
                })
            });
        };
        // 调起客户端订阅消息界面
        SdkWegame.prototype.requestSubscribeMessage = function (params, callback) {
            wx.requestSubscribeMessage({
                tmplIds: params.tmplIds,
                success: function (res) {
                    console.log(res);
                    res.errMsg; var _template_map = __rest(res, ["errMsg"]);
                    wx.getSetting({
                        withSubscriptions: true,
                        success: function (res) {
                            var _a;
                            console.log(res);
                            var template_map = __assign(__assign({}, _template_map), (((_a = res.subscriptionsSetting) === null || _a === void 0 ? void 0 : _a.itemSettings) || {}));
                            requestSubscribeMessageApi({
                                rx_open_id: USER_INFO.openid,
                                template_map: template_map
                            }).then(function () {
                                callback && callback.complete({
                                    code: 0,
                                    data: template_map
                                });
                            }).catch(function (err) {
                                callback && callback.complete(handleTrackError('', err));
                            });
                        },
                        fail: function (err) {
                            callback && callback.complete(handleTrackError('', err));
                        }
                    });
                },
                fail: function (err) {
                    callback && callback.complete(handleTrackError('', err));
                }
            });
        };
        // 游戏区服信息查询
        SdkWegame.prototype.getGameArea = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_19;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, getGameAreaApi(params.area_id)];
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
        // 游戏区服信息修改
        SdkWegame.prototype.putGameArea = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_20;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, putGameAreaApi(params)];
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
        // 创建游戏区服
        SdkWegame.prototype.createGameArea = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_21;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, createGameAreaApi(params)];
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
        // 删除游戏区服
        SdkWegame.prototype.delGameArea = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_22;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, delGameAreaApi(params)];
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
        // 查询区服列表信息
        SdkWegame.prototype.getGameAreaList = function (callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_23;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, getGameAreaListApi()];
                        case 1:
                            result = _a.sent();
                            callback.complete(result);
                            return [3 /*break*/, 3];
                        case 2:
                            error_23 = _a.sent();
                            callback.complete(handleError(error_23));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // 创建角色
        SdkWegame.prototype.createGameCharacter = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, e_14, error_24;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 6, , 7]);
                            return [4 /*yield*/, createGameCharacterApi(__assign(__assign({}, params), { rx_openid: params.rx_openid || USER_INFO.openid }))];
                        case 1:
                            result = _a.sent();
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, this.reportCreateRole(params.character_id)];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            e_14 = _a.sent();
                            console.log(e_14);
                            return [3 /*break*/, 5];
                        case 5:
                            callback.complete(result);
                            return [3 /*break*/, 7];
                        case 6:
                            error_24 = _a.sent();
                            callback.complete(handleError(error_24));
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        // 修改游戏角色信息
        SdkWegame.prototype.putGameCharacter = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, rest, e_15, error_25;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 7, , 8]);
                            return [4 /*yield*/, putGameCharacterApi(__assign(__assign({}, params), { rx_openid: params.rx_openid || USER_INFO.openid }))];
                        case 1:
                            result = _a.sent();
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 5, , 6]);
                            params.extension, rest = __rest(params, ["extension"]);
                            if (!(params.character_level || params.character_vip_level)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.reportUpdateLevel(__assign(__assign({}, rest), { rx_openid: params.rx_openid || USER_INFO.openid }))];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            e_15 = _a.sent();
                            console.log(e_15);
                            return [3 /*break*/, 6];
                        case 6:
                            callback.complete(result);
                            return [3 /*break*/, 8];
                        case 7:
                            error_25 = _a.sent();
                            callback.complete(handleError(error_25));
                            return [3 /*break*/, 8];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        // 删除游戏角色
        SdkWegame.prototype.delGameCharacter = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_26;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, delGameCharacterApi(params)];
                        case 1:
                            result = _a.sent();
                            callback.complete(result);
                            return [3 /*break*/, 3];
                        case 2:
                            error_26 = _a.sent();
                            callback.complete(handleError(error_26));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // 查询账号下角色信息列表
        SdkWegame.prototype.getGameCharacterAccount = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_27;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, getGameCharacterAccountApi(params)];
                        case 1:
                            result = _a.sent();
                            callback.complete(result);
                            return [3 /*break*/, 3];
                        case 2:
                            error_27 = _a.sent();
                            callback.complete(handleError(error_27));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // 查询账号下某个区服下的角色信息列表
        SdkWegame.prototype.getGameCharacter = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_28;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, getGameCharacterApi(params)];
                        case 1:
                            result = _a.sent();
                            callback.complete(result);
                            return [3 /*break*/, 3];
                        case 2:
                            error_28 = _a.sent();
                            callback.complete(handleError(error_28));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // 查询具体角色信息
        SdkWegame.prototype.getGameAccountAreaCharacter = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_29;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, getGameAccountAreaCharacterApi(params)];
                        case 1:
                            result = _a.sent();
                            callback.complete(result);
                            return [3 /*break*/, 3];
                        case 2:
                            error_29 = _a.sent();
                            callback.complete(handleError(error_29));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // 邮件列表
        SdkWegame.prototype.getEmailList = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_30;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, getEmailListApi(params)];
                        case 1:
                            result = _a.sent();
                            callback.complete(result);
                            return [3 /*break*/, 3];
                        case 2:
                            error_30 = _a.sent();
                            callback.complete(handleError(error_30));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // 邮件详情
        SdkWegame.prototype.getEmailDetail = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_31;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, getEmailDetailApi(params)];
                        case 1:
                            result = _a.sent();
                            callback.complete(result);
                            return [3 /*break*/, 3];
                        case 2:
                            error_31 = _a.sent();
                            callback.complete(handleError(error_31));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // 邮件领取
        SdkWegame.prototype.receiveEmail = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_32;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, receiveEmailApi(params)];
                        case 1:
                            result = _a.sent();
                            callback.complete(result);
                            return [3 /*break*/, 3];
                        case 2:
                            error_32 = _a.sent();
                            callback.complete(handleError(error_32));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // 邮件删除
        SdkWegame.prototype.delEmail = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_33;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, delEmailApi(params)];
                        case 1:
                            result = _a.sent();
                            callback.complete(result);
                            return [3 /*break*/, 3];
                        case 2:
                            error_33 = _a.sent();
                            callback.complete(handleError(error_33));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SdkWegame.prototype.getDynamicShareActivityId = function (callback) {
            var query = getSearchQueries();
            return query.activityId;
        };
        SdkWegame.prototype.setDynamicShareMsg = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var checkParams, parameter_list, result, error_34;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            checkParams = {
                                target_state: {
                                    type: 'enum',
                                    required: true,
                                    enum: [0, 1],
                                },
                                activity_id: {
                                    type: 'string',
                                    required: true,
                                },
                                member_count: {
                                    type: 'number',
                                    required: params.target_state === 0,
                                },
                                room_limit: {
                                    type: 'number',
                                    required: params.target_state === 0,
                                },
                                version_type: {
                                    type: 'enum',
                                    required: params.target_state === 1,
                                    enum: ['develop', 'trial', 'release'],
                                }
                            };
                            return [4 /*yield*/, pubCheck(checkParams, callback, params)];
                        case 1:
                            _a.sent();
                            if (params.target_state == 0 && params.member_count > params.room_limit) {
                                throw Error('room_limit 不可小于 member_count');
                            }
                            parameter_list = [];
                            if (params.member_count) {
                                parameter_list.push({
                                    name: 'member_count',
                                    value: "".concat(params.member_count)
                                });
                            }
                            if (params.room_limit) {
                                parameter_list.push({
                                    name: 'room_limit',
                                    value: "".concat(params.room_limit)
                                });
                            }
                            if (params.target_state === 1) {
                                parameter_list.push({
                                    name: 'path',
                                    value: params.path || '?foo=bar'
                                });
                            }
                            if (params.version_type) {
                                parameter_list.push({
                                    name: 'version_type',
                                    value: params.version_type
                                });
                            }
                            return [4 /*yield*/, setDynamicMsgApi({
                                    activity_id: params.activity_id,
                                    target_state: params.target_state,
                                    template_info: {
                                        parameter_list: parameter_list
                                    }
                                })];
                        case 2:
                            result = _a.sent();
                            callback.complete(__assign(__assign({}, result), { msg: result.msg || result.message }));
                            return [3 /*break*/, 4];
                        case 3:
                            error_34 = _a.sent();
                            callback.complete(handleError(error_34));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        SdkWegame.prototype.createActivityId = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var reqParam, result, err_32;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            reqParam = {};
                            if (params.isPrivateMessage) {
                                reqParam.openid = USER_INFO.tid;
                            }
                            return [4 /*yield*/, createActivityIdApi(reqParam)];
                        case 1:
                            result = _a.sent();
                            callback.complete(__assign(__assign({}, result), { msg: result.msg || result.message }));
                            return [3 /*break*/, 3];
                        case 2:
                            err_32 = _a.sent();
                            callback.complete(handleError(err_32));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SdkWegame.prototype.dynamicShare = function (params, callback) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2;
            return __awaiter(this, void 0, void 0, function () {
                var key, key_2, checkParams, shareData_5, onHide_3, onShow_4, query, error_35;
                var _this = this;
                return __generator(this, function (_3) {
                    switch (_3.label) {
                        case 0:
                            key = Date.now() + '';
                            for (key_2 in showMap) {
                                try {
                                    wx.offShow(showMap[key_2]);
                                }
                                catch (e) {
                                    console.log(e);
                                }
                            }
                            _3.label = 1;
                        case 1:
                            _3.trys.push([1, 4, , 5]);
                            checkParams = {
                                activity_id: {
                                    type: 'string',
                                    required: true,
                                },
                                member_count: {
                                    type: 'number',
                                    required: true,
                                },
                                room_limit: {
                                    type: 'number',
                                    required: true,
                                }
                            };
                            return [4 /*yield*/, pubCheck(checkParams, callback, params)];
                        case 2:
                            _3.sent();
                            return [4 /*yield*/, this.getShareData(params, callback, true)];
                        case 3:
                            shareData_5 = _3.sent();
                            if (params.member_count > params.room_limit) {
                                throw Error('room_limit 不可小于 member_count');
                            }
                            wx.updateShareMenu({
                                withShareTicket: params.withShareTicket || true,
                                isUpdatableMessage: true,
                                activityId: params.activity_id,
                                templateInfo: {
                                    parameterList: [{
                                            name: 'member_count',
                                            value: "".concat(params.member_count)
                                        }, {
                                            name: 'room_limit',
                                            value: "".concat(params.room_limit)
                                        }]
                                }
                            });
                            console.log('sdk getShareData:', shareData_5);
                            onHide_3 = function () {
                                wx.offHide(onHide_3);
                            };
                            onShow_4 = function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    wx.offShow(onShow_4);
                                    callback.complete(shareData_5);
                                    return [2 /*return*/];
                                });
                            }); };
                            query = qs.stringify({
                                type: 'rx',
                                user_source: 'share',
                                activityId: params.activity_id,
                                platform: ((_a = shareData_5 === null || shareData_5 === void 0 ? void 0 : shareData_5.data) === null || _a === void 0 ? void 0 : _a.platform) || '',
                                transmits: encodeURIComponent((params === null || params === void 0 ? void 0 : params.transmits) || ''),
                                landing_id: ((_c = (_b = shareData_5 === null || shareData_5 === void 0 ? void 0 : shareData_5.data) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.landing_id) || '',
                                trigger_id: ((_e = (_d = shareData_5 === null || shareData_5 === void 0 ? void 0 : shareData_5.data) === null || _d === void 0 ? void 0 : _d.trigger) === null || _e === void 0 ? void 0 : _e.id) || '',
                                trigger_tag: ((_g = (_f = shareData_5 === null || shareData_5 === void 0 ? void 0 : shareData_5.data) === null || _f === void 0 ? void 0 : _f.trigger) === null || _g === void 0 ? void 0 : _g.tag) || '',
                                trigger_type: ((_j = (_h = shareData_5 === null || shareData_5 === void 0 ? void 0 : shareData_5.data) === null || _h === void 0 ? void 0 : _h.trigger) === null || _j === void 0 ? void 0 : _j.type) || '',
                                material_type: ((_l = (_k = shareData_5 === null || shareData_5 === void 0 ? void 0 : shareData_5.data) === null || _k === void 0 ? void 0 : _k.content) === null || _l === void 0 ? void 0 : _l.material_type) || '',
                                material_id: ((_o = (_m = shareData_5 === null || shareData_5 === void 0 ? void 0 : shareData_5.data) === null || _m === void 0 ? void 0 : _m.content) === null || _o === void 0 ? void 0 : _o.material_id) || '',
                                strategy_type: ((_q = (_p = shareData_5 === null || shareData_5 === void 0 ? void 0 : shareData_5.data) === null || _p === void 0 ? void 0 : _p.strategy) === null || _q === void 0 ? void 0 : _q.type) || '',
                                strategy_id: ((_s = (_r = shareData_5 === null || shareData_5 === void 0 ? void 0 : shareData_5.data) === null || _r === void 0 ? void 0 : _r.strategy) === null || _s === void 0 ? void 0 : _s.id) || '',
                                material_name: ((_u = (_t = shareData_5 === null || shareData_5 === void 0 ? void 0 : shareData_5.data) === null || _t === void 0 ? void 0 : _t.content) === null || _u === void 0 ? void 0 : _u.title) || '',
                                trigger_name: ((_w = (_v = shareData_5 === null || shareData_5 === void 0 ? void 0 : shareData_5.data) === null || _v === void 0 ? void 0 : _v.trigger) === null || _w === void 0 ? void 0 : _w.title) || '',
                                strategy_name: ((_y = (_x = shareData_5 === null || shareData_5 === void 0 ? void 0 : shareData_5.data) === null || _x === void 0 ? void 0 : _x.strategy) === null || _y === void 0 ? void 0 : _y.name) || '',
                                share_time: Math.floor(new Date().getTime() / 1000),
                                share_type: 'mini',
                                inviter_region: USER_INFO.region || '',
                                inviter_openid: USER_INFO.openid || '',
                                inviter_productid: SYSTEM_INFO$1.productId,
                                inviter_channelid: SYSTEM_INFO$1.channelId,
                                inviter_subchannelid: this.subChannelId || '',
                            });
                            query = params.query ? "".concat(query, "&").concat(params.query) : query;
                            wx.onHide(onHide_3);
                            wx.onShow(onShow_4);
                            showMap[key] = onShow_4;
                            wx.shareAppMessage({
                                title: params.title || ((_0 = (_z = shareData_5 === null || shareData_5 === void 0 ? void 0 : shareData_5.data) === null || _z === void 0 ? void 0 : _z.content) === null || _0 === void 0 ? void 0 : _0.content),
                                imageUrl: params.imageUrl || ((_2 = (_1 = shareData_5 === null || shareData_5 === void 0 ? void 0 : shareData_5.data) === null || _1 === void 0 ? void 0 : _1.content) === null || _2 === void 0 ? void 0 : _2.image),
                                query: query
                            });
                            this.reportShareAppMessage('APP_MESSAGE');
                            return [3 /*break*/, 5];
                        case 4:
                            error_35 = _3.sent();
                            callback.complete(handleError(error_35));
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        SdkWegame.prototype.setGameInfo = function (cp_role_id, region_tag) {
            SYSTEM_INFO$1.cp_role_id = cp_role_id;
            SYSTEM_INFO$1.region_tag = region_tag;
        };
        SdkWegame.prototype.searchGameAccount = function (callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_36;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, searchGameAccountApi()];
                        case 1:
                            result = _a.sent();
                            callback.complete(result);
                            return [3 /*break*/, 3];
                        case 2:
                            error_36 = _a.sent();
                            callback.complete(handleError(error_36));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SdkWegame.prototype.openChatTool = function (params, callback) {
            var _params = {};
            if (params.roomid) {
                _params.roomid = params.roomid;
            }
            if (params.chatType) {
                _params.chatType = params.chatType;
            }
            // @ts-ignore
            wx.openChatTool(__assign(__assign({}, _params), { success: function () {
                    callback.complete({
                        code: 0
                    });
                }, fail: function (err) {
                    callback.complete(handleError(err));
                } }));
        };
        SdkWegame.prototype.isChatTool = function () {
            // @ts-ignore
            var result = wx.isChatTool();
            return result;
        };
        SdkWegame.prototype.exitChatTool = function (callback) {
            // @ts-ignore
            wx.exitChatTool({
                success: function () {
                    callback.complete({
                        code: 0
                    });
                },
                fail: function (err) {
                    callback.complete(handleError(err));
                }
            });
        };
        SdkWegame.prototype.chatToolShare = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var shareData_6, _params, error_37;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.getShareData(params, callback, true)];
                        case 1:
                            shareData_6 = _a.sent();
                            _params = {
                                withShareTicket: params.withShareTicket || true,
                                isUpdatableMessage: true,
                                useForChatTool: true,
                                activityId: params.activity_id,
                                chooseType: params.chooseType || 1,
                                participant: params.members || [],
                                templateInfo: {
                                    // @ts-ignore
                                    templateId: params.templateId || '4A68CBB88A92B0A9311848DBA1E94A199B166463'
                                }
                            };
                            wx.updateShareMenu(__assign(__assign({}, _params), { success: function (res) {
                                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2;
                                    var query = qs.stringify({
                                        type: 'rx',
                                        user_source: 'share',
                                        is_chat_tool: '1',
                                        activityId: params.activity_id,
                                        platform: ((_a = shareData_6 === null || shareData_6 === void 0 ? void 0 : shareData_6.data) === null || _a === void 0 ? void 0 : _a.platform) || '',
                                        transmits: encodeURIComponent((params === null || params === void 0 ? void 0 : params.transmits) || ''),
                                        landing_id: ((_c = (_b = shareData_6 === null || shareData_6 === void 0 ? void 0 : shareData_6.data) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.landing_id) || '',
                                        trigger_id: ((_e = (_d = shareData_6 === null || shareData_6 === void 0 ? void 0 : shareData_6.data) === null || _d === void 0 ? void 0 : _d.trigger) === null || _e === void 0 ? void 0 : _e.id) || '',
                                        trigger_tag: ((_g = (_f = shareData_6 === null || shareData_6 === void 0 ? void 0 : shareData_6.data) === null || _f === void 0 ? void 0 : _f.trigger) === null || _g === void 0 ? void 0 : _g.tag) || '',
                                        trigger_type: ((_j = (_h = shareData_6 === null || shareData_6 === void 0 ? void 0 : shareData_6.data) === null || _h === void 0 ? void 0 : _h.trigger) === null || _j === void 0 ? void 0 : _j.type) || '',
                                        material_type: ((_l = (_k = shareData_6 === null || shareData_6 === void 0 ? void 0 : shareData_6.data) === null || _k === void 0 ? void 0 : _k.content) === null || _l === void 0 ? void 0 : _l.material_type) || '',
                                        material_id: ((_o = (_m = shareData_6 === null || shareData_6 === void 0 ? void 0 : shareData_6.data) === null || _m === void 0 ? void 0 : _m.content) === null || _o === void 0 ? void 0 : _o.material_id) || '',
                                        strategy_type: ((_q = (_p = shareData_6 === null || shareData_6 === void 0 ? void 0 : shareData_6.data) === null || _p === void 0 ? void 0 : _p.strategy) === null || _q === void 0 ? void 0 : _q.type) || '',
                                        strategy_id: ((_s = (_r = shareData_6 === null || shareData_6 === void 0 ? void 0 : shareData_6.data) === null || _r === void 0 ? void 0 : _r.strategy) === null || _s === void 0 ? void 0 : _s.id) || '',
                                        material_name: ((_u = (_t = shareData_6 === null || shareData_6 === void 0 ? void 0 : shareData_6.data) === null || _t === void 0 ? void 0 : _t.content) === null || _u === void 0 ? void 0 : _u.title) || '',
                                        trigger_name: ((_w = (_v = shareData_6 === null || shareData_6 === void 0 ? void 0 : shareData_6.data) === null || _v === void 0 ? void 0 : _v.trigger) === null || _w === void 0 ? void 0 : _w.title) || '',
                                        strategy_name: ((_y = (_x = shareData_6 === null || shareData_6 === void 0 ? void 0 : shareData_6.data) === null || _x === void 0 ? void 0 : _x.strategy) === null || _y === void 0 ? void 0 : _y.name) || '',
                                        share_time: Math.floor(new Date().getTime() / 1000),
                                        share_type: 'mini',
                                        inviter_region: USER_INFO.region || '',
                                        inviter_openid: USER_INFO.openid || '',
                                        inviter_productid: SYSTEM_INFO$1.productId,
                                        inviter_channelid: SYSTEM_INFO$1.channelId,
                                        inviter_subchannelid: this.subChannelId || '',
                                    });
                                    query = params.query ? "".concat(query, "&").concat(params.query) : query;
                                    // @ts-ignore
                                    wx.shareAppMessageToGroup({
                                        title: params.title || ((_0 = (_z = shareData_6 === null || shareData_6 === void 0 ? void 0 : shareData_6.data) === null || _z === void 0 ? void 0 : _z.content) === null || _0 === void 0 ? void 0 : _0.content),
                                        imageUrl: params.imageUrl || ((_2 = (_1 = shareData_6 === null || shareData_6 === void 0 ? void 0 : shareData_6.data) === null || _1 === void 0 ? void 0 : _1.content) === null || _2 === void 0 ? void 0 : _2.image),
                                        path: params.path || "?".concat(query),
                                        success: function (res) {
                                            callback.complete(shareData_6);
                                        },
                                        fail: function (err) {
                                            callback.complete(handleError(err));
                                        }
                                    });
                                    this.reportShareAppMessage('APP_MESSAGE');
                                } }));
                            return [3 /*break*/, 3];
                        case 2:
                            error_37 = _a.sent();
                            callback.complete(handleError(error_37));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SdkWegame.prototype.selectGroupMembers = function (params, callback) {
            var _params = {};
            if (params.maxSelectCount != null) {
                _params.maxSelectCount = params.maxSelectCount;
            }
            // @ts-ignore
            wx.selectGroupMembers(__assign(__assign({}, _params), { success: function (res) {
                    callback.complete({
                        code: 0,
                        data: res.members
                    });
                }, fail: function (err) {
                    callback.complete(handleError(err));
                } }));
        };
        SdkWegame.prototype.checkIsChatToolEnter = function (callback) {
            var query = getSearchQueries();
            return !!query.is_chat_tool;
        };
        SdkWegame.prototype.getGroupEnterInfo = function (params, callback) {
            var _params = {};
            if (params.allowSingleChat != null) {
                _params.allowSingleChat = params.allowSingleChat;
            }
            if (params.needGroupOpenID != null) {
                _params.needGroupOpenID = params.needGroupOpenID;
            }
            // @ts-ignore
            wx.getGroupEnterInfo(__assign(__assign({}, _params), { success: function (res) {
                    callback.complete({
                        code: 0
                    });
                }, fail: function (err) {
                    callback.complete(handleError(err));
                } }));
        };
        SdkWegame.prototype.getChatToolInfo = function (callback) {
            var that = this;
            // @ts-ignore
            wx.getChatToolInfo({
                success: function (res) {
                    that.decryptionDate({
                        encrypted_data: res.encryptedData,
                        iv: res.iv
                    }, {
                        complete: function (res) {
                            callback.complete({
                                code: 0,
                                data: JSON.parse(res.data.decode_data)
                            });
                        }
                    });
                },
                fail: function (err) {
                    callback.complete(handleError(err));
                }
            });
        };
        SdkWegame.prototype.chatToolMsgSend = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var _params, result, error_38;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            _params = {
                                activity_id: params.activity_id,
                                target_state: params.target_state,
                                version_type: params.version_type,
                                template_id: params.template_id || '4A68CBB88A92B0A9311848DBA1E94A199B166463',
                            };
                            if (params.participator_info_list) {
                                _params.participator_info_list = params.participator_info_list;
                            }
                            if (params.template_id) {
                                _params.template_id = params.template_id;
                            }
                            return [4 /*yield*/, setChatToolMsgApi(_params)];
                        case 1:
                            result = _a.sent();
                            callback.complete(__assign(__assign({}, result), { msg: result.msg || result.message }));
                            return [3 /*break*/, 3];
                        case 2:
                            error_38 = _a.sent();
                            callback.complete(handleError(error_38));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return SdkWegame;
    }(SdkCommon));
    // 通过Object.getOwnPropertyNames获取wx对象所有自身属性名（包括方法和非方法属性）
    try {
        Object.getOwnPropertyNames(wx).forEach(function (key) {
            // @ts-ignore
            var value = wx[key];
            if (typeof value === 'function') {
                // 如果是函数类型，就在MyWxWrapper类的原型上添加对应的方法
                // @ts-ignore
                if (SdkWegame.prototype[key] || SdkWegame[key]) {
                    // @ts-ignore
                    wx["ori".concat(key)] = function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        return value.apply(wx, args);
                    };
                    // @ts-ignore
                    SdkWegame.prototype["ori".concat(key)] = function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        return value.apply(wx, args);
                    };
                }
                else {
                    // @ts-ignore
                    SdkWegame.prototype[key] = function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        return value.apply(wx, args);
                    };
                }
            }
        });
    }
    catch (e) {
    }

    // 获取帮助中心首页信息
    var getMainlayoutApi = function () {
        return doRequest({
            url: '/v1/service/helpcenter/mainlayout',
            method: 'GET',
        });
    };
    // 获取帮助中心问题一级列表页
    var getListlayoutApi = function (params) {
        return doRequest({
            url: '/v1/service/helpcenter/listlayout',
            method: 'GET',
            params: params,
        });
    };
    // 获取帮助中心问题详情
    var getInfolayoutApi = function (params) {
        return doRequest({
            url: '/v1/service/helpcenter/infolayout',
            method: 'GET',
            params: params,
        });
    };
    // 设置帮助中心问题解决状态
    var postResolutionApi = function (data) {
        return doRequest({
            url: '/v1/service/helpcenter/resolution',
            method: 'POST',
            data: data,
        });
    };

    // 意见反馈
    var SdkHelpcenter = /** @class */ (function () {
        function SdkHelpcenter() {
        }
        Object.defineProperty(SdkHelpcenter, "I", {
            get: function () {
                return this.instance || (this.instance = new SdkHelpcenter());
            },
            enumerable: false,
            configurable: true
        });
        SdkHelpcenter.prototype.getHelpcenterMainLayout = function (_a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var result, err_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, getMainlayoutApi()];
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
        SdkHelpcenter.prototype.getHelpcenterQuestionLayout = function (params, _a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var result, err_2;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, getListlayoutApi(params)];
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
        SdkHelpcenter.prototype.getHelpcenterInfoLayout = function (params, _a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var result, err_3;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, getInfolayoutApi(params)];
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
        SdkHelpcenter.prototype.helpcenterResolution = function (params, _a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var result, err_4;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, postResolutionApi(params)];
                        case 1:
                            result = _b.sent();
                            complete(result);
                            return [3 /*break*/, 3];
                        case 2:
                            err_4 = _b.sent();
                            complete(handleError(err_4));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return SdkHelpcenter;
    }());

    //微信小游戏sdk-全量
    var SdkWegameFull = /** @class */ (function (_super) {
        __extends(SdkWegameFull, _super);
        function SdkWegameFull(initParams) {
            var _this = _super.call(this, initParams) || this;
            console.log('微信小游戏sdk-全量API');
            return _this;
        }
        Object.defineProperty(SdkWegameFull, "social", {
            //社交关系
            get: function () {
                return SdkSocial.I;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SdkWegameFull, "helpcenter", {
            //帮助中心
            get: function () {
                return SdkHelpcenter.I;
            },
            enumerable: false,
            configurable: true
        });
        SdkWegameFull.prototype.setcustom = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, SdkWegameFull.social.setcustom(params, callback)];
                });
            });
        };
        SdkWegameFull.prototype.addRelation = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, SdkWegameFull.social.addRelation(params, callback)];
                });
            });
        };
        SdkWegameFull.prototype.deleteRelation = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, SdkWegameFull.social.deleteRelation(params, callback)];
                });
            });
        };
        SdkWegameFull.prototype.updateremarks = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, SdkWegameFull.social.updateremarks(params, callback)];
                });
            });
        };
        SdkWegameFull.prototype.hasRelation = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, SdkWegameFull.social.hasRelation(params, callback)];
                });
            });
        };
        SdkWegameFull.prototype.relationList = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, SdkWegameFull.social.relationList(params, callback)];
                });
            });
        };
        SdkWegameFull.prototype.addFriend = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, SdkWegameFull.social.addFriend(params, callback)];
                });
            });
        };
        SdkWegameFull.prototype.delfriend = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, SdkWegameFull.social.delfriend(params, callback)];
                });
            });
        };
        SdkWegameFull.prototype.updatefriendremarks = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, SdkWegameFull.social.updatefriendremarks(params, callback)];
                });
            });
        };
        SdkWegameFull.prototype.isfriend = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, SdkWegameFull.social.isfriend(params, callback)];
                });
            });
        };
        SdkWegameFull.prototype.friends = function (callback) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, SdkWegameFull.social.friends(callback)];
                });
            });
        };
        SdkWegameFull.prototype.addscore = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, SdkWegameFull.social.addscore(params, callback)];
                });
            });
        };
        SdkWegameFull.prototype.setscore = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, SdkWegameFull.social.setscore(params, callback)];
                });
            });
        };
        SdkWegameFull.prototype.queryuserrank = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, SdkWegameFull.social.queryuserrank(params, callback)];
                });
            });
        };
        SdkWegameFull.prototype.getranklist = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, SdkWegameFull.social.getranklist(params, callback)];
                });
            });
        };
        SdkWegameFull.prototype.friendsrank = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, SdkWegameFull.social.friendsrank(params, callback)];
                });
            });
        };
        SdkWegameFull.prototype.getUserInteractiveStorage = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, SdkWegameFull.social.getUserInteractiveStorage(params, callback)];
                });
            });
        };
        SdkWegameFull.prototype.getGameClubData = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, SdkWegameFull.social.getGameClubData(params, callback)];
                });
            });
        };
        SdkWegameFull.prototype.setUserCloudStorage = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, SdkWegameFull.social.setUserCloudStorage(params, callback)];
                });
            });
        };
        SdkWegameFull.prototype.getUserCloudStorage = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, SdkWegameFull.social.getUserCloudStorage(params, callback)];
                });
            });
        };
        SdkWegameFull.prototype.removeUserCloudStorage = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, SdkWegameFull.social.removeUserCloudStorage(params, callback)];
                });
            });
        };
        SdkWegameFull.prototype.getUserCloudStorageKeys = function (callback) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, SdkWegameFull.social.getUserCloudStorageKeys(callback)];
                });
            });
        };
        SdkWegameFull.prototype.getFriendCloudStorage = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, SdkWegameFull.social.getFriendCloudStorage(params, callback)];
                });
            });
        };
        SdkWegameFull.prototype.getPotentialFriendList = function (callback) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, SdkWegameFull.social.getPotentialFriendList(callback)];
                });
            });
        };
        SdkWegameFull.prototype.getHelpcenterMainLayout = function (callback) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, SdkWegameFull.helpcenter.getHelpcenterMainLayout(callback)];
                });
            });
        };
        SdkWegameFull.prototype.getHelpcenterQuestionLayout = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, SdkWegameFull.helpcenter.getHelpcenterQuestionLayout(params, callback)];
                });
            });
        };
        SdkWegameFull.prototype.getHelpcenterInfoLayout = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, SdkWegameFull.helpcenter.getHelpcenterInfoLayout(params, callback)];
                });
            });
        };
        SdkWegameFull.prototype.helpcenterResolution = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, SdkWegameFull.helpcenter.helpcenterResolution(params, callback)];
                });
            });
        };
        return SdkWegameFull;
    }(SdkWegame));

    return SdkWegameFull;

}));
//# sourceMappingURL=channel-sdk.wegame.full.v2.dev.umd.js.map
