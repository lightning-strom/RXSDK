// @keepTs
// @ts-nocheck
import { __MODULE_NAME__, __BUNDLE_NAME__ } from "@normalized:N&&&hmssdk/build/default/generated/profile/default/ModuleInfo&4.0.0";
if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface LoginComponent2_Params {
    isLoading?: boolean;
    title?: ResourceStr;
    userName?: string;
    password?: string;
    captcha?: string;
    loginMethods?: Array<LoginConfig>;
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
    offsetY?: number;
    lastMethod?: string;
    showPasswordIcon?: boolean;
}
import { HeaderComponent } from "@normalized:N&&&hmssdk/src/main/ets/pages/HeaderComponent&4.0.0";
import { CountDownComponent } from "@normalized:N&&&hmssdk/src/main/ets/pages/CountDownComponent&4.0.0";
import { LoginMethod, Purpose } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { Account, LoginParams, Obj } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import { TipsComponent } from "@normalized:N&&&hmssdk/src/main/ets/pages/TipsComponent&4.0.0";
import ApiPath from "@normalized:N&&&hmssdk/src/main/ets/constants/ApiPath&4.0.0";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import UIApiImpl from "@normalized:N&&&hmssdk/src/main/ets/pages/UIApiImpl&4.0.0";
import type { LoginConfig } from '../types/InitConfig';
import UserActionTracer from "@normalized:N&&&hmssdk/src/main/ets/base/UserActionTracer&4.0.0";
import { UserAction, UserScene } from "@normalized:N&&&hmssdk/src/main/ets/base/UserActionEnum&4.0.0";
interface CaptchaExt {
    captcha_code: string;
}
export class LoginComponent2 extends ViewPU {
    constructor(b108, c108, d108, e108 = -1, f108 = undefined, g108) {
        super(b108, d108, e108, g108);
        if (typeof f108 === "function") {
            this.paramsGenerator_ = f108;
        }
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.__title = this.createStorageProp("rx_logo", { "id": -1, "type": 20000, params: ['app.media.rx_logo'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ }, "title");
        this.__userName = new ObservedPropertySimplePU('', this, "userName");
        this.__password = new ObservedPropertySimplePU('', this, "password");
        this.__captcha = new ObservedPropertySimplePU('', this, "captcha");
        this.__loginMethods = new ObservedPropertyObjectPU([{ method: 'captchacode' }, { method: 'username' }, { method: 'wechat' }, { method: 'guest' }], this, "loginMethods");
        this.__isCaptcha = new ObservedPropertySimplePU(true, this, "isCaptcha");
        this.__switchText = new ObservedPropertySimplePU(this.isCaptcha ? "密码登录" : "验证码登录", this, "switchText");
        this.__isPrivacyAgreed = new ObservedPropertySimplePU(false, this, "isPrivacyAgreed");
        this.__privacyEnable = new ObservedPropertySimplePU(true, this, "privacyEnable");
        this.__marginBottom = new ObservedPropertySimplePU(8, this, "marginBottom");
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
        this.__offsetY = new ObservedPropertySimplePU(-1, this, "offsetY");
        this.__lastMethod = new ObservedPropertySimplePU(undefined, this, "lastMethod");
        this.__showPasswordIcon = new ObservedPropertySimplePU(false, this, "showPasswordIcon");
        this.setInitiallyProvidedValue(c108);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(a108: LoginComponent2_Params) {
        if (a108.isLoading !== undefined) {
            this.isLoading = a108.isLoading;
        }
        if (a108.userName !== undefined) {
            this.userName = a108.userName;
        }
        if (a108.password !== undefined) {
            this.password = a108.password;
        }
        if (a108.captcha !== undefined) {
            this.captcha = a108.captcha;
        }
        if (a108.loginMethods !== undefined) {
            this.loginMethods = a108.loginMethods;
        }
        if (a108.isCaptcha !== undefined) {
            this.isCaptcha = a108.isCaptcha;
        }
        if (a108.switchText !== undefined) {
            this.switchText = a108.switchText;
        }
        if (a108.isPrivacyAgreed !== undefined) {
            this.isPrivacyAgreed = a108.isPrivacyAgreed;
        }
        if (a108.privacyEnable !== undefined) {
            this.privacyEnable = a108.privacyEnable;
        }
        if (a108.marginBottom !== undefined) {
            this.marginBottom = a108.marginBottom;
        }
        if (a108.privacyText1 !== undefined) {
            this.privacyText1 = a108.privacyText1;
        }
        if (a108.privacyText2 !== undefined) {
            this.privacyText2 = a108.privacyText2;
        }
        if (a108.privacyText3 !== undefined) {
            this.privacyText3 = a108.privacyText3;
        }
        if (a108.privacyUrl1 !== undefined) {
            this.privacyUrl1 = a108.privacyUrl1;
        }
        if (a108.privacyUrl2 !== undefined) {
            this.privacyUrl2 = a108.privacyUrl2;
        }
        if (a108.privacyUrl3 !== undefined) {
            this.privacyUrl3 = a108.privacyUrl3;
        }
        if (a108.privacyFontSize !== undefined) {
            this.privacyFontSize = a108.privacyFontSize;
        }
        if (a108.account !== undefined) {
            this.account = a108.account;
        }
        if (a108.onLoginClick !== undefined) {
            this.onLoginClick = a108.onLoginClick;
        }
        if (a108.onCaptchaClick !== undefined) {
            this.onCaptchaClick = a108.onCaptchaClick;
        }
        if (a108.onForgotPwdClick !== undefined) {
            this.onForgotPwdClick = a108.onForgotPwdClick;
        }
        if (a108.onCloseClick !== undefined) {
            this.onCloseClick = a108.onCloseClick;
        }
        if (a108.offsetY !== undefined) {
            this.offsetY = a108.offsetY;
        }
        if (a108.lastMethod !== undefined) {
            this.lastMethod = a108.lastMethod;
        }
        if (a108.showPasswordIcon !== undefined) {
            this.showPasswordIcon = a108.showPasswordIcon;
        }
    }
    updateStateVars(z107: LoginComponent2_Params) {
    }
    purgeVariableDependenciesOnElmtId(y107) {
        this.__isLoading.purgeDependencyOnElmtId(y107);
        this.__title.purgeDependencyOnElmtId(y107);
        this.__userName.purgeDependencyOnElmtId(y107);
        this.__password.purgeDependencyOnElmtId(y107);
        this.__captcha.purgeDependencyOnElmtId(y107);
        this.__loginMethods.purgeDependencyOnElmtId(y107);
        this.__isCaptcha.purgeDependencyOnElmtId(y107);
        this.__switchText.purgeDependencyOnElmtId(y107);
        this.__isPrivacyAgreed.purgeDependencyOnElmtId(y107);
        this.__privacyEnable.purgeDependencyOnElmtId(y107);
        this.__marginBottom.purgeDependencyOnElmtId(y107);
        this.__privacyText1.purgeDependencyOnElmtId(y107);
        this.__privacyText2.purgeDependencyOnElmtId(y107);
        this.__privacyText3.purgeDependencyOnElmtId(y107);
        this.__offsetY.purgeDependencyOnElmtId(y107);
        this.__lastMethod.purgeDependencyOnElmtId(y107);
        this.__showPasswordIcon.purgeDependencyOnElmtId(y107);
    }
    aboutToBeDeleted() {
        this.__isLoading.aboutToBeDeleted();
        this.__title.aboutToBeDeleted();
        this.__userName.aboutToBeDeleted();
        this.__password.aboutToBeDeleted();
        this.__captcha.aboutToBeDeleted();
        this.__loginMethods.aboutToBeDeleted();
        this.__isCaptcha.aboutToBeDeleted();
        this.__switchText.aboutToBeDeleted();
        this.__isPrivacyAgreed.aboutToBeDeleted();
        this.__privacyEnable.aboutToBeDeleted();
        this.__marginBottom.aboutToBeDeleted();
        this.__privacyText1.aboutToBeDeleted();
        this.__privacyText2.aboutToBeDeleted();
        this.__privacyText3.aboutToBeDeleted();
        this.__offsetY.aboutToBeDeleted();
        this.__lastMethod.aboutToBeDeleted();
        this.__showPasswordIcon.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(x107: boolean) {
        this.__isLoading.set(x107);
    }
    private __title: ObservedPropertyAbstractPU<ResourceStr>;
    get title() {
        return this.__title.get();
    }
    set title(w107: ResourceStr) {
        this.__title.set(w107);
    }
    private __userName: ObservedPropertySimplePU<string>;
    get userName() {
        return this.__userName.get();
    }
    set userName(v107: string) {
        this.__userName.set(v107);
    }
    private __password: ObservedPropertySimplePU<string>;
    get password() {
        return this.__password.get();
    }
    set password(u107: string) {
        this.__password.set(u107);
    }
    private __captcha: ObservedPropertySimplePU<string>;
    get captcha() {
        return this.__captcha.get();
    }
    set captcha(t107: string) {
        this.__captcha.set(t107);
    }
    private __loginMethods?: ObservedPropertyObjectPU<Array<LoginConfig>>;
    get loginMethods() {
        return this.__loginMethods.get();
    }
    set loginMethods(s107: Array<LoginConfig>) {
        this.__loginMethods.set(s107);
    }
    private __isCaptcha: ObservedPropertySimplePU<boolean>;
    get isCaptcha() {
        return this.__isCaptcha.get();
    }
    set isCaptcha(r107: boolean) {
        this.__isCaptcha.set(r107);
    }
    private __switchText: ObservedPropertySimplePU<string>;
    get switchText() {
        return this.__switchText.get();
    }
    set switchText(q107: string) {
        this.__switchText.set(q107);
    }
    private __isPrivacyAgreed: ObservedPropertySimplePU<boolean>;
    get isPrivacyAgreed() {
        return this.__isPrivacyAgreed.get();
    }
    set isPrivacyAgreed(p107: boolean) {
        this.__isPrivacyAgreed.set(p107);
    }
    private __privacyEnable: ObservedPropertySimplePU<boolean>;
    get privacyEnable() {
        return this.__privacyEnable.get();
    }
    set privacyEnable(o107: boolean) {
        this.__privacyEnable.set(o107);
    }
    private __marginBottom: ObservedPropertySimplePU<number>;
    get marginBottom() {
        return this.__marginBottom.get();
    }
    set marginBottom(n107: number) {
        this.__marginBottom.set(n107);
    }
    private __privacyText1: ObservedPropertySimplePU<string>;
    get privacyText1() {
        return this.__privacyText1.get();
    }
    set privacyText1(m107: string) {
        this.__privacyText1.set(m107);
    }
    private __privacyText2: ObservedPropertySimplePU<string>;
    get privacyText2() {
        return this.__privacyText2.get();
    }
    set privacyText2(l107: string) {
        this.__privacyText2.set(l107);
    }
    private __privacyText3: ObservedPropertySimplePU<string>;
    get privacyText3() {
        return this.__privacyText3.get();
    }
    set privacyText3(k107: string) {
        this.__privacyText3.set(k107);
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
    private __offsetY: ObservedPropertySimplePU<number>;
    get offsetY() {
        return this.__offsetY.get();
    }
    set offsetY(j107: number) {
        this.__offsetY.set(j107);
    }
    private __lastMethod?: ObservedPropertySimplePU<string>;
    get lastMethod() {
        return this.__lastMethod.get();
    }
    set lastMethod(i107: string) {
        this.__lastMethod.set(i107);
    }
    private __showPasswordIcon: ObservedPropertySimplePU<boolean>;
    get showPasswordIcon() {
        return this.__showPasswordIcon.get();
    }
    set showPasswordIcon(h107: boolean) {
        this.__showPasswordIcon.set(h107);
    }
    aboutToAppear() {
        this.isCaptcha = this.pickCaptchaMode(this.account);
        if (this.account && this.isCaptcha == isCaptchaAccount(this.account)) {
            this.userName = this.account["login_username"] || this.account.username;
        }
        this.switchText = this.isCaptcha ? "密码登录" : "验证码登录";
        this.onAction(UserAction.Show, { method: this.lastMethod });
    }
    pickCaptchaMode(b107?: Account): boolean {
        let c107: Array<LoginConfig> = this.loginMethods ?? [];
        let d107: boolean = c107.some((g107: LoginConfig) => g107.method == LoginMethod.CaptchaCode);
        let e107: boolean = c107.some((f107: LoginConfig) => f107.method == LoginMethod.UserName);
        if (d107 != e107) {
            return d107;
        }
        return b107 ? isCaptchaAccount(b107) : this.isCaptcha;
    }
    onAction(z106: string, a107?: Obj) {
        UserActionTracer.traceAction(UserScene.Login, z106, a107);
    }
    play() {
        this.offsetY = -3;
    }
    close(y106: ClickEvent) {
        this.onCloseClick?.(y106);
        this.onAction(UserAction.Close, { method: this.lastMethod });
    }
    clickLogin(w106?: LoginParams) {
        w106 ??= {};
        w106.method ??= (this.isCaptcha ? LoginMethod.CaptchaCode : LoginMethod.UserName);
        this.lastMethod = w106.method;
        this.play();
        let x106: CaptchaExt | undefined;
        if (w106.method == LoginMethod.CaptchaCode) {
            w106.username = this.userName;
            x106 = { captcha_code: this.captcha };
            w106.ext = x106;
        }
        else if (w106.method == LoginMethod.UserName) {
            w106.username = this.userName;
            w106.password = this.password;
        }
        this.onLoginClick?.(w106);
    }
    showPrivacyDetailDialog(u106: string, v106: string) {
        if (u106) {
            UIApiImpl.showWebView(this.getUIContext(), { url: u106.startsWith("http") ? u106 : ApiPath.getPrivacyUrl(u106), title: v106?.replace(/^《|》$/g, '') });
            this.onAction(UserAction.Privacy, { url: u106 });
        }
        else {
            Logger.e("privacy url is null error");
        }
    }
    showPrivacyAgreeDialog(o106: (event: ClickEvent) => void) {
        let p106: CustomDialogController;
        p106 = new CustomDialogController({
            builder: () => {
                let q106 = new TipsComponent(this, {
                    title: "用户协议和隐私政策",
                    content: `请确认已阅读并同意 `,
                    linkContent: [this.privacyText1, this.privacyText2, this.privacyText3],
                    onLinkClick: (t106) => {
                        switch (t106) {
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
                    onConfirm: o106
                }, undefined, -1, () => { }, { page: "HmsSdk/src/main/ets/pages/LoginComponent2.ets", line: 133, col: 16 });
                q106.setController(p106);
                ViewPU.create(q106);
                let r106 = () => {
                    return {
                        title: "用户协议和隐私政策",
                        content: `请确认已阅读并同意 `,
                        linkContent: [this.privacyText1, this.privacyText2, this.privacyText3],
                        onLinkClick: (s106) => {
                            switch (s106) {
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
                        onConfirm: o106
                    };
                };
                q106.paramsGenerator_ = r106;
            },
            autoCancel: false,
            alignment: DialogAlignment.Center,
            offset: { dx: 0, dy: -20 },
            gridCount: 4,
            customStyle: true
        }, this);
        p106.open();
    }
    initialRender() {
        this.observeComponentCreation2((m106, n106) => {
            Stack.create({ alignContent: Alignment.Center });
        }, Stack);
        this.observeComponentCreation2((k106, l106) => {
            Scroll.create();
            Scroll.scrollBar(BarState.Off);
        }, Scroll);
        this.observeComponentCreation2((i106, j106) => {
            Column.create();
            Column.constraintSize({ maxHeight: 410, maxWidth: { "id": -1, "type": 10002, params: ['app.float.dialog_width'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ } });
            Column.margin({ left: 20, right: 20 });
            Column.backgroundColor(Color.White);
            Column.borderRadius(6);
        }, Column);
        this.observeComponentCreation2((g106, h106) => {
            __Common__.create();
            __Common__.margin({ top: 0 });
        }, __Common__);
        {
            this.observeComponentCreation2((a106, b106) => {
                if (b106) {
                    let c106 = new HeaderComponent(this, {
                        marginTop: 0,
                        title: this.title,
                        onClose: (f106) => {
                            this.close(f106);
                        }
                    }, undefined, a106, () => { }, { page: "HmsSdk/src/main/ets/pages/LoginComponent2.ets", line: 169, col: 11 });
                    ViewPU.create(c106);
                    let d106 = () => {
                        return {
                            marginTop: 0,
                            title: this.title,
                            onClose: (e106) => {
                                this.close(e106);
                            }
                        };
                    };
                    c106.paramsGenerator_ = d106;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(a106, {
                        title: this.title
                    });
                }
            }, { name: "HeaderComponent" });
        }
        __Common__.pop();
        this.observeComponentCreation2((y105, z105) => {
            Column.create();
            Column.alignItems(HorizontalAlign.Start);
            Column.margin({ top: 1 });
            Column.padding({ left: 20, right: 20 });
        }, Column);
        this.Body.bind(this)();
        Column.pop();
        Column.pop();
        Scroll.pop();
        this.observeComponentCreation2((w105, x105) => {
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
    Loading(r105 = null) {
        this.observeComponentCreation2((u105, v105) => {
            Stack.create({ alignContent: Alignment.Center });
            Stack.height("100%");
            Stack.width("100%");
            Stack.backgroundColor(0x33000000);
        }, Stack);
        this.observeComponentCreation2((s105, t105) => {
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
    Body(j101 = null) {
        this.observeComponentCreation2((p105, q105) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((m105, n105) => {
            TextInput.create({ text: { value: this.userName, changeEvent: o105 => { this.userName = o105; } }, placeholder: this.isCaptcha ? "请输入您的手机号" : "请输入您的账号" });
            TextInput.height({ "id": -1, "type": 10002, params: ['app.float.edit_height'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            TextInput.placeholderColor({ "id": -1, "type": 10001, params: ['app.color.col_a5caca'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            TextInput.placeholderFont({ size: { "id": -1, "type": 10002, params: ['app.float.edit_font_size'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ } });
            TextInput.backgroundColor('#00FFFFFF');
            TextInput.fontSize({ "id": -1, "type": 10002, params: ['app.float.edit_font_size'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            TextInput.onFocus(() => {
                this.onAction(this.isCaptcha ? UserAction.CaptchaCodeTF : UserAction.AccountTF);
            });
            TextInput.type(this.isCaptcha ? InputType.PhoneNumber : InputType.USER_NAME);
            TextInput.border({
                width: 1,
                color: { "id": -1, "type": 10001, params: ['app.color.col_e2f2f1'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ },
                radius: 4
            });
        }, TextInput);
        this.observeComponentCreation2((k105, l105) => {
            Stack.create();
            Stack.margin({ top: 7 });
        }, Stack);
        this.observeComponentCreation2((g104, h104) => {
            If.create();
            if (this.isCaptcha) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((i105, j105) => {
                        Flex.create({ alignItems: ItemAlign.Center });
                        Flex.border({
                            width: 1,
                            color: { "id": -1, "type": 10001, params: ['app.color.col_e2f2f1'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ },
                            radius: 4
                        });
                    }, Flex);
                    this.observeComponentCreation2((f105, g105) => {
                        TextInput.create({ placeholder: "请输入验证码" });
                        TextInput.flexBasis('auto');
                        TextInput.height({ "id": -1, "type": 10002, params: ['app.float.edit_height'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                        TextInput.placeholderColor({ "id": -1, "type": 10001, params: ['app.color.col_a5caca'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                        TextInput.placeholderFont({ size: { "id": -1, "type": 10002, params: ['app.float.edit_font_size'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ } });
                        TextInput.backgroundColor('#00FFFFFF');
                        TextInput.fontSize({ "id": -1, "type": 10002, params: ['app.float.edit_font_size'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                        TextInput.type(InputType.Number);
                        TextInput.layoutWeight(1);
                        TextInput.onFocus(() => {
                            this.onAction(UserAction.CaptchaCodeTF);
                        });
                        TextInput.onChange((h105: string) => {
                            this.captcha = h105;
                        });
                    }, TextInput);
                    this.observeComponentCreation2((d105, e105) => {
                        Blank.create();
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((b105, c105) => {
                        Divider.create();
                        Divider.vertical(true);
                        Divider.height(20);
                        Divider.color("#e2f2f1");
                    }, Divider);
                    this.observeComponentCreation2((y104, z104) => {
                        __Common__.create();
                        __Common__.padding({
                            left: 8,
                            top: 3,
                            bottom: 3,
                            right: 8
                        });
                        __Common__.onClick((a105) => {
                            this.onAction(UserAction.CaptchaCodeSend);
                        });
                    }, __Common__);
                    {
                        this.observeComponentCreation2((u104, v104) => {
                            if (v104) {
                                let w104 = new CountDownComponent(this, { purpose: Purpose.Login, target: this.userName }, undefined, u104, () => { }, { page: "HmsSdk/src/main/ets/pages/LoginComponent2.ets", line: 254, col: 13 });
                                ViewPU.create(w104);
                                let x104 = () => {
                                    return {
                                        purpose: Purpose.Login,
                                        target: this.userName
                                    };
                                };
                                w104.paramsGenerator_ = x104;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(u104, {
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
                    this.observeComponentCreation2((s104, t104) => {
                        Flex.create({ alignItems: ItemAlign.Center });
                        Flex.border({
                            width: 1,
                            color: { "id": -1, "type": 10001, params: ['app.color.col_e2f2f1'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ },
                            radius: 4
                        });
                    }, Flex);
                    this.observeComponentCreation2((p104, q104) => {
                        TextInput.create({ placeholder: "请输入密码" });
                        TextInput.height({ "id": -1, "type": 10002, params: ['app.float.edit_height'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                        TextInput.placeholderColor({ "id": -1, "type": 10001, params: ['app.color.col_a5caca'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                        TextInput.backgroundColor('#00FFFFFF');
                        TextInput.placeholderFont({ size: { "id": -1, "type": 10002, params: ['app.float.edit_font_size'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ } });
                        TextInput.fontSize({ "id": -1, "type": 10002, params: ['app.float.edit_font_size'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                        TextInput.type(InputType.Password);
                        TextInput.onFocus(() => {
                            this.onAction(UserAction.PasswordTF);
                        });
                        TextInput.showPasswordIcon(this.showPasswordIcon);
                        TextInput.passwordIcon({ onIconSrc: { "id": -1, "type": 20000, params: ['app.media.rx_pwd_eye_open'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ }, offIconSrc: { "id": -1, "type": 20000, params: ['app.media.rx_pwd_eye_close'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ } });
                        TextInput.layoutWeight(1);
                        TextInput.onChange((r104: string) => {
                            this.showPasswordIcon = !!r104;
                            this.password = r104;
                        });
                    }, TextInput);
                    this.observeComponentCreation2((n104, o104) => {
                        Blank.create();
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((l104, m104) => {
                        Divider.create();
                        Divider.vertical(true);
                        Divider.height(20);
                        Divider.color("#e2f2f1");
                    }, Divider);
                    this.observeComponentCreation2((i104, j104) => {
                        Text.create("忘记密码");
                        Text.flexBasis('auto');
                        Text.fontColor({ "id": -1, "type": 10001, params: ['app.color.col_20c0b3'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                        Text.padding({
                            left: 8,
                            top: 3,
                            bottom: 3,
                            right: 8
                        });
                        Text.maxLines(1);
                        Text.onClick((k104) => {
                            if (this.onForgotPwdClick) {
                                this.onForgotPwdClick?.(k104);
                            }
                            else {
                                UIApiImpl.showForgotPasswordUI(this.getUIContext());
                            }
                            this.onAction(UserAction.ForgotPassword);
                        });
                    }, Text);
                    Text.pop();
                    Flex.pop();
                });
            }
        }, If);
        If.pop();
        Stack.pop();
        this.observeComponentCreation2((e104, f104) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((b104, c104) => {
            Button.createWithLabel('登录', { type: ButtonType.Normal, stateEffect: true });
            Button.height({ "id": -1, "type": 10002, params: ['app.float.button_height'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Button.borderRadius(4);
            Button.layoutWeight(1);
            Button.fontSize({ "id": -1, "type": 10002, params: ['app.float.button_font_size'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Button.margin({ top: 7, bottom: this.marginBottom });
            Button.fontWeight(500);
            Button.enabled(isLoginButtonClickable(this.userName, this.isCaptcha ? this.captcha : this.password));
            Button.fontColor(Color.White);
            Button.backgroundColor(isLoginButtonClickable(this.userName, this.isCaptcha ? this.captcha : this.password) ? { "id": -1, "type": 10001, params: ['app.color.col_20c0b3'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ } : { "id": -1, "type": 10001, params: ['app.color.col_b3e6e2'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Button.onClick(() => {
                console.log("click login");
                this.onAction(UserAction.Click, { method: this.isCaptcha ? LoginMethod.CaptchaCode : LoginMethod.UserName });
                this.getUIContext().getFocusController().clearFocus();
                if (this.privacyEnable && !this.isPrivacyAgreed) {
                    this.showPrivacyAgreeDialog((d104) => {
                        this.isPrivacyAgreed = true;
                        this.clickLogin({});
                    });
                }
                else {
                    this.clickLogin({});
                }
            });
        }, Button);
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((a103, b103) => {
            If.create();
            if (this.privacyEnable) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((z103, a104) => {
                        Row.create();
                        Row.padding({ bottom: 4 });
                        Row.constraintSize({ maxHeight: 42 });
                        Row.alignItems(VerticalAlign.Center);
                        Row.onClick(() => {
                            this.isPrivacyAgreed = !this.isPrivacyAgreed;
                        });
                    }, Row);
                    this.observeComponentCreation2((w103, x103) => {
                        Checkbox.create({ name: "checkbox", group: 'checkboxGroup' });
                        Checkbox.width(18);
                        Checkbox.select(this.isPrivacyAgreed, y103 => { this.isPrivacyAgreed = y103; });
                        Checkbox.shape(CheckBoxShape.ROUNDED_SQUARE);
                        Checkbox.unselectedColor(0x1FC0B3);
                        Checkbox.selectedColor(0x1FC0B3);
                    }, Checkbox);
                    Checkbox.pop();
                    this.observeComponentCreation2((u103, v103) => {
                        Text.create();
                        Text.maxLines(2);
                        Text.margin({ right: 25 });
                        Text.fontSize(this.privacyFontSize);
                    }, Text);
                    this.observeComponentCreation2((o103, p103) => {
                        If.create();
                        if (this.privacyText1 && this.privacyUrl1) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((s103, t103) => {
                                    Span.create("我已阅读并同意");
                                }, Span);
                                this.observeComponentCreation2((q103, r103) => {
                                    Span.create(this.privacyText1);
                                    Span.fontColor({ "id": -1, "type": 10001, params: ['app.color.col_20c0b3'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                                    Span.onClick(() => {
                                        this.showPrivacyDetailDialog(this.privacyUrl1, this.privacyText1);
                                    });
                                }, Span);
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    this.observeComponentCreation2((i103, j103) => {
                        If.create();
                        if (this.privacyText2 && this.privacyUrl2) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((m103, n103) => {
                                    Span.create("、");
                                }, Span);
                                this.observeComponentCreation2((k103, l103) => {
                                    Span.create(this.privacyText2);
                                    Span.fontColor({ "id": -1, "type": 10001, params: ['app.color.col_20c0b3'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                                    Span.onClick(() => {
                                        this.showPrivacyDetailDialog(this.privacyUrl2, this.privacyText2);
                                    });
                                }, Span);
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    this.observeComponentCreation2((c103, d103) => {
                        If.create();
                        if (this.privacyText3 && this.privacyUrl3) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((g103, h103) => {
                                    Span.create("、");
                                }, Span);
                                this.observeComponentCreation2((e103, f103) => {
                                    Span.create(this.privacyText3);
                                    Span.layoutWeight(0.5);
                                    Span.fontColor({ "id": -1, "type": 10001, params: ['app.color.col_20c0b3'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                                    Span.onClick(() => {
                                        this.showPrivacyDetailDialog(this.privacyUrl3, this.privacyText3);
                                    });
                                }, Span);
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    Text.pop();
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((y102, z102) => {
            Column.create();
            Column.margin({ bottom: 12 });
        }, Column);
        this.observeComponentCreation2((k101, l101) => {
            If.create();
            if (this.isShowOtherLogin(ObservedObject.GetRawObject(this.loginMethods))) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((w102, x102) => {
                        Row.create();
                    }, Row);
                    this.observeComponentCreation2((u102, v102) => {
                        Divider.create();
                        Divider.color("#D8D8D8");
                        Divider.layoutWeight(1);
                    }, Divider);
                    this.observeComponentCreation2((s102, t102) => {
                        Text.create("其他登录方式");
                        Text.fontColor("#A3A3A3");
                        Text.fontSize(11);
                        Text.margin({ left: 14, right: 14 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((q102, r102) => {
                        Divider.create();
                        Divider.color("#D8D8D8");
                        Divider.layoutWeight(1);
                    }, Divider);
                    Row.pop();
                    this.observeComponentCreation2((o102, p102) => {
                        Row.create({ space: 10 });
                    }, Row);
                    this.observeComponentCreation2((o101, p101) => {
                        ForEach.create();
                        const q101 = (r101, s101: number) => {
                            const t101 = r101;
                            this.observeComponentCreation2((u101, v101) => {
                                If.create();
                                if (canShowMethod(t101.method, this.isCaptcha) && s101 < 5) {
                                    this.ifElseBranchUpdateFunction(0, () => {
                                        this.observeComponentCreation2((m102, n102) => {
                                            Stack.create({ alignContent: Alignment.Top });
                                            Stack.width(70);
                                        }, Stack);
                                        this.observeComponentCreation2((i102, j102) => {
                                            Column.create({ space: 5 });
                                            Column.id("other_btn");
                                            Column.onClick((k102) => {
                                                this.onAction(UserAction.Click, { method: t101.method });
                                                if (t101.method == LoginMethod.UserName || t101.method == LoginMethod.CaptchaCode) {
                                                    this.isCaptcha = !this.isCaptcha;
                                                    this.switchText = this.isCaptcha ? "密码登录" : "验证码登录";
                                                    this.password = '';
                                                    this.captcha = '';
                                                    this.showPasswordIcon = false;
                                                    this.play();
                                                }
                                                else {
                                                    if (this.privacyEnable && !this.isPrivacyAgreed) {
                                                        this.showPrivacyAgreeDialog((l102) => {
                                                            this.isPrivacyAgreed = true;
                                                            this.clickLogin(t101);
                                                        });
                                                    }
                                                    else {
                                                        this.clickLogin(t101);
                                                    }
                                                }
                                            });
                                            Column.margin({ top: 10 });
                                        }, Column);
                                        this.observeComponentCreation2((g102, h102) => {
                                            Image.create({ "id": -1, "type": -1, params: [`app.media.rx_ico_${t101.method}`], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                                            Image.width(34);
                                            Image.height(34);
                                        }, Image);
                                        this.observeComponentCreation2((e102, f102) => {
                                            Text.create({ "id": -1, "type": -1, params: [`app.string.method_${t101.method}`], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                                            Text.fontSize(14);
                                        }, Text);
                                        Text.pop();
                                        Column.pop();
                                        this.observeComponentCreation2((w101, x101) => {
                                            If.create();
                                            if (this.lastMethod == t101.method) {
                                                this.ifElseBranchUpdateFunction(0, () => {
                                                    this.observeComponentCreation2((c102, d102) => {
                                                        Stack.create();
                                                        Stack.margin({ top: 0 });
                                                        Stack.translate({ y: this.offsetY });
                                                        Stack.onAppear(() => {
                                                            Context.animateTo({
                                                                duration: 400,
                                                                iterations: -1,
                                                                playMode: PlayMode.Alternate,
                                                            }, () => {
                                                                this.play();
                                                            });
                                                        });
                                                        Stack.onDisAppear(() => {
                                                            this.offsetY = 0;
                                                        });
                                                    }, Stack);
                                                    this.observeComponentCreation2((a102, b102) => {
                                                        Image.create({ "id": -1, "type": 20000, params: ['app.media.rx_login_last'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                                                        Image.width(45);
                                                    }, Image);
                                                    this.observeComponentCreation2((y101, z101) => {
                                                        Text.create("最近使用");
                                                        Text.fontSize(9);
                                                        Text.fontColor("#C18C00");
                                                        Text.margin({ bottom: 1 });
                                                    }, Text);
                                                    Text.pop();
                                                    Stack.pop();
                                                });
                                            }
                                            else {
                                                this.ifElseBranchUpdateFunction(1, () => {
                                                });
                                            }
                                        }, If);
                                        If.pop();
                                        Stack.pop();
                                    });
                                }
                                else {
                                    this.ifElseBranchUpdateFunction(1, () => {
                                    });
                                }
                            }, If);
                            If.pop();
                        };
                        this.forEachUpdateFunction(o101, this.loginMethods, q101, undefined, true, false);
                    }, ForEach);
                    ForEach.pop();
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((m101, n101) => {
                        Blank.create();
                        Blank.margin({ bottom: 5 });
                    }, Blank);
                    Blank.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
        Column.pop();
    }
    isShowOtherLogin(i101?: Array<LoginConfig>): boolean {
        if (!i101 || i101.length === 0) {
            return false;
        }
        if (i101.length !== 1) {
            return true;
        }
        return !['username', 'captchacode'].includes(i101[0].method);
    }
    rerender() {
        this.updateDirtyElements();
    }
}
function isCaptchaAccount(h101: Account): boolean {
    return h101.method == "phone" || h101.method == LoginMethod.CaptchaCode;
}
function canShowMethod(f101: string, g101: boolean): boolean {
    switch (f101) {
        case LoginMethod.CaptchaCode:
            return !g101;
        case LoginMethod.UserName:
            return g101;
        default:
            return true;
    }
}
function isLoginButtonClickable(d101: string, e101: string): boolean {
    return d101 !== '' && e101 !== '';
}
