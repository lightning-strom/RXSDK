// @keepTs
// @ts-nocheck
import { __MODULE_NAME__, __BUNDLE_NAME__ } from "@normalized:N&&&hmssdk/build/default/generated/profile/default/ModuleInfo&4.0.0";
if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ChangePasswordComponent_Params {
    isFirstSet?: boolean;
    title?: ResourceStr;
    oldPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
    onCommitClick?: (password: string, oldPassword?: string) => void;
    onCloseClick?: (event?: ClickEvent) => void;
    controller?: CustomDialogController;
}
import { HeaderComponent } from "@normalized:N&&&hmssdk/src/main/ets/pages/HeaderComponent&4.0.0";
import promptAction from "@ohos:promptAction";
export class ChangePasswordComponent extends ViewPU {
    constructor(a75, b75, c75, d75 = -1, e75 = undefined, f75) {
        super(a75, c75, d75, f75);
        if (typeof e75 === "function") {
            this.paramsGenerator_ = e75;
        }
        this.__isFirstSet = new ObservedPropertySimplePU(false, this, "isFirstSet");
        this.__title = new ObservedPropertyObjectPU('', this, "title");
        this.__oldPassword = new ObservedPropertySimplePU('', this, "oldPassword");
        this.__newPassword = new ObservedPropertySimplePU('', this, "newPassword");
        this.__confirmPassword = new ObservedPropertySimplePU('', this, "confirmPassword");
        this.onCommitClick = undefined;
        this.onCloseClick = undefined;
        this.controller = undefined;
        this.setInitiallyProvidedValue(b75);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(z74: ChangePasswordComponent_Params) {
        if (z74.isFirstSet !== undefined) {
            this.isFirstSet = z74.isFirstSet;
        }
        if (z74.title !== undefined) {
            this.title = z74.title;
        }
        if (z74.oldPassword !== undefined) {
            this.oldPassword = z74.oldPassword;
        }
        if (z74.newPassword !== undefined) {
            this.newPassword = z74.newPassword;
        }
        if (z74.confirmPassword !== undefined) {
            this.confirmPassword = z74.confirmPassword;
        }
        if (z74.onCommitClick !== undefined) {
            this.onCommitClick = z74.onCommitClick;
        }
        if (z74.onCloseClick !== undefined) {
            this.onCloseClick = z74.onCloseClick;
        }
        if (z74.controller !== undefined) {
            this.controller = z74.controller;
        }
    }
    updateStateVars(y74: ChangePasswordComponent_Params) {
    }
    purgeVariableDependenciesOnElmtId(x74) {
        this.__isFirstSet.purgeDependencyOnElmtId(x74);
        this.__title.purgeDependencyOnElmtId(x74);
        this.__oldPassword.purgeDependencyOnElmtId(x74);
        this.__newPassword.purgeDependencyOnElmtId(x74);
        this.__confirmPassword.purgeDependencyOnElmtId(x74);
    }
    aboutToBeDeleted() {
        this.__isFirstSet.aboutToBeDeleted();
        this.__title.aboutToBeDeleted();
        this.__oldPassword.aboutToBeDeleted();
        this.__newPassword.aboutToBeDeleted();
        this.__confirmPassword.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __isFirstSet: ObservedPropertySimplePU<boolean>;
    get isFirstSet() {
        return this.__isFirstSet.get();
    }
    set isFirstSet(w74: boolean) {
        this.__isFirstSet.set(w74);
    }
    private __title: ObservedPropertyObjectPU<ResourceStr>;
    get title() {
        return this.__title.get();
    }
    set title(v74: ResourceStr) {
        this.__title.set(v74);
    }
    private __oldPassword?: ObservedPropertySimplePU<string>;
    get oldPassword() {
        return this.__oldPassword.get();
    }
    set oldPassword(u74: string) {
        this.__oldPassword.set(u74);
    }
    private __newPassword: ObservedPropertySimplePU<string>;
    get newPassword() {
        return this.__newPassword.get();
    }
    set newPassword(t74: string) {
        this.__newPassword.set(t74);
    }
    private __confirmPassword: ObservedPropertySimplePU<string>;
    get confirmPassword() {
        return this.__confirmPassword.get();
    }
    set confirmPassword(s74: string) {
        this.__confirmPassword.set(s74);
    }
    private onCommitClick?: (password: string, oldPassword?: string) => void;
    private onCloseClick?: (event?: ClickEvent) => void;
    private controller: CustomDialogController;
    setController(r74: CustomDialogController) {
        this.controller = r74;
    }
    close(q74?: ClickEvent) {
        this?.onCloseClick?.(q74);
        this?.controller?.close();
    }
    initialRender() {
        this.observeComponentCreation2((o74, p74) => {
            Column.create();
            Column.constraintSize({ maxWidth: { "id": -1, "type": 10002, params: ['app.float.dialog_width'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ } });
            Column.margin({ left: 20, right: 20 });
            Column.backgroundColor(Color.White);
            Column.borderRadius(6);
        }, Column);
        {
            this.observeComponentCreation2((k74, l74) => {
                if (l74) {
                    let m74 = new HeaderComponent(this, {
                        title: this.isFirstSet ? "设置密码" : "修改密码", onClose: () => {
                            this.close();
                        }
                    }, undefined, k74, () => { }, { page: "HmsSdk/src/main/ets/pages/ChangePasswordComponent.ets", line: 40, col: 7 });
                    ViewPU.create(m74);
                    let n74 = () => {
                        return {
                            title: this.isFirstSet ? "设置密码" : "修改密码",
                            onClose: () => {
                                this.close();
                            }
                        };
                    };
                    m74.paramsGenerator_ = n74;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(k74, {
                        title: this.isFirstSet ? "设置密码" : "修改密码"
                    });
                }
            }, { name: "HeaderComponent" });
        }
        this.observeComponentCreation2((i74, j74) => {
            Column.create();
            Column.alignItems(HorizontalAlign.Start);
            Column.padding({ left: 20, right: 20 });
        }, Column);
        this.Body.bind(this)();
        Column.pop();
        Column.pop();
    }
    Body(o73 = null) {
        this.observeComponentCreation2((g74, h74) => {
            Scroll.create();
        }, Scroll);
        this.observeComponentCreation2((e74, f74) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((z73, a74) => {
            If.create();
            if (!this.isFirstSet) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((b74, c74) => {
                        TextInput.create({ placeholder: "输入旧密码" });
                        TextInput.height({ "id": -1, "type": 10002, params: ['app.float.edit_height'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                        TextInput.placeholderColor({ "id": -1, "type": 10001, params: ['app.color.col_a5caca'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                        TextInput.placeholderFont({ size: { "id": -1, "type": 10002, params: ['app.float.edit_font_size'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ } });
                        TextInput.backgroundColor('#00FFFFFF');
                        TextInput.fontSize({ "id": -1, "type": 10002, params: ['app.float.edit_font_size'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                        TextInput.type(InputType.Password);
                        TextInput.showPasswordIcon(!!this.oldPassword);
                        TextInput.passwordIcon({ onIconSrc: { "id": -1, "type": 20000, params: ['app.media.rx_pwd_eye_open'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ }, offIconSrc: { "id": -1, "type": 20000, params: ['app.media.rx_pwd_eye_close'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ } });
                        TextInput.border({
                            width: 1,
                            color: { "id": -1, "type": 10001, params: ['app.color.col_e2f2f1'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ },
                            radius: 4
                        });
                        TextInput.onChange((d74: string) => {
                            this.oldPassword = d74;
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
        this.observeComponentCreation2((w73, x73) => {
            TextInput.create({ placeholder: "请输入密码" });
            TextInput.height({ "id": -1, "type": 10002, params: ['app.float.edit_height'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            TextInput.placeholderColor({ "id": -1, "type": 10001, params: ['app.color.col_a5caca'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            TextInput.backgroundColor('#00FFFFFF');
            TextInput.placeholderFont({ size: { "id": -1, "type": 10002, params: ['app.float.edit_font_size'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ } });
            TextInput.fontSize({ "id": -1, "type": 10002, params: ['app.float.edit_font_size'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            TextInput.type(InputType.NEW_PASSWORD);
            TextInput.showPasswordIcon(!!this.newPassword);
            TextInput.passwordIcon({ onIconSrc: { "id": -1, "type": 20000, params: ['app.media.rx_pwd_eye_open'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ }, offIconSrc: { "id": -1, "type": 20000, params: ['app.media.rx_pwd_eye_close'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ } });
            TextInput.margin({ top: 12 });
            TextInput.border({
                width: 1,
                color: { "id": -1, "type": 10001, params: ['app.color.col_e2f2f1'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ },
                radius: 4
            });
            TextInput.onChange((y73: string) => {
                this.newPassword = y73;
            });
        }, TextInput);
        this.observeComponentCreation2((t73, u73) => {
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
            TextInput.onChange((v73: string) => {
                this.confirmPassword = v73;
            });
        }, TextInput);
        Column.pop();
        Scroll.pop();
        this.observeComponentCreation2((r73, s73) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((p73, q73) => {
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
                if (this.newPassword === this.confirmPassword) {
                    if (!this.isFirstSet && this.oldPassword == this.newPassword) {
                        promptAction.showToast({ message: "新旧密码不能相同，请重新输入" });
                    }
                    else {
                        this.onCommitClick?.(this.newPassword, this.oldPassword);
                    }
                }
                else {
                    promptAction.showToast({ message: "两次密码不一致，请重新输入" });
                }
            });
        }, Button);
        Button.pop();
        Row.pop();
    }
    isButtonClickable(): boolean {
        return (this.isFirstSet || this.oldPassword !== '') && this.newPassword !== '' && this.confirmPassword !== '';
    }
    rerender() {
        this.updateDirtyElements();
    }
}
