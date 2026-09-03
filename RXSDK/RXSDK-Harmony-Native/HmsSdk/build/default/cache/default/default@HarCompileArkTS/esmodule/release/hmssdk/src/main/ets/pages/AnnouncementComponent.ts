// @keepTs
// @ts-nocheck
import { __MODULE_NAME__, __BUNDLE_NAME__ } from "@normalized:N&&&hmssdk/build/default/generated/profile/default/ModuleInfo&4.0.0";
if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface AnnouncementComponent_Params {
    controller?: webview.WebviewController;
    useWeb?: boolean;
    isControllerAttached?: boolean;
    announcementList?: Announcement[];
    content?: string;
    selectIndex?: number;
    onCloseClick?: (event?: ClickEvent) => void;
    onLinkClick?: (link?: string) => void;
}
import type { Announcement, AnnouncementImage } from '../types/Index';
import display from "@ohos:display";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import webview from "@ohos:web.webview";
const regex = /font-size:\s*(\d+(\.\d+)?)(?:(px|em|rem|%)?)\s*(?=;|$)/gi;
let meta = `<meta name="viewport" content="width=device-width">  <style>
body, html {
  font-size: 40px;
}
</style>`;
export class AnnouncementComponent extends ViewPU {
    constructor(u69, v69, w69, x69 = -1, y69 = undefined, z69) {
        super(u69, w69, x69, z69);
        if (typeof y69 === "function") {
            this.paramsGenerator_ = y69;
        }
        this.controller = new webview.WebviewController();
        this.useWeb = false;
        this.__isControllerAttached = new ObservedPropertySimplePU(false, this, "isControllerAttached");
        this.__announcementList = new ObservedPropertyObjectPU([{
                title: "公告标题1122222222",
                id: 0,
                type: 0,
                timezone: 0,
                start: '',
                end: '',
                content_type: 2,
                is_popup: 0,
                images: [
                    { image_url: "https://img0.baidu.com/it/u=2116142332,3570796654&fm=253&fmt=auto&app=138&f=JPEG?w=650&h=378" },
                    {
                        image_url: "https://rxfile-test.ruixueyun.com/2024/9/5/1725545450485.jpeg"
                    },
                    {
                        image_url: "https://rxfile-test.ruixueyun.com/2024/9/5/1725545176191.png"
                    },
                    {
                        image_url: "https://rxfile-test.ruixueyun.com/2024/9/5/1725545185609.jpeg"
                    },
                    { image_url: "https://img0.baidu.com/it/u=2116142332,3570796654&fm=253&fmt=auto&app=138&f=JPEG?w=650&h=378" },
                    { image_url: "https://img0.baidu.com/it/u=2116142332,3570796654&fm=253&fmt=auto&app=138&f=JPEG?w=650&h=378" }
                ]
            },
            {
                title: "标题222",
                id: 0,
                type: 0,
                timezone: 0,
                start: '',
                end: '',
                content_type: 1,
                is_popup: 0,
                content: '<p><br></p><p style="text-align: start;"><span style="font-size: 36em;">尊敬的玩家朋友们：</span></p><p style="text-align: start;"><span style="font-size: 24;">您好！</span></p>'
            }], this, "announcementList");
        this.__content = new ObservedPropertySimplePU('', this, "content");
        this.__selectIndex = new ObservedPropertySimplePU(0, this, "selectIndex");
        this.onCloseClick = undefined;
        this.onLinkClick = undefined;
        this.setInitiallyProvidedValue(v69);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(t69: AnnouncementComponent_Params) {
        if (t69.controller !== undefined) {
            this.controller = t69.controller;
        }
        if (t69.useWeb !== undefined) {
            this.useWeb = t69.useWeb;
        }
        if (t69.isControllerAttached !== undefined) {
            this.isControllerAttached = t69.isControllerAttached;
        }
        if (t69.announcementList !== undefined) {
            this.announcementList = t69.announcementList;
        }
        if (t69.content !== undefined) {
            this.content = t69.content;
        }
        if (t69.selectIndex !== undefined) {
            this.selectIndex = t69.selectIndex;
        }
        if (t69.onCloseClick !== undefined) {
            this.onCloseClick = t69.onCloseClick;
        }
        if (t69.onLinkClick !== undefined) {
            this.onLinkClick = t69.onLinkClick;
        }
    }
    updateStateVars(s69: AnnouncementComponent_Params) {
    }
    purgeVariableDependenciesOnElmtId(r69) {
        this.__isControllerAttached.purgeDependencyOnElmtId(r69);
        this.__announcementList.purgeDependencyOnElmtId(r69);
        this.__content.purgeDependencyOnElmtId(r69);
        this.__selectIndex.purgeDependencyOnElmtId(r69);
    }
    aboutToBeDeleted() {
        this.__isControllerAttached.aboutToBeDeleted();
        this.__announcementList.aboutToBeDeleted();
        this.__content.aboutToBeDeleted();
        this.__selectIndex.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private controller: webview.WebviewController;
    private useWeb: boolean;
    private __isControllerAttached: ObservedPropertySimplePU<boolean>;
    get isControllerAttached() {
        return this.__isControllerAttached.get();
    }
    set isControllerAttached(q69: boolean) {
        this.__isControllerAttached.set(q69);
    }
    private __announcementList: ObservedPropertyObjectPU<Announcement[]>;
    get announcementList() {
        return this.__announcementList.get();
    }
    set announcementList(p69: Announcement[]) {
        this.__announcementList.set(p69);
    }
    private __content?: ObservedPropertySimplePU<string>;
    get content() {
        return this.__content.get();
    }
    set content(o69: string) {
        this.__content.set(o69);
    }
    private __selectIndex: ObservedPropertySimplePU<number>;
    get selectIndex() {
        return this.__selectIndex.get();
    }
    set selectIndex(n69: number) {
        this.__selectIndex.set(n69);
    }
    private onCloseClick?: (event?: ClickEvent) => void;
    private onLinkClick?: (link?: string) => void;
    aboutToAppear(): void {
    }
    initialRender() {
        this.observeComponentCreation2((l69, m69) => {
            Column.create();
            Column.backgroundColor(Color.White);
            Column.margin({
                left: 30,
                right: 30,
                top: 50,
                bottom: 50
            });
            Column.borderRadius(4);
            Column.constraintSize({ maxWidth: 500, maxHeight: 360 });
        }, Column);
        this.observeComponentCreation2((j69, k69) => {
            Row.create();
            Row.backgroundColor("#CCFFFB");
            Row.height(62);
            Row.borderRadius({ topLeft: 4, topRight: 4 });
        }, Row);
        this.observeComponentCreation2((h69, i69) => {
            Text.create("公告板");
            Text.fontSize(18);
            Text.margin({ left: 22 });
            Text.fontWeight(FontWeight.Bold);
            Text.alignRules({
                center: { anchor: '__container__', align: VerticalAlign.Center },
                middle: { anchor: '__container__', align: HorizontalAlign.Center }
            });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((f69, g69) => {
            Blank.create();
            Blank.layoutWeight(1);
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((d69, e69) => {
            Image.create({ "id": -1, "type": 20000, params: ['app.media.ic_notice_header'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Image.objectFit(ImageFit.None);
            Image.width(94);
            Image.margin({ right: 32 });
        }, Image);
        this.observeComponentCreation2((a69, b69) => {
            Image.create({ "id": -1, "type": 20000, params: ['app.media.rx_close'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Image.objectFit(ImageFit.Contain);
            Image.width(22);
            Image.margin({ right: 22 });
            Image.onClick((c69) => {
                this.onCloseClick?.(c69);
            });
        }, Image);
        Row.pop();
        this.observeComponentCreation2((y68, z68) => {
            Row.create();
            Row.layoutWeight(1);
            Row.borderRadius({ bottomLeft: 4, bottomRight: 4 });
            Row.alignItems(VerticalAlign.Top);
        }, Row);
        this.observeComponentCreation2((a68, b68) => {
            If.create();
            if (this.announcementList.length > 1) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((w68, x68) => {
                        List.create({ space: 10 });
                        List.margin({ left: 10, top: 10, bottom: 10 });
                        List.width('25%');
                        List.height(-1);
                        List.constraintSize({ maxWidth: 112 });
                        List.scrollBar(BarState.Off);
                        List.friction(0.7);
                    }, List);
                    this.observeComponentCreation2((c68, d68) => {
                        ForEach.create();
                        const e68 = (f68, g68: number) => {
                            const h68 = f68;
                            {
                                const i68 = (u68, v68) => {
                                    ViewStackProcessor.StartGetAccessRecordingFor(u68);
                                    ListItem.create(k68, true);
                                    if (!v68) {
                                        ListItem.pop();
                                    }
                                    ViewStackProcessor.StopGetAccessRecording();
                                };
                                const j68 = (p68, q68) => {
                                    ListItem.create(k68, true);
                                    ListItem.borderRadius(4);
                                    ListItem.onClick(() => {
                                        console.info('onClick  ' + g68);
                                        this.selectIndex = g68;
                                        let r68 = this.announcementList[g68];
                                        let s68 = r68?.content_type;
                                        if (s68 == 1 && r68.content) {
                                            try {
                                                if (this.isControllerAttached) {
                                                    this.controller.loadData(this.content || r68?.content, "text/html", "UTF-8");
                                                }
                                            }
                                            catch (t68) {
                                                Logger.e(t68);
                                            }
                                        }
                                    });
                                    ListItem.backgroundColor(this.selectIndex == g68 ? "#EDFDFC" : "#F8F8F8");
                                    ListItem.width("100%");
                                    ListItem.height(46);
                                    ListItem.selectable(true);
                                };
                                const k68 = (l68, m68) => {
                                    i68(l68, m68);
                                    this.observeComponentCreation2((n68, o68) => {
                                        Text.create('' + h68.title);
                                        Text.height(50);
                                        Text.fontSize(14);
                                        Text.fontWeight(FontWeight.Medium);
                                        Text.textAlign(TextAlign.Center);
                                        Text.padding({ left: 6, right: 6 });
                                        Text.fontColor(this.selectIndex == g68 ? "#20C0B3" : "#8B8B8B");
                                        Text.maxLines(2);
                                    }, Text);
                                    Text.pop();
                                    ListItem.pop();
                                };
                                this.observeComponentCreation2(j68, ListItem);
                                ListItem.pop();
                            }
                        };
                        this.forEachUpdateFunction(c68, this.announcementList, e68, undefined, true, false);
                    }, ForEach);
                    ForEach.pop();
                    List.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((y67, z67) => {
            Scroll.create();
            Scroll.layoutWeight(1);
            Scroll.margin(10);
            Scroll.scrollBar(BarState.Off);
        }, Scroll);
        this.observeComponentCreation2((w67, x67) => {
            Column.create();
            Column.justifyContent(FlexAlign.Start);
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((u67, v67) => {
            Text.create(this.announcementList[this.selectIndex]?.title);
            Text.fontSize(13);
            Text.fontWeight(FontWeight.Medium);
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((r66, s66) => {
            If.create();
            if (this.announcementList[this.selectIndex]?.content_type == 1) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((m67, n67) => {
                        If.create();
                        if (this.useWeb) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((q67, r67) => {
                                    Web.create({
                                        src: '',
                                        controller: this.controller
                                    });
                                    Web.onControllerAttached(() => {
                                        this.isControllerAttached = true;
                                        try {
                                            let t67 = this.controller.getWebId();
                                            console.log("id: " + t67);
                                            if (this.announcementList[this.selectIndex]?.content_type == 1 && this.useWeb) {
                                                this.controller.loadData(this.content || this.announcementList[this.selectIndex]?.content, "text/html", "UTF-8");
                                            }
                                        }
                                        catch (s67) {
                                            Logger.e(s67);
                                        }
                                    });
                                    Web.zoomAccess(false);
                                    Web.horizontalScrollBarAccess(false);
                                    Web.height("100%");
                                    Web.layoutWeight(1);
                                }, Web);
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation2((o67, p67) => {
                                    RichText.create(this.getRichText());
                                    RichText.height("100%");
                                    RichText.layoutWeight(1);
                                }, RichText);
                            });
                        }
                    }, If);
                    If.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((k67, l67) => {
                        List.create({ space: 10 });
                        List.height(-1);
                        List.width(-1);
                        List.friction(0.7);
                        List.layoutWeight(1);
                        List.scrollBar(BarState.Off);
                    }, List);
                    this.observeComponentCreation2((t66, u66) => {
                        ForEach.create();
                        const v66 = (w66, x66: number) => {
                            const y66 = w66;
                            {
                                const z66 = (i67, j67) => {
                                    ViewStackProcessor.StartGetAccessRecordingFor(i67);
                                    ListItem.create(b67, true);
                                    if (!j67) {
                                        ListItem.pop();
                                    }
                                    ViewStackProcessor.StopGetAccessRecording();
                                };
                                const a67 = (g67, h67) => {
                                    ListItem.create(b67, true);
                                    ListItem.onClick(() => {
                                        this.onLinkClick?.(y66.link_url);
                                    });
                                };
                                const b67 = (c67, d67) => {
                                    z66(c67, d67);
                                    this.observeComponentCreation2((e67, f67) => {
                                        Image.create(y66.image_url);
                                        Image.objectFit(ImageFit.Contain);
                                        Image.autoResize(true);
                                    }, Image);
                                    ListItem.pop();
                                };
                                this.observeComponentCreation2(a67, ListItem);
                                ListItem.pop();
                            }
                        };
                        this.forEachUpdateFunction(t66, this.announcementList[this.selectIndex]?.images, v66, undefined, true, false);
                    }, ForEach);
                    ForEach.pop();
                    List.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
        Scroll.pop();
        Row.pop();
        Column.pop();
    }
    private getRichText(): string {
        return meta + (this.content || this.announcementList[this.selectIndex]?.content)?.replace(regex, (m66, n66: number, o66: string) => {
            const p66: string = o66 || 'px';
            let q66 = Number(n66) * display.getDefaultDisplaySync().densityPixels;
            return `font-size: ${q66}${p66}`;
        });
    }
    rerender() {
        this.updateDirtyElements();
    }
}
