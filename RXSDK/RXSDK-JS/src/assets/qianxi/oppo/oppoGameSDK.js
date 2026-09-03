(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined"
    ? (module.exports = factory())
    : typeof define === "function" && define.amd
    ? define(factory)
    : // cf. https://github.com/dankogai/js-base64/issues/119
      (function () {
        // existing version for noConflict()
        const _Base64 = global.Base64;
        const gBase64 = factory();
        gBase64.noConflict = () => {
          global.Base64 = _Base64;
          return gBase64;
        };
        if (global.Meteor) {
          // Meteor.js
          Base64 = gBase64;
        }
        global.Base64 = gBase64;
      })();
})(
  typeof self !== "undefined"
    ? self
    : typeof window !== "undefined"
    ? window
    : typeof global !== "undefined"
    ? global
    : this,
  function () {
    "use strict";

    /**
     *  base64.ts
     *
     *  Licensed under the BSD 3-Clause License.
     *    http://opensource.org/licenses/BSD-3-Clause
     *
     *  References:
     *    http://en.wikipedia.org/wiki/Base64
     *
     * @author Dan Kogai (https://github.com/dankogai)
     */
    const version = "3.4.5";
    /**
     * @deprecated use lowercase `version`.
     */
    const VERSION = version;
    const _hasatob = typeof atob === "function";
    const _hasbtoa = typeof btoa === "function";
    const _hasBuffer = typeof Buffer === "function";
    const b64ch =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    const b64chs = [...b64ch];
    const b64tab = ((a) => {
      let tab = {};
      a.forEach((c, i) => (tab[c] = i));
      return tab;
    })(b64chs);
    const b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
    const _fromCC = String.fromCharCode.bind(String);
    const _U8Afrom =
      typeof Uint8Array.from === "function"
        ? Uint8Array.from.bind(Uint8Array)
        : (it, fn = (x) => x) =>
            new Uint8Array(Array.prototype.slice.call(it, 0).map(fn));
    const _mkUriSafe = (src) =>
      src
        .replace(/[+\/]/g, (m0) => (m0 == "+" ? "-" : "_"))
        .replace(/=+$/m, "");
    const _tidyB64 = (s) => s.replace(/[^A-Za-z0-9\+\/]/g, "");
    /**
     * polyfill version of `btoa`
     */
    const btoaPolyfill = (bin) => {
      // console.log('polyfilled');
      let u32,
        c0,
        c1,
        c2,
        asc = "";
      const pad = bin.length % 3;
      for (let i = 0; i < bin.length; ) {
        if (
          (c0 = bin.charCodeAt(i++)) > 255 ||
          (c1 = bin.charCodeAt(i++)) > 255 ||
          (c2 = bin.charCodeAt(i++)) > 255
        )
          throw new TypeError("invalid character found");
        u32 = (c0 << 16) | (c1 << 8) | c2;
        asc +=
          b64chs[(u32 >> 18) & 63] +
          b64chs[(u32 >> 12) & 63] +
          b64chs[(u32 >> 6) & 63] +
          b64chs[u32 & 63];
      }
      return pad ? asc.slice(0, pad - 3) + "===".substring(pad) : asc;
    };
    /**
     * does what `window.btoa` of web browsers do.
     * @param {String} bin binary string
     * @returns {string} Base64-encoded string
     */
    const _btoa = _hasbtoa
      ? (bin) => btoa(bin)
      : _hasBuffer
      ? (bin) => Buffer.from(bin, "binary").toString("base64")
      : btoaPolyfill;
    const _fromUint8Array = _hasBuffer
      ? (u8a) => Buffer.from(u8a).toString("base64")
      : (u8a) => {
          // cf. https://stackoverflow.com/questions/12710001/how-to-convert-uint8-array-to-base64-encoded-string/12713326#12713326
          const maxargs = 0x1000;
          let strs = [];
          for (let i = 0, l = u8a.length; i < l; i += maxargs) {
            strs.push(_fromCC.apply(null, u8a.subarray(i, i + maxargs)));
          }
          return _btoa(strs.join(""));
        };
    /**
     * converts a Uint8Array to a Base64 string.
     * @param {boolean} [urlsafe] URL-and-filename-safe a la RFC4648 §5
     * @returns {string} Base64 string
     */
    const fromUint8Array = (u8a, urlsafe = false) =>
      urlsafe ? _mkUriSafe(_fromUint8Array(u8a)) : _fromUint8Array(u8a);
    /**
     * @deprecated should have been internal use only.
     * @param {string} src UTF-8 string
     * @returns {string} UTF-16 string
     */
    const utob = (src) => unescape(encodeURIComponent(src));
    //
    const _encode = _hasBuffer
      ? (s) => Buffer.from(s, "utf8").toString("base64")
      : (s) => _btoa(utob(s));
    /**
     * converts a UTF-8-encoded string to a Base64 string.
     * @param {boolean} [urlsafe] if `true` make the result URL-safe
     * @returns {string} Base64 string
     */
    const encode = (src, urlsafe = false) =>
      urlsafe ? _mkUriSafe(_encode(src)) : _encode(src);
    /**
     * converts a UTF-8-encoded string to URL-safe Base64 RFC4648 §5.
     * @returns {string} Base64 string
     */
    const encodeURI = (src) => encode(src, true);
    /**
     * @deprecated should have been internal use only.
     * @param {string} src UTF-16 string
     * @returns {string} UTF-8 string
     */
    const btou = (src) => decodeURIComponent(escape(src));
    /**
     * polyfill version of `atob`
     */
    const atobPolyfill = (asc) => {
      // console.log('polyfilled');
      asc = asc.replace(/\s+/g, "");
      if (!b64re.test(asc)) throw new TypeError("malformed base64.");
      asc += "==".slice(2 - (asc.length & 3));
      let u24,
        bin = "",
        r1,
        r2;
      for (let i = 0; i < asc.length; ) {
        u24 =
          (b64tab[asc.charAt(i++)] << 18) |
          (b64tab[asc.charAt(i++)] << 12) |
          ((r1 = b64tab[asc.charAt(i++)]) << 6) |
          (r2 = b64tab[asc.charAt(i++)]);
        bin +=
          r1 === 64
            ? _fromCC((u24 >> 16) & 255)
            : r2 === 64
            ? _fromCC((u24 >> 16) & 255, (u24 >> 8) & 255)
            : _fromCC((u24 >> 16) & 255, (u24 >> 8) & 255, u24 & 255);
      }
      return bin;
    };
    /**
     * does what `window.atob` of web browsers do.
     * @param {String} asc Base64-encoded string
     * @returns {string} binary string
     */
    const _atob = _hasatob
      ? (asc) => atob(_tidyB64(asc))
      : _hasBuffer
      ? (asc) => Buffer.from(asc, "base64").toString("binary")
      : atobPolyfill;
    const _decode = _hasBuffer
      ? (a) => Buffer.from(a, "base64").toString("utf8")
      : (a) => btou(_atob(a));
    const _unURI = (a) =>
      _tidyB64(a.replace(/[-_]/g, (m0) => (m0 == "-" ? "+" : "/")));
    /**
     * converts a Base64 string to a UTF-8 string.
     * @param {String} src Base64 string.  Both normal and URL-safe are supported
     * @returns {string} UTF-8 string
     */
    const decode = (src) => _decode(_unURI(src));
    /**
     * converts a Base64 string to a Uint8Array.
     */
    const toUint8Array = _hasBuffer
      ? (a) => _U8Afrom(Buffer.from(_unURI(a), "base64"))
      : (a) => _U8Afrom(_atob(_unURI(a)), (c) => c.charCodeAt(0));
    const _noEnum = (v) => {
      return {
        value: v,
        enumerable: false,
        writable: true,
        configurable: true,
      };
    };
    /**
     * extend String.prototype with relevant methods
     */
    const extendString = function () {
      const _add = (name, body) =>
        Object.defineProperty(String.prototype, name, _noEnum(body));
      _add("fromBase64", function () {
        return decode(this);
      });
      _add("toBase64", function (urlsafe) {
        return encode(this, urlsafe);
      });
      _add("toBase64URI", function () {
        return encode(this, true);
      });
      _add("toBase64URL", function () {
        return encode(this, true);
      });
      _add("toUint8Array", function () {
        return toUint8Array(this);
      });
    };
    /**
     * extend Uint8Array.prototype with relevant methods
     */
    const extendUint8Array = function () {
      const _add = (name, body) =>
        Object.defineProperty(Uint8Array.prototype, name, _noEnum(body));
      _add("toBase64", function (urlsafe) {
        return fromUint8Array(this, urlsafe);
      });
      _add("toBase64URI", function () {
        return fromUint8Array(this, true);
      });
      _add("toBase64URL", function () {
        return fromUint8Array(this, true);
      });
    };
    /**
     * extend Builtin prototypes with relevant methods
     */
    const extendBuiltins = () => {
      extendString();
      extendUint8Array();
    };
    const gBase64 = {
      version: version,
      VERSION: VERSION,
      atob: _atob,
      atobPolyfill: atobPolyfill,
      btoa: _btoa,
      btoaPolyfill: btoaPolyfill,
      fromBase64: decode,
      toBase64: encode,
      encode: encode,
      encodeURI: encodeURI,
      encodeURL: encodeURI,
      utob: utob,
      btou: btou,
      decode: decode,
      fromUint8Array: fromUint8Array,
      toUint8Array: toUint8Array,
      extendString: extendString,
      extendUint8Array: extendUint8Array,
      extendBuiltins: extendBuiltins,
    };

    //
    // export Base64 to the namespace
    //
    // ES5 is yet to have Object.assign() that may make transpilers unhappy.
    // gBase64.Base64 = Object.assign({}, gBase64);
    gBase64.Base64 = {};
    Object.keys(gBase64).forEach((k) => (gBase64.Base64[k] = gBase64[k]));
    return gBase64;
  }
);

var Base64 = window.Base64;
let requestKey = "";
let returnKey = "";

function _base64Encode(data) {
  let str = Base64.encode(data);
  return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function _base64Decode(data) {
  return Base64.decode(data.replace(/-/g, "+").replace(/_/g, "/"));
}

function requestEncrypt(data, key = "") {
  requestKey = key;
  if (!/^[0-9a-zA-Z]{1,}$/.test(requestKey)) return;
  let base_e_str = _base64Encode(data);
  let t = base_e_str + requestKey;
  let len = t.length;
  let per = Math.floor(len / 6);

  if (per < 2) {
    return {
      base64_encode: base_e_str,
      e: t,
    };
  }
  let per_0 = per - 1;
  let i = 0;
  let t_len = len;
  let arr_per = [];
  let arr_per_0 = [];
  let arr_last = [];
  let t_start = 0;

  while (true) {
    if (i % 2 === 0) {
      if (t_len / per_0 > 1) {
        arr_per_0.push(t.substr(t_start, per_0));
      } else {
        arr_last.push(t.substr(t_start));
        break;
      }
      t_start += per_0;
      t_len = t_len - per_0;
    } else {
      if (t_len / per > 1) {
        arr_per.push(t.substr(t_start, per));
      } else {
        arr_last.push(t.substr(t_start));
        break;
      }
      t_start += per;
      t_len = t_len - per;
    }
    i++;
  }
  return {
    base64_encode: base_e_str,
    e: arr_last.join("") + arr_per.join("") + arr_per_0.join(""),
  };
}

function requestDecrypt(data, key = "") {
  requestKey = key;
  if (!/^[0-9a-zA-Z]{1,}$/.test(requestKey)) return;
  let t = decodeURI(data);
  let len = t.length;
  let per = Math.floor(len / 6);
  let per_0 = per - 1;
  let i = 0;
  let t_len = len;
  let arr_per_0_num = [];
  let arr_per_num = [];
  let len_key;
  let base64_estr;
  if (per < 2) {
    len_key = requestKey.length;
    base64_estr = t.substr(0, len - len_key);
    return {
      base64_encode: base64_estr,
      d: _base64Decode(base64_estr),
    };
  }
  while (true) {
    if (i % 2 === 0) {
      if (t_len / per_0 > 1) {
        arr_per_0_num.push(per_0);
      } else {
        break;
      }
      t_len = t_len - per_0;
    } else {
      if (t_len / per > 1) {
        arr_per_num.push(per);
      } else {
        break;
      }
      t_len = t_len - per;
    }
    i++;
  }

  let arr_per_0 = [];
  let arr_per = [];
  let t_start = 0;

  let t_count = arr_per_0_num.length;

  arr_per_0_num.forEach((v, i) => {
    t_start -= per_0;
    arr_per_0[t_count - 1 - i] = t.substr(t_start, per_0);
  });

  t_count = arr_per_num.length;
  arr_per_num.forEach((v, i) => {
    t_start -= per;
    arr_per[t_count - 1 - i] = t.substr(t_start, per);
  });

  let last_str = t.substr(0, len + t_start);

  i = 0;
  let max = Math.max(arr_per_0.length, arr_per.length);
  let str = "";
  for (i = 0; i < max; i++) {
    if (arr_per_0[i]) {
      str += arr_per_0[i];
    }

    if (arr_per[i]) {
      str += arr_per[i];
    }
  }

  str += last_str;
  len_key = requestKey.length;
  str = str.substr(0, len - len_key);
  return {
    base64_encode: str,
    d: _base64Decode(str),
  };
}

function returnDecrypt(data, key = "") {
  returnKey = key;
  if (!/^[0-9a-zA-Z]{1,}$/.test(returnKey)) return;
  let t = data;
  let len = t.length;
  let per = Math.floor(len / 4);
  let len_key;
  let base64_estr;
  if (per < 2) {
    len_key = returnKey.length;
    base64_estr = t.substr(0, len - len_key);
    return {
      base64_encode: base64_estr,
      d: _base64Decode(base64_estr),
    };
  }

  let i = 0;
  let t_len = len;
  let arr_per_num = [];
  while (true) {
    if (t_len / per > 1) {
      arr_per_num.push(per);
    } else {
      break;
    }
    t_len = t_len - per;
    i++;
  }
  let arr_per = [];
  let t_start = 0;
  let t_count = arr_per_num.length;

  arr_per_num.forEach((v, i) => {
    t_start -= per;
    arr_per[t_count - 1 - i] = t.substr(t_start, per);
  });

  let last_str = t.substr(0, len + t_start);
  i = 0;
  let max = arr_per.length;
  let str = "";
  for (i = 0; i < max; i++) {
    if (arr_per[i]) {
      str += arr_per[i];
    }
  }
  str += last_str;

  len_key = returnKey.length;
  str = str.substr(0, len - len_key);

  return {
    base64_encode: str,
    d: _base64Decode(str),
  };
}

const domain = "https://yisdk-api.gowan8.com";
const test_domain = "http://yisdk-api.gowanme.com";

const _globalData = {}; //全局变量

/**
 * 定义方法
 */
const uuid = () => {
  //uuid--用户唯一标识码
  const S4 = () =>
    (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
};

function jsonEncode(target = {}) {
  //控制台打印对象数据
  return JSON.stringify(target);
}

// 永久缓存(保存，获取，删除)
const saveLocal = function (key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
};
const getLocal = function (key) {
  let value = window.localStorage.getItem(key);
  return JSON.parse(value);
};
const removeLocal = (key) => window.localStorage.removeItem(key);

/** 获取uuid */
function getUuid() {
  try {
    var id = getLocal("uuid");
    if (id) {
      return id;
    }
    id = uuid();
    saveLocal("uuid", id);
    return id;
  } catch (e) {
    if (!_globalData.uuid) {
      _globalData.uuid = uuid();
    }
    return _globalData.uuid;
  }
}

var version = "2.3", // 版本号
  microParame = getUuid(); //生成IMEI值

var extFooter = function () {
  //参数
  var sysInfo = qg.getSystemInfoSync();
  return {
    screen: `${sysInfo.screenWidth}x${sysInfo.screenHeight}`,
    os_version: sysInfo.system, // 系统版本号
    simulator: "0", // 是否模拟器，0不是；1是
    isroot: 0, // 是否root/越狱，0不是1是
    serial_number: "", // 设备序列号
    imsi: "", // 手机卡的编号
    android_id: "", // 设备标识 ANDROID_iD
    net: 4, // 手机网络1、2G；2、3G；3、wifi；4、其他
    operators: 4, // 运营商 1、移动；2、联通；3、电信；4、其他
    location: "", // 地址位置
    version, // 必填	融合SDK版本号
    game_version: version, // 必填	游戏版本号
    platform_version: sysInfo.platformVersion, //	必填	渠道版本号
    server_version: "1.2", // 服务端版本号
    imei: microParame.replace(/-/g, ""), // 手机IMEI/IDFA
    mac: microParame.replace(/-/g, ""), // 手机mac网卡地址
    utma: microParame.replace(/-/g, ""), // 设备标识
    os: 1, // 手机系统1、android；2、越狱ios；3、其他；4、正版ios
    model: sysInfo.model,
  };
};
/* 合并参数 */
var __assign =
  Object.assign ||
  function __assign(t) {
    var n = arguments.length,
      s;
    for (var i = 1; i < n; i++) {
      s = arguments[i];
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
/* 格式化角色信息 */
function getRoleBaseMsg(arg) {
  return {
    server_id: arg.serverId,
    server_name: arg.serverName,
    role_id: arg.roleId,
    role_name: arg.roleName,
    role_level: arg.roleLevel,
    balance: arg.userMoney || 0,
    vip_level: arg.vipLevel,
  };
}

/**定义方法结束 */
/**
 * 定义变量
 * 包含设备，用户信息，角色信息等
 */

// 角色信息
var roleBaseConfig = {
  server_id: "1", // 必填	服务器ID
  server_name: "1", // 必填	服务器名称
  role_id: "1000", // 必填	角色id
  role_name: "1", // 必填	角色名称
  role_level: "1", // 必填	角色等级
  balance: "1", // 必填	游戏币余额
};

var roleBaseMsg = {
  ...roleBaseConfig,
  balance: "1", // 必填	游戏币余额
  vip_level: "1", // 必填	VIP等级
  guild_name: "", // 公会名称
  guild_id: "", // 公会id
  fighting: "", // 战力
};

var userBaseMsg = {
  user_id: "", // 必填	用户id
};

/**定义变量结束 */

/**
 * 封装ajax请求
 * @param {} option字段
 * url
 * data
 * method
 * success
 * error
 */
var requestApi = function (option = {}) {
  var defaults = {
    method: "POST",
    data: {},
    success: function (data) {},
    error: function (status) {},
    dataType: "json",
    async: true,
  };
  var option = __assign(defaults, option);
  option.method = option.method.toUpperCase();
  var formData = [];
  for (var key in option.data) {
    formData.push("".concat(key, "=", option.data[key]));
  }
  option.data = formData.join("&");

  var xhr = new XMLHttpRequest();
  xhr.open(option.method, option.url, option.async);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      let data = xhr.responseText;
      try {
        if (option.dataType == "json") {
          data = JSON.parse(data);
        }
        option.success(data);
      } catch (e) {
        // console.log(data,'data错误信息')
        console.log(e, "===>ajax错误信息");
        option.error(xhr.status);
      }
    } else {
      option.error(xhr.status);
    }
  };
  if (option.method === "POST") {
    xhr.setRequestHeader(
      "Content-Type",
      "application/x-www-form-urlencoded;charset=utf-8"
    );
  } else {
    option.url =
      option.url + (option.url.indexOf("?") >= 0 ? "&" : "?") + option.data;
  }
  xhr.send(option.method === "POST" ? option.data : null);
};

/**
 * 封装统一后端请求
 * @param {*} ct 后端提供
 * @param {*} ac 后端提供
 * @param {*} params 请求参数
 * @param {*} is_jsdk 1 表示参数名是is_jsdk,0 参数名是js,这个参数名是params里面的
 *
 */
function requestFn(ct, ac, params = {}, is_jsdk = 1) {
  var domainUrl = oppoGameSDK.reqEnv == "test" ? test_domain : domain;
  let KEY = String(new Date().getTime()).substr(0, 10);
  var url;
  // _obj 是具体发送的参数
  let _obj = {
    ts: KEY,
  };
  // 对第二个参数ac做相关处理
  if (!ac) {
    url = domainUrl + `/${ct}`;
    _obj = params;
  } else {
    url = domainUrl + `/?ct=${ct}&ac=${ac}`;
    if (is_jsdk == 1) {
      _obj.is_jsdk = 1;
      params.is_jsdk = 1;
    } else {
      _obj.js = 1;
    }
    console.log(JSON.stringify(params), `====>我是${ac}的请求参数params`);
    _obj.p = requestEncrypt(JSON.stringify(params), KEY).e;
  }
  console.log(url, "==>请求地址");
  return new Promise((resolve, reject) => {
    requestApi({
      url: url,
      data: _obj,
      method: "POST",
      success(res) {
        console.log(`======>我是${ac}的返回值res`, jsonEncode(res));
        // 对返回值进行解密
        if (res.data) {
          let dt = res.data;
          try {
            if (dt.d) {
              res.data = JSON.parse(returnDecrypt(dt.d, String(dt.ts)).d);
            }
          } catch (e) {
            console.log(e, "==>requestApiE");
          }
        }
        resolve(res);
      },
    });
  });
}

// 具体的SDK逻辑
var oppoGameSDK = {
  initData: {
    channel: "oppo",
  },
  //防止重复请求
  isRequest: 0,
  //环境标示变量
  reqEnv: "prod",

  // 初始化
  init: function (initParams = {}, callback) {
    if (this.isRequest == 0) {
      this.isRequest = 1;
      let _initData = {
        game_id: initParams.game_id,
        channel: this.initData.channel,
        game_name: initParams.game_name,
        from_id: initParams.channel_id, // fuse 默认为 0
        cookie_uuid: microParame,
      };
      this.initData = _initData;
      this.reqEnv = initParams.req_env || "prod";
      // 参数对象
      let initReq = {
        ..._initData,
        ...extFooter(),
      };
      /** ********** 发送请求*********************/
      requestFn("init", "index", initReq, 1).then((res) => {
        this.isRequest = 0;
        if (res.code == 0) {
          _globalData.initRes = res.data;
          var cbData = {
            statusCode: 0,
            status: "初始化成功",
          };
          this._active();
          callback && callback(cbData);
        } else {
          if (callback) {
            callback({
              statusCode: 1,
              status: "初始化失败",
            });
          }
        }
      });
    } else {
      console.log("请不要重复点击请求");
    }
  },

  _login: function (data = {}, callback) {
    if (this.isRequest == 0) {
      this.isRequest = 1;
      var ext_header = {};
      var loginParams = {
        ext: JSON.stringify(ext_header),
        data: JSON.stringify(data.data),
        ...this.initData,
        ...extFooter(),
      };
      requestFn("user", "login", loginParams, 1).then((result) => {
        console.log(jsonEncode(result), "==>登录返回值");
        this.isRequest = 0;
        if (result.code == 0) {
          _globalData.qxLoginRes = result.data; // 存储用户信息
          var qxLoginReslut = result.data;
          var cpRes = {
            statusCode: 0,
            userId: qxLoginReslut.user_id,
            platformChanleId: 0,
            userName: qxLoginReslut.userName || "",
            timestamp: String(qxLoginReslut.timestamp),
            sign: qxLoginReslut.new_sign,
            guid: qxLoginReslut.guid, // TODO
            cp_ext: qxLoginReslut.cp_ext || "",
            ext: qxLoginReslut.ext || "",
          };
          var cbData = {
            statusCode: 0,
            loginParams: cpRes,
            status: "登录成功",
          };
          console.log("登录成功");
          callback && callback(cbData);
        } else {
          callback &&
            callback({
              statusCode: 1,
              status: "登录失败",
            });
        }
      });
    } else {
      console.log("请不要重复点击请求");
    }
  },

  // 登录
  login: function (params = {}, callback) {
    var _this = this;
    qg.login({
      success: function (data) {
        _globalData.oppoLoginRes = data.data;
        _this._login(data, callback);
      },
      fail: function (data, code) {
        callback &&
          callback({
            statusCode: 2,
            status: "渠道登录失败",
          });
        console.log("失败");
      },
    });
  },

  /* 激活 */
  _active: function () {
    // 参数对象
    let acParams = {
      ...extFooter(),
      ...this.initData,
    };
    /** ********** 发送激活请求*********************/
    requestFn("loadlog", "active", acParams, 1).then((resulte) => {
      if (resulte.code == 0) {
        console.log(jsonEncode(resulte), "===>激活成功");
      }
    });
  },

  payReqNum: 0, // 下单次数计数器
  /* 支付 */
  pay: function (args = {}, callback) {
    var _this = this;
    if (_this.isRequest == 0) {
      //先向服务器下单，再向平台发起支付
      var user_id = _globalData.qxLoginRes.user_id;
      var ext = {
        token: _globalData.oppoLoginRes.token,
        engineVersion: qg.getSystemInfoSync().platformVersion,
      };
      var payParams = {
        ext: JSON.stringify(ext),
        user_id,
        ...extFooter(),
        ...getRoleBaseMsg(args),
        ..._this.initData,
        product_name: args.productName,
        amount: args.amount, // 必填充值金额 单位：分
        notify_url: args.callbackURL, // 必填 CP通知URL
        callback_info: args.callbackInfo, // cP回调参数
        cp_product_id: args.cpProductId,
        charge_mount: args.chargeMount, // 金钱数量/道具数量
        cp_order_id: args.cpOrderId,
      };
      _this.isRequest = 1;
      console.log("payParams====>", jsonEncode(payParams));
      requestFn("pay", "make_order", payParams, 1).then((res) => {
        _this.isRequest = 0;
        // 登录过期异常处理--100表示登录过期
        if (res.code == 100) {
          _this.payReqNum++;
          if (_this.payReqNum < 5) {
            qg.login({
              success: function (data) {
                _globalData.oppoLoginRes = data.data;
                _this.pay(args, callback);
              },
              fail: function () {
                callback &&
                  callback({
                    statusCode: 2,
                    status: "下单失败，用户登录已过期",
                  });
              },
            });
          } else {
            _this.payReqNum = 0;
            callback &&
              callback({
                statusCode: 2,
                status: "下单失败，用户登录已过期",
              });
            console.log("已重复下单5次，服务异常");
          }
          return;
        }
        if (res.code == 0) {
          var payExt = res.data.ext;
          qg.pay({
            appId: payExt.appId,
            token: payExt.token,
            timestamp: payExt.timestamp,
            orderNo: payExt.orderNo,
            paySign: payExt.paySign,
            success: function (res) {
              callback &&
                callback({
                  statusCode: 0,
                  status: "支付成功",
                });
            },
            fail: function (res) {
              callback &&
                callback({
                  statusCode: 1,
                  status: "支付失败,请重新支付",
                });
            },
          });
        }
      });
    } else {
      console.log("请不要重复点击请求");
    }
  },

  /** 创建角色上报 */
  createRole(params = {}) {
    var type = "add";
    var user_id = _globalData.qxLoginRes.user_id;
    var input = {
      ...this.initData,
      ...userBaseMsg,
      ...roleBaseMsg,
      ...extFooter(),
      ...getRoleBaseMsg(params),
      user_id: user_id,
    };
    return new Promise((resolve, reject) => {
      this._reportRequst(type, input, resolve);
    });
  },

  /* 切换角色上报 */
  changeRole(params = {}) {
    var type = "login";
    var user_id = _globalData.qxLoginRes.user_id;
    var input = {
      ...this.initData,
      ...userBaseMsg,
      ...roleBaseMsg,
      ...extFooter(),
      ...getRoleBaseMsg(params),
      user_id: user_id,
    };
    return new Promise((resolve, reject) => {
      this._reportRequst(type, input, resolve);
    });
  },

  /* 角色升级上报 */
  upgradeRole(params = {}) {
    var type = "level";
    var user_id = _globalData.qxLoginRes.user_id;
    var input = {
      ...this.initData,
      ...userBaseMsg,
      ...roleBaseMsg,
      ...extFooter(),
      user_id: user_id,
      ...getRoleBaseMsg(params),
    };
    return new Promise((resolve, reject) => {
      this._reportRequst(type, input, resolve);
    });
  },

  /* 上报请求 */
  _reportRequst(type, input, resolve) {
    if (this.isRequest == 0) {
      this.isRequest = 1;
      requestFn("role", type, input, 1).then((res) => {
        this.isRequest = 0;
        console.log("角色" + type + "上报结果--->", jsonEncode(res));
        let reportReslute = {
          statusCode: res.code,
          status: res.msg,
        };
        resolve(reportReslute);
      });
    } else {
      console.log("请不要重复点击请求");
    }
  },

  // 创建桌面图标
  installShortcut(callback) {
    qg.hasShortcutInstalled({
      success: function (res) {
        // 判断图标未存在时，创建图标
        if (res == false) {
          qg.installShortcut({
            success: function () {
              // 执行用户创建图标奖励
              callback &&
                callback({
                  statusCode: 0,
                  status: "创建桌面图标成功",
                });
            },
            fail: function (err) {
              callback &&
                callback({
                  statusCode: 1,
                  status: "创建桌面图标失败",
                });
            },
            complete: function () {},
          });
        }
        if (res == true) {
          callback &&
            callback({
              statusCode: 2,
              status: "已创建桌面图标",
            });
        }
      },
      fail: function (err) {},
      complete: function () {},
    });
  },

  // 检测是否创建桌面图标
  isInstallShortcut(callback) {
    qg.hasShortcutInstalled({
      success: function (res) {
        // 判断图标未存在
        if (res == false) {
          callback &&
            callback({
              statusCode: 0,
              status: "未创建桌面图标",
            });
        }
        if (res == true) {
          callback &&
            callback({
              statusCode: 1,
              status: "已创建桌面图标",
            });
        }
      },
      fail: function (err) {
        callback &&
          callback({
            statusCode: 2,
            status: "检测异常",
          });
      },
      complete: function () {},
    });
  },
};

window.oppoGameSDK = oppoGameSDK;
