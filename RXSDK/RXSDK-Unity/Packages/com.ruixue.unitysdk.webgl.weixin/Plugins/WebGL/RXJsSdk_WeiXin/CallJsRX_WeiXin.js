
var channelSdk = require("./channelSDK/index.js");
import { SDK } from './channelSDK/tencent-sdk.js'

// 是否打开调试模式, 建议仅在调试期间开启
SDK.setDebug(true)

wx.TencentSDK = SDK

var sdk;
export const CallJsRX = {
    _logEnabled: false,
    _gdtMenuEventListenersRegistered: false,

  // unity 回调
  _callBackToUnity: function (funcName, data)
  {
    var ret = {};
    ret = { "func": funcName, "data": data };
    var retStr = JSON.stringify(ret);
    GameGlobal.Module.SendMessage('RuiXueSdk', 'OnJsCallBack', retStr);
  },
  
  // 设置日志是否开启
  jsrx_setLogEnable: function (enable){
    console.log("jsrx_setLogEnable =" + enable);    
    this._logEnabled = enable;
  },

  // 输出日志
  jsrx_log: function(tag, log_str) {
    if(this._logEnabled) {
        if(log_str)   
            console.log(tag + ":" + log_str);
        else
            console.log(tag);
    }
 },

  // 初始化
  jsrx_init: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_init",json_str);
    var json_obj = JSON.parse(json_str);
    sdk = new channelSdk({
      productId: json_obj.productId,  //产品 id
      channelId: json_obj.channelId,  //渠道id
      cpid: json_obj.cpid,  //CP id
      baseUrlList: json_obj.baseUrlList,//请求域名队列
      gameImplType: "unity",
      complete: (data) => {
        this._callBackToUnity("rx_init", data);
      },
    });
  },

  // 注册收藏和右上角分享的 GDT 上报监听，由 CP 在初始化成功后显式调用
  jsrx_registerGdtMenuEventListeners: function () {
    if (!sdk || this._gdtMenuEventListenersRegistered) {
      return;
    }

    wx.onAddToFavorites(() => {
      sdk.reportAddToFavorites('default')
    })

    wx.onShareAppMessage(() => {
      sdk.reportShareAppMessage('APP_MESSAGE')
    })

    wx.onShareTimeline(() => {
      sdk.reportShareAppMessage('TIME_LINE')
    })

    this._gdtMenuEventListenersRegistered = true;
  },
  
  // 设置subChannelId
  jsrx_setSubChannelId: function (id){
    this.jsrx_log("CallJsRX.jsrx_setSubChannelId",id);
    sdk.setSubChannelId(id);
  },

  // 登录
  jsrx_login: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_login",json_str);
    var json_obj = JSON.parse(json_str);
    sdk.login(
      {
        version: json_obj.version,
        method: json_obj.method,
        sign_fields: json_obj.sign_fields,
        login_openid: json_obj.login_openid
      },
      {
        //data里面包含了code和data
        complete: (data) => {
          
          //拉取参数里是否包含分享参数
          let launch_params = wx.getLaunchOptionsSync();
          let is_has = launch_params.query.hasOwnProperty("transmits");
          if (is_has) {
            let transmits = decodeURIComponent(launch_params.query["transmits"]);
            console.log("launch transmits = " + transmits);
            data["transmits"] = transmits;
          }

          this._callBackToUnity("rx_login", data);
        },
      }
    );
  },
  
  // 同步账号信息
  jsrx_infoSync:function () {
    this.jsrx_log("CallJsRX.jsrx_infoSync");
    sdk.infoSync(
        {
          complete: (data) => {
            this._callBackToUnity("rx_infoSync", data);
          },
        },
        {
          info: {
            desc: "",
          },
        }
    );
  },
  
  // userInfoSilentSync
  jsrx_userInfoSilentSync:function (){
    this.jsrx_log("CallJsRX.jsrx_userInfoSilentSync");
    sdk.userInfoSilentSync(
        {
          complete: (data) => {
            this._callBackToUnity("rx_userInfoSilentSync", data);
          },
        }
    );
  },
  
  // 申请注销账号
  jsrx_deregister:function (json_str){
    this.jsrx_log("CallJsRX.jsrx_deregister",json_str);
    var json_obj = JSON.parse(json_str);
    sdk.deregister(
      {
        idcard: json_obj.idcard,
        realname: json_obj.realname,
        cpdata: json_obj.cpdata,
      },
      {
        complete: (data) => {
          this._callBackToUnity("rx_deregister", data);
        },
      }
    );
  },
  
  // 撤销申请注销账号
  jsrx_deregisterCancel:function (){
    this.jsrx_log("CallJsRX.jsrx_deregisterCancel");
    sdk.deregisterCancel(
        {
          complete: (data) => {
            this._callBackToUnity("rx_deregisterCancel", data);
          }
        }
    );
  },
  
  // 获取验证码
  jsrx_sendCaptcha:function (json_str){
    this.jsrx_log("CallJsRX.jsrx_sendCaptcha", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.sendCaptcha(
      {
        email: json_obj.email,
        phone: json_obj.phone,
        purpose: json_obj.purpose,
      },
      {
        complete: (data) => {
          this._callBackToUnity("rx_sendCaptcha", data);
        }
      }
    );
  },
  
  // 绑定邮箱
  jsrx_bindEmail:function (json_str){
    this.jsrx_log("CallJsRX.jsrx_bindEmail", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.bindEmail(
      {
        email: json_obj.email,
        captcha_code: json_obj.captcha_code,
        captchaCode: json_obj.captcha_code,
        password: json_obj.password,
      },
      {
        complete: (data) => {
          this._callBackToUnity("rx_bindEmail", data);
        }
      }
    );
  },
  
  // 解绑邮箱
  jsrx_unbindEmail:function (json_str){
    this.jsrx_log("CallJsRX.jsrx_unbindEmail", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.UnbindEmail(
      {
        email: json_obj.email,
        captcha_code: json_obj.captcha_code,
        captchaCode: json_obj.captcha_code,
      },
      {
        complete: (data) => {
          this._callBackToUnity("rx_unbindEmail", data);
        }
      }
    );
  },
  
  // 绑定手机
  jsrx_bindPhone:function (json_str){
    this.jsrx_log("CallJsRX.jsrx_bindPhone", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.bindPhone(
      {
        phone: json_obj.phone,
        captcha_code: json_obj.captcha_code,
        captchaCode: json_obj.captcha_code,
        password: json_obj.password,
      }, 
        {
          complete: (data) => {
            this._callBackToUnity("rx_bindPhone", data);
          }
        }
    );
  },
  
  // 解绑手机
  jsrx_unbindPhone:function (json_str){
    this.jsrx_log("CallJsRX.jsrx_unbindPhone", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.unBindPhone(
      {
        phone: json_obj.phone,
        captcha_code: json_obj.captcha_code,
        captchaCode: json_obj.captcha_code,
      },
      {
        complete: (data) => {
          this._callBackToUnity("rx_unbindPhone", data);
        }
      }
    );
  },
  
  // 获取用户信息
  jsrx_getUserInfo:function (){
    this.jsrx_log("CallJsRX.jsrx_getUserInfo");
    sdk.getInfo(
      {
        complete: (data) => {
          this._callBackToUnity("rx_getUserInfo", data);
        }
      }
    ); 
  },
  
  // 修改用户信息
  jsrx_updateUserInfo:function (json_str){
    this.jsrx_log("CallJsRX.jsrx_updateUserInfo", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.updateInfo(
      {
        nickname: json_obj.nickname,
        avatarurl: json_obj.avatarurl,
        region: json_obj.region,
        sex: json_obj.sex,
      },
      {
        complete: (data) => {
          this._callBackToUnity("rx_updateUserInfo", data);
        }
      }
    );
  },

  // 支付
  jsrx_pay:function (json_str){
    this.jsrx_log("CallJsRX.jsrx_pay", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.pay(
        json_obj,
        {
          complete: (data) => {
            this._callBackToUnity("rx_pay", data);
          }
        }
    );
  },

  //分享
  jsrx_share: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_share", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.share(
      json_obj,
      {
        complete: (data) => {
          this._callBackToUnity("rx_share", data);
        },
      }
    );
  },
  
  // 分享调度初始化
  jsrx_shareSchedulingInit: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_shareSchedulingInit", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.shareSchedulingInit(
        json_obj,
        {
          complete: (data) => {
            this._callBackToUnity("rx_shareSchedulingInit", data);
          },
        }
    );
  },
  
  // 获取埋点调度
  jsrx_getShareScheduling: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_getShareScheduling", json_str);
    var json_obj = JSON.parse(json_str);
    var ret = sdk.getShareScheduling(json_obj);
    this.jsrx_log("jsrx_getShareScheduling complete data", ret);
    if(ret.hasOwnProperty("data"))
      return ret.data;
    else
      return "";
  },
  
  // 分享/广告结果上报
  jsrx_shareSchedulingReport: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_shareSchedulingReport", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.shareSchedulingReport(
      json_obj,
      {
        complete: (data) => {
          this._callBackToUnity("rx_shareSchedulingReport", data);
        },
      }
    );
  },
  
  // 获取分享信息
  jsrx_getShareData:function(json_str)
  {
    this.jsrx_log("CallJsRX.jsrx_getShareData", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.getShareData(
        {
          func: json_obj.func,
          transmits: json_obj.transmits,
          region: json_obj.region,
          readCache: json_obj.readCache,
        },
        {
          complete: (data) => {
            this._callBackToUnity("rx_getShareData", data);
          },
        }
    );
  },
  
  // 获取附近的人
  jsrx_getNearlyPersonByRadius: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_getNearlyPersonByRadius", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.getNearlyPeasonByRadius(
      json_obj,
      {
        complete: (data) => {
          this._callBackToUnity("rx_getNearlyPersonByRadius", data);
        },
      }
    );
  },
  
  // 设置用户自定义信息
  jsrx_userSetCustom: function (str) {
    this.jsrx_log("CallJsRX.jsrx_userSetCustom", str);
    sdk.setcustom(
        str,
      {
        complete: (data) => {
          this._callBackToUnity("rx_userSetCustom", data);
        },
      }
    );
  },
  
  // authorizeLocation 授权定位
  jsrx_authorizeLocation: function () {
    this.jsrx_log("CallJsRX.jsrx_authorizeLocation");
    sdk.authorizeLocation(
      {
        complete: (data) => {
          this._callBackToUnity("rx_authorizeLocation", data);
        },
      }
    );
  },
  
  // startReportLocation 开启上报
  jsrx_startReportLocation: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_startReportLocation", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.startReportLoaction(
      json_obj,
      {
        complete: (data) => {
          this._callBackToUnity("rx_startReportLocation", data);
        },
      }
    );
  },
  
  // stopReportLocation 关闭上报
  jsrx_stopReportLocation: function () {
    this.jsrx_log("CallJsRX.jsrx_stopReportLocation");
      sdk.stopReportLocation();
  },
  
  // 上报位置
  jsrx_reportLocationUpdate: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_reportLocationUpdate", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.reportLocationHttpFun(
      json_obj,
      {
        complete: (data) => {
          this._callBackToUnity("rx_reportLocationUpdate", data);
        },
      }
    );
  },
  
  // 删除位置信息
  jsrx_deleteReportLocation: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_reportLocationUpdate", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.deleteReportLocation(
      json_obj,
      {
        complete: (data) => {
          this._callBackToUnity("rx_deleteReportLocation", data);
        },
      }
    );
  },
  
  // 添加自定义关系
  jsrx_addRelation: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_addRelation", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.addRelation(
      json_obj,
      {
        complete: (data) => {
          this._callBackToUnity("rx_addRelation", data);
        },
      }
    );
  },
  
  // 删除关系
  jsrx_deleteRelation: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_deleteRelation", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.deleteRelation(
      json_obj,
      {
        complete: (data) => {
          this._callBackToUnity("rx_deleteRelation", data);
        },
      }
    );
  },
  
  // 更新备注
  jsrx_updateRemarks: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_updateRemarks", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.updateremarks(
      json_obj,
      {
        complete: (data) => {
          this._callBackToUnity("rx_updateRemarks", data);
        }
      }
    );
  },
  
  // relation list
  jsrx_relationList: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_relationList", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.relationList(
      json_obj,
      {
        complete: (data) => {
          this._callBackToUnity("rx_relationList", data);
        }
      }
    );
  },
  
  // 判断关系
  jsrx_hasRelation: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_hasRelation", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.hasRelation(
      json_obj,
      {
        complete: (data) => {
          this._callBackToUnity("rx_hasRelation", data);
        }
      }
    );
  },
  
  // 添加好友
  jsrx_addFriend: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_addFriend", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.addFriend(
      json_obj,
      {
        complete: (data) => {
          this._callBackToUnity("rx_addFriend", data);
        }
      }
    );
  },
  
  // 删除好友
  jsrx_deleteFriend: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_deleteFriend", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.delfriend(
      json_obj,
      {
        complete: (data) => {
          this._callBackToUnity("rx_deleteFriend", data);
        }
      }
    );
  },
  
  // 更新好友备注
  jsrx_updateFriendRemarks: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_updateFriendRemarks", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.updatefriendremarks(
      json_obj,
      {
        complete: (data) => {
          this._callBackToUnity("rx_updateFriendRemarks", data);
        }
      }
    );
  },
  
  // 判断是否是好友
  jsrx_isFriend: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_isFriend", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.isfriend(
      json_obj,
      {
        complete: (data) => {
          this._callBackToUnity("rx_isFriend", data);
        }
      }
    );
  },
  
  // 好友列表
  jsrx_friends: function () {
    this.jsrx_log("CallJsRX.jsrx_friends");
    sdk.friends(
      {
        complete: (data) => {
          this._callBackToUnity("rx_friends", data);
        }
      }
    );
  },
  
  // addScore
  jsrx_addScore: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_addScore", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.addscore(
      json_obj,
      {
        complete: (data) => {
          this._callBackToUnity("rx_addScore", data);
        }
      }
    );
  },
  
  // setScore
  jsrx_setScore: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_setScore", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.setscore(
      json_obj,
      {
        complete: (data) => {
          this._callBackToUnity("rx_setScore", data);
        }
      }
    );
  },
  
  // queryUserRank
  jsrx_queryUserRank: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_queryUserRank", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.queryuserrank(
      json_obj,
      {
        complete: (data) => {
          this._callBackToUnity("rx_queryUserRank", data);
        }
      }
    );
  },
  
  // getRanklist
  jsrx_getRankList: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_getRankList", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.getranklist(
      json_obj,
      {
        complete: (data) => {
          this._callBackToUnity("rx_getRankList", data);
        }
      }
    );
  },
  
  // friendsRank
  jsrx_friendsRank: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_friendsRank", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.friendsrank(
      json_obj,
      {
        complete: (data) => {
          this._callBackToUnity("rx_friendsRank", data);
        }
      }
    );
  },
  
  // getBusinessData
  jsrx_getBusinessData: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_getBusinessData", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.getBusinessData(
      json_obj,
      {
        complete: (data) => {
          this._callBackToUnity("rx_getBusinessData", data);
        }
      }
    );
  },
  
  // getAllBusinessData
  jsrx_getAllBusinessData: function () {
    this.jsrx_log("CallJsRX.jsrx_getAllBusinessData");
    sdk.getAllBusinessData(
      {
        complete: (data) => {
          this._callBackToUnity("rx_getAllBusinessData", data);
        }
      }
    );
  },
  
  // refreshBusinessData
  jsrx_refreshBusinessData: function () {
    this.jsrx_log("CallJsRX.jsrx_refreshBusinessData");
    sdk.refreshBusinessData();
  },
  
  // requestBusinessOrder
  jsrx_requestBusinessOrder: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_requestBusinessOrder", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.requestBusinessOrder(
      json_obj,
      {
        complete: (data) => {
          this._callBackToUnity("rx_requestBusinessOrder", data);
        }
      }
    );
  },
  
  // track
  jsrx_track: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_track", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.track(
      {
        complete: (data) => {
          this._callBackToUnity("rx_track", data);
        }
      },
      json_obj
    );
  },
  
  // setPublicProperties
  jsrx_setPublicProperties: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_setPublicProperties", json_str);
    var json_obj = JSON.parse(json_str);
    var result = sdk.setPublicProperties(
        json_obj
    );
    this.jsrx_log("setPublicProperties 结果返回：",result.code);
  },
  
  // updatePublicProperties
  jsrx_updatePublicProperties: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_updatePublicProperties", json_str);
    var json_obj = JSON.parse(json_str);
    var result = sdk.updatePublicProperties(
        json_obj
    );
    this.jsrx_log("updatePublicProperties 结果返回：" ,result.code);
  },
  
  // deletePublicProperties
  jsrx_deletePublicProperties: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_deletePublicProperties", json_str);
    var json_obj = JSON.parse(json_str);
    var result = sdk.deletePublicProperties(
        json_obj
    );
    this.jsrx_log("deletePublicProperties 结果返回：",result.code);
  },
  
  // createFeedback
  jsrx_createFeedback: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_createFeedback", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.createFeedback(
      json_obj,
      {
        complete: (data) => {
          this._callBackToUnity("rx_createFeedback", data);
        }
      }
    );
  },
  
  // getFeedbackKindList
  jsrx_getFeedbackKindList: function () {
    this.jsrx_log("CallJsRX.jsrx_getFeedbackKindList");
    sdk.getFeedbackKindList(
      {
        complete: (data) => {
          this._callBackToUnity("rx_getFeedbackKindList", data);
        }
      }
    );
  },
  
  // satisfactionEvaluation
  jsrx_satisfactionEvaluation: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_satisfactionEvaluation", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.satisfactionEvaluation(
      json_obj,
      {
        complete: (data) => {
          this._callBackToUnity("rx_satisfactionEvaluation", data);
        }
      }
    );
  },
  
  // checkAppVersion
  jsrx_checkAppVersion: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_checkAppVersion", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.checkAppVersion(
      json_obj,
      {
        complete: (data) => {
          this._callBackToUnity("rx_checkAppVersion", data);
        }
      }
    );
  },
  
  // checkVersion
  jsrx_checkVersion: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_checkVersion", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.checkVersion(
      json_obj,
      {
        complete: (data) => {
          this._callBackToUnity("rx_checkVersion", data);
        }
      }
    );
  },
  
  // checkGameVersion
  jsrx_checkGameVersion: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_checkGameVersion", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.checkGameVersion(
      json_obj,
      {
        complete: (data) => {
          this._callBackToUnity("rx_checkGameVersion", data);
        }
      }
    );
  },

  // updateGameVersion v2
  jsrx_updateGameVersion: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_updateGameVersion", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.updateGameVersion(
      json_obj,
      {
        complete: (data) => {
          this._callBackToUnity("rx_updateGameVersion", data);
        }
      }
    );
  },
  
  // checkActivityVersion
  jsrx_checkActivityVersion: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_checkActivityVersion", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.checkActivityVersion(
      json_obj,
      {
        complete: (data) => {
          this._callBackToUnity("rx_checkActivityVersion", data);
        }
      }
    );
  },
  
  // rewardedVideoAd
  jsrx_rewardedVideoAd: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_rewardedVideoAd", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.rewardedVideoAd(
      json_obj,
      {
        complete: (data) => {
          this._callBackToUnity("rx_rewardedVideoAd", data);
        }
      }
    );
  },
  
  // bannerAd
  jsrx_bannerAd: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_bannerAd", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.bannerAd(
      json_obj,
      {
        complete: (data) => {
          this._callBackToUnity("rx_bannerAd", data);
        }
      }
    );
  },
  
  // interstitialAd
  jsrx_interstitialAd: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_interstitialAd", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.interstitialAd(
      json_obj,
      {
        complete: (data) => {
          this._callBackToUnity("rx_interstitialAd", data);
        }
      }
    );
  },

  // 获取用户互动型托管数据对应的key的数据
  jsrx_getUserInteractiveStorage: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_getUserInteractiveStorage", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.getUserInteractiveStorage(
        json_obj,
        {
          complete: (data) => {
            this._callBackToUnity("rx_getUserInteractiveStorage", data);
          }
        }
    );
  },
  
  // 获取游戏圈数据
  jsrx_getGameClubData: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_getGameClubData", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.getGameClubData(
        json_obj,
        {
          complete: (data) => {
            this._callBackToUnity("rx_getGameClubData", data);
          }
        }
    );
  },

  // 对用户托管数据进行写数据操作
  jsrx_setUserCloudStorage: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_setUserCloudStorage", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.setUserCloudStorage(
        json_obj,
        {
          complete: (data) => {
            this._callBackToUnity("rx_setUserCloudStorage", data);
          }
        }
    );
  },

  // 获取当前用户托管数据当中对应 key 的数据
  jsrx_getUserCloudStorage: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_getUserCloudStorage", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.getUserCloudStorage(
        json_obj,
        {
          complete: (data) => {
            this._callBackToUnity("rx_getUserCloudStorage", data);
          }
        }
    );
  },

  // 删除用户托管数据当中对应 key 的数据
  jsrx_removeUserCloudStorage: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_removeUserCloudStorage", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.removeUserCloudStorage(
        json_obj,
        {
          complete: (data) => {
            this._callBackToUnity("rx_removeUserCloudStorage", data);
          }
        }
    );
  },

  // 获取当前用户托管数据当中所有的 key
  jsrx_getUserCloudStorageKeys: function () {
    this.jsrx_log("CallJsRX.jsrx_getUserCloudStorageKeys");
    sdk.getUserCloudStorageKeys(
        {
          complete: (data) => {
            this._callBackToUnity("rx_getUserCloudStorageKeys", data);
          }
        }
    );
  },

  // 拉取当前用户所有同玩好友的托管数据
  jsrx_getFriendCloudStorage: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_getFriendCloudStorage", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.getFriendCloudStorage(
        json_obj,
        {
          complete: (data) => {
            this._callBackToUnity("rx_getFriendCloudStorage", data);
          }
        }
    );
  },

  // 获取可能对游戏感兴趣的未注册的好友名单
  jsrx_getPotentialFriendList: function () {
    this.jsrx_log("CallJsRX.jsrx_getPotentialFriendList");
    sdk.getPotentialFriendList(
        {
          complete: (data) => {
            this._callBackToUnity("rx_getPotentialFriendList", data);
          }
        }
    );
  },

  // 获取同玩游戏好友列表
  jsrx_getRelationFriendList: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_getRelationFriendList", json_str);
    var json_obj = JSON.parse(json_str);
    sdk.getRelationFriendList(
        json_obj,
        {
          complete: (data) => {
            this._callBackToUnity("rx_getRelationFriendList", data);
          }
        }
    );
  },
   
  // 客服
  jsrx_openCustomerServiceConversation: function (json_str) {
    this.jsrx_log("CallJsRX.jsrx_openCustomerServiceConversation", json_str);
      var json_obj = JSON.parse(json_str);
      sdk._openCustomerServiceConversation(
          {
            complete: (data) => {
                console.log('----_openCustomerServiceConversation------')
                console.log(data)
                this._callBackToUnity("rx_openCustomerServiceConversation", data);
            }
          },
          json_obj
      );
  },
    
  // 文本内容安全识别
  jsrx_msgSecCheck: function (json_str) {
      this.jsrx_log("CallJsRX.jsrx_msgSecCheck",json_str);
      var json_obj = JSON.parse(json_str);
      sdk.msgSecCheck(
          json_obj,
          {
              complete: (data) => {
                  this._callBackToUnity("rx_msgSecCheck", data);
              }
          }
      );
  },
    
  // 异步校验图片
  jsrx_mediaCheckAsync: function (json_str) {
      this.jsrx_log("CallJsRX.jsrx_mediaCheckAsync",json_str);
      var json_obj = JSON.parse(json_str);
      sdk.mediaCheckAsync(
          json_obj,
          {
              complete: (data) => {
                  this._callBackToUnity("rx_mediaCheckAsync", data);
              }
          }
      );
  },

  // 补单
  jsrx_compensatePayOrder:function (json_str){
      this.jsrx_log("CallJsRX.jsrx_compensatePayOrder",json_str);
      var json_obj = JSON.parse(json_str);
      sdk.compensatePayOrder(
          json_obj,
          {
              complete: (data) => {
                  this._callBackToUnity("rx_compensatePayOrder", data);
              }
          }
      );
  },

  // 查询是否需要补单
  jsrx_checkHasCompensatePayOrder:function (){
      this.jsrx_log("CallJsRX.jsrx_checkHasCompensatePayOrder");
      const compensateOrderInfo = sdk.checkHasCompensatePayOrder();
      this._callBackToUnity("rx_checkHasCompensatePayOrder", compensateOrderInfo);
  },

  // 设备码
  jsrx_getUserDeviceCode:function (){
      this.jsrx_log("CallJsRX.jsrx_getUserDeviceCode");
      const compensateOrderInfo = sdk.getUserDeviceCode();
      this._callBackToUnity("rx_getUserDeviceCode", compensateOrderInfo);
  },

    // 校验解绑验证码
    jsrx_validateUnbindCode:function (json_str){
        this.jsrx_log("CallJsRX.jsrx_validateUnbindCode",json_str);
        var json_obj = JSON.parse(json_str);
        sdk.validateUnbindCode(
            json_obj,
            {
                complete: (data) => {
                    this._callBackToUnity("rx_validateUnbindCode", data);
                }
            }
        );
    },

    // 换绑手机号
    jsrx_changePhone:function (json_str){
        this.jsrx_log("CallJsRX.jsrx_changePhone",json_str);
        var json_obj = JSON.parse(json_str);
        sdk.changePhone(
            json_obj,
            {
                complete: (data) => {
                    this._callBackToUnity("rx_changePhone", data);
                }
            }
        );
    },

    // 绑定手机号（ios）
    jsrx_getPhoneNumber:function (json_str){
        this.jsrx_log("CallJsRX.jsrx_getPhoneNumber",json_str);
        var json_obj = JSON.parse(json_str);
        sdk.getPhoneNumber(
            json_obj,
            {
                complete: (data) => {
                    this._callBackToUnity("rx_getPhoneNumber", data);
                }
            }
        );
    },

    // 换绑手机号（ios）
    jsrx_changePhoneNumber:function (json_str){
        this.jsrx_log("CallJsRX.jsrx_changePhoneNumber",json_str);
        var json_obj = JSON.parse(json_str);
        sdk.changePhoneNumber(
            json_obj,
            {
                complete: (data) => {
                    this._callBackToUnity("rx_changePhoneNumber", data);
                }
            }
        );
    },

    // 调度分享（分享、广告）
    jsrx_schedulingAction:function (json_str){
        this.jsrx_log("CallJsRX.jsrx_schedulingAction",json_str);
        var json_obj = JSON.parse(json_str);
        sdk.schedulingAction(
            json_obj,
            {
                complete: (data) => {
                    this._callBackToUnity("rx_schedulingAction", data);
                }
            }
        );
    },

    // 打开分享图片弹窗
    jsrx_showShareImageMenu:function (json_str){
        this.jsrx_log("CallJsRX.jsrx_showShareImageMenu",json_str);
        var json_obj = JSON.parse(json_str);
        sdk.showShareImageMenu(
            json_obj,
            {
                complete: (data) => {
                    this._callBackToUnity("rx_showShareImageMenu", data);
                }
            }
        );
    },

    // 给指定的好友分享
    jsrx_shareMessageToFriend:function (json_str){
        this.jsrx_log("CallJsRX.jsrx_shareMessageToFriend",json_str);
        var json_obj = JSON.parse(json_str);
        sdk.shareMessageToFriend(
            json_obj,
            {
                complete: (data) => {
                    this._callBackToUnity("rx_shareMessageToFriend", data);
                }
            }
        );
    },

    // 获取指定好友分享query
    jsrx_fetchMessageToFriendQuery:function (json_str){
        this.jsrx_log("CallJsRX.jsrx_fetchMessageToFriendQuery",json_str);
        var json_obj = JSON.parse(json_str);
        sdk.fetchMessageToFriendQuery(
            json_obj,
            {
                complete: (data) => {
                    this._callBackToUnity("rx_fetchMessageToFriendQuery", data);
                }
            }
        );
    },

    // 创建 activity_id
    jsrx_createActivityId:function (json_str){
        this.jsrx_log("CallJsRX.jsrx_createActivityId",json_str);
        var json_obj = JSON.parse(json_str);
        sdk.createActivityId(
            json_obj,
            {
                complete: (data) => {
                    this._callBackToUnity("rx_createActivityId", data);
                }
            }
        );
    },

    // 分享动态消息
    jsrx_dynamicShare:function (json_str){
        this.jsrx_log("CallJsRX.jsrx_dynamicShare",json_str);
        var json_obj = JSON.parse(json_str);
        sdk.dynamicShare(
            json_obj,
            {
                complete: (data) => {
                    this._callBackToUnity("rx_dynamicShare", data);
                }
            }
        );
    },

    // 被分享人获取 activity_id
    jsrx_getDynamicShareActivityId:function (){
        const activity_id = sdk.getDynamicShareActivityId()
        this._callBackToUnity("rx_getDynamicShareActivityId", {"code": 0, data: activity_id});
    },

    // 修改被分享动态消息
    jsrx_setDynamicShareMsg:function (json_str){
        this.jsrx_log("CallJsRX.jsrx_setDynamicShareMsg",json_str);
        var json_obj = JSON.parse(json_str);
        sdk.setDynamicShareMsg(
            json_obj,
            {
                complete: (data) => {
                    this._callBackToUnity("rx_setDynamicShareMsg", data);
                }
            }
        );
    },

    // 订阅消息
    jsrx_requestSubscribeMessage:function (json_str){
        this.jsrx_log("CallJsRX.jsrx_requestSubscribeMessage",json_str);
        var json_obj = JSON.parse(json_str);
        sdk.requestSubscribeMessage(
            json_obj,
            {
                complete: (data) => {
                    this._callBackToUnity("rx_requestSubscribeMessage", data);
                }
            }
        );
    },

    // 获取公告列表
    jsrx_getAnnouncement:function (limit){
        this.jsrx_log("CallJsRX.jsrx_getAnnouncement", limit);
        sdk.getAnnouncement(
            limit,
            {
                complete: (data) => {
                    this._callBackToUnity("rx_getAnnouncement", data);
                }
            }
        );
    },

    // 原生模板广告
    jsrx_createCustomAd:function (json_str){
        this.jsrx_log("CallJsRX.jsrx_createCustomAd", json_str);
        var json_obj = JSON.parse(json_str);
        sdk.createCustomAd(
            json_obj,
            {
                complete: (data) => {
                    this._callBackToUnity("rx_createCustomAd", data);
                }
            }
        );
    },

    // 获取邮件列表
    jsrx_getEmailList:function (json_str){
        this.jsrx_log("CallJsRX.jsrx_getEmailList", json_str);
        var json_obj = JSON.parse(json_str);
        sdk.getEmailList(
            json_obj,
            {
                complete: (data) => {
                    this._callBackToUnity("rx_getEmailList", data);
                }
            }
        );
    },

    // 获取邮件详情
    jsrx_getEmailDetail:function (json_str){
        this.jsrx_log("CallJsRX.jsrx_getEmailDetail", json_str);
        var json_obj = JSON.parse(json_str);
        sdk.getEmailDetail(
            json_obj,
            {
                complete: (data) => {
                    this._callBackToUnity("rx_getEmailDetail", data);
                }
            }
        );
    },

    // 邮件领取
    jsrx_receiveEmail:function (json_str){
        this.jsrx_log("CallJsRX.jsrx_receiveEmail", json_str);
        var json_obj = JSON.parse(json_str);
        sdk.receiveEmail(
            json_obj,
            {
                complete: (data) => {
                    this._callBackToUnity("rx_receiveEmail", data);
                }
            }
        );
    },

    // 邮件删除
    jsrx_delEmail:function (json_str){
        this.jsrx_log("CallJsRX.jsrx_delEmail", json_str);
        var json_obj = JSON.parse(json_str);
        sdk.delEmail(
            json_obj,
            {
                complete: (data) => {
                    this._callBackToUnity("rx_delEmail", data);
                }
            }
        );
    },

    // 创建玩家反馈
    jsrx_addFeedback:function (json_str){
        this.jsrx_log("CallJsRX.jsrx_addFeedback", json_str);
        var json_obj = JSON.parse(json_str);
        sdk.addFeedback(
            json_obj,
            {
                complete: (data) => {
                    this._callBackToUnity("rx_addFeedback", data);
                }
            }
        );
    },

    // 玩家反馈列表
    jsrx_getFeedbackList:function (json_str){
        this.jsrx_log("CallJsRX.jsrx_getFeedbackList", json_str);
        var json_obj = JSON.parse(json_str);
        sdk.getFeedbackList(
            json_obj,
            {
                complete: (data) => {
                    this._callBackToUnity("rx_getFeedbackList", data);
                }
            }
        );
    },

    // 玩家反馈详情
    jsrx_getFeedbackDetail:function (json_str){
        this.jsrx_log("CallJsRX.jsrx_getFeedbackDetail", json_str);
        var json_obj = JSON.parse(json_str);
        sdk.getFeedbackDetail(
            json_obj,
            {
                complete: (data) => {
                    this._callBackToUnity("rx_getFeedbackDetail", data);
                }
            }
        );
    },

    // 领取道具
    jsrx_collectProps:function (json_str){
        this.jsrx_log("CallJsRX.jsrx_collectProps", json_str);
        var json_obj = JSON.parse(json_str);
        sdk.collectProps(
            json_obj,
            {
                complete: (data) => {
                    this._callBackToUnity("rx_collectProps", data);
                }
            }
        );
    },

    // 获取福利码
    jsrx_getPromoDisplayKEY:function (){
        sdk.getPromoDisplayKEY(
            {
                complete: (data) => {
                    this._callBackToUnity("rx_getPromoDisplayKEY", data);
                }
            }
        );
    },

    // 兑换福利码
    jsrx_exchangePromoCDKEY:function (cdkey){
        this.jsrx_log("CallJsRX.jsrx_exchangePromoCDKEY", cdkey);
        sdk.exchangePromoCDKEY(
            cdkey,
            {
                complete: (data) => {
                    this._callBackToUnity("rx_exchangePromoCDKEY", data);
                }
            }
        );
    },

    // 上报创角
    jsrx_reportCreateRole:function (roleid){
        this.jsrx_log("CallJsRX.jsrx_reportCreateRole", roleid);
        sdk.reportCreateRole(roleid);
    },

    // 支付由 JSSDK 4.0.2 自动查询缓存订单并补报，禁止手动重复上报
    jsrx_reportPurchase:function (){
        console.warn("jsrx_reportPurchase 已停用：JSSDK 4.0.2 会自动补报支付");
    },

    // 上报等级提升
    jsrx_reportUpdateLevel:function (json_str){
        this.jsrx_log("CallJsRX.jsrx_reportUpdateLevel", json_str);
        sdk.reportUpdateLevel(JSON.parse(json_str));
    },

    // 上报完成指引
    jsrx_reportTutorialFinish:function (){
        this.jsrx_log("CallJsRX.jsrx_reportTutorialFinish");
        sdk.reportTutorialFinish();
    },

    // 上报浏览
    jsrx_reportViewContent:function (item){
        this.jsrx_log("CallJsRX.jsrx_reportViewContent", item);
        sdk.reportViewContent(item);
    },

    // 广点通通用事件上报
    jsrx_reportGdt:function (action_type, action_param_json){
        this.jsrx_log("CallJsRX.jsrx_reportGdt", action_type + " " + action_param_json);
        sdk.reportGdt(action_type, JSON.parse(action_param_json));
    },

    // 设置区服角色
    jsrx_setGameInfo: function (role_id, region_tag){
        this.jsrx_log("CallJsRX.jsrx_setGameInfo", role_id + ' ' + region_tag);
        sdk.setGameInfo(role_id, region_tag);
    },

    // 查询区服角色
    jsrx_searchGameAccount: function (){
        this.jsrx_log("CallJsRX.jsrx_searchGameAccount");
        sdk.searchGameAccount({
            complete: (data) => {
                this._callBackToUnity("rx_searchGameAccount", data);
            }
        });
    },

    // 获取直玩广告组件展示状态
    jsrx_getDirectAdStatusSync: function (){
        this.jsrx_log("CallJsRX.jsrx_getDirectAdStatusSync");
        return JSON.stringify(sdk.getDirectAdStatusSync() || {});
    },

    // 监听直玩广告状态变化
    jsrx_onDirectAdStatusChange: function (){
        this.jsrx_log("CallJsRX.jsrx_onDirectAdStatusChange");
        sdk.onDirectAdStatusChange((data) => {
            this._callBackToUnity("rx_onDirectAdStatusChange", data);
        });
    },
}
GameGlobal.CallJsRX = CallJsRX;