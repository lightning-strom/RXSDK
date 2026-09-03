// @keepTs
// @ts-nocheck
import { __MODULE_NAME__, __BUNDLE_NAME__ } from "@normalized:N&&&hmssdk/build/default/generated/profile/default/ModuleInfo&4.0.0";
if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
import type { Mail, MailItem } from '../types/MailInterfaces';
import { HeaderComponent } from "@normalized:N&&&hmssdk/src/main/ets/pages/HeaderComponent&4.0.0";
export class MailListComponent extends ViewV2 {
    constructor(r120, s120, t120, u120 = -1, v120, w120) {
        super(r120, u120, w120);
        this.initParam("mailObj", (s120 && "mailObj" in s120) ? s120.mailObj : {
            all_count: 0,
            not_received_count: 0,
            not_read_count: 0,
            list: []
        });
        this.initParam("title", (s120 && "title" in s120) ? s120.title : "邮件");
        this.selectIndex = 0;
        this.onCloseClick = "onCloseClick" in s120 ? s120.onCloseClick : () => { };
        this.onMailClick = "onMailClick" in s120 ? s120.onMailClick : () => { };
        this.onReceiveClick = "onReceiveClick" in s120 ? s120.onReceiveClick : () => { };
        this.finalizeConstruction();
    }
    public resetStateVarsOnReuse(o120: Object): void {
        this.resetParam("mailObj", (o120 && "mailObj" in o120) ? o120.mailObj : {
            all_count: 0,
            not_received_count: 0,
            not_read_count: 0,
            list: []
        });
        this.resetParam("title", (o120 && "title" in o120) ? o120.title : "邮件");
        this.selectIndex = 0;
        this.onCloseClick = "onCloseClick" in o120 ? o120.onCloseClick : (q120?: ClickEvent) => { };
        this.onMailClick = "onMailClick" in o120 ? o120.onMailClick : (p120: MailItem) => { };
        this.onReceiveClick = "onReceiveClick" in o120 ? o120.onReceiveClick : () => { };
    }
    @Param
    readonly mailObj: Mail;
    @Param
    readonly title: ResourceStr;
    @Local
    selectIndex: number;
    @Event
    onCloseClick?: (event?: ClickEvent) => void;
    @Event
    onMailClick?: (mailItem: MailItem) => void;
    @Event
    onReceiveClick?: () => void;
    aboutToAppear(): void {
    }
    close(n120: ClickEvent) {
        this.onCloseClick?.(n120);
    }
    initialRender() {
        this.observeComponentCreation2((l120, m120) => {
            Column.create();
            Column.backgroundColor(Color.White);
            Column.margin({
                left: 30,
                right: 30,
                top: 50,
                bottom: 50
            });
            Column.borderRadius(4);
            Column.constraintSize({ maxWidth: 550, maxHeight: 500 });
        }, Column);
        this.observeComponentCreation2((j120, k120) => {
            __Common__.create();
            __Common__.margin({ top: 4 });
        }, __Common__);
        {
            this.observeComponentCreation2((d120, e120) => {
                if (e120) {
                    let f120 = new HeaderComponent(this, {
                        title: this.title,
                        onClose: (i120) => {
                            this.close(i120);
                        },
                        backVisible: false
                    }, undefined, d120, () => { }, { page: "HmsSdk/src/main/ets/pages/MailListComponent.ets", line: 36, col: 7 });
                    ViewPU.create(f120);
                    let g120 = () => {
                        return {
                            title: this.title,
                            onClose: (h120) => {
                                this.close(h120);
                            },
                            backVisible: false
                        };
                    };
                    f120.paramsGenerator_ = g120;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(d120, {
                        title: this.title,
                        backVisible: false
                    });
                }
            }, { name: "HeaderComponent" });
        }
        __Common__.pop();
        this.observeComponentCreation2((b120, c120) => {
            List.create();
            List.height(-1);
            List.width(-1);
            List.friction(0.7);
            List.padding(8);
            List.margin({ left: 10, right: 10, bottom: 10 });
            List.backgroundColor(" #F4F4F4");
            List.borderRadius(4);
            List.layoutWeight(1);
            List.scrollBar(BarState.Off);
        }, List);
        this.observeComponentCreation2((c119, d119) => {
            ForEach.create();
            const e119 = (f119, g119: number) => {
                const h119 = f119;
                {
                    const i119 = (z119, a120) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(z119);
                        ListItem.create(k119, true);
                        if (!a120) {
                            ListItem.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    };
                    const j119 = (x119, y119) => {
                        ListItem.create(k119, true);
                        ListItem.onClick(() => {
                            this.selectIndex = g119;
                            this.onMailClick?.(h119);
                        });
                    };
                    const k119 = (l119, m119) => {
                        i119(l119, m119);
                        this.observeComponentCreation2((v119, w119) => {
                            Row.create();
                            Row.height(36);
                            Row.alignItems(VerticalAlign.Center);
                        }, Row);
                        this.observeComponentCreation2((t119, u119) => {
                            Image.create(h119.status === 3 ? { "id": -1, "type": 20000, params: ['app.media.ic_mail_close'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ } : { "id": -1, "type": 20000, params: ['app.media.ic_mail_open'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                            Image.width(22);
                            Image.margin({ left: 10, right: 10 });
                            Image.objectFit(ImageFit.Contain);
                            Image.autoResize(true);
                        }, Image);
                        this.observeComponentCreation2((r119, s119) => {
                            Text.create(h119.title);
                            Text.fontColor(h119.status == 3 ? "#444444" : "#616161");
                            Text.fontWeight(h119.status == 3 ? FontWeight.Medium : FontWeight.Normal);
                            Text.fontSize(14);
                            Text.layoutWeight(1);
                            Text.maxLines(1);
                        }, Text);
                        Text.pop();
                        this.observeComponentCreation2((p119, q119) => {
                            Blank.create();
                        }, Blank);
                        Blank.pop();
                        this.observeComponentCreation2((n119, o119) => {
                            Text.create(h119.send_at);
                            Text.fontColor(h119.status == 3 ? "#444444" : "#616161");
                            Text.fontWeight(h119.status == 3 ? FontWeight.Medium : FontWeight.Normal);
                            Text.maxLines(1);
                            Text.fontSize(12);
                            Text.margin({ left: 5, right: 20 });
                        }, Text);
                        Text.pop();
                        Row.pop();
                        ListItem.pop();
                    };
                    this.observeComponentCreation2(j119, ListItem);
                    ListItem.pop();
                }
            };
            this.forEachUpdateFunction(c119, this.mailObj.list, e119, undefined, true, false);
        }, ForEach);
        ForEach.pop();
        List.pop();
        this.observeComponentCreation2((a119, b119) => {
            Row.create();
            Row.margin({ left: 10, right: 10, bottom: 10 });
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((y118, z118) => {
            Image.create(this.mailObj.not_received_count > 0 ? { "id": -1, "type": 20000, params: ['app.media.ic_mail_disable_delete'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ } : { "id": -1, "type": 20000, params: ['app.media.ic_mail_enable_delete'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Image.width(30);
            Image.margin({ right: 10 });
            Image.objectFit(ImageFit.Contain);
            Image.autoResize(true);
        }, Image);
        this.observeComponentCreation2((w118, x118) => {
            Text.create("超过一周的邮件自动删除");
            Text.fontSize(12);
            Text.fontColor("#797979");
            Text.maxLines(1);
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((u118, v118) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((r118, s118) => {
            Button.createWithLabel('一键领取', { type: ButtonType.Normal, stateEffect: true });
            Button.width(92);
            Button.height(30);
            Button.borderRadius(4);
            Button.fontSize(14);
            Button.fontWeight(500);
            Button.fontColor(Color.White);
            Button.enabled(this.mailObj.not_received_count > 0);
            Button.backgroundColor(this.mailObj.not_received_count > 0 ? { "id": -1, "type": 10001, params: ['app.color.col_20c0b3'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ } : "#D9D9D9");
            Button.onClick((t118) => {
                console.log("click receive button");
                this.onReceiveClick?.();
            });
        }, Button);
        Button.pop();
        Row.pop();
        Column.pop();
    }
    public updateStateVars(q118) {
        if (q118 === undefined) {
            return;
        }
        if ("mailObj" in q118) {
            this.updateParam("mailObj", q118.mailObj);
        }
        if ("title" in q118) {
            this.updateParam("title", q118.title);
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
}
