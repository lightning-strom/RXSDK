// @keepTs
// @ts-nocheck
import * as wxopensdk from "@normalized:N&&&@tencent/wechat_open_sdk/Index&1.0.16";
import SDKConfig from "@normalized:N&&&hmssdk/src/main/ets/sdk/SDKConfig&4.0.0";
const kTag = SDKConfig.TAG;
export type OnWXReq = (req: wxopensdk.BaseReq) => void;
export type OnWXResp = (resp: wxopensdk.BaseResp) => void;
class WXApiEventHandlerImpl implements wxopensdk.WXApiEventHandler {
    private onReqCallbacks: Map<OnWXReq, OnWXReq> = new Map;
    private onRespCallbacks: Map<OnWXResp, OnWXResp> = new Map;
    registerOnWXReqCallback(e205: OnWXReq) {
        this.onReqCallbacks.set(e205, e205);
    }
    unregisterOnWXReqCallback(d205: OnWXReq) {
        this.onReqCallbacks.delete(d205);
    }
    registerOnWXRespCallback(c205: OnWXResp) {
        wxopensdk.Log.i(kTag, "onResp:%s", JSON.stringify(this.onRespCallbacks));
        this.onRespCallbacks.set(c205, c205);
    }
    unregisterOnWXRespCallback(b205: OnWXResp) {
        this.onRespCallbacks.delete(b205);
    }
    onReq(z204: wxopensdk.BaseReq): void {
        wxopensdk.Log.i(kTag, "onReq:%s", JSON.stringify(z204));
        this.onReqCallbacks.forEach((a205) => {
            a205(z204);
        });
    }
    onResp(x204: wxopensdk.BaseResp): void {
        wxopensdk.Log.i(kTag, "onResp:%s", JSON.stringify(x204));
        this.onRespCallbacks.forEach((y204) => {
            y204(x204);
        });
    }
}
export const WXEventHandler = new WXApiEventHandlerImpl;
