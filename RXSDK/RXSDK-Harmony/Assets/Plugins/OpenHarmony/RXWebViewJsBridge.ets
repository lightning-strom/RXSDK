import webview from '@ohos.web.webview';
import { TuanjieLog, POST_MESSAGE_TO_WORKER } from 'classesLib';

export interface callType {
  call: (func: string, params: string) => void
}

export interface JavaScriptItem {
  object: callType,
  name: string,
  methodList: Array<string>,
  controller: webview.WebviewController
}

/**
 * Define bridge class connect WebView and ArkTS.
 */
// 注： 此对象由Tuanjiewebview 调用，在主线程中运行
export default class RXWebViewJsBridge {
  private static instance: RXWebViewJsBridge;
  private initParamJson: string=""
  private initParamObject: ESObject

  public get injectionCode() {
    let code = `
  window.globalInitParams = ${this.initParamJson};
  console.log("js注入成功")
  console.log("globalInitParams = " + JSON.stringify(globalInitParams));
 `;
    return code;
  }

  public static getInstance() {
    if (!RXWebViewJsBridge.instance)
      RXWebViewJsBridge.instance = new RXWebViewJsBridge();

    return RXWebViewJsBridge.instance;
  }

  webFunc:ESObject = {
    openWebView: (url: string) => {
      TuanjieLog.debug('openWebView ' + url)
    },
    minimized: (params: string) => {
      TuanjieLog.debug('minimized' + params)
      globalThis.RXWebViewLayout?.minimized();
    },
    closeWebView: (params: string) => {
      TuanjieLog.debug('closeWebView' + params)
      AppStorage.set("RXWebViewVisible", false);
    },
    reportUserLog: (params: string) => {
      TuanjieLog.debug('reportUserLog' + params)
      POST_MESSAGE_TO_WORKER({
        'type': 'RXWebViewCallUnity',
        'func': 'reportUserLog',
        'data': ''
      }, undefined);
    },
    setTitle: (params: string) => {
      TuanjieLog.debug('setTitle:' + params)
      let title: string = params;
      globalThis.RXWebViewLayout?.setNaviTitle(title);
    },
    invokeNativeCallback: (params: string) => {
      let paramsData: string = params;
      POST_MESSAGE_TO_WORKER({
        'type': 'RXWebViewCallUnity',
        'func': 'invokeNativeCallback',
        'data': paramsData,
      }, undefined);
    },
    setNaviBarVisible: (params:boolean) => {
      let visible: boolean = params;
      globalThis.RXWebViewLayout?.setNaviBarVisible(visible);
    },
    doClose: (params:boolean) => {
      TuanjieLog.debug('doClose' + params)
    },
    getInitParams: () => {
      return this.initParamJson
    },
    openChatService: (params: string) => {
      TuanjieLog.debug('openChatService:' + params)

      let login_data:ESObject = JSON.parse(this.initParamObject?.login_data);
      let api_params:ESObject = JSON.parse(this.initParamObject?.api_params);
      let custom_params:ESObject = JSON.parse(this.initParamObject?.custom_params);

      let token: string = login_data?.token?.access;
      let domain: string = api_params?.domain;
      let channelid: string = api_params?.channelid;
      let cpid: string = api_params?.cpid;
      let productid: string = api_params?.productid;
      let url: string = `${domain}/static/service#/welcome?ruixue-accesstoken=${token}&ruixue-channelid=${channelid}&ruixue-cpid=${cpid}&ruixue-productid=${productid}`;

      let transmit_args: string = custom_params?.transmit_args;
      if (!!transmit_args)
        url += `&param_ui=${transmit_args}`;

      let game_user_id: string = custom_params?.game_user_id;
      if (!!game_user_id && game_user_id.length > 0)
        url += `&game_user_id=${game_user_id}`;

      let nickname: string = custom_params?.nickname;
      if (!!nickname && nickname.length > 0)
        url += `&nickname=${nickname}`;

      let head_img_url: string = custom_params?.head_img_url;
      if (!!head_img_url && head_img_url.length > 0)
        url += `&head_img_url=${head_img_url}`;

      let queue_name: string = custom_params?.queue_name;
      if (!!queue_name && queue_name.length > 0)
        url += `&queue_name=${queue_name}`;

      let controller: webview.WebviewController|undefined = AppStorage.get("RXWebViewController");
      controller?.loadUrl(url);
    },
    resetpwdSuccess: (params: string) => {
      TuanjieLog.debug('resetpwdSuccess:' + params)
    },
    refreshAccessToken: (params: string) => {
      TuanjieLog.debug('refreshAccessToken:' + params)
      POST_MESSAGE_TO_WORKER({
        'type': 'RXWebViewCallUnity',
        'func': 'refreshAccessToken',
        'data': ''
      }, undefined);
    },
    setCloseVisible: (params:boolean) => {
      // TuanjieLog.debug('setCloseVisible' + params)
      let visible: boolean = params;
      globalThis.RXWebViewLayout?.setCloseBtnVisible(visible);
    },
    setBackVisible: (params:boolean) => {
      TuanjieLog.debug('setBackVisible:' + params)
      let visible: boolean = params;
      globalThis.RXWebViewLayout?.setNaviBackVisible(visible);
    },
    syncInfo: (params:string) => {
      POST_MESSAGE_TO_WORKER({
        'type': 'RXWebViewCallUnity',
        'func': 'syncInfo',
        'data': ''
      }, undefined);
    },
    showTip: (params:string) => {
      TuanjieLog.debug('showTip:' + params)
      globalThis.RXWebViewLayout?.showTip();
    },
    call(func: string, params: ESObject): ESObject {
      if (this[func]) {
        TuanjieLog.debug("func:" + func + ",params:" + params);
        return this[func](params)
      } else {
        TuanjieLog.error("error func:" + func + ",params:" + params);
      }
    }
  }

  /**
   * Injects the JavaScript object into window and invoke the function in window.
   *
   * @returns javaScriptProxy object.
   */
  public getJavaScriptProxy(controller: webview.WebviewController): JavaScriptItem {

    let result: JavaScriptItem = {
      object: this.webFunc,
      name: 'JSBridgeHandle',
      methodList: Object.keys(this.webFunc),
      controller: controller
    }
    return result;
  }

  /*  public RegisterWebViewControllerJavaScriptProxy() {
      let controller: webview.WebviewController = AppStorage.get("RXWebViewController");
      controller.registerJavaScriptProxy({call:this.call}, 'JSBridgeHandle', ['call']);
      controller.refresh();
    }*/

  public initJsBridge() {
    let controller: webview.WebviewController|undefined = AppStorage.get("RXWebViewController");
    controller?.runJavaScript(this.injectionCode);
  }

  public setInitParam(initParamsJson: string) {
    this.initParamJson = initParamsJson;
    this.initParamObject = JSON.parse(this.initParamJson);
  }

  public runJavaScript(script: string) {
    let controller: webview.WebviewController|undefined = AppStorage.get("RXWebViewController");
    controller?.runJavaScript(script);
  }
}