// @keepTs
// @ts-nocheck
import { __MODULE_NAME__, __BUNDLE_NAME__ } from "@normalized:N&&&hmssdk/build/default/generated/profile/default/ModuleInfo&4.0.0";
if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface WebViewComponent_Params {
    title?: ResourceStr;
    url?: string;
    naviBarVisible?: boolean;
    closeVisible?: boolean;
    backVisible?: boolean;
    divVisible?: boolean;
    orientation?: display.Orientation;
    isLoading?: boolean;
    horizontalPadding?: number;
    webParams?: Record<string, string>;
    webController?: webview.WebviewController;
    onCloseClick?: (event?: ClickEvent) => void;
    onJavaScriptCallback?: (data: JsObject) => string | boolean | void;
    webFunc?: WebFuncs;
    jsHandler?: JsHandler;
}
import display from "@ohos:display";
import { HeaderComponent } from "@normalized:N&&&hmssdk/src/main/ets/pages/HeaderComponent&4.0.0";
import webview from "@ohos:web.webview";
import SDKConfig from "@normalized:N&&&hmssdk/src/main/ets/sdk/SDKConfig&4.0.0";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import Devices from "@normalized:N&&&hmssdk/src/main/ets/utils/Devices&4.0.0";
import Passport from "@normalized:N&&&hmssdk/src/main/ets/base/Passport&4.0.0";
import JSON from "@ohos:util.json";
import { JsHandlerType } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { IifaaRedirectURLResp, IifaaValidateResp, JsObject, RXResult } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import { WebViewDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/WebViewDialog&4.0.0";
import Objects from "@normalized:N&&&hmssdk/src/main/ets/utils/Objects&4.0.0";
import UIApiImpl from "@normalized:N&&&hmssdk/src/main/ets/pages/UIApiImpl&4.0.0";
import type { BusinessError } from "@ohos:base";
import photoAccessHelper from "@ohos:file.photoAccessHelper";
import app from "@normalized:N&&&hmssdk/src/main/ets/utils/App&4.0.0";
import UserActionTracer from "@normalized:N&&&hmssdk/src/main/ets/base/UserActionTracer&4.0.0";
import { RXRequest } from "@normalized:N&&&hmssdk/src/main/ets/net/RXRequest&4.0.0";
export interface WebApiParams {
    cpid: string;
    productid: string;
    channelid: string;
    platformid: number;
    version: string;
    devicecode: string;
    language: string;
    tzoffset: string;
    domain: string;
    country_code: string;
}
export interface DeviceParams {
    naviBarHeight: number;
    isPad: boolean;
}
export interface WebParams {
    api_params: string;
    custom_params?: string;
    methods?: string;
    login_data: string;
    init_data: string;
    device?: string;
    request_headers?: string;
    passwordStrength?: string;
    setSyncInfoEnable?: boolean;
    protocol?: string;
}
interface JsHandler {
    bindPhone: (dat: JsObject) => void;
    bindEmail: (dat: JsObject) => void;
    real_auth: (dat: JsObject) => void;
    deregister: (dat: JsObject) => void;
    underegister: (dat: JsObject) => void;
    reset_password: (dat: JsObject) => void;
    close_webview: (dat: JsObject) => void;
    logBackIn: (dat: JsObject) => void;
    callback: (dat: JsObject) => void;
}
export interface WebFuncs {
    openWebView: (url: string) => void;
    openSystemWebView: (url: string) => void;
    openIIFAAAuth: (json: string) => void;
    minimized: (json: string) => void;
    closeWebView: (json: string) => void;
    reportUserLog: (json: string) => void;
    setTitle: (json: string) => void;
    trackUserAction: (json: string) => void;
    invokeNativeCallback: (json: string) => void;
    setNaviBarVisible: (json: boolean) => void;
    doClose: (json: string) => void;
    getInitParams: () => void;
    openChatService: (json: string) => void;
    resetpwdSuccess: (json: string) => void;
    refreshAccessToken: (json: string) => void;
    setCloseVisible: (json: boolean) => void;
    setBackVisible: (json: boolean) => void;
}
interface IifaaAuthParams {
    app_name?: string;
    scheme?: string;
}
export class WebViewComponent extends ViewPU {
    constructor(p149, q149, r149, s149 = -1, t149 = undefined, u149) {
        super(p149, r149, s149, u149);
        if (typeof t149 === "function") {
            this.paramsGenerator_ = t149;
        }
        this.__title = new SynchedPropertyObjectOneWayPU(q149.title, this, "title");
        this.__url = new ObservedPropertySimplePU('', this, "url");
        this.__naviBarVisible = new ObservedPropertySimplePU(true, this, "naviBarVisible");
        this.__closeVisible = new ObservedPropertySimplePU(true, this, "closeVisible");
        this.__backVisible = new ObservedPropertySimplePU(false, this, "backVisible");
        this.__divVisible = new ObservedPropertySimplePU(true, this, "divVisible");
        this.__orientation = new ObservedPropertySimplePU(1, this, "orientation");
        this.__isLoading = new ObservedPropertySimplePU(true, this, "isLoading");
        this.__horizontalPadding = new ObservedPropertySimplePU(0, this, "horizontalPadding");
        this.webParams = {};
        this.webController = new webview.WebviewController();
        this.onCloseClick = undefined;
        this.onJavaScriptCallback = undefined;
        this.webFunc = {
            openWebView: (c151: string) => {
                Logger.i('openWebView ' + c151);
                WebViewDialog.getInstance(this.getUIContext(), c151).setWebParams(this.webParams).setOnJavaScriptCallback(this.onJavaScriptCallback).show();
            },
            openSystemWebView: (b151: string) => {
                Logger.i('openSystemWebView ' + b151);
                app.startBrowser(b151);
            },
            openIIFAAAuth: (a151: string) => {
                Logger.i('openIIFAAAuth ' + a151);
                this.startIIFAAAuth(a151);
            },
            minimized: (z150: string) => {
                Logger.i('minimized' + z150);
            },
            closeWebView: (y150: string) => {
                Logger.i('closeWebView' + y150);
                this.close();
            },
            trackUserAction: (x150: string) => {
                Logger.i('trackUserAction' + x150);
                UserActionTracer.trackUserAction(JSON.parse(x150));
            },
            reportUserLog: (w150: string) => {
                Logger.i('reportUserLog' + w150);
            },
            setTitle: (v150: string) => {
                Logger.i('setTitle:' + v150);
                this.title = v150;
            },
            invokeNativeCallback: (u150: string) => {
                Logger.i('invokeNativeCallback:' + u150);
                this.invokeHandler(u150);
                this.close();
            },
            setNaviBarVisible: (t150: boolean) => {
                Logger.i('setNaviBarVisible:' + t150);
                this.naviBarVisible = Boolean(t150);
            },
            doClose: (s150: string) => {
                Logger.i('doClose:' + s150);
                this.close();
            },
            getInitParams: () => {
                try {
                    let p150 = SDKConfig;
                    let q150: WebApiParams = {
                        cpid: p150.cpId,
                        productid: p150.productId,
                        channelid: p150.channelId,
                        platformid: Devices.platformId,
                        version: p150.VERSION,
                        devicecode: Devices.deviceCode,
                        language: p150.lang,
                        tzoffset: Devices.timeOffset,
                        domain: p150.domain,
                        country_code: p150.country
                    };
                    let r150: WebParams = {
                        api_params: JSON.stringify(q150),
                        login_data: Passport.isLoggedIn ? JSON.stringify(Passport.loginData) : "",
                        init_data: JSON.stringify(p150.initConfig ?? {}),
                        device: JSON.stringify({
                            "orientation": this.orientation % 2 == 0 ? 2 : 1,
                            "hasSafeZone": 1,
                            "naviBarHeight": 36,
                            "isPad": 0,
                        }),
                        passwordStrength: JSON.stringify(SDKConfig.passwordStrength || {}),
                        setSyncInfoEnable: SDKConfig.syncInfoEnable,
                        request_headers: JSON.stringify(RXRequest.getHeader(undefined, true, SDKConfig.encipher)),
                    };
                    r150 = Objects.assign(r150, this.webParams);
                    Logger.debug("getInitParams:" + JSON.stringify(r150));
                    return JSON.stringify(r150);
                }
                catch (o150) {
                    Logger.e(o150);
                    return "{}";
                }
            },
            openChatService: (m150: string) => {
                Logger.i('openChatService:' + m150);
                try {
                    UIApiImpl.showChatServicesUI(this.getUIContext(), m150 ? JSON.parse(m150) as Record<string, string> : {})?.setOnJavaScriptCallback(this.onJavaScriptCallback);
                }
                catch (n150) {
                    Logger.e(n150);
                }
            },
            resetpwdSuccess: (j150: string) => {
                Logger.i('resetpwdSuccess' + j150);
                try {
                    let l150 = JSON.parse(j150 || "{}") as JsObject;
                    l150.type = JsHandlerType.reset_password;
                    this.jsHandler.reset_password(l150);
                }
                catch (k150) {
                    Logger.e(k150);
                }
            },
            refreshAccessToken: (g150: string) => {
                Logger.i('refreshAccessToken' + g150);
                try {
                    Passport.refreshAccessToken((i150) => {
                        if (i150?.code == 0) {
                            this.webController.runJavaScript(this.jsRefreshAccessTokenFunc(JSON.stringify(i150)));
                        }
                    });
                }
                catch (h150) {
                    Logger.e(h150);
                }
            },
            setCloseVisible: (f150: boolean) => {
                Logger.i('setCloseVisible ：' + f150);
                this.closeVisible = Boolean(f150);
            },
            setBackVisible: (e150: boolean) => {
                Logger.i('setBackVisible' + e150);
                this.backVisible = Boolean(e150);
            }
        };
        this.jsHandler = {
            bindPhone: (d150: JsObject): void => {
                if (d150.ext) {
                    Passport.loginData?.bindPhone(d150.ext);
                }
            },
            bindEmail: (c150: JsObject): void => {
                if (c150.ext) {
                    Passport.loginData?.bindEmail(c150.ext);
                }
            },
            real_auth: (b150: JsObject): void => {
                if (b150.code === 0 && b150.data) {
                    Passport.loginData?.setRealName(b150.data);
                    this.onJavaScriptCallback?.(b150);
                }
            },
            deregister: (a150: JsObject): void => {
                if (a150.code === 0) {
                    Passport.loginData?.setDeregister(true);
                    this.onJavaScriptCallback?.(a150);
                }
            },
            underegister: (z149: JsObject): void => {
                Passport.loginData?.setDeregister(false);
            },
            reset_password: (y149: JsObject): void => {
                this.onJavaScriptCallback?.(y149);
            },
            close_webview: (x149: JsObject): void => {
                this.onJavaScriptCallback?.(x149);
            },
            logBackIn: (w149: JsObject): void => {
                this.onJavaScriptCallback?.(w149);
            },
            callback: (v149: JsObject): void => {
                this.onJavaScriptCallback?.(v149);
            }
        };
        this.setInitiallyProvidedValue(q149);
        this.declareWatch("naviBarVisible", this.onNavVisibleChanged);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(o149: WebViewComponent_Params) {
        if (o149.title === undefined) {
            this.__title.set({ "id": -1, "type": 20000, params: ['app.media.rx_logo'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
        }
        if (o149.url !== undefined) {
            this.url = o149.url;
        }
        if (o149.naviBarVisible !== undefined) {
            this.naviBarVisible = o149.naviBarVisible;
        }
        if (o149.closeVisible !== undefined) {
            this.closeVisible = o149.closeVisible;
        }
        if (o149.backVisible !== undefined) {
            this.backVisible = o149.backVisible;
        }
        if (o149.divVisible !== undefined) {
            this.divVisible = o149.divVisible;
        }
        if (o149.orientation !== undefined) {
            this.orientation = o149.orientation;
        }
        if (o149.isLoading !== undefined) {
            this.isLoading = o149.isLoading;
        }
        if (o149.horizontalPadding !== undefined) {
            this.horizontalPadding = o149.horizontalPadding;
        }
        if (o149.webParams !== undefined) {
            this.webParams = o149.webParams;
        }
        if (o149.webController !== undefined) {
            this.webController = o149.webController;
        }
        if (o149.onCloseClick !== undefined) {
            this.onCloseClick = o149.onCloseClick;
        }
        if (o149.onJavaScriptCallback !== undefined) {
            this.onJavaScriptCallback = o149.onJavaScriptCallback;
        }
        if (o149.webFunc !== undefined) {
            this.webFunc = o149.webFunc;
        }
        if (o149.jsHandler !== undefined) {
            this.jsHandler = o149.jsHandler;
        }
    }
    updateStateVars(n149: WebViewComponent_Params) {
        this.__title.reset(n149.title);
    }
    purgeVariableDependenciesOnElmtId(m149) {
        this.__title.purgeDependencyOnElmtId(m149);
        this.__url.purgeDependencyOnElmtId(m149);
        this.__naviBarVisible.purgeDependencyOnElmtId(m149);
        this.__closeVisible.purgeDependencyOnElmtId(m149);
        this.__backVisible.purgeDependencyOnElmtId(m149);
        this.__divVisible.purgeDependencyOnElmtId(m149);
        this.__orientation.purgeDependencyOnElmtId(m149);
        this.__isLoading.purgeDependencyOnElmtId(m149);
        this.__horizontalPadding.purgeDependencyOnElmtId(m149);
    }
    aboutToBeDeleted() {
        this.__title.aboutToBeDeleted();
        this.__url.aboutToBeDeleted();
        this.__naviBarVisible.aboutToBeDeleted();
        this.__closeVisible.aboutToBeDeleted();
        this.__backVisible.aboutToBeDeleted();
        this.__divVisible.aboutToBeDeleted();
        this.__orientation.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__horizontalPadding.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __title: SynchedPropertySimpleOneWayPU<ResourceStr>;
    get title() {
        return this.__title.get();
    }
    set title(l149: ResourceStr) {
        this.__title.set(l149);
    }
    private __url: ObservedPropertySimplePU<string>;
    get url() {
        return this.__url.get();
    }
    set url(k149: string) {
        this.__url.set(k149);
    }
    private __naviBarVisible: ObservedPropertySimplePU<boolean>;
    get naviBarVisible() {
        return this.__naviBarVisible.get();
    }
    set naviBarVisible(j149: boolean) {
        this.__naviBarVisible.set(j149);
    }
    private __closeVisible: ObservedPropertySimplePU<boolean>;
    get closeVisible() {
        return this.__closeVisible.get();
    }
    set closeVisible(i149: boolean) {
        this.__closeVisible.set(i149);
    }
    private __backVisible: ObservedPropertySimplePU<boolean>;
    get backVisible() {
        return this.__backVisible.get();
    }
    set backVisible(h149: boolean) {
        this.__backVisible.set(h149);
    }
    private __divVisible: ObservedPropertySimplePU<boolean>;
    get divVisible() {
        return this.__divVisible.get();
    }
    set divVisible(g149: boolean) {
        this.__divVisible.set(g149);
    }
    private __orientation: ObservedPropertySimplePU<display.Orientation>;
    get orientation() {
        return this.__orientation.get();
    }
    set orientation(f149: display.Orientation) {
        this.__orientation.set(f149);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(e149: boolean) {
        this.__isLoading.set(e149);
    }
    private __horizontalPadding: ObservedPropertySimplePU<number>;
    get horizontalPadding() {
        return this.__horizontalPadding.get();
    }
    set horizontalPadding(d149: number) {
        this.__horizontalPadding.set(d149);
    }
    private webParams: Record<string, string>;
    private webController: webview.WebviewController;
    private onCloseClick?: (event?: ClickEvent) => void;
    private onJavaScriptCallback?: (data: JsObject) => string | boolean | void;
    private webFunc: WebFuncs;
    invokeHandler(a149: string): void {
        try {
            const c149 = JSON.parse(a149 || "{}") as JsObject;
            switch (c149.type) {
                case JsHandlerType.binding_phone:
                case JsHandlerType.change_phone:
                    this.jsHandler.bindPhone(c149);
                    break;
                case JsHandlerType.binding_email:
                case JsHandlerType.change_email:
                    this.jsHandler.bindEmail(c149);
                    break;
                case JsHandlerType.real_auth:
                    this.jsHandler.real_auth(c149);
                    break;
                case JsHandlerType.deregister:
                    this.jsHandler.deregister(c149);
                    break;
                case JsHandlerType.underegister:
                    this.jsHandler.underegister(c149);
                    break;
                case JsHandlerType.reset_password:
                    this.jsHandler.reset_password(c149);
                    break;
                case JsHandlerType.close_webview:
                    this.jsHandler.close_webview(c149);
                    break;
                case JsHandlerType.callback:
                    this.jsHandler.callback(c149);
                case JsHandlerType.logBackIn:
                    this.jsHandler.logBackIn(c149);
                    break;
            }
        }
        catch (b149) {
            Logger.e(b149);
        }
    }
    private jsHandler: JsHandler;
    private async startIIFAAAuth(q148: string) {
        try {
            let t148: IifaaAuthParams = JSON.parse(q148 || "{}") as IifaaAuthParams;
            let u148 = t148.app_name || app.name || app.bundleName;
            let v148 = t148.scheme || SDKConfig.realAuthIifaaScheme;
            let w148: RXResult<IifaaRedirectURLResp> = await Passport.getIifaaRedirectURL(u148, v148);
            let x148 = w148.data?.redirect_url || w148.data?.redirectUrl || w148.data?.url;
            if (w148.code != 0 || !x148) {
                this.getUIContext().getPromptAction().showToast(w148);
                this.sendIIFAAResultToJs(w148);
                return;
            }
            let y148 = await app.tryStartBrowser(x148);
            if (!y148) {
                Passport.clearIifaaAutoValidateCallback();
                let z148: RXResult<IifaaRedirectURLResp> = { code: -1, msg: "实名认证失败", message: "实名认证失败" };
                this.getUIContext().getPromptAction().showToast({ message: z148.msg });
                this.sendIIFAAResultToJs(z148);
                return;
            }
            this.registerIIFAAAutoValidate();
        }
        catch (r148) {
            Logger.e("openIIFAAAuth error:" + JSON.stringify(r148));
            let s148: RXResult<IifaaRedirectURLResp> = { code: -1, msg: JSON.stringify(r148), message: JSON.stringify(r148) };
            this.getUIContext().getPromptAction().showToast({ message: s148.msg });
            this.sendIIFAAResultToJs(s148);
        }
    }
    private registerIIFAAAutoValidate() {
        Passport.setIifaaAutoValidateCallbackWithSource("deregister", (p148: RXResult<IifaaValidateResp>) => {
            Passport.clearIifaaAutoValidateCallback();
            this.sendIIFAAResultToJs(p148);
        });
    }
    private sendIIFAAResultToJs(m148?: Object) {
        let n148 = m148 ? JSON.stringify(m148) : "";
        this.webController.runJavaScript(this.jsIIFAAResultFunc(n148), (o148) => {
            Logger.i("iifaaResult result:" + o148);
        });
    }
    private jsIIFAAResultFunc(l148: string): string {
        return `(function() { return window.iifaaResult!=undefined ? iifaaResult(${JSON.stringify(l148)}):undefined; })();`;
    }
    jsRefreshAccessTokenFunc(j148: string) {
        let k148 = `
      (function() { return window.refreshAccessToken!=undefined ? refreshAccessToken('${j148}'):undefined; })();
    `;
        return k148;
    }
    injectionCode() {
        let i148 = `
  window.globalInitParams = ${this.webFunc.getInitParams()};
  console.log("globalInitParams = " + JSON.stringify(globalInitParams));
  console.log("js注入成功")
  // console.log("window.JsBridge = " + JSON.stringify(Object.keys(window.JsBridge)));
  // console.log("window.JsBridge.getInitParams() = " + JSON.stringify(window.JsBridge.getInitParams()));
 `;
        return i148;
    }
    onNavVisibleChanged(h148: string) {
        Logger.i('onNavVisibleChanged:' + h148);
    }
    aboutToAppear() {
        Logger.i("setWebDebuggingAccess :" + Logger.logEnable);
        Logger.i("display :" + JSON.stringify(display.getDefaultDisplaySync()));
        webview.WebviewController.setWebDebuggingAccess(Logger.logEnable);
        this.orientation = display.getDefaultDisplaySync().orientation;
    }
    close() {
        this.onCloseClick?.();
    }
    initialRender() {
        this.observeComponentCreation2((f148, g148) => {
            Column.create();
            Column.padding({ left: this.horizontalPadding, right: this.horizontalPadding });
            Column.backgroundColor(Color.White);
        }, Column);
        this.observeComponentCreation2((v147, w147) => {
            If.create();
            if (this.naviBarVisible) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((d148, e148) => {
                        __Common__.create();
                        __Common__.margin({ left: (this.orientation % 2) == 0 ? 0 : 10, right: (this.orientation % 2) == 0 ? 0 : 10, top: (this.orientation % 2) == 0 ? 36 : 0 });
                        __Common__.backgroundColor(Color.White);
                    }, __Common__);
                    {
                        this.observeComponentCreation2((z147, a148) => {
                            if (a148) {
                                let b148 = new HeaderComponent(this, {
                                    title: this.title,
                                    closeVisible: this.closeVisible,
                                    backVisible: this.backVisible,
                                    onBack: () => {
                                        if (this.webController?.accessBackward()) {
                                            this.webController?.backward();
                                        }
                                        else {
                                            this.close();
                                        }
                                    },
                                    onClose: () => {
                                        this.close();
                                    }
                                }, undefined, z147, () => { }, { page: "HmsSdk/src/main/ets/pages/WebViewComponent.ets", line: 426, col: 9 });
                                ViewPU.create(b148);
                                let c148 = () => {
                                    return {
                                        title: this.title,
                                        closeVisible: this.closeVisible,
                                        backVisible: this.backVisible,
                                        onBack: () => {
                                            if (this.webController?.accessBackward()) {
                                                this.webController?.backward();
                                            }
                                            else {
                                                this.close();
                                            }
                                        },
                                        onClose: () => {
                                            this.close();
                                        }
                                    };
                                };
                                b148.paramsGenerator_ = c148;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(z147, {
                                    title: this.title,
                                    closeVisible: this.closeVisible,
                                    backVisible: this.backVisible
                                });
                            }
                        }, { name: "HeaderComponent" });
                    }
                    __Common__.pop();
                    this.observeComponentCreation2((x147, y147) => {
                        Divider.create();
                        Divider.visibility(this.divVisible ? Visibility.Visible : Visibility.None);
                        Divider.strokeWidth(1);
                        Divider.color('#ECECEC');
                    }, Divider);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((t147, u147) => {
            RelativeContainer.create();
            RelativeContainer.layoutWeight(1);
        }, RelativeContainer);
        this.WebView.bind(this)();
        this.observeComponentCreation2((r147, s147) => {
            LoadingProgress.create();
            LoadingProgress.color('#20c0b3');
            LoadingProgress.enableLoading(this.isLoading);
            LoadingProgress.visibility(this.isLoading ? Visibility.Visible : Visibility.None);
            LoadingProgress.width(90);
            LoadingProgress.height(90);
            LoadingProgress.alignRules({
                center: { anchor: "__container__", align: VerticalAlign.Center },
                middle: { anchor: "__container__", align: HorizontalAlign.Center }
            });
        }, LoadingProgress);
        this.observeComponentCreation2((l147, m147) => {
            If.create();
            if (!this.naviBarVisible && this.closeVisible) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((p147, q147) => {
                        Button.createWithChild({ type: ButtonType.Normal, stateEffect: true });
                        Button.borderRadius(16);
                        Button.backgroundColor(Color.White);
                        Button.backgroundImage({ "id": -1, "type": 20000, params: ['app.media.rx_service_back'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                        Button.backgroundImageSize({ width: 50, height: 50 });
                        Button.backgroundImagePosition(Alignment.Top);
                        Button.visibility((!this.naviBarVisible && this.backVisible) ? Visibility.Visible : Visibility.None);
                        Button.width(75);
                        Button.height(75);
                        Button.alignRules({
                            right: { anchor: "__container__", align: HorizontalAlign.End },
                            bottom: { anchor: "__container__", align: VerticalAlign.Bottom }
                        });
                        Button.margin({ right: 25, bottom: (this.orientation % 2) == 0 ? 65 : 25 });
                        Button.onClick(() => {
                            this.close();
                        });
                    }, Button);
                    this.observeComponentCreation2((n147, o147) => {
                        Text.create({ "id": -1, "type": 10003, params: ['app.string.rx_back_game'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                        Text.fontColor(Color.Black);
                        Text.fontSize(14);
                        Text.offset({ x: 0, y: 20 });
                    }, Text);
                    Text.pop();
                    Button.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        RelativeContainer.pop();
        Column.pop();
    }
    WebView(v146 = null) {
        this.observeComponentCreation2((w146, x146) => {
            Web.create({ src: this.url, controller: this.webController });
            Web.domStorageAccess(true);
            Web.imageAccess(true);
            Web.onlineImageAccess(true);
            Web.javaScriptAccess(true);
            Web.onSizeChange((j147: SizeOptions, k147: SizeOptions) => {
                Logger.info(`Ace: on size change, oldValue is ${JSON.stringify(j147)} value is ${JSON.stringify(k147)}`);
            });
            Web.javaScriptProxy({
                object: this.webFunc,
                name: "JsBridge",
                methodList: Object.keys(this.webFunc),
                controller: this.webController,
            });
            Web.onShowFileSelector((b147) => {
                try {
                    let e147 = new photoAccessHelper.PhotoSelectOptions();
                    e147.MIMEType = photoAccessHelper.PhotoViewMIMETypes.IMAGE_TYPE;
                    e147.maxSelectNumber = 1;
                    let f147 = new photoAccessHelper.PhotoViewPicker();
                    f147.select(e147).then((h147: photoAccessHelper.PhotoSelectResult) => {
                        console.info('PhotoViewPicker.select successfully, PhotoSelectResult uri: ' + JSON.stringify(h147));
                        let i147: Array<string> = h147.photoUris;
                        if (b147) {
                            b147.result.handleFileList(i147);
                        }
                    }).catch((g147: BusinessError) => {
                        console.error(`PhotoViewPicker.select failed with err: ${g147.code}, ${g147.message}`);
                    });
                    return true;
                }
                catch (c147) {
                    let d147: BusinessError = c147 as BusinessError;
                    console.error(`PhotoViewPicker failed with err: ${d147.code}, ${d147.message}`);
                    return false;
                }
            });
            Web.onPageBegin((a147) => {
                Logger.i("onPageBegin:" + JSON.stringify(a147));
                this.isLoading = true;
            });
            Web.onPageEnd(z146 => {
                this.isLoading = false;
                Logger.i("onPageEnd:" + JSON.stringify(z146));
            });
            Web.onConsole((y146) => {
                console.log(y146?.message.getMessage() + ':' + JSON.stringify(y146?.message.getSourceId));
                return false;
            });
        }, Web);
    }
    rerender() {
        this.updateDirtyElements();
    }
}
