// @keepTs
// @ts-nocheck
import { __MODULE_NAME__, __BUNDLE_NAME__ } from "@normalized:N&&&hmssdk/build/default/generated/profile/default/ModuleInfo&4.0.0";
if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface UserCenterComponent_Params {
    title?: ResourceStr;
    avatar?: ResourceStr;
    nickName?: string;
    url?: string;
    orientation?: display.Orientation;
    webParams?: Record<string, string>;
    onCloseClick?: (event?: ClickEvent) => void;
    onJavaScriptCallback?: (data: JsObject) => string | boolean | undefined;
    onSwitchAccount?: ((event?: ClickEvent) => void) | undefined;
}
import display from "@ohos:display";
import { HeaderComponent } from "@normalized:N&&&hmssdk/src/main/ets/pages/HeaderComponent&4.0.0";
import { WebViewComponent } from "@normalized:N&&&hmssdk/src/main/ets/pages/WebViewComponent&4.0.0";
import type { JsObject } from '../types/Index';
export class UserCenterComponent extends ViewPU {
    constructor(n145, o145, p145, q145 = -1, r145 = undefined, s145) {
        super(n145, p145, q145, s145);
        if (typeof r145 === "function") {
            this.paramsGenerator_ = r145;
        }
        this.__title = this.createStorageProp("rx_logo", { "id": -1, "type": 20000, params: ['app.media.rx_logo'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ }, "title");
        this.__avatar = new ObservedPropertyObjectPU({ "id": -1, "type": 20000, params: ['app.media.rx_user_default_head'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ }, this, "avatar");
        this.__nickName = new ObservedPropertySimplePU('', this, "nickName");
        this.__url = new ObservedPropertySimplePU('', this, "url");
        this.__orientation = new ObservedPropertySimplePU(0, this, "orientation");
        this.webParams = {};
        this.onCloseClick = undefined;
        this.onJavaScriptCallback = undefined;
        this.onSwitchAccount = undefined;
        this.setInitiallyProvidedValue(o145);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(m145: UserCenterComponent_Params) {
        if (m145.avatar !== undefined) {
            this.avatar = m145.avatar;
        }
        if (m145.nickName !== undefined) {
            this.nickName = m145.nickName;
        }
        if (m145.url !== undefined) {
            this.url = m145.url;
        }
        if (m145.orientation !== undefined) {
            this.orientation = m145.orientation;
        }
        if (m145.webParams !== undefined) {
            this.webParams = m145.webParams;
        }
        if (m145.onCloseClick !== undefined) {
            this.onCloseClick = m145.onCloseClick;
        }
        if (m145.onJavaScriptCallback !== undefined) {
            this.onJavaScriptCallback = m145.onJavaScriptCallback;
        }
        if (m145.onSwitchAccount !== undefined) {
            this.onSwitchAccount = m145.onSwitchAccount;
        }
    }
    updateStateVars(l145: UserCenterComponent_Params) {
    }
    purgeVariableDependenciesOnElmtId(k145) {
        this.__title.purgeDependencyOnElmtId(k145);
        this.__avatar.purgeDependencyOnElmtId(k145);
        this.__nickName.purgeDependencyOnElmtId(k145);
        this.__url.purgeDependencyOnElmtId(k145);
        this.__orientation.purgeDependencyOnElmtId(k145);
    }
    aboutToBeDeleted() {
        this.__title.aboutToBeDeleted();
        this.__avatar.aboutToBeDeleted();
        this.__nickName.aboutToBeDeleted();
        this.__url.aboutToBeDeleted();
        this.__orientation.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __title: ObservedPropertyAbstractPU<ResourceStr>;
    get title() {
        return this.__title.get();
    }
    set title(j145: ResourceStr) {
        this.__title.set(j145);
    }
    private __avatar: ObservedPropertyObjectPU<ResourceStr>;
    get avatar() {
        return this.__avatar.get();
    }
    set avatar(i145: ResourceStr) {
        this.__avatar.set(i145);
    }
    private __nickName: ObservedPropertySimplePU<string>;
    get nickName() {
        return this.__nickName.get();
    }
    set nickName(h145: string) {
        this.__nickName.set(h145);
    }
    private __url: ObservedPropertySimplePU<string>;
    get url() {
        return this.__url.get();
    }
    set url(g145: string) {
        this.__url.set(g145);
    }
    private __orientation: ObservedPropertySimplePU<display.Orientation>;
    get orientation() {
        return this.__orientation.get();
    }
    set orientation(f145: display.Orientation) {
        this.__orientation.set(f145);
    }
    private webParams: Record<string, string>;
    private onCloseClick?: (event?: ClickEvent) => void;
    private onJavaScriptCallback?: (data: JsObject) => string | boolean | undefined;
    private onSwitchAccount?: ((event?: ClickEvent) => void) | undefined;
    aboutToAppear() {
        this.orientation = display.getDefaultDisplaySync().orientation;
    }
    close() {
        this.onCloseClick?.();
    }
    initialRender() {
        this.observeComponentCreation2((d145, e145) => {
            Column.create();
            Column.margin({
                left: 30,
                right: 30,
                top: 40,
                bottom: 40
            });
            Column.width((this.orientation % 2 > 0) ? "518" : "-1");
            Column.height(310);
            Column.constraintSize({ maxWidth: 518 });
            Column.borderRadius(6);
            Column.linearGradient({
                direction: GradientDirection.Bottom,
                repeating: true,
                colors: [[0xEDFFEA, 0.0], [0xEBFFF5, 0.5], [0xF6FAF9, 1.0]]
            });
        }, Column);
        this.observeComponentCreation2((b145, c145) => {
            __Common__.create();
            __Common__.margin({ top: 2 });
        }, __Common__);
        {
            this.observeComponentCreation2((x144, y144) => {
                if (y144) {
                    let z144 = new HeaderComponent(this, {
                        title: this.title,
                        backVisible: true,
                        closeVisible: true,
                        onBack: () => {
                            this.close();
                        },
                        onClose: () => {
                            this.close();
                        }
                    }, undefined, x144, () => { }, { page: "HmsSdk/src/main/ets/pages/UserCenterComponent.ets", line: 41, col: 7 });
                    ViewPU.create(z144);
                    let a145 = () => {
                        return {
                            title: this.title,
                            backVisible: true,
                            closeVisible: true,
                            onBack: () => {
                                this.close();
                            },
                            onClose: () => {
                                this.close();
                            }
                        };
                    };
                    z144.paramsGenerator_ = a145;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(x144, {
                        title: this.title,
                        backVisible: true,
                        closeVisible: true
                    });
                }
            }, { name: "HeaderComponent" });
        }
        __Common__.pop();
        this.observeComponentCreation2((v144, w144) => {
            Row.create();
            Row.height(60);
            Row.margin({ left: 25, right: 25 });
        }, Row);
        this.observeComponentCreation2((t144, u144) => {
            Image.create(this.avatar || { "id": -1, "type": 20000, params: ['app.media.rx_user_default_head'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Image.width(30);
            Image.borderRadius(15);
        }, Image);
        this.observeComponentCreation2((r144, s144) => {
            Text.create(this.nickName);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.maxLines(1);
            Text.margin({ left: 10, right: 10 });
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((o144, p144) => {
            Button.createWithLabel('切换账号', { type: ButtonType.Normal, stateEffect: true });
            Button.fontColor({ "id": -1, "type": 10001, params: ['app.color.col_20c0b3'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Button.borderWidth(1);
            Button.backgroundColor(Color.Transparent);
            Button.borderColor({ "id": -1, "type": 10001, params: ['app.color.col_20c0b3'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Button.borderRadius(6);
            Button.onClick((q144) => {
                this.close();
                this.onSwitchAccount?.(q144);
            });
        }, Button);
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((m144, n144) => {
            Column.create();
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((k144, l144) => {
            __Common__.create();
            __Common__.margin({
                left: 17,
                right: 17,
                top: 10,
                bottom: 10
            });
            __Common__.backgroundColor(Color.White);
        }, __Common__);
        {
            this.observeComponentCreation2((g144, h144) => {
                if (h144) {
                    let i144 = new WebViewComponent(this, {
                        url: this.url,
                        webParams: this.webParams,
                        naviBarVisible: false,
                        backVisible: false,
                        closeVisible: false,
                        onJavaScriptCallback: this.onJavaScriptCallback
                    }, undefined, g144, () => { }, { page: "HmsSdk/src/main/ets/pages/UserCenterComponent.ets", line: 71, col: 9 });
                    ViewPU.create(i144);
                    let j144 = () => {
                        return {
                            url: this.url,
                            webParams: this.webParams,
                            naviBarVisible: false,
                            backVisible: false,
                            closeVisible: false,
                            onJavaScriptCallback: this.onJavaScriptCallback
                        };
                    };
                    i144.paramsGenerator_ = j144;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(g144, {});
                }
            }, { name: "WebViewComponent" });
        }
        __Common__.pop();
        Column.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
