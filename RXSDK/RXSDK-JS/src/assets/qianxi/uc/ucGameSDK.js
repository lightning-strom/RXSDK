const version = '2.3'; // 版本号
const test_domain = 'http://yisdk-api.gowanme.com';
const domain = 'https://yisdk-api.gowan8.com';

// //引入加密解密方法
// require('./utility/qx_auth.js')
// var {
//   requestEncrypt,
//   returnDecrypt
// } = window.qx_auth


// //打开调试
// if (window.uc) {
//   uc.setEnableDebug({
//     enableDebug: true,
//     complete: function (data) {
//       console.log('uc.setEnableDebug openDebug. ');
//     },
//   });
// }


var _globalData = {} //全局变量




/**
 * 定义方法
 */
const uuid = () => { //uuid--用户唯一标识码
  const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4()
}

function jsonEncode(target = {}) { //控制台打印对象数据
  return JSON.stringify(target)
}

// 永久缓存(保存，获取，删除)
const saveLocal = function (key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

const getLocal = function (key) {
  let value = window.localStorage.getItem(key)
  return JSON.parse(value)
}

const removeLocal = key => window.localStorage.removeItem(key)

/** 获取uuid */
function getUuid() {
  try {
    var id = getLocal("qx_uuid");
    if (id) {
      return id;
    }
    id = uuid();
    saveLocal('qx_uuid', id);
    return id;
  } catch (e) {
    if (!_globalData.qx_uuid) {
      _globalData.qx_uuid = uuid();
    }
    return _globalData.qx_uuid;
  }
}
var microParame = getUuid(); //生成IMEI值

var extFooter = function () { //参数
  var sysInfo = JSON.parse(uc.getSystemInfoSync())
  var sysScreen = `${sysInfo.screenWidth}x${sysInfo.screenHeight}`

  return {
    screen: sysScreen || '',
    os_version: sysInfo.system || '', // 系统版本号
    simulator: '0', // 是否模拟器，0不是；1是
    isroot: 0, // 是否root/越狱，0不是1是
    serial_number: '', // 设备序列号
    imsi: '', // 手机卡的编号
    android_id: '', // 设备标识 ANDROID_iD
    net: 4, // 手机网络1、2G；2、3G；3、wifi；4、其他
    operators: 4, // 运营商 1、移动；2、联通；3、电信；4、其他
    location: '', // 地址位置
    version, // 必填  融合SDK版本号
    game_version: version, // 必填  游戏版本号
    platform_version: sysInfo.version || '1.0.0', // 必填  渠道版本号
    server_version: '1.2', // 服务端版本号
    imei: microParame.replace(/-/g, ''), // 手机IMEI/IDFA
    mac: microParame.replace(/-/g, ''), // 手机mac网卡地址
    utma: microParame.replace(/-/g, ''), // 设备标识
    os: (sysInfo.platform && sysInfo.platform !== 'android') ? 2 : 1, // 手机系统1、android；2、越狱ios；3、其他；4、正版ios
    model: sysInfo.model || ''
  }
}

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
    fighting: arg.fighting || '' // 战力
  }
}

/* 合并参数 */
var __assign = Object.assign || function __assign(t) {
  var n = arguments.length,
    s;
  for (var i = 1; i < n; i++) {
    s = arguments[i];
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
  }
  return t;
}
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
    method: 'POST',
    data: {},
    success: function (data) {

    },
    error: function (status) {

    },
    dataType: 'json',
    async: true
  }
  var option = __assign(defaults, option);
  option.method = option.method.toUpperCase()
  var formData = []
  for (var key in option.data) {
    formData.push(''.concat(key, '=', option.data[key]))
  }
  option.data = formData.join('&')

  var xhr = new XMLHttpRequest()
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      let data = xhr.responseText
      try {
        if (option.dataType == 'json') {
          data = JSON.parse(data)
        }
        option.success(data)
      } catch (e) {
        console.log(jsonEncode(e), '===>ajax错误信息')
        option.error(xhr.status)
      }
    } else {
      option.error(xhr.status)
    }
  }
  xhr.open(option.method, option.url, option.async)
  if (option.method === 'POST') {
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8')
  } else {
    option.url = option.url + (option.url.indexOf('?') >= 0 ? "&" : "?") + option.data
  }
  xhr.send(option.method === 'POST' ? option.data : null)
}



/**
 * 封装统一后端请求
 * @param {*} ct 后端提供
 * @param {*} ac 后端提供
 * @param {*} params 请求参数
 * @param {*} is_jsdk 1 表示参数名是is_jsdk,0 参数名是js,这个参数名是params里面的
 * 
 */
function requestFn(ct, ac, params = {}, is_jsdk = 1) {
  var domainUrl = ucGameSDK.reqEnv == 'test' ? test_domain : domain
  var url = domainUrl + `/?ct=${ct}&ac=${ac}`
  let KEY = String(new Date().getTime()).substr(0, 10)

  // _obj 是具体发送的参数
  let _obj = {
    ts: KEY
  };

  // 对第二个参数ac做相关处理
  if (is_jsdk == 1) {
    _obj.is_jsdk = 1
    params.is_jsdk = 1
  } else {
    _obj.js = 1
  }
  console.log(JSON.stringify(params), `====>我是${ac}的请求参数params`)
  _obj.p = requestEncrypt(JSON.stringify(params), KEY).e
  return new Promise((resolve, reject) => {
    requestApi({
      url: url,
      data: _obj,
      success: function (res) {
        console.log(`======>我是${ac}的返回值res`, jsonEncode(res))
        // 对返回值进行解密
        if (res.data) {
          let dt = res.data
          try {
            if (dt.d) {
              res.data = JSON.parse(returnDecrypt(dt.d, String(dt.ts)).d)
            }
          } catch (e) {
            console.log(e, '==>requestApi')
            reject(e)
          }
        }
        resolve(res)
      }
    })
  })
}

// 具体的SDK逻辑
let ucGameSDK = {
  /* 请求开始标识*/
  apiStart() {
    this.apiRuning = true;
  },

  /* 请求结束标识*/
  apiEnd() {
    this.apiRuning = false;
  },

  /* 
   * 接口请求状态
   * 返回值 true / false
   */
  isApiRunning() {
    return this.apiRuning;
  },
  initData: {
    channel: 'uc'
  },
  // 执行环境
  reqEnv: 'prod',

  // 初始化
  init: function (initParams = {}, callback) {
    if (this.isApiRunning()) {
      return;
    }
    this.apiStart()
    let _initData = {
      game_id: initParams.game_id,
      channel: this.initData.channel,
      game_name: initParams.game_name,
      from_id: initParams.channel_id, // fuse 默认为 0
      cookie_uuid: microParame
    }
    this.initData = _initData
    this.reqEnv = initParams.req_env || 'prod'
    // 参数对象
    let initReq = {
      ..._initData,
      ...extFooter()
    }
    /** ********** 发送请求*********************/
    requestFn('init', 'index', initReq, 1).then((res) => {
      this.apiEnd()
      if (res.code == 0) {
        _globalData.initRes = res.data
        var cbData = {
          statusCode: 0,
          status: '初始化成功'
        }
        this._active()
        callback && callback(cbData)
      } else {
        if (callback) {
          callback({
            statusCode: 1,
            status: '初始化失败'
          })
        }
      }
    })
  },

  _login: function (data = {}, callback) {
    if (this.isApiRunning()) {
      return;
    }
    this.apiStart()
    var ext_header = {}
    var loginParams = {
      ext: JSON.stringify(ext_header),
      data: JSON.stringify(data),
      ...this.initData,
      ...extFooter(),
    }
    requestFn('user', 'login', loginParams, 1).then((result) => {
      console.log(jsonEncode(result), '==>登录返回值')
      this.apiEnd()
      if (result.code == 0) {
        _globalData.loginRes = result.data // 存储用户信息
        var loginReslut = result.data
        var cpRes = {
          statusCode: 0,
          userId: loginReslut.user_id,
          platformChanleId: 0,
          userName: loginReslut.userName || '',
          timestamp: String(loginReslut.timestamp),
          sign: loginReslut.new_sign,
          guid: loginReslut.guid,
          cp_ext: loginReslut.cp_ext || '',
          ext: loginReslut.ext || '',
        }
        var cbData = {
          statusCode: 0,
          loginParams: cpRes,
          status: '登录成功'
        }

        callback && callback(cbData)
      } else {
        callback && callback({
          statusCode: 1,
          status: '登录失败'
        })
      }
    })
  },

  // 登录
  login: function (params = {}, callback) {
    var _this = this
    uc.login({
      success: function (data) {
        _this._login(data, callback)
      },
      fail: function (data) {
        callback && callback({
          statusCode: 2,
          status: '登录失败'
        })
      }
    })
  },
  /* 激活 */
  _active: function () {
    if (!getLocal('active_qx_uuid') || getLocal('active_qx_uuid') != microParame) {
      // 参数对象
      let acParams = {
        ...extFooter(),
        ...this.initData
      }
      /** ********** 发送激活请求*********************/
      requestFn('loadlog', 'active', acParams, 1).then((resulte) => {
        if (resulte.code == 0) {
          console.log(jsonEncode(resulte), '===>激活成功')
          saveLocal('active_qx_uuid', microParame)
        }
      })
    }
  },

  /* 支付 */
  pay: function (args = {}, callback) {
    if (this.isApiRunning()) {
      return;
    }
    let info = JSON.parse(uc.getSystemInfoSync());
    let ext = {
      sys_info: encodeURIComponent(JSON.stringify(info)),
      platform: info.platform
    }
    //先向服务器下单，再向华为发起支付
    var user_id = _globalData.loginRes.user_id
    var payParams = {
      ext: JSON.stringify(ext),
      user_id,
      ...extFooter(),
      ...getRoleBaseMsg(args),
      ...this.initData,
      product_name: args.productName,
      amount: args.amount, // 必填充值金额 单位：分
      notify_url: args.callbackURL, // 必填 CP通知URL
      callback_info: args.callbackInfo, // cP回调参数
      cp_product_id: args.cpProductId,
      charge_mount: args.chargeMount, // 金钱数量/道具数量
      cp_order_id: args.cpOrderId
    }
    this.apiStart()
    requestFn('pay', 'make_order', payParams, 1).then((res) => {
      this.apiEnd()
      if (res.code == 0) {
        console.log(res, '==>下单成功')
        var _payres = res.data.ext
        uc.requestPayment({
          biz_id: _payres.biz_id, // UC 游戏服分配小游戏内购的 pay_biz_id
          token: _payres.token, // 商户服预下单成功后返回的 token
          order_id: _payres.order_id, // 交易 id ，商户服预下单成功后返回的 order_id
          success: function (pay_res) {
            console.log(jsonEncode(pay_res), '支付成功')
            callback && callback({
              statusCode: 0,
              status: '支付成功'
            })
          },
          fail: function (res) {
            console.log(jsonEncode(res), '支付失败')
            callback && callback({
              statusCode: 1,
              status: '支付失败,请重新支付'
            })
          }
        })
      }
    })
  },

  /** 创建角色上报 */
  createRole(params = {}) {
    console.log('[创建角色接口研发传入的角色信息]',params)
    var type = 'add'
    var user_id = _globalData.loginRes.user_id
    var input = {
      ...this.initData,
      ...extFooter(),
      ...getRoleBaseMsg(params),
      user_id: user_id
    }
    console.log('[创建角色接口研发传给我们后台的角色信息]',input)
    this._rankTop(params)
    return new Promise((resolve, reject) => {
      this._reportRequst(type, input, resolve)
    })
  },

  /* 切换角色上报 */
  changeRole(params = {}) {
    console.log('[切换角色接口研发传入的角色信息]',params)

    var type = 'login'
    var user_id = _globalData.loginRes.user_id
    var input = {
      ...this.initData,
      ...extFooter(),
      ...getRoleBaseMsg(params),
      user_id: user_id
    }
    console.log('[切换角色接口研发传给我们后台的角色信息]',input)

	this._rankTop(params)
    return new Promise((resolve, reject) => {
      this._reportRequst(type, input, resolve)
    })
  },

  /* 角色升级上报 */
  upgradeRole(params = {}) {
    console.log('[升级接口研发传入的角色信息]',params)
    
    var type = 'level'
    var user_id = _globalData.loginRes.user_id
    var input = {
      ...this.initData,
      ...extFooter(),
      user_id: user_id,
      ...getRoleBaseMsg(params)
    }
    this._rankTop(params)
    console.log('[角色升级接口研发传给我们后台的角色信息]',input)

    return new Promise((resolve, reject) => {
      this._reportRequst(type, input, resolve)
    })
  },
  /* 上报请求 */
  _reportRequst(type, input, resolve) {
    requestFn('role', type, input, 1).then(res => {
      console.log('角色' + type + '上报结果--->', jsonEncode(res))
      let reportReslute = {
        statusCode: res.code,
        status: res.msg
      }
      resolve(reportReslute)
    })
  },

  // 冲榜
  _rankTop(roleParams) {
    var loginRes = _globalData.loginRes
    if (loginRes.ext && loginRes.ext.rank_to_channel && loginRes.ext.rank_to_channel == 0) return
    var uploadData = {
      ...this.initData,
      ...extFooter(),
      user_id: loginRes.user_id,
      ...getRoleBaseMsg(roleParams),
      sys_info: encodeURIComponent(uc.getSystemInfoSync()),
    }

    console.log('[uploadData]', uploadData)
    requestFn('role', 'rank_to_channel', uploadData, 1).then(res => {
      console.log('[我发送了冲榜请求]')
    })

  }

}

window.ucGameSDK = ucGameSDK