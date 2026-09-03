// @keepTs
// @ts-nocheck
import { __MODULE_NAME__, __BUNDLE_NAME__ } from "@normalized:N&&&hmssdk/build/default/generated/profile/default/ModuleInfo&4.0.0";
if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface FeedbackComponent_Params {
    resList?: string[];
    title?: ResourceStr;
    scrollState?: number;
    propIndex?: number;
    textLength?: number;
    maxLength?: number;
    inputContent?: string;
    phone?: string;
    onCloseClick?: (event?: ClickEvent) => void;
    onCommitClick?: (content: string, resList: string[], phone: string) => void;
    onAddFileClick?: (event?: ClickEvent) => void;
}
import { HeaderComponent } from "@normalized:N&&&hmssdk/src/main/ets/pages/HeaderComponent&4.0.0";
import photoAccessHelper from "@ohos:file.photoAccessHelper";
import type { BusinessError } from "@ohos:base";
import filePreview from "@hms:filemanagement.filepreview";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
let SIZE = 50;
export class FeedbackComponent extends ViewPU {
    constructor(d81, e81, f81, g81 = -1, h81 = undefined, i81) {
        super(d81, f81, g81, i81);
        if (typeof h81 === "function") {
            this.paramsGenerator_ = h81;
        }
        this.__resList = new ObservedPropertyObjectPU([], this, "resList");
        this.__title = new ObservedPropertyObjectPU("我要反馈", this, "title");
        this.__scrollState = new ObservedPropertySimplePU(0, this, "scrollState");
        this.__propIndex = new ObservedPropertySimplePU(-1, this, "propIndex");
        this.__textLength = new ObservedPropertySimplePU(0, this, "textLength");
        this.__maxLength = new ObservedPropertySimplePU(200, this, "maxLength");
        this.__inputContent = new ObservedPropertySimplePU("", this, "inputContent");
        this.__phone = new ObservedPropertySimplePU("", this, "phone");
        this.onCloseClick = undefined;
        this.onCommitClick = undefined;
        this.onAddFileClick = undefined;
        this.setInitiallyProvidedValue(e81);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(c81: FeedbackComponent_Params) {
        if (c81.resList !== undefined) {
            this.resList = c81.resList;
        }
        if (c81.title !== undefined) {
            this.title = c81.title;
        }
        if (c81.scrollState !== undefined) {
            this.scrollState = c81.scrollState;
        }
        if (c81.propIndex !== undefined) {
            this.propIndex = c81.propIndex;
        }
        if (c81.textLength !== undefined) {
            this.textLength = c81.textLength;
        }
        if (c81.maxLength !== undefined) {
            this.maxLength = c81.maxLength;
        }
        if (c81.inputContent !== undefined) {
            this.inputContent = c81.inputContent;
        }
        if (c81.phone !== undefined) {
            this.phone = c81.phone;
        }
        if (c81.onCloseClick !== undefined) {
            this.onCloseClick = c81.onCloseClick;
        }
        if (c81.onCommitClick !== undefined) {
            this.onCommitClick = c81.onCommitClick;
        }
        if (c81.onAddFileClick !== undefined) {
            this.onAddFileClick = c81.onAddFileClick;
        }
    }
    updateStateVars(b81: FeedbackComponent_Params) {
    }
    purgeVariableDependenciesOnElmtId(a81) {
        this.__resList.purgeDependencyOnElmtId(a81);
        this.__title.purgeDependencyOnElmtId(a81);
        this.__scrollState.purgeDependencyOnElmtId(a81);
        this.__propIndex.purgeDependencyOnElmtId(a81);
        this.__textLength.purgeDependencyOnElmtId(a81);
        this.__maxLength.purgeDependencyOnElmtId(a81);
        this.__inputContent.purgeDependencyOnElmtId(a81);
        this.__phone.purgeDependencyOnElmtId(a81);
    }
    aboutToBeDeleted() {
        this.__resList.aboutToBeDeleted();
        this.__title.aboutToBeDeleted();
        this.__scrollState.aboutToBeDeleted();
        this.__propIndex.aboutToBeDeleted();
        this.__textLength.aboutToBeDeleted();
        this.__maxLength.aboutToBeDeleted();
        this.__inputContent.aboutToBeDeleted();
        this.__phone.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __resList: ObservedPropertyObjectPU<string[]>;
    get resList() {
        return this.__resList.get();
    }
    set resList(z80: string[]) {
        this.__resList.set(z80);
    }
    private __title: ObservedPropertyObjectPU<ResourceStr>;
    get title() {
        return this.__title.get();
    }
    set title(y80: ResourceStr) {
        this.__title.set(y80);
    }
    private __scrollState: ObservedPropertySimplePU<number>;
    get scrollState() {
        return this.__scrollState.get();
    }
    set scrollState(x80: number) {
        this.__scrollState.set(x80);
    }
    private __propIndex: ObservedPropertySimplePU<number>;
    get propIndex() {
        return this.__propIndex.get();
    }
    set propIndex(w80: number) {
        this.__propIndex.set(w80);
    }
    private __textLength: ObservedPropertySimplePU<number>;
    get textLength() {
        return this.__textLength.get();
    }
    set textLength(v80: number) {
        this.__textLength.set(v80);
    }
    private __maxLength: ObservedPropertySimplePU<number>;
    get maxLength() {
        return this.__maxLength.get();
    }
    set maxLength(u80: number) {
        this.__maxLength.set(u80);
    }
    private __inputContent: ObservedPropertySimplePU<string>;
    get inputContent() {
        return this.__inputContent.get();
    }
    set inputContent(t80: string) {
        this.__inputContent.set(t80);
    }
    private __phone: ObservedPropertySimplePU<string>;
    get phone() {
        return this.__phone.get();
    }
    set phone(s80: string) {
        this.__phone.set(s80);
    }
    private onCloseClick?: (event?: ClickEvent) => void;
    private onCommitClick?: (content: string, resList: string[], phone: string) => void;
    private onAddFileClick?: (event?: ClickEvent) => void;
    aboutToAppear(): void {
    }
    close(r80: ClickEvent) {
        this.onCloseClick?.(r80);
    }
    initialRender() {
        this.observeComponentCreation2((p80, q80) => {
            RelativeContainer.create();
            RelativeContainer.onClick(() => {
                this.propIndex = -1;
            });
            RelativeContainer.backgroundColor(Color.White);
            RelativeContainer.margin(25);
            RelativeContainer.borderRadius(4);
            RelativeContainer.constraintSize({ maxWidth: 550, maxHeight: 449 });
        }, RelativeContainer);
        this.observeComponentCreation2((n80, o80) => {
            Scroll.create();
            Scroll.scrollBar(BarState.Off);
        }, Scroll);
        this.observeComponentCreation2((l80, m80) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((j80, k80) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((h80, i80) => {
            __Common__.create();
            __Common__.margin({ top: 4 });
        }, __Common__);
        {
            this.observeComponentCreation2((b80, c80) => {
                if (c80) {
                    let d80 = new HeaderComponent(this, {
                        title: this.title,
                        onClose: (g80) => {
                            this.close(g80);
                        },
                        backVisible: false
                    }, undefined, b80, () => { }, { page: "HmsSdk/src/main/ets/pages/FeedbackComponent.ets", line: 43, col: 13 });
                    ViewPU.create(d80);
                    let e80 = () => {
                        return {
                            title: this.title,
                            onClose: (f80) => {
                                this.close(f80);
                            },
                            backVisible: false
                        };
                    };
                    d80.paramsGenerator_ = e80;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(b80, {
                        title: this.title,
                        backVisible: false
                    });
                }
            }, { name: "HeaderComponent" });
        }
        __Common__.pop();
        this.observeComponentCreation2((z79, a80) => {
            RelativeContainer.create();
            RelativeContainer.borderRadius(4);
            RelativeContainer.constraintSize({ minHeight: 50, maxHeight: 210 });
            RelativeContainer.layoutWeight(1);
            RelativeContainer.margin({
                left: 15,
                right: 15,
                bottom: 13
            });
        }, RelativeContainer);
        this.observeComponentCreation2((x79, y79) => {
            Scroll.create();
            Scroll.align(Alignment.TopStart);
        }, Scroll);
        this.observeComponentCreation2((v79, w79) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((s79, t79) => {
            TextArea.create({ placeholder: "请输入您的意见反馈" });
            TextArea.backgroundColor("#F4F4F4");
            TextArea.borderRadius(4);
            TextArea.layoutWeight(1);
            TextArea.maxLength(this.maxLength);
            TextArea.onChange((u79: string) => {
                this.textLength = u79.length;
                this.inputContent = u79;
            });
        }, TextArea);
        Column.pop();
        Scroll.pop();
        this.observeComponentCreation2((q79, r79) => {
            Text.create(`${this.textLength}/${this.maxLength}`);
            Text.alignRules({
                right: { anchor: "__container__", align: HorizontalAlign.End },
                bottom: { anchor: "__container__", align: VerticalAlign.Bottom }
            });
            Text.fontColor("#BCBCBC");
            Text.margin({ right: 8, bottom: 8 });
        }, Text);
        Text.pop();
        RelativeContainer.pop();
        this.observeComponentCreation2((o79, p79) => {
            Column.create();
            Column.margin({
                left: 15,
                right: 15,
                bottom: 13
            });
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((m79, n79) => {
            Text.create("添加附件:");
            Text.fontSize(14);
            Text.margin({ bottom: 2 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((k79, l79) => {
            Row.create();
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((f79, g79) => {
            List.create({ space: 10 });
            List.width(-1);
            List.height((SIZE) * Math.ceil(this.getResList().length / 4) + Math.ceil(this.getResList().length / 4 - 1) * 10);
            List.friction(0.7);
            List.borderRadius(4);
            List.listDirection(Axis.Horizontal);
            List.lanes(Math.ceil(this.getResList().length / 4), 10);
            List.scrollBar(BarState.Off);
            List.onScrollIndex((h79: number, i79: number, j79: number) => {
                this.scrollState = 3;
            });
            List.onReachStart(() => {
                this.scrollState = 2;
            });
            List.onReachEnd(() => {
                this.scrollState = 1;
            });
        }, List);
        this.observeComponentCreation2((d78, e78) => {
            ForEach.create();
            const f78 = (g78, h78: number) => {
                const i78 = g78;
                {
                    const j78 = (d79, e79) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(d79);
                        ListItem.create(l78, true);
                        if (!e79) {
                            ListItem.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    };
                    const k78 = (b79, c79) => {
                        ListItem.create(l78, true);
                    };
                    const l78 = (m78, n78) => {
                        j78(m78, n78);
                        this.observeComponentCreation2((o78, p78) => {
                            If.create();
                            if (i78 == "add:file") {
                                this.ifElseBranchUpdateFunction(0, () => {
                                    this.addFile.bind(this)();
                                });
                            }
                            else {
                                this.ifElseBranchUpdateFunction(1, () => {
                                    this.observeComponentCreation2((q78, r78) => {
                                        If.create();
                                        if (i78.endsWith(".mp4")) {
                                            this.ifElseBranchUpdateFunction(0, () => {
                                                this.observeComponentCreation2((z78, a79) => {
                                                    Video.create({
                                                        src: i78,
                                                    });
                                                    Video.borderWidth(1);
                                                    Video.borderColor("#E1E1E1");
                                                    Video.borderRadius(6);
                                                    Video.height(SIZE);
                                                    Video.width(SIZE);
                                                }, Video);
                                            });
                                        }
                                        else {
                                            this.ifElseBranchUpdateFunction(1, () => {
                                                this.observeComponentCreation2((s78, t78) => {
                                                    Image.create(i78);
                                                    Image.backgroundColor("#F5F6F7");
                                                    Image.borderWidth(1);
                                                    Image.borderColor("#E1E1E1");
                                                    Image.borderRadius(6);
                                                    Image.height(SIZE);
                                                    Image.width(SIZE);
                                                    Image.onClick(() => {
                                                        let u78 = getContext(this);
                                                        let v78: filePreview.PreviewInfo = {
                                                            uri: i78,
                                                            mimeType: 'image/*'
                                                        };
                                                        let w78: filePreview.DisplayInfo = {
                                                            x: 100,
                                                            y: 100,
                                                            width: 800,
                                                            height: 800
                                                        };
                                                        let x78: Array<filePreview.PreviewInfo> = new Array();
                                                        x78.push(v78);
                                                        filePreview.openPreview(u78, v78, w78)
                                                            .then(() => {
                                                            console.info('Succeeded in loading data.');
                                                        }).catch((y78: BusinessError) => {
                                                            console.error(`Failed to load data, err.code = ${y78.code}, err.message = ${y78.message}`);
                                                        });
                                                    });
                                                }, Image);
                                            });
                                        }
                                    }, If);
                                    If.pop();
                                });
                            }
                        }, If);
                        If.pop();
                        ListItem.pop();
                    };
                    this.observeComponentCreation2(k78, ListItem);
                    ListItem.pop();
                }
            };
            this.forEachUpdateFunction(d78, this.getResList(), f78, undefined, true, false);
        }, ForEach);
        ForEach.pop();
        List.pop();
        Row.pop();
        this.observeComponentCreation2((b78, c78) => {
            Row.create();
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((z77, a78) => {
            Text.create("联系电话:");
            Text.fontSize(14);
            Text.margin({ top: 5 });
            Text.margin({ right: 5 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((w77, x77) => {
            TextInput.create({ text: { value: this.phone, changeEvent: y77 => { this.phone = y77; } }, placeholder: "请输入手机号方便联系您" });
            TextInput.height(32);
            TextInput.width(200);
            TextInput.contentType(ContentType.FULL_PHONE_NUMBER);
            TextInput.type(InputType.PhoneNumber);
            TextInput.maxLength(16);
            TextInput.placeholderFont({ size: 14 });
            TextInput.backgroundColor("#F4F4F4");
            TextInput.placeholderColor("#767676");
            TextInput.borderRadius(4);
            TextInput.margin({ top: 10, bottom: 10 });
        }, TextInput);
        this.observeComponentCreation2((u77, v77) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        Row.pop();
        this.observeComponentCreation2((s77, t77) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((q77, r77) => {
            Blank.create();
            Blank.layoutWeight(1);
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((o77, p77) => {
            Button.createWithLabel('提交', { type: ButtonType.Normal, stateEffect: true });
            Button.width(130);
            Button.height(38);
            Button.margin({ top: 3 });
            Button.borderRadius(10);
            Button.fontSize(16);
            Button.fontWeight(500);
            Button.fontColor(Color.White);
            Button.backgroundColor({ "id": -1, "type": 10001, params: ['app.color.col_20c0b3'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Button.onClick(() => {
                this.onCommitClick?.(this.inputContent, ObservedObject.GetRawObject(this.resList), this.phone);
            });
        }, Button);
        Button.pop();
        Row.pop();
        Column.pop();
        Column.pop();
        Column.pop();
        Scroll.pop();
        RelativeContainer.pop();
    }
    private getResList(): ResourceStr[] {
        return this.resList?.length < 4 ? this.resList.concat("add:file") : this.resList;
    }
    addFile(b77 = null) {
        this.observeComponentCreation2((e77, f77) => {
            Column.create();
            Column.alignItems(HorizontalAlign.Center);
            Column.justifyContent(FlexAlign.Center);
            Column.backgroundColor("#F4F4F4");
            Column.borderWidth(1);
            Column.borderColor("#E1E1E1");
            Column.borderRadius(6);
            Column.height(SIZE);
            Column.width(SIZE);
            Column.onClick((g77) => {
                this.onAddFileClick?.(g77);
                try {
                    let j77 = new photoAccessHelper.PhotoSelectOptions();
                    j77.MIMEType = photoAccessHelper.PhotoViewMIMETypes.IMAGE_VIDEO_TYPE;
                    j77.maxSelectNumber = 5 - this.resList?.length || 0;
                    let k77 = new photoAccessHelper.PhotoViewPicker();
                    k77.select(j77).then((m77: photoAccessHelper.PhotoSelectResult) => {
                        console.info('PhotoViewPicker.select successfully, PhotoSelectResult uri: ' + JSON.stringify(m77));
                        let n77: Array<string> = m77.photoUris;
                        this.resList = n77;
                        Logger.i('resList: ' + JSON.stringify(ObservedObject.GetRawObject(this.resList)));
                    }).catch((l77: BusinessError) => {
                        console.error(`PhotoViewPicker.select failed with err: ${l77.code}, ${l77.message}`);
                    });
                    return true;
                }
                catch (h77) {
                    let i77: BusinessError = h77 as BusinessError;
                    console.error(`PhotoViewPicker failed with err: ${i77.code}, ${i77.message}`);
                    return false;
                }
            });
        }, Column);
        this.observeComponentCreation2((c77, d77) => {
            Text.create("+");
            Text.fontWeight(FontWeight.Medium);
            Text.fontSize(38);
            Text.fontColor(Color.White);
        }, Text);
        Text.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "FeedbackComponent";
    }
}
registerNamedRoute(() => new FeedbackComponent(undefined, {}), "", { bundleName: __BUNDLE_NAME__, moduleName: __MODULE_NAME__, pagePath: "HmsSdk/src/main/ets/pages/FeedbackComponent", pageFullPath: "", integratedHsp: "__harDefaultIntegratedHspType__", moduleType: "byteCodeHar" });
