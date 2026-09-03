
// 捕鱼的线上版本 2021-3-29 定版
console.info('this version is dev for kele add alipay test')
var cbDispatcher = null;
var KLH5SDK = {};
(function (KLH5SDK) {
  KLH5SDK.STATUS = {
    SUCCEED: 0,
    FAILED: 1,
    UNCERTAIN: 2
  };

  var _repetitionClick = true;
  var _callbacks = {};
  var _callbackId = 0;

  function _genCallbackId() {
    _callbackId++;
    return _callbackId.toString();
  }

  function _postMsgToAppClient(url) {
    var iFrame;
    iFrame = document.createElement('iframe');
    iFrame.setAttribute('tag', 'KLH5');
    iFrame.setAttribute('src', url);
    iFrame.setAttribute('style', 'display:none;');
    iFrame.setAttribute('height', '0px');
    iFrame.setAttribute('width', '0px');
    iFrame.setAttribute('frameborder', '0');
    document.body.appendChild(iFrame);
    iFrame.parentNode.removeChild(iFrame);
    iFrame = null;
    var iframes = document.querySelectorAll('iframe');
    for (var i = 0; i < iframes.length; i++) if (iframes[i].getAttribute('tag') == 'kLH5') {
      iframes[i].parentNode.removeChild(iframes[i]);
      iframes[i] = null;
    }
  }

  function _postCommandToHost() {
    if (arguments.length < 1) throw '_postCommandToHost: invalid arguments.';
    var params = {};
    params.cmd = arguments[0];
    if (arguments.length == 2) {
      var o = arguments[1];
      if (o) if (typeof o == 'function') {
        params.cbDispatcher = cbDispatcher.callFuncName;
        params.callbackId = _genCallbackId();
        _callbacks[params.callbackId] = o;
      } else {
        params.args = o;
      }
    } else if (arguments.length == 3) {
      var args = arguments[1];
      if (args) params.args = args;
      var callback = arguments[2];
      if (callback) {
        params.cbDispatcher = cbDispatcher.callFuncName;
        params.callbackId = _genCallbackId();
        _callbacks[params.callbackId] = callback;
      }
    }
    var msg = 'keleh5pay://?' + encodeURI(JSON.stringify(params));
    console.log(msg);
    _postMsgToAppClient(msg);
  }

  cbDispatcher = function () {
    if (arguments.length >= 1) {
      var _data = arguments[0];

      console.log('_callbackId' + _data.callbackId);
      console.log('_diamond' + _data.diamond);

      console.log('-------sdk-----');
      console.log(_data);
      var callbackId = _data.callbackId;
      if (callbackId) {
        var callback = _callbacks[callbackId];
        if (callback) {
          var sendData = {code: 0, msg: 'success', data: _data};
          callback(sendData);
          delete _callbacks[callbackId];
        } else {
          console.log('cbDispatcher: can not find callback function specified by callbackId ' + callbackId);
        }
      } else {
        console.log('cbDispatcher: callbackId is null or undefined or empty.');
      }
    } else {
      throw 'cbDispatcher: invalid arguments.';
    }
  };

  cbDispatcher.callFuncName = 'cbDispatcher';

  KLH5SDK.getConfig = function(callback) {
    console.info('kele接收到瑞雪',JSON.stringify(callback))
    _postCommandToHost("getConfig",callback)
  }
  /**
   * H5游戏拉起商城界面
   */
  KLH5SDK.payInDiamond = function (args, callback) {
    if (!args) throw 'payInDiamond: args must be specified.';
    if (!args.hasOwnProperty('appKey')) throw 'payInDiamond: appKey must be specified in args.';
    if (callback && typeof callback != 'function') throw 'payInDiamond: callback must be a function.';
    _postCommandToHost('payInDiamond', args, callback);
  };

  /**
   * H5游戏人民币兑换元宝-2018-12-21新增
   * @param args
   * @param callback
   */
  KLH5SDK.payInYb = function (args, callback) {
    if (!args) throw 'payInYb: args must be specified.';
    if (callback && typeof callback != 'function') throw 'payInYb: callback must be a function.';

    // 判断重复点击
    if (!_repetitionClick) {
      return;
    } else {
      _repetitionClick = false;
    }

    var valueStr = [];
    var keyStr = [];
    for (var i in args) {
      valueStr.push(args[i]);
      keyStr.push(i);
    }

    var temp = {};
    temp.v = valueStr.join('@');
    temp.k = keyStr.join('@');
    console.info('args转换后',temp)
    console.info('callback',callback)
    // 以前传奇loading
    // if (args.feeType == 1) {
    //   // 钻石兑换元宝
    //   loading(2000);
    // }

    // 展开loading
    loading(3000);

    _postCommandToHost('payInYb', temp, callback);

    // 托底
    setTimeout(() => {
      _repetitionClick = true;
    }, 5000)
  };

  /**
   * 在传奇中提示未安装微信
   */
  KLH5SDK.alertNotInstalledWechat = function (msg) {

    console.log('alertNotInstalledWechat');
    console.log(msg);

    if (msg && msg.outTradeNo) {
      // 弹出微信的提示框
      setTimeout(function () {
        alertWechatPaying(msg.outTradeNo, msg.orientation);
      }, 2000);
    } else {
      // 提示未安装微信
      openTip('请您先安装微信客户端！', msg.orientation);
    }
  };

  /**
   * rmb 兑换yb 成功失败的状态
   * @param outTradeNo
   */
  KLH5SDK.alertWechatResult = function (msg) {

    console.log('alertWechatResult');
    console.log(msg);
    var tip = msg.wx == 'success' ? '支付完成' : '未支付完成';
    openTip(tip, msg.orientation);
  };

  /**
   * H5游戏返回app大厅
   */
  KLH5SDK.closeWebView = function () {
    _postCommandToHost('closeWebView');
  };

  window.addEventListener('message',
    function (event) {
      console.log('yukeaddEventListener');

      var data = JSON.parse(event.data);
      cbDispatcher(data);
    },
    false);

  /**
   * 弹出微信正在支付中的框
   */
  function alertWechatPaying() {
    var outTradeNo = arguments[0];
    var orientation = arguments[1];
    openSuccess(outTradeNo, orientation);
  }

  /**
   * 发送app 参数订单号
   */
  function noticeApp() {
    var outTradeNo = arguments[0];
    console.log('noticeApp=' + outTradeNo);
    _postCommandToHost('payYbResult', {outTradeNo: outTradeNo});
  }

  /**
   * loading
   * @param time
   */
  function loading(time) {
    var oH = document.getElementsByTagName('head')[0];
    var oS = document.createElement('style');
    oS.innerHTML = '#loadingDiv{\n' +
      '    position: absolute;\n' +
      '    top: 0;left: 0;width:100%;height:100%;\n' +
      '    background-color: rgba(0, 0, 0, .3);\n' +
      '}@keyframes changeOpacity {\n' +
      '    from { opacity: 1; }\n' +
      '    to { opacity: .2; }\n' +
      '}\n' +
      '@-moz-keyframes changeOpacity {\n' +
      '    from { opacity: 1; }\n' +
      '    to { opacity: .2;}\n' +
      '}\n' +
      '@-webkit-keyframes changeOpacity {\n' +
      '    from { opacity: 1; }\n' +
      '    to { opacity: .2;}\n' +
      '}\n' +
      '@-o-keyframes changeOpacity {\n' +
      '    from { opacity: 1; }\n' +
      '    to { opacity: .2;}\n' +
      '}' +
      '.q-loading-content {\n' +
      '    position: absolute;\n' +
      '    left: 50%;\n' +
      '    top: 50%;\n' +
      '    transform: translate(-50%, -50%);\n' +
      '    width: 64px;\n' +
      '    height: 64px;\n' +
      '    z-index: 2;\n' +
      '}\n' +
      '.dot {\n' +
      '    width: 10px;\n' +
      '    height: 10px;\n' +
      '    position: absolute;\n' +
      '    background-color: #409EFF;\n' +
      '    border-radius: 50% 50%;\n' +
      '    opacity: 0.5;\n' +
      '    animation: changeOpacity 1.04s ease infinite;\n' +
      '}\n' +
      '.dot1 {\n' +
      '    left: 0;\n' +
      '    top: 50%;\n' +
      '    margin-top: -5PX;\n' +
      '    animation-delay: 0.13s;\n' +
      '}\n' +
      '.dot2 {\n' +
      '    left: 9.37px;\n' +
      '    top: 9.37px;\n' +
      '    animation-delay: 0.26s;\n' +
      '}\n' +
      '.dot3 {\n' +
      '    left: 50%;\n' +
      '    top: 0;\n' +
      '    margin-left: -5PX;\n' +
      '    animation-delay: 0.39s;\n' +
      '}\n' +
      '.dot4 {\n' +
      '    top: 9.37px;\n' +
      '    right: 9.37px;\n' +
      '    animation-delay: 0.52s;\n' +
      '}\n' +
      '.dot5 {\n' +
      '    right: 0;\n' +
      '    top: 50%;\n' +
      '    margin-top: -5PX;\n' +
      '    animation-delay: 0.65s;\n' +
      '}\n' +
      '.dot6 {\n' +
      '    right: 9.37px;\n' +
      '    bottom: 9.37px;\n' +
      '    animation-delay: 0.78s;\n' +
      '}\n' +
      '\n' +
      '\n' +
      '.dot7 {\n' +
      '    bottom: 0;\n' +
      '    left: 50%;\n' +
      '    margin-left: -5PX;\n' +
      '    animation-delay: 0.91s;\n' +
      '}\n' +
      '\n' +
      '.dot8 {\n' +
      '    bottom: 9.37px;\n' +
      '    left: 9.37px;\n' +
      '    animation-delay: 1.04s;\n' +
      '}';
    oH.appendChild(oS);
    var aDiv = '';
    for (var i = 1; i < 9; i++) {
      aDiv += '<div class="dot dot' + i + '"></div>';
    }
    var contentDiv = '<div class="q-loading-content">' + aDiv + '</div>';

    var loadingId = document.getElementById('loadingDiv');
    if (!loadingId) {
      var loadingDiv = document.createElement('div');
      loadingDiv.setAttribute('id', 'loadingDiv');
      loadingDiv.innerHTML = contentDiv;
      document.getElementsByTagName('body')[0].appendChild(loadingDiv);
    }

    //移除loading效果
    function completeLoading() {
      document.getElementById('loadingDiv').style.display = 'none';
    }

    //展示loading效果
    function showLoading() {
      document.getElementById('loadingDiv').style.display = 'block';
    }

    showLoading();

    setTimeout(function () {
      completeLoading();
    }, time);
  }

  /**
   * 未安装弹窗
   * @param time
   */
  function openTip(msg, orientation) {
    var oH = document.getElementsByTagName('head')[0];
    var oStyle = document.createElement('style');
    oH.appendChild(oStyle);
    oStyle.innerHTML = '\n' +
      '    #notInstall_bg .content_orient{\n' +
      '        transform-origin: 0 0;\n' +
      '        -webkit-transform-origin: 0 0;\n' +
      '        -ms--transform-origin: 0 0;\n' +
      '        -moz--transform-origin: 0 0;\n' +
      '        -o--transform-origin: 0 0;\n' +
      '        transform:rotate(-90deg) translate(-50%, -50%);;\n' +
      '        -ms-transform:rotate(-90deg) translate(-50%, -50%);;\n' +
      '        -moz-transform:rotate(-90deg) translate(-50%, -50%);;\n' +
      '        -webkit-transform:rotate(-90deg) translate(-50%, -50%);;\n' +
      '        -o-transform:rotate(-90deg) translate(-50%, -50%);;\n' +
      '    }#notInstall_bg{\n' +
      '        background: rgba(0,0,0,0.3);\n' +
      '        position: fixed;\n' +
      '        left: 0px;\n' +
      '        top:0px;\n' +
      '        bottom: 0px;\n' +
      '        right: 0px;\n' +
      '        z-index: 80;\n' +
      '     }\n' +
      '    .notInstall{\n' +
      '        background: #ffffff;\n' +
      '        width: 70%;\n' +
      '        padding: 28px;\n' +
      '        position: absolute;\n' +
      '        left: 50%;\n' +
      '        top: 50%;\n' +
      '        transform: translate(-50%, -50%);\n' +
      '        font-size: 22px;\n' +
      '        z-index: 81;\n' +
      '        border-radius: 12px;\n' +
      '    }\n' +
      '    #notInstall h6{\n' +
      '        margin:0;padding:0;\n' +
      '        text-align: center;\n' +
      '        font-size: 22px;\n' +
      '        color: #222222;\n' +
      '    }\n' +
      '    #notInstall .content{\n' +
      '        color: #666666;\n' +
      '        margin: 0;text-align: center;\n' +
      '        padding: 28px 32px;\n' +
      '    }\n' +
      '    #notInstall .close{\n' +
      '        font-family: \'sans-serif\';\n' +
      '        position: absolute;\n' +
      '        right:28px;top:28px;\n' +
      '        color: #909399;\n' +
      '        font-size: 32px;\n' +
      '        cursor: pointer;\n' +
      '        line-height: 1px;\n' +
      '    }\n' +
      '    #notInstall .close::before {\n' +
      '        content: "\\00D7";\n' +
      '    }\n' +
      '    #notInstall .confirm{\n' +
      '        text-align: center;\n' +
      '    }\n' +
      '    #notInstall .confirm p{\n' +
      '        color: #ffffff;\n' +
      '        background-color: #409eff;\n' +
      '        padding: 12px 32px;\n' +
      '        font-size: 20px;\n' +
      '        border-radius: 8px;\n' +
      '        display: inline-block;\n' +
      '        line-height: 1;\n' +
      '        white-space: nowrap;margin:0;\n' +
      '        cursor: pointer;\n' +
      '        border: 1px solid #409eff;\n' +
      '    }';
    var notInstall = '<div id="notInstall" class="notInstall"><h6>提示</h6><p class="content">' + msg + '</p><div class="confirm" id="confirm"><p>确定</p></div><span class="close" id="close"></span></div>';

    var notInstall_bgId = document.getElementById('notInstall_bg');
    var oBody = document.getElementsByTagName('body')[0];
    if (!notInstall_bgId) {
      var notInstall_bg = document.createElement('div');
      notInstall_bg.setAttribute('id', 'notInstall_bg');
      notInstall_bg.innerHTML = notInstall;
      oBody.appendChild(notInstall_bg);
    }

    //判断横屏调整窗口样式
    console.log('orientation openTip == ' + orientation);
    var orientState = orientation == 0;
    console.log(orientState);
    var notInstallStyle = document.getElementById('notInstall');
    if (orientState) {
      var winH = window.innerHeight;
      notInstallStyle.style.width = (winH / 3) * 2 + 'px';
      notInstallStyle.classList.add('content_orient');
    } else {
      notInstallStyle.classList.remove('content_orient');
    }

    var close = document.getElementById('close');
    var confirm = document.getElementById('confirm');
    close.onclick = function () {
      oBody.removeChild(notInstall_bg);
      oH.removeChild(oStyle);
    };
    confirm.onclick = function () {
      oBody.removeChild(notInstall_bg);
      oH.removeChild(oStyle);
    };
  }

  /**
   * 成功弹窗
   * @param time
   */
  function openSuccess(outTradeNo, orientation) {
    var oH = document.getElementsByTagName('head')[0];
    var oSuccessStyle = document.createElement('style');
    oH.appendChild(oSuccessStyle);
    oSuccessStyle.innerHTML = '\n' +
      '    #success_bg .content_orient{\n' +
      '        transform-origin: 0 0;\n' +
      '        -webkit-transform-origin: 0 0;\n' +
      '        -ms--transform-origin: 0 0;\n' +
      '        -moz--transform-origin: 0 0;\n' +
      '        -o--transform-origin: 0 0;\n' +
      '        transform:rotate(-90deg) translate(-50%, -50%);\n' +
      '        -ms-transform:rotate(-90deg) translate(-50%, -50%);\n' +
      '        -moz-transform:rotate(-90deg) translate(-50%, -50%);\n' +
      '        -webkit-transform:rotate(-90deg) translate(-50%, -50%);\n' +
      '        -o-transform:rotate(-90deg) translate(-50%, -50%);\n' +
      '     }\n' +
      '     #success_bg{\n' +
      '         background: rgba(0,0,0,0.3);\n' +
      '         position: fixed;\n' +
      '         left: 0px;\n' +
      '         top:0px;\n' +
      '         bottom: 0px;\n' +
      '         right: 0px;\n' +
      '         z-index: 90;\n' +
      '     }\n' +
      '     .pay_confirm{\n' +
      '         background: #ffffff;\n' +
      '         width: 70%;\n' +
      '         padding-top: 28px;\n' +
      '         position: absolute;\n' +
      '         left: 50%;\n' +
      '         top: 50%;\n' +
      '         transform: translate(-50%, -50%);\n' +
      '         font-size: 22px;\n' +
      '         z-index: 91;\n' +
      '         border-radius: 12px;\n' +
      '     }\n' +
      '     #pay_confirm h6{\n' +
      '         margin:0;padding:0;\n' +
      '         text-align: center;\n' +
      '         font-size: 22px;\n' +
      '         color: #222222;\n' +
      '     }\n' +
      '     #pay_confirm .content{\n' +
      '         color: #666666;\n' +
      '         margin: 0;font-size: 20px;\n' +
      '         padding: 22px 40px;\n' +
      '     }\n' +
      '     #pay_confirm .close{\n' +
      '         font-family: \'sans-serif\';\n' +
      '         position: absolute;\n' +
      '         right:28px;top:28px;\n' +
      '         color: #909399;\n' +
      '         font-size: 32px;\n' +
      '         cursor: pointer;\n' +
      '         line-height: 1px;\n' +
      '     }\n' +
      '     #pay_confirm .close::before {\n' +
      '         content: "\\00D7";\n' +
      '     }\n' +
      '     #pay_confirm .confirm2{\n' +
      '         text-align: center;\n' +
      '     }\n' +
      '     #pay_confirm .confirm2 p{\n' +
      '         color: #409eff;\n' +
      '         padding: 24px 0;\n' +
      '         font-size: 22px;\n' +
      '         display: inline-block;\n' +
      '         line-height: 1;\n' +
      '         white-space: nowrap;\n' +
      '         cursor: pointer;\n' +
      '         box-sizing: border-box;\n' +
      '         border-top: 2px solid #eee;\n' +
      '         border-right: 2px solid #eee;\n' +
      '         margin:0;\n' +
      '         width:50%;\n' +
      '     }\n' +
      '     #pay_confirm .confirm2 p:last-child{\n' +
      '         border-right: 0px;\n' +
      '     }';
    var pay_confirm_html = '<div id="pay_confirm" class="pay_confirm"><h6>支付确认</h6><p class="content">请在微信内完成支付。如果您已经支付成功，请点击"<span style="color: #409eff;">已完成支付"！</span></p><div class="confirm2" id="confirm2"><p>关闭</p><p>已完成支付</p></div><span class="close" id="close"></span></div>';

    var success_bgId = document.getElementById('success_bg');
    var oBody = document.getElementsByTagName('body')[0];
    if (!success_bgId) {
      var success_bg = document.createElement('div');
      success_bg.setAttribute('id', 'success_bg');
      success_bg.innerHTML = pay_confirm_html;
      oBody.appendChild(success_bg);
    }

    //判断横屏调整窗口样式
    var orientState = orientation == 0;
    var pay_confirm_id = document.getElementById('pay_confirm');
    if (orientState) {
      var winH = window.innerHeight;
      pay_confirm_id.style.width = (winH / 3) * 2 + 'px';
      pay_confirm_id.classList.add('content_orient');
    } else {
      pay_confirm_id.classList.remove('content_orient');
    }

    var close = document.getElementById('close');
    var confirm2 = document.getElementById('confirm2');
    close.onclick = function () {
      noticeApp(outTradeNo);
      oBody.removeChild(success_bg);
      oH.removeChild(oSuccessStyle);
      _repetitionClick = true;
    };
    confirm2.onclick = function () {
      noticeApp(outTradeNo);
      oBody.removeChild(success_bg);
      oH.removeChild(oSuccessStyle);
      _repetitionClick = true;
    };
  }

})(KLH5SDK);
