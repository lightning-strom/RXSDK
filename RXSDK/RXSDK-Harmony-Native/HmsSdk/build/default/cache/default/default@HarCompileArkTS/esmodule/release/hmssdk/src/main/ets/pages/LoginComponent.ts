// @keepTs
// @ts-nocheck
import { __MODULE_NAME__, __BUNDLE_NAME__ } from "@normalized:N&&&hmssdk/build/default/generated/profile/default/ModuleInfo&4.0.0";
if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface LoginComponent_Params {
    isLoading?: boolean;
    title?: ResourceStr;
    userName?: string;
    password?: string;
    captcha?: string;
    isCaptcha?: boolean;
    switchText?: string;
    isPrivacyAgreed?: boolean;
    privacyEnable?: boolean;
    marginBottom?: number;
    privacyText1?: string;
    privacyText2?: string;
    privacyText3?: string;
    privacyUrl1?: string;
    privacyUrl2?: string;
    privacyUrl3?: string;
    privacyFontSize?: number;
    account?: Account;
    onLoginClick?: (loginParams: LoginParams) => void;
    onCaptchaClick?: (event: ClickEvent) => void;
    onForgotPwdClick?: (event: ClickEvent) => void;
    onCloseClick?: (event?: ClickEvent) => void;
}
import { HeaderComponent } from "@normalized:N&&&hmssdk/src/main/ets/pages/HeaderComponent&4.0.0";
import { CountDownComponent } from "@normalized:N&&&hmssdk/src/main/ets/pages/CountDownComponent&4.0.0";
import { LoginMethod, Purpose } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { Account, LoginParams } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import { TipsComponent } from "@normalized:N&&&hmssdk/src/main/ets/pages/TipsComponent&4.0.0";
import ApiPath from "@normalized:N&&&hmssdk/src/main/ets/constants/ApiPath&4.0.0";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import UIApiImpl from "@normalized:N&&&hmssdk/src/main/ets/pages/UIApiImpl&4.0.0";
interface CaptchaExt {
    captcha_code: string;
}
export class LoginComponent extends ViewPU {
    constructor(x100, y100, z100, a101 = -1, b101 = undefined, c101) {
        super(x100, z100, a101, c101);
        if (typeof b101 === "function") {
            this.paramsGenerator_ = b101;
        }
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.__title = this.createStorageProp("rx_logo", { "id": -1, "type": 20000, params: ['app.media.rx_logo'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ }, "title");
        this.__userName = new ObservedPropertySimplePU('', this, "userName");
        this.__password = new ObservedPropertySimplePU('', this, "password");
        this.__captcha = new ObservedPropertySimplePU('', this, "captcha");
        this.__isCaptcha = new ObservedPropertySimplePU(true, this, "isCaptcha");
        this.__switchText = new ObservedPropertySimplePU(this.isCaptcha ? "密码登录" : "验证码登录", this, "switchText");
        this.__isPrivacyAgreed = new ObservedPropertySimplePU(false, this, "isPrivacyAgreed");
        this.__privacyEnable = new ObservedPropertySimplePU(true, this, "privacyEnable");
        this.__marginBottom = new ObservedPropertySimplePU(15, this, "marginBottom");
        this.__privacyText1 = new ObservedPropertySimplePU('用户协议', this, "privacyText1");
        this.__privacyText2 = new ObservedPropertySimplePU('隐私政策', this, "privacyText2");
        this.__privacyText3 = new ObservedPropertySimplePU('', this, "privacyText3");
        this.privacyUrl1 = '00001';
        this.privacyUrl2 = '00002';
        this.privacyUrl3 = '';
        this.privacyFontSize = 13;
        this.account = undefined;
        this.onLoginClick = undefined;
        this.onCaptchaClick = undefined;
        this.onForgotPwdClick = undefined;
        this.onCloseClick = undefined;
        this.setInitiallyProvidedValue(y100);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(w100: LoginComponent_Params) {
        if (w100.isLoading !== undefined) {
            this.isLoading = w100.isLoading;
        }
        if (w100.userName !== undefined) {
            this.userName = w100.userName;
        }
        if (w100.password !== undefined) {
            this.password = w100.password;
        }
        if (w100.captcha !== undefined) {
            this.captcha = w100.captcha;
        }
        if (w100.isCaptcha !== undefined) {
            this.isCaptcha = w100.isCaptcha;
        }
        if (w100.switchText !== undefined) {
            this.switchText = w100.switchText;
        }
        if (w100.isPrivacyAgreed !== undefined) {
            this.isPrivacyAgreed = w100.isPrivacyAgreed;
        }
        if (w100.privacyEnable !== undefined) {
            this.privacyEnable = w100.privacyEnable;
        }
        if (w100.marginBottom !== undefined) {
            this.marginBottom = w100.marginBottom;
        }
        if (w100.privacyText1 !== undefined) {
            this.privacyText1 = w100.privacyText1;
        }
        if (w100.privacyText2 !== undefined) {
            this.privacyText2 = w100.privacyText2;
        }
        if (w100.privacyText3 !== undefined) {
            this.privacyText3 = w100.privacyText3;
        }
        if (w100.privacyUrl1 !== undefined) {
            this.privacyUrl1 = w100.privacyUrl1;
        }
        if (w100.privacyUrl2 !== undefined) {
            this.privacyUrl2 = w100.privacyUrl2;
        }
        if (w100.privacyUrl3 !== undefined) {
            this.privacyUrl3 = w100.privacyUrl3;
        }
        if (w100.privacyFontSize !== undefined) {
            this.privacyFontSize = w100.privacyFontSize;
        }
        if (w100.account !== undefined) {
            this.account = w100.account;
        }
        if (w100.onLoginClick !== undefined) {
            this.onLoginClick = w100.onLoginClick;
        }
        if (w100.onCaptchaClick !== undefined) {
            this.onCaptchaClick = w100.onCaptchaClick;
        }
        if (w100.onForgotPwdClick !== undefined) {
            this.onForgotPwdClick = w100.onForgotPwdClick;
        }
        if (w100.onCloseClick !== undefined) {
            this.onCloseClick = w100.onCloseClick;
        }
    }
    updateStateVars(v100: LoginComponent_Params) {
    }
    purgeVariableDependenciesOnElmtId(u100) {
        this.__isLoading.purgeDependencyOnElmtId(u100);
        this.__title.purgeDependencyOnElmtId(u100);
        this.__userName.purgeDependencyOnElmtId(u100);
        this.__password.purgeDependencyOnElmtId(u100);
        this.__captcha.purgeDependencyOnElmtId(u100);
        this.__isCaptcha.purgeDependencyOnElmtId(u100);
        this.__switchText.purgeDependencyOnElmtId(u100);
        this.__isPrivacyAgreed.purgeDependencyOnElmtId(u100);
        this.__privacyEnable.purgeDependencyOnElmtId(u100);
        this.__marginBottom.purgeDependencyOnElmtId(u100);
        this.__privacyText1.purgeDependencyOnElmtId(u100);
        this.__privacyText2.purgeDependencyOnElmtId(u100);
        this.__privacyText3.purgeDependencyOnElmtId(u100);
    }
    aboutToBeDeleted() {
        this.__isLoading.aboutToBeDeleted();
        this.__title.aboutToBeDeleted();
        this.__userName.aboutToBeDeleted();
        this.__password.aboutToBeDeleted();
        this.__captcha.aboutToBeDeleted();
        this.__isCaptcha.aboutToBeDeleted();
        this.__switchText.aboutToBeDeleted();
        this.__isPrivacyAgreed.aboutToBeDeleted();
        this.__privacyEnable.aboutToBeDeleted();
        this.__marginBottom.aboutToBeDeleted();
        this.__privacyText1.aboutToBeDeleted();
        this.__privacyText2.aboutToBeDeleted();
        this.__privacyText3.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(t100: boolean) {
        this.__isLoading.set(t100);
    }
    private __title: ObservedPropertyAbstractPU<ResourceStr>;
    get title() {
        return this.__title.get();
    }
    set title(s100: ResourceStr) {
        this.__title.set(s100);
    }
    private __userName: ObservedPropertySimplePU<string>;
    get userName() {
        return this.__userName.get();
    }
    set userName(r100: string) {
        this.__userName.set(r100);
    }
    private __password: ObservedPropertySimplePU<string>;
    get password() {
        return this.__password.get();
    }
    set password(q100: string) {
        this.__password.set(q100);
    }
    private __captcha: ObservedPropertySimplePU<string>;
    get captcha() {
        return this.__captcha.get();
    }
    set captcha(p100: string) {
        this.__captcha.set(p100);
    }
    private __isCaptcha: ObservedPropertySimplePU<boolean>;
    get isCaptcha() {
        return this.__isCaptcha.get();
    }
    set isCaptcha(o100: boolean) {
        this.__isCaptcha.set(o100);
    }
    private __switchText: ObservedPropertySimplePU<string>;
    get switchText() {
        return this.__switchText.get();
    }
    set switchText(n100: string) {
        this.__switchText.set(n100);
    }
    private __isPrivacyAgreed: ObservedPropertySimplePU<boolean>;
    get isPrivacyAgreed() {
        return this.__isPrivacyAgreed.get();
    }
    set isPrivacyAgreed(m100: boolean) {
        this.__isPrivacyAgreed.set(m100);
    }
    private __privacyEnable: ObservedPropertySimplePU<boolean>;
    get privacyEnable() {
        return this.__privacyEnable.get();
    }
    set privacyEnable(l100: boolean) {
        this.__privacyEnable.set(l100);
    }
    private __marginBottom: ObservedPropertySimplePU<number>;
    get marginBottom() {
        return this.__marginBottom.get();
    }
    set marginBottom(k100: number) {
        this.__marginBottom.set(k100);
    }
    private __privacyText1: ObservedPropertySimplePU<string>;
    get privacyText1() {
        return this.__privacyText1.get();
    }
    set privacyText1(j100: string) {
        this.__privacyText1.set(j100);
    }
    private __privacyText2: ObservedPropertySimplePU<string>;
    get privacyText2() {
        return this.__privacyText2.get();
    }
    set privacyText2(i100: string) {
        this.__privacyText2.set(i100);
    }
    private __privacyText3: ObservedPropertySimplePU<string>;
    get privacyText3() {
        return this.__privacyText3.get();
    }
    set privacyText3(h100: string) {
        this.__privacyText3.set(h100);
    }
    private privacyUrl1: string;
    private privacyUrl2: string;
    private privacyUrl3: string;
    private privacyFontSize: number;
    private account?: Account;
    private onLoginClick?: (loginParams: LoginParams) => void;
    private onCaptchaClick?: (event: ClickEvent) => void;
    private onForgotPwdClick?: (event: ClickEvent) => void;
    private onCloseClick?: (event?: ClickEvent) => void;
    aboutToAppear() {
        if (this.account?.username) {
            this.userName = this.account?.["login_username"] || this.account?.username;
            this.isCaptcha = this.account?.method == "phone" || this.account?.method == "captchacode";
        }
    }
    close(g100: ClickEvent) {
        this.onCloseClick?.(g100);
    }
    clickLogin() {
        let e100: LoginParams = {
            method: (this.isCaptcha ? LoginMethod.CaptchaCode : "username"),
            username: this.userName,
        };
        let f100: CaptchaExt | undefined;
        if (this.captcha) {
            f100 = { captcha_code: this.captcha };
            e100.ext = f100;
        }
        else {
            e100.password = this.password;
        }
        this.onLoginClick?.(e100);
    }
    showPrivacyDetailDialog(c100: string, d100: string) {
        if (c100) {
            UIApiImpl.showWebView(this.getUIContext(), { url: c100.startsWith("http") ? c100 : ApiPath.getPrivacyUrl(c100), title: d100?.replace(/^《|》$/g, '') });
        }
        else {
            Logger.e("privacy url is null error");
        }
    }
    showPrivacyAgreeDialog(w99: (event: ClickEvent) => void) {
        let x99: CustomDialogController;
        x99 = new CustomDialogController({
            builder: () => {
                let y99 = new TipsComponent(this, {
                    title: "用户协议和隐私政策",
                    content: `请确认已阅读并同意 `,
                    linkContent: [this.privacyText1, this.privacyText2, this.privacyText3],
                    onLinkClick: (b100) => {
                        switch (b100) {
                            case 0:
                                this.showPrivacyDetailDialog(this.privacyUrl1, this.privacyText1);
                                break;
                            case 1:
                                this.showPrivacyDetailDialog(this.privacyUrl2, this.privacyText2);
                                break;
                            case 2:
                                this.showPrivacyDetailDialog(this.privacyUrl3, this.privacyText3);
                                break;
                        }
                    },
                    confirmText: "同意",
                    cancelText: "不同意",
                    onConfirm: w99
                }, undefined, -1, () => { }, { page: "HmsSdk/src/main/ets/pages/LoginComponent.ets", line: 99, col: 16 });
                y99.setController(x99);
                ViewPU.create(y99);
                let z99 = () => {
                    return {
                        title: "用户协议和隐私政策",
                        content: `请确认已阅读并同意 `,
                        linkContent: [this.privacyText1, this.privacyText2, this.privacyText3],
                        onLinkClick: (a100) => {
                            switch (a100) {
                                case 0:
                                    this.showPrivacyDetailDialog(this.privacyUrl1, this.privacyText1);
                                    break;
                                case 1:
                                    this.showPrivacyDetailDialog(this.privacyUrl2, this.privacyText2);
                                    break;
                                case 2:
                                    this.showPrivacyDetailDialog(this.privacyUrl3, this.privacyText3);
                                    break;
                            }
                        },
                        confirmText: "同意",
                        cancelText: "不同意",
                        onConfirm: w99
                    };
                };
                y99.paramsGenerator_ = z99;
            },
            autoCancel: false,
            alignment: DialogAlignment.Center,
            offset: { dx: 0, dy: -20 },
            gridCount: 4,
            customStyle: true
        }, this);
        x99.open();
    }
    initialRender() {
        this.observeComponentCreation2((u99, v99) => {
            Stack.create({ alignContent: Alignment.Center });
        }, Stack);
        this.observeComponentCreation2((s99, t99) => {
            Column.create();
            Column.width({ "id": -1, "type": 10002, params: ['app.float.dialog_width'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Column.constraintSize({ maxHeight: 400 });
            Column.backgroundColor(Color.White);
            Column.borderRadius(6);
        }, Column);
        this.observeComponentCreation2((q99, r99) => {
            __Common__.create();
            __Common__.margin({ top: 1 });
        }, __Common__);
        {
            this.observeComponentCreation2((k99, l99) => {
                if (l99) {
                    let m99 = new HeaderComponent(this, {
                        title: this.title,
                        onClose: (p99) => {
                            this.close(p99);
                        }
                    }, undefined, k99, () => { }, { page: "HmsSdk/src/main/ets/pages/LoginComponent.ets", line: 133, col: 9 });
                    ViewPU.create(m99);
                    let n99 = () => {
                        return {
                            title: this.title,
                            onClose: (o99) => {
                                this.close(o99);
                            }
                        };
                    };
                    m99.paramsGenerator_ = n99;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(k99, {
                        title: this.title
                    });
                }
            }, { name: "HeaderComponent" });
        }
        __Common__.pop();
        this.observeComponentCreation2((i99, j99) => {
            Column.create();
            Column.alignItems(HorizontalAlign.Start);
            Column.margin({ top: 8 });
            Column.padding({ left: 20, right: 20 });
        }, Column);
        this.Body.bind(this)();
        Column.pop();
        Column.pop();
        this.observeComponentCreation2((g99, h99) => {
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
    Loading(b99 = null) {
        this.observeComponentCreation2((e99, f99) => {
            Stack.create({ alignContent: Alignment.Center });
            Stack.height("100%");
            Stack.width("100%");
            Stack.backgroundColor(0x33000000);
        }, Stack);
        this.observeComponentCreation2((c99, d99) => {
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
    Body(n96 = null) {
        this.observeComponentCreation2((z98, a99) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((w98, x98) => {
            TextInput.create({ text: { value: this.userName, changeEvent: y98 => { this.userName = y98; } }, placeholder: this.isCaptcha ? "请输入您的手机号" : "请输入您的账号" });
            TextInput.width('100%');
            TextInput.height({ "id": -1, "type": 10002, params: ['app.float.edit_height'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            TextInput.placeholderColor({ "id": -1, "type": 10001, params: ['app.color.col_a5caca'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            TextInput.placeholderFont({ size: { "id": -1, "type": 10002, params: ['app.float.edit_font_size'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ } });
            TextInput.backgroundColor('#00FFFFFF');
            TextInput.fontSize({ "id": -1, "type": 10002, params: ['app.float.edit_font_size'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            TextInput.type(this.isCaptcha ? InputType.PhoneNumber : InputType.USER_NAME);
            TextInput.border({
                width: 1,
                color: { "id": -1, "type": 10001, params: ['app.color.col_e2f2f1'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ },
                radius: 4
            });
        }, TextInput);
        this.observeComponentCreation2((u98, v98) => {
            Stack.create();
            Stack.margin({ top: 10 });
        }, Stack);
        this.observeComponentCreation2((x97, y97) => {
            If.create();
            if (this.isCaptcha) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((s98, t98) => {
                        Flex.create({ alignItems: ItemAlign.Center });
                    }, Flex);
                    this.observeComponentCreation2((p98, q98) => {
                        TextInput.create({ placeholder: "请输入验证码" });
                        TextInput.flexBasis('auto');
                        TextInput.height({ "id": -1, "type": 10002, params: ['app.float.edit_height'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                        TextInput.placeholderColor({ "id": -1, "type": 10001, params: ['app.color.col_a5caca'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                        TextInput.placeholderFont({ size: { "id": -1, "type": 10002, params: ['app.float.edit_font_size'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ } });
                        TextInput.backgroundColor('#00FFFFFF');
                        TextInput.fontSize({ "id": -1, "type": 10002, params: ['app.float.edit_font_size'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                        TextInput.type(InputType.Number);
                        TextInput.border({
                            width: 1,
                            color: { "id": -1, "type": 10001, params: ['app.color.col_e2f2f1'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ },
                            radius: 4
                        });
                        TextInput.layoutWeight(1);
                        TextInput.onChange((r98: string) => {
                            this.captcha = r98;
                        });
                    }, TextInput);
                    this.observeComponentCreation2((n98, o98) => {
                        Blank.create();
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((l98, m98) => {
                        __Common__.create();
                        __Common__.padding({ left: 10, top: 3, bottom: 3 });
                    }, __Common__);
                    {
                        this.observeComponentCreation2((h98, i98) => {
                            if (i98) {
                                let j98 = new CountDownComponent(this, { purpose: Purpose.Login, target: this.userName }, undefined, h98, () => { }, { page: "HmsSdk/src/main/ets/pages/LoginComponent.ets", line: 212, col: 13 });
                                ViewPU.create(j98);
                                let k98 = () => {
                                    return {
                                        purpose: Purpose.Login,
                                        target: this.userName
                                    };
                                };
                                j98.paramsGenerator_ = k98;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(h98, {
                                    target: this.userName
                                });
                            }
                        }, { name: "CountDownComponent" });
                    }
                    __Common__.pop();
                    Flex.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((f98, g98) => {
                        Flex.create({ alignItems: ItemAlign.Center });
                    }, Flex);
                    this.observeComponentCreation2((c98, d98) => {
                        TextInput.create({ placeholder: "请输入密码" });
                        TextInput.height({ "id": -1, "type": 10002, params: ['app.float.edit_height'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                        TextInput.placeholderColor({ "id": -1, "type": 10001, params: ['app.color.col_a5caca'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                        TextInput.backgroundColor('#00FFFFFF');
                        TextInput.placeholderFont({ size: { "id": -1, "type": 10002, params: ['app.float.edit_font_size'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ } });
                        TextInput.fontSize({ "id": -1, "type": 10002, params: ['app.float.edit_font_size'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                        TextInput.type(InputType.Password);
                        TextInput.passwordIcon({ onIconSrc: { "id": -1, "type": 20000, params: ['app.media.rx_pwd_eye_open'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ }, offIconSrc: { "id": -1, "type": 20000, params: ['app.media.rx_pwd_eye_close'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ } });
                        TextInput.layoutWeight(1);
                        TextInput.border({
                            width: 1,
                            color: { "id": -1, "type": 10001, params: ['app.color.col_e2f2f1'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ },
                            radius: 4
                        });
                        TextInput.onChange((e98: string) => {
                            this.password = e98;
                        });
                    }, TextInput);
                    this.observeComponentCreation2((z97, a98) => {
                        Text.create("忘记密码");
                        Text.flexBasis('auto');
                        Text.fontColor({ "id": -1, "type": 10001, params: ['app.color.col_20c0b3'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                        Text.padding({ left: 10, top: 3, bottom: 3 });
                        Text.maxLines(1);
                        Text.onClick((b98) => {
                            if (this.onForgotPwdClick) {
                                this.onForgotPwdClick?.(b98);
                            }
                            else {
                                UIApiImpl.showForgotPasswordUI(this.getUIContext());
                            }
                        });
                    }, Text);
                    Text.pop();
                    Flex.pop();
                });
            }
        }, If);
        If.pop();
        Stack.pop();
        this.observeComponentCreation2((v97, w97) => {
            Row.create();
            Row.margin({ top: 12 });
        }, Row);
        this.observeComponentCreation2((t97, u97) => {
            Blank.create();
            Blank.layoutWeight(1);
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((r97, s97) => {
            Image.create({ "id": -1, "type": 20000, params: ['app.media.rx_change_login_pwd_or_captcha'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Image.objectFit(ImageFit.None);
            Image.height(19);
        }, Image);
        this.observeComponentCreation2((p97, q97) => {
            Text.create(this.switchText);
            Text.fontColor({ "id": -1, "type": 10001, params: ['app.color.col_315e5a'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Text.onClick(() => {
                this.isCaptcha = !this.isCaptcha;
                this.switchText = this.isCaptcha ? "密码登录" : "验证码登录";
                this.password = '';
                this.captcha = '';
            });
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((m97, n97) => {
            Button.createWithLabel('登录', { type: ButtonType.Normal, stateEffect: true });
            Button.width('100%');
            Button.height({ "id": -1, "type": 10002, params: ['app.float.button_height'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Button.borderRadius(4);
            Button.fontSize({ "id": -1, "type": 10002, params: ['app.float.button_font_size'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Button.margin({ top: 12, bottom: this.marginBottom });
            Button.fontWeight(500);
            Button.enabled(isLoginButtonClickable(this.userName, this.isCaptcha ? this.captcha : this.password));
            Button.fontColor(Color.White);
            Button.backgroundColor(isLoginButtonClickable(this.userName, this.isCaptcha ? this.captcha : this.password) ? { "id": -1, "type": 10001, params: ['app.color.col_20c0b3'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ } : { "id": -1, "type": 10001, params: ['app.color.col_b3e6e2'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Button.onClick(() => {
                console.log("click login");
                this.getUIContext().getFocusController().clearFocus();
                if (this.privacyEnable && !this.isPrivacyAgreed) {
                    this.showPrivacyAgreeDialog((o97) => {
                        this.isPrivacyAgreed = true;
                        this.clickLogin();
                    });
                }
                else {
                    this.clickLogin();
                }
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((o96, p96) => {
            If.create();
            if (this.privacyEnable) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((k97, l97) => {
                        Row.create();
                        Row.padding({ bottom: 8 });
                        Row.constraintSize({ maxHeight: 42 });
                        Row.alignItems(VerticalAlign.Center);
                        Row.onClick(() => {
                            this.isPrivacyAgreed = !this.isPrivacyAgreed;
                        });
                    }, Row);
                    this.observeComponentCreation2((c97, d97) => {
                        If.create();
                        if (this.privacyText1 && this.privacyUrl1) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((i97, j97) => {
                                    Checkbox.create({ name: "checkbox", group: 'checkboxGroup' });
                                    Checkbox.width(18);
                                    Checkbox.select(this.isPrivacyAgreed);
                                    Checkbox.shape(CheckBoxShape.ROUNDED_SQUARE);
                                    Checkbox.unselectedColor(0x1FC0B3);
                                    Checkbox.selectedColor(0x1FC0B3);
                                }, Checkbox);
                                Checkbox.pop();
                                this.observeComponentCreation2((g97, h97) => {
                                    Text.create("我已阅读并同意 ");
                                    Text.maxLines(1);
                                    Text.fontSize(this.privacyFontSize);
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((e97, f97) => {
                                    Text.create(this.privacyText1);
                                    Text.maxLines(1);
                                    Text.fontSize(this.privacyFontSize);
                                    Text.fontColor({ "id": -1, "type": 10001, params: ['app.color.col_20c0b3'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                                    Text.onClick(() => {
                                        this.showPrivacyDetailDialog(this.privacyUrl1, this.privacyText1);
                                    });
                                }, Text);
                                Text.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    this.observeComponentCreation2((w96, x96) => {
                        If.create();
                        if (this.privacyText2 && this.privacyUrl2) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((a97, b97) => {
                                    Text.create("、");
                                    Text.maxLines(1);
                                    Text.fontSize(this.privacyFontSize);
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((y96, z96) => {
                                    Text.create(this.privacyText2);
                                    Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                                    Text.maxLines(1);
                                    Text.fontSize(this.privacyFontSize);
                                    Text.fontColor({ "id": -1, "type": 10001, params: ['app.color.col_20c0b3'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                                    Text.onClick(() => {
                                        this.showPrivacyDetailDialog(this.privacyUrl2, this.privacyText2);
                                    });
                                }, Text);
                                Text.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    this.observeComponentCreation2((q96, r96) => {
                        If.create();
                        if (this.privacyText3 && this.privacyUrl3) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((u96, v96) => {
                                    Text.create("、");
                                    Text.maxLines(1);
                                    Text.fontSize(this.privacyFontSize);
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((s96, t96) => {
                                    Text.create(this.privacyText3);
                                    Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                                    Text.maxLines(1);
                                    Text.fontSize(this.privacyFontSize);
                                    Text.layoutWeight(0.5);
                                    Text.fontColor({ "id": -1, "type": 10001, params: ['app.color.col_20c0b3'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                                    Text.onClick(() => {
                                        this.showPrivacyDetailDialog(this.privacyUrl3, this.privacyText3);
                                    });
                                }, Text);
                                Text.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "LoginComponent";
    }
}
function getText(...l96: string[]): string {
    return l96.filter(m96 => m96 && m96 !== "").join("、");
}
function isLoginButtonClickable(j96: string, k96: string): boolean {
    return j96 !== '' && k96 !== '';
}
registerNamedRoute(() => new LoginComponent(undefined, {}), "", { bundleName: __BUNDLE_NAME__, moduleName: __MODULE_NAME__, pagePath: "HmsSdk/src/main/ets/pages/LoginComponent", pageFullPath: "", integratedHsp: "__harDefaultIntegratedHspType__", moduleType: "byteCodeHar" });
