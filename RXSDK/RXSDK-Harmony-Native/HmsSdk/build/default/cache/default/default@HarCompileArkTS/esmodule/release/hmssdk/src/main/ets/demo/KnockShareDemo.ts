// @keepTs
// @ts-nocheck
import { __MODULE_NAME__, __BUNDLE_NAME__ } from "@normalized:N&&&hmssdk/build/default/generated/profile/default/ModuleInfo&4.0.0";
if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface KnockShareDemo_Params {
    title?: Resource;
    text?: string;
    scroller?: Scroller;
    nearbyGameDevices?: Array<gameNearbyTransfer.NearbyGameDevice>;
}
import type gameNearbyTransfer from "@hms:core.gameservice.gamenearbytransfer";
import { LengthMetrics } from "@ohos:arkui.node";
import promptAction from "@ohos:promptAction";
import pasteboard from "@ohos:pasteboard";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import type common from "@ohos:app.ability.common";
import { FileUtil } from "@normalized:N&&&hmssdk/src/main/ets/utils/FileUtil&4.0.0";
class KnockShareDemo extends ViewPU {
    constructor(z42, a43, b43, c43 = -1, d43 = undefined, e43) {
        super(z42, b43, c43, e43);
        if (typeof d43 === "function") {
            this.paramsGenerator_ = d43;
        }
        this.__title = new ObservedPropertyObjectPU({ "id": -1, "type": 20000, params: ['app.media.rx_logo'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ }, this, "title");
        this.__text = new ObservedPropertySimplePU('log', this, "text");
        this.scroller = new Scroller();
        this.nearbyGameDevices = undefined;
        this.setInitiallyProvidedValue(a43);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(y42: KnockShareDemo_Params) {
        if (y42.title !== undefined) {
            this.title = y42.title;
        }
        if (y42.text !== undefined) {
            this.text = y42.text;
        }
        if (y42.scroller !== undefined) {
            this.scroller = y42.scroller;
        }
        if (y42.nearbyGameDevices !== undefined) {
            this.nearbyGameDevices = y42.nearbyGameDevices;
        }
    }
    updateStateVars(x42: KnockShareDemo_Params) {
    }
    purgeVariableDependenciesOnElmtId(w42) {
        this.__title.purgeDependencyOnElmtId(w42);
        this.__text.purgeDependencyOnElmtId(w42);
    }
    aboutToBeDeleted() {
        this.__title.aboutToBeDeleted();
        this.__text.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __title: ObservedPropertyObjectPU<Resource>;
    get title() {
        return this.__title.get();
    }
    set title(v42: Resource) {
        this.__title.set(v42);
    }
    private __text: ObservedPropertySimplePU<string>;
    get text() {
        return this.__text.get();
    }
    set text(u42: string) {
        this.__text.set(u42);
    }
    private scroller: Scroller;
    private nearbyGameDevices?: Array<gameNearbyTransfer.NearbyGameDevice>;
    showText(s42: string | object, t42?: any) {
        if (typeof s42 == 'object') {
            this.text = JSON.stringify(s42, null, 2) + (t42 ? JSON.stringify(t42, null, 2) : "");
        }
        else {
            this.text = s42 + (t42 ? JSON.stringify(t42, null, 2) : "");
        }
        Logger.debug(s42, t42);
    }
    aboutToAppear(): void {
    }
    aboutToDisappear(): void {
    }
    initialRender() {
        this.observeComponentCreation2((q42, r42) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((o42, p42) => {
            Scroll.create(this.scroller);
            Scroll.layoutWeight(1);
            Scroll.align(Alignment.TopStart);
            Scroll.margin({ left: 20, right: 20, bottom: 10 });
            Scroll.scrollable(ScrollDirection.Vertical);
            Scroll.scrollBar(BarState.Off);
            Scroll.friction(0.6);
        }, Scroll);
        this.observeComponentCreation2((m42, n42) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((k42, l42) => {
            Flex.create({
                wrap: FlexWrap.Wrap,
                justifyContent: FlexAlign.SpaceBetween,
                space: { main: LengthMetrics.vp(10), cross: LengthMetrics.vp(10) }
            });
        }, Flex);
        this.observeComponentCreation2((i42, j42) => {
            Button.createWithLabel("初始化");
            __Button__btnStyle();
            Button.onClick(async () => {
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((g42, h42) => {
            Button.createWithLabel("自动连接服务");
            __Button__btnStyle();
            Button.onClick(async () => {
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((e42, f42) => {
            Button.createWithLabel("开启服务");
            __Button__btnStyle();
            Button.onClick(async () => {
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((c42, d42) => {
            Button.createWithLabel("手动发现服务");
            __Button__btnStyle();
            Button.onClick(async () => {
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((a42, b42) => {
            Button.createWithLabel("手动连接服务");
            __Button__btnStyle();
            Button.onClick(async () => {
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((y41, z41) => {
            Button.createWithLabel("发送包信息");
            __Button__btnStyle();
            Button.onClick(async () => {
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((w41, x41) => {
            Button.createWithLabel("响应发送包 AVAILABLE");
            __Button__btnStyle();
            Button.onClick(async () => {
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((u41, v41) => {
            Button.createWithLabel("响应发送包  UNAVAILABLE");
            __Button__btnStyle();
            Button.onClick(async () => {
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((s41, t41) => {
            Button.createWithLabel("响应发送包  Error");
            __Button__btnStyle();
            Button.onClick(async () => {
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((q41, r41) => {
            Button.createWithLabel("发送文件");
            __Button__btnStyle();
            Button.onClick(async () => {
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((m41, n41) => {
            Button.createWithLabel("文件列表");
            __Button__btnStyle();
            Button.onClick(async () => {
                const o41 = this.getUIContext().getHostContext() as common.UIAbilityContext;
                let p41 = FileUtil.getFileList(o41.filesDir);
                this.showText(p41);
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((k41, l41) => {
            Button.createWithLabel("文件包信息");
            __Button__btnStyle();
            Button.onClick(async () => {
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((i41, j41) => {
            Button.createWithLabel("destroy");
            __Button__btnStyle();
            Button.onClick(async () => {
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((g41, h41) => {
            Button.createWithLabel("copyRaw");
            __Button__btnStyle();
            Button.onClick(async () => {
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((e41, f41) => {
            Button.createWithLabel("copy");
            __Button__btnStyle();
            Button.onClick(async () => {
            });
        }, Button);
        Button.pop();
        Flex.pop();
        this.observeComponentCreation2((c41, d41) => {
            Divider.create();
            Divider.strokeWidth(2);
            Divider.color('#F1F3F5');
            Divider.margin({ top: 10 });
        }, Divider);
        this.observeComponentCreation2((a41, b41) => {
            Text.create(this.text);
            Text.onClick(() => {
                copyText(this.text);
            });
            Text.alignSelf(ItemAlign.Start);
        }, Text);
        Text.pop();
        Column.pop();
        Scroll.pop();
        Column.pop();
    }
    Header(t40 = null) {
        this.observeComponentCreation2((y40, z40) => {
            RelativeContainer.create();
            RelativeContainer.height(30);
        }, RelativeContainer);
        this.observeComponentCreation2((w40, x40) => {
            Row.create();
            Row.alignRules({
                middle: { anchor: "__container__", align: HorizontalAlign.Center },
            });
        }, Row);
        this.observeComponentCreation2((u40, v40) => {
            Image.create({ "id": -1, "type": 20000, params: ['app.media.rx_logo'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Image.width("143vp");
            Image.height("33vp");
            Image.objectFit(ImageFit.None);
            Image.align(Alignment.Center);
        }, Image);
        Row.pop();
        RelativeContainer.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "KnockShareDemo";
    }
}
function __Button__btnStyle(): void {
    Button.width(140);
    Button.type(ButtonType.Normal);
    Button.labelStyle({
        maxLines: 2
    });
    Button.fontColor("#FF007DFF");
    Button.backgroundColor("#0D000000");
    Button.fontSize(14);
}
function copyText(p40: string) {
    const q40 = pasteboard.createData(pasteboard.MIMETYPE_TEXT_PLAIN, p40);
    const r40 = pasteboard.getSystemPasteboard();
    r40.setData(q40);
    r40.getData().then((s40) => {
        if (s40) {
            promptAction.showToast({ message: '复制成功' });
        }
        else {
            promptAction.showToast({ message: '复制失败' });
        }
    });
}
{
    let o40 = 'KnockShareDemo';
    registerNamedRoute(() => new KnockShareDemo(undefined, {}), o40, { bundleName: __BUNDLE_NAME__, moduleName: __MODULE_NAME__, pagePath: "HmsSdk/src/main/ets/demo/KnockShareDemo", pageFullPath: "", integratedHsp: "__harDefaultIntegratedHspType__", moduleType: "byteCodeHar" });
}
