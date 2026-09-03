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

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    function getCjsExportFromNamespace (n) {
    	return n && n['default'] || n;
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

    var ERROR_CODE = 1000000;
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

    var toString$1 = Object.prototype.toString;
    function is(val, type) {
        return toString$1.call(val) === "[object ".concat(type, "]");
    }
    function isString$1(val) {
        return is(val, 'String');
    }
    function isBoolean(val) {
        return is(val, 'Boolean');
    }
    function isFunction$1(val) {
        return typeof val === 'function';
    }
    function isObject$1(val) {
        return val !== null && is(val, 'Object');
    }
    function isArray$1(val) {
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
        if (isArray$1(val) || isString$1(val)) {
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

    var bind = function bind(fn, thisArg) {
      return function wrap() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        return fn.apply(thisArg, args);
      };
    };

    // utils is a library of generic helper functions non-specific to axios

    var toString = Object.prototype.toString;

    /**
     * Determine if a value is an Array
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an Array, otherwise false
     */
    function isArray(val) {
      return toString.call(val) === '[object Array]';
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
      return toString.call(val) === '[object ArrayBuffer]';
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
    function isString(val) {
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
    function isObject(val) {
      return val !== null && typeof val === 'object';
    }

    /**
     * Determine if a value is a plain Object
     *
     * @param {Object} val The value to test
     * @return {boolean} True if value is a plain Object, otherwise false
     */
    function isPlainObject(val) {
      if (toString.call(val) !== '[object Object]') {
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
    function isDate(val) {
      return toString.call(val) === '[object Date]';
    }

    /**
     * Determine if a value is a File
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a File, otherwise false
     */
    function isFile(val) {
      return toString.call(val) === '[object File]';
    }

    /**
     * Determine if a value is a Blob
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Blob, otherwise false
     */
    function isBlob(val) {
      return toString.call(val) === '[object Blob]';
    }

    /**
     * Determine if a value is a Function
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Function, otherwise false
     */
    function isFunction(val) {
      return toString.call(val) === '[object Function]';
    }

    /**
     * Determine if a value is a Stream
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Stream, otherwise false
     */
    function isStream(val) {
      return isObject(val) && isFunction(val.pipe);
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

      if (isArray(obj)) {
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
        if (isPlainObject(result[key]) && isPlainObject(val)) {
          result[key] = merge(result[key], val);
        } else if (isPlainObject(val)) {
          result[key] = merge({}, val);
        } else if (isArray(val)) {
          result[key] = val.slice();
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

    var utils = {
      isArray: isArray,
      isArrayBuffer: isArrayBuffer,
      isBuffer: isBuffer,
      isFormData: isFormData,
      isArrayBufferView: isArrayBufferView,
      isString: isString,
      isNumber: isNumber,
      isObject: isObject,
      isPlainObject: isPlainObject,
      isUndefined: isUndefined,
      isDate: isDate,
      isFile: isFile,
      isBlob: isBlob,
      isFunction: isFunction,
      isStream: isStream,
      isURLSearchParams: isURLSearchParams,
      isStandardBrowserEnv: isStandardBrowserEnv,
      forEach: forEach,
      merge: merge,
      extend: extend,
      trim: trim,
      stripBOM: stripBOM
    };

    function encode(val) {
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
      utils.forEach(this.handlers, function forEachHandler(h) {
        if (h !== null) {
          fn(h);
        }
      });
    };

    var InterceptorManager_1 = InterceptorManager;

    var normalizeHeaderName = function normalizeHeaderName(headers, normalizedName) {
      utils.forEach(headers, function processHeader(value, name) {
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
    var enhanceError = function enhanceError(error, config, code, request, response) {
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
      if (!response.status || !validateStatus || validateStatus(response.status)) {
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

    var cookies = (
      utils.isStandardBrowserEnv() ?

      // Standard browser envs support document.cookie
        (function standardBrowserEnv() {
          return {
            write: function write(name, value, expires, path, domain, secure) {
              var cookie = [];
              cookie.push(name + '=' + encodeURIComponent(value));

              if (utils.isNumber(expires)) {
                cookie.push('expires=' + new Date(expires).toGMTString());
              }

              if (utils.isString(path)) {
                cookie.push('path=' + path);
              }

              if (utils.isString(domain)) {
                cookie.push('domain=' + domain);
              }

              if (secure === true) {
                cookie.push('secure');
              }

              document.cookie = cookie.join('; ');
            },

            read: function read(name) {
              var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
              return (match ? decodeURIComponent(match[3]) : null);
            },

            remove: function remove(name) {
              this.write(name, '', Date.now() - 86400000);
            }
          };
        })() :

      // Non standard browser env (web workers, react-native) lack needed support.
        (function nonStandardBrowserEnv() {
          return {
            write: function write() {},
            read: function read() { return null; },
            remove: function remove() {}
          };
        })()
    );

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

      utils.forEach(headers.split('\n'), function parser(line) {
        i = line.indexOf(':');
        key = utils.trim(line.substr(0, i)).toLowerCase();
        val = utils.trim(line.substr(i + 1));

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

    var isURLSameOrigin = (
      utils.isStandardBrowserEnv() ?

      // Standard browser envs have full support of the APIs needed to test
      // whether the request URL is of the same origin as current location.
        (function standardBrowserEnv() {
          var msie = /(msie|trident)/i.test(navigator.userAgent);
          var urlParsingNode = document.createElement('a');
          var originURL;

          /**
        * Parse a URL to discover it's components
        *
        * @param {String} url The URL to be parsed
        * @returns {Object}
        */
          function resolveURL(url) {
            var href = url;

            if (msie) {
            // IE needs attribute set twice to normalize properties
              urlParsingNode.setAttribute('href', href);
              href = urlParsingNode.href;
            }

            urlParsingNode.setAttribute('href', href);

            // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
            return {
              href: urlParsingNode.href,
              protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
              host: urlParsingNode.host,
              search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
              hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
              hostname: urlParsingNode.hostname,
              port: urlParsingNode.port,
              pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                urlParsingNode.pathname :
                '/' + urlParsingNode.pathname
            };
          }

          originURL = resolveURL(window.location.href);

          /**
        * Determine if a URL shares the same origin as the current location
        *
        * @param {String} requestURL The URL to test
        * @returns {boolean} True if URL shares the same origin, otherwise false
        */
          return function isURLSameOrigin(requestURL) {
            var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
            return (parsed.protocol === originURL.protocol &&
                parsed.host === originURL.host);
          };
        })() :

      // Non standard browser envs (web workers, react-native) lack needed support.
        (function nonStandardBrowserEnv() {
          return function isURLSameOrigin() {
            return true;
          };
        })()
    );

    var xhr = function xhrAdapter(config) {
      return new Promise(function dispatchXhrRequest(resolve, reject) {
        var requestData = config.data;
        var requestHeaders = config.headers;
        var responseType = config.responseType;

        if (utils.isFormData(requestData)) {
          delete requestHeaders['Content-Type']; // Let the browser set it
        }

        var request = new XMLHttpRequest();

        // HTTP basic authentication
        if (config.auth) {
          var username = config.auth.username || '';
          var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
          requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
        }

        var fullPath = buildFullPath(config.baseURL, config.url);
        request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

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

          settle(resolve, reject, response);

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

          reject(createError('Request aborted', config, 'ECONNABORTED', request));

          // Clean up request
          request = null;
        };

        // Handle low level network errors
        request.onerror = function handleError() {
          // Real errors are hidden from us by the browser
          // onerror should only fire if it's a network error
          reject(createError('Network Error', config, null, request));

          // Clean up request
          request = null;
        };

        // Handle timeout
        request.ontimeout = function handleTimeout() {
          var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
          if (config.timeoutErrorMessage) {
            timeoutErrorMessage = config.timeoutErrorMessage;
          }
          reject(createError(
            timeoutErrorMessage,
            config,
            config.transitional && config.transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
            request));

          // Clean up request
          request = null;
        };

        // Add xsrf header
        // This is only done if running in a standard browser environment.
        // Specifically not if we're in a web worker, or react-native.
        if (utils.isStandardBrowserEnv()) {
          // Add xsrf header
          var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
            cookies.read(config.xsrfCookieName) :
            undefined;

          if (xsrfValue) {
            requestHeaders[config.xsrfHeaderName] = xsrfValue;
          }
        }

        // Add headers to the request
        if ('setRequestHeader' in request) {
          utils.forEach(requestHeaders, function setRequestHeader(val, key) {
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
        if (!utils.isUndefined(config.withCredentials)) {
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
      if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
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
      if (utils.isString(rawValue)) {
        try {
          (parser || JSON.parse)(rawValue);
          return utils.trim(rawValue);
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

        if (utils.isFormData(data) ||
          utils.isArrayBuffer(data) ||
          utils.isBuffer(data) ||
          utils.isStream(data) ||
          utils.isFile(data) ||
          utils.isBlob(data)
        ) {
          return data;
        }
        if (utils.isArrayBufferView(data)) {
          return data.buffer;
        }
        if (utils.isURLSearchParams(data)) {
          setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
          return data.toString();
        }
        if (utils.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {
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

        if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
          try {
            return JSON.parse(data);
          } catch (e) {
            if (strictJSONParsing) {
              if (e.name === 'SyntaxError') {
                throw enhanceError(e, this, 'E_JSON_PARSE');
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

    utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
      defaults.headers[method] = {};
    });

    utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
      defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
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
      utils.forEach(fns, function transform(fn) {
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
      config.headers = utils.merge(
        config.headers.common || {},
        config.headers[config.method] || {},
        config.headers
      );

      utils.forEach(
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
        if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
          return utils.merge(target, source);
        } else if (utils.isPlainObject(source)) {
          return utils.merge({}, source);
        } else if (utils.isArray(source)) {
          return source.slice();
        }
        return source;
      }

      function mergeDeepProperties(prop) {
        if (!utils.isUndefined(config2[prop])) {
          config[prop] = getMergedValue(config1[prop], config2[prop]);
        } else if (!utils.isUndefined(config1[prop])) {
          config[prop] = getMergedValue(undefined, config1[prop]);
        }
      }

      utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
        if (!utils.isUndefined(config2[prop])) {
          config[prop] = getMergedValue(undefined, config2[prop]);
        }
      });

      utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

      utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
        if (!utils.isUndefined(config2[prop])) {
          config[prop] = getMergedValue(undefined, config2[prop]);
        } else if (!utils.isUndefined(config1[prop])) {
          config[prop] = getMergedValue(undefined, config1[prop]);
        }
      });

      utils.forEach(directMergeKeys, function merge(prop) {
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

      utils.forEach(otherKeys, mergeDeepProperties);

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
      return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
    };

    // Provide aliases for supported request methods
    utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
      /*eslint func-names:0*/
      Axios.prototype[method] = function(url, config) {
        return this.request(mergeConfig(config || {}, {
          method: method,
          url: url,
          data: (config || {}).data
        }));
      };
    });

    utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
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
      var instance = bind(Axios_1.prototype.request, context);

      // Copy axios.prototype to instance
      utils.extend(instance, Axios_1.prototype, context);

      // Copy context to instance
      utils.extend(instance, context);

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

    // 接口白名单：初始化未成功之前能走请求的接口
    var apiWhiteList = ['/v1/sdkconfig/init', '/v1/vcapi/update', '/v1/vcapi/update_module_version', '/v1/data/api/track'];
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
            _a['ruixue-language'] = SYSTEM_INFO$1.language || 'zh-CN',
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
            Reflect.set(headers, 'ruixue-accesstoken', rxToken === null || rxToken === void 0 ? void 0 : rxToken.access);
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
            headers['Content-Type'] = 'text/plan';
        }
        if (SYSTEM_INFO$1.region_tag) {
            headers['ruixue-region'] = "".concat(SYSTEM_INFO$1.region_tag);
        }
        if (SYSTEM_INFO$1.cp_role_id) {
            headers['ruixue-cp-role-id'] = "".concat(SYSTEM_INFO$1.cp_role_id);
        }
        if (SYSTEM_INFO$1.third_channel_code) {
            headers['ruixue-third-channel'] = "".concat(SYSTEM_INFO$1.third_channel_code);
        }
        return headers;
    };
    var requestAxios = axios.create(__assign({ timeout: 60000, responseType: 'json', withCredentials: false }, ({})));
    var retryRequest = function (options, resolve, reject) {
        var headers = removeKeyFromObject(options.headers);
        printLog("".concat(options.url));
        printLog("options", options);
        requestAxios({
            url: options.url,
            method: options.method,
            headers: headers,
            params: options.params,
            data: options.data
        }).then(function (res) {
            printLog("".concat(options.url));
            printLog("res", res.data);
            resolve(res.data);
        }).catch(function (err) {
            printLog("".concat(options.url));
            printLog("err", JSON.stringify(err));
            reject(err);
        });
    };
    var myRequest = function (options) {
        var devicecode = getDevicecode();
        var key = generateMD5(devicecode + cpkey);
        printLog("".concat(options.url));
        printLog("options", options);
        return new Promise(function (resolve, reject) {
            var data = options.data;
            var isAes = checkNeedAesEncrypt(options.url);
            try {
                data = (isAes && options.method.toLowerCase() != 'get') ? aesEncryptBase64String(options.data, key) : options.data;
                if (isAes && options.method.toLowerCase() != 'get') {
                    printLog('Encrypt Data:', data);
                    printLog('Self Encrypt Data:', aesDecryptBase64String(data, key));
                }
            }
            catch (e) {
                // @ts-ignore
                trackEncrypt(options, "h5_qunhei", key);
                retryRequest(options, resolve, reject);
                return;
            }
            requestAxios({
                url: options.url,
                method: options.method,
                headers: options.headers,
                params: options.params,
                data: data
            }).then(function (res) {
                var _a, _b, _c, _d;
                if (res.status == 500) {
                    return Promise.reject({
                        code: COMMON_ERROR_CODE.INTERNAL_SERVER_ERROR,
                        msg: res.statusText
                    });
                }
                else if ([302015, 302016].includes((_a = res.data) === null || _a === void 0 ? void 0 : _a.code)) {
                    printLog('request 解密失败', options.url, (_b = res.data) === null || _b === void 0 ? void 0 : _b.code);
                    // @ts-ignore
                    trackDecrypt(options, res, "h5_qunhei", key);
                    retryRequest(options, resolve, reject);
                }
                else {
                    var data_1 = (_c = res.data) === null || _c === void 0 ? void 0 : _c.data;
                    if (isAes && data_1) {
                        try {
                            if (((_d = res.data) === null || _d === void 0 ? void 0 : _d.code) === 0) {
                                data_1 = aesDecryptBase64String(data_1, key);
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
                            // @ts-ignore
                            trackDecrypt(options, res, "h5_qunhei", key);
                            retryRequest(options, resolve, reject);
                        }
                    }
                    else {
                        printLog("".concat(options.url));
                        printLog("res", res.data);
                        resolve(res.data);
                    }
                }
            }).catch(function (err) {
                reject(err);
            });
        });
    };
    function isHttpOrHttps(url) {
        return /^(http:\/\/|https:\/\/)/.test(url);
    }
    function doRequest(options, urlIndex, refreshNum) {
        if (urlIndex === void 0) { urlIndex = 0; }
        if (refreshNum === void 0) { refreshNum = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var error, path, headers, url, res, msg, error, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        SYSTEM_INFO$1.reqUrlIndex = urlIndex;
                        if (!apiWhiteList.find(function (item) { return options.url.startsWith(item); }) && !SYSTEM_INFO$1.SDK_INIT_FINISHED) {
                            console.info('sdk doRequest options: ', options);
                            error = new Error('初始化错误，或未初始化');
                            error.code = COMMON_ERROR_CODE.INIT_PARAMS_ERROR;
                            return [2 /*return*/, Promise.reject(error)];
                        }
                        path = options.url;
                        headers = getHeaders(path);
                        url = isHttpOrHttps(path) ? path : SYSTEM_INFO$1.baseUrlList[urlIndex] + path;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, myRequest(__assign(__assign({}, options), { url: url, headers: headers }))];
                    case 2:
                        res = _a.sent();
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
                                return [2 /*return*/, refreshTokenReq().then(function (refreshRes) {
                                        customSetStorageSync('rxToken', refreshRes.data);
                                        return doRequest(options, urlIndex, refreshNum);
                                    })];
                            }
                        }
                        else {
                            msg = res.msg || res.message || res.errorMsg || 'Error';
                            error = new Error(msg);
                            error.code = res.code || COMMON_ERROR_CODE.UNKNOW_NETWORK_ERROR;
                            error.data = res.data || res;
                            error.thirdcode = res.thirdcode;
                            error.thirdmsg = res.thirdmsg;
                            error.isServerError = true;
                            error.url = url;
                            error.request_header = headers;
                            error.request_body = options.data || options.params;
                            return [2 /*return*/, Promise.reject(error)];
                        }
                    case 3:
                        error_1 = _a.sent();
                        if (urlIndex < SYSTEM_INFO$1.baseUrlList.length - 1) {
                            urlIndex++;
                            return [2 /*return*/, doRequest(options, urlIndex, refreshNum)];
                        }
                        if (error_1.message == 'Network Error') {
                            return [2 /*return*/, Promise.reject({
                                    code: COMMON_ERROR_CODE.NETWORK_ERROR,
                                    msg: error_1.message
                                })];
                        }
                        if (error_1.message == 'timeout') {
                            return [2 /*return*/, Promise.reject({
                                    code: COMMON_ERROR_CODE.TIMEOUT,
                                    msg: error_1.message
                                })];
                        }
                        if (error_1.message == 'Request aborted') {
                            return [2 /*return*/, Promise.reject({
                                    code: COMMON_ERROR_CODE.REQUEST_ABORTED,
                                    msg: error_1.message
                                })];
                        }
                        return [2 /*return*/, Promise.reject(__assign({ url: url, request_header: headers, request_body: options.data || options.params, code: error_1.code || COMMON_ERROR_CODE.UNKNOW_NETWORK_ERROR, msg: error_1.msg || error_1.message || error_1.errMsg || 'Error', thirdcode: error_1.code || COMMON_ERROR_CODE.UNKNOW_NETWORK_ERROR, thirdmsg: error_1.msg || error_1.message || error_1.errMsg || 'Error' }, error_1))];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }

    var request;
    switch ("h5_qunhei") {
        default:
            request = doRequest;
    }
    function createFeedbackApi(data) {
        return request({
            url: '/v1/feedbackapi/player_feedback/create',
            method: 'POST',
            data: data
        });
    }
    function getFeedbackListApi(params) {
        return request({
            url: '/v1/feedbackapi/player_feedback/list',
            method: 'GET',
            params: params
        });
    }
    function getFeedbackDetailApi(params) {
        return request({
            url: '/v1/feedbackapi/player_feedback/detail',
            method: 'GET',
            params: params
        });
    }
    function collectPropsApi(data) {
        return request({
            url: '/v1/feedbackapi/player_feedback/getprop',
            method: 'PUT',
            data: data
        });
    }
    function getNoticeApi(params) {
        return request({
            url: '/v1/operationtoolsapi/maintain/get',
            method: 'GET',
            params: params
        });
    }
    function getPromoterCodeApi(game_id) {
        return request({
            url: '/v1/operationtoolsapi/exchange/game_display',
            method: 'GET',
            params: { game_id: game_id }
        });
    }
    function exchangePromoterCodeApi(cdkey) {
        return request({
            url: '/v1/operationtoolsapi/exchange/exchange',
            method: 'POST',
            data: { cdkey: cdkey }
        });
    }
    function loginByCredentialApi(data) {
        return request({
            url: '/v1/passport/account/login_by_credential',
            method: 'POST',
            data: data
        });
    }
    function loginByTokenApi(data) {
        return request({
            url: '/v1/passport/account/login_by_token',
            method: 'POST',
            data: data
        });
    }
    function getShareDataApi(data) {
        return request({
            url: '/v1/operationapi/share/data',
            method: 'POST',
            data: data
        });
    }
    function getAdShareDataApi(data) {
        return request({
            url: '/v1/operationapi/ad/data',
            method: 'POST',
            data: data
        });
    }
    function orderApi(data) {
        return request({
            url: '/v1/ke/order',
            method: 'POST',
            data: data
        });
    }
    //发送验证码
    var sendCaptcha = function (data) {
        return request({
            url: '/v1/passport/sms/send_captcha',
            method: 'POST',
            data: data
        });
    };
    //绑定手机
    var bindPhone = function (data) {
        return request({
            url: '/v1/passport/user/bind_phone',
            method: 'POST',
            data: data
        });
    };
    //解绑手机
    var unBindPhone = function (data) {
        return request({
            url: '/v1/passport/user/unbind_phone',
            method: 'POST',
            data: data
        });
    };
    //换绑手机
    var changePhone = function (data) {
        return request({
            url: '/v1/passport/user/change_phone',
            method: 'POST',
            data: data
        });
    };
    //换绑邮箱
    var changeEmail = function (data) {
        return request({
            url: '/v1/passport/user/change_email',
            method: 'POST',
            data: data
        });
    };
    //绑定邮箱
    var bindEmail = function (data) {
        return request({
            url: '/v1/passport/user/bind_email',
            method: 'POST',
            data: data
        });
    };
    //解绑邮箱
    var UnbindEmail = function (data) {
        return request({
            url: '/v1/passport/user/unbind_email',
            method: 'POST',
            data: data
        });
    };
    //申请注销
    function deregister(data) {
        return request({
            url: '/v1/passport/user/deregister',
            method: 'POST',
            data: data
        });
    }
    //取消注销
    function deregisterCancel() {
        return request({
            url: '/v1/passport/user/cancel_deregister',
            method: 'POST',
            data: {}
        });
    }
    //修改用户信息
    function updateInfoApi(data) {
        return request({
            url: '/v1/passport/user/update_info',
            method: 'POST',
            data: data
        });
    }
    //上报大数据
    var trackApi = function (data) {
        return request({
            method: 'POST',
            url: '/v1/data/api/track',
            data: data
        });
    };
    var getInfoApi = function () {
        return request({
            method: 'POST',
            url: '/v1/passport/user/get_info',
            data: {}
        });
    };
    var getUserInfoByFieldApi = function (data) {
        if (data === void 0) { data = {}; }
        return request({
            method: 'POST',
            url: '/v1/passport/user/info_by_field',
            data: data
        });
    };
    var activated = function (data) {
        return request({
            method: 'POST',
            url: '/v1/attribution/user/activated',
            data: data
        });
    };
    // 获取商业化弹窗信息
    var getBusinessRules = function (version) {
        return request({
            url: '/v1/business/rule',
            method: 'GET',
            params: {
                version: version
            }
        });
    };
    // 商业化下单
    var businessOrderApi = function (data) {
        return request({
            method: 'POST',
            url: '/v1/business/p',
            data: data
        });
    };
    //产品包版本检查
    var checkVersionGameLobbyByGet = function (data) {
        return request({
            url: "/v1/vcapi/update/".concat(data.productid, "/").concat(data.channelid, "/").concat(data.clientversion, "/").concat(data.devicecode, "/").concat(data.region),
            method: 'GET',
            params: {
                type: data.type,
                format: data.format
            }
        });
    };
    //产品包版本检查
    var checkVersionGameLobbyByPost = function (data) {
        return request({
            url: "/v1/vcapi/update/".concat(data.productid, "/").concat(data.channelid, "/").concat(data.clientversion, "/").concat(data.devicecode, "/").concat(data.region, "?type=").concat(data.type || '', "&format=").concat(data.format || ''),
            method: 'POST',
            data: {
                games: data.games,
                activities: data.activities
            }
        });
    };
    //游戏版本检查
    var checkGameVersion = function (data) {
        return request({
            url: "/v1/vcapi/update_game/".concat(data.gameid, "/").concat(data.gameversion, "/").concat(data.gamecheckversion),
            method: 'GET',
            data: {
                type: data.type,
                format: data.format
            }
        });
    };
    //活动版本检查
    var checkActivityVersion = function (data) {
        return request({
            url: "/v1/vcapi/update_activity/".concat(data.activityshortname, "/").concat(data.activityversion, "/").concat(data.activitycheckversion),
            method: 'GET',
            data: {
                type: data.type,
                format: data.format
            }
        });
    };
    //分享/广告结果上报
    var schedulingReportApi = function (data) {
        return request({
            url: '/v1/operationapi/scheduling_report',
            method: 'POST',
            data: data
        });
    };
    //分享调度初始化
    var schedulingInitApi = function (data) {
        return request({
            url: '/v1/operationapi/scheduling/init',
            method: 'POST',
            data: data
        });
    };
    // 获取公共属性
    var getInitConf = function (data) {
        return request({
            url: '/v1/sdkconfig/init',
            method: 'POST',
            data: data
        });
    };
    // 获取服务器时间（用于刷新 st_offset）
    var getServerTime = function (data) {
        return request({
            url: '/v1/sdkconfig/detection',
            method: 'POST',
            data: data || {}
        });
    };
    // 获取公共属性
    var getPublicProps = function (version) {
        return request({
            url: '/v1/sdkconfig/sync/event_attrs',
            method: 'GET',
            params: {
                version: version
            }
        });
    };
    var setcustomApi = function (data) {
        return request({
            url: '/v1/social/user/setcustom',
            method: 'POST',
            data: data
        });
    };
    var addRelationApi = function (data) {
        return request({
            url: '/v1/social/relation/add',
            method: 'POST',
            data: data
        });
    };
    var deleteRelationApi = function (data) {
        return request({
            url: '/v1/social/relation/delete',
            method: 'POST',
            data: data
        });
    };
    var updateremarksApi = function (data) {
        return request({
            url: '/v1/social/relation/updateremarks',
            method: 'POST',
            data: data
        });
    };
    var hasrelationApi = function (data) {
        return request({
            url: '/v1/social/relation/hasrelation',
            method: 'POST',
            data: data
        });
    };
    var relationListApi = function (data) {
        return request({
            url: '/v1/social/relation/list',
            method: 'POST',
            data: data
        });
    };
    var addfriendApi = function (data) {
        return request({
            url: '/v1/social/relation/addfriend',
            method: 'POST',
            data: data
        });
    };
    var delfriendApi = function (data) {
        return request({
            url: '/v1/social/relation/delfriend',
            method: 'POST',
            data: data
        });
    };
    var updatefriendremarksApi = function (data) {
        return request({
            url: '/v1/social/relation/updatefriendremarks',
            method: 'POST',
            data: data
        });
    };
    var isfriendApi = function (data) {
        return request({
            url: '/v1/social/relation/isfriend',
            method: 'POST',
            data: data
        });
    };
    var friendsApi = function () {
        return request({
            url: '/v1/social/relation/friends',
            method: 'POST'
        });
    };
    var addscoreApi = function (data) {
        return request({
            url: '/v1/social/rank/addscore',
            method: 'POST',
            data: data
        });
    };
    var setscoreApi = function (data) {
        return request({
            url: '/v1/social/rank/setscore',
            method: 'POST',
            data: data
        });
    };
    var queryuserrankApi = function (data) {
        return request({
            url: '/v1/social/rank/queryuserrank',
            method: 'POST',
            data: data
        });
    };
    var getranklistApi = function (data) {
        return request({
            url: '/v1/social/rank/getranklist',
            method: 'POST',
            data: data
        });
    };
    var friendsrankApi = function (data) {
        return request({
            url: '/v1/social/rank/friendsrank',
            method: 'POST',
            data: data
        });
    };
    // 获取帮助中心首页信息
    var getMainlayoutApi = function () {
        return request({
            url: '/v1/service/helpcenter/mainlayout',
            method: 'GET'
        });
    };
    // 获取帮助中心问题一级列表页
    var getListlayoutApi = function (params) {
        return request({
            url: '/v1/service/helpcenter/listlayout',
            method: 'GET',
            params: params
        });
    };
    // 获取帮助中心问题详情
    var getInfolayoutApi = function (params) {
        return request({
            url: '/v1/service/helpcenter/infolayout',
            method: 'GET',
            params: params
        });
    };
    // 设置帮助中心问题解决状态
    var postResolutionApi = function (data) {
        return request({
            url: '/v1/service/helpcenter/resolution',
            method: 'POST',
            data: data
        });
    };
    // 获取窗口运营全部配置数据
    function getOperationSceneApi() {
        return request({
            url: '/v1/operationtoolsapi/user_data_operation_platform/scene/all',
            method: 'POST',
            data: {}
        });
    }
    // 游戏区服信息查询
    function getGameAreaApi(area_id) {
        return request({
            url: '/v1/report/sdk/cp/game_area',
            method: 'GET',
            params: {
                area_id: area_id
            }
        });
    }
    // 游戏区服信息修改
    function putGameAreaApi(data) {
        return request({
            url: '/v1/report/sdk/cp/game_area',
            method: 'PUT',
            data: data
        });
    }
    // 创建游戏区服
    function createGameAreaApi(data) {
        return request({
            url: '/v1/report/sdk/cp/game_area',
            method: 'POST',
            data: data
        });
    }
    // 删除游戏区服
    function delGameAreaApi(data) {
        return request({
            url: '/v1/report/sdk/cp/game_area',
            method: 'DELETE',
            data: data
        });
    }
    // 查询区服列表信息
    function getGameAreaListApi() {
        return request({
            url: '/v1/report/sdk/cp/game_area/list',
            method: 'GET'
        });
    }
    // 创建角色
    function createGameCharacterApi(data) {
        return request({
            url: '/v1/report/sdk/cp/game_character',
            method: 'POST',
            data: data
        });
    }
    // 修改游戏角色信息
    function putGameCharacterApi(data) {
        return request({
            url: '/v1/report/sdk/cp/game_character',
            method: 'PUT',
            data: data
        });
    }
    // 删除游戏角色
    function delGameCharacterApi(data) {
        return request({
            url: '/v1/report/sdk/cp/game_character',
            method: 'DELETE',
            data: data
        });
    }
    // 查询账号下角色信息列表
    function getGameCharacterAccountApi(params) {
        return request({
            url: '/v1/report/sdk/cp/game_character/account',
            method: 'GET',
            params: params
        });
    }
    // 查询账号下某个区服下的角色信息列表
    function getGameCharacterApi(params) {
        return request({
            url: '/v1/report/sdk/cp/game_character/account/area',
            method: 'GET',
            params: params
        });
    }
    // 查询具体角色信息
    function getGameAccountAreaCharacterApi(params) {
        return request({
            url: '/v1/report/sdk/cp/game_character/account/area/character',
            method: 'GET',
            params: params
        });
    }
    // 兑换道具
    function itemRedemptionApi(data) {
        return request({
            url: '/v1/operationtoolsapi/user_data_operation_platform/item_redemption',
            method: 'POST',
            data: data
        });
    }
    // 邮件列表
    function getEmailListApi(data) {
        return request({
            url: '/v1/operationtoolsapi/rxmail/cpuser/list',
            method: 'POST',
            data: data
        });
    }
    // 邮件详情
    function getEmailDetailApi(data) {
        return request({
            url: '/v1/operationtoolsapi/rxmail/cpuser/detail',
            method: 'POST',
            data: data
        });
    }
    // 邮件领取
    function receiveEmailApi(data) {
        return request({
            url: '/v1/operationtoolsapi/rxmail/cpuser/receive',
            method: 'POST',
            data: data
        });
    }
    // 邮件删除
    function delEmailApi(data) {
        return request({
            url: '/v1/operationtoolsapi/rxmail/cpuser/delete',
            method: 'POST',
            data: data
        });
    }
    //新版通用版本检查 v2
    var updateGameVersionApi = function (data) {
        return request({
            url: "/v1/vcapi/update_module_version",
            method: 'POST',
            data: data,
        });
    };
    function searchGameAccountApi() {
        return request({
            url: '/v1/report/sdk/cp_role',
            method: 'get'
        });
    }
    var getTempNoticeApi = function (product_id, channel_id) {
        return request({
            url: "/v1/vcapi/maintain/".concat(product_id, "/").concat(channel_id),
            method: 'GET'
        });
    };
    var getH5LoginConfigApi = function (product_id, channel_id) {
        return request({
            url: "/v1/vcapi/h5_login_config/".concat(product_id, "/").concat(channel_id),
            method: 'GET'
        });
    };
    var tradeQueryApi = function (order_no) {
        return request({
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

    // @ts-ignore
    function cryptoJS() {

      /*globals window, global, require*/

      /**
       * CryptoJS core components.
       */
      var CryptoJS = CryptoJS || (function (Math, undefined$1) {

        /*try {
          // Native crypto from window (Browser)
          if (typeof window !== 'undefined' && window.crypto) {
            try {
              crypto = window.crypto;
            } catch (err) {
            }
          }

          // Native crypto in web worker (Browser)
          if (typeof self !== 'undefined' && self.crypto) {
            try {
              crypto = self.crypto;
            } catch (err) {
            }
          }

          // Native crypto from worker
          if (typeof globalThis !== 'undefined' && globalThis.crypto) {
            try {
              crypto = globalThis.crypto;
            } catch (err) {
            }
          }

          // Native (experimental IE 11) crypto from window (Browser)
          if (!crypto && typeof window !== 'undefined' && window.msCrypto) {
            try {
              crypto = window.msCrypto;
            } catch (err) {
            }
          }

          // Native crypto from global (NodeJS)
          if (!crypto && typeof global !== 'undefined' && global.crypto) {
            try {
              crypto = global.crypto;
            } catch (err) {
            }
          }

          // Native crypto import via require (NodeJS)
          if (!crypto && typeof require === 'function') {
            try {
              crypto = require('crypto');
            } catch (err) {
            }
          }
        } catch (e) {

        }*/

        /*
    	     * Cryptographically secure pseudorandom number generator
    	     *
    	     * As Math.random() is cryptographically not safe to use
    	     */
        var cryptoSecureRandomInt = function () {

          throw new Error('Native crypto module could not be used to get secure random number.');
        };

        /*
    	     * Local polyfill of Object.create

    	     */
        var create = Object.create || (function () {
          function F() {
          }

          return function (obj) {
            var subtype;

            F.prototype = obj;

            subtype = new F();

            F.prototype = null;

            return subtype;
          };
        }());

        /**
         * CryptoJS namespace.
         */
        var C = {};

        /**
         * Library namespace.
         */
        var C_lib = C.lib = {};

        /**
         * Base object for prototypal inheritance.
         */
        var Base = C_lib.Base = (function () {


          return {
            /**
             * Creates a new object that inherits from this object.
             *
             * @param {Object} overrides Properties to copy into the new object.
             *
             * @return {Object} The new object.
             *
             * @static
             *
             * @example
             *
             *     var MyType = CryptoJS.lib.Base.extend({
             *         field: 'value',
             *
             *         method: function () {
             *         }
             *     });
             */
            extend: function (overrides) {
              // Spawn
              var subtype = create(this);

              // Augment
              if (overrides) {
                subtype.mixIn(overrides);
              }

              // Create default initializer
              if (!subtype.hasOwnProperty('init') || this.init === subtype.init) {
                subtype.init = function () {
                  subtype.$super.init.apply(this, arguments);
                };
              }

              // Initializer's prototype is the subtype object
              subtype.init.prototype = subtype;

              // Reference supertype
              subtype.$super = this;

              return subtype;
            },

            /**
             * Extends this object and runs the init method.
             * Arguments to create() will be passed to init().
             *
             * @return {Object} The new object.
             *
             * @static
             *
             * @example
             *
             *     var instance = MyType.create();
             */
            create: function () {
              var instance = this.extend();
              instance.init.apply(instance, arguments);

              return instance;
            },

            /**
             * Initializes a newly created object.
             * Override this method to add some logic when your objects are created.
             *
             * @example
             *
             *     var MyType = CryptoJS.lib.Base.extend({
             *         init: function () {
             *             // ...
             *         }
             *     });
             */
            init: function () {
            },

            /**
             * Copies properties into this object.
             *
             * @param {Object} properties The properties to mix in.
             *
             * @example
             *
             *     MyType.mixIn({
             *         field: 'value'
             *     });
             */
            mixIn: function (properties) {
              for (var propertyName in properties) {
                if (properties.hasOwnProperty(propertyName)) {
                  this[propertyName] = properties[propertyName];
                }
              }

              // IE won't copy toString using the loop above
              if (properties.hasOwnProperty('toString')) {
                this.toString = properties.toString;
              }
            },

            /**
             * Creates a copy of this object.
             *
             * @return {Object} The clone.
             *
             * @example
             *
             *     var clone = instance.clone();
             */
            clone: function () {
              return this.init.prototype.extend(this);
            }
          };
        }());

        /**
         * An array of 32-bit words.
         *
         * @property {Array} words The array of 32-bit words.
         * @property {number} sigBytes The number of significant bytes in this word array.
         */
        var WordArray = C_lib.WordArray = Base.extend({
          /**
           * Initializes a newly created word array.
           *
           * @param {Array} words (Optional) An array of 32-bit words.
           * @param {number} sigBytes (Optional) The number of significant bytes in the words.
           *
           * @example
           *
           *     var wordArray = CryptoJS.lib.WordArray.create();
           *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
           *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
           */
          init: function (words, sigBytes) {
            words = this.words = words || [];

            if (sigBytes != undefined$1) {
              this.sigBytes = sigBytes;
            } else {
              this.sigBytes = words.length * 4;
            }
          },

          /**
           * Converts this word array to a string.
           *
           * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
           *
           * @return {string} The stringified word array.
           *
           * @example
           *
           *     var string = wordArray + '';
           *     var string = wordArray.toString();
           *     var string = wordArray.toString(CryptoJS.enc.Utf8);
           */
          toString: function (encoder) {
            return (encoder || Hex).stringify(this);
          },

          /**
           * Concatenates a word array to this word array.
           *
           * @param {WordArray} wordArray The word array to append.
           *
           * @return {WordArray} This word array.
           *
           * @example
           *
           *     wordArray1.concat(wordArray2);
           */
          concat: function (wordArray) {
            // Shortcuts
            var thisWords = this.words;
            var thatWords = wordArray.words;
            var thisSigBytes = this.sigBytes;
            var thatSigBytes = wordArray.sigBytes;

            // Clamp excess bits
            this.clamp();

            // Concat
            if (thisSigBytes % 4) {
              // Copy one byte at a time
              for (var i = 0; i < thatSigBytes; i++) {
                var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
              }
            } else {
              // Copy one word at a time
              for (var j = 0; j < thatSigBytes; j += 4) {
                thisWords[(thisSigBytes + j) >>> 2] = thatWords[j >>> 2];
              }
            }
            this.sigBytes += thatSigBytes;

            // Chainable
            return this;
          },

          /**
           * Removes insignificant bits.
           *
           * @example
           *
           *     wordArray.clamp();
           */
          clamp: function () {
            // Shortcuts
            var words = this.words;
            var sigBytes = this.sigBytes;

            // Clamp
            words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
            words.length = Math.ceil(sigBytes / 4);
          },

          /**
           * Creates a copy of this word array.
           *
           * @return {WordArray} The clone.
           *
           * @example
           *
           *     var clone = wordArray.clone();
           */
          clone: function () {
            var clone = Base.clone.call(this);
            clone.words = this.words.slice(0);

            return clone;
          },

          /**
           * Creates a word array filled with random bytes.
           *
           * @param {number} nBytes The number of random bytes to generate.
           *
           * @return {WordArray} The random word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.lib.WordArray.random(16);
           */
          random: function (nBytes) {
            var words = [];

            for (var i = 0; i < nBytes; i += 4) {
              words.push(cryptoSecureRandomInt());
            }

            return new WordArray.init(words, nBytes);
          }
        });

        /**
         * Encoder namespace.
         */
        var C_enc = C.enc = {};

        /**
         * Hex encoding strategy.
         */
        var Hex = C_enc.Hex = {
          /**
           * Converts a word array to a hex string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The hex string.
           *
           * @static
           *
           * @example
           *
           *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
           */
          stringify: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;

            // Convert
            var hexChars = [];
            for (var i = 0; i < sigBytes; i++) {
              var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
              hexChars.push((bite >>> 4).toString(16));
              hexChars.push((bite & 0x0f).toString(16));
            }

            return hexChars.join('');
          },

          /**
           * Converts a hex string to a word array.
           *
           * @param {string} hexStr The hex string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
           */
          parse: function (hexStr) {
            // Shortcut
            var hexStrLength = hexStr.length;

            // Convert
            var words = [];
            for (var i = 0; i < hexStrLength; i += 2) {
              words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
            }

            return new WordArray.init(words, hexStrLength / 2);
          }
        };

        /**
         * Latin1 encoding strategy.
         */
        var Latin1 = C_enc.Latin1 = {
          /**
           * Converts a word array to a Latin1 string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The Latin1 string.
           *
           * @static
           *
           * @example
           *
           *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
           */
          stringify: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;

            // Convert
            var latin1Chars = [];
            for (var i = 0; i < sigBytes; i++) {
              var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
              latin1Chars.push(String.fromCharCode(bite));
            }

            return latin1Chars.join('');
          },

          /**
           * Converts a Latin1 string to a word array.
           *
           * @param {string} latin1Str The Latin1 string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
           */
          parse: function (latin1Str) {
            // Shortcut
            var latin1StrLength = latin1Str.length;

            // Convert
            var words = [];
            for (var i = 0; i < latin1StrLength; i++) {
              words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
            }

            return new WordArray.init(words, latin1StrLength);
          }
        };

        /**
         * UTF-8 encoding strategy.
         */
        var Utf8 = C_enc.Utf8 = {
          /**
           * Converts a word array to a UTF-8 string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The UTF-8 string.
           *
           * @static
           *
           * @example
           *
           *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
           */
          stringify: function (wordArray) {
            try {
              return decodeURIComponent(escape(Latin1.stringify(wordArray)));
            } catch (e) {
              throw new Error('Malformed UTF-8 data');
            }
          },

          /**
           * Converts a UTF-8 string to a word array.
           *
           * @param {string} utf8Str The UTF-8 string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
           */
          parse: function (utf8Str) {
            return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
          }
        };

        /**
         * Abstract buffered block algorithm template.
         *
         * The property blockSize must be implemented in a concrete subtype.
         *
         * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
         */
        var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
          /**
           * Resets this block algorithm's data buffer to its initial state.
           *
           * @example
           *
           *     bufferedBlockAlgorithm.reset();
           */
          reset: function () {
            // Initial values
            this._data = new WordArray.init();
            this._nDataBytes = 0;
          },

          /**
           * Adds new data to this block algorithm's buffer.
           *
           * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
           *
           * @example
           *
           *     bufferedBlockAlgorithm._append('data');
           *     bufferedBlockAlgorithm._append(wordArray);
           */
          _append: function (data) {
            // Convert string to WordArray, else assume WordArray already
            if (typeof data == 'string') {
              data = Utf8.parse(data);
            }

            // Append
            this._data.concat(data);
            this._nDataBytes += data.sigBytes;
          },

          /**
           * Processes available data blocks.
           *
           * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
           *
           * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
           *
           * @return {WordArray} The processed data.
           *
           * @example
           *
           *     var processedData = bufferedBlockAlgorithm._process();
           *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
           */
          _process: function (doFlush) {
            var processedWords;

            // Shortcuts
            var data = this._data;
            var dataWords = data.words;
            var dataSigBytes = data.sigBytes;
            var blockSize = this.blockSize;
            var blockSizeBytes = blockSize * 4;

            // Count blocks ready
            var nBlocksReady = dataSigBytes / blockSizeBytes;
            if (doFlush) {
              // Round up to include partial blocks
              nBlocksReady = Math.ceil(nBlocksReady);
            } else {
              // Round down to include only full blocks,
              // less the number of blocks that must remain in the buffer
              nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
            }

            // Count words ready
            var nWordsReady = nBlocksReady * blockSize;

            // Count bytes ready
            var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

            // Process blocks
            if (nWordsReady) {
              for (var offset = 0; offset < nWordsReady; offset += blockSize) {
                // Perform concrete-algorithm logic
                this._doProcessBlock(dataWords, offset);
              }

              // Remove processed words
              processedWords = dataWords.splice(0, nWordsReady);
              data.sigBytes -= nBytesReady;
            }

            // Return processed words
            return new WordArray.init(processedWords, nBytesReady);
          },

          /**
           * Creates a copy of this object.
           *
           * @return {Object} The clone.
           *
           * @example
           *
           *     var clone = bufferedBlockAlgorithm.clone();
           */
          clone: function () {
            var clone = Base.clone.call(this);
            clone._data = this._data.clone();

            return clone;
          },

          _minBufferSize: 0
        });

        /**
         * Abstract hasher template.
         *
         * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
         */
        C_lib.Hasher = BufferedBlockAlgorithm.extend({
          /**
           * Configuration options.
           */
          cfg: Base.extend(),

          /**
           * Initializes a newly created hasher.
           *
           * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
           *
           * @example
           *
           *     var hasher = CryptoJS.algo.SHA256.create();
           */
          init: function (cfg) {
            // Apply config defaults
            this.cfg = this.cfg.extend(cfg);

            // Set initial values
            this.reset();
          },

          /**
           * Resets this hasher to its initial state.
           *
           * @example
           *
           *     hasher.reset();
           */
          reset: function () {
            // Reset data buffer
            BufferedBlockAlgorithm.reset.call(this);

            // Perform concrete-hasher logic
            this._doReset();
          },

          /**
           * Updates this hasher with a message.
           *
           * @param {WordArray|string} messageUpdate The message to append.
           *
           * @return {Hasher} This hasher.
           *
           * @example
           *
           *     hasher.update('message');
           *     hasher.update(wordArray);
           */
          update: function (messageUpdate) {
            // Append
            this._append(messageUpdate);

            // Update the hash
            this._process();

            // Chainable
            return this;
          },

          /**
           * Finalizes the hash computation.
           * Note that the finalize operation is effectively a destructive, read-once operation.
           *
           * @param {WordArray|string} messageUpdate (Optional) A final message update.
           *
           * @return {WordArray} The hash.
           *
           * @example
           *
           *     var hash = hasher.finalize();
           *     var hash = hasher.finalize('message');
           *     var hash = hasher.finalize(wordArray);
           */
          finalize: function (messageUpdate) {
            // Final message update
            if (messageUpdate) {
              this._append(messageUpdate);
            }

            // Perform concrete-hasher logic
            var hash = this._doFinalize();

            return hash;
          },

          blockSize: 512 / 32,

          /**
           * Creates a shortcut function to a hasher's object interface.
           *
           * @param {Hasher} hasher The hasher to create a helper for.
           *
           * @return {Function} The shortcut function.
           *
           * @static
           *
           * @example
           *
           *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
           */
          _createHelper: function (hasher) {
            return function (message, cfg) {
              return new hasher.init(cfg).finalize(message);
            };
          },

          /**
           * Creates a shortcut function to the HMAC's object interface.
           *
           * @param {Hasher} hasher The hasher to use in this HMAC helper.
           *
           * @return {Function} The shortcut function.
           *
           * @static
           *
           * @example
           *
           *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
           */
          _createHmacHelper: function (hasher) {
            return function (message, key) {
              return new C_algo.HMAC.init(hasher, key).finalize(message);
            };
          }
        });

        /**
         * Algorithm namespace.
         */
        var C_algo = C.algo = {};

        return C;
      }(Math));


      (function (undefined$1) {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var Base = C_lib.Base;
        var X32WordArray = C_lib.WordArray;

        /**
         * x64 namespace.
         */
        var C_x64 = C.x64 = {};

        /**
         * A 64-bit word.
         */
        C_x64.Word = Base.extend({
          /**
           * Initializes a newly created 64-bit word.
           *
           * @param {number} high The high 32 bits.
           * @param {number} low The low 32 bits.
           *
           * @example
           *
           *     var x64Word = CryptoJS.x64.Word.create(0x00010203, 0x04050607);
           */
          init: function (high, low) {
            this.high = high;
            this.low = low;
          }

          /**
           * Bitwise NOTs this word.
           *
           * @return {X64Word} A new x64-Word object after negating.
           *
           * @example
           *
           *     var negated = x64Word.not();
           */
          // not: function () {
          // var high = ~this.high;
          // var low = ~this.low;

          // return X64Word.create(high, low);
          // },

          /**
           * Bitwise ANDs this word with the passed word.
           *
           * @param {X64Word} word The x64-Word to AND with this word.
           *
           * @return {X64Word} A new x64-Word object after ANDing.
           *
           * @example
           *
           *     var anded = x64Word.and(anotherX64Word);
           */
          // and: function (word) {
          // var high = this.high & word.high;
          // var low = this.low & word.low;

          // return X64Word.create(high, low);
          // },

          /**
           * Bitwise ORs this word with the passed word.
           *
           * @param {X64Word} word The x64-Word to OR with this word.
           *
           * @return {X64Word} A new x64-Word object after ORing.
           *
           * @example
           *
           *     var ored = x64Word.or(anotherX64Word);
           */
          // or: function (word) {
          // var high = this.high | word.high;
          // var low = this.low | word.low;

          // return X64Word.create(high, low);
          // },

          /**
           * Bitwise XORs this word with the passed word.
           *
           * @param {X64Word} word The x64-Word to XOR with this word.
           *
           * @return {X64Word} A new x64-Word object after XORing.
           *
           * @example
           *
           *     var xored = x64Word.xor(anotherX64Word);
           */
          // xor: function (word) {
          // var high = this.high ^ word.high;
          // var low = this.low ^ word.low;

          // return X64Word.create(high, low);
          // },

          /**
           * Shifts this word n bits to the left.
           *
           * @param {number} n The number of bits to shift.
           *
           * @return {X64Word} A new x64-Word object after shifting.
           *
           * @example
           *
           *     var shifted = x64Word.shiftL(25);
           */
          // shiftL: function (n) {
          // if (n < 32) {
          // var high = (this.high << n) | (this.low >>> (32 - n));
          // var low = this.low << n;
          // } else {
          // var high = this.low << (n - 32);
          // var low = 0;
          // }

          // return X64Word.create(high, low);
          // },

          /**
           * Shifts this word n bits to the right.
           *
           * @param {number} n The number of bits to shift.
           *
           * @return {X64Word} A new x64-Word object after shifting.
           *
           * @example
           *
           *     var shifted = x64Word.shiftR(7);
           */
          // shiftR: function (n) {
          // if (n < 32) {
          // var low = (this.low >>> n) | (this.high << (32 - n));
          // var high = this.high >>> n;
          // } else {
          // var low = this.high >>> (n - 32);
          // var high = 0;
          // }

          // return X64Word.create(high, low);
          // },

          /**
           * Rotates this word n bits to the left.
           *
           * @param {number} n The number of bits to rotate.
           *
           * @return {X64Word} A new x64-Word object after rotating.
           *
           * @example
           *
           *     var rotated = x64Word.rotL(25);
           */
          // rotL: function (n) {
          // return this.shiftL(n).or(this.shiftR(64 - n));
          // },

          /**
           * Rotates this word n bits to the right.
           *
           * @param {number} n The number of bits to rotate.
           *
           * @return {X64Word} A new x64-Word object after rotating.
           *
           * @example
           *
           *     var rotated = x64Word.rotR(7);
           */
          // rotR: function (n) {
          // return this.shiftR(n).or(this.shiftL(64 - n));
          // },

          /**
           * Adds this word with the passed word.
           *
           * @param {X64Word} word The x64-Word to add with this word.
           *
           * @return {X64Word} A new x64-Word object after adding.
           *
           * @example
           *
           *     var added = x64Word.add(anotherX64Word);
           */
          // add: function (word) {
          // var low = (this.low + word.low) | 0;
          // var carry = (low >>> 0) < (this.low >>> 0) ? 1 : 0;
          // var high = (this.high + word.high + carry) | 0;

          // return X64Word.create(high, low);
          // }
        });

        /**
         * An array of 64-bit words.
         *
         * @property {Array} words The array of CryptoJS.x64.Word objects.
         * @property {number} sigBytes The number of significant bytes in this word array.
         */
        C_x64.WordArray = Base.extend({
          /**
           * Initializes a newly created word array.
           *
           * @param {Array} words (Optional) An array of CryptoJS.x64.Word objects.
           * @param {number} sigBytes (Optional) The number of significant bytes in the words.
           *
           * @example
           *
           *     var wordArray = CryptoJS.x64.WordArray.create();
           *
           *     var wordArray = CryptoJS.x64.WordArray.create([
           *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
           *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
           *     ]);
           *
           *     var wordArray = CryptoJS.x64.WordArray.create([
           *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
           *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
           *     ], 10);
           */
          init: function (words, sigBytes) {
            words = this.words = words || [];

            if (sigBytes != undefined$1) {
              this.sigBytes = sigBytes;
            } else {
              this.sigBytes = words.length * 8;
            }
          },

          /**
           * Converts this 64-bit word array to a 32-bit word array.
           *
           * @return {CryptoJS.lib.WordArray} This word array's data as a 32-bit word array.
           *
           * @example
           *
           *     var x32WordArray = x64WordArray.toX32();
           */
          toX32: function () {
            // Shortcuts
            var x64Words = this.words;
            var x64WordsLength = x64Words.length;

            // Convert
            var x32Words = [];
            for (var i = 0; i < x64WordsLength; i++) {
              var x64Word = x64Words[i];
              x32Words.push(x64Word.high);
              x32Words.push(x64Word.low);
            }

            return X32WordArray.create(x32Words, this.sigBytes);
          },

          /**
           * Creates a copy of this word array.
           *
           * @return {X64WordArray} The clone.
           *
           * @example
           *
           *     var clone = x64WordArray.clone();
           */
          clone: function () {
            var clone = Base.clone.call(this);

            // Clone "words" array
            var words = clone.words = this.words.slice(0);

            // Clone each X64Word object
            var wordsLength = words.length;
            for (var i = 0; i < wordsLength; i++) {
              words[i] = words[i].clone();
            }

            return clone;
          }
        });
      }());


      (function () {
        // Check if typed arrays are supported
        if (typeof ArrayBuffer != 'function') {
          return;
        }

        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;

        // Reference original init
        var superInit = WordArray.init;

        // Augment WordArray.init to handle typed arrays
        var subInit = WordArray.init = function (typedArray) {
          // Convert buffers to uint8
          if (typedArray instanceof ArrayBuffer) {
            typedArray = new Uint8Array(typedArray);
          }

          // Convert other array views to uint8
          if (
            typedArray instanceof Int8Array ||
            (typeof Uint8ClampedArray !== "undefined" && typedArray instanceof Uint8ClampedArray) ||
            typedArray instanceof Int16Array ||
            typedArray instanceof Uint16Array ||
            typedArray instanceof Int32Array ||
            typedArray instanceof Uint32Array ||
            typedArray instanceof Float32Array ||
            typedArray instanceof Float64Array
          ) {
            typedArray = new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
          }

          // Handle Uint8Array
          if (typedArray instanceof Uint8Array) {
            // Shortcut
            var typedArrayByteLength = typedArray.byteLength;

            // Extract bytes
            var words = [];
            for (var i = 0; i < typedArrayByteLength; i++) {
              words[i >>> 2] |= typedArray[i] << (24 - (i % 4) * 8);
            }

            // Initialize this word array
            superInit.call(this, words, typedArrayByteLength);
          } else {
            // Else call normal init
            superInit.apply(this, arguments);
          }
        };

        subInit.prototype = WordArray;
      }());


      (function () {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var C_enc = C.enc;

        /**
         * UTF-16 BE encoding strategy.
         */
        C_enc.Utf16 = C_enc.Utf16BE = {
          /**
           * Converts a word array to a UTF-16 BE string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The UTF-16 BE string.
           *
           * @static
           *
           * @example
           *
           *     var utf16String = CryptoJS.enc.Utf16.stringify(wordArray);
           */
          stringify: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;

            // Convert
            var utf16Chars = [];
            for (var i = 0; i < sigBytes; i += 2) {
              var codePoint = (words[i >>> 2] >>> (16 - (i % 4) * 8)) & 0xffff;
              utf16Chars.push(String.fromCharCode(codePoint));
            }

            return utf16Chars.join('');
          },

          /**
           * Converts a UTF-16 BE string to a word array.
           *
           * @param {string} utf16Str The UTF-16 BE string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Utf16.parse(utf16String);
           */
          parse: function (utf16Str) {
            // Shortcut
            var utf16StrLength = utf16Str.length;

            // Convert
            var words = [];
            for (var i = 0; i < utf16StrLength; i++) {
              words[i >>> 1] |= utf16Str.charCodeAt(i) << (16 - (i % 2) * 16);
            }

            return WordArray.create(words, utf16StrLength * 2);
          }
        };

        /**
         * UTF-16 LE encoding strategy.
         */
        C_enc.Utf16LE = {
          /**
           * Converts a word array to a UTF-16 LE string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The UTF-16 LE string.
           *
           * @static
           *
           * @example
           *
           *     var utf16Str = CryptoJS.enc.Utf16LE.stringify(wordArray);
           */
          stringify: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;

            // Convert
            var utf16Chars = [];
            for (var i = 0; i < sigBytes; i += 2) {
              var codePoint = swapEndian((words[i >>> 2] >>> (16 - (i % 4) * 8)) & 0xffff);
              utf16Chars.push(String.fromCharCode(codePoint));
            }

            return utf16Chars.join('');
          },

          /**
           * Converts a UTF-16 LE string to a word array.
           *
           * @param {string} utf16Str The UTF-16 LE string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Utf16LE.parse(utf16Str);
           */
          parse: function (utf16Str) {
            // Shortcut
            var utf16StrLength = utf16Str.length;

            // Convert
            var words = [];
            for (var i = 0; i < utf16StrLength; i++) {
              words[i >>> 1] |= swapEndian(utf16Str.charCodeAt(i) << (16 - (i % 2) * 16));
            }

            return WordArray.create(words, utf16StrLength * 2);
          }
        };

        function swapEndian(word) {
          return ((word << 8) & 0xff00ff00) | ((word >>> 8) & 0x00ff00ff);
        }
      }());


      (function () {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var C_enc = C.enc;

        /**
         * Base64 encoding strategy.
         */
        C_enc.Base64 = {
          /**
           * Converts a word array to a Base64 string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The Base64 string.
           *
           * @static
           *
           * @example
           *
           *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
           */
          stringify: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;
            var map = this._map;

            // Clamp excess bits
            wordArray.clamp();

            // Convert
            var base64Chars = [];
            for (var i = 0; i < sigBytes; i += 3) {
              var byte1 = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
              var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
              var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

              var triplet = (byte1 << 16) | (byte2 << 8) | byte3;

              for (var j = 0; (j < 4) && (i + j * 0.75 < sigBytes); j++) {
                base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
              }
            }

            // Add padding
            var paddingChar = map.charAt(64);
            if (paddingChar) {
              while (base64Chars.length % 4) {
                base64Chars.push(paddingChar);
              }
            }

            return base64Chars.join('');
          },

          /**
           * Converts a Base64 string to a word array.
           *
           * @param {string} base64Str The Base64 string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
           */
          parse: function (base64Str) {
            // Shortcuts
            var base64StrLength = base64Str.length;
            var map = this._map;
            var reverseMap = this._reverseMap;

            if (!reverseMap) {
              reverseMap = this._reverseMap = [];
              for (var j = 0; j < map.length; j++) {
                reverseMap[map.charCodeAt(j)] = j;
              }
            }

            // Ignore padding
            var paddingChar = map.charAt(64);
            if (paddingChar) {
              var paddingIndex = base64Str.indexOf(paddingChar);
              if (paddingIndex !== -1) {
                base64StrLength = paddingIndex;
              }
            }

            // Convert
            return parseLoop(base64Str, base64StrLength, reverseMap);

          },

          _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
        };

        function parseLoop(base64Str, base64StrLength, reverseMap) {
          var words = [];
          var nBytes = 0;
          for (var i = 0; i < base64StrLength; i++) {
            if (i % 4) {
              var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << ((i % 4) * 2);
              var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> (6 - (i % 4) * 2);
              var bitsCombined = bits1 | bits2;
              words[nBytes >>> 2] |= bitsCombined << (24 - (nBytes % 4) * 8);
              nBytes++;
            }
          }
          return WordArray.create(words, nBytes);
        }
      }());


      (function () {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var C_enc = C.enc;

        /**
         * Base64url encoding strategy.
         */
        C_enc.Base64url = {
          /**
           * Converts a word array to a Base64url string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @param {boolean} urlSafe Whether to use url safe
           *
           * @return {string} The Base64url string.
           *
           * @static
           *
           * @example
           *
           *     var base64String = CryptoJS.enc.Base64url.stringify(wordArray);
           */
          stringify: function (wordArray, urlSafe) {
            if (urlSafe === undefined) {
              urlSafe = true;
            }
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;
            var map = urlSafe ? this._safe_map : this._map;

            // Clamp excess bits
            wordArray.clamp();

            // Convert
            var base64Chars = [];
            for (var i = 0; i < sigBytes; i += 3) {
              var byte1 = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
              var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
              var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

              var triplet = (byte1 << 16) | (byte2 << 8) | byte3;

              for (var j = 0; (j < 4) && (i + j * 0.75 < sigBytes); j++) {
                base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
              }
            }

            // Add padding
            var paddingChar = map.charAt(64);
            if (paddingChar) {
              while (base64Chars.length % 4) {
                base64Chars.push(paddingChar);
              }
            }

            return base64Chars.join('');
          },

          /**
           * Converts a Base64url string to a word array.
           *
           * @param {string} base64Str The Base64url string.
           *
           * @param {boolean} urlSafe Whether to use url safe
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Base64url.parse(base64String);
           */
          parse: function (base64Str, urlSafe) {
            if (urlSafe === undefined) {
              urlSafe = true;
            }

            // Shortcuts
            var base64StrLength = base64Str.length;
            var map = urlSafe ? this._safe_map : this._map;
            var reverseMap = this._reverseMap;

            if (!reverseMap) {
              reverseMap = this._reverseMap = [];
              for (var j = 0; j < map.length; j++) {
                reverseMap[map.charCodeAt(j)] = j;
              }
            }

            // Ignore padding
            var paddingChar = map.charAt(64);
            if (paddingChar) {
              var paddingIndex = base64Str.indexOf(paddingChar);
              if (paddingIndex !== -1) {
                base64StrLength = paddingIndex;
              }
            }

            // Convert
            return parseLoop(base64Str, base64StrLength, reverseMap);

          },

          _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
          _safe_map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_',
        };

        function parseLoop(base64Str, base64StrLength, reverseMap) {
          var words = [];
          var nBytes = 0;
          for (var i = 0; i < base64StrLength; i++) {
            if (i % 4) {
              var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << ((i % 4) * 2);
              var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> (6 - (i % 4) * 2);
              var bitsCombined = bits1 | bits2;
              words[nBytes >>> 2] |= bitsCombined << (24 - (nBytes % 4) * 8);
              nBytes++;
            }
          }
          return WordArray.create(words, nBytes);
        }
      }());


      (function (Math) {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var Hasher = C_lib.Hasher;
        var C_algo = C.algo;

        // Constants table
        var T = [];

        // Compute constants
        (function () {
          for (var i = 0; i < 64; i++) {
            T[i] = (Math.abs(Math.sin(i + 1)) * 0x100000000) | 0;
          }
        }());

        /**
         * MD5 hash algorithm.
         */
        var MD5 = C_algo.MD5 = Hasher.extend({
          _doReset: function () {
            this._hash = new WordArray.init([
              0x67452301, 0xefcdab89,
              0x98badcfe, 0x10325476
            ]);
          },

          _doProcessBlock: function (M, offset) {
            // Swap endian
            for (var i = 0; i < 16; i++) {
              // Shortcuts
              var offset_i = offset + i;
              var M_offset_i = M[offset_i];

              M[offset_i] = (
                (((M_offset_i << 8) | (M_offset_i >>> 24)) & 0x00ff00ff) |
                (((M_offset_i << 24) | (M_offset_i >>> 8)) & 0xff00ff00)
              );
            }

            // Shortcuts
            var H = this._hash.words;

            var M_offset_0 = M[offset + 0];
            var M_offset_1 = M[offset + 1];
            var M_offset_2 = M[offset + 2];
            var M_offset_3 = M[offset + 3];
            var M_offset_4 = M[offset + 4];
            var M_offset_5 = M[offset + 5];
            var M_offset_6 = M[offset + 6];
            var M_offset_7 = M[offset + 7];
            var M_offset_8 = M[offset + 8];
            var M_offset_9 = M[offset + 9];
            var M_offset_10 = M[offset + 10];
            var M_offset_11 = M[offset + 11];
            var M_offset_12 = M[offset + 12];
            var M_offset_13 = M[offset + 13];
            var M_offset_14 = M[offset + 14];
            var M_offset_15 = M[offset + 15];

            // Working variables
            var a = H[0];
            var b = H[1];
            var c = H[2];
            var d = H[3];

            // Computation
            a = FF(a, b, c, d, M_offset_0, 7, T[0]);
            d = FF(d, a, b, c, M_offset_1, 12, T[1]);
            c = FF(c, d, a, b, M_offset_2, 17, T[2]);
            b = FF(b, c, d, a, M_offset_3, 22, T[3]);
            a = FF(a, b, c, d, M_offset_4, 7, T[4]);
            d = FF(d, a, b, c, M_offset_5, 12, T[5]);
            c = FF(c, d, a, b, M_offset_6, 17, T[6]);
            b = FF(b, c, d, a, M_offset_7, 22, T[7]);
            a = FF(a, b, c, d, M_offset_8, 7, T[8]);
            d = FF(d, a, b, c, M_offset_9, 12, T[9]);
            c = FF(c, d, a, b, M_offset_10, 17, T[10]);
            b = FF(b, c, d, a, M_offset_11, 22, T[11]);
            a = FF(a, b, c, d, M_offset_12, 7, T[12]);
            d = FF(d, a, b, c, M_offset_13, 12, T[13]);
            c = FF(c, d, a, b, M_offset_14, 17, T[14]);
            b = FF(b, c, d, a, M_offset_15, 22, T[15]);

            a = GG(a, b, c, d, M_offset_1, 5, T[16]);
            d = GG(d, a, b, c, M_offset_6, 9, T[17]);
            c = GG(c, d, a, b, M_offset_11, 14, T[18]);
            b = GG(b, c, d, a, M_offset_0, 20, T[19]);
            a = GG(a, b, c, d, M_offset_5, 5, T[20]);
            d = GG(d, a, b, c, M_offset_10, 9, T[21]);
            c = GG(c, d, a, b, M_offset_15, 14, T[22]);
            b = GG(b, c, d, a, M_offset_4, 20, T[23]);
            a = GG(a, b, c, d, M_offset_9, 5, T[24]);
            d = GG(d, a, b, c, M_offset_14, 9, T[25]);
            c = GG(c, d, a, b, M_offset_3, 14, T[26]);
            b = GG(b, c, d, a, M_offset_8, 20, T[27]);
            a = GG(a, b, c, d, M_offset_13, 5, T[28]);
            d = GG(d, a, b, c, M_offset_2, 9, T[29]);
            c = GG(c, d, a, b, M_offset_7, 14, T[30]);
            b = GG(b, c, d, a, M_offset_12, 20, T[31]);

            a = HH(a, b, c, d, M_offset_5, 4, T[32]);
            d = HH(d, a, b, c, M_offset_8, 11, T[33]);
            c = HH(c, d, a, b, M_offset_11, 16, T[34]);
            b = HH(b, c, d, a, M_offset_14, 23, T[35]);
            a = HH(a, b, c, d, M_offset_1, 4, T[36]);
            d = HH(d, a, b, c, M_offset_4, 11, T[37]);
            c = HH(c, d, a, b, M_offset_7, 16, T[38]);
            b = HH(b, c, d, a, M_offset_10, 23, T[39]);
            a = HH(a, b, c, d, M_offset_13, 4, T[40]);
            d = HH(d, a, b, c, M_offset_0, 11, T[41]);
            c = HH(c, d, a, b, M_offset_3, 16, T[42]);
            b = HH(b, c, d, a, M_offset_6, 23, T[43]);
            a = HH(a, b, c, d, M_offset_9, 4, T[44]);
            d = HH(d, a, b, c, M_offset_12, 11, T[45]);
            c = HH(c, d, a, b, M_offset_15, 16, T[46]);
            b = HH(b, c, d, a, M_offset_2, 23, T[47]);

            a = II(a, b, c, d, M_offset_0, 6, T[48]);
            d = II(d, a, b, c, M_offset_7, 10, T[49]);
            c = II(c, d, a, b, M_offset_14, 15, T[50]);
            b = II(b, c, d, a, M_offset_5, 21, T[51]);
            a = II(a, b, c, d, M_offset_12, 6, T[52]);
            d = II(d, a, b, c, M_offset_3, 10, T[53]);
            c = II(c, d, a, b, M_offset_10, 15, T[54]);
            b = II(b, c, d, a, M_offset_1, 21, T[55]);
            a = II(a, b, c, d, M_offset_8, 6, T[56]);
            d = II(d, a, b, c, M_offset_15, 10, T[57]);
            c = II(c, d, a, b, M_offset_6, 15, T[58]);
            b = II(b, c, d, a, M_offset_13, 21, T[59]);
            a = II(a, b, c, d, M_offset_4, 6, T[60]);
            d = II(d, a, b, c, M_offset_11, 10, T[61]);
            c = II(c, d, a, b, M_offset_2, 15, T[62]);
            b = II(b, c, d, a, M_offset_9, 21, T[63]);

            // Intermediate hash value
            H[0] = (H[0] + a) | 0;
            H[1] = (H[1] + b) | 0;
            H[2] = (H[2] + c) | 0;
            H[3] = (H[3] + d) | 0;
          },

          _doFinalize: function () {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;

            var nBitsTotal = this._nDataBytes * 8;
            var nBitsLeft = data.sigBytes * 8;

            // Add padding
            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);

            var nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
            var nBitsTotalL = nBitsTotal;
            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = (
              (((nBitsTotalH << 8) | (nBitsTotalH >>> 24)) & 0x00ff00ff) |
              (((nBitsTotalH << 24) | (nBitsTotalH >>> 8)) & 0xff00ff00)
            );
            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
              (((nBitsTotalL << 8) | (nBitsTotalL >>> 24)) & 0x00ff00ff) |
              (((nBitsTotalL << 24) | (nBitsTotalL >>> 8)) & 0xff00ff00)
            );

            data.sigBytes = (dataWords.length + 1) * 4;

            // Hash final blocks
            this._process();

            // Shortcuts
            var hash = this._hash;
            var H = hash.words;

            // Swap endian
            for (var i = 0; i < 4; i++) {
              // Shortcut
              var H_i = H[i];

              H[i] = (((H_i << 8) | (H_i >>> 24)) & 0x00ff00ff) |
                (((H_i << 24) | (H_i >>> 8)) & 0xff00ff00);
            }

            // Return final computed hash
            return hash;
          },

          clone: function () {
            var clone = Hasher.clone.call(this);
            clone._hash = this._hash.clone();

            return clone;
          }
        });

        function FF(a, b, c, d, x, s, t) {
          var n = a + ((b & c) | (~b & d)) + x + t;
          return ((n << s) | (n >>> (32 - s))) + b;
        }

        function GG(a, b, c, d, x, s, t) {
          var n = a + ((b & d) | (c & ~d)) + x + t;
          return ((n << s) | (n >>> (32 - s))) + b;
        }

        function HH(a, b, c, d, x, s, t) {
          var n = a + (b ^ c ^ d) + x + t;
          return ((n << s) | (n >>> (32 - s))) + b;
        }

        function II(a, b, c, d, x, s, t) {
          var n = a + (c ^ (b | ~d)) + x + t;
          return ((n << s) | (n >>> (32 - s))) + b;
        }

        /**
         * Shortcut function to the hasher's object interface.
         *
         * @param {WordArray|string} message The message to hash.
         *
         * @return {WordArray} The hash.
         *
         * @static
         *
         * @example
         *
         *     var hash = CryptoJS.MD5('message');
         *     var hash = CryptoJS.MD5(wordArray);
         */
        C.MD5 = Hasher._createHelper(MD5);

        /**
         * Shortcut function to the HMAC's object interface.
         *
         * @param {WordArray|string} message The message to hash.
         * @param {WordArray|string} key The secret key.
         *
         * @return {WordArray} The HMAC.
         *
         * @static
         *
         * @example
         *
         *     var hmac = CryptoJS.HmacMD5(message, key);
         */
        C.HmacMD5 = Hasher._createHmacHelper(MD5);
      }(Math));


      (function () {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var Hasher = C_lib.Hasher;
        var C_algo = C.algo;

        // Reusable object
        var W = [];

        /**
         * SHA-1 hash algorithm.
         */
        var SHA1 = C_algo.SHA1 = Hasher.extend({
          _doReset: function () {
            this._hash = new WordArray.init([
              0x67452301, 0xefcdab89,
              0x98badcfe, 0x10325476,
              0xc3d2e1f0
            ]);
          },

          _doProcessBlock: function (M, offset) {
            // Shortcut
            var H = this._hash.words;

            // Working variables
            var a = H[0];
            var b = H[1];
            var c = H[2];
            var d = H[3];
            var e = H[4];

            // Computation
            for (var i = 0; i < 80; i++) {
              if (i < 16) {
                W[i] = M[offset + i] | 0;
              } else {
                var n = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
                W[i] = (n << 1) | (n >>> 31);
              }

              var t = ((a << 5) | (a >>> 27)) + e + W[i];
              if (i < 20) {
                t += ((b & c) | (~b & d)) + 0x5a827999;
              } else if (i < 40) {
                t += (b ^ c ^ d) + 0x6ed9eba1;
              } else if (i < 60) {
                t += ((b & c) | (b & d) | (c & d)) - 0x70e44324;
              } else /* if (i < 80) */ {
                t += (b ^ c ^ d) - 0x359d3e2a;
              }

              e = d;
              d = c;
              c = (b << 30) | (b >>> 2);
              b = a;
              a = t;
            }

            // Intermediate hash value
            H[0] = (H[0] + a) | 0;
            H[1] = (H[1] + b) | 0;
            H[2] = (H[2] + c) | 0;
            H[3] = (H[3] + d) | 0;
            H[4] = (H[4] + e) | 0;
          },

          _doFinalize: function () {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;

            var nBitsTotal = this._nDataBytes * 8;
            var nBitsLeft = data.sigBytes * 8;

            // Add padding
            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
            data.sigBytes = dataWords.length * 4;

            // Hash final blocks
            this._process();

            // Return final computed hash
            return this._hash;
          },

          clone: function () {
            var clone = Hasher.clone.call(this);
            clone._hash = this._hash.clone();

            return clone;
          }
        });

        /**
         * Shortcut function to the hasher's object interface.
         *
         * @param {WordArray|string} message The message to hash.
         *
         * @return {WordArray} The hash.
         *
         * @static
         *
         * @example
         *
         *     var hash = CryptoJS.SHA1('message');
         *     var hash = CryptoJS.SHA1(wordArray);
         */
        C.SHA1 = Hasher._createHelper(SHA1);

        /**
         * Shortcut function to the HMAC's object interface.
         *
         * @param {WordArray|string} message The message to hash.
         * @param {WordArray|string} key The secret key.
         *
         * @return {WordArray} The HMAC.
         *
         * @static
         *
         * @example
         *
         *     var hmac = CryptoJS.HmacSHA1(message, key);
         */
        C.HmacSHA1 = Hasher._createHmacHelper(SHA1);
      }());


      (function (Math) {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var Hasher = C_lib.Hasher;
        var C_algo = C.algo;

        // Initialization and round constants tables
        var H = [];
        var K = [];

        // Compute constants
        (function () {
          function isPrime(n) {
            var sqrtN = Math.sqrt(n);
            for (var factor = 2; factor <= sqrtN; factor++) {
              if (!(n % factor)) {
                return false;
              }
            }

            return true;
          }

          function getFractionalBits(n) {
            return ((n - (n | 0)) * 0x100000000) | 0;
          }

          var n = 2;
          var nPrime = 0;
          while (nPrime < 64) {
            if (isPrime(n)) {
              if (nPrime < 8) {
                H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
              }
              K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));

              nPrime++;
            }

            n++;
          }
        }());

        // Reusable object
        var W = [];

        /**
         * SHA-256 hash algorithm.
         */
        var SHA256 = C_algo.SHA256 = Hasher.extend({
          _doReset: function () {
            this._hash = new WordArray.init(H.slice(0));
          },

          _doProcessBlock: function (M, offset) {
            // Shortcut
            var H = this._hash.words;

            // Working variables
            var a = H[0];
            var b = H[1];
            var c = H[2];
            var d = H[3];
            var e = H[4];
            var f = H[5];
            var g = H[6];
            var h = H[7];

            // Computation
            for (var i = 0; i < 64; i++) {
              if (i < 16) {
                W[i] = M[offset + i] | 0;
              } else {
                var gamma0x = W[i - 15];
                var gamma0 = ((gamma0x << 25) | (gamma0x >>> 7)) ^
                  ((gamma0x << 14) | (gamma0x >>> 18)) ^
                  (gamma0x >>> 3);

                var gamma1x = W[i - 2];
                var gamma1 = ((gamma1x << 15) | (gamma1x >>> 17)) ^
                  ((gamma1x << 13) | (gamma1x >>> 19)) ^
                  (gamma1x >>> 10);

                W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
              }

              var ch = (e & f) ^ (~e & g);
              var maj = (a & b) ^ (a & c) ^ (b & c);

              var sigma0 = ((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22));
              var sigma1 = ((e << 26) | (e >>> 6)) ^ ((e << 21) | (e >>> 11)) ^ ((e << 7) | (e >>> 25));

              var t1 = h + sigma1 + ch + K[i] + W[i];
              var t2 = sigma0 + maj;

              h = g;
              g = f;
              f = e;
              e = (d + t1) | 0;
              d = c;
              c = b;
              b = a;
              a = (t1 + t2) | 0;
            }

            // Intermediate hash value
            H[0] = (H[0] + a) | 0;
            H[1] = (H[1] + b) | 0;
            H[2] = (H[2] + c) | 0;
            H[3] = (H[3] + d) | 0;
            H[4] = (H[4] + e) | 0;
            H[5] = (H[5] + f) | 0;
            H[6] = (H[6] + g) | 0;
            H[7] = (H[7] + h) | 0;
          },

          _doFinalize: function () {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;

            var nBitsTotal = this._nDataBytes * 8;
            var nBitsLeft = data.sigBytes * 8;

            // Add padding
            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
            data.sigBytes = dataWords.length * 4;

            // Hash final blocks
            this._process();

            // Return final computed hash
            return this._hash;
          },

          clone: function () {
            var clone = Hasher.clone.call(this);
            clone._hash = this._hash.clone();

            return clone;
          }
        });

        /**
         * Shortcut function to the hasher's object interface.
         *
         * @param {WordArray|string} message The message to hash.
         *
         * @return {WordArray} The hash.
         *
         * @static
         *
         * @example
         *
         *     var hash = CryptoJS.SHA256('message');
         *     var hash = CryptoJS.SHA256(wordArray);
         */
        C.SHA256 = Hasher._createHelper(SHA256);

        /**
         * Shortcut function to the HMAC's object interface.
         *
         * @param {WordArray|string} message The message to hash.
         * @param {WordArray|string} key The secret key.
         *
         * @return {WordArray} The HMAC.
         *
         * @static
         *
         * @example
         *
         *     var hmac = CryptoJS.HmacSHA256(message, key);
         */
        C.HmacSHA256 = Hasher._createHmacHelper(SHA256);
      }(Math));


      (function () {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var C_algo = C.algo;
        var SHA256 = C_algo.SHA256;

        /**
         * SHA-224 hash algorithm.
         */
        var SHA224 = C_algo.SHA224 = SHA256.extend({
          _doReset: function () {
            this._hash = new WordArray.init([
              0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939,
              0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4
            ]);
          },

          _doFinalize: function () {
            var hash = SHA256._doFinalize.call(this);

            hash.sigBytes -= 4;

            return hash;
          }
        });

        /**
         * Shortcut function to the hasher's object interface.
         *
         * @param {WordArray|string} message The message to hash.
         *
         * @return {WordArray} The hash.
         *
         * @static
         *
         * @example
         *
         *     var hash = CryptoJS.SHA224('message');
         *     var hash = CryptoJS.SHA224(wordArray);
         */
        C.SHA224 = SHA256._createHelper(SHA224);

        /**
         * Shortcut function to the HMAC's object interface.
         *
         * @param {WordArray|string} message The message to hash.
         * @param {WordArray|string} key The secret key.
         *
         * @return {WordArray} The HMAC.
         *
         * @static
         *
         * @example
         *
         *     var hmac = CryptoJS.HmacSHA224(message, key);
         */
        C.HmacSHA224 = SHA256._createHmacHelper(SHA224);
      }());


      (function () {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var Hasher = C_lib.Hasher;
        var C_x64 = C.x64;
        var X64Word = C_x64.Word;
        var X64WordArray = C_x64.WordArray;
        var C_algo = C.algo;

        function X64Word_create() {
          return X64Word.create.apply(X64Word, arguments);
        }

        // Constants
        var K = [
          X64Word_create(0x428a2f98, 0xd728ae22), X64Word_create(0x71374491, 0x23ef65cd),
          X64Word_create(0xb5c0fbcf, 0xec4d3b2f), X64Word_create(0xe9b5dba5, 0x8189dbbc),
          X64Word_create(0x3956c25b, 0xf348b538), X64Word_create(0x59f111f1, 0xb605d019),
          X64Word_create(0x923f82a4, 0xaf194f9b), X64Word_create(0xab1c5ed5, 0xda6d8118),
          X64Word_create(0xd807aa98, 0xa3030242), X64Word_create(0x12835b01, 0x45706fbe),
          X64Word_create(0x243185be, 0x4ee4b28c), X64Word_create(0x550c7dc3, 0xd5ffb4e2),
          X64Word_create(0x72be5d74, 0xf27b896f), X64Word_create(0x80deb1fe, 0x3b1696b1),
          X64Word_create(0x9bdc06a7, 0x25c71235), X64Word_create(0xc19bf174, 0xcf692694),
          X64Word_create(0xe49b69c1, 0x9ef14ad2), X64Word_create(0xefbe4786, 0x384f25e3),
          X64Word_create(0x0fc19dc6, 0x8b8cd5b5), X64Word_create(0x240ca1cc, 0x77ac9c65),
          X64Word_create(0x2de92c6f, 0x592b0275), X64Word_create(0x4a7484aa, 0x6ea6e483),
          X64Word_create(0x5cb0a9dc, 0xbd41fbd4), X64Word_create(0x76f988da, 0x831153b5),
          X64Word_create(0x983e5152, 0xee66dfab), X64Word_create(0xa831c66d, 0x2db43210),
          X64Word_create(0xb00327c8, 0x98fb213f), X64Word_create(0xbf597fc7, 0xbeef0ee4),
          X64Word_create(0xc6e00bf3, 0x3da88fc2), X64Word_create(0xd5a79147, 0x930aa725),
          X64Word_create(0x06ca6351, 0xe003826f), X64Word_create(0x14292967, 0x0a0e6e70),
          X64Word_create(0x27b70a85, 0x46d22ffc), X64Word_create(0x2e1b2138, 0x5c26c926),
          X64Word_create(0x4d2c6dfc, 0x5ac42aed), X64Word_create(0x53380d13, 0x9d95b3df),
          X64Word_create(0x650a7354, 0x8baf63de), X64Word_create(0x766a0abb, 0x3c77b2a8),
          X64Word_create(0x81c2c92e, 0x47edaee6), X64Word_create(0x92722c85, 0x1482353b),
          X64Word_create(0xa2bfe8a1, 0x4cf10364), X64Word_create(0xa81a664b, 0xbc423001),
          X64Word_create(0xc24b8b70, 0xd0f89791), X64Word_create(0xc76c51a3, 0x0654be30),
          X64Word_create(0xd192e819, 0xd6ef5218), X64Word_create(0xd6990624, 0x5565a910),
          X64Word_create(0xf40e3585, 0x5771202a), X64Word_create(0x106aa070, 0x32bbd1b8),
          X64Word_create(0x19a4c116, 0xb8d2d0c8), X64Word_create(0x1e376c08, 0x5141ab53),
          X64Word_create(0x2748774c, 0xdf8eeb99), X64Word_create(0x34b0bcb5, 0xe19b48a8),
          X64Word_create(0x391c0cb3, 0xc5c95a63), X64Word_create(0x4ed8aa4a, 0xe3418acb),
          X64Word_create(0x5b9cca4f, 0x7763e373), X64Word_create(0x682e6ff3, 0xd6b2b8a3),
          X64Word_create(0x748f82ee, 0x5defb2fc), X64Word_create(0x78a5636f, 0x43172f60),
          X64Word_create(0x84c87814, 0xa1f0ab72), X64Word_create(0x8cc70208, 0x1a6439ec),
          X64Word_create(0x90befffa, 0x23631e28), X64Word_create(0xa4506ceb, 0xde82bde9),
          X64Word_create(0xbef9a3f7, 0xb2c67915), X64Word_create(0xc67178f2, 0xe372532b),
          X64Word_create(0xca273ece, 0xea26619c), X64Word_create(0xd186b8c7, 0x21c0c207),
          X64Word_create(0xeada7dd6, 0xcde0eb1e), X64Word_create(0xf57d4f7f, 0xee6ed178),
          X64Word_create(0x06f067aa, 0x72176fba), X64Word_create(0x0a637dc5, 0xa2c898a6),
          X64Word_create(0x113f9804, 0xbef90dae), X64Word_create(0x1b710b35, 0x131c471b),
          X64Word_create(0x28db77f5, 0x23047d84), X64Word_create(0x32caab7b, 0x40c72493),
          X64Word_create(0x3c9ebe0a, 0x15c9bebc), X64Word_create(0x431d67c4, 0x9c100d4c),
          X64Word_create(0x4cc5d4be, 0xcb3e42b6), X64Word_create(0x597f299c, 0xfc657e2a),
          X64Word_create(0x5fcb6fab, 0x3ad6faec), X64Word_create(0x6c44198c, 0x4a475817)
        ];

        // Reusable objects
        var W = [];
        (function () {
          for (var i = 0; i < 80; i++) {
            W[i] = X64Word_create();
          }
        }());

        /**
         * SHA-512 hash algorithm.
         */
        var SHA512 = C_algo.SHA512 = Hasher.extend({
          _doReset: function () {
            this._hash = new X64WordArray.init([
              new X64Word.init(0x6a09e667, 0xf3bcc908), new X64Word.init(0xbb67ae85, 0x84caa73b),
              new X64Word.init(0x3c6ef372, 0xfe94f82b), new X64Word.init(0xa54ff53a, 0x5f1d36f1),
              new X64Word.init(0x510e527f, 0xade682d1), new X64Word.init(0x9b05688c, 0x2b3e6c1f),
              new X64Word.init(0x1f83d9ab, 0xfb41bd6b), new X64Word.init(0x5be0cd19, 0x137e2179)
            ]);
          },

          _doProcessBlock: function (M, offset) {
            // Shortcuts
            var H = this._hash.words;

            var H0 = H[0];
            var H1 = H[1];
            var H2 = H[2];
            var H3 = H[3];
            var H4 = H[4];
            var H5 = H[5];
            var H6 = H[6];
            var H7 = H[7];

            var H0h = H0.high;
            var H0l = H0.low;
            var H1h = H1.high;
            var H1l = H1.low;
            var H2h = H2.high;
            var H2l = H2.low;
            var H3h = H3.high;
            var H3l = H3.low;
            var H4h = H4.high;
            var H4l = H4.low;
            var H5h = H5.high;
            var H5l = H5.low;
            var H6h = H6.high;
            var H6l = H6.low;
            var H7h = H7.high;
            var H7l = H7.low;

            // Working variables
            var ah = H0h;
            var al = H0l;
            var bh = H1h;
            var bl = H1l;
            var ch = H2h;
            var cl = H2l;
            var dh = H3h;
            var dl = H3l;
            var eh = H4h;
            var el = H4l;
            var fh = H5h;
            var fl = H5l;
            var gh = H6h;
            var gl = H6l;
            var hh = H7h;
            var hl = H7l;

            // Rounds
            for (var i = 0; i < 80; i++) {
              var Wil;
              var Wih;

              // Shortcut
              var Wi = W[i];

              // Extend message
              if (i < 16) {
                Wih = Wi.high = M[offset + i * 2] | 0;
                Wil = Wi.low = M[offset + i * 2 + 1] | 0;
              } else {
                // Gamma0
                var gamma0x = W[i - 15];
                var gamma0xh = gamma0x.high;
                var gamma0xl = gamma0x.low;
                var gamma0h = ((gamma0xh >>> 1) | (gamma0xl << 31)) ^ ((gamma0xh >>> 8) | (gamma0xl << 24)) ^ (gamma0xh >>> 7);
                var gamma0l = ((gamma0xl >>> 1) | (gamma0xh << 31)) ^ ((gamma0xl >>> 8) | (gamma0xh << 24)) ^ ((gamma0xl >>> 7) | (gamma0xh << 25));

                // Gamma1
                var gamma1x = W[i - 2];
                var gamma1xh = gamma1x.high;
                var gamma1xl = gamma1x.low;
                var gamma1h = ((gamma1xh >>> 19) | (gamma1xl << 13)) ^ ((gamma1xh << 3) | (gamma1xl >>> 29)) ^ (gamma1xh >>> 6);
                var gamma1l = ((gamma1xl >>> 19) | (gamma1xh << 13)) ^ ((gamma1xl << 3) | (gamma1xh >>> 29)) ^ ((gamma1xl >>> 6) | (gamma1xh << 26));

                // W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16]
                var Wi7 = W[i - 7];
                var Wi7h = Wi7.high;
                var Wi7l = Wi7.low;

                var Wi16 = W[i - 16];
                var Wi16h = Wi16.high;
                var Wi16l = Wi16.low;

                Wil = gamma0l + Wi7l;
                Wih = gamma0h + Wi7h + ((Wil >>> 0) < (gamma0l >>> 0) ? 1 : 0);
                Wil = Wil + gamma1l;
                Wih = Wih + gamma1h + ((Wil >>> 0) < (gamma1l >>> 0) ? 1 : 0);
                Wil = Wil + Wi16l;
                Wih = Wih + Wi16h + ((Wil >>> 0) < (Wi16l >>> 0) ? 1 : 0);

                Wi.high = Wih;
                Wi.low = Wil;
              }

              var chh = (eh & fh) ^ (~eh & gh);
              var chl = (el & fl) ^ (~el & gl);
              var majh = (ah & bh) ^ (ah & ch) ^ (bh & ch);
              var majl = (al & bl) ^ (al & cl) ^ (bl & cl);

              var sigma0h = ((ah >>> 28) | (al << 4)) ^ ((ah << 30) | (al >>> 2)) ^ ((ah << 25) | (al >>> 7));
              var sigma0l = ((al >>> 28) | (ah << 4)) ^ ((al << 30) | (ah >>> 2)) ^ ((al << 25) | (ah >>> 7));
              var sigma1h = ((eh >>> 14) | (el << 18)) ^ ((eh >>> 18) | (el << 14)) ^ ((eh << 23) | (el >>> 9));
              var sigma1l = ((el >>> 14) | (eh << 18)) ^ ((el >>> 18) | (eh << 14)) ^ ((el << 23) | (eh >>> 9));

              // t1 = h + sigma1 + ch + K[i] + W[i]
              var Ki = K[i];
              var Kih = Ki.high;
              var Kil = Ki.low;

              var t1l = hl + sigma1l;
              var t1h = hh + sigma1h + ((t1l >>> 0) < (hl >>> 0) ? 1 : 0);
              var t1l = t1l + chl;
              var t1h = t1h + chh + ((t1l >>> 0) < (chl >>> 0) ? 1 : 0);
              var t1l = t1l + Kil;
              var t1h = t1h + Kih + ((t1l >>> 0) < (Kil >>> 0) ? 1 : 0);
              var t1l = t1l + Wil;
              var t1h = t1h + Wih + ((t1l >>> 0) < (Wil >>> 0) ? 1 : 0);

              // t2 = sigma0 + maj
              var t2l = sigma0l + majl;
              var t2h = sigma0h + majh + ((t2l >>> 0) < (sigma0l >>> 0) ? 1 : 0);

              // Update working variables
              hh = gh;
              hl = gl;
              gh = fh;
              gl = fl;
              fh = eh;
              fl = el;
              el = (dl + t1l) | 0;
              eh = (dh + t1h + ((el >>> 0) < (dl >>> 0) ? 1 : 0)) | 0;
              dh = ch;
              dl = cl;
              ch = bh;
              cl = bl;
              bh = ah;
              bl = al;
              al = (t1l + t2l) | 0;
              ah = (t1h + t2h + ((al >>> 0) < (t1l >>> 0) ? 1 : 0)) | 0;
            }

            // Intermediate hash value
            H0l = H0.low = (H0l + al);
            H0.high = (H0h + ah + ((H0l >>> 0) < (al >>> 0) ? 1 : 0));
            H1l = H1.low = (H1l + bl);
            H1.high = (H1h + bh + ((H1l >>> 0) < (bl >>> 0) ? 1 : 0));
            H2l = H2.low = (H2l + cl);
            H2.high = (H2h + ch + ((H2l >>> 0) < (cl >>> 0) ? 1 : 0));
            H3l = H3.low = (H3l + dl);
            H3.high = (H3h + dh + ((H3l >>> 0) < (dl >>> 0) ? 1 : 0));
            H4l = H4.low = (H4l + el);
            H4.high = (H4h + eh + ((H4l >>> 0) < (el >>> 0) ? 1 : 0));
            H5l = H5.low = (H5l + fl);
            H5.high = (H5h + fh + ((H5l >>> 0) < (fl >>> 0) ? 1 : 0));
            H6l = H6.low = (H6l + gl);
            H6.high = (H6h + gh + ((H6l >>> 0) < (gl >>> 0) ? 1 : 0));
            H7l = H7.low = (H7l + hl);
            H7.high = (H7h + hh + ((H7l >>> 0) < (hl >>> 0) ? 1 : 0));
          },

          _doFinalize: function () {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;

            var nBitsTotal = this._nDataBytes * 8;
            var nBitsLeft = data.sigBytes * 8;

            // Add padding
            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
            dataWords[(((nBitsLeft + 128) >>> 10) << 5) + 30] = Math.floor(nBitsTotal / 0x100000000);
            dataWords[(((nBitsLeft + 128) >>> 10) << 5) + 31] = nBitsTotal;
            data.sigBytes = dataWords.length * 4;

            // Hash final blocks
            this._process();

            // Convert hash to 32-bit word array before returning
            var hash = this._hash.toX32();

            // Return final computed hash
            return hash;
          },

          clone: function () {
            var clone = Hasher.clone.call(this);
            clone._hash = this._hash.clone();

            return clone;
          },

          blockSize: 1024 / 32
        });

        /**
         * Shortcut function to the hasher's object interface.
         *
         * @param {WordArray|string} message The message to hash.
         *
         * @return {WordArray} The hash.
         *
         * @static
         *
         * @example
         *
         *     var hash = CryptoJS.SHA512('message');
         *     var hash = CryptoJS.SHA512(wordArray);
         */
        C.SHA512 = Hasher._createHelper(SHA512);

        /**
         * Shortcut function to the HMAC's object interface.
         *
         * @param {WordArray|string} message The message to hash.
         * @param {WordArray|string} key The secret key.
         *
         * @return {WordArray} The HMAC.
         *
         * @static
         *
         * @example
         *
         *     var hmac = CryptoJS.HmacSHA512(message, key);
         */
        C.HmacSHA512 = Hasher._createHmacHelper(SHA512);
      }());


      (function () {
        // Shortcuts
        var C = CryptoJS;
        var C_x64 = C.x64;
        var X64Word = C_x64.Word;
        var X64WordArray = C_x64.WordArray;
        var C_algo = C.algo;
        var SHA512 = C_algo.SHA512;

        /**
         * SHA-384 hash algorithm.
         */
        var SHA384 = C_algo.SHA384 = SHA512.extend({
          _doReset: function () {
            this._hash = new X64WordArray.init([
              new X64Word.init(0xcbbb9d5d, 0xc1059ed8), new X64Word.init(0x629a292a, 0x367cd507),
              new X64Word.init(0x9159015a, 0x3070dd17), new X64Word.init(0x152fecd8, 0xf70e5939),
              new X64Word.init(0x67332667, 0xffc00b31), new X64Word.init(0x8eb44a87, 0x68581511),
              new X64Word.init(0xdb0c2e0d, 0x64f98fa7), new X64Word.init(0x47b5481d, 0xbefa4fa4)
            ]);
          },

          _doFinalize: function () {
            var hash = SHA512._doFinalize.call(this);

            hash.sigBytes -= 16;

            return hash;
          }
        });

        /**
         * Shortcut function to the hasher's object interface.
         *
         * @param {WordArray|string} message The message to hash.
         *
         * @return {WordArray} The hash.
         *
         * @static
         *
         * @example
         *
         *     var hash = CryptoJS.SHA384('message');
         *     var hash = CryptoJS.SHA384(wordArray);
         */
        C.SHA384 = SHA512._createHelper(SHA384);

        /**
         * Shortcut function to the HMAC's object interface.
         *
         * @param {WordArray|string} message The message to hash.
         * @param {WordArray|string} key The secret key.
         *
         * @return {WordArray} The HMAC.
         *
         * @static
         *
         * @example
         *
         *     var hmac = CryptoJS.HmacSHA384(message, key);
         */
        C.HmacSHA384 = SHA512._createHmacHelper(SHA384);
      }());


      (function (Math) {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var Hasher = C_lib.Hasher;
        var C_x64 = C.x64;
        var X64Word = C_x64.Word;
        var C_algo = C.algo;

        // Constants tables
        var RHO_OFFSETS = [];
        var PI_INDEXES = [];
        var ROUND_CONSTANTS = [];

        // Compute Constants
        (function () {
          // Compute rho offset constants
          var x = 1, y = 0;
          for (var t = 0; t < 24; t++) {
            RHO_OFFSETS[x + 5 * y] = ((t + 1) * (t + 2) / 2) % 64;

            var newX = y % 5;
            var newY = (2 * x + 3 * y) % 5;
            x = newX;
            y = newY;
          }

          // Compute pi index constants
          for (var x = 0; x < 5; x++) {
            for (var y = 0; y < 5; y++) {
              PI_INDEXES[x + 5 * y] = y + ((2 * x + 3 * y) % 5) * 5;
            }
          }

          // Compute round constants
          var LFSR = 0x01;
          for (var i = 0; i < 24; i++) {
            var roundConstantMsw = 0;
            var roundConstantLsw = 0;

            for (var j = 0; j < 7; j++) {
              if (LFSR & 0x01) {
                var bitPosition = (1 << j) - 1;
                if (bitPosition < 32) {
                  roundConstantLsw ^= 1 << bitPosition;
                } else /* if (bitPosition >= 32) */ {
                  roundConstantMsw ^= 1 << (bitPosition - 32);
                }
              }

              // Compute next LFSR
              if (LFSR & 0x80) {
                // Primitive polynomial over GF(2): x^8 + x^6 + x^5 + x^4 + 1
                LFSR = (LFSR << 1) ^ 0x71;
              } else {
                LFSR <<= 1;
              }
            }

            ROUND_CONSTANTS[i] = X64Word.create(roundConstantMsw, roundConstantLsw);
          }
        }());

        // Reusable objects for temporary values
        var T = [];
        (function () {
          for (var i = 0; i < 25; i++) {
            T[i] = X64Word.create();
          }
        }());

        /**
         * SHA-3 hash algorithm.
         */
        var SHA3 = C_algo.SHA3 = Hasher.extend({
          /**
           * Configuration options.
           *
           * @property {number} outputLength
           *   The desired number of bits in the output hash.
           *   Only values permitted are: 224, 256, 384, 512.
           *   Default: 512
           */
          cfg: Hasher.cfg.extend({
            outputLength: 512
          }),

          _doReset: function () {
            var state = this._state = [];
            for (var i = 0; i < 25; i++) {
              state[i] = new X64Word.init();
            }

            this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
          },

          _doProcessBlock: function (M, offset) {
            // Shortcuts
            var state = this._state;
            var nBlockSizeLanes = this.blockSize / 2;

            // Absorb
            for (var i = 0; i < nBlockSizeLanes; i++) {
              // Shortcuts
              var M2i = M[offset + 2 * i];
              var M2i1 = M[offset + 2 * i + 1];

              // Swap endian
              M2i = (
                (((M2i << 8) | (M2i >>> 24)) & 0x00ff00ff) |
                (((M2i << 24) | (M2i >>> 8)) & 0xff00ff00)
              );
              M2i1 = (
                (((M2i1 << 8) | (M2i1 >>> 24)) & 0x00ff00ff) |
                (((M2i1 << 24) | (M2i1 >>> 8)) & 0xff00ff00)
              );

              // Absorb message into state
              var lane = state[i];
              lane.high ^= M2i1;
              lane.low ^= M2i;
            }

            // Rounds
            for (var round = 0; round < 24; round++) {
              // Theta
              for (var x = 0; x < 5; x++) {
                // Mix column lanes
                var tMsw = 0, tLsw = 0;
                for (var y = 0; y < 5; y++) {
                  var lane = state[x + 5 * y];
                  tMsw ^= lane.high;
                  tLsw ^= lane.low;
                }

                // Temporary values
                var Tx = T[x];
                Tx.high = tMsw;
                Tx.low = tLsw;
              }
              for (var x = 0; x < 5; x++) {
                // Shortcuts
                var Tx4 = T[(x + 4) % 5];
                var Tx1 = T[(x + 1) % 5];
                var Tx1Msw = Tx1.high;
                var Tx1Lsw = Tx1.low;

                // Mix surrounding columns
                var tMsw = Tx4.high ^ ((Tx1Msw << 1) | (Tx1Lsw >>> 31));
                var tLsw = Tx4.low ^ ((Tx1Lsw << 1) | (Tx1Msw >>> 31));
                for (var y = 0; y < 5; y++) {
                  var lane = state[x + 5 * y];
                  lane.high ^= tMsw;
                  lane.low ^= tLsw;
                }
              }

              // Rho Pi
              for (var laneIndex = 1; laneIndex < 25; laneIndex++) {
                var tMsw;
                var tLsw;

                // Shortcuts
                var lane = state[laneIndex];
                var laneMsw = lane.high;
                var laneLsw = lane.low;
                var rhoOffset = RHO_OFFSETS[laneIndex];

                // Rotate lanes
                if (rhoOffset < 32) {
                  tMsw = (laneMsw << rhoOffset) | (laneLsw >>> (32 - rhoOffset));
                  tLsw = (laneLsw << rhoOffset) | (laneMsw >>> (32 - rhoOffset));
                } else /* if (rhoOffset >= 32) */ {
                  tMsw = (laneLsw << (rhoOffset - 32)) | (laneMsw >>> (64 - rhoOffset));
                  tLsw = (laneMsw << (rhoOffset - 32)) | (laneLsw >>> (64 - rhoOffset));
                }

                // Transpose lanes
                var TPiLane = T[PI_INDEXES[laneIndex]];
                TPiLane.high = tMsw;
                TPiLane.low = tLsw;
              }

              // Rho pi at x = y = 0
              var T0 = T[0];
              var state0 = state[0];
              T0.high = state0.high;
              T0.low = state0.low;

              // Chi
              for (var x = 0; x < 5; x++) {
                for (var y = 0; y < 5; y++) {
                  // Shortcuts
                  var laneIndex = x + 5 * y;
                  var lane = state[laneIndex];
                  var TLane = T[laneIndex];
                  var Tx1Lane = T[((x + 1) % 5) + 5 * y];
                  var Tx2Lane = T[((x + 2) % 5) + 5 * y];

                  // Mix rows
                  lane.high = TLane.high ^ (~Tx1Lane.high & Tx2Lane.high);
                  lane.low = TLane.low ^ (~Tx1Lane.low & Tx2Lane.low);
                }
              }

              // Iota
              var lane = state[0];
              var roundConstant = ROUND_CONSTANTS[round];
              lane.high ^= roundConstant.high;
              lane.low ^= roundConstant.low;
            }
          },

          _doFinalize: function () {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;
            this._nDataBytes * 8;
            var nBitsLeft = data.sigBytes * 8;
            var blockSizeBits = this.blockSize * 32;

            // Add padding
            dataWords[nBitsLeft >>> 5] |= 0x1 << (24 - nBitsLeft % 32);
            dataWords[((Math.ceil((nBitsLeft + 1) / blockSizeBits) * blockSizeBits) >>> 5) - 1] |= 0x80;
            data.sigBytes = dataWords.length * 4;

            // Hash final blocks
            this._process();

            // Shortcuts
            var state = this._state;
            var outputLengthBytes = this.cfg.outputLength / 8;
            var outputLengthLanes = outputLengthBytes / 8;

            // Squeeze
            var hashWords = [];
            for (var i = 0; i < outputLengthLanes; i++) {
              // Shortcuts
              var lane = state[i];
              var laneMsw = lane.high;
              var laneLsw = lane.low;

              // Swap endian
              laneMsw = (
                (((laneMsw << 8) | (laneMsw >>> 24)) & 0x00ff00ff) |
                (((laneMsw << 24) | (laneMsw >>> 8)) & 0xff00ff00)
              );
              laneLsw = (
                (((laneLsw << 8) | (laneLsw >>> 24)) & 0x00ff00ff) |
                (((laneLsw << 24) | (laneLsw >>> 8)) & 0xff00ff00)
              );

              // Squeeze state to retrieve hash
              hashWords.push(laneLsw);
              hashWords.push(laneMsw);
            }

            // Return final computed hash
            return new WordArray.init(hashWords, outputLengthBytes);
          },

          clone: function () {
            var clone = Hasher.clone.call(this);

            var state = clone._state = this._state.slice(0);
            for (var i = 0; i < 25; i++) {
              state[i] = state[i].clone();
            }

            return clone;
          }
        });

        /**
         * Shortcut function to the hasher's object interface.
         *
         * @param {WordArray|string} message The message to hash.
         *
         * @return {WordArray} The hash.
         *
         * @static
         *
         * @example
         *
         *     var hash = CryptoJS.SHA3('message');
         *     var hash = CryptoJS.SHA3(wordArray);
         */
        C.SHA3 = Hasher._createHelper(SHA3);

        /**
         * Shortcut function to the HMAC's object interface.
         *
         * @param {WordArray|string} message The message to hash.
         * @param {WordArray|string} key The secret key.
         *
         * @return {WordArray} The HMAC.
         *
         * @static
         *
         * @example
         *
         *     var hmac = CryptoJS.HmacSHA3(message, key);
         */
        C.HmacSHA3 = Hasher._createHmacHelper(SHA3);
      }(Math));


      /** @preserve
       (c) 2012 by Cédric Mesnil. All rights reserved.

       Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

       - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
       - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

       THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
       */

      (function (Math) {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var Hasher = C_lib.Hasher;
        var C_algo = C.algo;

        // Constants table
        var _zl = WordArray.create([
          0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
          7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8,
          3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12,
          1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2,
          4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13]);
        var _zr = WordArray.create([
          5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12,
          6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2,
          15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13,
          8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14,
          12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11]);
        var _sl = WordArray.create([
          11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8,
          7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12,
          11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5,
          11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12,
          9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6]);
        var _sr = WordArray.create([
          8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6,
          9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11,
          9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5,
          15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8,
          8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11]);

        var _hl = WordArray.create([0x00000000, 0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xA953FD4E]);
        var _hr = WordArray.create([0x50A28BE6, 0x5C4DD124, 0x6D703EF3, 0x7A6D76E9, 0x00000000]);

        /**
         * RIPEMD160 hash algorithm.
         */
        var RIPEMD160 = C_algo.RIPEMD160 = Hasher.extend({
          _doReset: function () {
            this._hash = WordArray.create([0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0]);
          },

          _doProcessBlock: function (M, offset) {

            // Swap endian
            for (var i = 0; i < 16; i++) {
              // Shortcuts
              var offset_i = offset + i;
              var M_offset_i = M[offset_i];

              // Swap
              M[offset_i] = (
                (((M_offset_i << 8) | (M_offset_i >>> 24)) & 0x00ff00ff) |
                (((M_offset_i << 24) | (M_offset_i >>> 8)) & 0xff00ff00)
              );
            }
            // Shortcut
            var H = this._hash.words;
            var hl = _hl.words;
            var hr = _hr.words;
            var zl = _zl.words;
            var zr = _zr.words;
            var sl = _sl.words;
            var sr = _sr.words;

            // Working variables
            var al, bl, cl, dl, el;
            var ar, br, cr, dr, er;

            ar = al = H[0];
            br = bl = H[1];
            cr = cl = H[2];
            dr = dl = H[3];
            er = el = H[4];
            // Computation
            var t;
            for (var i = 0; i < 80; i += 1) {
              t = (al + M[offset + zl[i]]) | 0;
              if (i < 16) {
                t += f1(bl, cl, dl) + hl[0];
              } else if (i < 32) {
                t += f2(bl, cl, dl) + hl[1];
              } else if (i < 48) {
                t += f3(bl, cl, dl) + hl[2];
              } else if (i < 64) {
                t += f4(bl, cl, dl) + hl[3];
              } else {// if (i<80) {
                t += f5(bl, cl, dl) + hl[4];
              }
              t = t | 0;
              t = rotl(t, sl[i]);
              t = (t + el) | 0;
              al = el;
              el = dl;
              dl = rotl(cl, 10);
              cl = bl;
              bl = t;

              t = (ar + M[offset + zr[i]]) | 0;
              if (i < 16) {
                t += f5(br, cr, dr) + hr[0];
              } else if (i < 32) {
                t += f4(br, cr, dr) + hr[1];
              } else if (i < 48) {
                t += f3(br, cr, dr) + hr[2];
              } else if (i < 64) {
                t += f2(br, cr, dr) + hr[3];
              } else {// if (i<80) {
                t += f1(br, cr, dr) + hr[4];
              }
              t = t | 0;
              t = rotl(t, sr[i]);
              t = (t + er) | 0;
              ar = er;
              er = dr;
              dr = rotl(cr, 10);
              cr = br;
              br = t;
            }
            // Intermediate hash value
            t = (H[1] + cl + dr) | 0;
            H[1] = (H[2] + dl + er) | 0;
            H[2] = (H[3] + el + ar) | 0;
            H[3] = (H[4] + al + br) | 0;
            H[4] = (H[0] + bl + cr) | 0;
            H[0] = t;
          },

          _doFinalize: function () {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;

            var nBitsTotal = this._nDataBytes * 8;
            var nBitsLeft = data.sigBytes * 8;

            // Add padding
            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
              (((nBitsTotal << 8) | (nBitsTotal >>> 24)) & 0x00ff00ff) |
              (((nBitsTotal << 24) | (nBitsTotal >>> 8)) & 0xff00ff00)
            );
            data.sigBytes = (dataWords.length + 1) * 4;

            // Hash final blocks
            this._process();

            // Shortcuts
            var hash = this._hash;
            var H = hash.words;

            // Swap endian
            for (var i = 0; i < 5; i++) {
              // Shortcut
              var H_i = H[i];

              // Swap
              H[i] = (((H_i << 8) | (H_i >>> 24)) & 0x00ff00ff) |
                (((H_i << 24) | (H_i >>> 8)) & 0xff00ff00);
            }

            // Return final computed hash
            return hash;
          },

          clone: function () {
            var clone = Hasher.clone.call(this);
            clone._hash = this._hash.clone();

            return clone;
          }
        });


        function f1(x, y, z) {
          return ((x) ^ (y) ^ (z));

        }

        function f2(x, y, z) {
          return (((x) & (y)) | ((~x) & (z)));
        }

        function f3(x, y, z) {
          return (((x) | (~(y))) ^ (z));
        }

        function f4(x, y, z) {
          return (((x) & (z)) | ((y) & (~(z))));
        }

        function f5(x, y, z) {
          return ((x) ^ ((y) | (~(z))));

        }

        function rotl(x, n) {
          return (x << n) | (x >>> (32 - n));
        }


        /**
         * Shortcut function to the hasher's object interface.
         *
         * @param {WordArray|string} message The message to hash.
         *
         * @return {WordArray} The hash.
         *
         * @static
         *
         * @example
         *
         *     var hash = CryptoJS.RIPEMD160('message');
         *     var hash = CryptoJS.RIPEMD160(wordArray);
         */
        C.RIPEMD160 = Hasher._createHelper(RIPEMD160);

        /**
         * Shortcut function to the HMAC's object interface.
         *
         * @param {WordArray|string} message The message to hash.
         * @param {WordArray|string} key The secret key.
         *
         * @return {WordArray} The HMAC.
         *
         * @static
         *
         * @example
         *
         *     var hmac = CryptoJS.HmacRIPEMD160(message, key);
         */
        C.HmacRIPEMD160 = Hasher._createHmacHelper(RIPEMD160);
      }());


      (function () {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var Base = C_lib.Base;
        var C_enc = C.enc;
        var Utf8 = C_enc.Utf8;
        var C_algo = C.algo;

        /**
         * HMAC algorithm.
         */
        C_algo.HMAC = Base.extend({
          /**
           * Initializes a newly created HMAC.
           *
           * @param {Hasher} hasher The hash algorithm to use.
           * @param {WordArray|string} key The secret key.
           *
           * @example
           *
           *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
           */
          init: function (hasher, key) {
            // Init hasher
            hasher = this._hasher = new hasher.init();

            // Convert string to WordArray, else assume WordArray already
            if (typeof key == 'string') {
              key = Utf8.parse(key);
            }

            // Shortcuts
            var hasherBlockSize = hasher.blockSize;
            var hasherBlockSizeBytes = hasherBlockSize * 4;

            // Allow arbitrary length keys
            if (key.sigBytes > hasherBlockSizeBytes) {
              key = hasher.finalize(key);
            }

            // Clamp excess bits
            key.clamp();

            // Clone key for inner and outer pads
            var oKey = this._oKey = key.clone();
            var iKey = this._iKey = key.clone();

            // Shortcuts
            var oKeyWords = oKey.words;
            var iKeyWords = iKey.words;

            // XOR keys with pad constants
            for (var i = 0; i < hasherBlockSize; i++) {
              oKeyWords[i] ^= 0x5c5c5c5c;
              iKeyWords[i] ^= 0x36363636;
            }
            oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;

            // Set initial values
            this.reset();
          },

          /**
           * Resets this HMAC to its initial state.
           *
           * @example
           *
           *     hmacHasher.reset();
           */
          reset: function () {
            // Shortcut
            var hasher = this._hasher;

            // Reset
            hasher.reset();
            hasher.update(this._iKey);
          },

          /**
           * Updates this HMAC with a message.
           *
           * @param {WordArray|string} messageUpdate The message to append.
           *
           * @return {HMAC} This HMAC instance.
           *
           * @example
           *
           *     hmacHasher.update('message');
           *     hmacHasher.update(wordArray);
           */
          update: function (messageUpdate) {
            this._hasher.update(messageUpdate);

            // Chainable
            return this;
          },

          /**
           * Finalizes the HMAC computation.
           * Note that the finalize operation is effectively a destructive, read-once operation.
           *
           * @param {WordArray|string} messageUpdate (Optional) A final message update.
           *
           * @return {WordArray} The HMAC.
           *
           * @example
           *
           *     var hmac = hmacHasher.finalize();
           *     var hmac = hmacHasher.finalize('message');
           *     var hmac = hmacHasher.finalize(wordArray);
           */
          finalize: function (messageUpdate) {
            // Shortcut
            var hasher = this._hasher;

            // Compute HMAC
            var innerHash = hasher.finalize(messageUpdate);
            hasher.reset();
            var hmac = hasher.finalize(this._oKey.clone().concat(innerHash));

            return hmac;
          }
        });
      }());


      (function () {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var Base = C_lib.Base;
        var WordArray = C_lib.WordArray;
        var C_algo = C.algo;
        var SHA256 = C_algo.SHA256;
        var HMAC = C_algo.HMAC;

        /**
         * Password-Based Key Derivation Function 2 algorithm.
         */
        var PBKDF2 = C_algo.PBKDF2 = Base.extend({
          /**
           * Configuration options.
           *
           * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
           * @property {Hasher} hasher The hasher to use. Default: SHA256
           * @property {number} iterations The number of iterations to perform. Default: 250000
           */
          cfg: Base.extend({
            keySize: 128 / 32,
            hasher: SHA256,
            iterations: 250000
          }),

          /**
           * Initializes a newly created key derivation function.
           *
           * @param {Object} cfg (Optional) The configuration options to use for the derivation.
           *
           * @example
           *
           *     var kdf = CryptoJS.algo.PBKDF2.create();
           *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8 });
           *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8, iterations: 1000 });
           */
          init: function (cfg) {
            this.cfg = this.cfg.extend(cfg);
          },

          /**
           * Computes the Password-Based Key Derivation Function 2.
           *
           * @param {WordArray|string} password The password.
           * @param {WordArray|string} salt A salt.
           *
           * @return {WordArray} The derived key.
           *
           * @example
           *
           *     var key = kdf.compute(password, salt);
           */
          compute: function (password, salt) {
            // Shortcut
            var cfg = this.cfg;

            // Init HMAC
            var hmac = HMAC.create(cfg.hasher, password);

            // Initial values
            var derivedKey = WordArray.create();
            var blockIndex = WordArray.create([0x00000001]);

            // Shortcuts
            var derivedKeyWords = derivedKey.words;
            var blockIndexWords = blockIndex.words;
            var keySize = cfg.keySize;
            var iterations = cfg.iterations;

            // Generate key
            while (derivedKeyWords.length < keySize) {
              var block = hmac.update(salt).finalize(blockIndex);
              hmac.reset();

              // Shortcuts
              var blockWords = block.words;
              var blockWordsLength = blockWords.length;

              // Iterations
              var intermediate = block;
              for (var i = 1; i < iterations; i++) {
                intermediate = hmac.finalize(intermediate);
                hmac.reset();

                // Shortcut
                var intermediateWords = intermediate.words;

                // XOR intermediate with block
                for (var j = 0; j < blockWordsLength; j++) {
                  blockWords[j] ^= intermediateWords[j];
                }
              }

              derivedKey.concat(block);
              blockIndexWords[0]++;
            }
            derivedKey.sigBytes = keySize * 4;

            return derivedKey;
          }
        });

        /**
         * Computes the Password-Based Key Derivation Function 2.
         *
         * @param {WordArray|string} password The password.
         * @param {WordArray|string} salt A salt.
         * @param {Object} cfg (Optional) The configuration options to use for this computation.
         *
         * @return {WordArray} The derived key.
         *
         * @static
         *
         * @example
         *
         *     var key = CryptoJS.PBKDF2(password, salt);
         *     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8 });
         *     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8, iterations: 1000 });
         */
        C.PBKDF2 = function (password, salt, cfg) {
          return PBKDF2.create(cfg).compute(password, salt);
        };
      }());


      (function () {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var Base = C_lib.Base;
        var WordArray = C_lib.WordArray;
        var C_algo = C.algo;
        var MD5 = C_algo.MD5;

        /**
         * This key derivation function is meant to conform with EVP_BytesToKey.
         * www.openssl.org/docs/crypto/EVP_BytesToKey.html
         */
        var EvpKDF = C_algo.EvpKDF = Base.extend({
          /**
           * Configuration options.
           *
           * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
           * @property {Hasher} hasher The hash algorithm to use. Default: MD5
           * @property {number} iterations The number of iterations to perform. Default: 1
           */
          cfg: Base.extend({
            keySize: 128 / 32,
            hasher: MD5,
            iterations: 1
          }),

          /**
           * Initializes a newly created key derivation function.
           *
           * @param {Object} cfg (Optional) The configuration options to use for the derivation.
           *
           * @example
           *
           *     var kdf = CryptoJS.algo.EvpKDF.create();
           *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8 });
           *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8, iterations: 1000 });
           */
          init: function (cfg) {
            this.cfg = this.cfg.extend(cfg);
          },

          /**
           * Derives a key from a password.
           *
           * @param {WordArray|string} password The password.
           * @param {WordArray|string} salt A salt.
           *
           * @return {WordArray} The derived key.
           *
           * @example
           *
           *     var key = kdf.compute(password, salt);
           */
          compute: function (password, salt) {
            var block;

            // Shortcut
            var cfg = this.cfg;

            // Init hasher
            var hasher = cfg.hasher.create();

            // Initial values
            var derivedKey = WordArray.create();

            // Shortcuts
            var derivedKeyWords = derivedKey.words;
            var keySize = cfg.keySize;
            var iterations = cfg.iterations;

            // Generate key
            while (derivedKeyWords.length < keySize) {
              if (block) {
                hasher.update(block);
              }
              block = hasher.update(password).finalize(salt);
              hasher.reset();

              // Iterations
              for (var i = 1; i < iterations; i++) {
                block = hasher.finalize(block);
                hasher.reset();
              }

              derivedKey.concat(block);
            }
            derivedKey.sigBytes = keySize * 4;

            return derivedKey;
          }
        });

        /**
         * Derives a key from a password.
         *
         * @param {WordArray|string} password The password.
         * @param {WordArray|string} salt A salt.
         * @param {Object} cfg (Optional) The configuration options to use for this computation.
         *
         * @return {WordArray} The derived key.
         *
         * @static
         *
         * @example
         *
         *     var key = CryptoJS.EvpKDF(password, salt);
         *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8 });
         *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8, iterations: 1000 });
         */
        C.EvpKDF = function (password, salt, cfg) {
          return EvpKDF.create(cfg).compute(password, salt);
        };
      }());


      /**
       * Cipher core components.
       */
      CryptoJS.lib.Cipher || (function (undefined$1) {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var Base = C_lib.Base;
        var WordArray = C_lib.WordArray;
        var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm;
        var C_enc = C.enc;
        C_enc.Utf8;
        var Base64 = C_enc.Base64;
        var C_algo = C.algo;
        var EvpKDF = C_algo.EvpKDF;

        /**
         * Abstract base cipher template.
         *
         * @property {number} keySize This cipher's key size. Default: 4 (128 bits)
         * @property {number} ivSize This cipher's IV size. Default: 4 (128 bits)
         * @property {number} _ENC_XFORM_MODE A constant representing encryption mode.
         * @property {number} _DEC_XFORM_MODE A constant representing decryption mode.
         */
        var Cipher = C_lib.Cipher = BufferedBlockAlgorithm.extend({
          /**
           * Configuration options.
           *
           * @property {WordArray} iv The IV to use for this operation.
           */
          cfg: Base.extend(),

          /**
           * Creates this cipher in encryption mode.
           *
           * @param {WordArray} key The key.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {Cipher} A cipher instance.
           *
           * @static
           *
           * @example
           *
           *     var cipher = CryptoJS.algo.AES.createEncryptor(keyWordArray, { iv: ivWordArray });
           */
          createEncryptor: function (key, cfg) {
            return this.create(this._ENC_XFORM_MODE, key, cfg);
          },

          /**
           * Creates this cipher in decryption mode.
           *
           * @param {WordArray} key The key.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {Cipher} A cipher instance.
           *
           * @static
           *
           * @example
           *
           *     var cipher = CryptoJS.algo.AES.createDecryptor(keyWordArray, { iv: ivWordArray });
           */
          createDecryptor: function (key, cfg) {
            return this.create(this._DEC_XFORM_MODE, key, cfg);
          },

          /**
           * Initializes a newly created cipher.
           *
           * @param {number} xformMode Either the encryption or decryption transormation mode constant.
           * @param {WordArray} key The key.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @example
           *
           *     var cipher = CryptoJS.algo.AES.create(CryptoJS.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray });
           */
          init: function (xformMode, key, cfg) {
            // Apply config defaults
            this.cfg = this.cfg.extend(cfg);

            // Store transform mode and key
            this._xformMode = xformMode;
            this._key = key;

            // Set initial values
            this.reset();
          },

          /**
           * Resets this cipher to its initial state.
           *
           * @example
           *
           *     cipher.reset();
           */
          reset: function () {
            // Reset data buffer
            BufferedBlockAlgorithm.reset.call(this);

            // Perform concrete-cipher logic
            this._doReset();
          },

          /**
           * Adds data to be encrypted or decrypted.
           *
           * @param {WordArray|string} dataUpdate The data to encrypt or decrypt.
           *
           * @return {WordArray} The data after processing.
           *
           * @example
           *
           *     var encrypted = cipher.process('data');
           *     var encrypted = cipher.process(wordArray);
           */
          process: function (dataUpdate) {
            // Append
            this._append(dataUpdate);

            // Process available blocks
            return this._process();
          },

          /**
           * Finalizes the encryption or decryption process.
           * Note that the finalize operation is effectively a destructive, read-once operation.
           *
           * @param {WordArray|string} dataUpdate The final data to encrypt or decrypt.
           *
           * @return {WordArray} The data after final processing.
           *
           * @example
           *
           *     var encrypted = cipher.finalize();
           *     var encrypted = cipher.finalize('data');
           *     var encrypted = cipher.finalize(wordArray);
           */
          finalize: function (dataUpdate) {
            // Final data update
            if (dataUpdate) {
              this._append(dataUpdate);
            }

            // Perform concrete-cipher logic
            var finalProcessedData = this._doFinalize();

            return finalProcessedData;
          },

          keySize: 128 / 32,

          ivSize: 128 / 32,

          _ENC_XFORM_MODE: 1,

          _DEC_XFORM_MODE: 2,

          /**
           * Creates shortcut functions to a cipher's object interface.
           *
           * @param {Cipher} cipher The cipher to create a helper for.
           *
           * @return {Object} An object with encrypt and decrypt shortcut functions.
           *
           * @static
           *
           * @example
           *
           *     var AES = CryptoJS.lib.Cipher._createHelper(CryptoJS.algo.AES);
           */
          _createHelper: (function () {
            function selectCipherStrategy(key) {
              if (typeof key == 'string') {
                return PasswordBasedCipher;
              } else {
                return SerializableCipher;
              }
            }

            return function (cipher) {
              return {
                encrypt: function (message, key, cfg) {
                  return selectCipherStrategy(key).encrypt(cipher, message, key, cfg);
                },

                decrypt: function (ciphertext, key, cfg) {
                  return selectCipherStrategy(key).decrypt(cipher, ciphertext, key, cfg);
                }
              };
            };
          }())
        });

        /**
         * Abstract base stream cipher template.
         *
         * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 1 (32 bits)
         */
        C_lib.StreamCipher = Cipher.extend({
          _doFinalize: function () {
            // Process partial blocks
            var finalProcessedBlocks = this._process(!!'flush');

            return finalProcessedBlocks;
          },

          blockSize: 1
        });

        /**
         * Mode namespace.
         */
        var C_mode = C.mode = {};

        /**
         * Abstract base block cipher mode template.
         */
        var BlockCipherMode = C_lib.BlockCipherMode = Base.extend({
          /**
           * Creates this mode for encryption.
           *
           * @param {Cipher} cipher A block cipher instance.
           * @param {Array} iv The IV words.
           *
           * @static
           *
           * @example
           *
           *     var mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv.words);
           */
          createEncryptor: function (cipher, iv) {
            return this.Encryptor.create(cipher, iv);
          },

          /**
           * Creates this mode for decryption.
           *
           * @param {Cipher} cipher A block cipher instance.
           * @param {Array} iv The IV words.
           *
           * @static
           *
           * @example
           *
           *     var mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv.words);
           */
          createDecryptor: function (cipher, iv) {
            return this.Decryptor.create(cipher, iv);
          },

          /**
           * Initializes a newly created mode.
           *
           * @param {Cipher} cipher A block cipher instance.
           * @param {Array} iv The IV words.
           *
           * @example
           *
           *     var mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
           */
          init: function (cipher, iv) {
            this._cipher = cipher;
            this._iv = iv;
          }
        });

        /**
         * Cipher Block Chaining mode.
         */
        var CBC = C_mode.CBC = (function () {
          /**
           * Abstract base CBC mode.
           */
          var CBC = BlockCipherMode.extend();

          /**
           * CBC encryptor.
           */
          CBC.Encryptor = CBC.extend({
            /**
             * Processes the data block at offset.
             *
             * @param {Array} words The data words to operate on.
             * @param {number} offset The offset where the block starts.
             *
             * @example
             *
             *     mode.processBlock(data.words, offset);
             */
            processBlock: function (words, offset) {
              // Shortcuts
              var cipher = this._cipher;
              var blockSize = cipher.blockSize;

              // XOR and encrypt
              xorBlock.call(this, words, offset, blockSize);
              cipher.encryptBlock(words, offset);

              // Remember this block to use with next block
              this._prevBlock = words.slice(offset, offset + blockSize);
            }
          });

          /**
           * CBC decryptor.
           */
          CBC.Decryptor = CBC.extend({
            /**
             * Processes the data block at offset.
             *
             * @param {Array} words The data words to operate on.
             * @param {number} offset The offset where the block starts.
             *
             * @example
             *
             *     mode.processBlock(data.words, offset);
             */
            processBlock: function (words, offset) {
              // Shortcuts
              var cipher = this._cipher;
              var blockSize = cipher.blockSize;

              // Remember this block to use with next block
              var thisBlock = words.slice(offset, offset + blockSize);

              // Decrypt and XOR
              cipher.decryptBlock(words, offset);
              xorBlock.call(this, words, offset, blockSize);

              // This block becomes the previous block
              this._prevBlock = thisBlock;
            }
          });

          function xorBlock(words, offset, blockSize) {
            var block;

            // Shortcut
            var iv = this._iv;

            // Choose mixing block
            if (iv) {
              block = iv;

              // Remove IV for subsequent blocks
              this._iv = undefined$1;
            } else {
              block = this._prevBlock;
            }

            // XOR blocks
            for (var i = 0; i < blockSize; i++) {
              words[offset + i] ^= block[i];
            }
          }

          return CBC;
        }());

        /**
         * Padding namespace.
         */
        var C_pad = C.pad = {};

        /**
         * PKCS #5/7 padding strategy.
         */
        var Pkcs7 = C_pad.Pkcs7 = {
          /**
           * Pads data using the algorithm defined in PKCS #5/7.
           *
           * @param {WordArray} data The data to pad.
           * @param {number} blockSize The multiple that the data should be padded to.
           *
           * @static
           *
           * @example
           *
           *     CryptoJS.pad.Pkcs7.pad(wordArray, 4);
           */
          pad: function (data, blockSize) {
            // Shortcut
            var blockSizeBytes = blockSize * 4;

            // Count padding bytes
            var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;

            // Create padding word
            var paddingWord = (nPaddingBytes << 24) | (nPaddingBytes << 16) | (nPaddingBytes << 8) | nPaddingBytes;

            // Create padding
            var paddingWords = [];
            for (var i = 0; i < nPaddingBytes; i += 4) {
              paddingWords.push(paddingWord);
            }
            var padding = WordArray.create(paddingWords, nPaddingBytes);

            // Add padding
            data.concat(padding);
          },

          /**
           * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
           *
           * @param {WordArray} data The data to unpad.
           *
           * @static
           *
           * @example
           *
           *     CryptoJS.pad.Pkcs7.unpad(wordArray);
           */
          unpad: function (data) {
            // Get number of padding bytes from last byte
            var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

            // Remove padding
            data.sigBytes -= nPaddingBytes;
          }
        };

        /**
         * Abstract base block cipher template.
         *
         * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 4 (128 bits)
         */
        C_lib.BlockCipher = Cipher.extend({
          /**
           * Configuration options.
           *
           * @property {Mode} mode The block mode to use. Default: CBC
           * @property {Padding} padding The padding strategy to use. Default: Pkcs7
           */
          cfg: Cipher.cfg.extend({
            mode: CBC,
            padding: Pkcs7
          }),

          reset: function () {
            var modeCreator;

            // Reset cipher
            Cipher.reset.call(this);

            // Shortcuts
            var cfg = this.cfg;
            var iv = cfg.iv;
            var mode = cfg.mode;

            // Reset block mode
            if (this._xformMode == this._ENC_XFORM_MODE) {
              modeCreator = mode.createEncryptor;
            } else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
              modeCreator = mode.createDecryptor;
              // Keep at least one block in the buffer for unpadding
              this._minBufferSize = 1;
            }

            if (this._mode && this._mode.__creator == modeCreator) {
              this._mode.init(this, iv && iv.words);
            } else {
              this._mode = modeCreator.call(mode, this, iv && iv.words);
              this._mode.__creator = modeCreator;
            }
          },

          _doProcessBlock: function (words, offset) {
            this._mode.processBlock(words, offset);
          },

          _doFinalize: function () {
            var finalProcessedBlocks;

            // Shortcut
            var padding = this.cfg.padding;

            // Finalize
            if (this._xformMode == this._ENC_XFORM_MODE) {
              // Pad data
              padding.pad(this._data, this.blockSize);

              // Process final blocks
              finalProcessedBlocks = this._process(!!'flush');
            } else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
              // Process final blocks
              finalProcessedBlocks = this._process(!!'flush');

              // Unpad data
              padding.unpad(finalProcessedBlocks);
            }

            return finalProcessedBlocks;
          },

          blockSize: 128 / 32
        });

        /**
         * A collection of cipher parameters.
         *
         * @property {WordArray} ciphertext The raw ciphertext.
         * @property {WordArray} key The key to this ciphertext.
         * @property {WordArray} iv The IV used in the ciphering operation.
         * @property {WordArray} salt The salt used with a key derivation function.
         * @property {Cipher} algorithm The cipher algorithm.
         * @property {Mode} mode The block mode used in the ciphering operation.
         * @property {Padding} padding The padding scheme used in the ciphering operation.
         * @property {number} blockSize The block size of the cipher.
         * @property {Format} formatter The default formatting strategy to convert this cipher params object to a string.
         */
        var CipherParams = C_lib.CipherParams = Base.extend({
          /**
           * Initializes a newly created cipher params object.
           *
           * @param {Object} cipherParams An object with any of the possible cipher parameters.
           *
           * @example
           *
           *     var cipherParams = CryptoJS.lib.CipherParams.create({
           *         ciphertext: ciphertextWordArray,
           *         key: keyWordArray,
           *         iv: ivWordArray,
           *         salt: saltWordArray,
           *         algorithm: CryptoJS.algo.AES,
           *         mode: CryptoJS.mode.CBC,
           *         padding: CryptoJS.pad.PKCS7,
           *         blockSize: 4,
           *         formatter: CryptoJS.format.OpenSSL
           *     });
           */
          init: function (cipherParams) {
            this.mixIn(cipherParams);
          },

          /**
           * Converts this cipher params object to a string.
           *
           * @param {Format} formatter (Optional) The formatting strategy to use.
           *
           * @return {string} The stringified cipher params.
           *
           * @throws Error If neither the formatter nor the default formatter is set.
           *
           * @example
           *
           *     var string = cipherParams + '';
           *     var string = cipherParams.toString();
           *     var string = cipherParams.toString(CryptoJS.format.OpenSSL);
           */
          toString: function (formatter) {
            return (formatter || this.formatter).stringify(this);
          }
        });

        /**
         * Format namespace.
         */
        var C_format = C.format = {};

        /**
         * OpenSSL formatting strategy.
         */
        var OpenSSLFormatter = C_format.OpenSSL = {
          /**
           * Converts a cipher params object to an OpenSSL-compatible string.
           *
           * @param {CipherParams} cipherParams The cipher params object.
           *
           * @return {string} The OpenSSL-compatible string.
           *
           * @static
           *
           * @example
           *
           *     var openSSLString = CryptoJS.format.OpenSSL.stringify(cipherParams);
           */
          stringify: function (cipherParams) {
            var wordArray;

            // Shortcuts
            var ciphertext = cipherParams.ciphertext;
            var salt = cipherParams.salt;

            // Format
            if (salt) {
              wordArray = WordArray.create([0x53616c74, 0x65645f5f]).concat(salt).concat(ciphertext);
            } else {
              wordArray = ciphertext;
            }

            return wordArray.toString(Base64);
          },

          /**
           * Converts an OpenSSL-compatible string to a cipher params object.
           *
           * @param {string} openSSLStr The OpenSSL-compatible string.
           *
           * @return {CipherParams} The cipher params object.
           *
           * @static
           *
           * @example
           *
           *     var cipherParams = CryptoJS.format.OpenSSL.parse(openSSLString);
           */
          parse: function (openSSLStr) {
            var salt;

            // Parse base64
            var ciphertext = Base64.parse(openSSLStr);

            // Shortcut
            var ciphertextWords = ciphertext.words;

            // Test for salt
            if (ciphertextWords[0] == 0x53616c74 && ciphertextWords[1] == 0x65645f5f) {
              // Extract salt
              salt = WordArray.create(ciphertextWords.slice(2, 4));

              // Remove salt from ciphertext
              ciphertextWords.splice(0, 4);
              ciphertext.sigBytes -= 16;
            }

            return CipherParams.create({ ciphertext: ciphertext, salt: salt });
          }
        };

        /**
         * A cipher wrapper that returns ciphertext as a serializable cipher params object.
         */
        var SerializableCipher = C_lib.SerializableCipher = Base.extend({
          /**
           * Configuration options.
           *
           * @property {Formatter} format The formatting strategy to convert cipher param objects to and from a string. Default: OpenSSL
           */
          cfg: Base.extend({
            format: OpenSSLFormatter
          }),

          /**
           * Encrypts a message.
           *
           * @param {Cipher} cipher The cipher algorithm to use.
           * @param {WordArray|string} message The message to encrypt.
           * @param {WordArray} key The key.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {CipherParams} A cipher params object.
           *
           * @static
           *
           * @example
           *
           *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key);
           *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
           *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
           */
          encrypt: function (cipher, message, key, cfg) {
            // Apply config defaults
            cfg = this.cfg.extend(cfg);

            // Encrypt
            var encryptor = cipher.createEncryptor(key, cfg);
            var ciphertext = encryptor.finalize(message);

            // Shortcut
            var cipherCfg = encryptor.cfg;

            // Create and return serializable cipher params
            return CipherParams.create({
              ciphertext: ciphertext,
              key: key,
              iv: cipherCfg.iv,
              algorithm: cipher,
              mode: cipherCfg.mode,
              padding: cipherCfg.padding,
              blockSize: cipher.blockSize,
              formatter: cfg.format
            });
          },

          /**
           * Decrypts serialized ciphertext.
           *
           * @param {Cipher} cipher The cipher algorithm to use.
           * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
           * @param {WordArray} key The key.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {WordArray} The plaintext.
           *
           * @static
           *
           * @example
           *
           *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, key, { iv: iv, format: CryptoJS.format.OpenSSL });
           *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, key, { iv: iv, format: CryptoJS.format.OpenSSL });
           */
          decrypt: function (cipher, ciphertext, key, cfg) {
            // Apply config defaults
            cfg = this.cfg.extend(cfg);

            // Convert string to CipherParams
            ciphertext = this._parse(ciphertext, cfg.format);

            // Decrypt
            var plaintext = cipher.createDecryptor(key, cfg).finalize(ciphertext.ciphertext);

            return plaintext;
          },

          /**
           * Converts serialized ciphertext to CipherParams,
           * else assumed CipherParams already and returns ciphertext unchanged.
           *
           * @param {CipherParams|string} ciphertext The ciphertext.
           * @param {Formatter} format The formatting strategy to use to parse serialized ciphertext.
           *
           * @return {CipherParams} The unserialized ciphertext.
           *
           * @static
           *
           * @example
           *
           *     var ciphertextParams = CryptoJS.lib.SerializableCipher._parse(ciphertextStringOrParams, format);
           */
          _parse: function (ciphertext, format) {
            if (typeof ciphertext == 'string') {
              return format.parse(ciphertext, this);
            } else {
              return ciphertext;
            }
          }
        });

        /**
         * Key derivation function namespace.
         */
        var C_kdf = C.kdf = {};

        /**
         * OpenSSL key derivation function.
         */
        var OpenSSLKdf = C_kdf.OpenSSL = {
          /**
           * Derives a key and IV from a password.
           *
           * @param {string} password The password to derive from.
           * @param {number} keySize The size in words of the key to generate.
           * @param {number} ivSize The size in words of the IV to generate.
           * @param {WordArray|string} salt (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
           *
           * @return {CipherParams} A cipher params object with the key, IV, and salt.
           *
           * @static
           *
           * @example
           *
           *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32);
           *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32, 'saltsalt');
           */
          execute: function (password, keySize, ivSize, salt, hasher) {
            // Generate random salt
            if (!salt) {
              salt = WordArray.random(64 / 8);
            }

            // Derive key and IV
            if (!hasher) {
              var key = EvpKDF.create({ keySize: keySize + ivSize }).compute(password, salt);
            } else {
              var key = EvpKDF.create({ keySize: keySize + ivSize, hasher: hasher }).compute(password, salt);
            }


            // Separate key and IV
            var iv = WordArray.create(key.words.slice(keySize), ivSize * 4);
            key.sigBytes = keySize * 4;

            // Return params
            return CipherParams.create({ key: key, iv: iv, salt: salt });
          }
        };

        /**
         * A serializable cipher wrapper that derives the key from a password,
         * and returns ciphertext as a serializable cipher params object.
         */
        var PasswordBasedCipher = C_lib.PasswordBasedCipher = SerializableCipher.extend({
          /**
           * Configuration options.
           *
           * @property {KDF} kdf The key derivation function to use to generate a key and IV from a password. Default: OpenSSL
           */
          cfg: SerializableCipher.cfg.extend({
            kdf: OpenSSLKdf
          }),

          /**
           * Encrypts a message using a password.
           *
           * @param {Cipher} cipher The cipher algorithm to use.
           * @param {WordArray|string} message The message to encrypt.
           * @param {string} password The password.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {CipherParams} A cipher params object.
           *
           * @static
           *
           * @example
           *
           *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password');
           *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password', { format: CryptoJS.format.OpenSSL });
           */
          encrypt: function (cipher, message, password, cfg) {
            // Apply config defaults
            cfg = this.cfg.extend(cfg);

            // Derive key and other params
            var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, cfg.salt, cfg.hasher);

            // Add IV to config
            cfg.iv = derivedParams.iv;

            // Encrypt
            var ciphertext = SerializableCipher.encrypt.call(this, cipher, message, derivedParams.key, cfg);

            // Mix in derived params
            ciphertext.mixIn(derivedParams);

            return ciphertext;
          },

          /**
           * Decrypts serialized ciphertext using a password.
           *
           * @param {Cipher} cipher The cipher algorithm to use.
           * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
           * @param {string} password The password.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {WordArray} The plaintext.
           *
           * @static
           *
           * @example
           *
           *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, 'password', { format: CryptoJS.format.OpenSSL });
           *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, 'password', { format: CryptoJS.format.OpenSSL });
           */
          decrypt: function (cipher, ciphertext, password, cfg) {
            // Apply config defaults
            cfg = this.cfg.extend(cfg);

            // Convert string to CipherParams
            ciphertext = this._parse(ciphertext, cfg.format);

            // Derive key and other params
            var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, ciphertext.salt, cfg.hasher);

            // Add IV to config
            cfg.iv = derivedParams.iv;

            // Decrypt
            var plaintext = SerializableCipher.decrypt.call(this, cipher, ciphertext, derivedParams.key, cfg);

            return plaintext;
          }
        });
      }());


      /**
       * Cipher Feedback block mode.
       */
      CryptoJS.mode.CFB = (function () {
        var CFB = CryptoJS.lib.BlockCipherMode.extend();

        CFB.Encryptor = CFB.extend({
          processBlock: function (words, offset) {
            // Shortcuts
            var cipher = this._cipher;
            var blockSize = cipher.blockSize;

            generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);

            // Remember this block to use with next block
            this._prevBlock = words.slice(offset, offset + blockSize);
          }
        });

        CFB.Decryptor = CFB.extend({
          processBlock: function (words, offset) {
            // Shortcuts
            var cipher = this._cipher;
            var blockSize = cipher.blockSize;

            // Remember this block to use with next block
            var thisBlock = words.slice(offset, offset + blockSize);

            generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);

            // This block becomes the previous block
            this._prevBlock = thisBlock;
          }
        });

        function generateKeystreamAndEncrypt(words, offset, blockSize, cipher) {
          var keystream;

          // Shortcut
          var iv = this._iv;

          // Generate keystream
          if (iv) {
            keystream = iv.slice(0);

            // Remove IV for subsequent blocks
            this._iv = undefined;
          } else {
            keystream = this._prevBlock;
          }
          cipher.encryptBlock(keystream, 0);

          // Encrypt
          for (var i = 0; i < blockSize; i++) {
            words[offset + i] ^= keystream[i];
          }
        }

        return CFB;
      }());


      /**
       * Counter block mode.
       */
      CryptoJS.mode.CTR = (function () {
        var CTR = CryptoJS.lib.BlockCipherMode.extend();

        var Encryptor = CTR.Encryptor = CTR.extend({
          processBlock: function (words, offset) {
            // Shortcuts
            var cipher = this._cipher;
            var blockSize = cipher.blockSize;
            var iv = this._iv;
            var counter = this._counter;

            // Generate keystream
            if (iv) {
              counter = this._counter = iv.slice(0);

              // Remove IV for subsequent blocks
              this._iv = undefined;
            }
            var keystream = counter.slice(0);
            cipher.encryptBlock(keystream, 0);

            // Increment counter
            counter[blockSize - 1] = (counter[blockSize - 1] + 1) | 0;

            // Encrypt
            for (var i = 0; i < blockSize; i++) {
              words[offset + i] ^= keystream[i];
            }
          }
        });

        CTR.Decryptor = Encryptor;

        return CTR;
      }());


      /** @preserve
       * Counter block mode compatible with  Dr Brian Gladman fileenc.c
       * derived from CryptoJS.mode.CTR
       * Jan Hruby jhruby.web@gmail.com
       */
      CryptoJS.mode.CTRGladman = (function () {
        var CTRGladman = CryptoJS.lib.BlockCipherMode.extend();

        function incWord(word) {
          if (((word >> 24) & 0xff) === 0xff) { //overflow
            var b1 = (word >> 16) & 0xff;
            var b2 = (word >> 8) & 0xff;
            var b3 = word & 0xff;

            if (b1 === 0xff) // overflow b1
            {
              b1 = 0;
              if (b2 === 0xff) {
                b2 = 0;
                if (b3 === 0xff) {
                  b3 = 0;
                } else {
                  ++b3;
                }
              } else {
                ++b2;
              }
            } else {
              ++b1;
            }

            word = 0;
            word += (b1 << 16);
            word += (b2 << 8);
            word += b3;
          } else {
            word += (0x01 << 24);
          }
          return word;
        }

        function incCounter(counter) {
          if ((counter[0] = incWord(counter[0])) === 0) {
            // encr_data in fileenc.c from  Dr Brian Gladman's counts only with DWORD j < 8
            counter[1] = incWord(counter[1]);
          }
          return counter;
        }

        var Encryptor = CTRGladman.Encryptor = CTRGladman.extend({
          processBlock: function (words, offset) {
            // Shortcuts
            var cipher = this._cipher;
            var blockSize = cipher.blockSize;
            var iv = this._iv;
            var counter = this._counter;

            // Generate keystream
            if (iv) {
              counter = this._counter = iv.slice(0);

              // Remove IV for subsequent blocks
              this._iv = undefined;
            }

            incCounter(counter);

            var keystream = counter.slice(0);
            cipher.encryptBlock(keystream, 0);

            // Encrypt
            for (var i = 0; i < blockSize; i++) {
              words[offset + i] ^= keystream[i];
            }
          }
        });

        CTRGladman.Decryptor = Encryptor;

        return CTRGladman;
      }());


      /**
       * Output Feedback block mode.
       */
      CryptoJS.mode.OFB = (function () {
        var OFB = CryptoJS.lib.BlockCipherMode.extend();

        var Encryptor = OFB.Encryptor = OFB.extend({
          processBlock: function (words, offset) {
            // Shortcuts
            var cipher = this._cipher;
            var blockSize = cipher.blockSize;
            var iv = this._iv;
            var keystream = this._keystream;

            // Generate keystream
            if (iv) {
              keystream = this._keystream = iv.slice(0);

              // Remove IV for subsequent blocks
              this._iv = undefined;
            }
            cipher.encryptBlock(keystream, 0);

            // Encrypt
            for (var i = 0; i < blockSize; i++) {
              words[offset + i] ^= keystream[i];
            }
          }
        });

        OFB.Decryptor = Encryptor;

        return OFB;
      }());


      /**
       * Electronic Codebook block mode.
       */
      CryptoJS.mode.ECB = (function () {
        var ECB = CryptoJS.lib.BlockCipherMode.extend();

        ECB.Encryptor = ECB.extend({
          processBlock: function (words, offset) {
            this._cipher.encryptBlock(words, offset);
          }
        });

        ECB.Decryptor = ECB.extend({
          processBlock: function (words, offset) {
            this._cipher.decryptBlock(words, offset);
          }
        });

        return ECB;
      }());


      /**
       * ANSI X.923 padding strategy.
       */
      CryptoJS.pad.AnsiX923 = {
        pad: function (data, blockSize) {
          // Shortcuts
          var dataSigBytes = data.sigBytes;
          var blockSizeBytes = blockSize * 4;

          // Count padding bytes
          var nPaddingBytes = blockSizeBytes - dataSigBytes % blockSizeBytes;

          // Compute last byte position
          var lastBytePos = dataSigBytes + nPaddingBytes - 1;

          // Pad
          data.clamp();
          data.words[lastBytePos >>> 2] |= nPaddingBytes << (24 - (lastBytePos % 4) * 8);
          data.sigBytes += nPaddingBytes;
        },

        unpad: function (data) {
          // Get number of padding bytes from last byte
          var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

          // Remove padding
          data.sigBytes -= nPaddingBytes;
        }
      };


      /**
       * ISO 10126 padding strategy.
       */
      CryptoJS.pad.Iso10126 = {
        pad: function (data, blockSize) {
          // Shortcut
          var blockSizeBytes = blockSize * 4;

          // Count padding bytes
          var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;

          // Pad
          data.concat(CryptoJS.lib.WordArray.random(nPaddingBytes - 1)).concat(CryptoJS.lib.WordArray.create([nPaddingBytes << 24], 1));
        },

        unpad: function (data) {
          // Get number of padding bytes from last byte
          var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

          // Remove padding
          data.sigBytes -= nPaddingBytes;
        }
      };


      /**
       * ISO/IEC 9797-1 Padding Method 2.
       */
      CryptoJS.pad.Iso97971 = {
        pad: function (data, blockSize) {
          // Add 0x80 byte
          data.concat(CryptoJS.lib.WordArray.create([0x80000000], 1));

          // Zero pad the rest
          CryptoJS.pad.ZeroPadding.pad(data, blockSize);
        },

        unpad: function (data) {
          // Remove zero padding
          CryptoJS.pad.ZeroPadding.unpad(data);

          // Remove one more byte -- the 0x80 byte
          data.sigBytes--;
        }
      };


      /**
       * Zero padding strategy.
       */
      CryptoJS.pad.ZeroPadding = {
        pad: function (data, blockSize) {
          // Shortcut
          var blockSizeBytes = blockSize * 4;

          // Pad
          data.clamp();
          data.sigBytes += blockSizeBytes - ((data.sigBytes % blockSizeBytes) || blockSizeBytes);
        },

        unpad: function (data) {
          // Shortcut
          var dataWords = data.words;

          // Unpad
          var i = data.sigBytes - 1;
          for (var i = data.sigBytes - 1; i >= 0; i--) {
            if (((dataWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff)) {
              data.sigBytes = i + 1;
              break;
            }
          }
        }
      };


      /**
       * A noop padding strategy.
       */
      CryptoJS.pad.NoPadding = {
        pad: function () {
        },

        unpad: function () {
        }
      };


      (function (undefined$1) {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var CipherParams = C_lib.CipherParams;
        var C_enc = C.enc;
        var Hex = C_enc.Hex;
        var C_format = C.format;

        C_format.Hex = {
          /**
           * Converts the ciphertext of a cipher params object to a hexadecimally encoded string.
           *
           * @param {CipherParams} cipherParams The cipher params object.
           *
           * @return {string} The hexadecimally encoded string.
           *
           * @static
           *
           * @example
           *
           *     var hexString = CryptoJS.format.Hex.stringify(cipherParams);
           */
          stringify: function (cipherParams) {
            return cipherParams.ciphertext.toString(Hex);
          },

          /**
           * Converts a hexadecimally encoded ciphertext string to a cipher params object.
           *
           * @param {string} input The hexadecimally encoded string.
           *
           * @return {CipherParams} The cipher params object.
           *
           * @static
           *
           * @example
           *
           *     var cipherParams = CryptoJS.format.Hex.parse(hexString);
           */
          parse: function (input) {
            var ciphertext = Hex.parse(input);
            return CipherParams.create({ ciphertext: ciphertext });
          }
        };
      }());


      (function () {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var BlockCipher = C_lib.BlockCipher;
        var C_algo = C.algo;

        // Lookup tables
        var SBOX = [];
        var INV_SBOX = [];
        var SUB_MIX_0 = [];
        var SUB_MIX_1 = [];
        var SUB_MIX_2 = [];
        var SUB_MIX_3 = [];
        var INV_SUB_MIX_0 = [];
        var INV_SUB_MIX_1 = [];
        var INV_SUB_MIX_2 = [];
        var INV_SUB_MIX_3 = [];

        // Compute lookup tables
        (function () {
          // Compute double table
          var d = [];
          for (var i = 0; i < 256; i++) {
            if (i < 128) {
              d[i] = i << 1;
            } else {
              d[i] = (i << 1) ^ 0x11b;
            }
          }

          // Walk GF(2^8)
          var x = 0;
          var xi = 0;
          for (var i = 0; i < 256; i++) {
            // Compute sbox
            var sx = xi ^ (xi << 1) ^ (xi << 2) ^ (xi << 3) ^ (xi << 4);
            sx = (sx >>> 8) ^ (sx & 0xff) ^ 0x63;
            SBOX[x] = sx;
            INV_SBOX[sx] = x;

            // Compute multiplication
            var x2 = d[x];
            var x4 = d[x2];
            var x8 = d[x4];

            // Compute sub bytes, mix columns tables
            var t = (d[sx] * 0x101) ^ (sx * 0x1010100);
            SUB_MIX_0[x] = (t << 24) | (t >>> 8);
            SUB_MIX_1[x] = (t << 16) | (t >>> 16);
            SUB_MIX_2[x] = (t << 8) | (t >>> 24);
            SUB_MIX_3[x] = t;

            // Compute inv sub bytes, inv mix columns tables
            var t = (x8 * 0x1010101) ^ (x4 * 0x10001) ^ (x2 * 0x101) ^ (x * 0x1010100);
            INV_SUB_MIX_0[sx] = (t << 24) | (t >>> 8);
            INV_SUB_MIX_1[sx] = (t << 16) | (t >>> 16);
            INV_SUB_MIX_2[sx] = (t << 8) | (t >>> 24);
            INV_SUB_MIX_3[sx] = t;

            // Compute next counter
            if (!x) {
              x = xi = 1;
            } else {
              x = x2 ^ d[d[d[x8 ^ x2]]];
              xi ^= d[d[xi]];
            }
          }
        }());

        // Precomputed Rcon lookup
        var RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

        /**
         * AES block cipher algorithm.
         */
        var AES = C_algo.AES = BlockCipher.extend({
          _doReset: function () {
            var t;

            // Skip reset of nRounds has been set before and key did not change
            if (this._nRounds && this._keyPriorReset === this._key) {
              return;
            }

            // Shortcuts
            var key = this._keyPriorReset = this._key;
            var keyWords = key.words;
            var keySize = key.sigBytes / 4;

            // Compute number of rounds
            var nRounds = this._nRounds = keySize + 6;

            // Compute number of key schedule rows
            var ksRows = (nRounds + 1) * 4;

            // Compute key schedule
            var keySchedule = this._keySchedule = [];
            for (var ksRow = 0; ksRow < ksRows; ksRow++) {
              if (ksRow < keySize) {
                keySchedule[ksRow] = keyWords[ksRow];
              } else {
                t = keySchedule[ksRow - 1];

                if (!(ksRow % keySize)) {
                  // Rot word
                  t = (t << 8) | (t >>> 24);

                  // Sub word
                  t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];

                  // Mix Rcon
                  t ^= RCON[(ksRow / keySize) | 0] << 24;
                } else if (keySize > 6 && ksRow % keySize == 4) {
                  // Sub word
                  t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];
                }

                keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t;
              }
            }

            // Compute inv key schedule
            var invKeySchedule = this._invKeySchedule = [];
            for (var invKsRow = 0; invKsRow < ksRows; invKsRow++) {
              var ksRow = ksRows - invKsRow;

              if (invKsRow % 4) {
                var t = keySchedule[ksRow];
              } else {
                var t = keySchedule[ksRow - 4];
              }

              if (invKsRow < 4 || ksRow <= 4) {
                invKeySchedule[invKsRow] = t;
              } else {
                invKeySchedule[invKsRow] = INV_SUB_MIX_0[SBOX[t >>> 24]] ^ INV_SUB_MIX_1[SBOX[(t >>> 16) & 0xff]] ^
                  INV_SUB_MIX_2[SBOX[(t >>> 8) & 0xff]] ^ INV_SUB_MIX_3[SBOX[t & 0xff]];
              }
            }
          },

          encryptBlock: function (M, offset) {
            this._doCryptBlock(M, offset, this._keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX);
          },

          decryptBlock: function (M, offset) {
            // Swap 2nd and 4th rows
            var t = M[offset + 1];
            M[offset + 1] = M[offset + 3];
            M[offset + 3] = t;

            this._doCryptBlock(M, offset, this._invKeySchedule, INV_SUB_MIX_0, INV_SUB_MIX_1, INV_SUB_MIX_2, INV_SUB_MIX_3, INV_SBOX);

            // Inv swap 2nd and 4th rows
            var t = M[offset + 1];
            M[offset + 1] = M[offset + 3];
            M[offset + 3] = t;
          },

          _doCryptBlock: function (M, offset, keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX) {
            // Shortcut
            var nRounds = this._nRounds;

            // Get input, add round key
            var s0 = M[offset] ^ keySchedule[0];
            var s1 = M[offset + 1] ^ keySchedule[1];
            var s2 = M[offset + 2] ^ keySchedule[2];
            var s3 = M[offset + 3] ^ keySchedule[3];

            // Key schedule row counter
            var ksRow = 4;

            // Rounds
            for (var round = 1; round < nRounds; round++) {
              // Shift rows, sub bytes, mix columns, add round key
              var t0 = SUB_MIX_0[s0 >>> 24] ^ SUB_MIX_1[(s1 >>> 16) & 0xff] ^ SUB_MIX_2[(s2 >>> 8) & 0xff] ^ SUB_MIX_3[s3 & 0xff] ^ keySchedule[ksRow++];
              var t1 = SUB_MIX_0[s1 >>> 24] ^ SUB_MIX_1[(s2 >>> 16) & 0xff] ^ SUB_MIX_2[(s3 >>> 8) & 0xff] ^ SUB_MIX_3[s0 & 0xff] ^ keySchedule[ksRow++];
              var t2 = SUB_MIX_0[s2 >>> 24] ^ SUB_MIX_1[(s3 >>> 16) & 0xff] ^ SUB_MIX_2[(s0 >>> 8) & 0xff] ^ SUB_MIX_3[s1 & 0xff] ^ keySchedule[ksRow++];
              var t3 = SUB_MIX_0[s3 >>> 24] ^ SUB_MIX_1[(s0 >>> 16) & 0xff] ^ SUB_MIX_2[(s1 >>> 8) & 0xff] ^ SUB_MIX_3[s2 & 0xff] ^ keySchedule[ksRow++];

              // Update state
              s0 = t0;
              s1 = t1;
              s2 = t2;
              s3 = t3;
            }

            // Shift rows, sub bytes, add round key
            var t0 = ((SBOX[s0 >>> 24] << 24) | (SBOX[(s1 >>> 16) & 0xff] << 16) | (SBOX[(s2 >>> 8) & 0xff] << 8) | SBOX[s3 & 0xff]) ^ keySchedule[ksRow++];
            var t1 = ((SBOX[s1 >>> 24] << 24) | (SBOX[(s2 >>> 16) & 0xff] << 16) | (SBOX[(s3 >>> 8) & 0xff] << 8) | SBOX[s0 & 0xff]) ^ keySchedule[ksRow++];
            var t2 = ((SBOX[s2 >>> 24] << 24) | (SBOX[(s3 >>> 16) & 0xff] << 16) | (SBOX[(s0 >>> 8) & 0xff] << 8) | SBOX[s1 & 0xff]) ^ keySchedule[ksRow++];
            var t3 = ((SBOX[s3 >>> 24] << 24) | (SBOX[(s0 >>> 16) & 0xff] << 16) | (SBOX[(s1 >>> 8) & 0xff] << 8) | SBOX[s2 & 0xff]) ^ keySchedule[ksRow++];

            // Set output
            M[offset] = t0;
            M[offset + 1] = t1;
            M[offset + 2] = t2;
            M[offset + 3] = t3;
          },

          keySize: 256 / 32
        });

        /**
         * Shortcut functions to the cipher's object interface.
         *
         * @example
         *
         *     var ciphertext = CryptoJS.AES.encrypt(message, key, cfg);
         *     var plaintext  = CryptoJS.AES.decrypt(ciphertext, key, cfg);
         */
        C.AES = BlockCipher._createHelper(AES);
      }());


      (function () {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var BlockCipher = C_lib.BlockCipher;
        var C_algo = C.algo;

        // Permuted Choice 1 constants
        var PC1 = [
          57, 49, 41, 33, 25, 17, 9, 1,
          58, 50, 42, 34, 26, 18, 10, 2,
          59, 51, 43, 35, 27, 19, 11, 3,
          60, 52, 44, 36, 63, 55, 47, 39,
          31, 23, 15, 7, 62, 54, 46, 38,
          30, 22, 14, 6, 61, 53, 45, 37,
          29, 21, 13, 5, 28, 20, 12, 4
        ];

        // Permuted Choice 2 constants
        var PC2 = [
          14, 17, 11, 24, 1, 5,
          3, 28, 15, 6, 21, 10,
          23, 19, 12, 4, 26, 8,
          16, 7, 27, 20, 13, 2,
          41, 52, 31, 37, 47, 55,
          30, 40, 51, 45, 33, 48,
          44, 49, 39, 56, 34, 53,
          46, 42, 50, 36, 29, 32
        ];

        // Cumulative bit shift constants
        var BIT_SHIFTS = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28];

        // SBOXes and round permutation constants
        var SBOX_P = [
          {
            0x0: 0x808200,
            0x10000000: 0x8000,
            0x20000000: 0x808002,
            0x30000000: 0x2,
            0x40000000: 0x200,
            0x50000000: 0x808202,
            0x60000000: 0x800202,
            0x70000000: 0x800000,
            0x80000000: 0x202,
            0x90000000: 0x800200,
            0xa0000000: 0x8200,
            0xb0000000: 0x808000,
            0xc0000000: 0x8002,
            0xd0000000: 0x800002,
            0xe0000000: 0x0,
            0xf0000000: 0x8202,
            0x8000000: 0x0,
            0x18000000: 0x808202,
            0x28000000: 0x8202,
            0x38000000: 0x8000,
            0x48000000: 0x808200,
            0x58000000: 0x200,
            0x68000000: 0x808002,
            0x78000000: 0x2,
            0x88000000: 0x800200,
            0x98000000: 0x8200,
            0xa8000000: 0x808000,
            0xb8000000: 0x800202,
            0xc8000000: 0x800002,
            0xd8000000: 0x8002,
            0xe8000000: 0x202,
            0xf8000000: 0x800000,
            0x1: 0x8000,
            0x10000001: 0x2,
            0x20000001: 0x808200,
            0x30000001: 0x800000,
            0x40000001: 0x808002,
            0x50000001: 0x8200,
            0x60000001: 0x200,
            0x70000001: 0x800202,
            0x80000001: 0x808202,
            0x90000001: 0x808000,
            0xa0000001: 0x800002,
            0xb0000001: 0x8202,
            0xc0000001: 0x202,
            0xd0000001: 0x800200,
            0xe0000001: 0x8002,
            0xf0000001: 0x0,
            0x8000001: 0x808202,
            0x18000001: 0x808000,
            0x28000001: 0x800000,
            0x38000001: 0x200,
            0x48000001: 0x8000,
            0x58000001: 0x800002,
            0x68000001: 0x2,
            0x78000001: 0x8202,
            0x88000001: 0x8002,
            0x98000001: 0x800202,
            0xa8000001: 0x202,
            0xb8000001: 0x808200,
            0xc8000001: 0x800200,
            0xd8000001: 0x0,
            0xe8000001: 0x8200,
            0xf8000001: 0x808002
          },
          {
            0x0: 0x40084010,
            0x1000000: 0x4000,
            0x2000000: 0x80000,
            0x3000000: 0x40080010,
            0x4000000: 0x40000010,
            0x5000000: 0x40084000,
            0x6000000: 0x40004000,
            0x7000000: 0x10,
            0x8000000: 0x84000,
            0x9000000: 0x40004010,
            0xa000000: 0x40000000,
            0xb000000: 0x84010,
            0xc000000: 0x80010,
            0xd000000: 0x0,
            0xe000000: 0x4010,
            0xf000000: 0x40080000,
            0x800000: 0x40004000,
            0x1800000: 0x84010,
            0x2800000: 0x10,
            0x3800000: 0x40004010,
            0x4800000: 0x40084010,
            0x5800000: 0x40000000,
            0x6800000: 0x80000,
            0x7800000: 0x40080010,
            0x8800000: 0x80010,
            0x9800000: 0x0,
            0xa800000: 0x4000,
            0xb800000: 0x40080000,
            0xc800000: 0x40000010,
            0xd800000: 0x84000,
            0xe800000: 0x40084000,
            0xf800000: 0x4010,
            0x10000000: 0x0,
            0x11000000: 0x40080010,
            0x12000000: 0x40004010,
            0x13000000: 0x40084000,
            0x14000000: 0x40080000,
            0x15000000: 0x10,
            0x16000000: 0x84010,
            0x17000000: 0x4000,
            0x18000000: 0x4010,
            0x19000000: 0x80000,
            0x1a000000: 0x80010,
            0x1b000000: 0x40000010,
            0x1c000000: 0x84000,
            0x1d000000: 0x40004000,
            0x1e000000: 0x40000000,
            0x1f000000: 0x40084010,
            0x10800000: 0x84010,
            0x11800000: 0x80000,
            0x12800000: 0x40080000,
            0x13800000: 0x4000,
            0x14800000: 0x40004000,
            0x15800000: 0x40084010,
            0x16800000: 0x10,
            0x17800000: 0x40000000,
            0x18800000: 0x40084000,
            0x19800000: 0x40000010,
            0x1a800000: 0x40004010,
            0x1b800000: 0x80010,
            0x1c800000: 0x0,
            0x1d800000: 0x4010,
            0x1e800000: 0x40080010,
            0x1f800000: 0x84000
          },
          {
            0x0: 0x104,
            0x100000: 0x0,
            0x200000: 0x4000100,
            0x300000: 0x10104,
            0x400000: 0x10004,
            0x500000: 0x4000004,
            0x600000: 0x4010104,
            0x700000: 0x4010000,
            0x800000: 0x4000000,
            0x900000: 0x4010100,
            0xa00000: 0x10100,
            0xb00000: 0x4010004,
            0xc00000: 0x4000104,
            0xd00000: 0x10000,
            0xe00000: 0x4,
            0xf00000: 0x100,
            0x80000: 0x4010100,
            0x180000: 0x4010004,
            0x280000: 0x0,
            0x380000: 0x4000100,
            0x480000: 0x4000004,
            0x580000: 0x10000,
            0x680000: 0x10004,
            0x780000: 0x104,
            0x880000: 0x4,
            0x980000: 0x100,
            0xa80000: 0x4010000,
            0xb80000: 0x10104,
            0xc80000: 0x10100,
            0xd80000: 0x4000104,
            0xe80000: 0x4010104,
            0xf80000: 0x4000000,
            0x1000000: 0x4010100,
            0x1100000: 0x10004,
            0x1200000: 0x10000,
            0x1300000: 0x4000100,
            0x1400000: 0x100,
            0x1500000: 0x4010104,
            0x1600000: 0x4000004,
            0x1700000: 0x0,
            0x1800000: 0x4000104,
            0x1900000: 0x4000000,
            0x1a00000: 0x4,
            0x1b00000: 0x10100,
            0x1c00000: 0x4010000,
            0x1d00000: 0x104,
            0x1e00000: 0x10104,
            0x1f00000: 0x4010004,
            0x1080000: 0x4000000,
            0x1180000: 0x104,
            0x1280000: 0x4010100,
            0x1380000: 0x0,
            0x1480000: 0x10004,
            0x1580000: 0x4000100,
            0x1680000: 0x100,
            0x1780000: 0x4010004,
            0x1880000: 0x10000,
            0x1980000: 0x4010104,
            0x1a80000: 0x10104,
            0x1b80000: 0x4000004,
            0x1c80000: 0x4000104,
            0x1d80000: 0x4010000,
            0x1e80000: 0x4,
            0x1f80000: 0x10100
          },
          {
            0x0: 0x80401000,
            0x10000: 0x80001040,
            0x20000: 0x401040,
            0x30000: 0x80400000,
            0x40000: 0x0,
            0x50000: 0x401000,
            0x60000: 0x80000040,
            0x70000: 0x400040,
            0x80000: 0x80000000,
            0x90000: 0x400000,
            0xa0000: 0x40,
            0xb0000: 0x80001000,
            0xc0000: 0x80400040,
            0xd0000: 0x1040,
            0xe0000: 0x1000,
            0xf0000: 0x80401040,
            0x8000: 0x80001040,
            0x18000: 0x40,
            0x28000: 0x80400040,
            0x38000: 0x80001000,
            0x48000: 0x401000,
            0x58000: 0x80401040,
            0x68000: 0x0,
            0x78000: 0x80400000,
            0x88000: 0x1000,
            0x98000: 0x80401000,
            0xa8000: 0x400000,
            0xb8000: 0x1040,
            0xc8000: 0x80000000,
            0xd8000: 0x400040,
            0xe8000: 0x401040,
            0xf8000: 0x80000040,
            0x100000: 0x400040,
            0x110000: 0x401000,
            0x120000: 0x80000040,
            0x130000: 0x0,
            0x140000: 0x1040,
            0x150000: 0x80400040,
            0x160000: 0x80401000,
            0x170000: 0x80001040,
            0x180000: 0x80401040,
            0x190000: 0x80000000,
            0x1a0000: 0x80400000,
            0x1b0000: 0x401040,
            0x1c0000: 0x80001000,
            0x1d0000: 0x400000,
            0x1e0000: 0x40,
            0x1f0000: 0x1000,
            0x108000: 0x80400000,
            0x118000: 0x80401040,
            0x128000: 0x0,
            0x138000: 0x401000,
            0x148000: 0x400040,
            0x158000: 0x80000000,
            0x168000: 0x80001040,
            0x178000: 0x40,
            0x188000: 0x80000040,
            0x198000: 0x1000,
            0x1a8000: 0x80001000,
            0x1b8000: 0x80400040,
            0x1c8000: 0x1040,
            0x1d8000: 0x80401000,
            0x1e8000: 0x400000,
            0x1f8000: 0x401040
          },
          {
            0x0: 0x80,
            0x1000: 0x1040000,
            0x2000: 0x40000,
            0x3000: 0x20000000,
            0x4000: 0x20040080,
            0x5000: 0x1000080,
            0x6000: 0x21000080,
            0x7000: 0x40080,
            0x8000: 0x1000000,
            0x9000: 0x20040000,
            0xa000: 0x20000080,
            0xb000: 0x21040080,
            0xc000: 0x21040000,
            0xd000: 0x0,
            0xe000: 0x1040080,
            0xf000: 0x21000000,
            0x800: 0x1040080,
            0x1800: 0x21000080,
            0x2800: 0x80,
            0x3800: 0x1040000,
            0x4800: 0x40000,
            0x5800: 0x20040080,
            0x6800: 0x21040000,
            0x7800: 0x20000000,
            0x8800: 0x20040000,
            0x9800: 0x0,
            0xa800: 0x21040080,
            0xb800: 0x1000080,
            0xc800: 0x20000080,
            0xd800: 0x21000000,
            0xe800: 0x1000000,
            0xf800: 0x40080,
            0x10000: 0x40000,
            0x11000: 0x80,
            0x12000: 0x20000000,
            0x13000: 0x21000080,
            0x14000: 0x1000080,
            0x15000: 0x21040000,
            0x16000: 0x20040080,
            0x17000: 0x1000000,
            0x18000: 0x21040080,
            0x19000: 0x21000000,
            0x1a000: 0x1040000,
            0x1b000: 0x20040000,
            0x1c000: 0x40080,
            0x1d000: 0x20000080,
            0x1e000: 0x0,
            0x1f000: 0x1040080,
            0x10800: 0x21000080,
            0x11800: 0x1000000,
            0x12800: 0x1040000,
            0x13800: 0x20040080,
            0x14800: 0x20000000,
            0x15800: 0x1040080,
            0x16800: 0x80,
            0x17800: 0x21040000,
            0x18800: 0x40080,
            0x19800: 0x21040080,
            0x1a800: 0x0,
            0x1b800: 0x21000000,
            0x1c800: 0x1000080,
            0x1d800: 0x40000,
            0x1e800: 0x20040000,
            0x1f800: 0x20000080
          },
          {
            0x0: 0x10000008,
            0x100: 0x2000,
            0x200: 0x10200000,
            0x300: 0x10202008,
            0x400: 0x10002000,
            0x500: 0x200000,
            0x600: 0x200008,
            0x700: 0x10000000,
            0x800: 0x0,
            0x900: 0x10002008,
            0xa00: 0x202000,
            0xb00: 0x8,
            0xc00: 0x10200008,
            0xd00: 0x202008,
            0xe00: 0x2008,
            0xf00: 0x10202000,
            0x80: 0x10200000,
            0x180: 0x10202008,
            0x280: 0x8,
            0x380: 0x200000,
            0x480: 0x202008,
            0x580: 0x10000008,
            0x680: 0x10002000,
            0x780: 0x2008,
            0x880: 0x200008,
            0x980: 0x2000,
            0xa80: 0x10002008,
            0xb80: 0x10200008,
            0xc80: 0x0,
            0xd80: 0x10202000,
            0xe80: 0x202000,
            0xf80: 0x10000000,
            0x1000: 0x10002000,
            0x1100: 0x10200008,
            0x1200: 0x10202008,
            0x1300: 0x2008,
            0x1400: 0x200000,
            0x1500: 0x10000000,
            0x1600: 0x10000008,
            0x1700: 0x202000,
            0x1800: 0x202008,
            0x1900: 0x0,
            0x1a00: 0x8,
            0x1b00: 0x10200000,
            0x1c00: 0x2000,
            0x1d00: 0x10002008,
            0x1e00: 0x10202000,
            0x1f00: 0x200008,
            0x1080: 0x8,
            0x1180: 0x202000,
            0x1280: 0x200000,
            0x1380: 0x10000008,
            0x1480: 0x10002000,
            0x1580: 0x2008,
            0x1680: 0x10202008,
            0x1780: 0x10200000,
            0x1880: 0x10202000,
            0x1980: 0x10200008,
            0x1a80: 0x2000,
            0x1b80: 0x202008,
            0x1c80: 0x200008,
            0x1d80: 0x0,
            0x1e80: 0x10000000,
            0x1f80: 0x10002008
          },
          {
            0x0: 0x100000,
            0x10: 0x2000401,
            0x20: 0x400,
            0x30: 0x100401,
            0x40: 0x2100401,
            0x50: 0x0,
            0x60: 0x1,
            0x70: 0x2100001,
            0x80: 0x2000400,
            0x90: 0x100001,
            0xa0: 0x2000001,
            0xb0: 0x2100400,
            0xc0: 0x2100000,
            0xd0: 0x401,
            0xe0: 0x100400,
            0xf0: 0x2000000,
            0x8: 0x2100001,
            0x18: 0x0,
            0x28: 0x2000401,
            0x38: 0x2100400,
            0x48: 0x100000,
            0x58: 0x2000001,
            0x68: 0x2000000,
            0x78: 0x401,
            0x88: 0x100401,
            0x98: 0x2000400,
            0xa8: 0x2100000,
            0xb8: 0x100001,
            0xc8: 0x400,
            0xd8: 0x2100401,
            0xe8: 0x1,
            0xf8: 0x100400,
            0x100: 0x2000000,
            0x110: 0x100000,
            0x120: 0x2000401,
            0x130: 0x2100001,
            0x140: 0x100001,
            0x150: 0x2000400,
            0x160: 0x2100400,
            0x170: 0x100401,
            0x180: 0x401,
            0x190: 0x2100401,
            0x1a0: 0x100400,
            0x1b0: 0x1,
            0x1c0: 0x0,
            0x1d0: 0x2100000,
            0x1e0: 0x2000001,
            0x1f0: 0x400,
            0x108: 0x100400,
            0x118: 0x2000401,
            0x128: 0x2100001,
            0x138: 0x1,
            0x148: 0x2000000,
            0x158: 0x100000,
            0x168: 0x401,
            0x178: 0x2100400,
            0x188: 0x2000001,
            0x198: 0x2100000,
            0x1a8: 0x0,
            0x1b8: 0x2100401,
            0x1c8: 0x100401,
            0x1d8: 0x400,
            0x1e8: 0x2000400,
            0x1f8: 0x100001
          },
          {
            0x0: 0x8000820,
            0x1: 0x20000,
            0x2: 0x8000000,
            0x3: 0x20,
            0x4: 0x20020,
            0x5: 0x8020820,
            0x6: 0x8020800,
            0x7: 0x800,
            0x8: 0x8020000,
            0x9: 0x8000800,
            0xa: 0x20800,
            0xb: 0x8020020,
            0xc: 0x820,
            0xd: 0x0,
            0xe: 0x8000020,
            0xf: 0x20820,
            0x80000000: 0x800,
            0x80000001: 0x8020820,
            0x80000002: 0x8000820,
            0x80000003: 0x8000000,
            0x80000004: 0x8020000,
            0x80000005: 0x20800,
            0x80000006: 0x20820,
            0x80000007: 0x20,
            0x80000008: 0x8000020,
            0x80000009: 0x820,
            0x8000000a: 0x20020,
            0x8000000b: 0x8020800,
            0x8000000c: 0x0,
            0x8000000d: 0x8020020,
            0x8000000e: 0x8000800,
            0x8000000f: 0x20000,
            0x10: 0x20820,
            0x11: 0x8020800,
            0x12: 0x20,
            0x13: 0x800,
            0x14: 0x8000800,
            0x15: 0x8000020,
            0x16: 0x8020020,
            0x17: 0x20000,
            0x18: 0x0,
            0x19: 0x20020,
            0x1a: 0x8020000,
            0x1b: 0x8000820,
            0x1c: 0x8020820,
            0x1d: 0x20800,
            0x1e: 0x820,
            0x1f: 0x8000000,
            0x80000010: 0x20000,
            0x80000011: 0x800,
            0x80000012: 0x8020020,
            0x80000013: 0x20820,
            0x80000014: 0x20,
            0x80000015: 0x8020000,
            0x80000016: 0x8000000,
            0x80000017: 0x8000820,
            0x80000018: 0x8020820,
            0x80000019: 0x8000020,
            0x8000001a: 0x8000800,
            0x8000001b: 0x0,
            0x8000001c: 0x20800,
            0x8000001d: 0x820,
            0x8000001e: 0x20020,
            0x8000001f: 0x8020800
          }
        ];

        // Masks that select the SBOX input
        var SBOX_MASK = [
          0xf8000001, 0x1f800000, 0x01f80000, 0x001f8000,
          0x0001f800, 0x00001f80, 0x000001f8, 0x8000001f
        ];

        /**
         * DES block cipher algorithm.
         */
        var DES = C_algo.DES = BlockCipher.extend({
          _doReset: function () {
            // Shortcuts
            var key = this._key;
            var keyWords = key.words;

            // Select 56 bits according to PC1
            var keyBits = [];
            for (var i = 0; i < 56; i++) {
              var keyBitPos = PC1[i] - 1;
              keyBits[i] = (keyWords[keyBitPos >>> 5] >>> (31 - keyBitPos % 32)) & 1;
            }

            // Assemble 16 subkeys
            var subKeys = this._subKeys = [];
            for (var nSubKey = 0; nSubKey < 16; nSubKey++) {
              // Create subkey
              var subKey = subKeys[nSubKey] = [];

              // Shortcut
              var bitShift = BIT_SHIFTS[nSubKey];

              // Select 48 bits according to PC2
              for (var i = 0; i < 24; i++) {
                // Select from the left 28 key bits
                subKey[(i / 6) | 0] |= keyBits[((PC2[i] - 1) + bitShift) % 28] << (31 - i % 6);

                // Select from the right 28 key bits
                subKey[4 + ((i / 6) | 0)] |= keyBits[28 + (((PC2[i + 24] - 1) + bitShift) % 28)] << (31 - i % 6);
              }

              // Since each subkey is applied to an expanded 32-bit input,
              // the subkey can be broken into 8 values scaled to 32-bits,
              // which allows the key to be used without expansion
              subKey[0] = (subKey[0] << 1) | (subKey[0] >>> 31);
              for (var i = 1; i < 7; i++) {
                subKey[i] = subKey[i] >>> ((i - 1) * 4 + 3);
              }
              subKey[7] = (subKey[7] << 5) | (subKey[7] >>> 27);
            }

            // Compute inverse subkeys
            var invSubKeys = this._invSubKeys = [];
            for (var i = 0; i < 16; i++) {
              invSubKeys[i] = subKeys[15 - i];
            }
          },

          encryptBlock: function (M, offset) {
            this._doCryptBlock(M, offset, this._subKeys);
          },

          decryptBlock: function (M, offset) {
            this._doCryptBlock(M, offset, this._invSubKeys);
          },

          _doCryptBlock: function (M, offset, subKeys) {
            // Get input
            this._lBlock = M[offset];
            this._rBlock = M[offset + 1];

            // Initial permutation
            exchangeLR.call(this, 4, 0x0f0f0f0f);
            exchangeLR.call(this, 16, 0x0000ffff);
            exchangeRL.call(this, 2, 0x33333333);
            exchangeRL.call(this, 8, 0x00ff00ff);
            exchangeLR.call(this, 1, 0x55555555);

            // Rounds
            for (var round = 0; round < 16; round++) {
              // Shortcuts
              var subKey = subKeys[round];
              var lBlock = this._lBlock;
              var rBlock = this._rBlock;

              // Feistel function
              var f = 0;
              for (var i = 0; i < 8; i++) {
                f |= SBOX_P[i][((rBlock ^ subKey[i]) & SBOX_MASK[i]) >>> 0];
              }
              this._lBlock = rBlock;
              this._rBlock = lBlock ^ f;
            }

            // Undo swap from last round
            var t = this._lBlock;
            this._lBlock = this._rBlock;
            this._rBlock = t;

            // Final permutation
            exchangeLR.call(this, 1, 0x55555555);
            exchangeRL.call(this, 8, 0x00ff00ff);
            exchangeRL.call(this, 2, 0x33333333);
            exchangeLR.call(this, 16, 0x0000ffff);
            exchangeLR.call(this, 4, 0x0f0f0f0f);

            // Set output
            M[offset] = this._lBlock;
            M[offset + 1] = this._rBlock;
          },

          keySize: 64 / 32,

          ivSize: 64 / 32,

          blockSize: 64 / 32
        });

        // Swap bits across the left and right words
        function exchangeLR(offset, mask) {
          var t = ((this._lBlock >>> offset) ^ this._rBlock) & mask;
          this._rBlock ^= t;
          this._lBlock ^= t << offset;
        }

        function exchangeRL(offset, mask) {
          var t = ((this._rBlock >>> offset) ^ this._lBlock) & mask;
          this._lBlock ^= t;
          this._rBlock ^= t << offset;
        }

        /**
         * Shortcut functions to the cipher's object interface.
         *
         * @example
         *
         *     var ciphertext = CryptoJS.DES.encrypt(message, key, cfg);
         *     var plaintext  = CryptoJS.DES.decrypt(ciphertext, key, cfg);
         */
        C.DES = BlockCipher._createHelper(DES);

        /**
         * Triple-DES block cipher algorithm.
         */
        var TripleDES = C_algo.TripleDES = BlockCipher.extend({
          _doReset: function () {
            // Shortcuts
            var key = this._key;
            var keyWords = key.words;
            // Make sure the key length is valid (64, 128 or >= 192 bit)
            if (keyWords.length !== 2 && keyWords.length !== 4 && keyWords.length < 6) {
              throw new Error('Invalid key length - 3DES requires the key length to be 64, 128, 192 or >192.');
            }

            // Extend the key according to the keying options defined in 3DES standard
            var key1 = keyWords.slice(0, 2);
            var key2 = keyWords.length < 4 ? keyWords.slice(0, 2) : keyWords.slice(2, 4);
            var key3 = keyWords.length < 6 ? keyWords.slice(0, 2) : keyWords.slice(4, 6);

            // Create DES instances
            this._des1 = DES.createEncryptor(WordArray.create(key1));
            this._des2 = DES.createEncryptor(WordArray.create(key2));
            this._des3 = DES.createEncryptor(WordArray.create(key3));
          },

          encryptBlock: function (M, offset) {
            this._des1.encryptBlock(M, offset);
            this._des2.decryptBlock(M, offset);
            this._des3.encryptBlock(M, offset);
          },

          decryptBlock: function (M, offset) {
            this._des3.decryptBlock(M, offset);
            this._des2.encryptBlock(M, offset);
            this._des1.decryptBlock(M, offset);
          },

          keySize: 192 / 32,

          ivSize: 64 / 32,

          blockSize: 64 / 32
        });

        /**
         * Shortcut functions to the cipher's object interface.
         *
         * @example
         *
         *     var ciphertext = CryptoJS.TripleDES.encrypt(message, key, cfg);
         *     var plaintext  = CryptoJS.TripleDES.decrypt(ciphertext, key, cfg);
         */
        C.TripleDES = BlockCipher._createHelper(TripleDES);
      }());


      (function () {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var StreamCipher = C_lib.StreamCipher;
        var C_algo = C.algo;

        /**
         * RC4 stream cipher algorithm.
         */
        var RC4 = C_algo.RC4 = StreamCipher.extend({
          _doReset: function () {
            // Shortcuts
            var key = this._key;
            var keyWords = key.words;
            var keySigBytes = key.sigBytes;

            // Init sbox
            var S = this._S = [];
            for (var i = 0; i < 256; i++) {
              S[i] = i;
            }

            // Key setup
            for (var i = 0, j = 0; i < 256; i++) {
              var keyByteIndex = i % keySigBytes;
              var keyByte = (keyWords[keyByteIndex >>> 2] >>> (24 - (keyByteIndex % 4) * 8)) & 0xff;

              j = (j + S[i] + keyByte) % 256;

              // Swap
              var t = S[i];
              S[i] = S[j];
              S[j] = t;
            }

            // Counters
            this._i = this._j = 0;
          },

          _doProcessBlock: function (M, offset) {
            M[offset] ^= generateKeystreamWord.call(this);
          },

          keySize: 256 / 32,

          ivSize: 0
        });

        function generateKeystreamWord() {
          // Shortcuts
          var S = this._S;
          var i = this._i;
          var j = this._j;

          // Generate keystream word
          var keystreamWord = 0;
          for (var n = 0; n < 4; n++) {
            i = (i + 1) % 256;
            j = (j + S[i]) % 256;

            // Swap
            var t = S[i];
            S[i] = S[j];
            S[j] = t;

            keystreamWord |= S[(S[i] + S[j]) % 256] << (24 - n * 8);
          }

          // Update counters
          this._i = i;
          this._j = j;

          return keystreamWord;
        }

        /**
         * Shortcut functions to the cipher's object interface.
         *
         * @example
         *
         *     var ciphertext = CryptoJS.RC4.encrypt(message, key, cfg);
         *     var plaintext  = CryptoJS.RC4.decrypt(ciphertext, key, cfg);
         */
        C.RC4 = StreamCipher._createHelper(RC4);

        /**
         * Modified RC4 stream cipher algorithm.
         */
        var RC4Drop = C_algo.RC4Drop = RC4.extend({
          /**
           * Configuration options.
           *
           * @property {number} drop The number of keystream words to drop. Default 192
           */
          cfg: RC4.cfg.extend({
            drop: 192
          }),

          _doReset: function () {
            RC4._doReset.call(this);

            // Drop
            for (var i = this.cfg.drop; i > 0; i--) {
              generateKeystreamWord.call(this);
            }
          }
        });

        /**
         * Shortcut functions to the cipher's object interface.
         *
         * @example
         *
         *     var ciphertext = CryptoJS.RC4Drop.encrypt(message, key, cfg);
         *     var plaintext  = CryptoJS.RC4Drop.decrypt(ciphertext, key, cfg);
         */
        C.RC4Drop = StreamCipher._createHelper(RC4Drop);
      }());


      (function () {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var StreamCipher = C_lib.StreamCipher;
        var C_algo = C.algo;

        // Reusable objects
        var S = [];
        var C_ = [];
        var G = [];

        /**
         * Rabbit stream cipher algorithm
         */
        var Rabbit = C_algo.Rabbit = StreamCipher.extend({
          _doReset: function () {
            // Shortcuts
            var K = this._key.words;
            var iv = this.cfg.iv;

            // Swap endian
            for (var i = 0; i < 4; i++) {
              K[i] = (((K[i] << 8) | (K[i] >>> 24)) & 0x00ff00ff) |
                (((K[i] << 24) | (K[i] >>> 8)) & 0xff00ff00);
            }

            // Generate initial state values
            var X = this._X = [
              K[0], (K[3] << 16) | (K[2] >>> 16),
              K[1], (K[0] << 16) | (K[3] >>> 16),
              K[2], (K[1] << 16) | (K[0] >>> 16),
              K[3], (K[2] << 16) | (K[1] >>> 16)
            ];

            // Generate initial counter values
            var C = this._C = [
              (K[2] << 16) | (K[2] >>> 16), (K[0] & 0xffff0000) | (K[1] & 0x0000ffff),
              (K[3] << 16) | (K[3] >>> 16), (K[1] & 0xffff0000) | (K[2] & 0x0000ffff),
              (K[0] << 16) | (K[0] >>> 16), (K[2] & 0xffff0000) | (K[3] & 0x0000ffff),
              (K[1] << 16) | (K[1] >>> 16), (K[3] & 0xffff0000) | (K[0] & 0x0000ffff)
            ];

            // Carry bit
            this._b = 0;

            // Iterate the system four times
            for (var i = 0; i < 4; i++) {
              nextState.call(this);
            }

            // Modify the counters
            for (var i = 0; i < 8; i++) {
              C[i] ^= X[(i + 4) & 7];
            }

            // IV setup
            if (iv) {
              // Shortcuts
              var IV = iv.words;
              var IV_0 = IV[0];
              var IV_1 = IV[1];

              // Generate four subvectors
              var i0 = (((IV_0 << 8) | (IV_0 >>> 24)) & 0x00ff00ff) | (((IV_0 << 24) | (IV_0 >>> 8)) & 0xff00ff00);
              var i2 = (((IV_1 << 8) | (IV_1 >>> 24)) & 0x00ff00ff) | (((IV_1 << 24) | (IV_1 >>> 8)) & 0xff00ff00);
              var i1 = (i0 >>> 16) | (i2 & 0xffff0000);
              var i3 = (i2 << 16) | (i0 & 0x0000ffff);

              // Modify counter values
              C[0] ^= i0;
              C[1] ^= i1;
              C[2] ^= i2;
              C[3] ^= i3;
              C[4] ^= i0;
              C[5] ^= i1;
              C[6] ^= i2;
              C[7] ^= i3;

              // Iterate the system four times
              for (var i = 0; i < 4; i++) {
                nextState.call(this);
              }
            }
          },

          _doProcessBlock: function (M, offset) {
            // Shortcut
            var X = this._X;

            // Iterate the system
            nextState.call(this);

            // Generate four keystream words
            S[0] = X[0] ^ (X[5] >>> 16) ^ (X[3] << 16);
            S[1] = X[2] ^ (X[7] >>> 16) ^ (X[5] << 16);
            S[2] = X[4] ^ (X[1] >>> 16) ^ (X[7] << 16);
            S[3] = X[6] ^ (X[3] >>> 16) ^ (X[1] << 16);

            for (var i = 0; i < 4; i++) {
              // Swap endian
              S[i] = (((S[i] << 8) | (S[i] >>> 24)) & 0x00ff00ff) |
                (((S[i] << 24) | (S[i] >>> 8)) & 0xff00ff00);

              // Encrypt
              M[offset + i] ^= S[i];
            }
          },

          blockSize: 128 / 32,

          ivSize: 64 / 32
        });

        function nextState() {
          // Shortcuts
          var X = this._X;
          var C = this._C;

          // Save old counter values
          for (var i = 0; i < 8; i++) {
            C_[i] = C[i];
          }

          // Calculate new counter values
          C[0] = (C[0] + 0x4d34d34d + this._b) | 0;
          C[1] = (C[1] + 0xd34d34d3 + ((C[0] >>> 0) < (C_[0] >>> 0) ? 1 : 0)) | 0;
          C[2] = (C[2] + 0x34d34d34 + ((C[1] >>> 0) < (C_[1] >>> 0) ? 1 : 0)) | 0;
          C[3] = (C[3] + 0x4d34d34d + ((C[2] >>> 0) < (C_[2] >>> 0) ? 1 : 0)) | 0;
          C[4] = (C[4] + 0xd34d34d3 + ((C[3] >>> 0) < (C_[3] >>> 0) ? 1 : 0)) | 0;
          C[5] = (C[5] + 0x34d34d34 + ((C[4] >>> 0) < (C_[4] >>> 0) ? 1 : 0)) | 0;
          C[6] = (C[6] + 0x4d34d34d + ((C[5] >>> 0) < (C_[5] >>> 0) ? 1 : 0)) | 0;
          C[7] = (C[7] + 0xd34d34d3 + ((C[6] >>> 0) < (C_[6] >>> 0) ? 1 : 0)) | 0;
          this._b = (C[7] >>> 0) < (C_[7] >>> 0) ? 1 : 0;

          // Calculate the g-values
          for (var i = 0; i < 8; i++) {
            var gx = X[i] + C[i];

            // Construct high and low argument for squaring
            var ga = gx & 0xffff;
            var gb = gx >>> 16;

            // Calculate high and low result of squaring
            var gh = ((((ga * ga) >>> 17) + ga * gb) >>> 15) + gb * gb;
            var gl = (((gx & 0xffff0000) * gx) | 0) + (((gx & 0x0000ffff) * gx) | 0);

            // High XOR low
            G[i] = gh ^ gl;
          }

          // Calculate new state values
          X[0] = (G[0] + ((G[7] << 16) | (G[7] >>> 16)) + ((G[6] << 16) | (G[6] >>> 16))) | 0;
          X[1] = (G[1] + ((G[0] << 8) | (G[0] >>> 24)) + G[7]) | 0;
          X[2] = (G[2] + ((G[1] << 16) | (G[1] >>> 16)) + ((G[0] << 16) | (G[0] >>> 16))) | 0;
          X[3] = (G[3] + ((G[2] << 8) | (G[2] >>> 24)) + G[1]) | 0;
          X[4] = (G[4] + ((G[3] << 16) | (G[3] >>> 16)) + ((G[2] << 16) | (G[2] >>> 16))) | 0;
          X[5] = (G[5] + ((G[4] << 8) | (G[4] >>> 24)) + G[3]) | 0;
          X[6] = (G[6] + ((G[5] << 16) | (G[5] >>> 16)) + ((G[4] << 16) | (G[4] >>> 16))) | 0;
          X[7] = (G[7] + ((G[6] << 8) | (G[6] >>> 24)) + G[5]) | 0;
        }

        /**
         * Shortcut functions to the cipher's object interface.
         *
         * @example
         *
         *     var ciphertext = CryptoJS.Rabbit.encrypt(message, key, cfg);
         *     var plaintext  = CryptoJS.Rabbit.decrypt(ciphertext, key, cfg);
         */
        C.Rabbit = StreamCipher._createHelper(Rabbit);
      }());


      (function () {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var StreamCipher = C_lib.StreamCipher;
        var C_algo = C.algo;

        // Reusable objects
        var S = [];
        var C_ = [];
        var G = [];

        /**
         * Rabbit stream cipher algorithm.
         *
         * This is a legacy version that neglected to convert the key to little-endian.
         * This error doesn't affect the cipher's security,
         * but it does affect its compatibility with other implementations.
         */
        var RabbitLegacy = C_algo.RabbitLegacy = StreamCipher.extend({
          _doReset: function () {
            // Shortcuts
            var K = this._key.words;
            var iv = this.cfg.iv;

            // Generate initial state values
            var X = this._X = [
              K[0], (K[3] << 16) | (K[2] >>> 16),
              K[1], (K[0] << 16) | (K[3] >>> 16),
              K[2], (K[1] << 16) | (K[0] >>> 16),
              K[3], (K[2] << 16) | (K[1] >>> 16)
            ];

            // Generate initial counter values
            var C = this._C = [
              (K[2] << 16) | (K[2] >>> 16), (K[0] & 0xffff0000) | (K[1] & 0x0000ffff),
              (K[3] << 16) | (K[3] >>> 16), (K[1] & 0xffff0000) | (K[2] & 0x0000ffff),
              (K[0] << 16) | (K[0] >>> 16), (K[2] & 0xffff0000) | (K[3] & 0x0000ffff),
              (K[1] << 16) | (K[1] >>> 16), (K[3] & 0xffff0000) | (K[0] & 0x0000ffff)
            ];

            // Carry bit
            this._b = 0;

            // Iterate the system four times
            for (var i = 0; i < 4; i++) {
              nextState.call(this);
            }

            // Modify the counters
            for (var i = 0; i < 8; i++) {
              C[i] ^= X[(i + 4) & 7];
            }

            // IV setup
            if (iv) {
              // Shortcuts
              var IV = iv.words;
              var IV_0 = IV[0];
              var IV_1 = IV[1];

              // Generate four subvectors
              var i0 = (((IV_0 << 8) | (IV_0 >>> 24)) & 0x00ff00ff) | (((IV_0 << 24) | (IV_0 >>> 8)) & 0xff00ff00);
              var i2 = (((IV_1 << 8) | (IV_1 >>> 24)) & 0x00ff00ff) | (((IV_1 << 24) | (IV_1 >>> 8)) & 0xff00ff00);
              var i1 = (i0 >>> 16) | (i2 & 0xffff0000);
              var i3 = (i2 << 16) | (i0 & 0x0000ffff);

              // Modify counter values
              C[0] ^= i0;
              C[1] ^= i1;
              C[2] ^= i2;
              C[3] ^= i3;
              C[4] ^= i0;
              C[5] ^= i1;
              C[6] ^= i2;
              C[7] ^= i3;

              // Iterate the system four times
              for (var i = 0; i < 4; i++) {
                nextState.call(this);
              }
            }
          },

          _doProcessBlock: function (M, offset) {
            // Shortcut
            var X = this._X;

            // Iterate the system
            nextState.call(this);

            // Generate four keystream words
            S[0] = X[0] ^ (X[5] >>> 16) ^ (X[3] << 16);
            S[1] = X[2] ^ (X[7] >>> 16) ^ (X[5] << 16);
            S[2] = X[4] ^ (X[1] >>> 16) ^ (X[7] << 16);
            S[3] = X[6] ^ (X[3] >>> 16) ^ (X[1] << 16);

            for (var i = 0; i < 4; i++) {
              // Swap endian
              S[i] = (((S[i] << 8) | (S[i] >>> 24)) & 0x00ff00ff) |
                (((S[i] << 24) | (S[i] >>> 8)) & 0xff00ff00);

              // Encrypt
              M[offset + i] ^= S[i];
            }
          },

          blockSize: 128 / 32,

          ivSize: 64 / 32
        });

        function nextState() {
          // Shortcuts
          var X = this._X;
          var C = this._C;

          // Save old counter values
          for (var i = 0; i < 8; i++) {
            C_[i] = C[i];
          }

          // Calculate new counter values
          C[0] = (C[0] + 0x4d34d34d + this._b) | 0;
          C[1] = (C[1] + 0xd34d34d3 + ((C[0] >>> 0) < (C_[0] >>> 0) ? 1 : 0)) | 0;
          C[2] = (C[2] + 0x34d34d34 + ((C[1] >>> 0) < (C_[1] >>> 0) ? 1 : 0)) | 0;
          C[3] = (C[3] + 0x4d34d34d + ((C[2] >>> 0) < (C_[2] >>> 0) ? 1 : 0)) | 0;
          C[4] = (C[4] + 0xd34d34d3 + ((C[3] >>> 0) < (C_[3] >>> 0) ? 1 : 0)) | 0;
          C[5] = (C[5] + 0x34d34d34 + ((C[4] >>> 0) < (C_[4] >>> 0) ? 1 : 0)) | 0;
          C[6] = (C[6] + 0x4d34d34d + ((C[5] >>> 0) < (C_[5] >>> 0) ? 1 : 0)) | 0;
          C[7] = (C[7] + 0xd34d34d3 + ((C[6] >>> 0) < (C_[6] >>> 0) ? 1 : 0)) | 0;
          this._b = (C[7] >>> 0) < (C_[7] >>> 0) ? 1 : 0;

          // Calculate the g-values
          for (var i = 0; i < 8; i++) {
            var gx = X[i] + C[i];

            // Construct high and low argument for squaring
            var ga = gx & 0xffff;
            var gb = gx >>> 16;

            // Calculate high and low result of squaring
            var gh = ((((ga * ga) >>> 17) + ga * gb) >>> 15) + gb * gb;
            var gl = (((gx & 0xffff0000) * gx) | 0) + (((gx & 0x0000ffff) * gx) | 0);

            // High XOR low
            G[i] = gh ^ gl;
          }

          // Calculate new state values
          X[0] = (G[0] + ((G[7] << 16) | (G[7] >>> 16)) + ((G[6] << 16) | (G[6] >>> 16))) | 0;
          X[1] = (G[1] + ((G[0] << 8) | (G[0] >>> 24)) + G[7]) | 0;
          X[2] = (G[2] + ((G[1] << 16) | (G[1] >>> 16)) + ((G[0] << 16) | (G[0] >>> 16))) | 0;
          X[3] = (G[3] + ((G[2] << 8) | (G[2] >>> 24)) + G[1]) | 0;
          X[4] = (G[4] + ((G[3] << 16) | (G[3] >>> 16)) + ((G[2] << 16) | (G[2] >>> 16))) | 0;
          X[5] = (G[5] + ((G[4] << 8) | (G[4] >>> 24)) + G[3]) | 0;
          X[6] = (G[6] + ((G[5] << 16) | (G[5] >>> 16)) + ((G[4] << 16) | (G[4] >>> 16))) | 0;
          X[7] = (G[7] + ((G[6] << 8) | (G[6] >>> 24)) + G[5]) | 0;
        }

        /**
         * Shortcut functions to the cipher's object interface.
         *
         * @example
         *
         *     var ciphertext = CryptoJS.RabbitLegacy.encrypt(message, key, cfg);
         *     var plaintext  = CryptoJS.RabbitLegacy.decrypt(ciphertext, key, cfg);
         */
        C.RabbitLegacy = StreamCipher._createHelper(RabbitLegacy);
      }());


      (function () {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var BlockCipher = C_lib.BlockCipher;
        var C_algo = C.algo;

        const N = 16;

        //Origin pbox and sbox, derived from PI
        const ORIG_P = [
          0x243F6A88, 0x85A308D3, 0x13198A2E, 0x03707344,
          0xA4093822, 0x299F31D0, 0x082EFA98, 0xEC4E6C89,
          0x452821E6, 0x38D01377, 0xBE5466CF, 0x34E90C6C,
          0xC0AC29B7, 0xC97C50DD, 0x3F84D5B5, 0xB5470917,
          0x9216D5D9, 0x8979FB1B
        ];

        const ORIG_S = [
          [0xD1310BA6, 0x98DFB5AC, 0x2FFD72DB, 0xD01ADFB7,
            0xB8E1AFED, 0x6A267E96, 0xBA7C9045, 0xF12C7F99,
            0x24A19947, 0xB3916CF7, 0x0801F2E2, 0x858EFC16,
            0x636920D8, 0x71574E69, 0xA458FEA3, 0xF4933D7E,
            0x0D95748F, 0x728EB658, 0x718BCD58, 0x82154AEE,
            0x7B54A41D, 0xC25A59B5, 0x9C30D539, 0x2AF26013,
            0xC5D1B023, 0x286085F0, 0xCA417918, 0xB8DB38EF,
            0x8E79DCB0, 0x603A180E, 0x6C9E0E8B, 0xB01E8A3E,
            0xD71577C1, 0xBD314B27, 0x78AF2FDA, 0x55605C60,
            0xE65525F3, 0xAA55AB94, 0x57489862, 0x63E81440,
            0x55CA396A, 0x2AAB10B6, 0xB4CC5C34, 0x1141E8CE,
            0xA15486AF, 0x7C72E993, 0xB3EE1411, 0x636FBC2A,
            0x2BA9C55D, 0x741831F6, 0xCE5C3E16, 0x9B87931E,
            0xAFD6BA33, 0x6C24CF5C, 0x7A325381, 0x28958677,
            0x3B8F4898, 0x6B4BB9AF, 0xC4BFE81B, 0x66282193,
            0x61D809CC, 0xFB21A991, 0x487CAC60, 0x5DEC8032,
            0xEF845D5D, 0xE98575B1, 0xDC262302, 0xEB651B88,
            0x23893E81, 0xD396ACC5, 0x0F6D6FF3, 0x83F44239,
            0x2E0B4482, 0xA4842004, 0x69C8F04A, 0x9E1F9B5E,
            0x21C66842, 0xF6E96C9A, 0x670C9C61, 0xABD388F0,
            0x6A51A0D2, 0xD8542F68, 0x960FA728, 0xAB5133A3,
            0x6EEF0B6C, 0x137A3BE4, 0xBA3BF050, 0x7EFB2A98,
            0xA1F1651D, 0x39AF0176, 0x66CA593E, 0x82430E88,
            0x8CEE8619, 0x456F9FB4, 0x7D84A5C3, 0x3B8B5EBE,
            0xE06F75D8, 0x85C12073, 0x401A449F, 0x56C16AA6,
            0x4ED3AA62, 0x363F7706, 0x1BFEDF72, 0x429B023D,
            0x37D0D724, 0xD00A1248, 0xDB0FEAD3, 0x49F1C09B,
            0x075372C9, 0x80991B7B, 0x25D479D8, 0xF6E8DEF7,
            0xE3FE501A, 0xB6794C3B, 0x976CE0BD, 0x04C006BA,
            0xC1A94FB6, 0x409F60C4, 0x5E5C9EC2, 0x196A2463,
            0x68FB6FAF, 0x3E6C53B5, 0x1339B2EB, 0x3B52EC6F,
            0x6DFC511F, 0x9B30952C, 0xCC814544, 0xAF5EBD09,
            0xBEE3D004, 0xDE334AFD, 0x660F2807, 0x192E4BB3,
            0xC0CBA857, 0x45C8740F, 0xD20B5F39, 0xB9D3FBDB,
            0x5579C0BD, 0x1A60320A, 0xD6A100C6, 0x402C7279,
            0x679F25FE, 0xFB1FA3CC, 0x8EA5E9F8, 0xDB3222F8,
            0x3C7516DF, 0xFD616B15, 0x2F501EC8, 0xAD0552AB,
            0x323DB5FA, 0xFD238760, 0x53317B48, 0x3E00DF82,
            0x9E5C57BB, 0xCA6F8CA0, 0x1A87562E, 0xDF1769DB,
            0xD542A8F6, 0x287EFFC3, 0xAC6732C6, 0x8C4F5573,
            0x695B27B0, 0xBBCA58C8, 0xE1FFA35D, 0xB8F011A0,
            0x10FA3D98, 0xFD2183B8, 0x4AFCB56C, 0x2DD1D35B,
            0x9A53E479, 0xB6F84565, 0xD28E49BC, 0x4BFB9790,
            0xE1DDF2DA, 0xA4CB7E33, 0x62FB1341, 0xCEE4C6E8,
            0xEF20CADA, 0x36774C01, 0xD07E9EFE, 0x2BF11FB4,
            0x95DBDA4D, 0xAE909198, 0xEAAD8E71, 0x6B93D5A0,
            0xD08ED1D0, 0xAFC725E0, 0x8E3C5B2F, 0x8E7594B7,
            0x8FF6E2FB, 0xF2122B64, 0x8888B812, 0x900DF01C,
            0x4FAD5EA0, 0x688FC31C, 0xD1CFF191, 0xB3A8C1AD,
            0x2F2F2218, 0xBE0E1777, 0xEA752DFE, 0x8B021FA1,
            0xE5A0CC0F, 0xB56F74E8, 0x18ACF3D6, 0xCE89E299,
            0xB4A84FE0, 0xFD13E0B7, 0x7CC43B81, 0xD2ADA8D9,
            0x165FA266, 0x80957705, 0x93CC7314, 0x211A1477,
            0xE6AD2065, 0x77B5FA86, 0xC75442F5, 0xFB9D35CF,
            0xEBCDAF0C, 0x7B3E89A0, 0xD6411BD3, 0xAE1E7E49,
            0x00250E2D, 0x2071B35E, 0x226800BB, 0x57B8E0AF,
            0x2464369B, 0xF009B91E, 0x5563911D, 0x59DFA6AA,
            0x78C14389, 0xD95A537F, 0x207D5BA2, 0x02E5B9C5,
            0x83260376, 0x6295CFA9, 0x11C81968, 0x4E734A41,
            0xB3472DCA, 0x7B14A94A, 0x1B510052, 0x9A532915,
            0xD60F573F, 0xBC9BC6E4, 0x2B60A476, 0x81E67400,
            0x08BA6FB5, 0x571BE91F, 0xF296EC6B, 0x2A0DD915,
            0xB6636521, 0xE7B9F9B6, 0xFF34052E, 0xC5855664,
            0x53B02D5D, 0xA99F8FA1, 0x08BA4799, 0x6E85076A],
          [0x4B7A70E9, 0xB5B32944, 0xDB75092E, 0xC4192623,
            0xAD6EA6B0, 0x49A7DF7D, 0x9CEE60B8, 0x8FEDB266,
            0xECAA8C71, 0x699A17FF, 0x5664526C, 0xC2B19EE1,
            0x193602A5, 0x75094C29, 0xA0591340, 0xE4183A3E,
            0x3F54989A, 0x5B429D65, 0x6B8FE4D6, 0x99F73FD6,
            0xA1D29C07, 0xEFE830F5, 0x4D2D38E6, 0xF0255DC1,
            0x4CDD2086, 0x8470EB26, 0x6382E9C6, 0x021ECC5E,
            0x09686B3F, 0x3EBAEFC9, 0x3C971814, 0x6B6A70A1,
            0x687F3584, 0x52A0E286, 0xB79C5305, 0xAA500737,
            0x3E07841C, 0x7FDEAE5C, 0x8E7D44EC, 0x5716F2B8,
            0xB03ADA37, 0xF0500C0D, 0xF01C1F04, 0x0200B3FF,
            0xAE0CF51A, 0x3CB574B2, 0x25837A58, 0xDC0921BD,
            0xD19113F9, 0x7CA92FF6, 0x94324773, 0x22F54701,
            0x3AE5E581, 0x37C2DADC, 0xC8B57634, 0x9AF3DDA7,
            0xA9446146, 0x0FD0030E, 0xECC8C73E, 0xA4751E41,
            0xE238CD99, 0x3BEA0E2F, 0x3280BBA1, 0x183EB331,
            0x4E548B38, 0x4F6DB908, 0x6F420D03, 0xF60A04BF,
            0x2CB81290, 0x24977C79, 0x5679B072, 0xBCAF89AF,
            0xDE9A771F, 0xD9930810, 0xB38BAE12, 0xDCCF3F2E,
            0x5512721F, 0x2E6B7124, 0x501ADDE6, 0x9F84CD87,
            0x7A584718, 0x7408DA17, 0xBC9F9ABC, 0xE94B7D8C,
            0xEC7AEC3A, 0xDB851DFA, 0x63094366, 0xC464C3D2,
            0xEF1C1847, 0x3215D908, 0xDD433B37, 0x24C2BA16,
            0x12A14D43, 0x2A65C451, 0x50940002, 0x133AE4DD,
            0x71DFF89E, 0x10314E55, 0x81AC77D6, 0x5F11199B,
            0x043556F1, 0xD7A3C76B, 0x3C11183B, 0x5924A509,
            0xF28FE6ED, 0x97F1FBFA, 0x9EBABF2C, 0x1E153C6E,
            0x86E34570, 0xEAE96FB1, 0x860E5E0A, 0x5A3E2AB3,
            0x771FE71C, 0x4E3D06FA, 0x2965DCB9, 0x99E71D0F,
            0x803E89D6, 0x5266C825, 0x2E4CC978, 0x9C10B36A,
            0xC6150EBA, 0x94E2EA78, 0xA5FC3C53, 0x1E0A2DF4,
            0xF2F74EA7, 0x361D2B3D, 0x1939260F, 0x19C27960,
            0x5223A708, 0xF71312B6, 0xEBADFE6E, 0xEAC31F66,
            0xE3BC4595, 0xA67BC883, 0xB17F37D1, 0x018CFF28,
            0xC332DDEF, 0xBE6C5AA5, 0x65582185, 0x68AB9802,
            0xEECEA50F, 0xDB2F953B, 0x2AEF7DAD, 0x5B6E2F84,
            0x1521B628, 0x29076170, 0xECDD4775, 0x619F1510,
            0x13CCA830, 0xEB61BD96, 0x0334FE1E, 0xAA0363CF,
            0xB5735C90, 0x4C70A239, 0xD59E9E0B, 0xCBAADE14,
            0xEECC86BC, 0x60622CA7, 0x9CAB5CAB, 0xB2F3846E,
            0x648B1EAF, 0x19BDF0CA, 0xA02369B9, 0x655ABB50,
            0x40685A32, 0x3C2AB4B3, 0x319EE9D5, 0xC021B8F7,
            0x9B540B19, 0x875FA099, 0x95F7997E, 0x623D7DA8,
            0xF837889A, 0x97E32D77, 0x11ED935F, 0x16681281,
            0x0E358829, 0xC7E61FD6, 0x96DEDFA1, 0x7858BA99,
            0x57F584A5, 0x1B227263, 0x9B83C3FF, 0x1AC24696,
            0xCDB30AEB, 0x532E3054, 0x8FD948E4, 0x6DBC3128,
            0x58EBF2EF, 0x34C6FFEA, 0xFE28ED61, 0xEE7C3C73,
            0x5D4A14D9, 0xE864B7E3, 0x42105D14, 0x203E13E0,
            0x45EEE2B6, 0xA3AAABEA, 0xDB6C4F15, 0xFACB4FD0,
            0xC742F442, 0xEF6ABBB5, 0x654F3B1D, 0x41CD2105,
            0xD81E799E, 0x86854DC7, 0xE44B476A, 0x3D816250,
            0xCF62A1F2, 0x5B8D2646, 0xFC8883A0, 0xC1C7B6A3,
            0x7F1524C3, 0x69CB7492, 0x47848A0B, 0x5692B285,
            0x095BBF00, 0xAD19489D, 0x1462B174, 0x23820E00,
            0x58428D2A, 0x0C55F5EA, 0x1DADF43E, 0x233F7061,
            0x3372F092, 0x8D937E41, 0xD65FECF1, 0x6C223BDB,
            0x7CDE3759, 0xCBEE7460, 0x4085F2A7, 0xCE77326E,
            0xA6078084, 0x19F8509E, 0xE8EFD855, 0x61D99735,
            0xA969A7AA, 0xC50C06C2, 0x5A04ABFC, 0x800BCADC,
            0x9E447A2E, 0xC3453484, 0xFDD56705, 0x0E1E9EC9,
            0xDB73DBD3, 0x105588CD, 0x675FDA79, 0xE3674340,
            0xC5C43465, 0x713E38D8, 0x3D28F89E, 0xF16DFF20,
            0x153E21E7, 0x8FB03D4A, 0xE6E39F2B, 0xDB83ADF7],
          [0xE93D5A68, 0x948140F7, 0xF64C261C, 0x94692934,
            0x411520F7, 0x7602D4F7, 0xBCF46B2E, 0xD4A20068,
            0xD4082471, 0x3320F46A, 0x43B7D4B7, 0x500061AF,
            0x1E39F62E, 0x97244546, 0x14214F74, 0xBF8B8840,
            0x4D95FC1D, 0x96B591AF, 0x70F4DDD3, 0x66A02F45,
            0xBFBC09EC, 0x03BD9785, 0x7FAC6DD0, 0x31CB8504,
            0x96EB27B3, 0x55FD3941, 0xDA2547E6, 0xABCA0A9A,
            0x28507825, 0x530429F4, 0x0A2C86DA, 0xE9B66DFB,
            0x68DC1462, 0xD7486900, 0x680EC0A4, 0x27A18DEE,
            0x4F3FFEA2, 0xE887AD8C, 0xB58CE006, 0x7AF4D6B6,
            0xAACE1E7C, 0xD3375FEC, 0xCE78A399, 0x406B2A42,
            0x20FE9E35, 0xD9F385B9, 0xEE39D7AB, 0x3B124E8B,
            0x1DC9FAF7, 0x4B6D1856, 0x26A36631, 0xEAE397B2,
            0x3A6EFA74, 0xDD5B4332, 0x6841E7F7, 0xCA7820FB,
            0xFB0AF54E, 0xD8FEB397, 0x454056AC, 0xBA489527,
            0x55533A3A, 0x20838D87, 0xFE6BA9B7, 0xD096954B,
            0x55A867BC, 0xA1159A58, 0xCCA92963, 0x99E1DB33,
            0xA62A4A56, 0x3F3125F9, 0x5EF47E1C, 0x9029317C,
            0xFDF8E802, 0x04272F70, 0x80BB155C, 0x05282CE3,
            0x95C11548, 0xE4C66D22, 0x48C1133F, 0xC70F86DC,
            0x07F9C9EE, 0x41041F0F, 0x404779A4, 0x5D886E17,
            0x325F51EB, 0xD59BC0D1, 0xF2BCC18F, 0x41113564,
            0x257B7834, 0x602A9C60, 0xDFF8E8A3, 0x1F636C1B,
            0x0E12B4C2, 0x02E1329E, 0xAF664FD1, 0xCAD18115,
            0x6B2395E0, 0x333E92E1, 0x3B240B62, 0xEEBEB922,
            0x85B2A20E, 0xE6BA0D99, 0xDE720C8C, 0x2DA2F728,
            0xD0127845, 0x95B794FD, 0x647D0862, 0xE7CCF5F0,
            0x5449A36F, 0x877D48FA, 0xC39DFD27, 0xF33E8D1E,
            0x0A476341, 0x992EFF74, 0x3A6F6EAB, 0xF4F8FD37,
            0xA812DC60, 0xA1EBDDF8, 0x991BE14C, 0xDB6E6B0D,
            0xC67B5510, 0x6D672C37, 0x2765D43B, 0xDCD0E804,
            0xF1290DC7, 0xCC00FFA3, 0xB5390F92, 0x690FED0B,
            0x667B9FFB, 0xCEDB7D9C, 0xA091CF0B, 0xD9155EA3,
            0xBB132F88, 0x515BAD24, 0x7B9479BF, 0x763BD6EB,
            0x37392EB3, 0xCC115979, 0x8026E297, 0xF42E312D,
            0x6842ADA7, 0xC66A2B3B, 0x12754CCC, 0x782EF11C,
            0x6A124237, 0xB79251E7, 0x06A1BBE6, 0x4BFB6350,
            0x1A6B1018, 0x11CAEDFA, 0x3D25BDD8, 0xE2E1C3C9,
            0x44421659, 0x0A121386, 0xD90CEC6E, 0xD5ABEA2A,
            0x64AF674E, 0xDA86A85F, 0xBEBFE988, 0x64E4C3FE,
            0x9DBC8057, 0xF0F7C086, 0x60787BF8, 0x6003604D,
            0xD1FD8346, 0xF6381FB0, 0x7745AE04, 0xD736FCCC,
            0x83426B33, 0xF01EAB71, 0xB0804187, 0x3C005E5F,
            0x77A057BE, 0xBDE8AE24, 0x55464299, 0xBF582E61,
            0x4E58F48F, 0xF2DDFDA2, 0xF474EF38, 0x8789BDC2,
            0x5366F9C3, 0xC8B38E74, 0xB475F255, 0x46FCD9B9,
            0x7AEB2661, 0x8B1DDF84, 0x846A0E79, 0x915F95E2,
            0x466E598E, 0x20B45770, 0x8CD55591, 0xC902DE4C,
            0xB90BACE1, 0xBB8205D0, 0x11A86248, 0x7574A99E,
            0xB77F19B6, 0xE0A9DC09, 0x662D09A1, 0xC4324633,
            0xE85A1F02, 0x09F0BE8C, 0x4A99A025, 0x1D6EFE10,
            0x1AB93D1D, 0x0BA5A4DF, 0xA186F20F, 0x2868F169,
            0xDCB7DA83, 0x573906FE, 0xA1E2CE9B, 0x4FCD7F52,
            0x50115E01, 0xA70683FA, 0xA002B5C4, 0x0DE6D027,
            0x9AF88C27, 0x773F8641, 0xC3604C06, 0x61A806B5,
            0xF0177A28, 0xC0F586E0, 0x006058AA, 0x30DC7D62,
            0x11E69ED7, 0x2338EA63, 0x53C2DD94, 0xC2C21634,
            0xBBCBEE56, 0x90BCB6DE, 0xEBFC7DA1, 0xCE591D76,
            0x6F05E409, 0x4B7C0188, 0x39720A3D, 0x7C927C24,
            0x86E3725F, 0x724D9DB9, 0x1AC15BB4, 0xD39EB8FC,
            0xED545578, 0x08FCA5B5, 0xD83D7CD3, 0x4DAD0FC4,
            0x1E50EF5E, 0xB161E6F8, 0xA28514D9, 0x6C51133C,
            0x6FD5C7E7, 0x56E14EC4, 0x362ABFCE, 0xDDC6C837,
            0xD79A3234, 0x92638212, 0x670EFA8E, 0x406000E0],
          [0x3A39CE37, 0xD3FAF5CF, 0xABC27737, 0x5AC52D1B,
            0x5CB0679E, 0x4FA33742, 0xD3822740, 0x99BC9BBE,
            0xD5118E9D, 0xBF0F7315, 0xD62D1C7E, 0xC700C47B,
            0xB78C1B6B, 0x21A19045, 0xB26EB1BE, 0x6A366EB4,
            0x5748AB2F, 0xBC946E79, 0xC6A376D2, 0x6549C2C8,
            0x530FF8EE, 0x468DDE7D, 0xD5730A1D, 0x4CD04DC6,
            0x2939BBDB, 0xA9BA4650, 0xAC9526E8, 0xBE5EE304,
            0xA1FAD5F0, 0x6A2D519A, 0x63EF8CE2, 0x9A86EE22,
            0xC089C2B8, 0x43242EF6, 0xA51E03AA, 0x9CF2D0A4,
            0x83C061BA, 0x9BE96A4D, 0x8FE51550, 0xBA645BD6,
            0x2826A2F9, 0xA73A3AE1, 0x4BA99586, 0xEF5562E9,
            0xC72FEFD3, 0xF752F7DA, 0x3F046F69, 0x77FA0A59,
            0x80E4A915, 0x87B08601, 0x9B09E6AD, 0x3B3EE593,
            0xE990FD5A, 0x9E34D797, 0x2CF0B7D9, 0x022B8B51,
            0x96D5AC3A, 0x017DA67D, 0xD1CF3ED6, 0x7C7D2D28,
            0x1F9F25CF, 0xADF2B89B, 0x5AD6B472, 0x5A88F54C,
            0xE029AC71, 0xE019A5E6, 0x47B0ACFD, 0xED93FA9B,
            0xE8D3C48D, 0x283B57CC, 0xF8D56629, 0x79132E28,
            0x785F0191, 0xED756055, 0xF7960E44, 0xE3D35E8C,
            0x15056DD4, 0x88F46DBA, 0x03A16125, 0x0564F0BD,
            0xC3EB9E15, 0x3C9057A2, 0x97271AEC, 0xA93A072A,
            0x1B3F6D9B, 0x1E6321F5, 0xF59C66FB, 0x26DCF319,
            0x7533D928, 0xB155FDF5, 0x03563482, 0x8ABA3CBB,
            0x28517711, 0xC20AD9F8, 0xABCC5167, 0xCCAD925F,
            0x4DE81751, 0x3830DC8E, 0x379D5862, 0x9320F991,
            0xEA7A90C2, 0xFB3E7BCE, 0x5121CE64, 0x774FBE32,
            0xA8B6E37E, 0xC3293D46, 0x48DE5369, 0x6413E680,
            0xA2AE0810, 0xDD6DB224, 0x69852DFD, 0x09072166,
            0xB39A460A, 0x6445C0DD, 0x586CDECF, 0x1C20C8AE,
            0x5BBEF7DD, 0x1B588D40, 0xCCD2017F, 0x6BB4E3BB,
            0xDDA26A7E, 0x3A59FF45, 0x3E350A44, 0xBCB4CDD5,
            0x72EACEA8, 0xFA6484BB, 0x8D6612AE, 0xBF3C6F47,
            0xD29BE463, 0x542F5D9E, 0xAEC2771B, 0xF64E6370,
            0x740E0D8D, 0xE75B1357, 0xF8721671, 0xAF537D5D,
            0x4040CB08, 0x4EB4E2CC, 0x34D2466A, 0x0115AF84,
            0xE1B00428, 0x95983A1D, 0x06B89FB4, 0xCE6EA048,
            0x6F3F3B82, 0x3520AB82, 0x011A1D4B, 0x277227F8,
            0x611560B1, 0xE7933FDC, 0xBB3A792B, 0x344525BD,
            0xA08839E1, 0x51CE794B, 0x2F32C9B7, 0xA01FBAC9,
            0xE01CC87E, 0xBCC7D1F6, 0xCF0111C3, 0xA1E8AAC7,
            0x1A908749, 0xD44FBD9A, 0xD0DADECB, 0xD50ADA38,
            0x0339C32A, 0xC6913667, 0x8DF9317C, 0xE0B12B4F,
            0xF79E59B7, 0x43F5BB3A, 0xF2D519FF, 0x27D9459C,
            0xBF97222C, 0x15E6FC2A, 0x0F91FC71, 0x9B941525,
            0xFAE59361, 0xCEB69CEB, 0xC2A86459, 0x12BAA8D1,
            0xB6C1075E, 0xE3056A0C, 0x10D25065, 0xCB03A442,
            0xE0EC6E0E, 0x1698DB3B, 0x4C98A0BE, 0x3278E964,
            0x9F1F9532, 0xE0D392DF, 0xD3A0342B, 0x8971F21E,
            0x1B0A7441, 0x4BA3348C, 0xC5BE7120, 0xC37632D8,
            0xDF359F8D, 0x9B992F2E, 0xE60B6F47, 0x0FE3F11D,
            0xE54CDA54, 0x1EDAD891, 0xCE6279CF, 0xCD3E7E6F,
            0x1618B166, 0xFD2C1D05, 0x848FD2C5, 0xF6FB2299,
            0xF523F357, 0xA6327623, 0x93A83531, 0x56CCCD02,
            0xACF08162, 0x5A75EBB5, 0x6E163697, 0x88D273CC,
            0xDE966292, 0x81B949D0, 0x4C50901B, 0x71C65614,
            0xE6C6C7BD, 0x327A140A, 0x45E1D006, 0xC3F27B9A,
            0xC9AA53FD, 0x62A80F00, 0xBB25BFE2, 0x35BDD2F6,
            0x71126905, 0xB2040222, 0xB6CBCF7C, 0xCD769C2B,
            0x53113EC0, 0x1640E3D3, 0x38ABBD60, 0x2547ADF0,
            0xBA38209C, 0xF746CE76, 0x77AFA1C5, 0x20756060,
            0x85CBFE4E, 0x8AE88DD8, 0x7AAAF9B0, 0x4CF9AA7E,
            0x1948C25C, 0x02FB8A8C, 0x01C36AE4, 0xD6EBE1F9,
            0x90D4F869, 0xA65CDEA0, 0x3F09252D, 0xC208E69F,
            0xB74E6132, 0xCE77E25B, 0x578FDFE3, 0x3AC372E6]
        ];

        var BLOWFISH_CTX = {
          pbox: [],
          sbox: []
        };

        function F(ctx, x) {
          let a = (x >> 24) & 0xFF;
          let b = (x >> 16) & 0xFF;
          let c = (x >> 8) & 0xFF;
          let d = x & 0xFF;

          let y = ctx.sbox[0][a] + ctx.sbox[1][b];
          y = y ^ ctx.sbox[2][c];
          y = y + ctx.sbox[3][d];

          return y;
        }

        function BlowFish_Encrypt(ctx, left, right) {
          let Xl = left;
          let Xr = right;
          let temp;

          for (let i = 0; i < N; ++i) {
            Xl = Xl ^ ctx.pbox[i];
            Xr = F(ctx, Xl) ^ Xr;

            temp = Xl;
            Xl = Xr;
            Xr = temp;
          }

          temp = Xl;
          Xl = Xr;
          Xr = temp;

          Xr = Xr ^ ctx.pbox[N];
          Xl = Xl ^ ctx.pbox[N + 1];

          return { left: Xl, right: Xr };
        }

        function BlowFish_Decrypt(ctx, left, right) {
          let Xl = left;
          let Xr = right;
          let temp;

          for (let i = N + 1; i > 1; --i) {
            Xl = Xl ^ ctx.pbox[i];
            Xr = F(ctx, Xl) ^ Xr;

            temp = Xl;
            Xl = Xr;
            Xr = temp;
          }

          temp = Xl;
          Xl = Xr;
          Xr = temp;

          Xr = Xr ^ ctx.pbox[1];
          Xl = Xl ^ ctx.pbox[0];

          return { left: Xl, right: Xr };
        }

        /**
         * Initialization ctx's pbox and sbox.
         *
         * @param {Object} ctx The object has pbox and sbox.
         * @param {Array} key An array of 32-bit words.
         * @param {int} keysize The length of the key.
         *
         * @example
         *
         *     BlowFishInit(BLOWFISH_CTX, key, 128/32);
         */
        function BlowFishInit(ctx, key, keysize) {
          for (let Row = 0; Row < 4; Row++) {
            ctx.sbox[Row] = [];
            for (let Col = 0; Col < 256; Col++) {
              ctx.sbox[Row][Col] = ORIG_S[Row][Col];
            }
          }

          let keyIndex = 0;
          for (let index = 0; index < N + 2; index++) {
            ctx.pbox[index] = ORIG_P[index] ^ key[keyIndex];
            keyIndex++;
            if (keyIndex >= keysize) {
              keyIndex = 0;
            }
          }

          let Data1 = 0;
          let Data2 = 0;
          let res = 0;
          for (let i = 0; i < N + 2; i += 2) {
            res = BlowFish_Encrypt(ctx, Data1, Data2);
            Data1 = res.left;
            Data2 = res.right;
            ctx.pbox[i] = Data1;
            ctx.pbox[i + 1] = Data2;
          }

          for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 256; j += 2) {
              res = BlowFish_Encrypt(ctx, Data1, Data2);
              Data1 = res.left;
              Data2 = res.right;
              ctx.sbox[i][j] = Data1;
              ctx.sbox[i][j + 1] = Data2;
            }
          }

          return true;
        }

        /**
         * Blowfish block cipher algorithm.
         */
        var Blowfish = C_algo.Blowfish = BlockCipher.extend({
          _doReset: function () {
            // Skip reset of nRounds has been set before and key did not change
            if (this._keyPriorReset === this._key) {
              return;
            }

            // Shortcuts
            var key = this._keyPriorReset = this._key;
            var keyWords = key.words;
            var keySize = key.sigBytes / 4;

            //Initialization pbox and sbox
            BlowFishInit(BLOWFISH_CTX, keyWords, keySize);
          },

          encryptBlock: function (M, offset) {
            var res = BlowFish_Encrypt(BLOWFISH_CTX, M[offset], M[offset + 1]);
            M[offset] = res.left;
            M[offset + 1] = res.right;
          },

          decryptBlock: function (M, offset) {
            var res = BlowFish_Decrypt(BLOWFISH_CTX, M[offset], M[offset + 1]);
            M[offset] = res.left;
            M[offset + 1] = res.right;
          },

          blockSize: 64 / 32,

          keySize: 128 / 32,

          ivSize: 64 / 32
        });

        /**
         * Shortcut functions to the cipher's object interface.
         *
         * @example
         *
         *     var ciphertext = CryptoJS.Blowfish.encrypt(message, key, cfg);
         *     var plaintext  = CryptoJS.Blowfish.decrypt(ciphertext, key, cfg);
         */
        C.Blowfish = BlockCipher._createHelper(Blowfish);
      }());


      return CryptoJS;

    }

    try {
      if (my) {
        my.crypto = crypto();
      }
    }catch (e){}

    try {
      if (wx) {
        wx.crypto = crypto();
      }
    }catch (e){}

    try {
      if (swan) {
        swan.crypto = crypto();
      }
    }catch (e){}

    try {
      if (ks) {
        ks.crypto = crypto();
      }
    }catch (e){}

    try {
      if (bl) {
        bl.crypto = crypto();
      }
    }catch (e){}

    try {
      if (jd) {
        jd.crypto = crypto();
      }
    }catch (e){}

    try {
      if (tt) {
        tt.crypto = crypto();
      }
    }catch (e){}

    try {
      if (gamebox) {
        gamebox.crypto = crypto();
      }
    }catch (e){}

    try {
      if (qg) {
        qg.crypto = crypto();
      }
    }catch (e){}

    try {
      if (qg) {
        mgtv.crypto = crypto();
      }
    }catch (e){}

    try {
      if (window) {
        window.msCrypto = crypto();
      }
    }catch (e){}

    var cpkey = '4ca7dacc9332d74e1292c83f0aa3b376';
    function crypto$1() {
        // @ts-ignore
        return cryptoJS();
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
    /**
     * 获取系统设备信息(同步)
     * */
    var getUCSystemInfoSync = function () {
        var uc = window.uc || null;
        if (!uc)
            return {};
        try {
            var data = uc.getSystemInfoSync();
            return JSON.parse(data);
        }
        catch (err) {
        }
        return {};
    };
    function getQueryParams() {
        var url = window.location.href;
        var index = url.indexOf('?');
        if (index === -1)
            return {};
        var queryString = url.substring(index + 1);
        var params = {};
        var pairs = queryString.split('&');
        for (var _i = 0, pairs_1 = pairs; _i < pairs_1.length; _i++) {
            var pair = pairs_1[_i];
            var _a = pair.split('='), key = _a[0], value = _a[1];
            params[key] = decodeURIComponent(value || '');
        }
        return params;
    }
    function getSearchQueries(ifStringify) {
        var query = {};
        switch ("h5_qunhei") {
            case 'h5_uc':
                try {
                    var launchOptions = uc.getLaunchOptionsSync();
                    if (typeof launchOptions === 'string') {
                        launchOptions = JSON.parse(launchOptions);
                        query = launchOptions.query ? qs.parse(launchOptions.query) : {};
                        query = __assign(__assign({}, query), { entry: launchOptions.entry, state: launchOptions.state });
                    }
                }
                catch (e) {
                    query = __assign(__assign({}, query), { entry: 'unkown' });
                }
                break;
            case 'h5_huawei':
                query = {};
                break;
            default:
                query = getQueryParams();
        }
        return ifStringify ? qs.stringify(query) : query;
    }
    var customGetStorageSync = function (key) {
        var str = localStorage.getItem(key);
        try {
            return JSON.parse(str);
        }
        catch (e) {
            return str;
        }
    };
    var customSetStorageSync = function (key, value) {
        localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
    };
    var removeStorageSync = function (key) {
        localStorage.removeItem(key);
    };
    var getDevicecode = function () {
        var devicecode = customGetStorageSync('rx_devicecode');
        if (devicecode) {
            return devicecode.code;
        }
        else {
            var code = v4_1();
            customSetStorageSync('rx_devicecode', { code: code });
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
    var handleTrackError = function (platform, error_action, error, code) {
        if (error_action === void 0) { error_action = ''; }
        var handle_error = handleError(error, code);
        if (validateNumber(handle_error.code) || !handle_error.isServerError) {
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
                        error_action: error_action,
                        error_type: 'sdk',
                        trace_id: v4_1(),
                        rx_version: SYSTEM_INFO$1.__RX_SDK_VERSION,
                        type_tripartite: platform,
                        request_address: handle_error.url || '',
                        request_header: handle_error.request_header || '',
                        request_body: handle_error.request_body || '',
                        error_code: handle_error.code,
                        error_message: handle_error.msg || '',
                        error_code_tripartite: handle_error.thirdcode || '',
                        error_message_tripartite: handle_error.thirdmsg || '',
                        cp_userid: USER_INFO.cp_user_id,
                        error_ext: '请前往 https://doc.ruixueyun.com/#/view?path=9e58d663-7313-498c-b95c-f8706ec09bdd 查看解决方案'
                    }
                }
            ]).catch(function (e) {
                console.log(e);
            });
        }
        return {
            code: handle_error.code,
            msg: handle_error.msg,
            thirdcode: handle_error.thirdcode,
            thirdmsg: handle_error.thirdmsg,
        };
    };
    // 获取localStorage中所有的key
    function getAllKeys() {
        var keys = [];
        for (var i = 0; i < localStorage.length; i++) {
            keys.push(localStorage.key(i));
        }
        return keys;
    }
    var removeStorageByPrefix = function (prefix, predict) {
        var targetKeys = getAllKeys().filter(function (key) { return isFunction$1(predict) ? predict(key) : key.startsWith(prefix); });
        targetKeys.forEach(function (key) { return localStorage.removeItem(key); });
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
    function aesEncryptBase64String(data, key) {
        return AesEncryptBase64String(JSON.stringify(data), key, key.slice(0, 16));
    }
    function aesDecryptBase64String(data, key) {
        return AesDecryptBase64String(data, key, key.slice(0, 16));
    }
    function trackEncrypt(options, platform, key) {
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
                    type_tripartite: platform,
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
    function trackDecrypt(options, res, platform, key) {
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
                    type_tripartite: platform,
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

    var getSystemInfo = function () {
        switch ("h5_qunhei") {
            case 'h5_uc':
                return getUCSystemInfoSync();
            default:
                return {};
        }
    };
    var systemInfo = getSystemInfo();
    var getPlatformId = function () {
        var map = { android: 1, ios: 2, windows: 3, mac: 4 };
        return map[systemInfo.platform] || 0;
    };
    var SYSTEM_INFO = Object.assign(getSystemInfo, {
        fromChannel: 'minigame',
        platformid: getPlatformId()
    });

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

    // use for check params is valid
    function checkParamsValid(rules, checkValue) {
        var checkSchema = new Schema(rules);
        return checkSchema.validate(checkValue);
    }
    function ThrowError(errors, isJoin) {
        var str = '';
        if (isArray$1(errors)) {
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

    var shareScheduleInitParams = {
        funcs: {
            type: 'array'
        }
    };
    var shareScheduleReportParams = {
        func: {
            type: 'string',
            required: true
        },
        scheduling_type: {
            type: 'enum',
            enum: ['share', 'ad'],
            required: true
        },
        scheduling_event: {
            type: 'boolean',
            required: true
        },
        properties: {
            type: 'object'
        }
    };
    var checkIReqBusinessData = {
        window_key: {
            type: 'string',
            required: true
        },
        event: {
            type: 'string',
            required: true
        },
        before_event: {
            type: 'string'
        }
    };
    var checkIReqBusinessOrder = {
        trade_no: {
            type: 'string',
            required: true
        },
        sign: {
            type: 'string',
            required: true
        }
    };
    var H5PayCheckParams = {
        goods_tag: {
            type: 'string',
            required: true
        },
        age: {
            type: 'number'
        },
        trade_no: {
            type: 'string',
            required: true
        },
        is_debug: {
            type: 'enum',
            enum: [0, 1]
        },
        indulge_auth: {
            type: 'enum',
            enum: [0, 1]
        },
        env: {
            type: 'enum',
            enum: [0, 1]
        }
    };
    __assign({ pay_type: {
            type: 'enum',
            required: true,
            enum: ['minigame_uc']
        } }, H5PayCheckParams);
    __assign({ pay_type: {
            type: 'enum',
            required: true,
            enum: ['minigame_4399h5']
        } }, H5PayCheckParams);
    var H5QunheiPayCheckParams = __assign({ pay_type: {
            type: 'enum',
            required: true,
            enum: ['minigame_qunhei']
        } }, H5PayCheckParams);
    __assign({ pay_type: {
            type: 'enum',
            required: true,
            enum: ['minigame_xunlei']
        } }, H5PayCheckParams);
    __assign({ pay_type: {
            type: 'enum',
            required: true,
            enum: ['minigame_vng']
        } }, H5PayCheckParams);
    __assign({ pay_type: {
            type: 'enum',
            required: true,
            enum: ['minigame_quick']
        } }, H5PayCheckParams);
    __assign({ pay_type: {
            type: 'enum',
            required: true,
            enum: ['unicornh5']
        } }, H5PayCheckParams);
    __assign({ pay_type: {
            type: 'enum',
            required: true,
            enum: ['minigame_77']
        } }, H5PayCheckParams);
    __assign({ pay_type: {
            type: 'enum',
            required: true,
            enum: ['gametokh5']
        } }, H5PayCheckParams);
    __assign({ pay_type: {
            type: 'enum',
            required: true,
            enum: ['minigame_aiweiyou']
        } }, H5PayCheckParams);
    __assign({ pay_type: {
            type: 'enum',
            required: true,
            enum: ['minigame_007']
        }, server_id: {
            type: 'string',
            required: true
        }, server_name: {
            type: 'string',
            required: true
        }, role_id: {
            type: 'string',
            required: true
        }, role_name: {
            type: 'string',
            required: true
        }, role_level: {
            type: 'number',
            required: true
        } }, H5PayCheckParams);
    __assign({ pay_type: {
            type: 'enum',
            required: true,
            enum: ['minigame_zuiyou']
        } }, H5PayCheckParams);
    __assign({ pay_type: {
            type: 'enum',
            required: true,
            enum: ['minigame_haluo']
        } }, H5PayCheckParams);
    __assign({ pay_type: {
            type: 'enum',
            required: true,
            enum: ['minigame_lenovo']
        } }, H5PayCheckParams);
    __assign({ pay_type: {
            type: 'enum',
            required: true,
            enum: ['minigame_baiduh5']
        } }, H5PayCheckParams);
    __assign({ pay_type: {
            type: 'enum',
            required: true,
            enum: ['baiduh5']
        } }, H5PayCheckParams);
    __assign({ pay_type: {
            type: 'enum',
            required: true,
            enum: ['minigame_iqiyi']
        } }, H5PayCheckParams);
    __assign({ pay_type: {
            type: 'enum',
            required: true,
            enum: ['remianh5']
        } }, H5PayCheckParams);
    __assign({ pay_type: {
            type: 'enum',
            required: true,
            enum: ['h5_test']
        } }, H5PayCheckParams);
    __assign({ pay_type: {
            type: 'enum',
            required: true,
            enum: ['minigame_shandw']
        } }, H5PayCheckParams);
    var H5ShareCheckParams = {
        func: {
            type: 'string',
            required: true
        }
    };

    var setcustomCheck = {
        custom: {
            type: 'string',
            required: true,
        },
    };
    var relationTypesCheck = function (rule, value) {
        return new Promise(function (resolve, reject) {
            if (!isObject$1(value)) {
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

    var SdkCommon = /** @class */ (function () {
        function SdkCommon(platform) {
            this.platform = platform;
        }
        SdkCommon.prototype.getDeviceCode = function () {
            return getDevicecode();
        };
        // 用户管理
        SdkCommon.prototype.setcustom = function (params, _a) {
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
                            complete(handleTrackError(this.platform, '', err_1));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // 添加自定义关系
        SdkCommon.prototype.addRelation = function (params, _a) {
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
                            complete(handleTrackError(this.platform, '', err_2));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // 删除自定义关系
        SdkCommon.prototype.deleteRelation = function (params, _a) {
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
                            complete(handleTrackError(this.platform, '', err_3));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // 更新自定关系备注
        SdkCommon.prototype.updateremarks = function (params, _a) {
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
                            complete(handleTrackError(this.platform, '', err_4));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // 判断两用户是否存在某自定关系
        SdkCommon.prototype.hasRelation = function (params, _a) {
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
                            complete(handleTrackError(this.platform, '', err_5));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // 获取自定关系列表
        SdkCommon.prototype.relationList = function (params, _a) {
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
                            complete(handleTrackError(this.platform, '', err_6));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // 添加好友关系
        SdkCommon.prototype.addFriend = function (params, _a) {
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
                            complete(handleTrackError(this.platform, '', err_7));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // 删除好友关系
        SdkCommon.prototype.delfriend = function (params, _a) {
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
                            complete(handleTrackError(this.platform, '', err_8));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // 更新好友备注
        SdkCommon.prototype.updatefriendremarks = function (params, _a) {
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
                            complete(handleTrackError(this.platform, '', err_9));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // 判断两用户是否为好友
        SdkCommon.prototype.isfriend = function (params, _a) {
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
                            complete(handleTrackError(this.platform, '', err_10));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // 获取好友关系列表
        SdkCommon.prototype.friends = function (_a) {
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
                            complete(handleTrackError(this.platform, '', err_11));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * 排行榜相关接口
         */
        // 增加用户分数
        SdkCommon.prototype.addscore = function (params, _a) {
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
                            complete(handleTrackError(this.platform, '', err_12));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // 设置用户分数
        SdkCommon.prototype.setscore = function (params, _a) {
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
                            complete(handleTrackError(this.platform, '', err_13));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // 查询用户分数
        SdkCommon.prototype.queryuserrank = function (params, _a) {
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
                            complete(handleTrackError(this.platform, '', err_14));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // 获取排行榜列表
        SdkCommon.prototype.getranklist = function (params, _a) {
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
                            complete(handleTrackError(this.platform, '', err_15));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // 获取好友排行榜列表
        SdkCommon.prototype.friendsrank = function (params, _a) {
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
                            complete(handleTrackError(this.platform, '', err_16));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * 帮助中心
         */
        SdkCommon.prototype.getHelpcenterMainLayout = function (_a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var result, err_17;
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
                            err_17 = _b.sent();
                            complete(handleTrackError(this.platform, '', err_17));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SdkCommon.prototype.getHelpcenterQuestionLayout = function (params, _a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var result, err_18;
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
                            err_18 = _b.sent();
                            complete(handleTrackError(this.platform, '', err_18));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SdkCommon.prototype.getHelpcenterInfoLayout = function (params, _a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var result, err_19;
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
                            err_19 = _b.sent();
                            complete(handleTrackError(this.platform, '', err_19));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SdkCommon.prototype.helpcenterResolution = function (params, _a) {
            var complete = _a.complete;
            return __awaiter(this, void 0, void 0, function () {
                var result, err_20;
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
                            err_20 = _b.sent();
                            complete(handleTrackError(this.platform, '', err_20));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * 玩家意见反馈
         */
        SdkCommon.prototype.addFeedback = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var res, err_21;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, createFeedbackApi(params)];
                        case 1:
                            res = _a.sent();
                            console.log(res);
                            callback && callback.complete(res);
                            return [3 /*break*/, 3];
                        case 2:
                            err_21 = _a.sent();
                            callback && callback.complete(handleTrackError(this.platform, '', err_21));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SdkCommon.prototype.getFeedbackList = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var res, err_22;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, getFeedbackListApi(params)];
                        case 1:
                            res = _a.sent();
                            console.log(res);
                            callback && callback.complete(res);
                            return [3 /*break*/, 3];
                        case 2:
                            err_22 = _a.sent();
                            callback && callback.complete(handleTrackError(this.platform, '', err_22));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SdkCommon.prototype.getFeedbackDetail = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var res, err_23;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, getFeedbackDetailApi(params)];
                        case 1:
                            res = _a.sent();
                            console.log(res);
                            callback && callback.complete(res);
                            return [3 /*break*/, 3];
                        case 2:
                            err_23 = _a.sent();
                            callback && callback.complete(handleTrackError(this.platform, '', err_23));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // 领取道具
        SdkCommon.prototype.collectProps = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var res, err_24;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, collectPropsApi(params)];
                        case 1:
                            res = _a.sent();
                            console.log(res);
                            callback && callback.complete(res);
                            return [3 /*break*/, 3];
                        case 2:
                            err_24 = _a.sent();
                            callback && callback.complete(handleTrackError(this.platform, '', err_24));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // 获取公告列表
        SdkCommon.prototype.getAnnouncement = function (limit, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var productId, channelId, res, err_25;
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
                            err_25 = _a.sent();
                            callback && callback.complete(handleTrackError(this.platform, '', err_25));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * 用于设置自定义返回错误 Msg
         */
        SdkCommon.prototype.setErrorMsg = function (errMsg) {
            SYSTEM_INFO$1.errMsg = errMsg;
        };
        /**
         * 清空返回错误 Msg
         */
        SdkCommon.prototype.clearErrorMsg = function () {
            SYSTEM_INFO$1.errMsg = {
                default: ''
            };
        };
        // 发送验证码
        SdkCommon.prototype.sendCaptcha = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, sendCaptcha(params)];
                        case 1:
                            result = _a.sent();
                            callback.complete(result);
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            callback.complete(handleTrackError(this.platform, '', error_1));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // 绑定手机
        SdkCommon.prototype.bindPhone = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, bindPhone(params)];
                        case 1:
                            result = _a.sent();
                            callback.complete(result);
                            return [3 /*break*/, 3];
                        case 2:
                            error_2 = _a.sent();
                            callback.complete(handleTrackError(this.platform, '', error_2));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // 解绑手机
        SdkCommon.prototype.unBindPhone = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, unBindPhone(params)];
                        case 1:
                            result = _a.sent();
                            callback.complete(result);
                            return [3 /*break*/, 3];
                        case 2:
                            error_3 = _a.sent();
                            callback.complete(handleTrackError(this.platform, '', error_3));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // 绑定邮箱
        SdkCommon.prototype.bindEmail = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var data, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, bindEmail(params)];
                        case 1:
                            data = _a.sent();
                            callback.complete(data);
                            return [3 /*break*/, 3];
                        case 2:
                            error_4 = _a.sent();
                            callback.complete(handleTrackError(this.platform, '', error_4));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // 换绑手机
        SdkCommon.prototype.changePhone = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, changePhone(params)];
                        case 1:
                            result = _a.sent();
                            callback.complete(result);
                            return [3 /*break*/, 3];
                        case 2:
                            error_5 = _a.sent();
                            callback.complete(handleTrackError(this.platform, '', error_5));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // 换绑邮箱
        SdkCommon.prototype.changeEmail = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, changeEmail(params)];
                        case 1:
                            result = _a.sent();
                            callback.complete(result);
                            return [3 /*break*/, 3];
                        case 2:
                            error_6 = _a.sent();
                            callback.complete(handleTrackError(this.platform, '', error_6));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // 解绑邮箱
        SdkCommon.prototype.UnbindEmail = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var data, error_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, UnbindEmail(params)];
                        case 1:
                            data = _a.sent();
                            callback.complete(data);
                            return [3 /*break*/, 3];
                        case 2:
                            error_7 = _a.sent();
                            callback.complete(handleTrackError(this.platform, '', error_7));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // 注销账号
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
                            callback.complete(handleTrackError(this.platform, '', error_8));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // 撤销账号注销申请
        SdkCommon.prototype.deregisterCancel = function (callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_9;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, deregisterCancel()];
                        case 1:
                            result = _a.sent();
                            callback.complete(result);
                            return [3 /*break*/, 3];
                        case 2:
                            error_9 = _a.sent();
                            callback.complete(handleTrackError(this.platform, '', error_9));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // 获得用户信息
        SdkCommon.prototype.getInfo = function (callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_10;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, getInfoApi()];
                        case 1:
                            result = _a.sent();
                            callback.complete(result);
                            return [3 /*break*/, 3];
                        case 2:
                            error_10 = _a.sent();
                            callback.complete(handleTrackError(this.platform, '', error_10));
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
                            callback.complete(handleTrackError(this.platform, '', error_11));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // 修改瑞雪通行证用户信息。
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
                            callback.complete(handleTrackError(this.platform, '', error_12));
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
                            callback.complete(handleTrackError(this.platform, '', error_13));
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
                            callback.complete(handleTrackError(this.platform, '', error_14));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // 游戏版本检查
        SdkCommon.prototype.checkGameVersion = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var req, result, error_15;
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
                            error_15 = _a.sent();
                            callback.complete(handleTrackError(this.platform, '', error_15));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // 活动版本检查
        SdkCommon.prototype.checkActivityVersion = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var req, result, error_16;
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
                            error_16 = _a.sent();
                            callback.complete(handleTrackError(this.platform, '', error_16));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        SdkCommon.prototype.calculateValueSizeWithEncoding = function (key) {
            var value = localStorage.getItem(key);
            if (value === null) {
                return 0;
            }
            var size = 0;
            for (var i = 0; i < value.length; i++) {
                var charCode = value.charCodeAt(i);
                if (charCode <= 127) {
                    size++;
                }
                else {
                    size += 3;
                }
            }
            return size;
        };
        SdkCommon.prototype.track = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var p1, p2, getDevicecode_1, devicecode, type, time, uuids, platform_id, copyCpid, product_id, channel_id, cpid, publicProps, new_properties, reqarr, useCache, size, rx_track_queue, result, err_26;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            p1 = null;
                            p2 = null;
                            try {
                                if (params.complete) {
                                    p2 = params;
                                    p1 = callback;
                                }
                                else {
                                    p1 = params;
                                    p2 = callback;
                                }
                            }
                            catch (err) {
                                p1 = params;
                                p2 = callback;
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
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
                            copyCpid = SYSTEM_INFO$1.cpid, product_id = SYSTEM_INFO$1.productId, channel_id = SYSTEM_INFO$1.channelId;
                            cpid = Number(copyCpid);
                            publicProps = customGetStorageSync('rx_public_props');
                            new_properties = {};
                            if (SYSTEM_INFO$1.region_tag) {
                                new_properties.rx_region_tag = "".concat(SYSTEM_INFO$1.region_tag);
                            }
                            if (SYSTEM_INFO$1.cp_role_id) {
                                new_properties['#role_id'] = "".concat(SYSTEM_INFO$1.cp_role_id);
                            }
                            if (SYSTEM_INFO$1.third_channel_code) {
                                new_properties.third_channel = "".concat(SYSTEM_INFO$1.third_channel_code);
                            }
                            reqarr = [
                                __assign({ type: type, time: time, uuid: uuids, distinct_id: USER_INFO === null || USER_INFO === void 0 ? void 0 : USER_INFO.openid, sub_channel_id: USER_INFO === null || USER_INFO === void 0 ? void 0 : USER_INFO.subchannelid, platform_id: platform_id, product_id: product_id, cpid: cpid, channel_id: channel_id, devicecode: devicecode }, __assign(__assign({}, p1), { properties: __assign(__assign(__assign({}, new_properties), p1.properties), publicProps) }))
                            ];
                            !USER_INFO.subchannelid || (reqarr[0].sub_channel_id = USER_INFO.subchannelid);
                            useCache = SYSTEM_INFO$1.single_player_mode;
                            size = this.calculateValueSizeWithEncoding('rx_track_queue');
                            console.log('rx_track_queue size:', size);
                            if (useCache && size <= 2 * 1024 * 1024) {
                                rx_track_queue = customGetStorageSync('rx_track_queue') || [];
                                rx_track_queue = rx_track_queue.concat(reqarr);
                                customSetStorageSync('rx_track_queue', rx_track_queue);
                                p2.complete({ code: 0, data: null, msg: 'track cache' });
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, trackApi(reqarr)];
                        case 2:
                            result = _a.sent();
                            p2.complete(__assign(__assign({}, result), { data: null, msg: 'track success' }));
                            return [3 /*break*/, 4];
                        case 3:
                            err_26 = _a.sent();
                            p2.complete(handleError(err_26));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        SdkCommon.prototype.multipleTrack = function () {
            return __awaiter(this, void 0, void 0, function () {
                var rx_track_queue, err_27;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            rx_track_queue = customGetStorageSync('rx_track_queue') || [];
                            if (!rx_track_queue.length) return [3 /*break*/, 2];
                            console.log('批量补上报大数据');
                            return [4 /*yield*/, trackApi(rx_track_queue)];
                        case 1:
                            _a.sent();
                            removeStorageSync('rx_track_queue');
                            _a.label = 2;
                        case 2: return [3 /*break*/, 4];
                        case 3:
                            err_27 = _a.sent();
                            console.log(err_27);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // 获取商业化接口
        SdkCommon.prototype.getOperationScene = function (callback) {
            return __awaiter(this, void 0, void 0, function () {
                var res, err_28;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, getOperationSceneApi()];
                        case 1:
                            res = _a.sent();
                            callback && callback.complete(res);
                            return [3 /*break*/, 3];
                        case 2:
                            err_28 = _a.sent();
                            callback && callback.complete(handleTrackError(this.platform, '', err_28));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // 商业化上报接口
        SdkCommon.prototype.reportWindowExposure = function (properties, callback) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.track({
                        complete: function (data) {
                            callback && callback.complete(data);
                        }
                    }, {
                        event: '#window_exposure',
                        properties: properties
                    });
                    return [2 /*return*/];
                });
            });
        };
        // 游戏区服信息查询
        SdkCommon.prototype.getGameArea = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_17;
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
                            error_17 = _a.sent();
                            callback.complete(handleError(error_17));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // 游戏区服信息修改
        SdkCommon.prototype.putGameArea = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_18;
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
                            error_18 = _a.sent();
                            callback.complete(handleError(error_18));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // 创建游戏区服
        SdkCommon.prototype.createGameArea = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_19;
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
                            error_19 = _a.sent();
                            callback.complete(handleError(error_19));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // 删除游戏区服
        SdkCommon.prototype.delGameArea = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_20;
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
                            error_20 = _a.sent();
                            callback.complete(handleError(error_20));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // 查询区服列表信息
        SdkCommon.prototype.getGameAreaList = function (callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_21;
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
                            error_21 = _a.sent();
                            callback.complete(handleError(error_21));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // 创建角色
        SdkCommon.prototype.createGameCharacter = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_22;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, createGameCharacterApi(params)];
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
        // 修改游戏角色信息
        SdkCommon.prototype.putGameCharacter = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_23;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, putGameCharacterApi(params)];
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
        // 删除游戏角色
        SdkCommon.prototype.delGameCharacter = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_24;
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
                            error_24 = _a.sent();
                            callback.complete(handleError(error_24));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // 查询账号下角色信息列表
        SdkCommon.prototype.getGameCharacterAccount = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_25;
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
                            error_25 = _a.sent();
                            callback.complete(handleError(error_25));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // 查询账号下某个区服下的角色信息列表
        SdkCommon.prototype.getGameCharacter = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_26;
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
                            error_26 = _a.sent();
                            callback.complete(handleError(error_26));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // 查询具体角色信息
        SdkCommon.prototype.getGameAccountAreaCharacter = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_27;
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
                            error_27 = _a.sent();
                            callback.complete(handleError(error_27));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SdkCommon.prototype.exchangeItemProp = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_28;
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
                            error_28 = _a.sent();
                            callback.complete(handleError(error_28));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SdkCommon.prototype.getDevicecode = function () {
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
        // 邮件列表
        SdkCommon.prototype.getEmailList = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_29;
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
                            error_29 = _a.sent();
                            callback.complete(handleError(error_29));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // 邮件详情
        SdkCommon.prototype.getEmailDetail = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_30;
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
                            error_30 = _a.sent();
                            callback.complete(handleError(error_30));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // 邮件领取
        SdkCommon.prototype.receiveEmail = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_31;
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
                            error_31 = _a.sent();
                            callback.complete(handleError(error_31));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // 邮件删除
        SdkCommon.prototype.delEmail = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_32;
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
                            error_32 = _a.sent();
                            callback.complete(handleError(error_32));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // 新版通用版本检查 v2
        SdkCommon.prototype.updateGameVersion = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_33;
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
                            error_33 = _a.sent();
                            callback.complete(handleError(error_33));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SdkCommon.prototype.setCpOf = function (bool) {
            SYSTEM_INFO$1.CP_OF = bool;
        };
        SdkCommon.prototype.getCpOf = function () {
            return SYSTEM_INFO$1.CP_OF || false;
        };
        SdkCommon.prototype.setGameInfo = function (cp_role_id, region_tag) {
            SYSTEM_INFO$1.cp_role_id = cp_role_id;
            SYSTEM_INFO$1.region_tag = region_tag;
        };
        SdkCommon.prototype.searchGameAccount = function (callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_34;
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
                            error_34 = _a.sent();
                            callback.complete(handleError(error_34));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SdkCommon.prototype.getTempNotice = function (callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_35;
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
                            error_35 = _a.sent();
                            callback.complete(handleError(error_35));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SdkCommon.prototype.getH5LoginConfig = function (callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_36;
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
                            error_36 = _a.sent();
                            callback.complete(handleError(error_36));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SdkCommon.prototype.tradeQuery = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, error_37;
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
                            error_37 = _a.sent();
                            callback.complete(handleError(error_37));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SdkCommon.prototype.setLanguage = function (language) {
            if (language === void 0) { language = 'zh-CN'; }
            SYSTEM_INFO$1.language = language;
        };
        return SdkCommon;
    }());

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
     * H5：初始化成功后注册页面可见性监听
     * 切到前台（visibilitychange 且可见）时调用接口刷新 st_offset
     */
    var setupStOffsetRefreshForH5 = function (getServerTimeApi) {
        if (stOffsetRegistered)
            return;
        if (typeof document === 'undefined' || typeof document.addEventListener !== 'function')
            return;
        stOffsetRegistered = true;
        document.addEventListener('visibilitychange', function () {
            if (!document.hidden) {
                refreshStOffset(getServerTimeApi);
            }
        }, false);
    };

    var PLATFORM = 'minigame_qunhei';
    var SdkQunhei = /** @class */ (function (_super) {
        __extends(SdkQunhei, _super);
        function SdkQunhei(initParams) {
            var _this = _super.call(this, PLATFORM) || this;
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
                hit_cache: false
            };
            // 商业化接口是否返回结果
            _this.businessRuleInvoking = false;
            // 条件获取商业化窗口队列
            _this.businessWindowsQueue = [];
            // 上报公共属性接口失败次数
            _this.trackPublicPropsFailCount = 0;
            _this.funcs = [];
            _this.initConfig = {};
            // 调度埋点
            _this.scheduleInitMap = {};
            // 获取分享数据缓存调度上报参数
            _this.scheuleReportProps = {};
            // 子渠道id
            _this.subChannelId = null;
            // 是否为推广员
            _this.is_promoter = false;
            _this.game_id = '';
            // 推广员福利码相关信息
            _this.promoInfo = {
                timer: null,
                refresh_period_exp: 0,
                polling: 0,
                promo_code: ''
            };
            Object.assign(SYSTEM_INFO$1, SYSTEM_INFO, __assign({}, initParams));
            if (window.qhsdk) {
                _this.getInitConfig({ complete: initParams.complete });
            }
            else {
                _this.loadScript('https:////port.game3.cn/game/qhjssdk')
                    .then(function () {
                    _this.getInitConfig({ complete: initParams.complete });
                })
                    .catch(function (err) {
                    initParams.complete(handleTrackError(PLATFORM, 'rxlog_error_init', {
                        code: -1,
                        msg: '群黑 sdk加载失败'
                    }));
                });
            }
            return _this;
        }
        SdkQunhei.prototype.login = function (params, callback) {
            var _a, _b, _c, _d;
            return __awaiter(this, void 0, void 0, function () {
                var user_source, now, distinct_idLocal, distinct_id, requestParams, queryJson, user_info, reflowEnabled, source_ad, reqLogin, login_info, _e, custom_ext, rest_ext, err_1;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            _f.trys.push([0, 5, , 6]);
                            user_source = this.getLoginQsAndGenerateStruct();
                            now = new Date().getTime();
                            distinct_idLocal = customGetStorageSync('rx_distinct_id');
                            distinct_id = distinct_idLocal || v4_1();
                            if (!distinct_idLocal) {
                                customSetStorageSync('rx_distinct_id', distinct_id);
                            }
                            requestParams = __assign({ ts: now, method: params.method || 'minigame_qunhei', distinct_id: distinct_id, ext: params.ext }, user_source);
                            try {
                                if (this.subChannelId !== null) {
                                    queryJson = getSearchQueries();
                                    requestParams.user_source = {
                                        guide: __assign(__assign({}, user_source), { subchannelid: this.subChannelId })
                                    };
                                    if (queryJson) {
                                        requestParams.user_source.guide = __assign(__assign({}, requestParams.user_source.guide), queryJson);
                                    }
                                }
                            }
                            catch (err) {
                            }
                            user_info = {};
                            if (!params.login_openid) return [3 /*break*/, 2];
                            requestParams.login_openid = params.login_openid;
                            return [4 /*yield*/, loginByTokenApi(this.ActivePrefix(requestParams))];
                        case 1:
                            user_info = _f.sent();
                            return [3 /*break*/, 4];
                        case 2:
                            reflowEnabled = ((_b = (_a = this.initConfig) === null || _a === void 0 ? void 0 : _a.advertise_switch) === null || _b === void 0 ? void 0 : _b.switch) === 1;
                            source_ad = this.getAttributionData();
                            reqLogin = reflowEnabled ? __assign(__assign({}, requestParams), { device: source_ad }) : requestParams;
                            login_info = getSearchQueries();
                            _e = reqLogin.ext || {}, custom_ext = _e.custom_ext, rest_ext = __rest(_e, ["custom_ext"]);
                            reqLogin.custom_ext = custom_ext || {};
                            reqLogin.ext = __assign(__assign({}, (rest_ext || {})), { username: login_info.username, server_id: login_info.serverid, time: login_info.time, isadult: login_info.isadult, uimg: login_info.uimg, uname: login_info.nname, flag: login_info.flag });
                            return [4 /*yield*/, loginByCredentialApi(this.ActivePrefix(reqLogin))];
                        case 3:
                            user_info = _f.sent();
                            _f.label = 4;
                        case 4:
                            Object.assign(USER_INFO, user_info.data);
                            if ((((_c = user_info === null || user_info === void 0 ? void 0 : user_info.data) === null || _c === void 0 ? void 0 : _c.user_flag) & 1) == 1) {
                                this.is_promoter = true;
                                this.game_id = ((_d = user_info === null || user_info === void 0 ? void 0 : user_info.data) === null || _d === void 0 ? void 0 : _d.cp_user_id) || '';
                            }
                            customSetStorageSync('rx-loginState', 1);
                            customSetStorageSync('rxToken', user_info.data.token);
                            customSetStorageSync('rxUserInfo', user_info.data);
                            callback.complete(user_info);
                            return [3 /*break*/, 6];
                        case 5:
                            err_1 = _f.sent();
                            console.log(JSON.stringify(err_1));
                            callback.complete(handleTrackError(PLATFORM, 'rxlog_error_login', err_1));
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        SdkQunhei.prototype.pay = function (params, callback) {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var exchange, rest, reqOrder, result, err_2;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            exchange = params.exchange, rest = __rest(params, ["exchange"]);
                            if (exchange) {
                                this.exchangeItemProp(rest, callback);
                                return [2 /*return*/];
                            }
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, pubCheck(H5QunheiPayCheckParams, callback, params)];
                        case 2:
                            _b.sent();
                            if (params.indulge_auth == 1 && !params.age) {
                                throw Error('when indulge_auth equal 1,the age must be required');
                            }
                            reqOrder = __assign(__assign({}, params), { currency: params.currency || 'CNY', openid: USER_INFO.openid, sub_channel_id: USER_INFO === null || USER_INFO === void 0 ? void 0 : USER_INFO.subchannelid, is_debug: params.is_debug || 0, env: params.env || 0 });
                            return [4 /*yield*/, orderApi(reqOrder)];
                        case 3:
                            result = _b.sent();
                            qhsdk.pay((_a = result.data) === null || _a === void 0 ? void 0 : _a.ext);
                            callback.complete({ code: 0 });
                            return [3 /*break*/, 5];
                        case 4:
                            err_2 = _b.sent();
                            callback.complete(handleTrackError(PLATFORM, 'rxlog_error_pay', err_2));
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        SdkQunhei.prototype.share = function () {
            qhsdk.share();
        };
        // 实名验证接口
        SdkQunhei.prototype.userVerify = function (type, callback) {
            qhsdk.userVerify(type, function (res) {
                callback.complete(res);
            });
        };
        // 微信关注接口
        SdkQunhei.prototype.wechatFollow = function (callback) {
            qhsdk.iswxgz(function (res) {
                callback.complete({
                    code: res.code,
                    msg: res.code == 1 ? '关注成功' : '关注失败'
                });
            });
        };
        // 提交开服接口
        SdkQunhei.prototype.serverAdd = function (param, callback) {
        };
        // 角色上下线上报
        SdkQunhei.prototype.upOnline = function (param, callback) {
        };
        // 角色上报接口
        SdkQunhei.prototype.upRole = function (param, callback) {
            qhsdk.role(param);
        };
        // 拉起输入法窗口异常
        SdkQunhei.prototype.inputLeave = function () {
            window.parent.postMessage({ 'action': 'inputLeave' }, '*');
        };
        // 刷新当前游戏地址
        SdkQunhei.prototype.reloadUrl = function () {
            qhsdk.reloadUrl();
        };
        // 平台敏感词检测接口
        SdkQunhei.prototype.checkWord = function (words, callback) {
            console.log('words:', words);
            qhsdk.checkWord(words, function (res) {
                console.log('检查状态', res.code, res.words);
                // 10000 没有敏感词
                // 10001 有敏感词
                // 10010 未知异常(如网络问题)
                callback.complete({
                    code: res.code,
                    // @ts-ignore
                    msg: {
                        10000: '没有敏感词',
                        10001: '有敏感词',
                        10010: '未知异常'
                    }[res.code],
                    words: res.words
                });
            }, 'chat');
        };
        SdkQunhei.prototype.schedulingAction = function (params, callback) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function () {
                var func, schedulingRes, scheduling_type, shareData, err_3;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 2, , 3]);
                            func = params === null || params === void 0 ? void 0 : params.func;
                            schedulingRes = this.getShareScheduling({ funcs: [func] });
                            scheduling_type = ((_b = (_a = schedulingRes === null || schedulingRes === void 0 ? void 0 : schedulingRes.data) === null || _a === void 0 ? void 0 : _a[func]) === null || _b === void 0 ? void 0 : _b.scheduling_type) || 'share';
                            console.log('sdk schedulingAction scheduling_type:', func, scheduling_type);
                            return [4 /*yield*/, this.getShareData(params, callback, true)];
                        case 1:
                            shareData = _c.sent();
                            console.log('sdk getShareData:', shareData);
                            if (scheduling_type === 'ad') {
                                this.rewardedVideoAd({
                                    complete: 
                                    // @ts-ignore
                                    function (args) {
                                        callback.complete(__assign({ scheduling_type: 'ad' }, (args || {})));
                                    }
                                });
                            }
                            else if (scheduling_type === 'share') {
                                this.share();
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            err_3 = _c.sent();
                            callback.complete(handleTrackError(PLATFORM, 'rxlog_error_share', err_3));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        //获得分享内容
        SdkQunhei.prototype.getAdShareData = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var region, productId, channelId, platform, transmits, func, type, sub_channel_id, open_id, shareData, err_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            region = (params === null || params === void 0 ? void 0 : params.region) || USER_INFO.region || '';
                            productId = SYSTEM_INFO$1.productId, channelId = SYSTEM_INFO$1.channelId;
                            platform = 'qunhei';
                            transmits = encodeURI(params.transmits || '');
                            func = params.func;
                            type = 'mini';
                            sub_channel_id = USER_INFO.subchannelid || '';
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
                                    open_id: open_id
                                })];
                        case 1:
                            shareData = _a.sent();
                            callback && callback.complete(shareData);
                            return [2 /*return*/, shareData];
                        case 2:
                            err_4 = _a.sent();
                            callback && callback.complete(handleTrackError(PLATFORM, '', err_4));
                            return [2 /*return*/, err_4];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SdkQunhei.prototype.rewardedVideoAd = function (_a) {
            var complete = _a.complete;
            qhsdk.createAd('1', function (res) {
                if (res.adcodes == 1) {
                    complete({
                        code: 0,
                        data: null,
                        msg: '正常播放结束，可以下发游戏奖励',
                        isEnded: true
                    });
                }
                else {
                    complete({
                        code: Number(res.adcodes) || -1,
                        data: null,
                        msg: res.msg,
                        isEnded: false
                    });
                }
            });
        };
        SdkQunhei.prototype.setScheuleReportProps = function (data) {
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
                platform: (data === null || data === void 0 ? void 0 : data.platform) || PLATFORM
            };
        };
        // 获得公共属性
        SdkQunhei.prototype.getPublicProperties = function () {
            var data = customGetStorageSync("rx_public_props");
            return { code: 0, data: data };
        };
        /**
         * 设置公共属性
         * 设置后CP无需每次上报都传，由SDK填入properties中。
         */
        SdkQunhei.prototype.setPublicProperties = function (params) {
            if (!isObject$1(params)) {
                var error = new Error('params must be object');
                error.code = COMMON_ERROR_CODE.PAY_PARAMS_ERROR;
                return handleTrackError(PLATFORM, '', error);
            }
            try {
                customSetStorageSync('rx_public_props', params);
                return { code: 0 };
            }
            catch (error) {
                return handleTrackError(PLATFORM, '', error);
            }
        };
        /**
         * 修改设置的公共数据。
         */
        SdkQunhei.prototype.updatePublicProperties = function (params) {
            if (!isObject$1(params)) {
                var error = new Error('params must be object');
                error.code = COMMON_ERROR_CODE.PAY_PARAMS_ERROR;
                return handleTrackError(PLATFORM, '', error);
            }
            try {
                var cache = customGetStorageSync('rx_public_props');
                // @ts-ignore
                customSetStorageSync('rx_public_props', __assign(__assign({}, cache), params));
                return { code: 0 };
            }
            catch (error) {
                return handleTrackError(PLATFORM, '', error);
            }
        };
        /**
         * 删除公共属性
         */
        SdkQunhei.prototype.deletePublicProperties = function (params) {
            try {
                var cache = customGetStorageSync('rx_public_props');
                // @ts-ignore
                var rest = omit(cache, params);
                customSetStorageSync('rx_public_props', rest);
                return { code: 0 };
            }
            catch (error) {
                return handleTrackError(PLATFORM, '', error);
            }
        };
        //获得分享内容
        SdkQunhei.prototype.getShareData = function (params, callback, stopCallback) {
            return __awaiter(this, void 0, void 0, function () {
                var region, cacheShareData, _a, readCache, cShareData, productId, channelId, platform, transmits, func, type, sub_channel_id, open_id, shareData, err_5;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 7]);
                            return [4 /*yield*/, pubCheck(H5ShareCheckParams, callback, params)];
                        case 1:
                            _b.sent();
                            region = (params === null || params === void 0 ? void 0 : params.region) || USER_INFO.region || '';
                            cacheShareData = customGetStorageSync("rx_schedule_".concat(USER_INFO.tid, "_").concat(params.func, "_").concat(region));
                            _a = params.readCache, readCache = _a === void 0 ? true : _a;
                            if (readCache && cacheShareData) {
                                cShareData = JSON.parse(cacheShareData);
                                console.info('sdk 缓存分享数据：', cShareData);
                                this.setScheuleReportProps(cShareData === null || cShareData === void 0 ? void 0 : cShareData.data);
                                !stopCallback && callback.complete(cShareData);
                                return [2 /*return*/, cShareData];
                            }
                            productId = SYSTEM_INFO$1.productId, channelId = SYSTEM_INFO$1.channelId;
                            platform = 'qunhei';
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
                                    custom_ext: params.custom_ext || {}
                                })];
                        case 2:
                            shareData = _b.sent();
                            if (!stopCallback) {
                                callback.complete(shareData);
                            }
                            this.setScheuleReportProps(shareData === null || shareData === void 0 ? void 0 : shareData.data);
                            return [2 /*return*/, shareData];
                        case 3:
                            err_5 = _b.sent();
                            if (!(err_5.code == 305407)) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.shareSchedulingInit({}, {
                                    complete: function () {
                                        if (!stopCallback) {
                                            callback.complete(handleTrackError(PLATFORM, '', err_5));
                                        }
                                    }
                                })];
                        case 4:
                            _b.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            if (!stopCallback) {
                                callback.complete(handleTrackError(PLATFORM, '', err_5));
                            }
                            _b.label = 6;
                        case 6:
                            this.track(formatTrackParams({
                                eventName: 'track_err',
                                apiName: 'getShareData',
                                reqParams: params,
                                errorInfo: err_5,
                                loginInfo: USER_INFO
                            }), {
                                complete: function (data) {
                                    console.info('getShareData error add complete func when tracked:', data);
                                }
                            });
                            return [2 /*return*/, handleTrackError(PLATFORM, '', err_5)];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        // 获取埋点调度
        SdkQunhei.prototype.getShareScheduling = function (params) {
            var funcs = params === null || params === void 0 ? void 0 : params.funcs;
            if (!funcs)
                return { code: 0, data: this.scheduleInitMap };
            if (funcs && !isArray$1(funcs)) {
                var error = new Error('funcs must be Array');
                error.code = COMMON_ERROR_CODE.PARAMS_ERROR;
                return handleTrackError(PLATFORM, '', error);
            }
            try {
                console.log('sdk getShareScheduling: ', params, this.scheduleInitMap);
                var data = pick(this.scheduleInitMap, funcs);
                return { code: 0, data: data };
            }
            catch (error) {
                return handleTrackError(PLATFORM, '', error);
            }
        };
        // 分享调度初始化
        SdkQunhei.prototype.shareSchedulingInit = function (params, callback) {
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
        // 看广告完成上报
        SdkQunhei.prototype.shareSchedulingReport = function (params, callback) {
            var _a, _b, _c;
            return __awaiter(this, void 0, void 0, function () {
                var func, region, sub_channel_id, open_id, scheduling_event, Iparams, result_1, remaining_share_count, error_2;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 8, , 9]);
                            return [4 /*yield*/, pubCheck(shareScheduleReportParams, callback, params)];
                        case 1:
                            _d.sent();
                            func = params.func;
                            region = (params === null || params === void 0 ? void 0 : params.region) || USER_INFO.region || '';
                            sub_channel_id = USER_INFO.subchannelid || '';
                            open_id = USER_INFO.openid || '';
                            scheduling_event = (params === null || params === void 0 ? void 0 : params.scheduling_event) === true ? 'done' : 'fail';
                            Iparams = __assign(__assign({ platform: PLATFORM, type: 'mini', sub_channel_id: sub_channel_id, open_id: open_id }, params), { region: region, scheduling_event: scheduling_event, properties: __assign({ region: region }, params === null || params === void 0 ? void 0 : params.properties) });
                            // ad不上报上一次的分享数据
                            if (params.scheduling_type == 'share') {
                                Iparams.properties = __assign(__assign({}, this.scheuleReportProps), Iparams.properties);
                            }
                            return [4 /*yield*/, schedulingReportApi(Iparams)];
                        case 2:
                            result_1 = _d.sent();
                            if (!isEmpty(result_1 === null || result_1 === void 0 ? void 0 : result_1.data)) return [3 /*break*/, 4];
                            console.log('上报返回为空，对应埋点删除');
                            this.scheduleInitMap = omit(this.scheduleInitMap, func);
                            removeStorageSync("rx_schedule_".concat(USER_INFO.tid, "_").concat(func, "_").concat(region));
                            return [4 /*yield*/, this.shareSchedulingInit({}, {
                                    complete: function () {
                                        console.log('shareSchedulingInit');
                                        callback.complete(result_1);
                                    }
                                })];
                        case 3:
                            _d.sent();
                            return [2 /*return*/];
                        case 4:
                            remaining_share_count = ((_b = (_a = result_1 === null || result_1 === void 0 ? void 0 : result_1.data) === null || _a === void 0 ? void 0 : _a.scheduling) === null || _b === void 0 ? void 0 : _b.remaining_share_count) || 0;
                            console.log('上报后剩余次数为' + remaining_share_count);
                            if (!(remaining_share_count <= 0)) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.shareSchedulingInit({}, {
                                    complete: function () {
                                        console.log('shareSchedulingInit');
                                        callback.complete(result_1);
                                    }
                                })];
                        case 5:
                            _d.sent();
                            return [2 /*return*/];
                        case 6:
                            this.scheduleInitMap[func] = (_c = result_1 === null || result_1 === void 0 ? void 0 : result_1.data) === null || _c === void 0 ? void 0 : _c.scheduling;
                            customSetStorageSync("rx_schedule_".concat(USER_INFO.tid, "_").concat(func, "_").concat(region), JSON.stringify(result_1));
                            _d.label = 7;
                        case 7:
                            callback.complete(result_1);
                            return [3 /*break*/, 9];
                        case 8:
                            error_2 = _d.sent();
                            callback.complete(handleTrackError(PLATFORM, '', error_2));
                            return [3 /*break*/, 9];
                        case 9: return [2 /*return*/];
                    }
                });
            });
        };
        SdkQunhei.prototype.getInitConfig = function (callback) {
            var _a, _b, _c, _d, _e, _f, _g;
            return __awaiter(this, void 0, void 0, function () {
                var init_info, initParams, res, config, version, _i, _h, key, prop_version, _serverTime, err_6, error;
                return __generator(this, function (_j) {
                    switch (_j.label) {
                        case 0:
                            init_info = getSearchQueries();
                            qhsdk.init({
                                username: init_info.username,
                                gid: init_info.gid,
                                qhchannel: init_info.qhchannel,
                                qhchannelid: init_info.qhchannelid,
                                time: init_info.time
                            });
                            initParams = customGetStorageSync('rx-init-params') || {};
                            _j.label = 1;
                        case 1:
                            _j.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, getInitConf({ version: (_a = initParams === null || initParams === void 0 ? void 0 : initParams.version) !== null && _a !== void 0 ? _a : {} })];
                        case 2:
                            res = _j.sent();
                            config = res.data || {};
                            version = {};
                            for (_i = 0, _h = Object.keys(config); _i < _h.length; _i++) {
                                key = _h[_i];
                                prop_version = (_c = (_b = config[key]) === null || _b === void 0 ? void 0 : _b.version) !== null && _c !== void 0 ? _c : '';
                                if (prop_version) {
                                    version[key] = prop_version;
                                    this.initConfig[key] = { timerId: 0 };
                                }
                                this.initConfig[key] = config[key];
                            }
                            //检查是否需要传递subchannleid
                            this.publicSubchannelCheck(res);
                            customSetStorageSync('rx-init-params', { version: version });
                            SYSTEM_INFO$1.SDK_INIT_FINISHED = true;
                            SYSTEM_INFO$1.CP_OF = ((_e = (_d = res === null || res === void 0 ? void 0 : res.data) === null || _d === void 0 ? void 0 : _d.cp) === null || _e === void 0 ? void 0 : _e.of) || false;
                            _serverTime = (_g = (_f = res === null || res === void 0 ? void 0 : res.data) === null || _f === void 0 ? void 0 : _f.server) === null || _g === void 0 ? void 0 : _g.time;
                            if (_serverTime) {
                                SYSTEM_INFO$1.st_offset = String(Number(_serverTime) - Date.now());
                            }
                            setupStOffsetRefreshForH5(getServerTime);
                            // 检查是否需要激活
                            this.checkNeedActivate();
                            this.loopGetPublicProps();
                            callback.complete({ code: 0, data: this.initConfig });
                            return [3 /*break*/, 4];
                        case 3:
                            err_6 = _j.sent();
                            error = __assign(__assign({}, (err_6 || {})), { msg: '初始化错误，或未初始化', code: COMMON_ERROR_CODE.INIT_PARAMS_ERROR, thirdcode: err_6.code || err_6.errCode, message: err_6.message || err_6.msg || err_6.errMsg, thirdmsg: err_6.message || err_6.msg || err_6.errMsg });
                            callback.complete(handleTrackError(PLATFORM, 'rxlog_error_init', error));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        SdkQunhei.prototype.publicSubchannelCheck = function (res) {
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
        // 获取归因数据
        SdkQunhei.prototype.getAttributionData = function () {
            var universal = getSearchQueries();
            var source_ad = {};
            if (universal === null || universal === void 0 ? void 0 : universal.ad_platform) {
                source_ad.ad_rawargs = omit(universal, ['ad_platform']);
                source_ad.ad_platform = universal.ad_platform;
            }
            return source_ad;
        };
        SdkQunhei.prototype.checkNeedActivate = function () {
            return __awaiter(this, void 0, void 0, function () {
                var activeResult, source_ad, distinct_id, req, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            activeResult = customGetStorageSync('rx-active-result');
                            if (!!activeResult) return [3 /*break*/, 4];
                            source_ad = this.getAttributionData();
                            distinct_id = v4_1();
                            customSetStorageSync('rx_distinct_id', distinct_id);
                            req = {
                                stage: 'init',
                                distinct_id: distinct_id,
                                source_ad: source_ad
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
        /**
         * 轮训获取公共属性
         *
         */
        SdkQunhei.prototype.loopGetPublicProps = function () {
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
                        event_public_attr.timerId = setTimeout(function () { return getPublicPropsConfig(); }, ms || _this.businessRuleDefaultRefreshTime);
                    };
                    getPublicPropsConfig = function () { return __awaiter(_this, void 0, void 0, function () {
                        var res, _a, _b, refresh, public_attr, _c, version, initParams, error_3;
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
                                    initParams = customGetStorageSync('rx-init-params');
                                    // 获取到最新的version后更新到缓存中，下次初始化的时候用这个最新的version请求初始化配置接口
                                    customSetStorageSync('rx-init-params', __assign(__assign({}, initParams), { version: __assign(__assign({}, initParams.version), { event_public_attr: version }) }));
                                    repeat(event_public_attr.refresh);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_3 = _d.sent();
                                    handleTrackError(PLATFORM, '', error_3);
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
        //格式化queryString
        SdkQunhei.prototype.getLoginQsAndGenerateStruct = function () {
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
                            user_attrs: leftProps
                        };
                    }
                    else {
                        user_source = {
                            user_source: (_a = {},
                                _a[universal['user_source']] = leftProps,
                                _a)
                        };
                    }
                    return user_source;
                }
            }
            var subPackageInfo = customGetStorageSync('rx_sub_package_info');
            if (!isEmpty(subPackageInfo)) {
                user_source = {
                    user_source: {
                        sub_package: subPackageInfo
                    }
                };
                return user_source;
            }
            return null;
        };
        SdkQunhei.prototype.ActivePrefix = function (reqParams) {
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
        SdkQunhei.prototype.setSubChannelId = function (subChannelId) {
            try {
                customSetStorageSync('rx_sub_package_info', { sub_channel_id: subChannelId });
                return { code: 0 };
            }
            catch (error) {
                return handleTrackError(PLATFORM, '', error);
            }
        };
        SdkQunhei.prototype.loadScript = function (url) {
            return new Promise(function (resolve, reject) {
                var script = document.createElement('script');
                script.src = url;
                script.onload = function () { return resolve(script); };
                script.onerror = function (error) { return reject(error); };
                document.head.appendChild(script);
            });
        };
        //商业广告
        SdkQunhei.prototype.getAllBusinessData = function (callback) {
            return __awaiter(this, void 0, void 0, function () {
                var data, result;
                return __generator(this, function (_a) {
                    try {
                        data = omit(this.businessRulesInfo, 'timerId');
                        result = { code: 0, data: data };
                        callback.complete(result);
                    }
                    catch (error) {
                        callback.complete(handleTrackError(PLATFORM, '', error));
                    }
                    return [2 /*return*/];
                });
            });
        };
        // 条件获取商业化窗口数据
        SdkQunhei.prototype.getBusinessData = function (params, callback) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function () {
                var checkCache, window_key_1, event_1, _c, before_event, _d, cache_1, cacheKey_1, _e, _f, _g, auto_popups, _h, manual_popups, matchWindows, windows, result, error_4;
                var _this = this;
                return __generator(this, function (_j) {
                    switch (_j.label) {
                        case 0:
                            // 如果登录接口内部调用的商业化接口没有返回结果，将此接口按调用次序缓存起来，接口结果回来后一次返回
                            // cp 主动调用更新商业化接口不管，需要他们自己在接口返回后条件获取商业化窗口数据
                            if (this.businessRuleInvoking) {
                                this.businessWindowsQueue.push(function () { return _this.getBusinessData(params, callback); });
                                return [2 /*return*/];
                            }
                            checkCache = function () {
                                var currentDate = formatDate('YYYY-MM-DD'); //dayjs().format('YYYY-MM-DD')
                                var cacheKeyPrefix = 'rx_business_popup_';
                                var cacheKey = "".concat(cacheKeyPrefix).concat(currentDate);
                                var cache = customGetStorageSync(cacheKey);
                                if (!cache) {
                                    cache = {};
                                    customSetStorageSync(cacheKey, {});
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
                                        customSetStorageSync(cacheKey_1, cache_1);
                                    }
                                    return windowInfo;
                                }
                            }));
                            console.log('result windows: ', windows);
                            result = { code: 0, data: windows };
                            callback.complete(result);
                            return [3 /*break*/, 4];
                        case 3:
                            error_4 = _j.sent();
                            callback.complete(handleTrackError(PLATFORM, '', error_4));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // 更新商业化窗口数据
        SdkQunhei.prototype.refreshBusinessData = function (callback, isRecord) {
            return __awaiter(this, void 0, void 0, function () {
                var res, data, hit_cache, _a, version, _b, refresh_time, _c, main_window_list, _d, window_list, error_5;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
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
                            error_5 = _e.sent();
                            (callback === null || callback === void 0 ? void 0 : callback.complete) && callback.complete(handleTrackError(PLATFORM, '', error_5));
                            return [3 /*break*/, 5];
                        case 4:
                            isRecord && this.dispatchBusinessWindowsQueue();
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        SdkQunhei.prototype.dispatchBusinessWindowsQueue = function () {
            return __awaiter(this, void 0, void 0, function () {
                var execute;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // console.info('sdk 触发商业化窗口队列释放')
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
        SdkQunhei.prototype.requestBusinessOrder = function (params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result, err_8;
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
                            err_8 = _a.sent();
                            callback.complete(handleTrackError(PLATFORM, '', err_8));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        SdkQunhei.prototype.clearPromoterTimer = function () {
            console.log('clearPromoterTimer');
            if (this.promoInfo.timer) {
                clearTimeout(this.promoInfo.timer);
                this.promoInfo.timer = null;
            }
        };
        // 启动定时器
        SdkQunhei.prototype.startPromoterTimer = function (callback, autoRefresh) {
            var _this = this;
            if (autoRefresh === void 0) { autoRefresh = true; }
            var delay = this.promoInfo.refresh_period_exp < 1 ? (this.promoInfo.polling ? (this.promoInfo.polling * 1000) : 10000) : (this.promoInfo.refresh_period_exp * 1000);
            console.log('startPromoterTimer', delay);
            this.promoInfo.timer = setTimeout(function () {
                _this.getPromoDisplayKEY(callback, autoRefresh, false);
            }, delay);
        };
        // 获取福利码
        SdkQunhei.prototype.getPromoDisplayKEY = function (callback, autoRefresh, immediately) {
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
                    callback && callback.complete(handleTrackError(PLATFORM, '', err));
                }
                else {
                    if (autoRefresh) {
                        _this.startPromoterTimer(callback, autoRefresh);
                    }
                    else {
                        callback && callback.complete(handleTrackError(PLATFORM, '', err));
                    }
                }
            });
        };
        // 兑换福利码
        SdkQunhei.prototype.exchangePromoCDKEY = function (cdkey, callback) {
            exchangePromoterCodeApi(cdkey).then(function (res) {
                callback.complete(res);
            }).catch(function (err) {
                callback.complete(handleTrackError(PLATFORM, '', err));
            });
        };
        SdkQunhei.prototype.checkIsPromoter = function () {
            return this.is_promoter;
        };
        return SdkQunhei;
    }(SdkCommon));

    return SdkQunhei;

}));
//# sourceMappingURL=channel-sdk.h5_qunhei.v2.dev.umd.js.map
