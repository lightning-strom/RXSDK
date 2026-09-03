// @keepTs
// @ts-nocheck
import * as wxopensdk from "@normalized:N&&&@tencent/wechat_open_sdk/Index&1.0.16";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import SDKConfig from "@normalized:N&&&hmssdk/src/main/ets/sdk/SDKConfig&4.0.0";
import type common from "@ohos:app.ability.common";
import type Want from "@ohos:app.ability.Want";
import { RXError, RXErrorCode } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import Devices from "@normalized:N&&&hmssdk/src/main/ets/utils/Devices&4.0.0";
import { ShareMediaTypes } from "@normalized:N&&&hmssdk/src/main/ets/types/ShareTypes&4.0.0";
import fileUri from "@ohos:file.fileuri";
import buffer from "@ohos:buffer";
import type { ShareObject } from '../share/ShareObject';
import { WXEventHandler } from "@normalized:N&&&hmssdk/src/main/ets/wx/WXApiEventHandler&4.0.0";
export interface WXAuthParams {
    isOption1?: boolean;
    nonAutomatic?: boolean;
    scope?: string[];
    state?: string;
    extData?: string;
    transaction?: string;
}
export interface WXBusinessParams {
    businessType?: string;
    query: string;
    extInfo?: string;
}
class MockWXResp extends wxopensdk.BaseResp {
    private _type: number;
    constructor(u204: number, v204: number, w204: string) {
        super();
        this._type = u204;
        this.errCode = v204;
        this.errStr = `${w204} ${u204}`;
    }
    get type(): number {
        return this._type;
    }
}
export class WXApi {
    private _appId?: string | undefined;
    private _wxInstance?: wxopensdk.WXApi;
    private static instance: WXApi | null = null;
    public get appId(): string | undefined {
        return this._appId || SDKConfig.WX_APP_ID;
    }
    public get wxInstance(): wxopensdk.WXApi {
        if (!this._wxInstance) {
            this._wxInstance = wxopensdk.WXAPIFactory.createWXAPI(this.appId);
        }
        return this._wxInstance;
    }
    protected constructor(t204?: string) {
        this._appId = t204;
        wxopensdk.WXAPIFactory;
    }
    public static getInstance(s204: string = SDKConfig.WX_APP_ID): WXApi {
        if (!WXApi.instance || WXApi.instance.appId !== s204) {
            if (WXApi.instance) {
                WXApi.instance.unregister();
                WXApi.instance = null;
            }
            WXApi.instance = new WXApi(s204);
            if (!s204) {
                Logger.w('metadata: wx_appid 未配置，请先初始化 wx_appid,如未使用微信功能请忽略。');
            }
        }
        return WXApi.instance;
    }
    public handleWant(r204: Want) {
        this.wxInstance?.handleWant(r204, WXEventHandler);
    }
    public openWechat(q204: common.UIAbilityContext) {
        return this.wxInstance?.openWechat(q204);
    }
    public isWXAppInstalled() {
        return this.wxInstance?.isWXAppInstalled();
    }
    register() {
        WXEventHandler.registerOnWXRespCallback(this.onWXResp);
        WXEventHandler.registerOnWXReqCallback(this.onWXReq);
    }
    unregister() {
        WXEventHandler.unregisterOnWXRespCallback(this.onWXResp);
        WXEventHandler.unregisterOnWXReqCallback(this.onWXReq);
    }
    onWXResp(p204: wxopensdk.BaseResp): void {
    }
    onWXReq(o204: wxopensdk.BaseReq) {
    }
    static toRXShareError(n204: number): number {
        if (n204 == wxopensdk.ErrCode.ERR_USER_CANCEL) {
            return RXErrorCode.SHARE_CANCEL;
        }
        else {
            return RXErrorCode.SHARE_PARAMS_ERROR;
        }
    }
    createMediaMessage(g204: ShareObject): wxopensdk.WXMediaMessage {
        if (!g204) {
            throw new RXError("share params null", RXErrorCode.SHARE_PARAMS_ERROR);
        }
        let h204 = new wxopensdk.WXMediaMessage();
        if (g204.material_type == ShareMediaTypes.WEBPAGE) {
            if (!g204.url) {
                throw new RXError("share url is null error", RXErrorCode.SHARE_PARAMS_ERROR);
            }
            let m204 = new wxopensdk.WXWebpageObject();
            m204.webpageUrl = g204.url;
            h204.mediaObject = m204;
            h204.title = g204.title;
            h204.description = g204.content;
        }
        else if (g204.material_type == ShareMediaTypes.IMAGE) {
            if (!g204.image) {
                throw new RXError("share image is null error", RXErrorCode.SHARE_PARAMS_ERROR);
            }
            let k204 = new wxopensdk.WXImageObject;
            if (typeof g204.image == 'string') {
                k204.uri = fileUri.getUriFromPath(g204.image);
            }
            else if (g204.image instanceof ArrayBuffer) {
                let l204: buffer.Buffer = buffer.from(g204.image);
                k204.imageData = l204.toString('base64', 0, l204.length);
            }
            h204.mediaObject = k204;
        }
        else if (g204.material_type == ShareMediaTypes.TEXT) {
            if (!g204.title) {
                throw new RXError("share title is null error", RXErrorCode.SHARE_PARAMS_ERROR);
            }
            let j204 = new wxopensdk.WXTextObject;
            j204.text = g204.title;
            h204.mediaObject = j204;
        }
        else if (g204.material_type == ShareMediaTypes.CARD) {
            if (!g204.username) {
                throw new RXError("share username is null error", RXErrorCode.SHARE_PARAMS_ERROR);
            }
            else if (!g204.path) {
                throw new RXError("share path is null error", RXErrorCode.SHARE_PARAMS_ERROR);
            }
            const i204 = new wxopensdk.WXMiniProgramObject();
            i204.userName = g204.username;
            i204.path = g204.path;
            i204.miniprogramType = g204.mini_type;
            h204.mediaObject = i204;
            h204.title = g204.title;
            h204.description = g204.content;
        }
        return h204;
    }
    async share(z203: ShareObject, a204?: common.UIAbilityContext): Promise<wxopensdk.SendMessageToWXResp> {
        try {
            let c204 = this.createMediaMessage(z203);
            let d204 = z203.share_scene - 1;
            if (d204 < 0) {
                throw new RXError(`share scene code error ${d204}`, RXErrorCode.SHARE_PARAMS_ERROR);
            }
            let e204 = new wxopensdk.SendMessageToWXReq();
            e204.scene = d204;
            e204.message = c204;
            let f204 = await this.sendReq(e204, a204);
            return f204;
        }
        catch (b204) {
            Logger.e(b204);
            if (b204 instanceof Error) {
                throw b204;
            }
            else {
                throw new RXError(`wx share error code: ${b204}`, RXErrorCode.SHARE_PARAMS_ERROR);
            }
        }
    }
    async login(u203: WXAuthParams, v203?: (resp: wxopensdk.SendAuthResp) => void): Promise<wxopensdk.SendAuthResp> {
        try {
            const x203 = new wxopensdk.SendAuthReq();
            x203.isOption1 = u203.isOption1 ?? false;
            x203.nonAutomatic = u203.nonAutomatic ?? true;
            x203.scope = u203.scope?.join(',') || 'snsapi_userinfo';
            x203.state = u203.state ?? 'wx_login';
            x203.extData = u203.extData;
            x203.transaction = u203.transaction ?? Devices.genUUID();
            let y203 = (await this.sendReq(x203)) as wxopensdk.SendAuthResp;
            v203?.(y203);
            return y203;
        }
        catch (w203) {
            Logger.e(w203);
            if (w203 instanceof Error) {
                throw w203;
            }
            else {
                throw new RXError(`wx login error: ${w203}`);
            }
        }
    }
    async openBusinessView(p203: WXBusinessParams, q203?: (resp: wxopensdk.OpenBusinessViewResp) => void): Promise<wxopensdk.OpenBusinessViewResp> {
        try {
            const s203 = new wxopensdk.OpenBusinessViewReq();
            s203.businessType = p203.businessType ?? "requestMerchantTransfer";
            s203.query = p203.query;
            s203.extInfo = p203.extInfo;
            let t203 = (await this.sendReq(s203)) as wxopensdk.OpenBusinessViewResp;
            q203?.(t203);
            return t203;
        }
        catch (r203) {
            Logger.e(r203);
            if (r203 instanceof Error) {
                throw r203;
            }
            else {
                throw new RXError(`wx open business error: ${r203}`, RXErrorCode.SHARE_PARAMS_ERROR);
            }
        }
    }
    async sendReq(h203: wxopensdk.BaseReq, i203?: common.UIAbilityContext): Promise<wxopensdk.BaseResp> {
        Logger.d(`senReq:type:${h203.type} data: ${JSON.stringify(h203)}`);
        return new Promise<wxopensdk.BaseResp>(async (j203, k203) => {
            const l203 = (n203: wxopensdk.BaseResp) => {
                try {
                    if (n203.type === h203.type) {
                        j203(n203 as wxopensdk.SendAuthResp);
                    }
                    else {
                        let o203 = `Response type mismatch: received=${n203.type}, expected=${h203.type}`;
                        Logger.w(o203);
                        j203(n203);
                    }
                }
                finally {
                    WXEventHandler.unregisterOnWXRespCallback(l203);
                }
            };
            WXEventHandler.registerOnWXRespCallback(l203);
            const m203 = await this.wxInstance.sendReq(i203 || getContext() as common.UIAbilityContext, h203);
            if (!m203) {
                WXEventHandler.unregisterOnWXRespCallback(l203);
                j203(new MockWXResp(h203.type, wxopensdk.ErrCode.ERR_COMM, "send wx req failed. type:" + h203.type));
            }
        });
    }
}
