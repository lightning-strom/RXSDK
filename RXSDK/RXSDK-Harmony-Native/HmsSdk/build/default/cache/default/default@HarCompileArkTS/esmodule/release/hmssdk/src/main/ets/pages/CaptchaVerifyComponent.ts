// @keepTs
// @ts-nocheck
import { __MODULE_NAME__, __BUNDLE_NAME__ } from "@normalized:N&&&hmssdk/build/default/generated/profile/default/ModuleInfo&4.0.0";
if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface CaptchaVerifyComponent_Params {
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
    onSliderCaptchaCallback?: (data: JsObject) => void;
    webFunc?: WebFuncs;
}
import display from "@ohos:display";
import webview from "@ohos:web.webview";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import JSON from "@ohos:util.json";
import type { JsObject } from '../types/Index';
import type { BusinessError } from "@ohos:base";
import photoAccessHelper from "@ohos:file.photoAccessHelper";
export interface WebFuncs {
    sliderCaptcha: (ret: string) => void;
    invokeNativeCallback: (json: string) => void;
    doClose: (json: string) => void;
    onPageStarted: (json: string) => void;
    onPageFinished: (json: string) => void;
}
export class CaptchaVerifyComponent extends ViewPU {
    constructor(n72, o72, p72, q72 = -1, r72 = undefined, s72) {
        super(n72, p72, q72, s72);
        if (typeof r72 === "function") {
            this.paramsGenerator_ = r72;
        }
        this.__title = new SynchedPropertyObjectOneWayPU(o72.title, this, "title");
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
        this.onSliderCaptchaCallback = undefined;
        this.webFunc = {
            sliderCaptcha: (x72: string) => {
                Logger.i('sliderCaptcha ' + x72);
                this.invokeHandler(x72);
            },
            invokeNativeCallback: (w72: string) => {
                Logger.i('invokeNativeCallback:' + w72);
                this.invokeHandler(w72);
            },
            doClose: (v72: string) => {
                Logger.i('doClose:' + v72);
                this.close();
            },
            onPageStarted: (u72: string): void => {
                Logger.i('onPageStarted:' + u72);
            },
            onPageFinished: (t72: string): void => {
                Logger.i('onPageFinished:' + t72);
            }
        };
        this.setInitiallyProvidedValue(o72);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(m72: CaptchaVerifyComponent_Params) {
        if (m72.title === undefined) {
            this.__title.set({ "id": -1, "type": 20000, params: ['app.media.rx_logo'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
        }
        if (m72.url !== undefined) {
            this.url = m72.url;
        }
        if (m72.naviBarVisible !== undefined) {
            this.naviBarVisible = m72.naviBarVisible;
        }
        if (m72.closeVisible !== undefined) {
            this.closeVisible = m72.closeVisible;
        }
        if (m72.backVisible !== undefined) {
            this.backVisible = m72.backVisible;
        }
        if (m72.divVisible !== undefined) {
            this.divVisible = m72.divVisible;
        }
        if (m72.orientation !== undefined) {
            this.orientation = m72.orientation;
        }
        if (m72.isLoading !== undefined) {
            this.isLoading = m72.isLoading;
        }
        if (m72.horizontalPadding !== undefined) {
            this.horizontalPadding = m72.horizontalPadding;
        }
        if (m72.webParams !== undefined) {
            this.webParams = m72.webParams;
        }
        if (m72.webController !== undefined) {
            this.webController = m72.webController;
        }
        if (m72.onCloseClick !== undefined) {
            this.onCloseClick = m72.onCloseClick;
        }
        if (m72.onSliderCaptchaCallback !== undefined) {
            this.onSliderCaptchaCallback = m72.onSliderCaptchaCallback;
        }
        if (m72.webFunc !== undefined) {
            this.webFunc = m72.webFunc;
        }
    }
    updateStateVars(l72: CaptchaVerifyComponent_Params) {
        this.__title.reset(l72.title);
    }
    purgeVariableDependenciesOnElmtId(k72) {
        this.__title.purgeDependencyOnElmtId(k72);
        this.__url.purgeDependencyOnElmtId(k72);
        this.__naviBarVisible.purgeDependencyOnElmtId(k72);
        this.__closeVisible.purgeDependencyOnElmtId(k72);
        this.__backVisible.purgeDependencyOnElmtId(k72);
        this.__divVisible.purgeDependencyOnElmtId(k72);
        this.__orientation.purgeDependencyOnElmtId(k72);
        this.__isLoading.purgeDependencyOnElmtId(k72);
        this.__horizontalPadding.purgeDependencyOnElmtId(k72);
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
    set title(j72: ResourceStr) {
        this.__title.set(j72);
    }
    private __url: ObservedPropertySimplePU<string>;
    get url() {
        return this.__url.get();
    }
    set url(i72: string) {
        this.__url.set(i72);
    }
    private __naviBarVisible: ObservedPropertySimplePU<boolean>;
    get naviBarVisible() {
        return this.__naviBarVisible.get();
    }
    set naviBarVisible(h72: boolean) {
        this.__naviBarVisible.set(h72);
    }
    private __closeVisible: ObservedPropertySimplePU<boolean>;
    get closeVisible() {
        return this.__closeVisible.get();
    }
    set closeVisible(g72: boolean) {
        this.__closeVisible.set(g72);
    }
    private __backVisible: ObservedPropertySimplePU<boolean>;
    get backVisible() {
        return this.__backVisible.get();
    }
    set backVisible(f72: boolean) {
        this.__backVisible.set(f72);
    }
    private __divVisible: ObservedPropertySimplePU<boolean>;
    get divVisible() {
        return this.__divVisible.get();
    }
    set divVisible(e72: boolean) {
        this.__divVisible.set(e72);
    }
    private __orientation: ObservedPropertySimplePU<display.Orientation>;
    get orientation() {
        return this.__orientation.get();
    }
    set orientation(d72: display.Orientation) {
        this.__orientation.set(d72);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(c72: boolean) {
        this.__isLoading.set(c72);
    }
    private __horizontalPadding: ObservedPropertySimplePU<number>;
    get horizontalPadding() {
        return this.__horizontalPadding.get();
    }
    set horizontalPadding(b72: number) {
        this.__horizontalPadding.set(b72);
    }
    private webParams: Record<string, string>;
    private webController: webview.WebviewController;
    private onCloseClick?: (event?: ClickEvent) => void;
    private onSliderCaptchaCallback?: (data: JsObject) => void;
    private webFunc: WebFuncs;
    invokeHandler(y71: string): void {
        try {
            const a72 = JSON.parse(y71 || "{}") as JsObject;
            if (a72.code >= 0) {
                this.onSliderCaptchaCallback?.(a72);
            }
            else {
                this.close();
            }
        }
        catch (z71) {
            Logger.e(z71);
            this.close();
        }
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
        this.observeComponentCreation2((w71, x71) => {
            RelativeContainer.create();
        }, RelativeContainer);
        this.WebView.bind(this)();
        this.observeComponentCreation2((u71, v71) => {
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
        RelativeContainer.pop();
    }
    WebView(e71 = null) {
        this.observeComponentCreation2((f71, g71) => {
            Web.create({ src: this.url, controller: this.webController });
            Web.domStorageAccess(true);
            Web.imageAccess(true);
            Web.onlineImageAccess(true);
            Web.javaScriptAccess(true);
            Web.onSizeChange((s71: SizeOptions, t71: SizeOptions) => {
                Logger.info(`Ace: on size change, oldValue is ${JSON.stringify(s71)} value is ${JSON.stringify(t71)}`);
            });
            Web.javaScriptProxy({
                object: this.webFunc,
                name: "JsBridge",
                methodList: Object.keys(this.webFunc),
                controller: this.webController,
            });
            Web.onShowFileSelector((k71) => {
                try {
                    let n71 = new photoAccessHelper.PhotoSelectOptions();
                    n71.MIMEType = photoAccessHelper.PhotoViewMIMETypes.IMAGE_TYPE;
                    n71.maxSelectNumber = 1;
                    let o71 = new photoAccessHelper.PhotoViewPicker();
                    o71.select(n71).then((q71: photoAccessHelper.PhotoSelectResult) => {
                        console.info('PhotoViewPicker.select successfully, PhotoSelectResult uri: ' + JSON.stringify(q71));
                        let r71: Array<string> = q71.photoUris;
                        if (k71) {
                            k71.result.handleFileList(r71);
                        }
                    }).catch((p71: BusinessError) => {
                        console.error(`PhotoViewPicker.select failed with err: ${p71.code}, ${p71.message}`);
                    });
                    return true;
                }
                catch (l71) {
                    let m71: BusinessError = l71 as BusinessError;
                    console.error(`PhotoViewPicker failed with err: ${m71.code}, ${m71.message}`);
                    return false;
                }
            });
            Web.onPageBegin((j71) => {
                Logger.i("onPageBegin:" + JSON.stringify(j71));
                this.isLoading = true;
            });
            Web.onPageEnd(i71 => {
                this.isLoading = false;
                Logger.i("onPageEnd:" + JSON.stringify(i71));
            });
            Web.onConsole((h71) => {
                console.log(h71?.message.getMessage() + ':' + JSON.stringify(h71?.message.getSourceId));
                return false;
            });
            Web.backgroundColor(Color.Transparent);
        }, Web);
    }
    rerender() {
        this.updateDirtyElements();
    }
}
