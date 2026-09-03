// @keepTs
// @ts-nocheck
import { __MODULE_NAME__, __BUNDLE_NAME__ } from "@normalized:N&&&hmssdk/build/default/generated/profile/default/ModuleInfo&4.0.0";
if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Demo_Params {
    message?: string;
    title?: Resource;
    userName?: string;
    password?: string;
    text?: string;
    cdkey?: string;
    image?: ResourceStr;
    knockFunc?: string;
    shareScene?: ShareScenes;
    scroller?: Scroller;
    cpuserid?: string;
    agreement?;
    privacy?;
    config?: RXConfig;
}
import display from "@ohos:display";
import { LengthMetrics } from "@ohos:arkui.node";
import promptAction from "@ohos:promptAction";
import type { BusinessError } from "@ohos:base";
import pasteboard from "@ohos:pasteboard";
import { RXApi } from "@normalized:N&&&hmssdk/src/main/ets/sdk/RXApi&4.0.0";
import { LoginMethod, SDKEventType } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { LoginData, LoginParams, RXConfig, RXResult, ShareScenes } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import Devices from "@normalized:N&&&hmssdk/src/main/ets/utils/Devices&4.0.0";
import DateTime from "@normalized:N&&&hmssdk/src/main/ets/utils/DateTime&4.0.0";
import ShareProvider from "@normalized:N&&&hmssdk/src/main/ets/share/ShareProvider&4.0.0";
import Downloader from "@normalized:N&&&hmssdk/src/main/ets/net/Downloader&4.0.0";
import bundleManager from "@ohos:bundle.bundleManager";
import type common from "@ohos:app.ability.common";
import app from "@normalized:N&&&hmssdk/src/main/ets/utils/App&4.0.0";
import { RXRequest } from "@normalized:N&&&hmssdk/src/main/ets/net/RXRequest&4.0.0";
import ZlibUtil from "@normalized:N&&&hmssdk/src/main/ets/utils/ZlibUtil&4.0.0";
import { BufferUtil } from "@normalized:N&&&hmssdk/src/main/ets/utils/BufferUtil&4.0.0";
import type { InitConfig } from '../types/InitConfig';
import AESUtil from "@normalized:N&&&hmssdk/src/main/ets/utils/AESUtil&4.0.0";
import { FileUtil } from "@normalized:N&&&hmssdk/src/main/ets/sdk/RXIndex&4.0.0";
import photoAccessHelper from "@ohos:file.photoAccessHelper";
import fileIo from "@ohos:file.fs";
class Params {
    data1: string;
    nums: number[];
    constructor(m40: string, n40: number[]) {
        this.data1 = m40;
        this.nums = n40;
    }
}
class Demo extends ViewPU {
    constructor(g40, h40, i40, j40 = -1, k40 = undefined, l40) {
        super(g40, i40, j40, l40);
        if (typeof k40 === "function") {
            this.paramsGenerator_ = k40;
        }
        this.__message = new ObservedPropertySimplePU('Hello World', this, "message");
        this.__title = new ObservedPropertyObjectPU({ "id": -1, "type": 20000, params: ['app.media.rx_logo'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ }, this, "title");
        this.__userName = new ObservedPropertySimplePU('', this, "userName");
        this.__password = new ObservedPropertySimplePU('', this, "password");
        this.__text = new ObservedPropertySimplePU('log', this, "text");
        this.__cdkey = new ObservedPropertySimplePU('', this, "cdkey");
        this.__image = new ObservedPropertyObjectPU('', this, "image");
        this.__knockFunc = new ObservedPropertySimplePU('peng-test', this, "knockFunc");
        this.__shareScene = new ObservedPropertySimplePU(2, this, "shareScene");
        this.scroller = new Scroller();
        this.cpuserid = "442099939";
        this.agreement = `<a href='https://gochsyj.pwypyq.com/static/landing/#/v1/legal/terms/guge/00001'>《用户协议》</a>` +
            `、<a href='https://gochsyj.pwypyq.com/static/landing/#/v1/legal/terms/guge/00002'>《隐私政策》</a>`;
        this.privacy = `    在您使用我们（微乐）服务前，请您务必审慎阅读、充分理解${this.agreement}的各条款。同时，您应特别注意前述协议中免除或者限制我们责任的条款、对您权利进行限制的条款、约定争议解决方式和司法管辖的条款。如您已详细阅读并同意${this.agreement}请点击“同意”开始使用我们的服务。`;
        this.config = {
            cpId: "114",
            productId: "1002",
            channelId: "214",
            baseUrls: ["https://cn-api-test.ruixueyun.com"],
            privacyEnable: true,
        };
        this.setInitiallyProvidedValue(h40);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(f40: Demo_Params) {
        if (f40.message !== undefined) {
            this.message = f40.message;
        }
        if (f40.title !== undefined) {
            this.title = f40.title;
        }
        if (f40.userName !== undefined) {
            this.userName = f40.userName;
        }
        if (f40.password !== undefined) {
            this.password = f40.password;
        }
        if (f40.text !== undefined) {
            this.text = f40.text;
        }
        if (f40.cdkey !== undefined) {
            this.cdkey = f40.cdkey;
        }
        if (f40.image !== undefined) {
            this.image = f40.image;
        }
        if (f40.knockFunc !== undefined) {
            this.knockFunc = f40.knockFunc;
        }
        if (f40.shareScene !== undefined) {
            this.shareScene = f40.shareScene;
        }
        if (f40.scroller !== undefined) {
            this.scroller = f40.scroller;
        }
        if (f40.cpuserid !== undefined) {
            this.cpuserid = f40.cpuserid;
        }
        if (f40.agreement !== undefined) {
            this.agreement = f40.agreement;
        }
        if (f40.privacy !== undefined) {
            this.privacy = f40.privacy;
        }
        if (f40.config !== undefined) {
            this.config = f40.config;
        }
    }
    updateStateVars(e40: Demo_Params) {
    }
    purgeVariableDependenciesOnElmtId(d40) {
        this.__message.purgeDependencyOnElmtId(d40);
        this.__title.purgeDependencyOnElmtId(d40);
        this.__userName.purgeDependencyOnElmtId(d40);
        this.__password.purgeDependencyOnElmtId(d40);
        this.__text.purgeDependencyOnElmtId(d40);
        this.__cdkey.purgeDependencyOnElmtId(d40);
        this.__image.purgeDependencyOnElmtId(d40);
        this.__knockFunc.purgeDependencyOnElmtId(d40);
        this.__shareScene.purgeDependencyOnElmtId(d40);
    }
    aboutToBeDeleted() {
        this.__message.aboutToBeDeleted();
        this.__title.aboutToBeDeleted();
        this.__userName.aboutToBeDeleted();
        this.__password.aboutToBeDeleted();
        this.__text.aboutToBeDeleted();
        this.__cdkey.aboutToBeDeleted();
        this.__image.aboutToBeDeleted();
        this.__knockFunc.aboutToBeDeleted();
        this.__shareScene.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __message: ObservedPropertySimplePU<string>;
    get message() {
        return this.__message.get();
    }
    set message(c40: string) {
        this.__message.set(c40);
    }
    private __title: ObservedPropertyObjectPU<Resource>;
    get title() {
        return this.__title.get();
    }
    set title(b40: Resource) {
        this.__title.set(b40);
    }
    private __userName: ObservedPropertySimplePU<string>;
    get userName() {
        return this.__userName.get();
    }
    set userName(a40: string) {
        this.__userName.set(a40);
    }
    private __password: ObservedPropertySimplePU<string>;
    get password() {
        return this.__password.get();
    }
    set password(z39: string) {
        this.__password.set(z39);
    }
    private __text: ObservedPropertySimplePU<string>;
    get text() {
        return this.__text.get();
    }
    set text(y39: string) {
        this.__text.set(y39);
    }
    private __cdkey: ObservedPropertySimplePU<string>;
    get cdkey() {
        return this.__cdkey.get();
    }
    set cdkey(x39: string) {
        this.__cdkey.set(x39);
    }
    private __image: ObservedPropertyObjectPU<ResourceStr>;
    get image() {
        return this.__image.get();
    }
    set image(w39: ResourceStr) {
        this.__image.set(w39);
    }
    private __knockFunc: ObservedPropertySimplePU<string>;
    get knockFunc() {
        return this.__knockFunc.get();
    }
    set knockFunc(v39: string) {
        this.__knockFunc.set(v39);
    }
    private __shareScene: ObservedPropertySimplePU<ShareScenes>;
    get shareScene() {
        return this.__shareScene.get();
    }
    set shareScene(u39: ShareScenes) {
        this.__shareScene.set(u39);
    }
    private scroller: Scroller;
    private cpuserid: string;
    private agreement;
    private privacy;
    private config: RXConfig;
    showText(s39: string | object, t39: string = "") {
        Logger.debug(s39);
        if (typeof s39 == 'object') {
            this.text = t39 + JSON.stringify(s39, null, 2);
        }
        else {
            this.text = t39 + s39;
        }
    }
    aboutToAppear(): void {
        let o39: display.Display | null = null;
        o39 = display.getDefaultDisplaySync();
        console.info('rxsdk display getDefaultDisplaySync: ' + JSON.stringify(o39));
        o39.getCutoutInfo((p39: BusinessError, q39: display.CutoutInfo) => {
            const r39: number = p39.code;
            if (r39) {
                console.error(`rxsdk display Failed to get cutoutInfo. Code: ${p39.code}, message: ${p39.message}`);
                return;
            }
            console.info('rxsdk display getCutoutInfo: ' + JSON.stringify(q39));
        });
        ShareProvider.onKnockShare(() => {
            this.invokeKnockShare();
        });
    }
    private invokeKnockShare() {
        ShareProvider.share(getContext(), {
            platform: 'hw_knock',
            func: this.knockFunc,
            protocol_android: 'huawei',
            protocol_ios: 'huawei'
        }, (n39) => {
            this.showText(n39);
        });
    }
    aboutToDisappear(): void {
        ShareProvider.offKnockShare();
    }
    private init() {
        RXApi.getInstance()
            .init(this.config, this.getUIContext())
            .then((m39: RXResult<InitConfig>) => {
            Logger.d("init result:  " + JSON.stringify(m39));
            this.showText(m39);
        })
            .catch((l39: BusinessError) => {
            Logger.d("init failed:" + l39.message);
            Logger.e(l39);
            this.showText(l39);
            promptAction.showToast({ message: JSON.stringify(l39) });
        })
            .then(() => {
            RXApi.getInstance().registerSdkEvent<LoginData>(SDKEventType.OnPlayerDataChanged, (k39) => {
                Logger.d("OnPlayerDataChanged:" + JSON.stringify(k39));
                this.showText(k39);
            });
        });
    }
    initialRender() {
        this.observeComponentCreation2((i39, j39) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((g39, h39) => {
            Scroll.create(this.scroller);
            Scroll.align(Alignment.TopStart);
            Scroll.layoutWeight(1);
            Scroll.margin({ left: 20, right: 20, bottom: 10 });
            Scroll.scrollable(ScrollDirection.Vertical);
            Scroll.scrollBar(BarState.Off);
            Scroll.friction(0.6);
        }, Scroll);
        this.observeComponentCreation2((e39, f39) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((c39, d39) => {
            Text.create(JSON.stringify(this.config));
            Text.margin({ top: 5 });
            Text.onClick(() => {
                copyText(JSON.stringify(this.config));
            });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((a39, b39) => {
            Divider.create();
            Divider.strokeWidth(2);
            Divider.color('#F1F3F5');
            Divider.margin({ top: 10 });
        }, Divider);
        this.observeComponentCreation2((y38, z38) => {
            Flex.create({
                wrap: FlexWrap.Wrap,
                justifyContent: FlexAlign.SpaceBetween,
                space: { main: LengthMetrics.vp(10), cross: LengthMetrics.vp(10) }
            });
        }, Flex);
        this.observeComponentCreation2((w38, x38) => {
            Button.createWithLabel("Init");
            __Button__btnStyle();
            Button.onClick(async () => {
                this.init();
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((u38, v38) => {
            Button.createWithLabel("test");
            __Button__btnStyle();
            Button.onClick(async () => {
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((s38, t38) => {
            Button.createWithLabel("碰一碰大卡");
            __Button__btnStyle();
            Button.onClick(async () => {
                this.knockFunc = 'peng-big';
                promptAction.showToast({ message: "已切换为碰一碰大卡模式" });
                this.showText(Devices.model);
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((q38, r38) => {
            Button.createWithLabel("碰一碰小卡");
            __Button__btnStyle();
            Button.onClick(async () => {
                this.knockFunc = 'peng-small';
                promptAction.showToast({ message: "已切换为碰一碰小卡模式" });
                Devices.getNetCapabilities();
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((n38, o38) => {
            Button.createWithLabel("testDevice");
            __Button__btnStyle();
            Button.onClick(async () => {
                let p38 = Devices.genUUID();
                Devices.setTestDevices(p38);
                promptAction.showToast({ message: p38 });
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((l38, m38) => {
            Button.createWithLabel("LaunchWant");
            __Button__btnStyle();
            Button.onClick(async () => {
                this.showText(JSON.stringify(Devices.launchWant));
                RXRequest.get("https://cn-api-test.ruixueyun.com/v1/jump/1");
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((j38, k38) => {
            Button.createWithLabel("getBundleInfo");
            __Button__btnStyle();
            Button.onClick(async () => {
                this.showText(Devices.getBundleInfo(bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_APPLICATION | bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_SIGNATURE_INFO));
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((h38, i38) => {
            Button.createWithLabel("MetaData");
            __Button__btnStyle();
            Button.onClick(async () => {
                this.showText(Devices.metaData);
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((c38, d38) => {
            Button.createWithLabel("微信登录");
            __Button__btnStyle();
            Button.onClick(async () => {
                let e38: LoginParams = {
                    method: LoginMethod.Wechat,
                };
                RXApi.getInstance().login(e38, (f38, g38) => {
                    this.showText(JSON.stringify(g38), "微信登录结果：");
                });
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((z37, a38) => {
            Button.createWithLabel("getShareData");
            __Button__btnStyle();
            Button.onClick(async () => {
                let b38 = await RXApi.getInstance().share().getShareData({
                    func: 'fish',
                    platform: 'wechat',
                    protocol_android: 'ruixue',
                    protocol_ios: 'ruixue'
                });
                this.showText(b38);
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((x37, y37) => {
            Button.createWithLabel("SetPasteboard");
            __Button__btnStyle();
            Button.onClick(async () => {
                Devices.setPasteboardData("type=rx&user_source=attrs&name=John%20Doe&id=12345&location=New%20York&date=" + DateTime.getRFC3339());
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((v37, w37) => {
            Button.createWithLabel("RXPasteboard");
            __Button__btnStyle();
            Button.onClick(async () => {
                this.showText(Devices.getRXPasteboardData(true));
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((t37, u37) => {
            Button.createWithLabel("Pasteboard");
            __Button__btnStyle();
            Button.onClick(async () => {
                this.showText(await Devices.getPasteboardData(getContext()));
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((r37, s37) => {
            Button.createWithLabel("FuncShareLink");
            __Button__btnStyle();
            Button.onClick(async () => {
                ShareProvider.share(getContext(), {
                    platform: 'system',
                    title: "系统分享卡片标题",
                    content: "系统分享卡片描述",
                    url: "https://rxfile-test.ruixueyun.com/sdk",
                    share_scene: 2,
                    func: 'fish',
                    protocol_android: 'ruixue',
                    protocol_ios: 'ruixue'
                });
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((p37, q37) => {
            Button.createWithLabel("FuncShareImage");
            __Button__btnStyle();
            Button.onClick(async () => {
                ShareProvider.share(getContext(), {
                    platform: 'system',
                    title: "系统分享卡片标题",
                    content: "系统分享卡片描述",
                    url: "https://rxfile-test.ruixueyun.com/sdk",
                    share_scene: 2,
                    func: ']image-test',
                    protocol_android: 'ruixue',
                    protocol_ios: 'ruixue'
                });
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((n37, o37) => {
            Button.createWithLabel("ShareLink");
            __Button__btnStyle();
            Button.onClick(async () => {
                ShareProvider.share(getContext(this) as common.UIAbilityContext, {
                    platform: 'system',
                    share_scene: this.shareScene,
                    material_type: 'link',
                    url: 'https://sharekitdemo.drcn.agconnect.link/ZB3p',
                    title: '系统分享标题',
                    content: '系统分享描述',
                });
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((l37, m37) => {
            Button.createWithLabel("ShareImage");
            __Button__btnStyle();
            Button.onClick(async () => {
                RXApi.getInstance().share().shareCustom(getContext(this) as common.UIAbilityContext, {
                    platform: 'system',
                    share_scene: this.shareScene,
                    material_type: 'image',
                    image: 'https://haiqi-ruixue-test.oss-cn-beijing.aliyuncs.com/docOnline/0900086000028175946.20241223180103.69023438101196047176677034043385-1736751147180.jpg',
                    title: '分享标题',
                    content: '分享描述',
                });
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((j37, k37) => {
            Button.createWithLabel("微信分享文本");
            __Button__btnStyle();
            Button.onClick(async () => {
                RXApi.getInstance().share().shareCustom(getContext(this) as common.UIAbilityContext, {
                    platform: 'wechat',
                    share_scene: this.shareScene,
                    material_type: 'text',
                    title: '分享标题',
                    content: '分享描述',
                });
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((h37, i37) => {
            Button.createWithLabel("微信分享链接");
            __Button__btnStyle();
            Button.onClick(async () => {
                RXApi.getInstance().share().shareCustom(getContext(this) as common.UIAbilityContext, {
                    platform: 'wechat',
                    share_scene: this.shareScene,
                    material_type: 'link',
                    url: 'https://developer.huawei.com/consumer/cn/doc/design-guides/radio-0000001929853288',
                    title: '分享链接标题',
                    content: '分享链接描述',
                });
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((f37, g37) => {
            Button.createWithLabel("微信分享图片");
            __Button__btnStyle();
            Button.onClick(async () => {
                RXApi.getInstance().share().shareCustom(getContext(this) as common.UIAbilityContext, {
                    platform: 'wechat',
                    share_scene: this.shareScene,
                    material_type: 'image',
                    url: 'https://developer.huawei.com/consumer/cn/doc/design-guides/radio-0000001929853288',
                    image: 'https://haiqi-ruixue-test.oss-cn-beijing.aliyuncs.com/docOnline/0900086000028175946.20241223180103.69023438101196047176677034043385-1736751147180.jpg',
                    title: '分享图片标题',
                    content: '分享图片描述',
                });
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((d37, e37) => {
            Button.createWithLabel("OpenLink");
            __Button__btnStyle();
            Button.onClick(async () => {
                app.openLink("https://rxfile-test.ruixueyun.com/home");
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((b37, c37) => {
            Button.createWithLabel("OpenBrowser");
            __Button__btnStyle();
            Button.onClick(async () => {
                app.startBrowser("https://rxfile-test.ruixueyun.com/home");
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((y36, z36) => {
            Button.createWithLabel("Download");
            __Button__btnStyle();
            Button.onClick(async () => {
                Downloader.create('https://haiqi-ruixue-test.oss-cn-beijing.aliyuncs.com/docOnline/0900086000028175946.20241223180103.69023438101196047176677034043385-1736751147180.jpg', getContext())
                    .startDownload((a37) => {
                    this.showText(JSON.stringify(a37));
                });
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((l36, m36) => {
            Button.createWithLabel('保存到相册');
            __Button__btnStyle();
            Button.onClick(async () => {
                let n36 = "https://cgjcdn.chaogujieapp.com/2025/12/26/1766735704892.png";
                Downloader.create(n36, getContext(this))
                    .startDownload(async (o36) => {
                    let p36 = o36.filePath;
                    this.showText(JSON.stringify(o36));
                    try {
                        let r36: Array<photoAccessHelper.PhotoCreationConfig> = [
                            {
                                fileNameExtension: n36.split('.').pop() || '',
                                photoType: photoAccessHelper.PhotoType.IMAGE,
                                subtype: photoAccessHelper.PhotoSubtype.DEFAULT,
                            }
                        ];
                        const s36 = FileUtil.getUriFromPath(p36);
                        let t36: Array<string> = [
                            s36
                        ];
                        const u36 = photoAccessHelper.getPhotoAccessHelper(getContext());
                        let v36: Array<string> = await u36.showAssetsCreationDialog(t36, r36);
                        let w36: fileIo.File = await fileIo.open(v36[0], fileIo.OpenMode.WRITE_ONLY);
                        let x36: fileIo.File = await fileIo.open(s36, fileIo.OpenMode.READ_ONLY);
                        await fileIo.copyFile(x36.fd, w36.fd);
                        fileIo.closeSync(x36);
                        fileIo.closeSync(w36);
                        console.info('rxsdk create asset by dialog successfully');
                    }
                    catch (q36) {
                        console.error(`rxsdk failed to create asset by dialog successfully errCode is: ${q36.code}, ${q36.message}`);
                    }
                });
            });
        }, Button);
        Button.pop();
        Flex.pop();
        this.observeComponentCreation2((j36, k36) => {
            Divider.create();
            Divider.strokeWidth(2);
            Divider.color('#F1F3F5');
            Divider.margin({ top: 10 });
        }, Divider);
        this.observeComponentCreation2((h36, i36) => {
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
    Header(a36 = null) {
        this.observeComponentCreation2((f36, g36) => {
            RelativeContainer.create();
            RelativeContainer.height(30);
        }, RelativeContainer);
        this.observeComponentCreation2((d36, e36) => {
            Row.create();
            Row.alignRules({
                middle: { anchor: "__container__", align: HorizontalAlign.Center },
            });
        }, Row);
        this.observeComponentCreation2((b36, c36) => {
            Image.create({ "id": -1, "type": 20000, params: ['app.media.rx_logo'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Image.width("143vp");
            Image.height("33vp");
            Image.objectFit(ImageFit.None);
            Image.align(Alignment.Center);
        }, Image);
        Row.pop();
        RelativeContainer.pop();
    }
    private async testAes() {
        let s35 = '{"device":{"oaid":"b32eac80-b45c-41f4-b799-fedb6429486f","package_name":"com.ruixue.sdk"},"method":"guest","ext":{}}';
        let t35 = "abc";
        let u35 = '4ca7dacc9332d74e1292c83f0aa3b376';
        let v35 = 'zLG+lSVnj1RwX7C7j91BLFdICJWmHV8aBSNRZoHVRu9GpHb2s0MoZSHOkmDeCYFnmirmCd+SvrDTadYZQ3CET1ILzKKmOkGwzkE0JEugwJ2h3t9GDWPGNw+eNFJy2Paw5jaFr/PQPT0mOsxMNcvMAFerQ7ysHt/CrWi30BoR0PE=';
        let w35 = 'p4L8sU2stopNvY7As39BPlUmziDC0H1CSZdVfAQ7gFjyVjibRm12XoVN+dr2qNFoIUGyRt98aZDEgBng64uNx9bpJoCU5RKvLIWzrH8l5gQUG8OxyEGkeLzBpJ/rwOKovbUcC0XBltnBM/z5MTyqGKIxBQ8bXvx84kAvQyvZ8eg=';
        let x35 = AESUtil.encryptCBC(s35);
        let y35 = AESUtil.decryptCBC(x35);
        console.log("解码 cbc ", y35);
        let z35 = AESUtil.decryptCBC(w35);
        console.log("解码1 cbc", z35);
    }
    private async testCompress() {
        try {
            let h35 = 100;
            let i35 = 0;
            const j35 = Math.floor(Math.random() * (h35 - i35 + 1)) + i35;
            let k35 = generateRandomString(j35);
            k35 = 'hello';
            let l35 = await ZlibUtil.compress(k35);
            let m35 = await ZlibUtil.inflate(k35);
            await ZlibUtil.gzip(k35);
            let n35 = [31, -117, 8, 0, 0, 0, 0, 0, 0, -1, -53, 72, -51, -55, -55, 7, 0, -122, -90, 16, 54, 5, 0, 0, 0];
            let o35 = n35.map(r35 => (r35 < 0 ? r35 + 256 : r35));
            console.log("rxsdk hello:", new Uint8Array(o35).toString());
            let p35 = await ZlibUtil.deflate(l35);
            let q35 = BufferUtil.arrayBufferToString(p35);
            if (q35 != k35) {
                Logger.e(`compress failed: str:${k35} destr: ${q35}`);
            }
            else {
                Logger.d(`compress success: str:${k35} destr: ${q35}`);
            }
        }
        catch (g35) {
            Logger.e(g35);
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Demo";
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
function generateRandomString(b35: number): string {
    const c35 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let d35 = '';
    const e35 = c35.length;
    for (let f35 = 0; f35 < b35; f35++) {
        d35 += c35.charAt(Math.floor(Math.random() * e35));
    }
    return d35;
}
function copyText(x34: string) {
    const y34 = pasteboard.createData(pasteboard.MIMETYPE_TEXT_PLAIN, x34);
    const z34 = pasteboard.getSystemPasteboard();
    z34.setData(y34);
    z34.getData().then((a35) => {
        if (a35) {
            promptAction.showToast({ message: '复制成功' });
        }
        else {
            promptAction.showToast({ message: '复制失败' });
        }
    });
}
{
    let w34 = 'Demo';
    registerNamedRoute(() => new Demo(undefined, {}), w34, { bundleName: __BUNDLE_NAME__, moduleName: __MODULE_NAME__, pagePath: "HmsSdk/src/main/ets/demo/Demo", pageFullPath: "", integratedHsp: "__harDefaultIntegratedHspType__", moduleType: "byteCodeHar" });
}
