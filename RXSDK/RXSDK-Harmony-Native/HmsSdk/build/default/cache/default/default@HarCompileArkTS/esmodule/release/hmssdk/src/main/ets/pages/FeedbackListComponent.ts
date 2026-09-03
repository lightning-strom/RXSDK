// @keepTs
// @ts-nocheck
import { __MODULE_NAME__, __BUNDLE_NAME__ } from "@normalized:N&&&hmssdk/build/default/generated/profile/default/ModuleInfo&4.0.0";
if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface FeedbackListComponent_Params {
    resList?: FeedbackItemBean[];
    title?: ResourceStr;
    onCloseClick?: (event?: ClickEvent) => void;
    onItemClick?: (item: FeedbackItemBean) => void;
    currentPage?: number;
    pageSize?: number;
}
import { HeaderComponent } from "@normalized:N&&&hmssdk/src/main/ets/pages/HeaderComponent&4.0.0";
import type { FeedbackItemBean, RXResult } from '../types/Index';
import Feedback from "@normalized:N&&&hmssdk/src/main/ets/api/Feedback&4.0.0";
import type { FeedbackListBean } from "@normalized:N&&&hmssdk/src/main/ets/api/Feedback&4.0.0";
export class FeedbackListComponent extends ViewPU {
    constructor(t89, u89, v89, w89 = -1, x89 = undefined, y89) {
        super(t89, v89, w89, y89);
        if (typeof x89 === "function") {
            this.paramsGenerator_ = x89;
        }
        this.__resList = new ObservedPropertyObjectPU([
            {
                "id": 213,
                "content": "说明",
                "created_at": "10-12 17:10:05",
                "status": 1,
                "recover_at": "10-15 11:14:58",
                "is_prop": 0
            },
            {
                "id": 212,
                "content": "说明",
                "created_at": "10-12 17:05:24",
                "status": 1,
                "recover_at": "10-15 11:10:00",
                "is_prop": 0
            },
            {
                "id": 214,
                "content": "说明",
                "created_at": "10-12 17:10:46",
                "status": 2,
                "recover_at": "10-15 10:32:15",
                "is_prop": 0
            },
            {
                "id": 215,
                "content": "说明",
                "created_at": "10-12 17:11:37",
                "status": 2,
                "recover_at": "10-15 10:17:05",
                "is_prop": 0
            },
            {
                "id": 222,
                "content": "玩家反馈内容文本展示",
                "created_at": "10-14 16:46:41",
                "status": 2,
                "recover_at": "10-15 10:14:52",
                "is_prop": 1
            },
            {
                "id": 223,
                "content": "玩家反馈内容文本展示",
                "created_at": "10-15 09:05:00",
                "status": 2,
                "recover_at": "10-15 09:59:48",
                "is_prop": 1
            },
            {
                "id": 221,
                "content": "玩家反馈内容文本展示",
                "created_at": "10-14 16:08:47",
                "status": 2,
                "recover_at": "10-14 16:09:58",
                "is_prop": 1
            },
            {
                "id": 220,
                "content": "玩家反馈内容文本展示",
                "created_at": "10-14 15:50:17",
                "status": 2,
                "recover_at": "10-14 15:56:21",
                "is_prop": 1
            },
            {
                "id": 219,
                "content": "说明",
                "created_at": "10-14 15:31:31",
                "status": 2,
                "recover_at": "10-14 15:44:40",
                "is_prop": 0
            },
            {
                "id": 218,
                "content": "说明",
                "created_at": "10-14 09:20:16",
                "status": 2,
                "recover_at": "10-14 13:14:51",
                "is_prop": 1
            }
        ], this, "resList");
        this.__title = new ObservedPropertyObjectPU("我的反馈", this, "title");
        this.onCloseClick = undefined;
        this.onItemClick = undefined;
        this.currentPage = 1;
        this.pageSize = 20;
        this.setInitiallyProvidedValue(u89);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(s89: FeedbackListComponent_Params) {
        if (s89.resList !== undefined) {
            this.resList = s89.resList;
        }
        if (s89.title !== undefined) {
            this.title = s89.title;
        }
        if (s89.onCloseClick !== undefined) {
            this.onCloseClick = s89.onCloseClick;
        }
        if (s89.onItemClick !== undefined) {
            this.onItemClick = s89.onItemClick;
        }
        if (s89.currentPage !== undefined) {
            this.currentPage = s89.currentPage;
        }
        if (s89.pageSize !== undefined) {
            this.pageSize = s89.pageSize;
        }
    }
    updateStateVars(r89: FeedbackListComponent_Params) {
    }
    purgeVariableDependenciesOnElmtId(q89) {
        this.__resList.purgeDependencyOnElmtId(q89);
        this.__title.purgeDependencyOnElmtId(q89);
    }
    aboutToBeDeleted() {
        this.__resList.aboutToBeDeleted();
        this.__title.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __resList: ObservedPropertyObjectPU<FeedbackItemBean[]>;
    get resList() {
        return this.__resList.get();
    }
    set resList(p89: FeedbackItemBean[]) {
        this.__resList.set(p89);
    }
    private __title: ObservedPropertyObjectPU<ResourceStr>;
    get title() {
        return this.__title.get();
    }
    set title(o89: ResourceStr) {
        this.__title.set(o89);
    }
    private onCloseClick?: (event?: ClickEvent) => void;
    private onItemClick?: (item: FeedbackItemBean) => void;
    private currentPage: number;
    private pageSize: number;
    async aboutToAppear() {
        this.getFeedbackList(this.currentPage);
    }
    async getFeedbackList(l89: number) {
        let m89: RXResult<object> = await Feedback.getFeedbackList(l89, this.pageSize);
        if (m89.code == 0 && m89.data) {
            let n89 = m89.data as FeedbackListBean;
            this.currentPage = n89.page;
            this.resList = n89.list;
        }
    }
    close(k89: ClickEvent) {
        this.onCloseClick?.(k89);
    }
    initialRender() {
        this.observeComponentCreation2((i89, j89) => {
            RelativeContainer.create();
            RelativeContainer.backgroundColor(Color.White);
            RelativeContainer.margin({
                left: 30,
                right: 30,
                top: 34,
                bottom: 34
            });
            RelativeContainer.borderRadius(4);
            RelativeContainer.constraintSize({ maxWidth: 550, minHeight: 100, maxHeight: 500 });
        }, RelativeContainer);
        this.observeComponentCreation2((g89, h89) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((e89, f89) => {
            __Common__.create();
            __Common__.margin({ top: 4 });
        }, __Common__);
        {
            this.observeComponentCreation2((y88, z88) => {
                if (z88) {
                    let a89 = new HeaderComponent(this, {
                        title: this.title,
                        onClose: (d89) => {
                            this.close(d89);
                        },
                        backVisible: false
                    }, undefined, y88, () => { }, { page: "HmsSdk/src/main/ets/pages/FeedbackListComponent.ets", line: 121, col: 9 });
                    ViewPU.create(a89);
                    let b89 = () => {
                        return {
                            title: this.title,
                            onClose: (c89) => {
                                this.close(c89);
                            },
                            backVisible: false
                        };
                    };
                    a89.paramsGenerator_ = b89;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(y88, {
                        title: this.title,
                        backVisible: false
                    });
                }
            }, { name: "HeaderComponent" });
        }
        __Common__.pop();
        this.observeComponentCreation2((s88, t88) => {
            List.create({ space: 10 });
            List.width(-1);
            List.height(-1);
            List.divider({ strokeWidth: 1 });
            List.friction(0.7);
            List.padding(10);
            List.layoutWeight(1);
            List.borderRadius(4);
            List.listDirection(Axis.Vertical);
            List.backgroundColor("#F7F7F7");
            List.scrollBar(BarState.Off);
            List.onScrollIndex((u88: number, v88: number, w88: number) => {
                let x88 = Math.ceil(v88 / this.pageSize);
                if (x88 > this.currentPage) {
                    this.getFeedbackList(x88);
                }
            });
            List.margin({
                left: 12,
                right: 12
            });
        }, List);
        this.observeComponentCreation2((u87, v87) => {
            ForEach.create();
            const w87 = (x87, y87: number) => {
                const z87 = x87;
                {
                    const a88 = (q88, r88) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(q88);
                        ListItem.create(c88, true);
                        if (!r88) {
                            ListItem.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    };
                    const b88 = (n88, o88) => {
                        ListItem.create(c88, true);
                        ListItem.onClick((p88) => {
                            this.onItemClick?.(z87);
                        });
                    };
                    const c88 = (d88, e88) => {
                        a88(d88, e88);
                        this.observeComponentCreation2((l88, m88) => {
                            Row.create();
                            Row.padding(4);
                        }, Row);
                        this.observeComponentCreation2((j88, k88) => {
                            Text.create(z87.content);
                            Text.fontColor("#444444");
                            Text.fontWeight(z87.status == 1 ? FontWeight.Medium : FontWeight.Normal);
                            Text.maxLines(1);
                            Text.fontSize(13);
                            Text.layoutWeight(1);
                            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                        }, Text);
                        Text.pop();
                        this.observeComponentCreation2((h88, i88) => {
                            Text.create(z87.status == 1 ? "待回复" : "已处理");
                            Text.fontColor(z87.status == 1 ? "#DC6E6E" : "#20C0B3");
                            Text.maxLines(1);
                            Text.fontSize(13);
                            Text.margin({ left: 8 });
                        }, Text);
                        Text.pop();
                        this.observeComponentCreation2((f88, g88) => {
                            Text.create(z87.created_at);
                            Text.fontColor(z87.status == 1 ? "#444444" : "#797979");
                            Text.margin({ left: 13 });
                            Text.maxLines(1);
                            Text.fontSize(13);
                        }, Text);
                        Text.pop();
                        Row.pop();
                        ListItem.pop();
                    };
                    this.observeComponentCreation2(b88, ListItem);
                    ListItem.pop();
                }
            };
            this.forEachUpdateFunction(u87, this.resList, w87, undefined, true, false);
        }, ForEach);
        ForEach.pop();
        List.pop();
        this.observeComponentCreation2((s87, t87) => {
            Row.create();
            Row.margin({
                left: 12,
                right: 12,
                top: 8,
                bottom: 10
            });
        }, Row);
        this.observeComponentCreation2((q87, r87) => {
            Blank.create();
            Blank.layoutWeight(1);
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((n87, o87) => {
            Button.createWithLabel('关闭', { type: ButtonType.Normal, stateEffect: true });
            Button.width(100);
            Button.height(30);
            Button.borderRadius(4);
            Button.fontSize(14);
            Button.fontWeight(500);
            Button.fontColor(Color.White);
            Button.backgroundColor("#DC6E6E");
            Button.onClick((p87) => {
                this.onCloseClick?.(p87);
            });
        }, Button);
        Button.pop();
        Row.pop();
        Column.pop();
        RelativeContainer.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "FeedbackListComponent";
    }
}
registerNamedRoute(() => new FeedbackListComponent(undefined, {}), "", { bundleName: __BUNDLE_NAME__, moduleName: __MODULE_NAME__, pagePath: "HmsSdk/src/main/ets/pages/FeedbackListComponent", pageFullPath: "", integratedHsp: "__harDefaultIntegratedHspType__", moduleType: "byteCodeHar" });
