// @keepTs
// @ts-nocheck
import type worker from "@ohos:worker";
import type { MessageEvents, ThreadWorkerGlobalScope } from "@ohos:worker";
import type { NativeCallback, Obj, RXConfig, RXLoginConfig, UserCenterConfig } from '../types/Index';
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import { RXApi } from "@normalized:N&&&hmssdk/src/main/ets/sdk/RXApi&4.0.0";
import { SDKHandler } from "@normalized:N&&&hmssdk/src/main/ets/sdk/SDKHandler&4.0.0";
let messageCallback: NativeCallback;
let workerPort: ThreadWorkerGlobalScope;
const MESSAGE_TYPE = '`syncHMSSDKResult`';
const ENGINE_UI_MESSAGE_TYPES: string[] = [
    'RUN_ON_UI_THREAD',
    'RUN_ON_UI_THREAD_JS',
    'RUN_ON_UI_THREAD_USER_EVENT',
    'CustomHandler',
];
enum MsgType {
    SHARE = "Share",
    OPEN_BUSINESS_VIEW = "OpenBusinessView",
    CUSTOM_SHARE = "CustomShare",
    ON_KNOCK_SHARE = "OnKnockShare",
    OFF_KNOCK_SHARE = "OffKnockShare",
    TRACK_DATA = "TrackData",
    TRACK_USER_ACTION = "TrackUserAction",
    STOP_TRACK_USER_ACTION = "StopTrackUserAction",
    UPDATE_TOKEN = "updateToken",
    UPDATE_LOGIN_DATA = "updateLoginData"
}
export class SDKManager {
    static CallBackInitialized: Boolean = false;
    static MessageInitialized: Boolean = false;
    static threadWorker: worker.ThreadWorker;
    static BindCallback(d168: NativeCallback) {
        if (!SDKManager.CallBackInitialized) {
            globalThis.workerPort.addEventListener("message", async (e168: Obj) => {
                let f168: Obj = JSON.parse(JSON.stringify(e168));
                if (f168["data"].type == MESSAGE_TYPE) {
                    Logger.info('Worker Listener Receive Message : %{public}s', JSON.stringify(e168));
                    messageCallback?.(f168["data"].data_type, "Success", f168["data"].data);
                }
            });
            SDKManager.CallBackInitialized = true;
        }
        if (messageCallback === d168) {
            return;
        }
        messageCallback = d168;
        globalThis.messageCallback = messageCallback;
    }
    private static PostMessageToMain(b168: string | Function, c168?: Obj) {
        if (typeof b168 == 'function') {
            b168 = b168.name;
        }
        Logger.info('postMessage: type:' + b168 + ",data:" + c168);
        globalThis.workerPort.postMessage({ type: b168, data: c168 });
    }
    static HMSSDKSyncToWorker(z167: string, a168: Obj) {
        Logger.info('HMSSDKSyncToWorker: type:' + z167 + " ,data:" + a168);
        SDKManager.postMessageToMain(z167, a168);
    }
    static getContext() {
        return globalThis;
    }
    static postMessageToMain(x167: string, y167: Obj) {
        SDKManager.PostMessageToMain(x167, y167);
    }
    static InitSdkInfo(w167?: Obj) {
        if (SDKManager.threadWorker) {
            SDKManager.threadWorker.postMessage({
                'type': MESSAGE_TYPE,
                'data_type': "OnSdkInit",
                'data': w167
            });
        }
        else {
            Logger.info('InitSdkInfo failed:data:' + w167);
        }
    }
    static InitMessageBind(b167: worker.ThreadWorker) {
        if (SDKManager.MessageInitialized == true) {
            return;
        }
        SDKManager.threadWorker = b167;
        let c167 = (u167: Obj, v167: Obj) => {
            Logger.info('postMessageToWorker: type:' + u167 + " ,data:" + v167);
            b167.postMessage({
                'type': MESSAGE_TYPE,
                'data_type': u167,
                'data': v167
            });
        };
        let d167 = b167.onmessage;
        b167.onmessage = (e167: MessageEvents) => {
            let f167: Obj = e167.data as Obj;
            let g167: string = f167?.["type"] as string;
            if (!g167 || ENGINE_UI_MESSAGE_TYPES.indexOf(g167) >= 0) {
                if (d167) {
                    d167(e167);
                }
                return;
            }
            (async () => {
                const h167: string = f167["data"] as string;
                let i167: any = h167 ? JSON.parse(h167) : {};
                let j167: UIContext = globalThis.UIContext;
                try {
                    let l167: string = await SDKHandler.Invoke?.[g167]?.(i167);
                    if (l167) {
                        c167(SDKHandler.Invoke?.[g167]?.name, l167);
                    }
                    else {
                        let m167: string;
                        switch (g167) {
                            case "RXInit":
                                m167 = await RXApi.getInstance().RXInit(i167 as RXConfig, j167);
                                c167(g167, m167);
                                break;
                            case "RXLogin":
                                m167 = await RXApi.getInstance().RXLogin(i167 as RXLoginConfig, j167);
                                c167(g167, m167);
                                break;
                            case "showUserCenterUI":
                                await RXApi.getInstance().showUserCenterUI(j167, i167 as UserCenterConfig, (t167) => {
                                    c167(g167, JSON.stringify(t167 || {}));
                                });
                                break;
                            case "showHelperCenterUI":
                                RXApi.getInstance().showHelperCenterUI(j167, i167, (s167) => {
                                    c167(g167, JSON.stringify(s167 || {}));
                                });
                                break;
                            case "showPrivacyUI":
                                RXApi.getInstance().showPrivacyUI(j167, i167, (r167) => {
                                    c167(g167, JSON.stringify(r167 || {}));
                                });
                                break;
                            case "showWebView":
                                RXApi.getInstance().showWebView(j167, i167, (q167) => {
                                    c167(g167, JSON.stringify(q167 || {}));
                                }, i167.newView);
                                break;
                            case "sendCaptcha":
                                await RXApi.getInstance().sendCaptcha(j167, i167, (p167) => {
                                    c167(g167, JSON.stringify(p167 || {}));
                                });
                                break;
                            case MsgType.UPDATE_LOGIN_DATA:
                                RXApi.getInstance().passport().updateData(i167);
                                break;
                            case MsgType.UPDATE_TOKEN:
                                RXApi.getInstance().passport().updateToken(i167);
                                break;
                            case MsgType.TRACK_DATA:
                                RXApi.getInstance().trackData(i167);
                                break;
                            case MsgType.TRACK_USER_ACTION:
                                RXApi.getInstance().trackUserAction(i167);
                                break;
                            case MsgType.STOP_TRACK_USER_ACTION:
                                RXApi.getInstance().stopTrackUserAction();
                                break;
                            case "logout":
                                RXApi.getInstance().logout();
                                break;
                            case MsgType.SHARE:
                                await RXApi.getInstance().share().share(globalThis?.AbilityContext, i167, (o167) => {
                                    c167(g167, JSON.stringify(o167 || {}));
                                });
                                break;
                            case MsgType.OPEN_BUSINESS_VIEW:
                                await RXApi.getInstance().wechat().openBusinessView(i167, (n167) => {
                                    c167(g167, JSON.stringify(n167 || {}));
                                });
                                break;
                            case MsgType.ON_KNOCK_SHARE:
                                RXApi.getInstance().share().onKnockShare(() => {
                                    c167(g167, JSON.stringify({ code: 0 }));
                                });
                                break;
                            case MsgType.OFF_KNOCK_SHARE:
                                RXApi.getInstance().share().offKnockShare();
                                break;
                            default:
                                Logger.d('no handler->' + g167);
                                if (d167) {
                                    d167(e167);
                                }
                                break;
                        }
                    }
                }
                catch (k167) {
                    Logger.e(k167);
                    c167(g167, JSON.stringify(k167));
                }
            })();
        };
        SDKManager.MessageInitialized = true;
    }
    static RXInit(z166: string, a167: NativeCallback) {
        SDKManager.BindCallback(a167);
        SDKManager.PostMessageToMain(RXApi.getInstance().RXInit.name, z166);
    }
    static RXLogin(x166: string, y166: NativeCallback) {
        SDKManager.BindCallback(y166);
        SDKManager.PostMessageToMain(RXApi.getInstance().RXLogin.name, x166);
    }
    static RXShare(v166: string, w166: NativeCallback) {
        SDKManager.BindCallback(w166);
        SDKManager.PostMessageToMain(MsgType.SHARE, v166);
    }
    static RXOpenBusinessView(t166: string, u166: NativeCallback) {
        SDKManager.BindCallback(u166);
        SDKManager.PostMessageToMain(MsgType.OPEN_BUSINESS_VIEW, t166);
    }
    static RXOnKnockShare(r166: string, s166: NativeCallback) {
        SDKManager.BindCallback(s166);
        SDKManager.PostMessageToMain(MsgType.ON_KNOCK_SHARE, r166);
    }
    static RXOffKnockShare(q166: string) {
        SDKManager.PostMessageToMain(MsgType.OFF_KNOCK_SHARE, q166);
    }
    static RXShowPrivacyUI(o166: string, p166: NativeCallback) {
        SDKManager.BindCallback(p166);
        SDKManager.PostMessageToMain(RXApi.getInstance().showPrivacyUI.name, o166);
    }
    static RXLogout(n166: string) {
        SDKManager.PostMessageToMain(RXApi.getInstance().logout.name, n166);
    }
    static RXHelperCenter(l166: string, m166: NativeCallback) {
        SDKManager.BindCallback(m166);
        SDKManager.PostMessageToMain(RXApi.getInstance().showHelperCenterUI.name, l166);
    }
    static RXUserCenter(j166: string, k166: NativeCallback) {
        SDKManager.BindCallback(k166);
        SDKManager.PostMessageToMain(RXApi.getInstance().showUserCenterUI.name, j166);
    }
    static RXWebView(h166: string, i166: NativeCallback) {
        SDKManager.BindCallback(i166);
        SDKManager.PostMessageToMain(RXApi.getInstance().showWebView.name, h166);
    }
    static RXSendCaptcha(f166: string, g166: NativeCallback) {
        SDKManager.BindCallback(g166);
        SDKManager.PostMessageToMain(RXApi.getInstance().sendCaptcha.name, f166);
    }
    static UpdateLoginData(e166: string) {
        SDKManager.PostMessageToMain(MsgType.UPDATE_LOGIN_DATA, e166);
    }
    static UpdateToken(d166: string) {
        SDKManager.PostMessageToMain(MsgType.UPDATE_TOKEN, d166);
    }
    static TrackData(c166: string) {
        SDKManager.PostMessageToMain(MsgType.TRACK_DATA, c166);
    }
    static TrackUserAction(b166: string) {
        SDKManager.PostMessageToMain(MsgType.TRACK_USER_ACTION, b166);
    }
    static StopTrackUserAction() {
        SDKManager.PostMessageToMain(MsgType.STOP_TRACK_USER_ACTION);
    }
    static LoginOnUI(a166: NativeCallback) {
        SDKManager.BindCallback(a166);
        SDKManager.PostMessageToMain(SDKHandler.Invoke.Login);
    }
    static UnionLoginOnUI(y165: string, z165: NativeCallback) {
        SDKManager.BindCallback(z165);
        SDKManager.PostMessageToMain(SDKHandler.Invoke.UnionLogin, y165);
    }
    static LogoutOnUI(x165: NativeCallback) {
        SDKManager.BindCallback(x165);
        SDKManager.PostMessageToMain(SDKHandler.Invoke.Logout);
    }
    static IAPInitOnUI(w165: NativeCallback) {
        SDKManager.BindCallback(w165);
        SDKManager.PostMessageToMain(SDKHandler.Invoke.IAPInit);
    }
    static IAPQueryProductsOnUI(s165: string, t165: string[], u165: NativeCallback) {
        const v165: Obj = {
            productIds: t165,
            productType: s165,
        };
        SDKManager.BindCallback(u165);
        SDKManager.PostMessageToMain(SDKHandler.Invoke.QueryList, JSON.stringify(v165));
    }
    static IAPPurchase(q165: string, r165: NativeCallback) {
        Logger.info('IAPPurchaseOnUI Start!');
        SDKManager.BindCallback(r165);
        SDKManager.PostMessageToMain(SDKHandler.Invoke.StartPurchase, q165);
    }
    static IAPPurchaseOnUI(k165: string, l165: string, m165: string, n165: string, o165: NativeCallback) {
        const p165: Obj = {
            productId: l165,
            productType: k165,
            developerPayload: m165,
            reservedInfo: n165,
        };
        SDKManager.BindCallback(o165);
        SDKManager.PostMessageToMain(SDKHandler.Invoke.StartPurchase, JSON.stringify(p165));
    }
    static IAPConsumePurchaseOnUI(h165: string, i165: NativeCallback) {
        const j165: Obj = {
            purchaseToken: h165,
        };
        SDKManager.BindCallback(i165);
        SDKManager.PostMessageToMain(SDKHandler.Invoke.ConsumePurchase, JSON.stringify(j165));
    }
    static IAPQueryOwnedPurchasesOnUI(e165: string, f165: NativeCallback) {
        const g165: Obj = {
            productType: e165,
        };
        SDKManager.BindCallback(f165);
        SDKManager.PostMessageToMain(SDKHandler.Invoke.CheckOwnedPurchases, JSON.stringify(g165));
    }
    static GamePlayerInitOnUI(c165: string, d165: NativeCallback) {
        SDKManager.BindCallback(d165);
        SDKManager.PostMessageToMain(SDKHandler.Invoke.GamePlayerInit, c165);
    }
    static GamePlayerVerifyLocalPlayerOnUI(a165: string, b165: NativeCallback) {
        SDKManager.BindCallback(b165);
        SDKManager.PostMessageToMain(SDKHandler.Invoke.VerifyLocalPlayer, a165);
    }
    static BingPlayerOnUI(y164: string, z164: NativeCallback) {
        SDKManager.BindCallback(z164);
        SDKManager.PostMessageToMain(SDKHandler.Invoke.BindPlayer, (y164));
    }
    static UnBingPlayerOnUI(w164: string, x164: NativeCallback) {
        SDKManager.BindCallback(x164);
        SDKManager.PostMessageToMain(SDKHandler.Invoke.UnBindPlayer, w164);
    }
    static GamePlayerGetLocalPlayerOnUI(v164: NativeCallback) {
        SDKManager.BindCallback(v164);
        SDKManager.PostMessageToMain(SDKHandler.Invoke.GetLocalPlayer);
    }
    static GamePlayerSavePlayerRoleOnUI(t164: string, u164: NativeCallback) {
        Logger.info('GamePlayerSavePlayerRoleOnUI Start!');
        SDKManager.BindCallback(u164);
        SDKManager.PostMessageToMain(SDKHandler.Invoke.SavePlayerRole, t164);
    }
}
