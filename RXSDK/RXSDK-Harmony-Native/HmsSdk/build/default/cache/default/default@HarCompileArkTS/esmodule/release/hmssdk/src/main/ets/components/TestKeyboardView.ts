// @keepTs
// @ts-nocheck
import { __MODULE_NAME__, __BUNDLE_NAME__ } from "@normalized:N&&&hmssdk/build/default/generated/profile/default/ModuleInfo&4.0.0";
if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface TestKeyboardView_Params {
    inputValue?: string;
    inputValue1?: string;
    placeholder?: string;
    curKeyboardType?: EKeyboardType;
    items?: IKeyAttribute[];
    controller?: TextInputController;
    controller1?: TextInputController;
}
import { CustomKeyboard } from "@normalized:N&&&hmssdk/src/main/ets/components/CustomKeyboard&4.0.0";
import { CustomIdCardInput } from "@normalized:N&&&hmssdk/src/main/ets/components/CustomIdCardInput&4.0.0";
import { IdCardKeyboard } from "@normalized:N&&&hmssdk/src/main/ets/components/IdCardKeyboard&4.0.0";
import { EKeyboardType, EKeyType, idCardKeyData } from "@normalized:N&&&hmssdk/src/main/ets/components/KeyboardDefine&4.0.0";
import type { IKeyAttribute } from "@normalized:N&&&hmssdk/src/main/ets/components/KeyboardDefine&4.0.0";
const TEXT_INPUT_ID: string = 'textInput';
export class TestKeyboardView extends ViewPU {
    constructor(l34, m34, n34, o34 = -1, p34 = undefined, q34) {
        super(l34, n34, o34, q34);
        if (typeof p34 === "function") {
            this.paramsGenerator_ = p34;
        }
        this.__inputValue = new ObservedPropertySimplePU('', this, "inputValue");
        this.__inputValue1 = new ObservedPropertySimplePU('', this, "inputValue1");
        this.__placeholder = new ObservedPropertySimplePU("请输入身份证号", this, "placeholder");
        this.__curKeyboardType = new ObservedPropertySimplePU(EKeyboardType.NUMERIC, this, "curKeyboardType");
        this.__items = new ObservedPropertyObjectPU(idCardKeyData, this, "items");
        this.controller = new TextInputController();
        this.controller1 = new TextInputController();
        this.setInitiallyProvidedValue(m34);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(k34: TestKeyboardView_Params) {
        if (k34.inputValue !== undefined) {
            this.inputValue = k34.inputValue;
        }
        if (k34.inputValue1 !== undefined) {
            this.inputValue1 = k34.inputValue1;
        }
        if (k34.placeholder !== undefined) {
            this.placeholder = k34.placeholder;
        }
        if (k34.curKeyboardType !== undefined) {
            this.curKeyboardType = k34.curKeyboardType;
        }
        if (k34.items !== undefined) {
            this.items = k34.items;
        }
        if (k34.controller !== undefined) {
            this.controller = k34.controller;
        }
        if (k34.controller1 !== undefined) {
            this.controller1 = k34.controller1;
        }
    }
    updateStateVars(j34: TestKeyboardView_Params) {
    }
    purgeVariableDependenciesOnElmtId(i34) {
        this.__inputValue.purgeDependencyOnElmtId(i34);
        this.__inputValue1.purgeDependencyOnElmtId(i34);
        this.__placeholder.purgeDependencyOnElmtId(i34);
        this.__curKeyboardType.purgeDependencyOnElmtId(i34);
        this.__items.purgeDependencyOnElmtId(i34);
    }
    aboutToBeDeleted() {
        this.__inputValue.aboutToBeDeleted();
        this.__inputValue1.aboutToBeDeleted();
        this.__placeholder.aboutToBeDeleted();
        this.__curKeyboardType.aboutToBeDeleted();
        this.__items.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __inputValue: ObservedPropertySimplePU<string>;
    get inputValue() {
        return this.__inputValue.get();
    }
    set inputValue(h34: string) {
        this.__inputValue.set(h34);
    }
    private __inputValue1: ObservedPropertySimplePU<string>;
    get inputValue1() {
        return this.__inputValue1.get();
    }
    set inputValue1(g34: string) {
        this.__inputValue1.set(g34);
    }
    private __placeholder: ObservedPropertySimplePU<string>;
    get placeholder() {
        return this.__placeholder.get();
    }
    set placeholder(f34: string) {
        this.__placeholder.set(f34);
    }
    private __curKeyboardType: ObservedPropertySimplePU<EKeyboardType>;
    get curKeyboardType() {
        return this.__curKeyboardType.get();
    }
    set curKeyboardType(e34: EKeyboardType) {
        this.__curKeyboardType.set(e34);
    }
    private __items: ObservedPropertyObjectPU<IKeyAttribute[]>;
    get items() {
        return this.__items.get();
    }
    set items(d34: IKeyAttribute[]) {
        this.__items.set(d34);
    }
    private controller: TextInputController;
    private controller1: TextInputController;
    onKeyboardEvent(c34: IKeyAttribute) {
        switch (c34.type) {
            case EKeyType.COMPLETE:
                this.inputValue = c34.value + "";
                console.log("rxsdk:" + this.inputValue);
            case EKeyType.INPUT:
                console.log(JSON.stringify(c34));
                break;
        }
    }
    customKeyboardBuilder(x33 = null) {
        {
            this.observeComponentCreation2((y33, z33) => {
                if (z33) {
                    let a34 = new CustomKeyboard(this, {
                        items: this.items,
                        inputValue: this.__inputValue1,
                        curKeyboardType: this.curKeyboardType,
                        placeholder: this.placeholder,
                        controller: this.controller
                    }, undefined, y33, () => { }, { page: "HmsSdk/src/main/ets/components/TestKeyboardView.ets", line: 108, col: 5 });
                    ViewPU.create(a34);
                    let b34 = () => {
                        return {
                            items: this.items,
                            inputValue: this.inputValue1,
                            curKeyboardType: this.curKeyboardType,
                            placeholder: this.placeholder,
                            controller: this.controller
                        };
                    };
                    a34.paramsGenerator_ = b34;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(y33, {
                        items: this.items,
                        curKeyboardType: this.curKeyboardType
                    });
                }
            }, { name: "CustomKeyboard" });
        }
    }
    customKeyboardBuilder1(s33 = null) {
        {
            this.observeComponentCreation2((t33, u33) => {
                if (u33) {
                    let v33 = new IdCardKeyboard(this, {
                        inputValue: "",
                        onKeyboardEvent: this.onKeyboardEvent.bind(this),
                        placeholder: "请输入...",
                        controller: this.controller1
                    }, undefined, t33, () => { }, { page: "HmsSdk/src/main/ets/components/TestKeyboardView.ets", line: 119, col: 5 });
                    ViewPU.create(v33);
                    let w33 = () => {
                        return {
                            inputValue: "",
                            onKeyboardEvent: this.onKeyboardEvent.bind(this),
                            placeholder: "请输入...",
                            controller: this.controller1
                        };
                    };
                    v33.paramsGenerator_ = w33;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(t33, {});
                }
            }, { name: "IdCardKeyboard" });
        }
    }
    initialRender() {
        this.observeComponentCreation2((q33, r33) => {
            Column.create();
            Column.onClick(() => {
                this.controller.stopEditing();
                this.controller1.stopEditing();
            });
            Column.focusOnTouch(true);
            Column.width("100%");
            Column.height("100%");
            Column.padding(24);
        }, Column);
        this.observeComponentCreation2((n33, o33) => {
            TextInput.create({
                text: { value: this.inputValue1, changeEvent: p33 => { this.inputValue1 = p33; } },
                placeholder: this.placeholder,
                controller: this.controller
            });
            TextInput.id(TEXT_INPUT_ID);
            TextInput.type(InputType.Normal);
            TextInput.customKeyboard({ builder: () => {
                    this.customKeyboardBuilder.call(this);
                } }, { supportAvoidance: true });
            TextInput.height(48);
            TextInput.margin({ top: 24 });
        }, TextInput);
        this.observeComponentCreation2((l33, m33) => {
            TextInput.create({
                text: this.inputValue,
                placeholder: "请输入...",
                controller: this.controller1
            });
            TextInput.id(TEXT_INPUT_ID);
            TextInput.type(InputType.Normal);
            TextInput.customKeyboard({ builder: () => {
                    this.customKeyboardBuilder1.call(this);
                } }, { supportAvoidance: true });
            TextInput.height(48);
            TextInput.margin({ top: 24 });
        }, TextInput);
        this.observeComponentCreation2((j33, k33) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((e33, f33) => {
            Button.createWithLabel("显示键盘");
            Button.type(ButtonType.Capsule);
            Button.fontSize(20);
            Button.width(160);
            Button.height(48);
            Button.margin({ top: 15 });
            Button.onClick(() => {
                this.controller.stopEditing();
                this.controller1.stopEditing();
                let g33: CustomDialogController;
                g33 = new CustomDialogController({
                    builder: () => {
                        let h33 = new CustomIdCardInput(this, {}, undefined, -1, () => { }, { page: "HmsSdk/src/main/ets/components/TestKeyboardView.ets", line: 165, col: 24 });
                        h33.setController(g33);
                        ViewPU.create(h33);
                        let i33 = () => {
                            return {};
                        };
                        h33.paramsGenerator_ = i33;
                    },
                    autoCancel: false,
                    alignment: DialogAlignment.Bottom,
                    customStyle: true
                }, this);
                g33.open();
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((c33, d33) => {
            Blank.create();
            Blank.width(10);
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((a33, b33) => {
            Button.createWithLabel("隐藏键盘");
            Button.type(ButtonType.Capsule);
            Button.fontSize(20);
            Button.width(160);
            Button.height(48);
            Button.margin({ top: 15 });
            Button.onClick(() => {
                this.controller.stopEditing();
                this.controller1.stopEditing();
            });
        }, Button);
        Button.pop();
        Row.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "TestKeyboardView";
    }
}
registerNamedRoute(() => new TestKeyboardView(undefined, {}), "", { bundleName: __BUNDLE_NAME__, moduleName: __MODULE_NAME__, pagePath: "HmsSdk/src/main/ets/components/TestKeyboardView", pageFullPath: "", integratedHsp: "__harDefaultIntegratedHspType__", moduleType: "byteCodeHar" });
