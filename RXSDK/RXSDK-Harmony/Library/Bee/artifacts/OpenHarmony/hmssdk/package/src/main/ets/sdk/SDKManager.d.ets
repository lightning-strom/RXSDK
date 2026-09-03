// @keepTs
// @ts-nocheck
import worker from '@ohos.worker';
import { NativeCallback, Obj } from '../types/Index';
export declare class SDKManager {
    static CallBackInitialized: Boolean;
    static MessageInitialized: Boolean;
    static threadWorker: worker.ThreadWorker;
    static BindCallback(d168: NativeCallback): void;
    private static PostMessageToMain;
    static HMSSDKSyncToWorker(z167: string, a168: Obj): void;
    static getContext(): typeof globalThis;
    static postMessageToMain(x167: string, y167: Obj): void;
    static InitSdkInfo(w167?: Obj): void;
    /**
     * Bind HMS UI message handling on the host ThreadWorker.
     * Tuanjie 1.10+ WorkerProxy only delivers via `onmessage`; addEventListener alone is insufficient.
     * Call this once after WorkerProxy is created (e.g. from host aboutToAppear).
     */
    static InitMessageBind(b167: worker.ThreadWorker): void;
    static RXInit(z166: string, a167: NativeCallback): void;
    static RXLogin(x166: string, y166: NativeCallback): void;
    static RXShare(v166: string, w166: NativeCallback): void;
    static RXOpenBusinessView(t166: string, u166: NativeCallback): void;
    static RXOnKnockShare(r166: string, s166: NativeCallback): void;
    static RXOffKnockShare(q166: string): void;
    static RXShowPrivacyUI(o166: string, p166: NativeCallback): void;
    static RXLogout(n166: string): void;
    static RXHelperCenter(l166: string, m166: NativeCallback): void;
    static RXUserCenter(j166: string, k166: NativeCallback): void;
    static RXWebView(h166: string, i166: NativeCallback): void;
    static RXSendCaptcha(f166: string, g166: NativeCallback): void;
    static UpdateLoginData(e166: string): void;
    static UpdateToken(d166: string): void;
    static TrackData(c166: string): void;
    static TrackUserAction(b166: string): void;
    static StopTrackUserAction(): void;
    static LoginOnUI(a166: NativeCallback): void;
    static UnionLoginOnUI(y165: string, z165: NativeCallback): void;
    static LogoutOnUI(x165: NativeCallback): void;
    static IAPInitOnUI(w165: NativeCallback): void;
    static IAPQueryProductsOnUI(s165: string, t165: string[], u165: NativeCallback): void;
    static IAPPurchase(q165: string, r165: NativeCallback): void;
    static IAPPurchaseOnUI(k165: string, l165: string, m165: string, n165: string, o165: NativeCallback): void;
    /**
     * 核销购买(purchaseToken为StartPurchase回参内容 或 CheckOwnedPurchases接口查询出来)
     **/
    static IAPConsumePurchaseOnUI(h165: string, i165: NativeCallback): void;
    /**
     * 查询已购买商品
     **/
    static IAPQueryOwnedPurchasesOnUI(e165: string, f165: NativeCallback): void;
    /**
     * 初始化游戏服务
     */
    static GamePlayerInitOnUI(c165: string, d165: NativeCallback): void;
    /**
     *VerifyLocalPlayer
     */
    static GamePlayerVerifyLocalPlayerOnUI(a165: string, b165: NativeCallback): void;
    static BingPlayerOnUI(y164: string, z164: NativeCallback): void;
    static UnBingPlayerOnUI(w164: string, x164: NativeCallback): void;
    /**
     * 获取玩家信息
     */
    static GamePlayerGetLocalPlayerOnUI(v164: NativeCallback): void;
    /**
     * 保存玩家角色信息
     */
    static GamePlayerSavePlayerRoleOnUI(t164: string, u164: NativeCallback): void;
}
