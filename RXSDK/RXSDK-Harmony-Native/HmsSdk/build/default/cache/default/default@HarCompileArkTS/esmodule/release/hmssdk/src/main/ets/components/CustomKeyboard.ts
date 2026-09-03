// @keepTs
// @ts-nocheck
import { __MODULE_NAME__, __BUNDLE_NAME__ } from "@normalized:N&&&hmssdk/build/default/generated/profile/default/ModuleInfo&4.0.0";
if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface CustomKeyboard_Params {
    items?: IKeyAttribute[];
    curKeyboardType?: EKeyboardType;
    inputValue?: string;
    placeholder?: string;
    controller?: TextInputController;
    onKeyboardEvent?: Function | null;
    rowSpace?: number;
    rowCount?: number;
    columnSpace?: number;
    itemHeight?: number;
    bgColor?: ResourceColor;
    bottomHeight?: number;
    inputShow?: boolean;
}
import { EKeyType, EKeyboardType } from "@normalized:N&&&hmssdk/src/main/ets/components/KeyboardDefine&4.0.0";
import type { IKeyAttribute } from "@normalized:N&&&hmssdk/src/main/ets/components/KeyboardDefine&4.0.0";
export class CustomKeyboard extends ViewPU {
    constructor(b30, c30, d30, e30 = -1, f30 = undefined, g30) {
        super(b30, d30, e30, g30);
        if (typeof f30 === "function") {
            this.paramsGenerator_ = f30;
        }
        this.__items = new SynchedPropertyObjectOneWayPU(c30.items, this, "items");
        this.__curKeyboardType = new SynchedPropertySimpleOneWayPU(c30.curKeyboardType, this, "curKeyboardType");
        this.__inputValue = new SynchedPropertySimpleTwoWayPU(c30.inputValue, this, "inputValue");
        this.__placeholder = new ObservedPropertySimplePU('', this, "placeholder");
        this.controller = new TextInputController();
        this.onKeyboardEvent = null;
        this.rowSpace = 5;
        this.rowCount = 4;
        this.columnSpace = 5;
        this.itemHeight = 42;
        this.bgColor = Color.Black;
        this.__bottomHeight = this.createStorageLink('bottomHeight', 20, "bottomHeight");
        this.__inputShow = new ObservedPropertySimplePU(false, this, "inputShow");
        this.setInitiallyProvidedValue(c30);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(a30: CustomKeyboard_Params) {
        if (a30.placeholder !== undefined) {
            this.placeholder = a30.placeholder;
        }
        if (a30.controller !== undefined) {
            this.controller = a30.controller;
        }
        if (a30.onKeyboardEvent !== undefined) {
            this.onKeyboardEvent = a30.onKeyboardEvent;
        }
        if (a30.rowSpace !== undefined) {
            this.rowSpace = a30.rowSpace;
        }
        if (a30.rowCount !== undefined) {
            this.rowCount = a30.rowCount;
        }
        if (a30.columnSpace !== undefined) {
            this.columnSpace = a30.columnSpace;
        }
        if (a30.itemHeight !== undefined) {
            this.itemHeight = a30.itemHeight;
        }
        if (a30.bgColor !== undefined) {
            this.bgColor = a30.bgColor;
        }
        if (a30.inputShow !== undefined) {
            this.inputShow = a30.inputShow;
        }
    }
    updateStateVars(z29: CustomKeyboard_Params) {
        this.__items.reset(z29.items);
        this.__curKeyboardType.reset(z29.curKeyboardType);
    }
    purgeVariableDependenciesOnElmtId(y29) {
        this.__items.purgeDependencyOnElmtId(y29);
        this.__curKeyboardType.purgeDependencyOnElmtId(y29);
        this.__inputValue.purgeDependencyOnElmtId(y29);
        this.__placeholder.purgeDependencyOnElmtId(y29);
        this.__bottomHeight.purgeDependencyOnElmtId(y29);
        this.__inputShow.purgeDependencyOnElmtId(y29);
    }
    aboutToBeDeleted() {
        this.__items.aboutToBeDeleted();
        this.__curKeyboardType.aboutToBeDeleted();
        this.__inputValue.aboutToBeDeleted();
        this.__placeholder.aboutToBeDeleted();
        this.__bottomHeight.aboutToBeDeleted();
        this.__inputShow.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __items: SynchedPropertySimpleOneWayPU<IKeyAttribute[]>;
    get items() {
        return this.__items.get();
    }
    set items(x29: IKeyAttribute[]) {
        this.__items.set(x29);
    }
    private __curKeyboardType: SynchedPropertySimpleOneWayPU<EKeyboardType>;
    get curKeyboardType() {
        return this.__curKeyboardType.get();
    }
    set curKeyboardType(w29: EKeyboardType) {
        this.__curKeyboardType.set(w29);
    }
    private __inputValue: SynchedPropertySimpleTwoWayPU<string>;
    get inputValue() {
        return this.__inputValue.get();
    }
    set inputValue(v29: string) {
        this.__inputValue.set(v29);
    }
    private __placeholder: ObservedPropertySimplePU<string>;
    get placeholder() {
        return this.__placeholder.get();
    }
    set placeholder(u29: string) {
        this.__placeholder.set(u29);
    }
    private controller: TextInputController;
    private onKeyboardEvent: Function | null;
    private rowSpace: number;
    private rowCount: number;
    private columnSpace: number;
    private itemHeight: number;
    private bgColor: ResourceColor;
    private __bottomHeight: ObservedPropertyAbstractPU<number>;
    get bottomHeight() {
        return this.__bottomHeight.get();
    }
    set bottomHeight(t29: number) {
        this.__bottomHeight.set(t29);
    }
    private __inputShow: ObservedPropertySimplePU<boolean>;
    get inputShow() {
        return this.__inputShow.get();
    }
    set inputShow(s29: boolean) {
        this.__inputShow.set(s29);
    }
    aboutToAppear(): void {
    }
    myGridItem(k29: IKeyAttribute, l29 = null) {
        this.observeComponentCreation2((m29, n29) => {
            If.create();
            if (typeof k29.label === 'object') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((q29, r29) => {
                        Image.create(k29.label);
                        Image.width(24);
                        Image.height(24);
                        Image.objectFit(ImageFit.Contain);
                    }, Image);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((o29, p29) => {
                        Text.create(k29.label);
                        Text.fontSize(k29.fontSize);
                        Text.fontColor(k29.fontColor);
                        Text.fontWeight(FontWeight.Bold);
                    }, Text);
                    Text.pop();
                });
            }
        }, If);
        If.pop();
    }
    titleBar(v28 = null) {
        this.observeComponentCreation2((i29, j29) => {
            Row.create();
            Row.width("100%");
            Row.margin({ top: 12, bottom: 10 });
        }, Row);
        this.observeComponentCreation2((c29, d29) => {
            If.create();
            if (this.inputShow) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((g29, h29) => {
                        Text.create(this.inputValue);
                        Text.backgroundColor(Color.White);
                        Text.height(this.itemHeight - 5);
                        Text.layoutWeight(1);
                        Text.border({
                            width: 1,
                            color: { "id": -1, "type": 10001, params: ['app.color.col_e2f2f1'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ },
                            radius: 4
                        });
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((e29, f29) => {
                        Text.create("安全键盘");
                        Text.fontSize(20);
                        Text.fontColor(Color.Grey);
                        Text.layoutWeight(1);
                        Text.margin({ left: 12 });
                    }, Text);
                    Text.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((z28, a29) => {
            Text.create("完成");
            Text.fontSize(20);
            Text.fontColor("#4590DB");
            Text.margin({ left: 12 });
            Text.onClick((b29) => {
                this.onKeyboardEvent?.({ type: EKeyType.COMPLETE, value: this.inputValue });
                this.controller.stopEditing();
            });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((w28, x28) => {
            Text.create("取消");
            Text.fontSize(20);
            Text.fontColor("#4590DB");
            Text.margin({ left: 12, right: 12 });
            Text.onClick((y28) => {
                this.inputValue = "";
                this.controller.stopEditing();
                this.onKeyboardEvent?.({ type: EKeyType.CANCEL });
            });
        }, Text);
        Text.pop();
        Row.pop();
    }
    initialRender() {
        this.observeComponentCreation2((t28, u28) => {
            Column.create();
            Column.width("100%");
            Column.padding({ left: this.columnSpace, right: this.columnSpace });
            Column.backgroundColor(this.bgColor);
        }, Column);
        this.titleBar.bind(this)();
        this.observeComponentCreation2((r28, s28) => {
            Grid.create();
            Grid.margin({ bottom: this.bottomHeight + 'px' });
            Grid.columnsTemplate(this.curKeyboardType === EKeyboardType.NUMERIC ? "1fr 1fr 1fr" :
                "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr");
            Grid.rowsTemplate("1fr 1fr 1fr 1fr");
            Grid.rowsGap(this.rowSpace);
            Grid.columnsGap(this.columnSpace);
            Grid.width("100%");
            Grid.height(this.itemHeight * this.rowCount + this.rowSpace * (this.rowCount - 1));
        }, Grid);
        this.observeComponentCreation2((f28, g28) => {
            ForEach.create();
            const h28 = k28 => {
                const l28 = k28;
                {
                    const m28 = (o28, p28) => {
                        GridItem.create(() => { }, false);
                        GridItem.width("100%");
                        GridItem.height(this.itemHeight);
                        GridItem.rowStart(l28?.position?.[0]);
                        GridItem.rowEnd(l28?.position?.[1]);
                        GridItem.columnStart(l28?.position?.[2]);
                        GridItem.columnEnd(l28?.position?.[3]);
                        GridItem.backgroundColor(l28.backgroundColor);
                        GridItem.borderRadius(4);
                        globalThis.Gesture.create(GesturePriority.Low);
                        LongPressGesture.create({ repeat: true, duration: 100 });
                        LongPressGesture.onAction((q28: GestureEvent) => {
                            if (q28 && q28.repeat && l28.type === EKeyType.DELETE) {
                                this.onKeyClickEvent(l28);
                            }
                        });
                        LongPressGesture.pop();
                        globalThis.Gesture.pop();
                        GridItem.onClick(() => {
                            this.onKeyClickEvent(l28);
                        });
                    };
                    const n28 = () => {
                        this.observeComponentCreation2(m28, GridItem);
                        this.myGridItem.bind(this)(l28);
                        GridItem.pop();
                    };
                    n28();
                }
            };
            this.forEachUpdateFunction(f28, this.items, h28, (i28: IKeyAttribute, j28: number) => JSON.stringify(i28) + j28, false, true);
        }, ForEach);
        ForEach.pop();
        Grid.pop();
        Column.pop();
    }
    private onKeyClickEvent(e28: IKeyAttribute) {
        console.log(JSON.stringify(e28));
        if (e28.type === EKeyType.INPUT) {
            this.inputValue += e28.value;
        }
        else if (e28.type === EKeyType.DELETE) {
            this.inputValue = this.inputValue?.slice(0, -1);
        }
        else if (e28.type === EKeyType.CAPSLOCK && typeof e28.label === 'object') {
            if (this.curKeyboardType === EKeyboardType.LOWERCASE) {
                e28.label = { "id": -1, "type": 20000, params: ["app.media.rx_key_capslock_white"], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ };
            }
            else {
                e28.label = { "id": -1, "type": 20000, params: ["app.media.rx_key_capslock_black"], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ };
            }
        }
        this.onKeyboardEvent?.(e28);
    }
    rerender() {
        this.updateDirtyElements();
    }
}
