// @keepTs
// @ts-nocheck
import { __MODULE_NAME__, __BUNDLE_NAME__ } from "@normalized:N&&&hmssdk/build/default/generated/profile/default/ModuleInfo&4.0.0";
if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface LoginQuickComponent_Params {
    isLoading?: boolean;
    title?: ResourceStr;
    account?: Account;
    marginBottom?: number;
    onCloseClick?: (event?: ClickEvent) => void;
    onMoreMethodClick?: (tag: number) => void;
    onStartClick?: (account: Account) => void;
}
import { HeaderComponent } from "@normalized:N&&&hmssdk/src/main/ets/pages/HeaderComponent&4.0.0";
import type { Account } from '../types/Index';
import { LoginAccountListDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/LoginAccountListDialog&4.0.0";
import AccountManager from "@normalized:N&&&hmssdk/src/main/ets/base/AccountManager&4.0.0";
import Devices from "@normalized:N&&&hmssdk/src/main/ets/utils/Devices&4.0.0";
interface CaptchaExt {
    captcha_code: string;
}
export class LoginQuickComponent extends ViewPU {
    constructor(l111, m111, n111, o111 = -1, p111 = undefined, q111) {
        super(l111, n111, o111, q111);
        if (typeof p111 === "function") {
            this.paramsGenerator_ = p111;
        }
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.__title = this.createStorageProp("rx_logo", { "id": -1, "type": 20000, params: ['app.media.rx_logo'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ }, "title");
        this.__account = new ObservedPropertyObjectPU({
            openid: '',
            method: '',
            login_method: ''
        }, this, "account");
        this.__marginBottom = new ObservedPropertySimplePU(17, this, "marginBottom");
        this.onCloseClick = undefined;
        this.onMoreMethodClick = undefined;
        this.onStartClick = undefined;
        this.setInitiallyProvidedValue(m111);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(k111: LoginQuickComponent_Params) {
        if (k111.isLoading !== undefined) {
            this.isLoading = k111.isLoading;
        }
        if (k111.account !== undefined) {
            this.account = k111.account;
        }
        if (k111.marginBottom !== undefined) {
            this.marginBottom = k111.marginBottom;
        }
        if (k111.onCloseClick !== undefined) {
            this.onCloseClick = k111.onCloseClick;
        }
        if (k111.onMoreMethodClick !== undefined) {
            this.onMoreMethodClick = k111.onMoreMethodClick;
        }
        if (k111.onStartClick !== undefined) {
            this.onStartClick = k111.onStartClick;
        }
    }
    updateStateVars(j111: LoginQuickComponent_Params) {
    }
    purgeVariableDependenciesOnElmtId(i111) {
        this.__isLoading.purgeDependencyOnElmtId(i111);
        this.__title.purgeDependencyOnElmtId(i111);
        this.__account.purgeDependencyOnElmtId(i111);
        this.__marginBottom.purgeDependencyOnElmtId(i111);
    }
    aboutToBeDeleted() {
        this.__isLoading.aboutToBeDeleted();
        this.__title.aboutToBeDeleted();
        this.__account.aboutToBeDeleted();
        this.__marginBottom.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(h111: boolean) {
        this.__isLoading.set(h111);
    }
    private __title: ObservedPropertyAbstractPU<ResourceStr>;
    get title() {
        return this.__title.get();
    }
    set title(g111: ResourceStr) {
        this.__title.set(g111);
    }
    private __account: ObservedPropertyObjectPU<Account>;
    get account() {
        return this.__account.get();
    }
    set account(f111: Account) {
        this.__account.set(f111);
    }
    private __marginBottom: ObservedPropertySimplePU<number>;
    get marginBottom() {
        return this.__marginBottom.get();
    }
    set marginBottom(e111: number) {
        this.__marginBottom.set(e111);
    }
    private onCloseClick?: (event?: ClickEvent) => void;
    private onMoreMethodClick?: (tag: number) => void;
    private onStartClick?: (account: Account) => void;
    aboutToAppear() {
    }
    close(d111: ClickEvent) {
        this.onCloseClick?.(d111);
    }
    clickMoreLogin() {
        this.onMoreMethodClick?.(0);
    }
    clickLogin() {
        this.onStartClick?.(this.account);
    }
    initialRender() {
        this.observeComponentCreation2((b111, c111) => {
            Stack.create({ alignContent: Alignment.Center });
        }, Stack);
        this.observeComponentCreation2((z110, a111) => {
            Column.create();
            Column.width({ "id": -1, "type": 10002, params: ['app.float.dialog_width'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Column.constraintSize({ maxHeight: 400 });
            Column.backgroundColor(Color.White);
            Column.borderRadius(6);
        }, Column);
        this.observeComponentCreation2((x110, y110) => {
            __Common__.create();
            __Common__.margin({ top: 4 });
        }, __Common__);
        {
            this.observeComponentCreation2((r110, s110) => {
                if (s110) {
                    let t110 = new HeaderComponent(this, {
                        title: this.title,
                        onClose: (w110) => {
                            this.close(w110);
                        }
                    }, undefined, r110, () => { }, { page: "HmsSdk/src/main/ets/pages/LoginQuickComponent.ets", line: 82, col: 9 });
                    ViewPU.create(t110);
                    let u110 = () => {
                        return {
                            title: this.title,
                            onClose: (v110) => {
                                this.close(v110);
                            }
                        };
                    };
                    t110.paramsGenerator_ = u110;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(r110, {
                        title: this.title
                    });
                }
            }, { name: "HeaderComponent" });
        }
        __Common__.pop();
        this.observeComponentCreation2((p110, q110) => {
            Column.create();
            Column.alignItems(HorizontalAlign.Start);
            Column.margin({ top: 10 });
            Column.padding({ left: 20, right: 20 });
        }, Column);
        this.Body.bind(this)();
        Column.pop();
        Column.pop();
        this.observeComponentCreation2((n110, o110) => {
            If.create();
            if (this.isLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.Loading.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Stack.pop();
    }
    Loading(i110 = null) {
        this.observeComponentCreation2((l110, m110) => {
            Stack.create({ alignContent: Alignment.Center });
            Stack.height("100%");
            Stack.width("100%");
            Stack.backgroundColor(0x33000000);
        }, Stack);
        this.observeComponentCreation2((j110, k110) => {
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
        Stack.pop();
    }
    Body(h109 = null) {
        this.observeComponentCreation2((g110, h110) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((e110, f110) => {
            Row.create();
            Row.margin({ top: 12 });
            Row.borderWidth(1);
            Row.borderColor("#E2F2F1");
            Row.borderRadius(4);
            Row.height(36);
        }, Row);
        this.observeComponentCreation2((s109, t109) => {
            If.create();
            if (this.account) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((c110, d110) => {
                        Image.create(this.getIcon(ObservedObject.GetRawObject(this.account)));
                        Image.objectFit(ImageFit.Contain);
                        Image.height(22);
                        Image.margin({ left: 10, right: 8 });
                    }, Image);
                    this.observeComponentCreation2((a110, b110) => {
                        Text.create(Devices.getPhone(this.account?.username));
                        Text.fontColor({ "id": -1, "type": 10001, params: ['app.color.col_315e5a'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                        Text.layoutWeight(1);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((u109, v109) => {
                        Image.create({ "id": -1, "type": 20000, params: ['app.media.rx_account_switch'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                        Image.objectFit(ImageFit.None);
                        Image.width(36);
                        Image.margin({ right: 2 });
                        Image.onClick((w109) => {
                            LoginAccountListDialog.getInstance(this.getUIContext()).setConfig({
                                onSwitchAccount: async (z109) => {
                                    this.account = z109;
                                },
                                onAccountListEmpty: () => {
                                    this.onMoreMethodClick?.(1);
                                },
                                onAccountDeleted: (x109, y109) => {
                                    if (this.account.openid == x109.openid) {
                                        this.account = AccountManager.getFirstAccount();
                                    }
                                }
                            }).show();
                        });
                    }, Image);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Row.pop();
        this.observeComponentCreation2((q109, r109) => {
            Button.createWithLabel('开始游戏', { type: ButtonType.Normal, stateEffect: true });
            Button.width('100%');
            Button.height({ "id": -1, "type": 10002, params: ['app.float.button_height'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Button.borderRadius(4);
            Button.fontSize({ "id": -1, "type": 10002, params: ['app.float.button_font_size'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Button.margin({ top: 12 });
            Button.fontWeight(500);
            Button.fontColor(Color.White);
            Button.backgroundColor({ "id": -1, "type": 10001, params: ['app.color.col_20c0b3'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Button.onClick(() => {
                console.log("click login");
                this.clickLogin();
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((o109, p109) => {
            Button.createWithChild({ type: ButtonType.Normal, stateEffect: true });
            Button.borderRadius(4);
            Button.margin({ top: 16, bottom: this.marginBottom });
            Button.backgroundColor("#F1F3F7");
            Button.onClick(() => {
                console.log("click more login");
                this.clickMoreLogin();
            });
        }, Button);
        this.observeComponentCreation2((m109, n109) => {
            Row.create();
            Row.padding(6);
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((k109, l109) => {
            Image.create({ "id": -1, "type": 20000, params: ['app.media.rx_ico_more_2'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Image.width(20);
            Image.margin({ left: 2 });
        }, Image);
        this.observeComponentCreation2((i109, j109) => {
            Text.create('更多登录方式');
            Text.fontSize(13);
            Text.margin({ left: 5, right: 2 });
        }, Text);
        Text.pop();
        Row.pop();
        Button.pop();
        Column.pop();
    }
    private getIcon(g109: Account) {
        if (Devices.isValidEmail(g109?.username)) {
            return { "id": -1, "type": 20000, params: ['app.media.rx_ico_captchacode3'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ };
        }
        else if (Devices.isValidPhoneNumber(g109?.username)) {
            return { "id": -1, "type": 20000, params: ['app.media.rx_ico_captchacode'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ };
        }
        else {
            return { "id": -1, "type": 20000, params: ['app.media.rx_ico_username'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ };
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "LoginQuickComponent";
    }
}
registerNamedRoute(() => new LoginQuickComponent(undefined, {}), "", { bundleName: __BUNDLE_NAME__, moduleName: __MODULE_NAME__, pagePath: "HmsSdk/src/main/ets/pages/LoginQuickComponent", pageFullPath: "", integratedHsp: "__harDefaultIntegratedHspType__", moduleType: "byteCodeHar" });
