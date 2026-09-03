// @keepTs
// @ts-nocheck
import { __MODULE_NAME__, __BUNDLE_NAME__ } from "@normalized:N&&&hmssdk/build/default/generated/profile/default/ModuleInfo&4.0.0";
if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface RealNameComponent_Params {
    title?: ResourceStr;
    description?: ResourceStr;
    realName?: string;
    idCard?: string;
    isFastAuth?: boolean;
    closeVisible?: boolean;
    useAlipayAuth?: boolean;
    showManualForm?: boolean;
    onCommitClick?: (realName: string, idCard: string, isFastAuth: boolean) => void;
    onAlipayAuthClick?: () => void;
    onCloseClick?: (event?: ClickEvent) => void;
    controller?: CustomDialogController;
    curKeyboardType?: EKeyboardType;
    items?: IKeyAttribute[];
    inputController?: TextInputController;
    props?: Reward[];
}
import { UserAction, UserScene } from "@normalized:N&&&hmssdk/src/main/ets/base/UserActionEnum&4.0.0";
import UserActionTracer from "@normalized:N&&&hmssdk/src/main/ets/base/UserActionTracer&4.0.0";
import { IdCardKeyboard, rxCardKeyCfg } from "@normalized:N&&&hmssdk/src/main/ets/components/IdCardKeyboard&4.0.0";
import { EKeyboardType, EKeyType, idCardKeyData } from "@normalized:N&&&hmssdk/src/main/ets/components/KeyboardDefine&4.0.0";
import type { IKeyAttribute } from "@normalized:N&&&hmssdk/src/main/ets/components/KeyboardDefine&4.0.0";
import SDKConfig from "@normalized:N&&&hmssdk/src/main/ets/sdk/SDKConfig&4.0.0";
import type { Obj, Reward } from '../types/Index';
import { HeaderComponent } from "@normalized:N&&&hmssdk/src/main/ets/pages/HeaderComponent&4.0.0";
export class RealNameComponent extends ViewPU {
    constructor(p128, q128, r128, s128 = -1, t128 = undefined, u128) {
        super(p128, r128, s128, u128);
        if (typeof t128 === "function") {
            this.paramsGenerator_ = t128;
        }
        this.__title = new ObservedPropertyObjectPU("实名认证", this, "title");
        this.__description = new ObservedPropertyObjectPU("根据国家最新法规规定，未实名认证的用户不能体验任何游戏内容，请尽快完成实名。", this, "description");
        this.__realName = new ObservedPropertySimplePU('', this, "realName");
        this.__idCard = new ObservedPropertySimplePU('', this, "idCard");
        this.__isFastAuth = new ObservedPropertySimplePU(true, this, "isFastAuth");
        this.__closeVisible = new ObservedPropertySimplePU(false, this, "closeVisible");
        this.__useAlipayAuth = new ObservedPropertySimplePU(true, this, "useAlipayAuth");
        this.__showManualForm = new ObservedPropertySimplePU(false, this, "showManualForm");
        this.onCommitClick = undefined;
        this.onAlipayAuthClick = undefined;
        this.onCloseClick = undefined;
        this.controller = undefined;
        this.__curKeyboardType = new ObservedPropertySimplePU(EKeyboardType.NUMERIC, this, "curKeyboardType");
        this.__items = new ObservedPropertyObjectPU(idCardKeyData, this, "items");
        this.inputController = new TextInputController();
        this.__props = new ObservedPropertyObjectPU([], this, "props");
        this.setInitiallyProvidedValue(q128);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(o128: RealNameComponent_Params) {
        if (o128.title !== undefined) {
            this.title = o128.title;
        }
        if (o128.description !== undefined) {
            this.description = o128.description;
        }
        if (o128.realName !== undefined) {
            this.realName = o128.realName;
        }
        if (o128.idCard !== undefined) {
            this.idCard = o128.idCard;
        }
        if (o128.isFastAuth !== undefined) {
            this.isFastAuth = o128.isFastAuth;
        }
        if (o128.closeVisible !== undefined) {
            this.closeVisible = o128.closeVisible;
        }
        if (o128.useAlipayAuth !== undefined) {
            this.useAlipayAuth = o128.useAlipayAuth;
        }
        if (o128.showManualForm !== undefined) {
            this.showManualForm = o128.showManualForm;
        }
        if (o128.onCommitClick !== undefined) {
            this.onCommitClick = o128.onCommitClick;
        }
        if (o128.onAlipayAuthClick !== undefined) {
            this.onAlipayAuthClick = o128.onAlipayAuthClick;
        }
        if (o128.onCloseClick !== undefined) {
            this.onCloseClick = o128.onCloseClick;
        }
        if (o128.controller !== undefined) {
            this.controller = o128.controller;
        }
        if (o128.curKeyboardType !== undefined) {
            this.curKeyboardType = o128.curKeyboardType;
        }
        if (o128.items !== undefined) {
            this.items = o128.items;
        }
        if (o128.inputController !== undefined) {
            this.inputController = o128.inputController;
        }
        if (o128.props !== undefined) {
            this.props = o128.props;
        }
    }
    updateStateVars(n128: RealNameComponent_Params) {
    }
    purgeVariableDependenciesOnElmtId(m128) {
        this.__title.purgeDependencyOnElmtId(m128);
        this.__description.purgeDependencyOnElmtId(m128);
        this.__realName.purgeDependencyOnElmtId(m128);
        this.__idCard.purgeDependencyOnElmtId(m128);
        this.__isFastAuth.purgeDependencyOnElmtId(m128);
        this.__closeVisible.purgeDependencyOnElmtId(m128);
        this.__useAlipayAuth.purgeDependencyOnElmtId(m128);
        this.__showManualForm.purgeDependencyOnElmtId(m128);
        this.__curKeyboardType.purgeDependencyOnElmtId(m128);
        this.__items.purgeDependencyOnElmtId(m128);
        this.__props.purgeDependencyOnElmtId(m128);
    }
    aboutToBeDeleted() {
        this.__title.aboutToBeDeleted();
        this.__description.aboutToBeDeleted();
        this.__realName.aboutToBeDeleted();
        this.__idCard.aboutToBeDeleted();
        this.__isFastAuth.aboutToBeDeleted();
        this.__closeVisible.aboutToBeDeleted();
        this.__useAlipayAuth.aboutToBeDeleted();
        this.__showManualForm.aboutToBeDeleted();
        this.__curKeyboardType.aboutToBeDeleted();
        this.__items.aboutToBeDeleted();
        this.__props.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __title: ObservedPropertyObjectPU<ResourceStr>;
    get title() {
        return this.__title.get();
    }
    set title(l128: ResourceStr) {
        this.__title.set(l128);
    }
    private __description: ObservedPropertyObjectPU<ResourceStr>;
    get description() {
        return this.__description.get();
    }
    set description(k128: ResourceStr) {
        this.__description.set(k128);
    }
    private __realName: ObservedPropertySimplePU<string>;
    get realName() {
        return this.__realName.get();
    }
    set realName(j128: string) {
        this.__realName.set(j128);
    }
    private __idCard: ObservedPropertySimplePU<string>;
    get idCard() {
        return this.__idCard.get();
    }
    set idCard(i128: string) {
        this.__idCard.set(i128);
    }
    private __isFastAuth: ObservedPropertySimplePU<boolean>;
    get isFastAuth() {
        return this.__isFastAuth.get();
    }
    set isFastAuth(h128: boolean) {
        this.__isFastAuth.set(h128);
    }
    private __closeVisible: ObservedPropertySimplePU<boolean>;
    get closeVisible() {
        return this.__closeVisible.get();
    }
    set closeVisible(g128: boolean) {
        this.__closeVisible.set(g128);
    }
    private __useAlipayAuth: ObservedPropertySimplePU<boolean>;
    get useAlipayAuth() {
        return this.__useAlipayAuth.get();
    }
    set useAlipayAuth(f128: boolean) {
        this.__useAlipayAuth.set(f128);
    }
    private __showManualForm: ObservedPropertySimplePU<boolean>;
    get showManualForm() {
        return this.__showManualForm.get();
    }
    set showManualForm(e128: boolean) {
        this.__showManualForm.set(e128);
    }
    private onCommitClick?: (realName: string, idCard: string, isFastAuth: boolean) => void;
    private onAlipayAuthClick?: () => void;
    private onCloseClick?: (event?: ClickEvent) => void;
    private controller: CustomDialogController;
    setController(d128: CustomDialogController) {
        this.controller = d128;
    }
    private __curKeyboardType: ObservedPropertySimplePU<EKeyboardType>;
    get curKeyboardType() {
        return this.__curKeyboardType.get();
    }
    set curKeyboardType(c128: EKeyboardType) {
        this.__curKeyboardType.set(c128);
    }
    private __items: ObservedPropertyObjectPU<IKeyAttribute[]>;
    get items() {
        return this.__items.get();
    }
    set items(b128: IKeyAttribute[]) {
        this.__items.set(b128);
    }
    private inputController: TextInputController;
    private __props?: ObservedPropertyObjectPU<Reward[]>;
    get props() {
        return this.__props.get();
    }
    set props(a128: Reward[]) {
        this.__props.set(a128);
    }
    aboutToAppear() {
        this.showManualForm = !this.useAlipayAuth;
        this.onAction(UserAction.Show);
    }
    close(z127?: ClickEvent) {
        this?.onCloseClick?.(z127);
        this?.controller?.close();
        this.onAction(UserAction.Close);
    }
    onAction(x127: string, y127?: Obj) {
        UserActionTracer.traceAction(UserScene.RealAuth, x127, y127);
    }
    initialRender() {
        this.observeComponentCreation2((v127, w127) => {
            Scroll.create();
            Scroll.scrollBar(BarState.Off);
            Scroll.onClick(() => {
                this.inputController?.stopEditing();
            });
            Scroll.height("100%");
            Scroll.width("100%");
        }, Scroll);
        this.observeComponentCreation2((t127, u127) => {
            Column.create();
            Column.constraintSize({ maxWidth: { "id": -1, "type": 10002, params: ['app.float.dialog_width'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ } });
            Column.margin({ left: 20, right: 20 });
            Column.backgroundColor(Color.White);
            Column.borderRadius(6);
        }, Column);
        {
            this.observeComponentCreation2((p127, q127) => {
                if (q127) {
                    let r127 = new HeaderComponent(this, {
                        title: this.title, onClose: () => {
                            this.close();
                        },
                        onBack: () => {
                            this.inputController?.stopEditing();
                            this.showManualForm = false;
                        },
                        backVisible: this.useAlipayAuth && this.showManualForm,
                        closeVisible: this.closeVisible
                    }, undefined, p127, () => { }, { page: "HmsSdk/src/main/ets/pages/RealNameComponent.ets", line: 73, col: 9 });
                    ViewPU.create(r127);
                    let s127 = () => {
                        return {
                            title: this.title,
                            onClose: () => {
                                this.close();
                            },
                            onBack: () => {
                                this.inputController?.stopEditing();
                                this.showManualForm = false;
                            },
                            backVisible: this.useAlipayAuth && this.showManualForm,
                            closeVisible: this.closeVisible
                        };
                    };
                    r127.paramsGenerator_ = s127;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(p127, {
                        title: this.title,
                        backVisible: this.useAlipayAuth && this.showManualForm,
                        closeVisible: this.closeVisible
                    });
                }
            }, { name: "HeaderComponent" });
        }
        this.observeComponentCreation2((n127, o127) => {
            Column.create();
            Column.alignItems(HorizontalAlign.Start);
            Column.padding({ left: 20, right: 20 });
        }, Column);
        this.Body.bind(this)();
        Column.pop();
        Column.pop();
        Scroll.pop();
    }
    idCardboardBuilder(g127 = null) {
        {
            this.observeComponentCreation2((h127, i127) => {
                if (i127) {
                    let j127 = new IdCardKeyboard(this, {
                        inputValue: this.idCard?.includes('*') ? '' : this.idCard,
                        placeholder: "请输入...",
                        theme: rxCardKeyCfg,
                        onKeyboardEvent: (m127: IKeyAttribute) => {
                            switch (m127.type) {
                                case EKeyType.COMPLETE:
                                    if (this.isFastAuth && !m127.value) {
                                        return;
                                    }
                                    else {
                                        this.idCard = m127.value ?? '';
                                        if (!this.idCard?.includes('*')) {
                                            this.isFastAuth = false;
                                        }
                                        console.log("rxsdk:  =====" + this.idCard);
                                    }
                                    break;
                            }
                        },
                        controller: this.inputController
                    }, undefined, h127, () => { }, { page: "HmsSdk/src/main/ets/pages/RealNameComponent.ets", line: 108, col: 5 });
                    ViewPU.create(j127);
                    let k127 = () => {
                        return {
                            inputValue: this.idCard?.includes('*') ? '' : this.idCard,
                            placeholder: "请输入...",
                            theme: rxCardKeyCfg,
                            onKeyboardEvent: (l127: IKeyAttribute) => {
                                switch (l127.type) {
                                    case EKeyType.COMPLETE:
                                        if (this.isFastAuth && !l127.value) {
                                            return;
                                        }
                                        else {
                                            this.idCard = l127.value ?? '';
                                            if (!this.idCard?.includes('*')) {
                                                this.isFastAuth = false;
                                            }
                                            console.log("rxsdk:  =====" + this.idCard);
                                        }
                                        break;
                                }
                            },
                            controller: this.inputController
                        };
                    };
                    j127.paramsGenerator_ = k127;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(h127, {});
                }
            }, { name: "IdCardKeyboard" });
        }
    }
    Body(d127 = null) {
        this.observeComponentCreation2((e127, f127) => {
            If.create();
            if (this.showManualForm) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.ManualAuthBody.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.AlipayAuthBody.bind(this)();
                });
            }
        }, If);
        If.pop();
    }
    AlipayAuthBody(o126 = null) {
        this.observeComponentCreation2((b127, c127) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((z126, a127) => {
            Text.create(this.description);
            Text.fontSize(13);
            Text.margin({ top: 4, bottom: 10 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((x126, y126) => {
            Row.create();
            Row.height({ "id": -1, "type": 10002, params: ['app.float.button_height'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Row.width('100%');
            Row.borderRadius(4);
            Row.justifyContent(FlexAlign.Center);
            Row.alignItems(VerticalAlign.Center);
            Row.padding({ left: 20, right: 20 });
            Row.backgroundColor('#3876F5');
            Row.margin({ top: 10 });
            Row.onClick(() => {
                this.onAction(UserAction.Confirm);
                this.onAlipayAuthClick?.();
            });
        }, Row);
        this.observeComponentCreation2((v126, w126) => {
            Image.create({ "id": -1, "type": 20000, params: ['app.media.rx_logo_alipay'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Image.width(28);
            Image.height(28);
            Image.objectFit(ImageFit.Contain);
        }, Image);
        this.observeComponentCreation2((t126, u126) => {
            Text.create('支付宝实名认证');
            Text.fontSize(18);
            Text.fontColor(Color.White);
            Text.margin({ left: 10 });
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((r126, s126) => {
            Row.create();
            Row.width('100%');
            Row.justifyContent(FlexAlign.Center);
            Row.margin({ top: 24, bottom: 28 });
        }, Row);
        this.observeComponentCreation2((p126, q126) => {
            Text.create('手动实名认证');
            Text.fontSize(16);
            Text.fontColor({ "id": -1, "type": 10001, params: ['app.color.col_a3a3a3'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Text.decoration({
                type: TextDecorationType.Underline,
                color: { "id": -1, "type": 10001, params: ['app.color.col_a3a3a3'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ }
            });
            Text.padding(6);
            Text.onClick(() => {
                this.showManualForm = true;
            });
        }, Text);
        Text.pop();
        Row.pop();
        Column.pop();
    }
    ManualAuthBody(q124 = null) {
        this.observeComponentCreation2((m126, n126) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((k126, l126) => {
            Text.create(this.description);
            Text.fontSize(13);
            Text.margin({ top: 4, bottom: 10 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((f126, g126) => {
            TextInput.create({ placeholder: "请输入真实姓名", text: { value: this.realName, changeEvent: j126 => { this.realName = j126; } } });
            TextInput.height({ "id": -1, "type": 10002, params: ['app.float.edit_height'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            TextInput.placeholderColor({ "id": -1, "type": 10001, params: ['app.color.col_a5caca'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            TextInput.placeholderFont({ size: { "id": -1, "type": 10002, params: ['app.float.edit_font_size'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ } });
            TextInput.backgroundColor('#00FFFFFF');
            TextInput.fontSize({ "id": -1, "type": 10002, params: ['app.float.edit_font_size'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            TextInput.type(InputType.USER_NAME);
            TextInput.onFocus(() => {
                this.onAction(UserAction.NameTF);
            });
            TextInput.border({
                width: 1,
                color: { "id": -1, "type": 10001, params: ['app.color.col_e2f2f1'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ },
                radius: 4
            });
            TextInput.onDidDelete((i126: DeleteValue) => {
                console.info('onDidDelete is triggering: ', i126.deleteValue, i126.deleteOffset);
                if (this.isFastAuth) {
                    this.isFastAuth = false;
                    setTimeout(() => {
                        this.realName = '';
                    }, 0);
                }
            });
            TextInput.onChange((h126: string) => {
                if (this.isFastAuth && this.realName !== h126) {
                    this.isFastAuth = false;
                }
                this.realName = h126;
            });
        }, TextInput);
        this.observeComponentCreation2((y125, z125) => {
            If.create();
            if (SDKConfig.isCustomKeyboard) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((d126, e126) => {
                        TextInput.create({ placeholder: "请输入身份证号", text: this.idCard, controller: this.inputController });
                        TextInput.height({ "id": -1, "type": 10002, params: ['app.float.edit_height'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                        TextInput.placeholderColor({ "id": -1, "type": 10001, params: ['app.color.col_a5caca'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                        TextInput.backgroundColor('#00FFFFFF');
                        TextInput.placeholderFont({ size: { "id": -1, "type": 10002, params: ['app.float.edit_font_size'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ } });
                        TextInput.fontSize({ "id": -1, "type": 10002, params: ['app.float.edit_font_size'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                        TextInput.type(InputType.Normal);
                        TextInput.customKeyboard({ builder: () => {
                                this.idCardboardBuilder.call(this);
                            } }, { supportAvoidance: true });
                        TextInput.margin({ top: 10, bottom: 10 });
                        TextInput.border({
                            width: 1,
                            color: { "id": -1, "type": 10001, params: ['app.color.col_e2f2f1'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ },
                            radius: 4
                        });
                        TextInput.onFocus(() => {
                            this.onAction(UserAction.IDCardTF);
                        });
                    }, TextInput);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((a126, b126) => {
                        TextInput.create({ placeholder: "请输入身份证号", text: { value: this.idCard, changeEvent: c126 => { this.idCard = c126; } } });
                        TextInput.height({ "id": -1, "type": 10002, params: ['app.float.edit_height'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                        TextInput.placeholderColor({ "id": -1, "type": 10001, params: ['app.color.col_a5caca'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                        TextInput.backgroundColor('#00FFFFFF');
                        TextInput.placeholderFont({ size: { "id": -1, "type": 10002, params: ['app.float.edit_font_size'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ } });
                        TextInput.fontSize({ "id": -1, "type": 10002, params: ['app.float.edit_font_size'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                        TextInput.type(InputType.Normal);
                        TextInput.margin({ top: 10, bottom: 10 });
                        TextInput.border({
                            width: 1,
                            color: { "id": -1, "type": 10001, params: ['app.color.col_e2f2f1'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ },
                            radius: 4
                        });
                        TextInput.onFocus(() => {
                            this.onAction(UserAction.IDCardTF);
                        });
                    }, TextInput);
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((v124, w124) => {
            If.create();
            if (this.props && this.props.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    if (!If.canRetake('prop_list')) {
                        this.observeComponentCreation2((w125, x125) => {
                            List.create({ space: 14 });
                            List.width(-1);
                            List.constraintSize({ maxWidth: 330 });
                            List.height(42);
                            List.friction(0.7);
                            List.margin({ top: 3 });
                            List.borderRadius(4);
                            List.id('prop_list');
                            List.listDirection(Axis.Horizontal);
                            List.scrollBar(BarState.Off);
                        }, List);
                        this.observeComponentCreation2((x124, y124) => {
                            ForEach.create();
                            const z124 = (a125, b125: number) => {
                                const c125 = a125;
                                {
                                    const d125 = (u125, v125) => {
                                        ViewStackProcessor.StartGetAccessRecordingFor(u125);
                                        ListItem.create(f125, true);
                                        if (!v125) {
                                            ListItem.pop();
                                        }
                                        ViewStackProcessor.StopGetAccessRecording();
                                    };
                                    const e125 = (s125, t125) => {
                                        ListItem.create(f125, true);
                                        ListItem.onClick(() => {
                                        });
                                    };
                                    const f125 = (g125, h125) => {
                                        d125(g125, h125);
                                        this.observeComponentCreation2((q125, r125) => {
                                            RelativeContainer.create();
                                            RelativeContainer.borderWidth(1);
                                            RelativeContainer.borderColor("#BFE7E3");
                                            RelativeContainer.borderStyle(BorderStyle.Dashed);
                                            RelativeContainer.borderRadius(4);
                                            RelativeContainer.height(42);
                                            RelativeContainer.width(42);
                                        }, RelativeContainer);
                                        this.observeComponentCreation2((o125, p125) => {
                                            Image.create(c125.icon);
                                            Image.height(32);
                                            Image.objectFit(ImageFit.Contain);
                                            Image.autoResize(true);
                                            Image.alignRules({
                                                center: { anchor: "__container__", align: VerticalAlign.Center },
                                                middle: { anchor: "__container__", align: HorizontalAlign.Center }
                                            });
                                        }, Image);
                                        this.observeComponentCreation2((i125, j125) => {
                                            If.create();
                                            if (c125.num_format) {
                                                this.ifElseBranchUpdateFunction(0, () => {
                                                    this.observeComponentCreation2((m125, n125) => {
                                                        Image.create({ "id": -1, "type": 20000, params: ['app.media.rx_reward_rect'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                                                        Image.height(16);
                                                        Image.alignRules({
                                                            bottom: { anchor: "__container__", align: VerticalAlign.Bottom },
                                                            middle: { anchor: "__container__", align: HorizontalAlign.Center }
                                                        });
                                                    }, Image);
                                                    this.observeComponentCreation2((k125, l125) => {
                                                        Text.create(`x${c125.num}`);
                                                        Text.fontColor(Color.White);
                                                        Text.fontSize(10);
                                                        Text.margin({ left: 2 });
                                                        Text.maxLines(1);
                                                        Text.textAlign(TextAlign.End);
                                                        Text.maxLines(1);
                                                        Text.alignRules({
                                                            bottom: { anchor: "__container__", align: VerticalAlign.Bottom },
                                                            middle: { anchor: "__container__", align: HorizontalAlign.Center }
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
                                        RelativeContainer.pop();
                                        ListItem.pop();
                                    };
                                    this.observeComponentCreation2(e125, ListItem);
                                    ListItem.pop();
                                }
                            };
                            this.forEachUpdateFunction(x124, this.props, z124, undefined, true, false);
                        }, ForEach);
                        ForEach.pop();
                        List.pop();
                    }
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
        this.observeComponentCreation2((t124, u124) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((r124, s124) => {
            Button.createWithLabel(this.props && this.props?.length > 0 ? "认证并领取奖励" : '确认提交', { type: ButtonType.Normal, stateEffect: true });
            Button.height({ "id": -1, "type": 10002, params: ['app.float.button_height'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Button.layoutWeight(1);
            Button.borderRadius(4);
            Button.fontSize({ "id": -1, "type": 10002, params: ['app.float.button_font_size'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Button.margin({ top: 15, bottom: this.props && this.props?.length > 0 ? 20 : 28 });
            Button.fontWeight(500);
            Button.enabled(isButtonClickable(this.realName, this.idCard));
            Button.fontColor(Color.White);
            Button.backgroundColor(isButtonClickable(this.realName, this.idCard) ? { "id": -1, "type": 10001, params: ['app.color.col_20c0b3'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ } : { "id": -1, "type": 10001, params: ['app.color.col_b3e6e2'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Button.onClick(() => {
                console.log("click real name");
                this.onAction(UserAction.Confirm);
                this.onCommitClick?.(this.realName, this.idCard, this.isFastAuth);
            });
        }, Button);
        Button.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
function isButtonClickable(o124: string, p124: string): boolean {
    return o124 !== '' && p124 !== '';
}
