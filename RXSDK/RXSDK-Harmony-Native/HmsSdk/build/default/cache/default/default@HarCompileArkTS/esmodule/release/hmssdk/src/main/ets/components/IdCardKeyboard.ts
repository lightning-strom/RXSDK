// @keepTs
// @ts-nocheck
import { __MODULE_NAME__, __BUNDLE_NAME__ } from "@normalized:N&&&hmssdk/build/default/generated/profile/default/ModuleInfo&4.0.0";
if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface IdCardKeyboard_Params {
    items?: IKeyAttribute[];
    curKeyboardType?: EKeyboardType;
    inputValue?: string;
    placeholder?: string;
    controller?: TextInputController;
    onKeyboardEvent?: Function | null;
    rowSpace?: number;
    columnSpace?: number;
    rowCount?: number;
    itemHeight?: number;
    theme?: ColorConfig;
    bottomHeight?: number;
    inputShow?: boolean;
    maxWidth?: number;
    orientation?: display.Orientation;
}
import { EKeyType, EKeyboardType } from "@normalized:N&&&hmssdk/src/main/ets/components/KeyboardDefine&4.0.0";
import type { IKeyAttribute } from "@normalized:N&&&hmssdk/src/main/ets/components/KeyboardDefine&4.0.0";
import display from "@ohos:display";
const FONT_SIZE = 16;
const BG_COLOR = Color.White;
const FONT_COLOR = Color.Black;
const idCardKeyData: IKeyAttribute[] = [
    {
        label: '1',
        value: '1',
        fontSize: FONT_SIZE,
        fontColor: FONT_COLOR,
        type: EKeyType.INPUT,
        backgroundColor: BG_COLOR,
        position: [0, 0, 0, 0],
    },
    {
        label: '2',
        value: '2',
        fontSize: FONT_SIZE,
        fontColor: FONT_COLOR,
        type: EKeyType.INPUT,
        backgroundColor: BG_COLOR,
        position: [0, 0, 1, 1],
    },
    {
        label: '3',
        value: '3',
        fontSize: FONT_SIZE,
        fontColor: FONT_COLOR,
        type: EKeyType.INPUT,
        backgroundColor: BG_COLOR,
        position: [0, 0, 2, 2],
    },
    {
        label: '4',
        value: '4',
        fontSize: FONT_SIZE,
        fontColor: FONT_COLOR,
        type: EKeyType.INPUT,
        backgroundColor: BG_COLOR,
        position: [1, 1, 0, 0],
    },
    {
        label: '5',
        value: '5',
        fontSize: FONT_SIZE,
        fontColor: FONT_COLOR,
        type: EKeyType.INPUT,
        backgroundColor: BG_COLOR,
        position: [1, 1, 1, 1],
    },
    {
        label: '6',
        value: '6',
        fontSize: FONT_SIZE,
        fontColor: FONT_COLOR,
        type: EKeyType.INPUT,
        backgroundColor: BG_COLOR,
        position: [1, 1, 2, 2],
    },
    {
        label: '7',
        value: '7',
        fontSize: FONT_SIZE,
        fontColor: FONT_COLOR,
        type: EKeyType.INPUT,
        backgroundColor: BG_COLOR,
        position: [2, 2, 0, 0],
    },
    {
        label: '8',
        value: '8',
        fontSize: FONT_SIZE,
        fontColor: FONT_COLOR,
        type: EKeyType.INPUT,
        backgroundColor: BG_COLOR,
        position: [2, 2, 1, 1],
    },
    {
        label: '9',
        value: '9',
        fontSize: FONT_SIZE,
        fontColor: FONT_COLOR,
        type: EKeyType.INPUT,
        backgroundColor: BG_COLOR,
        position: [2, 2, 2, 2],
    },
    {
        label: 'X',
        value: 'X',
        fontSize: FONT_SIZE,
        fontColor: FONT_COLOR,
        type: EKeyType.INPUT,
        backgroundColor: BG_COLOR,
        position: [3, 3, 0, 0],
    },
    {
        label: '0',
        value: '0',
        fontSize: FONT_SIZE,
        fontColor: FONT_COLOR,
        type: EKeyType.INPUT,
        backgroundColor: BG_COLOR,
        position: [3, 3, 1, 1],
    },
    {
        label: { "id": -1, "type": 20000, params: ["app.media.rx_key_del"], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ },
        fontSize: FONT_SIZE,
        fontColor: FONT_COLOR,
        type: EKeyType.DELETE,
        backgroundColor: BG_COLOR,
        position: [3, 3, 2, 2],
    },
];
export interface ColorConfig {
    bgColor: ResourceColor;
    hdColor: ResourceColor;
    pressColor: ResourceColor;
    fontColor?: string | Color;
    disableColor?: string | Color;
}
const defaultCfg: ColorConfig = {
    bgColor: "#F1F1F1",
    fontColor: Color.Black,
    disableColor: "#ADADAD",
    hdColor: "#E4E4E4",
    pressColor: "#F9F9F9",
};
export const rxCardKeyCfg: ColorConfig = {
    bgColor: "#E3F4F7",
    fontColor: "#05403B",
    disableColor: "#ADADAD",
    hdColor: "#D2F0F6",
    pressColor: "#EDF8FA",
};
export class IdCardKeyboard extends ViewPU {
    constructor(u32, v32, w32, x32 = -1, y32 = undefined, z32) {
        super(u32, w32, x32, z32);
        if (typeof y32 === "function") {
            this.paramsGenerator_ = y32;
        }
        this.__items = new ObservedPropertyObjectPU(idCardKeyData, this, "items");
        this.__curKeyboardType = new ObservedPropertySimplePU(EKeyboardType.NUMERIC, this, "curKeyboardType");
        this.__inputValue = new ObservedPropertySimplePU('', this, "inputValue");
        this.__placeholder = new ObservedPropertySimplePU('', this, "placeholder");
        this.controller = new TextInputController();
        this.onKeyboardEvent = null;
        this.rowSpace = 1;
        this.columnSpace = 1;
        this.rowCount = 4;
        this.__itemHeight = new ObservedPropertySimplePU(48, this, "itemHeight");
        this.__theme = new ObservedPropertyObjectPU(defaultCfg, this, "theme");
        this.__bottomHeight = new ObservedPropertySimplePU(10, this, "bottomHeight");
        this.__inputShow = new ObservedPropertySimplePU(true, this, "inputShow");
        this.maxWidth = 594;
        this.__orientation = new ObservedPropertySimplePU(0, this, "orientation");
        this.setInitiallyProvidedValue(v32);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(t32: IdCardKeyboard_Params) {
        if (t32.items !== undefined) {
            this.items = t32.items;
        }
        if (t32.curKeyboardType !== undefined) {
            this.curKeyboardType = t32.curKeyboardType;
        }
        if (t32.inputValue !== undefined) {
            this.inputValue = t32.inputValue;
        }
        if (t32.placeholder !== undefined) {
            this.placeholder = t32.placeholder;
        }
        if (t32.controller !== undefined) {
            this.controller = t32.controller;
        }
        if (t32.onKeyboardEvent !== undefined) {
            this.onKeyboardEvent = t32.onKeyboardEvent;
        }
        if (t32.rowSpace !== undefined) {
            this.rowSpace = t32.rowSpace;
        }
        if (t32.columnSpace !== undefined) {
            this.columnSpace = t32.columnSpace;
        }
        if (t32.rowCount !== undefined) {
            this.rowCount = t32.rowCount;
        }
        if (t32.itemHeight !== undefined) {
            this.itemHeight = t32.itemHeight;
        }
        if (t32.theme !== undefined) {
            this.theme = t32.theme;
        }
        if (t32.bottomHeight !== undefined) {
            this.bottomHeight = t32.bottomHeight;
        }
        if (t32.inputShow !== undefined) {
            this.inputShow = t32.inputShow;
        }
        if (t32.maxWidth !== undefined) {
            this.maxWidth = t32.maxWidth;
        }
        if (t32.orientation !== undefined) {
            this.orientation = t32.orientation;
        }
    }
    updateStateVars(s32: IdCardKeyboard_Params) {
    }
    purgeVariableDependenciesOnElmtId(r32) {
        this.__items.purgeDependencyOnElmtId(r32);
        this.__curKeyboardType.purgeDependencyOnElmtId(r32);
        this.__inputValue.purgeDependencyOnElmtId(r32);
        this.__placeholder.purgeDependencyOnElmtId(r32);
        this.__itemHeight.purgeDependencyOnElmtId(r32);
        this.__theme.purgeDependencyOnElmtId(r32);
        this.__bottomHeight.purgeDependencyOnElmtId(r32);
        this.__inputShow.purgeDependencyOnElmtId(r32);
        this.__orientation.purgeDependencyOnElmtId(r32);
    }
    aboutToBeDeleted() {
        this.__items.aboutToBeDeleted();
        this.__curKeyboardType.aboutToBeDeleted();
        this.__inputValue.aboutToBeDeleted();
        this.__placeholder.aboutToBeDeleted();
        this.__itemHeight.aboutToBeDeleted();
        this.__theme.aboutToBeDeleted();
        this.__bottomHeight.aboutToBeDeleted();
        this.__inputShow.aboutToBeDeleted();
        this.__orientation.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __items: ObservedPropertyObjectPU<IKeyAttribute[]>;
    get items() {
        return this.__items.get();
    }
    set items(q32: IKeyAttribute[]) {
        this.__items.set(q32);
    }
    private __curKeyboardType: ObservedPropertySimplePU<EKeyboardType>;
    get curKeyboardType() {
        return this.__curKeyboardType.get();
    }
    set curKeyboardType(p32: EKeyboardType) {
        this.__curKeyboardType.set(p32);
    }
    private __inputValue: ObservedPropertySimplePU<string>;
    get inputValue() {
        return this.__inputValue.get();
    }
    set inputValue(o32: string) {
        this.__inputValue.set(o32);
    }
    private __placeholder: ObservedPropertySimplePU<string>;
    get placeholder() {
        return this.__placeholder.get();
    }
    set placeholder(n32: string) {
        this.__placeholder.set(n32);
    }
    private controller: TextInputController;
    private onKeyboardEvent: Function | null;
    private rowSpace: number;
    private columnSpace: number;
    private rowCount: number;
    private __itemHeight: ObservedPropertySimplePU<number>;
    get itemHeight() {
        return this.__itemHeight.get();
    }
    set itemHeight(m32: number) {
        this.__itemHeight.set(m32);
    }
    private __theme: ObservedPropertyObjectPU<ColorConfig>;
    get theme() {
        return this.__theme.get();
    }
    set theme(l32: ColorConfig) {
        this.__theme.set(l32);
    }
    private __bottomHeight: ObservedPropertySimplePU<number>;
    get bottomHeight() {
        return this.__bottomHeight.get();
    }
    set bottomHeight(k32: number) {
        this.__bottomHeight.set(k32);
    }
    private __inputShow: ObservedPropertySimplePU<boolean>;
    get inputShow() {
        return this.__inputShow.get();
    }
    set inputShow(j32: boolean) {
        this.__inputShow.set(j32);
    }
    private maxWidth: number;
    private __orientation: ObservedPropertySimplePU<display.Orientation>;
    get orientation() {
        return this.__orientation.get();
    }
    set orientation(i32: display.Orientation) {
        this.__orientation.set(i32);
    }
    aboutToAppear(): void {
        this.orientation = display.getDefaultDisplaySync().orientation;
        console.log("this.orientation " + this.orientation);
        if (this.orientation % 2 == 0) {
            this.itemHeight = 48;
        }
        else {
            this.itemHeight = 32;
        }
    }
    myGridItem(a32: IKeyAttribute, b32 = null) {
        this.observeComponentCreation2((c32, d32) => {
            If.create();
            if (typeof a32.label === 'object') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((g32, h32) => {
                        Image.create(a32.label);
                        Image.width(24);
                        Image.height(24);
                        Image.objectFit(ImageFit.Contain);
                    }, Image);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((e32, f32) => {
                        Text.create(a32.label);
                        Text.fontSize(a32.fontSize);
                        Text.fontColor(a32.fontColor);
                        Text.fontWeight(FontWeight.Medium);
                    }, Text);
                    Text.pop();
                });
            }
        }, If);
        If.pop();
    }
    titleBar(g31 = null) {
        this.observeComponentCreation2((y31, z31) => {
            Row.create();
            Row.backgroundColor(this.theme.hdColor);
        }, Row);
        this.observeComponentCreation2((w31, x31) => {
            Blank.create();
            Blank.layoutWeight(1);
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((u31, v31) => {
            Row.create();
            Row.constraintSize({ maxWidth: this.maxWidth });
            Row.padding({ top: 8, bottom: 8 });
        }, Row);
        this.observeComponentCreation2((s31, t31) => {
            Stack.create();
            Stack.layoutWeight(1);
            Stack.alignContent(Alignment.End);
        }, Stack);
        this.observeComponentCreation2((p31, q31) => {
            TextInput.create({ placeholder: this.placeholder, text: { value: this.inputValue, changeEvent: r31 => { this.inputValue = r31; } } });
            TextInput.backgroundColor(Color.White);
            TextInput.defaultFocus(true);
            TextInput.height(38);
            TextInput.fontColor(this.theme.fontColor);
            TextInput.padding({ right: 50 });
            TextInput.border({
                radius: 4
            });
            TextInput.margin({ left: 8 });
        }, TextInput);
        this.observeComponentCreation2((m31, n31) => {
            Text.create("清空");
            Text.height(38);
            Text.fontColor(this.theme.disableColor);
            Text.margin({ left: 8, right: 8 });
            Text.onClick((o31) => {
                this.inputValue = "";
            });
        }, Text);
        Text.pop();
        Stack.pop();
        this.observeComponentCreation2((j31, k31) => {
            Image.create({ "id": -1, "type": 20000, params: ["app.media.rx_key_complete"], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Image.height(38);
            Image.backgroundColor(Color.White);
            Image.padding(7);
            Image.fillColor(this.inputValue ? this.theme.fontColor : this.theme.disableColor);
            Image.enabled(!!this.inputValue);
            Image.borderRadius(4);
            Image.margin({ left: 8, right: 8 });
            Image.onClick((l31) => {
                this.onKeyboardEvent?.({ type: EKeyType.COMPLETE, value: this.inputValue });
                this.controller.stopEditing();
            });
        }, Image);
        Row.pop();
        this.observeComponentCreation2((h31, i31) => {
            Blank.create();
            Blank.layoutWeight(1);
        }, Blank);
        Blank.pop();
        Row.pop();
    }
    initialRender() {
        this.observeComponentCreation2((e31, f31) => {
            Column.create();
            Column.padding({ left: this.columnSpace, right: this.columnSpace });
            Column.backgroundColor(this.theme.bgColor);
        }, Column);
        this.titleBar.bind(this)();
        this.observeComponentCreation2((c31, d31) => {
            Column.create();
            Column.constraintSize({ maxWidth: this.maxWidth });
        }, Column);
        this.observeComponentCreation2((a31, b31) => {
            Grid.create();
            Grid.columnsTemplate(this.curKeyboardType === EKeyboardType.NUMERIC ? "1fr 1fr 1fr" :
                "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr");
            Grid.rowsTemplate("1fr 1fr 1fr 1fr");
            Grid.rowsGap(this.rowSpace);
            Grid.columnsGap(this.columnSpace);
            Grid.margin({
                top: 8,
                bottom: this.bottomHeight + 8,
                left: 8,
                right: 8
            });
            Grid.borderRadius(4);
            Grid.height(this.itemHeight * this.rowCount + this.rowSpace * (this.rowCount - 1));
        }, Grid);
        this.observeComponentCreation2((i30, j30) => {
            ForEach.create();
            const k30 = n30 => {
                const o30 = n30;
                this.observeComponentCreation2((p30, q30) => {
                    If.create();
                    if (o30.type === EKeyType.DELETE) {
                        this.ifElseBranchUpdateFunction(0, () => {
                            {
                                const v30 = (x30, y30) => {
                                    GridItem.create(() => { }, false);
                                    GridItem.width("100%");
                                    GridItem.height(this.itemHeight);
                                    GridItem.rowStart(o30?.position?.[0]);
                                    GridItem.rowEnd(o30?.position?.[1]);
                                    GridItem.columnStart(o30?.position?.[2]);
                                    GridItem.columnEnd(o30?.position?.[3]);
                                    GridItem.backgroundColor(o30.backgroundColor);
                                    ViewStackProcessor.visualState("pressed");
                                    GridItem.backgroundColor(this.theme.pressColor);
                                    ViewStackProcessor.visualState();
                                    globalThis.Gesture.create(GesturePriority.Low);
                                    LongPressGesture.create({ repeat: true, duration: 150 });
                                    LongPressGesture.onAction((z30: GestureEvent) => {
                                        if (z30 && z30.repeat && o30.type === EKeyType.DELETE) {
                                            this.onKeyClickEvent(o30);
                                        }
                                    });
                                    LongPressGesture.pop();
                                    globalThis.Gesture.pop();
                                    GridItem.onClick(() => {
                                        console.log("rxsdk onKeyClickEvent " + o30.value);
                                        this.onKeyClickEvent(o30);
                                    });
                                };
                                const w30 = () => {
                                    this.observeComponentCreation2(v30, GridItem);
                                    this.myGridItem.bind(this)(o30);
                                    GridItem.pop();
                                };
                                w30();
                            }
                        });
                    }
                    else {
                        this.ifElseBranchUpdateFunction(1, () => {
                            {
                                const r30 = (t30, u30) => {
                                    GridItem.create(() => { }, false);
                                    GridItem.width("100%");
                                    GridItem.height(this.itemHeight);
                                    GridItem.rowStart(o30?.position?.[0]);
                                    GridItem.rowEnd(o30?.position?.[1]);
                                    GridItem.columnStart(o30?.position?.[2]);
                                    GridItem.columnEnd(o30?.position?.[3]);
                                    GridItem.backgroundColor(o30.backgroundColor);
                                    ViewStackProcessor.visualState("pressed");
                                    GridItem.backgroundColor(this.theme.pressColor);
                                    ViewStackProcessor.visualState();
                                    GridItem.onClick(() => {
                                        console.log("rxsdk onKeyClickEvent " + o30.value);
                                        this.onKeyClickEvent(o30);
                                    });
                                };
                                const s30 = () => {
                                    this.observeComponentCreation2(r30, GridItem);
                                    this.myGridItem.bind(this)(o30);
                                    GridItem.pop();
                                };
                                s30();
                            }
                        });
                    }
                }, If);
                If.pop();
            };
            this.forEachUpdateFunction(i30, this.items, k30, (l30: IKeyAttribute, m30: number) => JSON.stringify(l30) + m30, false, true);
        }, ForEach);
        ForEach.pop();
        Grid.pop();
        Column.pop();
        Column.pop();
    }
    private onKeyClickEvent(h30: IKeyAttribute) {
        if (h30.type === EKeyType.INPUT) {
            this.inputValue += h30.value;
        }
        else if (h30.type === EKeyType.DELETE) {
            this.inputValue = this.inputValue?.slice(0, -1);
        }
        else if (h30.type === EKeyType.CAPSLOCK && typeof h30.label === 'object') {
            if (this.curKeyboardType === EKeyboardType.LOWERCASE) {
                h30.label = { "id": -1, "type": 20000, params: ["app.media.rx_key_capslock_white"], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ };
            }
            else {
                h30.label = { "id": -1, "type": 20000, params: ["app.media.rx_key_capslock_black"], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ };
            }
        }
        this.onKeyboardEvent?.(h30);
    }
    rerender() {
        this.updateDirtyElements();
    }
}
