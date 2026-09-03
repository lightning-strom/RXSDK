// var channelSdk = require("./aaa_channel-sdk.douyin.v2.dev.umd.js");
var sdk;

const CallJsRX = {
    _logEnabled: false,

  // unity 回调
  _callBackToUnity: function (funcName, data)
  {
    var ret = {};
    ret = { "func": funcName, "data": data };
    var retStr = JSON.stringify(ret);
    globalUnityInstance.SendMessage('RuiXueSdk', 'OnJsCallBack', retStr);
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
    console.log("above channelSdk");

    // globalUnityInstance.TestJsRX.test();

    console.log("channelSdk instance", globalUnityInstance.douyin_channel);
    // const {channelSdk} = globalUnityInstance
    
    const channelSdk = globalUnityInstance.douyin_channel;


    console.warn("channelSdk", channelSdk);
    
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
        force: json_obj.force,
        method: json_obj.method
      },
      {
        //data里面包含了code和data
        complete: (data) => {
          console.log("this.jsrx_login complete data = " + data);

          //拉取参数里是否包含分享参数
          // let launch_params = wx.getLaunchOptionsSync();
          // let is_has = launch_params.query.hasOwnProperty("transmits");
          // if (is_has) {
          //   let transmits = decodeURIComponent(launch_params.query["transmits"]);
          //   console.log("launch transmits = " + transmits);
          //   data["transmits"] = transmits;
          // }

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
    var new_json_obj = {};

    for (let key in json_obj) {
        if(json_obj[key] !== null)
            new_json_obj[key] = json_obj[key]
    }
    sdk.share(
       new_json_obj,
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
    sdk.reportLocationUpdate(
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
    this.jsrx_log("CallJsRX.jsrx_friends", json_str);
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
    this.jsrx_log("CallJsRX.jsrx_getAllBusinessData", json_str);
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
    this.jsrx_log("CallJsRX.jsrx_refreshBusinessData", json_str);
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
      json_obj,
      {
        complete: (data) => {
          this._callBackToUnity("rx_track", data);
        }
      }
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

    // interstitialAd
    jsrx_openCustomerServiceConversation: function (json_str) {
        this.jsrx_log("CallJsRX.jsrx_openCustomerServiceConversation", json_str);
        var json_obj = JSON.parse(json_str);
        sdk.openCustomService(
            {type: 3},
            {
                complete: (data) => {
                    this._callBackToUnity("rx_openCustomerServiceConversation", data);
                }
            }
        );
    },
}
globalUnityInstance.CallJsRX = CallJsRX; 