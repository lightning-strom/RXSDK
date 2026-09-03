// @keepTs
// @ts-nocheck
import * as wxopensdk from '@tencent/wechat_open_sdk';
import common from "@ohos.app.ability.common";
import Want from "@ohos.app.ability.Want";
import { ShareObject } from '../share/ShareObject';
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
export declare class WXApi {
    private _appId?;
    private _wxInstance?;
    private static instance;
    get appId(): string | undefined;
    get wxInstance(): wxopensdk.WXApi;
    protected constructor(t204?: string);
    static getInstance(s204?: string): WXApi;
    handleWant(r204: Want): void;
    openWechat(q204: common.UIAbilityContext): wxopensdk.SendReqResultWrap;
    isWXAppInstalled(): boolean;
    register(): void;
    unregister(): void;
    onWXResp(p204: wxopensdk.BaseResp): void;
    onWXReq(o204: wxopensdk.BaseReq): void;
    static toRXShareError(n204: number): number;
    createMediaMessage(g204: ShareObject): wxopensdk.WXMediaMessage;
    share(z203: ShareObject, a204?: common.UIAbilityContext): Promise<wxopensdk.SendMessageToWXResp>;
    login(u203: WXAuthParams, v203?: (resp: wxopensdk.SendAuthResp) => void): Promise<wxopensdk.SendAuthResp>;
    openBusinessView(p203: WXBusinessParams, q203?: (resp: wxopensdk.OpenBusinessViewResp) => void): Promise<wxopensdk.OpenBusinessViewResp>;
    sendReq(h203: wxopensdk.BaseReq, i203?: common.UIAbilityContext): Promise<wxopensdk.BaseResp>;
}
