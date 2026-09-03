// @keepTs
// @ts-nocheck
import { __MODULE_NAME__, __BUNDLE_NAME__ } from "@normalized:N&&&hmssdk/build/default/generated/profile/default/ModuleInfo&4.0.0";
if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface MailDetailComponent_Params {
    mailContent?: MailDetail;
    title?: ResourceStr;
    onCloseClick?: (event?: ClickEvent) => void;
    onMailClick?: (isDelete: boolean) => void;
    controller?: webview.WebviewController;
    scrollState?: number;
    propIndex?: number;
    webFunc?: WebFuncs;
}
import { LengthMetrics } from "@ohos:arkui.node";
import type { MailDetail, MailPropItem } from '../types/MailInterfaces';
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import { HeaderComponent } from "@normalized:N&&&hmssdk/src/main/ets/pages/HeaderComponent&4.0.0";
import webview from "@ohos:web.webview";
import { PreviewDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/PreviewDialog&4.0.0";
export interface WebFuncs {
    onImageClick: (urls: string[], index: number) => void;
}
export class MailDetailComponent extends ViewPU {
    constructor(l117, m117, n117, o117 = -1, p117 = undefined, q117) {
        super(l117, n117, o117, q117);
        if (typeof p117 === "function") {
            this.paramsGenerator_ = p117;
        }
        this.__mailContent = new ObservedPropertyObjectPU({
            "title": "我是一封邮件标题",
            "content": "这里是邮箱的正文，这里支持富文本，可以加粗，描红、斜体，感谢您在过去24小时诶内通过邮箱与我们练习这里是邮箱的正文，这里支持富文本，可以加粗，描红、斜体，感谢您在过去24小时诶内通过邮箱与我们练习 这里是邮箱的正文，这里支持富文本，可以加粗，描红、斜体，感谢您在过去24小时诶内通过邮箱与我们练习，相关的邮件领取详情，如果是你本人获得授权的其他人查看了你通过邮箱领取详情，则无需再进行他操作这里是邮箱的正文，",
            "sign": " 等等",
            "props": [
                {
                    "name": "11",
                    "describe": "111",
                    "icon": "https://haiqi-ruixue-test.oss-cn-beijing.aliyuncs.com/ruixue/profile/1722214999167_3_1_1_1@2x.png",
                    "tag": "2",
                    "count": 10,
                    "count_format": "个",
                    "is_permanent": 0,
                    "time_limit": 1
                },
                {
                    "name": "1122",
                    "describe": "11122",
                    "icon": "https://haiqi-ruixue-test.oss-cn-beijing.aliyuncs.com/ruixue/profile/1722214999167_3_1_1_1@2x.png",
                    "tag": "2",
                    "count": 10,
                    "count_format": "个",
                    "is_permanent": 0,
                    "time_limit": 1
                },
                {
                    "name": "1122",
                    "describe": "11122",
                    "icon": "https://haiqi-ruixue-test.oss-cn-beijing.aliyuncs.com/ruixue/profile/1722214999167_3_1_1_1@2x.png",
                    "tag": "2",
                    "count": 10,
                    "count_format": "个",
                    "is_permanent": 0,
                    "time_limit": 1
                }
            ],
            "status": 1,
            rx_mail_id: 0
        }, this, "mailContent");
        this.__title = new ObservedPropertyObjectPU("邮件", this, "title");
        this.onCloseClick = undefined;
        this.onMailClick = undefined;
        this.controller = new webview.WebviewController();
        this.__scrollState = new ObservedPropertySimplePU(0, this, "scrollState");
        this.__propIndex = new ObservedPropertySimplePU(-1, this, "propIndex");
        this.__webFunc = new ObservedPropertyObjectPU({
            onImageClick: (r117: string[], s117: number) => {
                PreviewDialog.getInstance(this.getUIContext()).setList(r117, s117).show();
            },
        }, this, "webFunc");
        this.setInitiallyProvidedValue(m117);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(k117: MailDetailComponent_Params) {
        if (k117.mailContent !== undefined) {
            this.mailContent = k117.mailContent;
        }
        if (k117.title !== undefined) {
            this.title = k117.title;
        }
        if (k117.onCloseClick !== undefined) {
            this.onCloseClick = k117.onCloseClick;
        }
        if (k117.onMailClick !== undefined) {
            this.onMailClick = k117.onMailClick;
        }
        if (k117.controller !== undefined) {
            this.controller = k117.controller;
        }
        if (k117.scrollState !== undefined) {
            this.scrollState = k117.scrollState;
        }
        if (k117.propIndex !== undefined) {
            this.propIndex = k117.propIndex;
        }
        if (k117.webFunc !== undefined) {
            this.webFunc = k117.webFunc;
        }
    }
    updateStateVars(j117: MailDetailComponent_Params) {
    }
    purgeVariableDependenciesOnElmtId(i117) {
        this.__mailContent.purgeDependencyOnElmtId(i117);
        this.__title.purgeDependencyOnElmtId(i117);
        this.__scrollState.purgeDependencyOnElmtId(i117);
        this.__propIndex.purgeDependencyOnElmtId(i117);
        this.__webFunc.purgeDependencyOnElmtId(i117);
    }
    aboutToBeDeleted() {
        this.__mailContent.aboutToBeDeleted();
        this.__title.aboutToBeDeleted();
        this.__scrollState.aboutToBeDeleted();
        this.__propIndex.aboutToBeDeleted();
        this.__webFunc.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __mailContent: ObservedPropertyObjectPU<MailDetail>;
    get mailContent() {
        return this.__mailContent.get();
    }
    set mailContent(h117: MailDetail) {
        this.__mailContent.set(h117);
    }
    private __title: ObservedPropertyObjectPU<ResourceStr>;
    get title() {
        return this.__title.get();
    }
    set title(g117: ResourceStr) {
        this.__title.set(g117);
    }
    private onCloseClick?: (event?: ClickEvent) => void;
    private onMailClick?: (isDelete: boolean) => void;
    private controller: webview.WebviewController;
    private __scrollState: ObservedPropertySimplePU<number>;
    get scrollState() {
        return this.__scrollState.get();
    }
    set scrollState(f117: number) {
        this.__scrollState.set(f117);
    }
    private __propIndex: ObservedPropertySimplePU<number>;
    get propIndex() {
        return this.__propIndex.get();
    }
    set propIndex(e117: number) {
        this.__propIndex.set(e117);
    }
    private __webFunc: ObservedPropertyObjectPU<WebFuncs>;
    get webFunc() {
        return this.__webFunc.get();
    }
    set webFunc(d117: WebFuncs) {
        this.__webFunc.set(d117);
    }
    aboutToAppear(): void {
        if (this.mailContent.content) {
            setTimeout(() => {
                try {
                    this.controller.loadData(this.mailContent.content, "text/html", "UTF-8");
                }
                catch (c117) {
                    Logger.e(c117);
                }
            });
        }
    }
    close(b117: ClickEvent) {
        this.onCloseClick?.(b117);
    }
    initialRender() {
        this.observeComponentCreation2((z116, a117) => {
            RelativeContainer.create();
            RelativeContainer.backgroundColor(Color.White);
            RelativeContainer.onClick(() => {
                this.propIndex = -1;
            });
            RelativeContainer.margin({
                left: 30,
                right: 30,
                top: 34,
                bottom: 34
            });
            RelativeContainer.borderRadius(4);
            RelativeContainer.constraintSize({ maxWidth: 550, maxHeight: 500 });
        }, RelativeContainer);
        this.observeComponentCreation2((x116, y116) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((v116, w116) => {
            __Common__.create();
            __Common__.margin({ top: 4 });
        }, __Common__);
        {
            this.observeComponentCreation2((p116, q116) => {
                if (q116) {
                    let r116 = new HeaderComponent(this, {
                        title: this.title,
                        onClose: (u116) => {
                            this.close(u116);
                        },
                        backVisible: true
                    }, undefined, p116, () => { }, { page: "HmsSdk/src/main/ets/pages/MailDetailComponent.ets", line: 92, col: 9 });
                    ViewPU.create(r116);
                    let s116 = () => {
                        return {
                            title: this.title,
                            onClose: (t116) => {
                                this.close(t116);
                            },
                            backVisible: true
                        };
                    };
                    r116.paramsGenerator_ = s116;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(p116, {
                        title: this.title,
                        backVisible: true
                    });
                }
            }, { name: "HeaderComponent" });
        }
        __Common__.pop();
        this.observeComponentCreation2((n116, o116) => {
            Column.create();
            Column.backgroundColor("#F4F4F4");
            Column.borderRadius(10);
            Column.layoutWeight(1);
            Column.alignItems(HorizontalAlign.Center);
            Column.padding(10);
            Column.margin({
                left: 15,
                right: 15,
                bottom: 13
            });
        }, Column);
        this.observeComponentCreation2((l116, m116) => {
            Row.create();
            Row.margin({
                top: 11
            });
        }, Row);
        this.observeComponentCreation2((j116, k116) => {
            Text.create(this.mailContent.title);
            Text.fontSize(15);
            Text.fontColor("#323232");
            Text.fontWeight(FontWeight.Medium);
            Text.maxLines(1);
            Text.align(Alignment.Start);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((h116, i116) => {
            Blank.create();
            Blank.layoutWeight(1);
        }, Blank);
        Blank.pop();
        Row.pop();
        this.observeComponentCreation2((f116, g116) => {
            Scroll.create();
            Scroll.layoutWeight(1);
            Scroll.align(Alignment.TopStart);
            Scroll.margin({
                left: 0,
                right: 0,
                top: 10,
                bottom: 10
            });
        }, Scroll);
        this.Webview.bind(this)();
        Scroll.pop();
        this.observeComponentCreation2((d116, e116) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        Column.pop();
        this.observeComponentCreation2((b116, c116) => {
            Flex.create({
                wrap: FlexWrap.Wrap,
                space: { cross: LengthMetrics.vp(10) },
                alignItems: ItemAlign.Center,
                justifyContent: FlexAlign.Center
            });
            Flex.margin({
                left: 15,
                right: 15,
                bottom: 13
            });
        }, Flex);
        this.observeComponentCreation2((k114, l114) => {
            If.create();
            if (this.mailContent.props?.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((z115, a116) => {
                        Row.create();
                    }, Row);
                    this.observeComponentCreation2((x115, y115) => {
                        Image.create({ "id": -1, "type": 20000, params: ['app.media.ic_left_arrow'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                        Image.width(8);
                        Image.margin({ right: 10 });
                        Image.objectFit(ImageFit.Contain);
                        Image.visibility((this.scrollState & 2) > 0 ? Visibility.Visible : Visibility.Hidden);
                    }, Image);
                    this.observeComponentCreation2((s115, t115) => {
                        List.create({ space: 15 });
                        List.width(-1);
                        List.constraintSize({ maxWidth: 330 });
                        List.height(60);
                        List.friction(0.7);
                        List.layoutWeight(1);
                        List.borderRadius(4);
                        List.id('prop_list');
                        List.listDirection(Axis.Horizontal);
                        List.scrollBar(BarState.Off);
                        List.onScrollIndex((u115: number, v115: number, w115: number) => {
                            this.scrollState = 3;
                        });
                        List.onReachStart(() => {
                            this.scrollState = 2;
                        });
                        List.onReachEnd(() => {
                            this.scrollState = 1;
                        });
                    }, List);
                    this.observeComponentCreation2((q114, r114) => {
                        ForEach.create();
                        const s114 = (u114, v114: number) => {
                            const w114 = u114;
                            {
                                const x114 = (q115, r115) => {
                                    ViewStackProcessor.StartGetAccessRecordingFor(q115);
                                    ListItem.create(z114, true);
                                    if (!r115) {
                                        ListItem.pop();
                                    }
                                    ViewStackProcessor.StopGetAccessRecording();
                                };
                                const y114 = (o115, p115) => {
                                    ListItem.create(z114, true);
                                    ListItem.onClick(() => {
                                        this.propIndex = v114;
                                    });
                                };
                                const z114 = (a115, b115) => {
                                    x114(a115, b115);
                                    this.observeComponentCreation2((m115, n115) => {
                                        RelativeContainer.create();
                                        RelativeContainer.borderWidth(1);
                                        RelativeContainer.borderColor("#E1E1E1");
                                        RelativeContainer.borderRadius(6);
                                        RelativeContainer.height(56);
                                        RelativeContainer.width(56);
                                    }, RelativeContainer);
                                    this.observeComponentCreation2((k115, l115) => {
                                        Column.create();
                                    }, Column);
                                    this.observeComponentCreation2((i115, j115) => {
                                        Image.create(w114.icon);
                                        Image.height(36);
                                        Image.margin({ left: 8, right: 8, top: 4 });
                                        Image.objectFit(ImageFit.Contain);
                                        Image.autoResize(true);
                                    }, Image);
                                    this.observeComponentCreation2((g115, h115) => {
                                        Text.create(`${w114.count}${w114.count_format}`);
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
                                    this.observeComponentCreation2((c115, d115) => {
                                        If.create();
                                        if (this.mailContent.status == 2) {
                                            this.ifElseBranchUpdateFunction(0, () => {
                                                this.observeComponentCreation2((e115, f115) => {
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
                                this.observeComponentCreation2(y114, ListItem);
                                ListItem.pop();
                            }
                        };
                        this.forEachUpdateFunction(q114, this.mailContent.props, s114, (t114: string) => t114, true, false);
                    }, ForEach);
                    ForEach.pop();
                    List.pop();
                    this.observeComponentCreation2((o114, p114) => {
                        Image.create({ "id": -1, "type": 20000, params: ['app.media.ic_right_arrow'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                        Image.width(8);
                        Image.margin({ left: 10 });
                        Image.visibility((this.mailContent.props?.length > 4 && (this.scrollState & 1) > 0) ? Visibility.Visible : Visibility.Hidden);
                        Image.objectFit(ImageFit.Contain);
                    }, Image);
                    Row.pop();
                    this.observeComponentCreation2((m114, n114) => {
                        Blank.create();
                    }, Blank);
                    Blank.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((c114, d114) => {
            If.create();
            if (this.mailContent.props?.length > 0 && this.mailContent.status != 2) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((i114, j114) => {
                        Blank.create();
                        Blank.layoutWeight(1);
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((g114, h114) => {
                        Button.createWithLabel('领取道具', { type: ButtonType.Normal, stateEffect: true });
                        Button.width(130);
                        Button.height(38);
                        Button.margin({ left: 5, right: 5 });
                        Button.borderRadius(4);
                        Button.fontSize(14);
                        Button.fontWeight(500);
                        Button.fontColor(Color.White);
                        Button.backgroundColor({ "id": -1, "type": 10001, params: ['app.color.col_20c0b3'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                        Button.onClick(() => {
                            this.onMailClick?.(false);
                        });
                    }, Button);
                    Button.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((e114, f114) => {
                        Button.createWithLabel('删除邮件', { type: ButtonType.Normal, stateEffect: true });
                        Button.width(this.mailContent.props?.length > 0 ? 130 : 200);
                        Button.height(38);
                        Button.margin({ left: 5, right: 5 });
                        Button.borderRadius(10);
                        Button.fontSize(14);
                        Button.fontWeight(500);
                        Button.fontColor(Color.White);
                        Button.backgroundColor("#DC6E6E");
                        Button.onClick(() => {
                            console.log("click login");
                            this.onMailClick?.(true);
                        });
                    }, Button);
                    Button.pop();
                });
            }
        }, If);
        If.pop();
        Flex.pop();
        Column.pop();
        this.showDetail.bind(this)();
        RelativeContainer.pop();
    }
    Webview(v113 = null) {
        this.observeComponentCreation2((w113, x113) => {
            Web.create({
                src: '',
                controller: this.controller
            });
            Web.zoomAccess(false);
            Web.horizontalScrollBarAccess(false);
            Web.height("100%");
            Web.layoutWeight(1);
            Web.backgroundColor("#F4F4F4");
            Web.javaScriptProxy({
                object: this.webFunc,
                name: "JsBridge",
                methodList: Object.keys(ObservedObject.GetRawObject(this.webFunc)),
                controller: this.controller,
            });
            Web.onPageBegin((b114) => {
                Logger.i("onPageBegin:" + JSON.stringify(b114));
            });
            Web.onPageEnd(z113 => {
                Logger.i("onPageEnd:" + JSON.stringify(z113));
                let a114 = `
          const metaTag = document.createElement('meta');
          metaTag.name = 'viewport';
          metaTag.content = 'width=device-width, initial-scale=1.0';
          document.head.appendChild(metaTag);
          document.documentElement.style.fontSize = '14px';
          document.querySelectorAll('img').forEach((img, index) => {
            img.style.width = '20vw';
            img.style.height = 'auto';
            img.style.maxWidth = '100vw';
            img.addEventListener('click', function() {
              let urls = Array.from(document.querySelectorAll('img')).map(img => img.src);
              JsBridge.onImageClick(urls, index);
            });
          });
        `;
                this.controller.runJavaScript(a114);
            });
            Web.onConsole((y113) => {
                console.log(y113?.message.getMessage() + ':' + JSON.stringify(y113?.message.getSourceId));
                return false;
            });
        }, Web);
    }
    showDetail(y112 = null) {
        this.observeComponentCreation2((z112, a113) => {
            If.create();
            if (this.propIndex >= 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((t113, u113) => {
                        Column.create();
                        Column.alignItems(HorizontalAlign.Start);
                        Column.height(148);
                        Column.width(148);
                        Column.borderRadius(8);
                        Column.shadow({
                            radius: 10,
                            color: Color.Gray
                        });
                        Column.alignRules({
                            left: { anchor: '__container__', align: HorizontalAlign.Center },
                            center: { anchor: '__container__', align: VerticalAlign.Center }
                        });
                        Column.onClick(() => {
                        });
                        Column.backgroundColor(Color.White);
                    }, Column);
                    this.observeComponentCreation2((r113, s113) => {
                        Row.create();
                        Row.margin({ left: 8, top: 4 });
                    }, Row);
                    this.observeComponentCreation2((p113, q113) => {
                        RelativeContainer.create();
                        RelativeContainer.borderWidth(1);
                        RelativeContainer.borderColor("#E1E1E1");
                        RelativeContainer.borderRadius(6);
                        RelativeContainer.height(46);
                        RelativeContainer.width(46);
                    }, RelativeContainer);
                    this.observeComponentCreation2((n113, o113) => {
                        Image.create(this.mailContent.props[this.propIndex]?.icon);
                        Image.height(36);
                        Image.margin({ left: 8, right: 8, top: 4 });
                        Image.objectFit(ImageFit.Contain);
                        Image.autoResize(true);
                    }, Image);
                    RelativeContainer.pop();
                    this.observeComponentCreation2((l113, m113) => {
                        Column.create();
                        Column.margin({ left: 8, top: 8 });
                        Column.layoutWeight(1);
                        Column.alignItems(HorizontalAlign.Start);
                    }, Column);
                    this.observeComponentCreation2((j113, k113) => {
                        Text.create(this.mailContent.props[this.propIndex]?.name);
                        Text.maxLines(1);
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontSize(14);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((h113, i113) => {
                        Text.create(`还有${this.mailContent.props[this.propIndex].time_limit}天到期`);
                        Text.maxLines(1);
                        Text.fontSize(13);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((f113, g113) => {
                        Text.create(`x${this.mailContent.props[this.propIndex].count}${this.mailContent.props[this.propIndex].count_format}`);
                        Text.maxLines(1);
                        Text.fontSize(13);
                    }, Text);
                    Text.pop();
                    Column.pop();
                    Row.pop();
                    this.observeComponentCreation2((d113, e113) => {
                        Scroll.create();
                        Scroll.layoutWeight(1);
                        Scroll.align(Alignment.TopStart);
                        Scroll.margin({
                            left: 8,
                            top: 8,
                            bottom: 8,
                            right: 8
                        });
                    }, Scroll);
                    this.observeComponentCreation2((b113, c113) => {
                        Text.create(this.mailContent.props[this.propIndex]?.describe);
                        Text.fontColor("#767676");
                        Text.fontSize(11);
                    }, Text);
                    Text.pop();
                    Scroll.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
