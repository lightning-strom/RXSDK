import { display, LengthMetrics, window } from '@kit.ArkUI';

import { HeaderComponent } from './HeaderComponent';
import { webview } from '@kit.ArkWeb';
import SDKConfig from '../sdk/SDKConfig';
import { Logger } from '../utils/Logger';
import Devices from '../utils/Devices';
import Passport from '../base/Passport';
import { JSON } from '@kit.ArkTS';
import { IifaaRedirectURLResp, IifaaValidateResp, JsHandlerType, JsObject, RXResult } from '../types/Index';
import { WebViewDialog } from './WebViewDialog';
import Objects from '../utils/Objects';
import UIApiImpl from './UIApiImpl';
import { BusinessError } from '@kit.BasicServicesKit';
import { photoAccessHelper } from '@kit.MediaLibraryKit';
import app from '../utils/App';
import UserActionTracer from '../base/UserActionTracer';
import { RXRequest } from '../net/RXRequest';


export interface WebApiParams {
  cpid: string
  productid: string
  channelid: string
  platformid: number
  version: string
  devicecode: string
  language: string
  tzoffset: string
  domain: string
  country_code: string
}

export interface DeviceParams {
  naviBarHeight: number
  isPad: boolean
}

export interface WebParams {
  api_params: string
  custom_params?: string
  methods?: string
  login_data: string
  init_data: string
  device?: string
  request_headers?: string
  passwordStrength?: string
  setSyncInfoEnable?: boolean
  protocol?: string
}


interface JsHandler {
  bindPhone: (dat: JsObject) => void
  bindEmail: (dat: JsObject) => void
  real_auth: (dat: JsObject) => void
  deregister: (dat: JsObject) => void
  underegister: (dat: JsObject) => void
  reset_password: (dat: JsObject) => void
  close_webview: (dat: JsObject) => void
  logBackIn: (dat: JsObject) => void
  callback: (dat: JsObject) => void
}

export interface WebFuncs {
  openWebView: (url: string) => void
  openSystemWebView: (url: string) => void
  openIIFAAAuth: (json: string) => void
  minimized: (json: string) => void
  closeWebView: (json: string) => void
  reportUserLog: (json: string) => void
  setTitle: (json: string) => void
  trackUserAction: (json: string) => void
  invokeNativeCallback: (json: string) => void
  setNaviBarVisible: (json: boolean) => void
  doClose: (json: string) => void
  getInitParams: () => void
  openChatService: (json: string) => void
  resetpwdSuccess: (json: string) => void
  refreshAccessToken: (json: string) => void
  setCloseVisible: (json: boolean) => void
  setBackVisible: (json: boolean) => void
}

interface IifaaAuthParams {
  app_name?: string
  scheme?: string
}

/**
 * Login page component.
 */
@Preview
@Component
  // @CustomDialog
export struct WebViewComponent {
  @Prop title: ResourceStr = $r('app.media.rx_logo');
  @State url: string = '';
  @State @Watch("onNavVisibleChanged") naviBarVisible: boolean = true;
  @State closeVisible: boolean = true;
  @State backVisible: boolean = false;
  @State divVisible: boolean = true;
  @State orientation: display.Orientation = 1;
  @State isLoading: boolean = true
  @State horizontalPadding: number = 0
  webParams: Record<string, string> = {}
  // private controller: CustomDialogController
  private webController: webview.WebviewController = new webview.WebviewController();
  onCloseClick?: (event?: ClickEvent) => void;
  onJavaScriptCallback?: (data: JsObject) => string | boolean | void;
  webFunc: WebFuncs = {
    openWebView: (url: string) => {
      Logger.i('openWebView ' + url);
      WebViewDialog.getInstance(this.getUIContext(), url).setWebParams(this.webParams).setOnJavaScriptCallback(this.onJavaScriptCallback).show()
    },
    openSystemWebView: (url: string) => {
      Logger.i('openSystemWebView ' + url);
      app.startBrowser(url)
    },
    openIIFAAAuth: (json: string) => {
      Logger.i('openIIFAAAuth ' + json);
      this.startIIFAAAuth(json)
    },
    minimized: (json: string) => {
      Logger.i('minimized' + json);
    },
    closeWebView: (json: string) => {
      Logger.i('closeWebView' + json);
      this.close()
    },
    trackUserAction: (json: string) => {
      Logger.i('trackUserAction' + json);
      UserActionTracer.trackUserAction(JSON.parse(json))
    },
    reportUserLog: (json: string) => {
      Logger.i('reportUserLog' + json);

    },
    setTitle: (json: string) => {
      Logger.i('setTitle:' + json);
      this.title = json
    },
    invokeNativeCallback: (json: string) => {
      Logger.i('invokeNativeCallback:' + json);
      this.invokeHandler(json)
      this.close()
    },
    setNaviBarVisible: (visible: boolean) => {
      Logger.i('setNaviBarVisible:' + visible);
      this.naviBarVisible = Boolean(visible)
      // if (!this.closeVisible) {
      //   this.backVisible = visible
      // }
    },
    doClose: (json: string) => {
      Logger.i('doClose:' + json);
      this.close()
    },
    getInitParams: () => {
      try {

        let cfg = SDKConfig;
        let api_params: WebApiParams = {
          cpid: cfg.cpId,
          productid: cfg.productId,
          channelid: cfg.channelId,
          platformid: Devices.platformId,
          version: cfg.VERSION,
          devicecode: Devices.deviceCode,
          language: cfg.lang,
          tzoffset: Devices.timeOffset,
          domain: cfg.domain,
          country_code: cfg.country
        };
        let params: WebParams = {
          api_params: JSON.stringify(api_params),
          login_data: Passport.isLoggedIn ? JSON.stringify(Passport.loginData) : "",
          init_data: JSON.stringify(cfg.initConfig ?? {}),
          device: JSON.stringify({
            "orientation": this.orientation % 2 == 0 ? 2 : 1, // 屏幕方向 横屏1 竖屏2
            "hasSafeZone": 1, // 是否有刘海 1有 2没有
            "naviBarHeight": 36, // 安全区高度
            "isPad": 0, // 是否是pad 0不是pad 1是pad
          }),
          passwordStrength: JSON.stringify(SDKConfig.passwordStrength || {}),
          setSyncInfoEnable: SDKConfig.syncInfoEnable,
          request_headers: JSON.stringify(RXRequest.getHeader(undefined, true, SDKConfig.encipher)),
        };
        params = Objects.assign(params, this.webParams)
        Logger.debug("getInitParams:" + JSON.stringify(params));
        return JSON.stringify(params);
      } catch (e) {
        Logger.e(e)
        return "{}"
      }
    },

    openChatService: (json: string) => {
      Logger.i('openChatService:' + json);
      try {
        UIApiImpl.showChatServicesUI(this.getUIContext(), json ? JSON.parse(json) as Record<string, string> : {})?.setOnJavaScriptCallback(this.onJavaScriptCallback)
      } catch (e) {
        Logger.e(e)
      }
    },
    resetpwdSuccess: (json: string) => {
      Logger.i('resetpwdSuccess' + json);
      try {
        let js = JSON.parse(json || "{}") as JsObject
        js.type = JsHandlerType.reset_password
        this.jsHandler.reset_password(js)
      } catch (e) {
        Logger.e(e)
      }

    },
    refreshAccessToken: (json: string) => {
      Logger.i('refreshAccessToken' + json);
      try {
        Passport.refreshAccessToken((ret) => {
          if (ret?.code == 0) {
            this.webController.runJavaScript(this.jsRefreshAccessTokenFunc(JSON.stringify(ret)))
          }
        })
      } catch (e) {
        Logger.e(e)
      }
    },
    setCloseVisible: (json: boolean) => {
      Logger.i('setCloseVisible ：' + json);
      this.closeVisible = Boolean(json)

    },
    setBackVisible: (json: boolean) => {
      Logger.i('setBackVisible' + json);
      this.backVisible = Boolean(json)
    }
  }

  invokeHandler(data: string): void {
    try {
      const obj = JSON.parse(data || "{}") as JsObject;
      switch (obj.type) {
        case JsHandlerType.binding_phone:
        case JsHandlerType.change_phone:
          this.jsHandler.bindPhone(obj);
          break
        case JsHandlerType.binding_email:
        case JsHandlerType.change_email:
          this.jsHandler.bindEmail(obj);
          break
        case JsHandlerType.real_auth:
          this.jsHandler.real_auth(obj);
          break
        case JsHandlerType.deregister:
          this.jsHandler.deregister(obj);
          break
        case JsHandlerType.underegister:
          this.jsHandler.underegister(obj);
          break
        case JsHandlerType.reset_password:
          this.jsHandler.reset_password(obj);
          break
        case JsHandlerType.close_webview:
          this.jsHandler.close_webview(obj);
          break
        case JsHandlerType.callback:
          this.jsHandler.callback(obj);
        case JsHandlerType.logBackIn:
          this.jsHandler.logBackIn(obj);
          break

      }
    } catch (e) {
      Logger.e(e)
    }
  }

  jsHandler: JsHandler = {
    bindPhone: (dat: JsObject): void => {
      if (dat.ext) {
        Passport.loginData?.bindPhone(dat.ext);
      }
    },
    bindEmail: (dat: JsObject): void => {
      if (dat.ext) {
        Passport.loginData?.bindEmail(dat.ext);
      }
    },

    real_auth: (dat: JsObject): void => {
      if (dat.code === 0 && dat.data) {
        Passport.loginData?.setRealName(dat.data)
        this.onJavaScriptCallback?.(dat)
      }
    },
    deregister: (dat: JsObject): void => {
      if (dat.code === 0) {
        Passport.loginData?.setDeregister(true)
        this.onJavaScriptCallback?.(dat)
      }
    },
    underegister: (dat: JsObject): void => {
      Passport.loginData?.setDeregister(false)
    },
    reset_password: (dat: JsObject): void => {
      this.onJavaScriptCallback?.(dat)

    },
    close_webview: (dat: JsObject): void => {
      this.onJavaScriptCallback?.(dat)
    },
    logBackIn: (dat: JsObject): void => {
      this.onJavaScriptCallback?.(dat)

    },
    callback: (dat: JsObject): void => {
      this.onJavaScriptCallback?.(dat)
    }
  }

  private async startIIFAAAuth(json: string) {
    try {
      let params: IifaaAuthParams = JSON.parse(json || "{}") as IifaaAuthParams
      let appName = params.app_name || app.name || app.bundleName
      let scheme = params.scheme || SDKConfig.realAuthIifaaScheme
      let redirectResp: RXResult<IifaaRedirectURLResp> = await Passport.getIifaaRedirectURL(appName, scheme)
      let redirectUrl = redirectResp.data?.redirect_url || redirectResp.data?.redirectUrl || redirectResp.data?.url
      if (redirectResp.code != 0 || !redirectUrl) {
        this.getUIContext().getPromptAction().showToast(redirectResp)
        this.sendIIFAAResultToJs(redirectResp)
        return
      }

      let started = await app.tryStartBrowser(redirectUrl)
      if (!started) {
        Passport.clearIifaaAutoValidateCallback()
        let failResp: RXResult<IifaaRedirectURLResp> = { code: -1, msg: "实名认证失败", message: "实名认证失败" }
        this.getUIContext().getPromptAction().showToast({ message: failResp.msg })
        this.sendIIFAAResultToJs(failResp)
        return
      }
      this.registerIIFAAAutoValidate()
    } catch (e) {
      Logger.e("openIIFAAAuth error:" + JSON.stringify(e))
      let failResp: RXResult<IifaaRedirectURLResp> = { code: -1, msg: JSON.stringify(e), message: JSON.stringify(e) }
      this.getUIContext().getPromptAction().showToast({ message: failResp.msg })
      this.sendIIFAAResultToJs(failResp)
    }
  }

  private registerIIFAAAutoValidate() {
    Passport.setIifaaAutoValidateCallbackWithSource("deregister", (resp: RXResult<IifaaValidateResp>) => {
      Passport.clearIifaaAutoValidateCallback()
      this.sendIIFAAResultToJs(resp)
    })
  }

  private sendIIFAAResultToJs(result?: Object) {
    let resultString = result ? JSON.stringify(result) : ""
    this.webController.runJavaScript(this.jsIIFAAResultFunc(resultString), (ret) => {
      Logger.i("iifaaResult result:" + ret)
    })
  }

  private jsIIFAAResultFunc(result: string): string {
    return `(function() { return window.iifaaResult!=undefined ? iifaaResult(${JSON.stringify(result)}):undefined; })();`
  }

  jsRefreshAccessTokenFunc(str: string) {
    let code = `
      (function() { return window.refreshAccessToken!=undefined ? refreshAccessToken('${str}'):undefined; })();
    `;
    return code;
  }

  injectionCode() {
    let code = `
  window.globalInitParams = ${this.webFunc.getInitParams()};
  console.log("globalInitParams = " + JSON.stringify(globalInitParams));
  console.log("js注入成功")
  // console.log("window.JsBridge = " + JSON.stringify(Object.keys(window.JsBridge)));
  // console.log("window.JsBridge.getInitParams() = " + JSON.stringify(window.JsBridge.getInitParams()));
 `;
    return code;
  }

  onNavVisibleChanged(propName: string) {
    Logger.i('onNavVisibleChanged:' + propName);
    // if (!visible) {
    //   this.closeVisible = visible
    // }
  }

  aboutToAppear() {
    // this.windowWidth = display.getDefaultDisplaySync().width;
    // this.windowHeight = display.getDefaultDisplaySync().height;
    Logger.i("setWebDebuggingAccess :" + Logger.logEnable)
    Logger.i("display :" + JSON.stringify(display.getDefaultDisplaySync()))

    webview.WebviewController.setWebDebuggingAccess(Logger.logEnable);
    this.orientation = display.getDefaultDisplaySync().orientation


    // let atManager = abilityAccessCtrl.createAtManager();
    // atManager.requestPermissionsFromUser(getContext(this), ['ohos.permission.CAMERA', 'ohos.permission.MICROPHONE'])
    //   .then((data) => {
    //     console.info('data:' + JSON.stringify(data));
    //     console.info('data permissions:' + data.permissions);
    //     console.info('data authResults:' + data.authResults);
    //   }).catch((error: BusinessError) => {
    //   console.error(`Failed to request permissions from user. Code is ${error.code}, message is ${error.message}`);
    // })
  }

  close() {
    // this?.controller?.close()
    this.onCloseClick?.()
  }

  build() {
    // RelativeContainer() {
    Column() {
      // Blank()
      if (this.naviBarVisible) {
        HeaderComponent({
          title: this.title,
          closeVisible: this.closeVisible,
          backVisible: this.backVisible,

          onBack: () => {
            if (this.webController?.accessBackward()) {
              this.webController?.backward()
            } else {
              this.close()
            }
          },
          onClose: () => {
            this.close()
          }
        })
          .margin({ left: (this.orientation % 2) == 0 ? 0 : 10, right: (this.orientation % 2) == 0 ? 0 : 10, top: (this.orientation % 2) == 0 ? 36 : 0 })
          .backgroundColor(Color.White)
        Divider().visibility(this.divVisible ? Visibility.Visible : Visibility.None).strokeWidth(1).color('#ECECEC')
      }
      RelativeContainer() {
        // Stack({ alignContent: Alignment.Center }) {
        this.WebView()
        LoadingProgress()
          .color('#20c0b3')
          .enableLoading(this.isLoading)
          .visibility(this.isLoading ? Visibility.Visible : Visibility.None)// .offset({ top: LengthMetrics.vp(this.naviBarVisible ? -60 : 0) })
          .width(90)
          .height(90)
          .alignRules({
            center: { anchor: "__container__", align: VerticalAlign.Center },
            middle: { anchor: "__container__", align: HorizontalAlign.Center }
          })
        // .backgroundColor(Color.Gray)
        // }.layoutWeight(0.5)

        if (!this.naviBarVisible && this.closeVisible) {
          Button({ type: ButtonType.Normal, stateEffect: true }) {
            Text($r('app.string.rx_back_game')).fontColor(Color.Black).fontSize(14).offset({ x: 0, y: 20 })
          }
          .borderRadius(16)
          .backgroundColor(Color.White)
          .backgroundImage($r('app.media.rx_service_back'))
          .backgroundImageSize({ width: 50, height: 50 })
          .backgroundImagePosition(Alignment.Top)
          .visibility((!this.naviBarVisible && this.backVisible) ? Visibility.Visible : Visibility.None)
          .width(75)
          .height(75)
          .alignRules({
            right: { anchor: "__container__", align: HorizontalAlign.End },
            bottom: { anchor: "__container__", align: VerticalAlign.Bottom }
          })
          // .position({ x: "80%", y: "80%" })
          //  .offset({x:-10,y:-90})
          // .markAnchor({ x: 0, y: "100%" })
          .margin({ right: 25, bottom: (this.orientation % 2) == 0 ? 65 : 25 })
          .onClick(() => {
            this.close()
          })
        }
      }.layoutWeight(1)

      // Blank()
      //.layoutWeight(0.1)
      // .margin({top:300})
      // .backgroundColor(Color.Green)
      // }
      // .height("100%")
      // .width("100%")
      // .alignItems(HorizontalAlign.Start)
      // .backgroundColor(Color.Gray)
    }
    // .padding({ left: (this.orientation % 2) == 0 ? 0 : 20, right: (this.orientation % 2) == 0 ? 0 : 20 })
    .padding({ left: this.horizontalPadding, right: this.horizontalPadding })
    .backgroundColor(Color.White)

    // .expandSafeArea([SafeAreaType.SYSTEM, SafeAreaType.CUTOUT, SafeAreaType.KEYBOARD], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM])
  }

  @Builder
  WebView() {
    Web({ src: this.url, controller: this.webController })
      .domStorageAccess(true)
      .imageAccess(true)
      .onlineImageAccess(true)
      .javaScriptAccess(true)
      .onSizeChange((oldValue: SizeOptions, newValue: SizeOptions) => {
        Logger.info(`Ace: on size change, oldValue is ${JSON.stringify(oldValue)} value is ${JSON.stringify(newValue)}`)
      })
      .javaScriptProxy({
        object: this.webFunc,
        name: "JsBridge",
        methodList: Object.keys(this.webFunc),
        controller: this.webController,
      })// .onInterceptRequest((event) => {
        //   let url = '';
        //   if (event) {
        //     url = event.request.getRequestUrl();
        //     let userAgent = this.webController.getUserAgent();
        //     Logger.i("ua:" + JSON.stringify(userAgent));
        //   }
        //   // Logger.i(JSON.stringify(event.request.getRequestHeader()))
        //   // if (url === this.imgRequestUrl) {
        //   //   return this.responseweb;
        //   // }
        //   return null;
        // })
      .onShowFileSelector((event) => {
        try {
          let PhotoSelectOptions = new photoAccessHelper.PhotoSelectOptions();
          PhotoSelectOptions.MIMEType = photoAccessHelper.PhotoViewMIMETypes.IMAGE_TYPE;
          PhotoSelectOptions.maxSelectNumber = 1;
          let photoPicker = new photoAccessHelper.PhotoViewPicker();
          photoPicker.select(PhotoSelectOptions).then((photoSelectResult: photoAccessHelper.PhotoSelectResult) => {
            console.info('PhotoViewPicker.select successfully, PhotoSelectResult uri: ' + JSON.stringify(photoSelectResult));
            let fileList: Array<string> = photoSelectResult.photoUris;
            if (event) {
              event.result.handleFileList(fileList);
            }
          }).catch((err: BusinessError) => {
            console.error(`PhotoViewPicker.select failed with err: ${err.code}, ${err.message}`);
          });
          return true;
        } catch (error) {
          let err: BusinessError = error as BusinessError;
          console.error(`PhotoViewPicker failed with err: ${err.code}, ${err.message}`);
          return false;
        }
      })
      .onPageBegin((e) => {
        Logger.i("onPageBegin:" + JSON.stringify(e));
        // this.webController.runJavaScript(new RXJavaScriptProxy().injectionCode())
        this.isLoading = true;
      })
      .onPageEnd(e => {
        this.isLoading = false;
        Logger.i("onPageEnd:" + JSON.stringify(e));
        // try {
        //   this.webController.loadUrl("javascript:" + this.removeDesc)
        // } catch (error) {
        //   Logger.i(`loadUrl removeDesc fail: ${JSON.stringify(error)}`)
        // }
      })
      .onConsole((event) => {
        console.log(event?.message.getMessage() + ':' + JSON.stringify(event?.message.getSourceId));
        return false;
      })
  }
}

