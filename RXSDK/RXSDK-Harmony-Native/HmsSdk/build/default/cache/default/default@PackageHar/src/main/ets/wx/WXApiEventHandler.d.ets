// @keepTs
// @ts-nocheck
import * as wxopensdk from '@tencent/wechat_open_sdk';
export type OnWXReq = (req: wxopensdk.BaseReq) => void;
export type OnWXResp = (resp: wxopensdk.BaseResp) => void;
declare class WXApiEventHandlerImpl implements wxopensdk.WXApiEventHandler {
    private onReqCallbacks;
    private onRespCallbacks;
    registerOnWXReqCallback(e205: OnWXReq): void;
    unregisterOnWXReqCallback(d205: OnWXReq): void;
    registerOnWXRespCallback(c205: OnWXResp): void;
    unregisterOnWXRespCallback(b205: OnWXResp): void;
    onReq(z204: wxopensdk.BaseReq): void;
    onResp(x204: wxopensdk.BaseResp): void;
}
export declare const WXEventHandler: WXApiEventHandlerImpl;
export {};
