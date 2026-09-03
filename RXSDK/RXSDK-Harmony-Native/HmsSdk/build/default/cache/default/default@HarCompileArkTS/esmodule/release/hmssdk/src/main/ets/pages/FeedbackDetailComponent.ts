// @keepTs
// @ts-nocheck
import { __MODULE_NAME__, __BUNDLE_NAME__ } from "@normalized:N&&&hmssdk/build/default/generated/profile/default/ModuleInfo&4.0.0";
if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface FeedbackDetailComponent_Params {
    content?: FeedbackDetailBean;
    title?: ResourceStr;
    onCloseClick?: (event?: ClickEvent) => void;
    onReceiveClick?: (event?: ClickEvent) => void;
    previewUri?: string;
}
import type { FeedbackDetailBean, FeedbackPropBean } from '../api/Feedback';
import { HeaderComponent } from "@normalized:N&&&hmssdk/src/main/ets/pages/HeaderComponent&4.0.0";
import { PreviewDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/PreviewDialog&4.0.0";
export class FeedbackDetailComponent extends ViewPU {
    constructor(e86, f86, g86, h86 = -1, i86 = undefined, j86) {
        super(e86, g86, h86, j86);
        if (typeof i86 === "function") {
            this.paramsGenerator_ = i86;
        }
        this.__content = new SynchedPropertyObjectOneWayPU(f86.content, this, "content");
        this.__title = new ObservedPropertyObjectPU("反馈内容", this, "title");
        this.onCloseClick = undefined;
        this.onReceiveClick = undefined;
        this.__previewUri = new ObservedPropertySimplePU('', this, "previewUri");
        this.setInitiallyProvidedValue(f86);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(d86: FeedbackDetailComponent_Params) {
        if (d86.content === undefined) {
            this.__content.set({
                "id": 213,
                "content": "已经反馈内容说明",
                "attachments": [
                    "https://rxfile.fishinggamezone.com/2024/06/28/1719560491878.png",
                    "https://rxfile.fishinggamezone.com/2024/06/25/1719309658818.jpg"
                ],
                "created_at": "2024-10-12 17:10:05",
                "status": 2,
                "recover_at": "2024-10-15 11:14:58",
                "recover_content": "回复内容54",
                "recover_attachments": [
                    "https://rxfile.fishinggamezone.com/2024/06/28/1719560491878.png",
                    "https://rxfile.fishinggamezone.com/2024/06/25/1719309658818.jpg"
                ],
                "is_prop": 0,
                "prop": [{
                        "name": "name1",
                        "tag": "1111",
                        "num": "65",
                        "time_limit": 5,
                        "icon": "",
                        "count": "65",
                        "describe": ""
                    }, {
                        "name": "name2",
                        "tag": "1111",
                        "num": "65",
                        "time_limit": 5,
                        "icon": "",
                        "count": "65",
                        "describe": ""
                    }],
                "get_prop": 1
            });
        }
        if (d86.title !== undefined) {
            this.title = d86.title;
        }
        if (d86.onCloseClick !== undefined) {
            this.onCloseClick = d86.onCloseClick;
        }
        if (d86.onReceiveClick !== undefined) {
            this.onReceiveClick = d86.onReceiveClick;
        }
        if (d86.previewUri !== undefined) {
            this.previewUri = d86.previewUri;
        }
    }
    updateStateVars(c86: FeedbackDetailComponent_Params) {
        this.__content.reset(c86.content);
    }
    purgeVariableDependenciesOnElmtId(b86) {
        this.__content.purgeDependencyOnElmtId(b86);
        this.__title.purgeDependencyOnElmtId(b86);
        this.__previewUri.purgeDependencyOnElmtId(b86);
    }
    aboutToBeDeleted() {
        this.__content.aboutToBeDeleted();
        this.__title.aboutToBeDeleted();
        this.__previewUri.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __content?: SynchedPropertySimpleOneWayPU<FeedbackDetailBean>;
    get content() {
        return this.__content.get();
    }
    set content(a86: FeedbackDetailBean) {
        this.__content.set(a86);
    }
    private __title: ObservedPropertyObjectPU<ResourceStr>;
    get title() {
        return this.__title.get();
    }
    set title(z85: ResourceStr) {
        this.__title.set(z85);
    }
    private onCloseClick?: (event?: ClickEvent) => void;
    private onReceiveClick?: (event?: ClickEvent) => void;
    private __previewUri: ObservedPropertySimplePU<string>;
    get previewUri() {
        return this.__previewUri.get();
    }
    set previewUri(y85: string) {
        this.__previewUri.set(y85);
    }
    aboutToAppear(): void {
    }
    close(x85: ClickEvent) {
        this.onCloseClick?.(x85);
    }
    addAttachments(z84: string[], a85 = null) {
        this.observeComponentCreation2((v85, w85) => {
            List.create({ space: 10 });
            List.width(-1);
            List.friction(0.7);
            List.height(56);
            List.margin({ top: 8 });
            List.listDirection(Axis.Horizontal);
            List.scrollBar(BarState.Off);
        }, List);
        this.observeComponentCreation2((b85, c85) => {
            ForEach.create();
            const d85 = (e85, f85: number) => {
                const g85 = e85;
                {
                    const h85 = (t85, u85) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(t85);
                        ListItem.create(j85, true);
                        if (!u85) {
                            ListItem.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    };
                    const i85 = (r85, s85) => {
                        ListItem.create(j85, true);
                    };
                    const j85 = (k85, l85) => {
                        h85(k85, l85);
                        this.observeComponentCreation2((p85, q85) => {
                            Column.create();
                            Column.borderWidth(1);
                            Column.borderColor("#E1E1E1");
                            Column.borderRadius(6);
                            Column.height(56);
                            Column.width(56);
                        }, Column);
                        this.observeComponentCreation2((m85, n85) => {
                            Image.create(g85);
                            Image.objectFit(ImageFit.Cover);
                            Image.borderRadius(6);
                            Image.onClick((o85) => {
                                PreviewDialog.getInstance(this.getUIContext()).setList(z84, f85).show();
                            });
                        }, Image);
                        Column.pop();
                        ListItem.pop();
                    };
                    this.observeComponentCreation2(i85, ListItem);
                    ListItem.pop();
                }
            };
            this.forEachUpdateFunction(b85, z84, d85, undefined, true, false);
        }, ForEach);
        ForEach.pop();
        List.pop();
    }
    initialRender() {
        this.observeComponentCreation2((x84, y84) => {
            RelativeContainer.create();
        }, RelativeContainer);
        this.observeComponentCreation2((v84, w84) => {
            Column.create();
            Column.backgroundColor(Color.White);
            Column.margin({
                left: 30,
                right: 30,
                top: 34,
                bottom: 34
            });
            Column.borderRadius(4);
            Column.constraintSize({ maxWidth: 550, maxHeight: 500 });
            Column.alignRules({
                center: { anchor: "__container__", align: VerticalAlign.Center },
                middle: { anchor: "__container__", align: HorizontalAlign.Center }
            });
        }, Column);
        this.observeComponentCreation2((t84, u84) => {
            __Common__.create();
            __Common__.margin({ top: 4 });
        }, __Common__);
        {
            this.observeComponentCreation2((n84, o84) => {
                if (o84) {
                    let p84 = new HeaderComponent(this, {
                        title: this.title,
                        onClose: (s84) => {
                            this.close(s84);
                        },
                        backVisible: true
                    }, undefined, n84, () => { }, { page: "HmsSdk/src/main/ets/pages/FeedbackDetailComponent.ets", line: 92, col: 9 });
                    ViewPU.create(p84);
                    let q84 = () => {
                        return {
                            title: this.title,
                            onClose: (r84) => {
                                this.close(r84);
                            },
                            backVisible: true
                        };
                    };
                    p84.paramsGenerator_ = q84;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(n84, {
                        title: this.title,
                        backVisible: true
                    });
                }
            }, { name: "HeaderComponent" });
        }
        __Common__.pop();
        this.observeComponentCreation2((l84, m84) => {
            Scroll.create();
            Scroll.layoutWeight(1);
            Scroll.align(Alignment.TopStart);
            Scroll.margin({ left: 20, right: 20 });
        }, Scroll);
        this.observeComponentCreation2((j84, k84) => {
            Column.create();
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((h84, i84) => {
            Text.create(this.content?.content);
            Text.fontSize(11);
            Text.fontColor("#323232");
            Text.margin({ top: 10 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((f84, g84) => {
            If.create();
            if (this.content && this.content?.attachments?.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.addAttachments.bind(this)(this.content.attachments);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((d84, e84) => {
            Column.create();
            Column.alignItems(HorizontalAlign.Start);
            Column.backgroundColor("#F5F6F7");
            Column.borderRadius(6);
            Column.padding(10);
            Column.margin({ top: 8 });
        }, Column);
        this.observeComponentCreation2((b84, c84) => {
            Text.create("回复内容:");
            Text.fontSize(14);
            Text.margin({ bottom: 2 });
            Text.fontWeight(FontWeight.Medium);
            Text.width("100%");
        }, Text);
        Text.pop();
        this.observeComponentCreation2((z83, a84) => {
            Column.create();
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((x83, y83) => {
            Text.create(this.content?.recover_content);
            Text.fontSize(11);
            Text.fontColor("#323232");
            Text.margin({ top: 5 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((v83, w83) => {
            If.create();
            if (this.content && this.content?.recover_attachments?.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.addAttachments.bind(this)(this.content.recover_attachments);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
        this.observeComponentCreation2((m82, n82) => {
            If.create();
            if (this.content && this.content?.prop?.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((t83, u83) => {
                        Text.create("附件:");
                        Text.fontSize(14);
                        Text.margin({ bottom: 2 });
                        Text.fontWeight(FontWeight.Medium);
                        Text.margin({ top: 10 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((r83, s83) => {
                        Row.create();
                    }, Row);
                    this.observeComponentCreation2((p83, q83) => {
                        List.create({ space: 10 });
                        List.width(-1);
                        List.height(60);
                        List.friction(0.7);
                        List.margin({ top: 8 });
                        List.borderRadius(4);
                        List.listDirection(Axis.Horizontal);
                        List.scrollBar(BarState.Off);
                    }, List);
                    this.observeComponentCreation2((o82, p82) => {
                        ForEach.create();
                        const q82 = (r82, s82: number) => {
                            const t82 = r82;
                            {
                                const u82 = (n83, o83) => {
                                    ViewStackProcessor.StartGetAccessRecordingFor(n83);
                                    ListItem.create(w82, true);
                                    if (!o83) {
                                        ListItem.pop();
                                    }
                                    ViewStackProcessor.StopGetAccessRecording();
                                };
                                const v82 = (l83, m83) => {
                                    ListItem.create(w82, true);
                                };
                                const w82 = (x82, y82) => {
                                    u82(x82, y82);
                                    this.observeComponentCreation2((j83, k83) => {
                                        RelativeContainer.create();
                                        RelativeContainer.borderWidth(1);
                                        RelativeContainer.borderColor("#E1E1E1");
                                        RelativeContainer.borderRadius(6);
                                        RelativeContainer.height(56);
                                        RelativeContainer.width(56);
                                    }, RelativeContainer);
                                    this.observeComponentCreation2((h83, i83) => {
                                        Column.create();
                                    }, Column);
                                    this.observeComponentCreation2((f83, g83) => {
                                        Image.create(t82.icon);
                                        Image.height(36);
                                        Image.margin({ left: 8, right: 8, top: 4 });
                                        Image.objectFit(ImageFit.Contain);
                                        Image.autoResize(true);
                                    }, Image);
                                    this.observeComponentCreation2((d83, e83) => {
                                        Text.create(`${t82.count}`);
                                        Text.fontColor("#20C0B3");
                                        Text.fontSize(10);
                                        Text.width("100%");
                                        Text.margin({ top: 1, bottom: 2, right: 2 });
                                        Text.maxLines(1);
                                        Text.textAlign(TextAlign.End);
                                        Text.maxLines(1);
                                    }, Text);
                                    Text.pop();
                                    Column.pop();
                                    this.observeComponentCreation2((z82, a83) => {
                                        If.create();
                                        if (this.content?.get_prop == 1) {
                                            this.ifElseBranchUpdateFunction(0, () => {
                                                this.observeComponentCreation2((b83, c83) => {
                                                    Text.create('已领');
                                                    Text.fontSize(9);
                                                    Text.padding(3);
                                                    Text.alignRules({
                                                        right: { anchor: '__container__', align: HorizontalAlign.End },
                                                        top: { anchor: '__container__', align: VerticalAlign.Top }
                                                    });
                                                    Text.backgroundColor("#FFD95A");
                                                    Text.borderRadius({ bottomLeft: 4, topRight: 4 });
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
                                this.observeComponentCreation2(v82, ListItem);
                                ListItem.pop();
                            }
                        };
                        this.forEachUpdateFunction(o82, this.content.prop, q82, undefined, true, false);
                    }, ForEach);
                    ForEach.pop();
                    List.pop();
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
        Column.pop();
        Scroll.pop();
        this.observeComponentCreation2((k82, l82) => {
            Row.create();
            Row.margin({ left: 20, right: 20, bottom: 13 });
        }, Row);
        this.observeComponentCreation2((i82, j82) => {
            Blank.create();
            Blank.layoutWeight(1);
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((g82, h82) => {
            Button.createWithLabel(this.content?.is_prop == 1 && this.content.get_prop == 0 ? "领取奖励" : '关闭', { type: ButtonType.Normal, stateEffect: true });
            Button.width(100);
            Button.height(30);
            Button.margin({ top: 8 });
            Button.borderRadius(6);
            Button.fontSize(14);
            Button.fontWeight(500);
            Button.fontColor(Color.White);
            Button.backgroundColor(this.content?.is_prop == 1 && this.content.get_prop == 0 ? { "id": -1, "type": 10001, params: ['app.color.col_20c0b3'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ } : "#DC6E6E");
            Button.onClick(() => {
                if (this.content?.is_prop == 1 && this.content.get_prop == 0) {
                    this.onReceiveClick?.();
                }
                else {
                    this.onCloseClick?.();
                }
            });
        }, Button);
        Button.pop();
        Row.pop();
        Column.pop();
        this.observeComponentCreation2((t81, u81) => {
            If.create();
            if (this.previewUri) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((e82, f82) => {
                        RelativeContainer.create();
                        RelativeContainer.backgroundColor(Color.Black);
                    }, RelativeContainer);
                    this.observeComponentCreation2((y81, z81) => {
                        If.create();
                        if (this.previewUri.endsWith(".mp4")) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((c82, d82) => {
                                    Video.create({ src: this.previewUri });
                                }, Video);
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation2((a82, b82) => {
                                    Image.create(this.previewUri);
                                    Image.objectFit(ImageFit.Contain);
                                }, Image);
                            });
                        }
                    }, If);
                    If.pop();
                    this.observeComponentCreation2((v81, w81) => {
                        Image.create({ "id": -1, "type": 20000, params: ['app.media.ic_close_x_mark_bg'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                        Image.width(45);
                        Image.padding(10);
                        Image.onClick((x81) => {
                            this.previewUri = '';
                        });
                        Image.margin({ left: 25, top: 30, right: 20 });
                        Image.alignRules({
                            top: { anchor: "__container__", align: VerticalAlign.Top },
                            right: { anchor: "__container__", align: HorizontalAlign.End }
                        });
                    }, Image);
                    RelativeContainer.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        RelativeContainer.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "FeedbackDetailComponent";
    }
}
registerNamedRoute(() => new FeedbackDetailComponent(undefined, {}), "", { bundleName: __BUNDLE_NAME__, moduleName: __MODULE_NAME__, pagePath: "HmsSdk/src/main/ets/pages/FeedbackDetailComponent", pageFullPath: "", integratedHsp: "__harDefaultIntegratedHspType__", moduleType: "byteCodeHar" });
