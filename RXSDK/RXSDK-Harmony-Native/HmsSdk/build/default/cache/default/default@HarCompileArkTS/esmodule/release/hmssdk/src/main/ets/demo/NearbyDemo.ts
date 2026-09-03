// @keepTs
// @ts-nocheck
import { __MODULE_NAME__, __BUNDLE_NAME__ } from "@normalized:N&&&hmssdk/build/default/generated/profile/default/ModuleInfo&4.0.0";
if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface NearbyDemo_Params {
    title?: Resource;
    text?: string;
    scroller?: Scroller;
    nearbyGameDevices?: Array<gameNearbyTransfer.NearbyGameDevice>;
}
import gameNearbyTransfer from "@hms:core.gameservice.gamenearbytransfer";
import { LengthMetrics } from "@ohos:arkui.node";
import promptAction from "@ohos:promptAction";
import pasteboard from "@ohos:pasteboard";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import type common from "@ohos:app.ability.common";
import { NearbyEventType, NearbyTransferService } from "@normalized:N&&&hmssdk/src/main/ets/nearby/NearbyTransferService&4.0.0";
import { FileUtil } from "@normalized:N&&&hmssdk/src/main/ets/utils/FileUtil&4.0.0";
import Devices from "@normalized:N&&&hmssdk/src/main/ets/utils/Devices&4.0.0";
class NearbyDemo extends ViewPU {
    constructor(h47, i47, j47, k47 = -1, l47 = undefined, m47) {
        super(h47, j47, k47, m47);
        if (typeof l47 === "function") {
            this.paramsGenerator_ = l47;
        }
        this.__title = new ObservedPropertyObjectPU({ "id": -1, "type": 20000, params: ['app.media.rx_logo'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ }, this, "title");
        this.__text = new ObservedPropertySimplePU('log', this, "text");
        this.scroller = new Scroller();
        this.nearbyGameDevices = undefined;
        this.setInitiallyProvidedValue(i47);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(g47: NearbyDemo_Params) {
        if (g47.title !== undefined) {
            this.title = g47.title;
        }
        if (g47.text !== undefined) {
            this.text = g47.text;
        }
        if (g47.scroller !== undefined) {
            this.scroller = g47.scroller;
        }
        if (g47.nearbyGameDevices !== undefined) {
            this.nearbyGameDevices = g47.nearbyGameDevices;
        }
    }
    updateStateVars(f47: NearbyDemo_Params) {
    }
    purgeVariableDependenciesOnElmtId(e47) {
        this.__title.purgeDependencyOnElmtId(e47);
        this.__text.purgeDependencyOnElmtId(e47);
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
    set title(d47: Resource) {
        this.__title.set(d47);
    }
    private __text: ObservedPropertySimplePU<string>;
    get text() {
        return this.__text.get();
    }
    set text(c47: string) {
        this.__text.set(c47);
    }
    private scroller: Scroller;
    private nearbyGameDevices?: Array<gameNearbyTransfer.NearbyGameDevice>;
    showText(a47: string | object, b47?: any) {
        if (typeof a47 == 'object') {
            this.text = JSON.stringify(a47, null, 2) + (b47 ? JSON.stringify(b47, null, 2) : "");
        }
        else {
            this.text = a47 + (b47 ? JSON.stringify(b47, null, 2) : "");
        }
        Logger.debug(a47, b47);
    }
    aboutToAppear(): void {
        this.init();
    }
    aboutToDisappear(): void {
    }
    init() {
        let o46 = this.getUIContext().getHostContext() as common.UIAbilityContext;
        let p46: gameNearbyTransfer.CreateParameters = {
            abilityName: o46.abilityInfo.name,
            moduleName: o46.abilityInfo.moduleName,
            needShowSystemUI: true,
            mode: gameNearbyTransfer.Mode.API
        };
        NearbyTransferService.getInstance().create(this.getUIContext(), p46, (x46) => {
            if (x46.code == 0) {
                let z46: any = x46.data;
            }
            else {
                let y46 = x46.message;
            }
        });
        NearbyTransferService.getInstance().registerCallback((q46) => {
            if (q46.type == NearbyEventType.connectNotify) {
                let v46 = q46.data as gameNearbyTransfer.ConnectNotification;
                if (q46.code == 0) {
                    let w46 = q46.data.isSender ? "客户端" : "服务端";
                    if (q46.data.isSender) {
                        this.showText(`连接服务成功，,当前为${w46} `, q46);
                    }
                    else {
                        this.showText(`收到连接，当前为${w46} `, q46);
                        this.sendPackage();
                    }
                }
                else {
                    this.showText(`连接状态异常， code= ${q46.code},message=` + q46.message);
                }
            }
            else if (q46.type == NearbyEventType.receivePackageInfo) {
                let u46 = q46.data as gameNearbyTransfer.PackageInfo;
                this.showText(`收到包信息`, q46.data);
            }
            else if (q46.type == NearbyEventType.transferNotify) {
                let r46 = q46.data as gameNearbyTransfer.TransferNotification;
                if (r46.transferState == 6) {
                    const s46 = this.getUIContext().getHostContext() as common.UIAbilityContext;
                    let t46 = FileUtil.getFileList(q46.data.fileStoragePath);
                    Logger.d("fileStoragePath:" + q46.data.fileStoragePath);
                    this.showText("接收到文件：", t46);
                    FileUtil.copyDir(q46.data.fileStoragePath, s46.filesDir);
                }
                else {
                    Logger.d("传输状态：", q46);
                }
            }
            else {
                Logger.d("状态监听：", q46);
            }
        });
    }
    replaySendPackage(k46?: gameNearbyTransfer.PackageInfoResultCode) {
        let l46: gameNearbyTransfer.PackageInfoResult = {
            packageInfoResultCode: k46 ?? gameNearbyTransfer.PackageInfoResultCode.PACKAGE_AVAILABLE_COMPARED,
            message: `包信息比对结果 code:${k46}}`
        };
        NearbyTransferService.getInstance().replyPackageInfoResult(l46, (m46) => {
            if (m46.code == 0) {
            }
            else {
                let n46 = m46.message;
            }
            Logger.d("replyPackageInfoResult:", m46);
        });
    }
    async sendPackage() {
        const h46 = this.getUIContext().getHostContext() as common.UIAbilityContext;
        let i46: gameNearbyTransfer.PackageInfo = {
            name: "device-" + Devices.deviceCode,
            version: "1.1.0",
            files: await FileUtil.getFileListWithHash(h46.filesDir)
        };
        NearbyTransferService.getInstance().sendPackageInfo(i46, (j46) => {
            if (j46.code == 0) {
                this.showText("sendPackageInfo data=" + JSON.stringify(i46));
            }
            else {
                Logger.e("sendPackageInfo:" + JSON.stringify(i46) + ",error:" + JSON.stringify(j46));
                this.showText("sendPackageInfo failed:" + JSON.stringify(j46));
            }
        });
    }
    initialRender() {
        this.observeComponentCreation2((f46, g46) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((d46, e46) => {
            Scroll.create(this.scroller);
            Scroll.layoutWeight(1);
            Scroll.align(Alignment.TopStart);
            Scroll.margin({ left: 20, right: 20, bottom: 10 });
            Scroll.scrollable(ScrollDirection.Vertical);
            Scroll.scrollBar(BarState.Off);
            Scroll.friction(0.6);
        }, Scroll);
        this.observeComponentCreation2((b46, c46) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((z45, a46) => {
            Flex.create({
                wrap: FlexWrap.Wrap,
                justifyContent: FlexAlign.SpaceBetween,
                space: { main: LengthMetrics.vp(10), cross: LengthMetrics.vp(10) }
            });
        }, Flex);
        this.observeComponentCreation2((x45, y45) => {
            Button.createWithLabel("初始化");
            __Button__btnStyle();
            Button.onClick(async () => {
                this.init();
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((u45, v45) => {
            Button.createWithLabel("destroy");
            __Button__btnStyle();
            Button.onClick(async () => {
                NearbyTransferService.getInstance().destroy((w45) => {
                    this.showText(" destroy data = " + JSON.stringify(w45));
                });
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((q45, r45) => {
            Button.createWithLabel("自动连接服务");
            __Button__btnStyle();
            Button.onClick(async () => {
                NearbyTransferService.getInstance().autoBindNearbyGame((s45) => {
                    if (s45.code == 0) {
                        this.showText("自动连接服务中...");
                    }
                    else {
                        let t45 = s45.message;
                        this.showText("自动连接失败 :", s45);
                    }
                });
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((m45, n45) => {
            Button.createWithLabel("开启服务");
            __Button__btnStyle();
            Button.onClick(async () => {
                NearbyTransferService.getInstance().publishNearbyGame((o45) => {
                    if (o45.code == 0) {
                        this.showText("服务开启，等待连接。。。");
                    }
                    else {
                        let p45 = o45.message;
                        this.showText("服务开启失败:", o45);
                    }
                });
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((h45, i45) => {
            Button.createWithLabel("手动发现服务");
            __Button__btnStyle();
            Button.onClick(async () => {
                NearbyTransferService.getInstance().discovery((j45) => {
                    let k45 = j45.data as gameNearbyTransfer.DiscoveryResult;
                    this.nearbyGameDevices = j45.data.nearbyGameDevices;
                    if (j45.code == 0) {
                    }
                    else {
                        let l45 = j45.message;
                    }
                    this.showText(j45);
                });
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((c45, d45) => {
            Button.createWithLabel("手动连接服务");
            __Button__btnStyle();
            Button.onClick(async () => {
                this.nearbyGameDevices?.forEach((e45) => {
                    NearbyTransferService.getInstance().bindNearbyGame(e45, (f45) => {
                        if (f45.code == 0) {
                        }
                        else {
                            let g45 = f45.message;
                        }
                        this.showText("连接服务中...:", f45);
                    });
                });
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((a45, b45) => {
            Button.createWithLabel("发送包信息");
            __Button__btnStyle();
            Button.onClick(async () => {
                this.sendPackage();
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((y44, z44) => {
            Button.createWithLabel("响应发送包 AVAILABLE");
            __Button__btnStyle();
            Button.onClick(async () => {
                this.replaySendPackage(gameNearbyTransfer.PackageInfoResultCode.PACKAGE_AVAILABLE_COMPARED);
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((w44, x44) => {
            Button.createWithLabel("响应发送包  UNAVAILABLE");
            __Button__btnStyle();
            Button.onClick(async () => {
                this.replaySendPackage(gameNearbyTransfer.PackageInfoResultCode.PACKAGE_UNAVAILABLE_COMPARED);
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((u44, v44) => {
            Button.createWithLabel("响应发送包  Error");
            __Button__btnStyle();
            Button.onClick(async () => {
                this.replaySendPackage(gameNearbyTransfer.PackageInfoResultCode.ERROR);
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((n44, o44) => {
            Button.createWithLabel("发送文件");
            __Button__btnStyle();
            Button.onClick(async () => {
                const p44 = this.getUIContext().getHostContext() as common.UIAbilityContext;
                let q44: gameNearbyTransfer.PackageData = {
                    files: FileUtil.getFileList(p44.filesDir).map((t44) => ({
                        srcPath: p44.filesDir + t44,
                        destPath: t44,
                    } as gameNearbyTransfer.PackageFile))
                };
                NearbyTransferService.getInstance().transferPackageData(q44, (r44) => {
                    if (r44.code == 0) {
                        this.showText("发送数据：" + JSON.stringify(q44));
                    }
                    else {
                        let s44 = r44.message;
                        this.showText("发送数据  failed：" + JSON.stringify(r44));
                    }
                });
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((j44, k44) => {
            Button.createWithLabel("文件列表");
            __Button__btnStyle();
            Button.onClick(async () => {
                const l44 = this.getUIContext().getHostContext() as common.UIAbilityContext;
                let m44 = FileUtil.getFileList(l44.filesDir);
                this.showText(m44);
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((f44, g44) => {
            Button.createWithLabel("文件列表信息");
            __Button__btnStyle();
            Button.onClick(async () => {
                const h44 = this.getUIContext().getHostContext() as common.UIAbilityContext;
                let i44 = await FileUtil.getFileListWithHash(h44.filesDir);
                this.showText(i44);
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((z43, a44) => {
            Button.createWithLabel("copyRaw");
            __Button__btnStyle();
            Button.onClick(async () => {
                const b44 = this.getUIContext().getHostContext() as common.UIAbilityContext;
                let c44 = b44.resourceManager.isRawDir("media");
                let d44 = b44.resourceManager.isRawDir("test");
                let e44: Array<string> = b44.resourceManager.getRawFileListSync("");
                Logger.d(e44);
                FileUtil.extractRawFiles(b44, "");
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((v43, w43) => {
            Button.createWithLabel("copy");
            __Button__btnStyle();
            Button.onClick(async () => {
                const x43 = this.getUIContext().getHostContext() as common.UIAbilityContext;
                FileUtil.copyDir(x43.filesDir + "/media", x43.filesDir + "/media_copy", 0);
                let y43 = FileUtil.getFileList(x43.filesDir + "/media_copy");
                this.showText(y43);
            });
        }, Button);
        Button.pop();
        Flex.pop();
        this.observeComponentCreation2((t43, u43) => {
            Divider.create();
            Divider.strokeWidth(2);
            Divider.color('#F1F3F5');
            Divider.margin({ top: 10 });
        }, Divider);
        this.observeComponentCreation2((r43, s43) => {
            Text.create(this.text);
            Text.fontSize(10);
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
    Header(k43 = null) {
        this.observeComponentCreation2((p43, q43) => {
            RelativeContainer.create();
            RelativeContainer.height(30);
        }, RelativeContainer);
        this.observeComponentCreation2((n43, o43) => {
            Row.create();
            Row.alignRules({
                middle: { anchor: "__container__", align: HorizontalAlign.Center },
            });
        }, Row);
        this.observeComponentCreation2((l43, m43) => {
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
        return "NearbyDemo";
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
function copyText(g43: string) {
    const h43 = pasteboard.createData(pasteboard.MIMETYPE_TEXT_PLAIN, g43);
    const i43 = pasteboard.getSystemPasteboard();
    i43.setData(h43);
    i43.getData().then((j43) => {
        if (j43) {
            promptAction.showToast({ message: '复制成功' });
        }
        else {
            promptAction.showToast({ message: '复制失败' });
        }
    });
}
{
    let f43 = 'NearbyDemo';
    registerNamedRoute(() => new NearbyDemo(undefined, {}), f43, { bundleName: __BUNDLE_NAME__, moduleName: __MODULE_NAME__, pagePath: "HmsSdk/src/main/ets/demo/NearbyDemo", pageFullPath: "", integratedHsp: "__harDefaultIntegratedHspType__", moduleType: "byteCodeHar" });
}
