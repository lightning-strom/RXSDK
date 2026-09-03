// @keepTs
// @ts-nocheck
import type common from "@ohos:app.ability.common";
import abilityAccessCtrl from "@ohos:abilityAccessCtrl";
import type Want from "@ohos:app.ability.Want";
import { GlobalData } from "@normalized:N&&&hmssdk/src/main/ets/nearby/common/GlobalData&4.0.0";
import gameNearbyTransfer from "@hms:core.gameservice.gamenearbytransfer";
import type { BusinessError } from "@ohos:base";
import deviceInfo from "@ohos:deviceInfo";
import { compareVersion, parseVersionNameFromUri } from "@normalized:N&&&hmssdk/src/main/ets/nearby/common/VersionCompare&4.0.0";
import { TransferDialogManager } from "@normalized:N&&&hmssdk/src/main/ets/nearby/dialog/TransferDialogManager&4.0.0";
import { NearbyLog } from "@normalized:N&&&hmssdk/src/main/ets/nearby/common/NearbyLog&4.0.0";
import Objects from "@normalized:N&&&hmssdk/src/main/ets/utils/Objects&4.0.0";
import { ErrorReport } from "@normalized:N&&&hmssdk/src/main/ets/base/ErrorReport&4.0.0";
import Devices from "@normalized:N&&&hmssdk/src/main/ets/utils/Devices&4.0.0";
export enum NearbyEventType {
    init = "init",
    connectNotify = "connectNotify",
    discovery = "discovery",
    error = "error",
    transferNotify = "transferNotify",
    transferPackageData = "transferPackageData",
    receivePackageInfo = "receivePackageInfo",
    replyPackageInfoResult = "replyPackageInfoResult",
    sendPackageInfo = "sendPackageInfo",
    destroy = "destroy",
    autoBindNearbyGame = "autoBindNearbyGame",
    publishNearbyGame = "publishNearbyGame",
    bindNearbyGame = "bindNearbyGame"
}
interface EventArgs {
    type: NearbyEventType;
    data?: any;
    code: number;
    message?: string;
}
type NearbyEvent = (params: EventArgs) => void;
export class NearbyTransferService {
    private static instance: NearbyTransferService;
    private static _isSender: boolean;
    private uiContext?: UIContext;
    private _isNearbyServiceInitted: boolean = false;
    private _isConnected: boolean = false;
    private _initParam?: gameNearbyTransfer.CreateParameters;
    private static _connectionId: string = "";
    public get isConnected(): boolean {
        return this._isConnected;
    }
    public get isNearbyServiceInitted(): boolean {
        return this._isNearbyServiceInitted;
    }
    public static get isServer(): boolean {
        return !NearbyTransferService._isSender;
    }
    public static get isSender(): boolean {
        return NearbyTransferService._isSender;
    }
    public constructor() {
    }
    public static getInstance(): NearbyTransferService {
        if (!NearbyTransferService.instance) {
            NearbyTransferService.instance = new NearbyTransferService();
        }
        return NearbyTransferService.instance;
    }
    public static isSupport(): boolean {
        if (deviceInfo.sdkApiVersion < 18) {
            let z56 = `API is supported since SDK version 5.1.0(18). However, the current compatible SDK version is ${deviceInfo.sdkApiVersion}`;
            NearbyLog.error(z56);
            return false;
        }
        else {
            return true;
        }
    }
    static report(v56: string, w56: BusinessError | gameNearbyTransfer.ReturnResult, x56?: object, y56?: object) {
        NearbyLog.error(v56, JSON.stringify(w56), x56, y56);
        ErrorReport.report(Objects.assign({
            error_code: w56.code,
            error_msg: w56.message,
            request_body: x56,
            trace_id: NearbyTransferService._connectionId,
            error_action: "rxlog_error_nearby_" + v56,
        }, w56, y56));
    }
    private _toCallback(u56: EventArgs): Array<any> {
        return [JSON.stringify(u56)];
    }
    public async create(i56: UIContext, j56?: gameNearbyTransfer.CreateParameters, k56?: NearbyEvent): Promise<Array<any>> {
        this.uiContext = i56;
        if (!NearbyTransferService.isSupport()) {
            let s56 = `API is supported since SDK version 5.1.0(18). However, the current compatible SDK version is ${deviceInfo.sdkApiVersion}`;
            let t56: EventArgs = { type: NearbyEventType.init, code: -1, message: s56 };
            k56?.(t56);
            NearbyTransferService.report(NearbyEventType.init, t56, j56);
            return Promise.reject(t56);
        }
        if (!i56) {
            let r56: EventArgs = { type: NearbyEventType.init, code: -1, message: "uicontext is null" };
            k56?.(r56);
            NearbyTransferService.report(NearbyEventType.init, r56, j56);
            return Promise.reject(r56);
        }
        let l56 = i56?.getHostContext() as common.UIAbilityContext;
        j56 ??= this._initParam || {
            abilityName: l56.abilityInfo.name,
            moduleName: l56.abilityInfo.moduleName,
        };
        this._initParam = j56;
        NearbyLog.info("init nearby service ", j56);
        if (j56.needShowSystemUI) {
            j56.context = l56;
        }
        try {
            const p56 = await gameNearbyTransfer.create(j56);
            NearbyLog.info("init success:", p56);
            this._isNearbyServiceInitted = true;
            NearbyTransferService._connectionId = Devices.genUUID();
            let q56: EventArgs = { type: NearbyEventType.init, code: 0, data: p56 };
            k56?.(q56);
            return this._toCallback(q56);
        }
        catch (m56) {
            const n56 = m56 as BusinessError;
            NearbyTransferService.report(NearbyEventType.init, m56, j56);
            let o56: EventArgs = {
                type: NearbyEventType.init,
                code: n56.code ?? -1,
                message: n56.message
            };
            k56?.(o56);
            return Promise.reject(o56);
        }
    }
    public registerCallback(y55?: NearbyEvent): Promise<Array<any>> {
        return new Promise((z55) => {
            gameNearbyTransfer.on('connectNotify', async (g56: gameNearbyTransfer.ConnectNotification) => {
                g56["isSender"] = NearbyTransferService.isSender;
                NearbyLog.info("connectNotify=" + JSON.stringify(g56));
                this._isConnected = g56.connectState == gameNearbyTransfer.ConnectState.CONNECTED;
                if (!this._isConnected) {
                    NearbyTransferService.report(NearbyEventType.connectNotify, { code: g56.connectState, message: g56.message }, g56);
                }
                let h56: EventArgs = {
                    code: g56.connectState,
                    type: NearbyEventType.connectNotify,
                    data: { remoteDeviceName: g56.remoteDeviceName, isSender: NearbyTransferService.isSender },
                    message: g56.message
                };
                y55?.(h56);
                z55(this._toCallback(h56));
            });
            gameNearbyTransfer.on('receivePackageInfo', (e56: gameNearbyTransfer.PackageInfo) => {
                NearbyLog.info("receivePackageInfo=" + JSON.stringify(e56));
                let f56: EventArgs = { code: 0, type: NearbyEventType.receivePackageInfo, data: e56 };
                y55?.(f56);
                z55(this._toCallback(f56));
            });
            gameNearbyTransfer.on('transferNotify', (c56: gameNearbyTransfer.TransferNotification) => {
                let d56: EventArgs = { code: 0, type: NearbyEventType.transferNotify, data: c56 };
                y55?.(d56);
                z55(this._toCallback(d56));
            });
            gameNearbyTransfer.on('error', (a56: gameNearbyTransfer.ReturnResult) => {
                NearbyTransferService.report("error", a56);
                let b56: EventArgs = { code: a56.code ?? -1, message: a56.message, type: NearbyEventType.error };
                y55?.(b56);
                z55(this._toCallback(b56));
            });
            NearbyLog.info("registerCallback called");
        });
    }
    public unregisterCallback() {
        try {
            gameNearbyTransfer.off('connectNotify');
            gameNearbyTransfer.off('receivePackageInfo');
            gameNearbyTransfer.off('transferNotify');
            gameNearbyTransfer.off('discovery');
            gameNearbyTransfer.off('error');
        }
        catch (x55) {
            NearbyTransferService.report("error", x55);
            NearbyLog.error(x55);
        }
    }
    public async publishNearbyGame(r55?: NearbyEvent): Promise<Array<any>> {
        try {
            if (!this._isNearbyServiceInitted) {
                NearbyLog.info("NearbyTransferService未初始化，正在初始化。。。");
                await this.create(this.uiContext!);
            }
            let u55: common.UIAbilityContext = this.uiContext?.getHostContext() as common.UIAbilityContext;
            let v55 = abilityAccessCtrl.createAtManager();
            await v55.requestPermissionsFromUser(u55, ['ohos.permission.DISTRIBUTED_DATASYNC']);
            await gameNearbyTransfer.publishNearbyGame();
            NearbyTransferService._isSender = false;
            NearbyLog.info("publishNearbyGame success ");
            let w55: EventArgs = { type: NearbyEventType.publishNearbyGame, code: 0 };
            r55?.(w55);
            return this._toCallback(w55);
        }
        catch (s55) {
            NearbyTransferService.report(NearbyEventType.publishNearbyGame, s55);
            let t55: EventArgs = { type: NearbyEventType.publishNearbyGame, code: s55.code ?? -1, message: s55.message };
            r55?.(t55);
            return this._toCallback(t55);
        }
    }
    public async autoBindNearbyGame(l55?: NearbyEvent): Promise<Array<any>> {
        try {
            if (!this._isNearbyServiceInitted) {
                NearbyLog.info("NearbyTransferService未初始化，正在初始化。。。");
                await this.create(this.uiContext!);
            }
            let o55 = abilityAccessCtrl.createAtManager();
            let p55 = this.uiContext?.getHostContext() as common.UIAbilityContext;
            await o55.requestPermissionsFromUser(p55, ['ohos.permission.DISTRIBUTED_DATASYNC']);
            await gameNearbyTransfer.autoBindNearbyGame();
            let q55: EventArgs = { type: NearbyEventType.autoBindNearbyGame, code: 0 };
            l55?.(q55);
            return this._toCallback(q55);
        }
        catch (m55) {
            NearbyTransferService.report(NearbyEventType.autoBindNearbyGame, m55);
            let n55: EventArgs = { type: NearbyEventType.autoBindNearbyGame, code: m55.code ?? -1, message: m55.message };
            l55?.(n55);
            return this._toCallback(n55);
        }
    }
    public async discovery(e55?: NearbyEvent): Promise<Array<any>> {
        try {
            if (!this._isNearbyServiceInitted) {
                NearbyLog.info("NearbyTransferService未初始化，正在初始化。。。");
                await this.create(this.uiContext!);
            }
            return new Promise((g55) => {
                gameNearbyTransfer.off("discovery");
                gameNearbyTransfer.on("discovery", (j55: gameNearbyTransfer.DiscoveryResult) => {
                    NearbyLog.info("发现设备:", (j55));
                    let k55: EventArgs = { type: NearbyEventType.discovery, code: 0, data: j55 };
                    e55?.(k55);
                    g55(this._toCallback(k55));
                });
                gameNearbyTransfer.discoveryNearbyGame().catch((h55: BusinessError) => {
                    NearbyTransferService.report(NearbyEventType.discovery, h55);
                    let i55: EventArgs = { type: NearbyEventType.discovery, code: h55.code ?? -1, message: h55.message };
                    e55?.(i55);
                    g55(this._toCallback(i55));
                }).then(() => {
                    NearbyLog.info("正在发现设备...");
                });
            });
        }
        catch (f55) {
            e55?.(f55);
            return this._toCallback(f55);
        }
    }
    public async bindNearbyGame(w54: gameNearbyTransfer.NearbyGameDevice, x54?: NearbyEvent): Promise<Array<any>> {
        try {
            if (!this._isNearbyServiceInitted) {
                NearbyLog.info("NearbyTransferService未初始化，正在初始化。。。");
                await this.create(this.uiContext!);
            }
            let a55: gameNearbyTransfer.BindParameters = {
                deviceId: w54.deviceId,
                networkId: w54.networkId
            };
            let b55 = abilityAccessCtrl.createAtManager();
            let c55 = this.uiContext?.getHostContext() as common.UIAbilityContext;
            NearbyLog.info("bindNearbyGame:" + JSON.stringify(a55));
            await b55.requestPermissionsFromUser(c55, ['ohos.permission.DISTRIBUTED_DATASYNC']);
            await gameNearbyTransfer.bindNearbyGame(a55);
            let d55: EventArgs = { type: NearbyEventType.bindNearbyGame, code: 0, data: w54 };
            x54?.(d55);
            return this._toCallback(d55);
        }
        catch (y54) {
            let z54: EventArgs = { type: NearbyEventType.bindNearbyGame, code: y54.code ?? -1, message: y54.message };
            x54?.(z54);
            NearbyTransferService.report(NearbyEventType.bindNearbyGame, y54);
            return this._toCallback(z54);
        }
    }
    public static acceptCollaboration(u54: Record<string, object>) {
        if (NearbyTransferService.isSupport()) {
            gameNearbyTransfer.acceptCollaboration(u54).then(() => {
                NearbyLog.info("gameNearbyTransfer acceptCollaboration success");
            }).catch((v54: BusinessError) => {
                NearbyTransferService.report("acceptCollaboration", v54);
                NearbyLog.error("gameNearbyTransfer acceptCollaboration failed:", v54);
            });
        }
    }
    public async sendPackageInfo(o54: gameNearbyTransfer.PackageInfo, p54?: NearbyEvent): Promise<Array<any>> {
        try {
            if (!this._isConnected) {
                NearbyLog.error("nearby service not connected ");
                NearbyTransferService.report(NearbyEventType.sendPackageInfo, { code: 1, message: "nearby service not connected" });
                let t54: EventArgs = { type: NearbyEventType.sendPackageInfo, code: 1, message: "nearby service not connected" };
                p54?.(t54);
                return this._toCallback(t54);
            }
            NearbyLog.info("sendPackageInfo packageInfo = ", o54);
            await gameNearbyTransfer.sendPackageInfo(o54);
            let s54: EventArgs = { type: NearbyEventType.sendPackageInfo, code: 0 };
            p54?.(s54);
            return this._toCallback(s54);
        }
        catch (q54) {
            NearbyLog.error(JSON.stringify(q54));
            NearbyTransferService.report(NearbyEventType.sendPackageInfo, q54);
            let r54: EventArgs = { type: NearbyEventType.sendPackageInfo, code: q54.code ?? -1, message: q54.message };
            p54?.(r54);
            return this._toCallback(r54);
        }
    }
    public async replyPackageInfoResult(j54: gameNearbyTransfer.PackageInfoResult, k54?: NearbyEvent): Promise<Array<any>> {
        try {
            await gameNearbyTransfer.replyPackageInfoResult(j54);
            let n54: EventArgs = { type: NearbyEventType.replyPackageInfoResult, code: 0 };
            k54?.(n54);
            return this._toCallback(n54);
        }
        catch (l54) {
            NearbyTransferService.report(NearbyEventType.replyPackageInfoResult, l54);
            let m54: EventArgs = { type: NearbyEventType.replyPackageInfoResult, code: l54.code ?? -1, message: l54.message };
            k54?.(m54);
            return this._toCallback(m54);
        }
    }
    public async transferPackageData(d54: gameNearbyTransfer.PackageData, e54?: NearbyEvent): Promise<Array<any>> {
        try {
            if (!this._isConnected) {
                NearbyLog.error("nearby service not connected ");
                NearbyTransferService.report(NearbyEventType.transferPackageData, { code: 1, message: "nearby service not connected" });
                let i54: EventArgs = { type: NearbyEventType.transferPackageData, code: 1, message: "nearby service not connected" };
                e54?.(i54);
                return this._toCallback(i54);
            }
            NearbyLog.info("transferPackageData data = " + JSON.stringify(d54));
            await gameNearbyTransfer.transferPackageData(d54);
            let h54: EventArgs = { type: NearbyEventType.transferPackageData, code: 0 };
            e54?.(h54);
            return this._toCallback(h54);
        }
        catch (f54) {
            NearbyTransferService.report(NearbyEventType.transferPackageData, f54);
            let g54: EventArgs = { type: NearbyEventType.transferPackageData, code: f54.code ?? -1, message: f54.message };
            e54?.(g54);
            NearbyLog.error(JSON.stringify(f54));
            return this._toCallback(g54);
        }
    }
    public async destroy(z53?: NearbyEvent): Promise<Array<any>> {
        try {
            this.unregisterCallback();
            this._isNearbyServiceInitted = false;
            this._isConnected = false;
            NearbyTransferService._connectionId = "";
            GlobalData.reset();
            await gameNearbyTransfer.destroy();
            NearbyLog.info("gameNearbyTransfer destroy success");
            let c54: EventArgs = { type: NearbyEventType.destroy, code: 0 };
            z53?.(c54);
            return this._toCallback(c54);
        }
        catch (a54) {
            console.error(`gameNearbyTransfer destroy failed: ${a54.message}`);
            NearbyTransferService.report(NearbyEventType.destroy, a54);
            let b54: EventArgs = { type: NearbyEventType.destroy, code: a54.code ?? -1, message: a54.message };
            z53?.(b54);
            return this._toCallback(b54);
        }
    }
    public async openDialog(u53: Want, v53: UIContext) {
        let w53 = u53?.uri;
        NearbyLog.info("want收到了 uri=" + w53);
        if (!w53) {
            return;
        }
        let x53 = parseVersionNameFromUri(w53);
        if (x53 == null) {
            return;
        }
        let y53 = compareVersion(x53);
        if (y53 < 0) {
            NearbyTransferService._isSender = true;
            NearbyLog.info("当前角色为发送方");
        }
        else if (y53 > 0) {
            NearbyTransferService._isSender = false;
            NearbyLog.info("当前角色为接收方");
        }
        else {
            return;
        }
        if (!this._isNearbyServiceInitted) {
            NearbyLog.info("NearbyTransferService未初始化，需要先完成初始化");
            await NearbyTransferService.getInstance().create(v53);
        }
        if (!NearbyTransferService._isSender) {
            NearbyLog.info("【接收端】准备发布服务");
            NearbyTransferService.getInstance().publishNearbyGame();
            TransferDialogManager.getInstance(v53)?.openDialog();
        }
    }
}
