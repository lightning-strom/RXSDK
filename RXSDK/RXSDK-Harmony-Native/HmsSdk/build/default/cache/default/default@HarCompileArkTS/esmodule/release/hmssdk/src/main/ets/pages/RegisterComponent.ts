// @keepTs
// @ts-nocheck
import { __MODULE_NAME__, __BUNDLE_NAME__ } from "@normalized:N&&&hmssdk/build/default/generated/profile/default/ModuleInfo&4.0.0";
if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface RegisterComponent_Params {
    title?: ResourceStr;
    userName?: string;
    password?: string;
    confirmPassword?: string;
    needConfirm?: boolean;
    onCommitClick?: (userName: string, password?: string) => void;
    onCloseClick?: (event?: ClickEvent) => void;
}
import { HeaderComponent } from "@normalized:N&&&hmssdk/src/main/ets/pages/HeaderComponent&4.0.0";
import promptAction from "@ohos:promptAction";
export class RegisterComponent extends ViewPU {
    constructor(y131, z131, a132, b132 = -1, c132 = undefined, d132) {
        super(y131, a132, b132, d132);
        if (typeof c132 === "function") {
            this.paramsGenerator_ = c132;
        }
        this.__title = new ObservedPropertyObjectPU('', this, "title");
        this.__userName = new ObservedPropertySimplePU('', this, "userName");
        this.__password = new ObservedPropertySimplePU('', this, "password");
        this.__confirmPassword = new ObservedPropertySimplePU('', this, "confirmPassword");
        this.__needConfirm = new ObservedPropertySimplePU(false, this, "needConfirm");
        this.onCommitClick = undefined;
        this.onCloseClick = undefined;
        this.setInitiallyProvidedValue(z131);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(x131: RegisterComponent_Params) {
        if (x131.title !== undefined) {
            this.title = x131.title;
        }
        if (x131.userName !== undefined) {
            this.userName = x131.userName;
        }
        if (x131.password !== undefined) {
            this.password = x131.password;
        }
        if (x131.confirmPassword !== undefined) {
            this.confirmPassword = x131.confirmPassword;
        }
        if (x131.needConfirm !== undefined) {
            this.needConfirm = x131.needConfirm;
        }
        if (x131.onCommitClick !== undefined) {
            this.onCommitClick = x131.onCommitClick;
        }
        if (x131.onCloseClick !== undefined) {
            this.onCloseClick = x131.onCloseClick;
        }
    }
    updateStateVars(w131: RegisterComponent_Params) {
    }
    purgeVariableDependenciesOnElmtId(v131) {
        this.__title.purgeDependencyOnElmtId(v131);
        this.__userName.purgeDependencyOnElmtId(v131);
        this.__password.purgeDependencyOnElmtId(v131);
        this.__confirmPassword.purgeDependencyOnElmtId(v131);
        this.__needConfirm.purgeDependencyOnElmtId(v131);
    }
    aboutToBeDeleted() {
        this.__title.aboutToBeDeleted();
        this.__userName.aboutToBeDeleted();
        this.__password.aboutToBeDeleted();
        this.__confirmPassword.aboutToBeDeleted();
        this.__needConfirm.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __title: ObservedPropertyObjectPU<ResourceStr>;
    get title() {
        return this.__title.get();
    }
    set title(u131: ResourceStr) {
        this.__title.set(u131);
    }
    private __userName: ObservedPropertySimplePU<string>;
    get userName() {
        return this.__userName.get();
    }
    set userName(t131: string) {
        this.__userName.set(t131);
    }
    private __password: ObservedPropertySimplePU<string>;
    get password() {
        return this.__password.get();
    }
    set password(s131: string) {
        this.__password.set(s131);
    }
    private __confirmPassword?: ObservedPropertySimplePU<string>;
    get confirmPassword() {
        return this.__confirmPassword.get();
    }
    set confirmPassword(r131: string) {
        this.__confirmPassword.set(r131);
    }
    private __needConfirm: ObservedPropertySimplePU<boolean>;
    get needConfirm() {
        return this.__needConfirm.get();
    }
    set needConfirm(q131: boolean) {
        this.__needConfirm.set(q131);
    }
    private onCommitClick?: (userName: string, password?: string) => void;
    private onCloseClick?: (event?: ClickEvent) => void;
    close(p131?: ClickEvent) {
        this?.onCloseClick?.(p131);
    }
    initialRender() {
        this.observeComponentCreation2((n131, o131) => {
            Column.create();
            Column.constraintSize({ maxWidth: { "id": -1, "type": 10002, params: ['app.float.dialog_width'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ } });
            Column.margin({ left: 20, right: 20 });
            Column.backgroundColor(Color.White);
            Column.borderRadius(6);
        }, Column);
        {
            this.observeComponentCreation2((j131, k131) => {
                if (k131) {
                    let l131 = new HeaderComponent(this, {
                        title: this.title || "注册账号", onClose: () => {
                            this.close();
                        }
                    }, undefined, j131, () => { }, { page: "HmsSdk/src/main/ets/pages/RegisterComponent.ets", line: 41, col: 7 });
                    ViewPU.create(l131);
                    let m131 = () => {
                        return {
                            title: this.title || "注册账号",
                            onClose: () => {
                                this.close();
                            }
                        };
                    };
                    l131.paramsGenerator_ = m131;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(j131, {
                        title: this.title || "注册账号"
                    });
                }
            }, { name: "HeaderComponent" });
        }
        this.observeComponentCreation2((h131, i131) => {
            Column.create();
            Column.alignItems(HorizontalAlign.Start);
            Column.padding({ left: 20, right: 20 });
        }, Column);
        this.Body.bind(this)();
        Column.pop();
        Column.pop();
    }
    Body(n130 = null) {
        this.observeComponentCreation2((f131, g131) => {
            Scroll.create();
        }, Scroll);
        this.observeComponentCreation2((d131, e131) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((a131, b131) => {
            TextInput.create({ placeholder: "请输入账号" });
            TextInput.height({ "id": -1, "type": 10002, params: ['app.float.edit_height'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            TextInput.placeholderColor({ "id": -1, "type": 10001, params: ['app.color.col_a5caca'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            TextInput.placeholderFont({ size: { "id": -1, "type": 10002, params: ['app.float.edit_font_size'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ } });
            TextInput.backgroundColor('#00FFFFFF');
            TextInput.fontSize({ "id": -1, "type": 10002, params: ['app.float.edit_font_size'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            TextInput.type(InputType.USER_NAME);
            TextInput.showPasswordIcon(!!this.userName);
            TextInput.passwordIcon({ onIconSrc: { "id": -1, "type": 20000, params: ['app.media.rx_pwd_eye_open'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ }, offIconSrc: { "id": -1, "type": 20000, params: ['app.media.rx_pwd_eye_close'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ } });
            TextInput.border({
                width: 1,
                color: { "id": -1, "type": 10001, params: ['app.color.col_e2f2f1'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ },
                radius: 4
            });
            TextInput.onChange((c131: string) => {
                this.userName = c131;
            });
        }, TextInput);
        this.observeComponentCreation2((x130, y130) => {
            TextInput.create({ placeholder: "请输入密码" });
            TextInput.height({ "id": -1, "type": 10002, params: ['app.float.edit_height'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            TextInput.placeholderColor({ "id": -1, "type": 10001, params: ['app.color.col_a5caca'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            TextInput.backgroundColor('#00FFFFFF');
            TextInput.placeholderFont({ size: { "id": -1, "type": 10002, params: ['app.float.edit_font_size'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ } });
            TextInput.fontSize({ "id": -1, "type": 10002, params: ['app.float.edit_font_size'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            TextInput.type(InputType.NEW_PASSWORD);
            TextInput.showPasswordIcon(!!this.password);
            TextInput.passwordIcon({ onIconSrc: { "id": -1, "type": 20000, params: ['app.media.rx_pwd_eye_open'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ }, offIconSrc: { "id": -1, "type": 20000, params: ['app.media.rx_pwd_eye_close'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ } });
            TextInput.margin({ top: 12 });
            TextInput.border({
                width: 1,
                color: { "id": -1, "type": 10001, params: ['app.color.col_e2f2f1'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ },
                radius: 4
            });
            TextInput.onChange((z130: string) => {
                this.password = z130;
            });
        }, TextInput);
        this.observeComponentCreation2((s130, t130) => {
            If.create();
            if (this.needConfirm) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((u130, v130) => {
                        TextInput.create({ placeholder: "请再次输入您的密码" });
                        TextInput.height({ "id": -1, "type": 10002, params: ['app.float.edit_height'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                        TextInput.placeholderColor({ "id": -1, "type": 10001, params: ['app.color.col_a5caca'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                        TextInput.backgroundColor('#00FFFFFF');
                        TextInput.placeholderFont({ size: { "id": -1, "type": 10002, params: ['app.float.edit_font_size'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ } });
                        TextInput.fontSize({ "id": -1, "type": 10002, params: ['app.float.edit_font_size'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                        TextInput.type(InputType.NEW_PASSWORD);
                        TextInput.showPasswordIcon(!!this.confirmPassword);
                        TextInput.passwordIcon({ onIconSrc: { "id": -1, "type": 20000, params: ['app.media.rx_pwd_eye_open'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ }, offIconSrc: { "id": -1, "type": 20000, params: ['app.media.rx_pwd_eye_close'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ } });
                        TextInput.margin({ top: 12 });
                        TextInput.border({
                            width: 1,
                            color: { "id": -1, "type": 10001, params: ['app.color.col_e2f2f1'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ },
                            radius: 4
                        });
                        TextInput.onChange((w130: string) => {
                            this.confirmPassword = w130;
                        });
                    }, TextInput);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
        Scroll.pop();
        this.observeComponentCreation2((q130, r130) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((o130, p130) => {
            Button.createWithLabel('确认', { type: ButtonType.Normal, stateEffect: true });
            Button.layoutWeight(1);
            Button.height({ "id": -1, "type": 10002, params: ['app.float.button_height'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Button.borderRadius(4);
            Button.fontSize({ "id": -1, "type": 10002, params: ['app.float.button_font_size'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Button.margin({ top: 22, bottom: 22 });
            Button.fontWeight(500);
            Button.enabled(this.isButtonClickable());
            Button.fontColor(Color.White);
            Button.backgroundColor(this.isButtonClickable() ? { "id": -1, "type": 10001, params: ['app.color.col_20c0b3'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ } : { "id": -1, "type": 10001, params: ['app.color.col_b3e6e2'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Button.onClick(() => {
                if (this.needConfirm && this.password !== this.confirmPassword) {
                    promptAction.showToast({ message: "两次密码不一致，请重新输入" });
                }
                else {
                    this.onCommitClick?.(this.userName, this.password);
                }
            });
        }, Button);
        Button.pop();
        Row.pop();
    }
    isButtonClickable(): boolean {
        return (this.userName !== '') && this.password !== '';
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "RegisterComponent";
    }
}
registerNamedRoute(() => new RegisterComponent(undefined, {}), "", { bundleName: __BUNDLE_NAME__, moduleName: __MODULE_NAME__, pagePath: "HmsSdk/src/main/ets/pages/RegisterComponent", pageFullPath: "", integratedHsp: "__harDefaultIntegratedHspType__", moduleType: "byteCodeHar" });
