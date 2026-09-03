import worker, { MessageEvents, ThreadWorkerGlobalScope } from '@ohos.worker';
import { NativeCallback, Obj, RXConfig, RXLoginConfig, UserCenterConfig } from '../types/Index';
import { Logger } from '../utils/Logger';
import { RXApi } from './RXApi';
import { SDKHandler } from './SDKHandler'

let messageCallback: NativeCallback;
let workerPort: ThreadWorkerGlobalScope;
const MESSAGE_TYPE = '`syncHMSSDKResult`';

/** Tuanjie WorkerProxy engine UI message types — must fall through to original onmessage. */
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
  TRACK_DATA = 'TrackData',
  TRACK_USER_ACTION = 'TrackUserAction',
  STOP_TRACK_USER_ACTION = 'StopTrackUserAction',
  UPDATE_TOKEN = 'updateToken',
  UPDATE_LOGIN_DATA = 'updateLoginData'

}

export class SDKManager {
  static CallBackInitialized: Boolean = false;
  static MessageInitialized: Boolean = false;
  static threadWorker: worker.ThreadWorker;

  static BindCallback(callback: NativeCallback) {
    if (!SDKManager.CallBackInitialized) {
      globalThis.workerPort.addEventListener("message", async (e: Obj) => {
        let msg: Obj = JSON.parse(JSON.stringify(e));
        if (msg["data"].type == MESSAGE_TYPE) {
          Logger.info('Worker Listener Receive Message : %{public}s', JSON.stringify(e));
          // SDKManager.HMSSDKSyncToWorker(msg["data"].data_type, msg["data"].data)
          messageCallback?.(msg["data"].data_type, "Success", msg["data"].data);

        }
      });
      SDKManager.CallBackInitialized = true;
    }
    if (messageCallback === callback) {
      return;
    }
    messageCallback = callback;
    globalThis.messageCallback = messageCallback;
  }


  private static PostMessageToMain(type: string | Function, data?: Obj) {
    if (typeof type == 'function') {
      type = type.name
    }
    Logger.info('postMessage: type:' + type + ",data:" + data);
    globalThis.workerPort.postMessage({ type, data });

  }

  static HMSSDKSyncToWorker(type: string, data: Obj) {
    Logger.info('HMSSDKSyncToWorker: type:' + type + " ,data:" + data);
    SDKManager.postMessageToMain(type, data);
  }

  static getContext() {
    return globalThis;
  }

  static postMessageToMain(type: string, data: Obj) {
    SDKManager.PostMessageToMain(type, data);
  }

  static InitSdkInfo(data?: Obj) {
    if (SDKManager.threadWorker) {
      SDKManager.threadWorker.postMessage({
        'type': MESSAGE_TYPE,
        'data_type': "OnSdkInit",
        'data': data
      });
    } else {
      Logger.info('InitSdkInfo failed:data:' + data);
    }
  }


  /**
   * Bind HMS UI message handling on the host ThreadWorker.
   * Tuanjie 1.10+ WorkerProxy only delivers via `onmessage`; addEventListener alone is insufficient.
   * Call this once after WorkerProxy is created (e.g. from host aboutToAppear).
   */
  static InitMessageBind(threadWorker: worker.ThreadWorker) {
    if (SDKManager.MessageInitialized == true) {
      return;
    }
    SDKManager.threadWorker = threadWorker;

    let postMessage = (type: Obj, data: Obj) => {
      Logger.info('postMessageToWorker: type:' + type + " ,data:" + data);
      // 向worker线程发送消息
      threadWorker.postMessage({
        'type': MESSAGE_TYPE,
        'data_type': type,
        'data': data
      });
    }

    let prevOnMessage = threadWorker.onmessage;
    threadWorker.onmessage = (e: MessageEvents) => {
      let data: Obj = e.data as Obj;
      let type: string = data?.["type"] as string;
      // Engine / unknown-empty: keep WorkerProxy behavior
      if (!type || ENGINE_UI_MESSAGE_TYPES.indexOf(type) >= 0) {
        if (prevOnMessage) {
          prevOnMessage(e);
        }
        return;
      }

      // HMS messages: handle here (do not fall through to "Unknown UI message type")
      (async () => {
        const paramData: string = data["data"] as string;
        let param: ESObject = paramData ? JSON.parse(paramData) : {};
        let uiContext: UIContext = globalThis.UIContext;
        try {
          let result: string = await SDKHandler.Invoke?.[type]?.(param)
          if (result) {
            postMessage(SDKHandler.Invoke?.[type]?.name, result)
          } else {
            let ret: string
            switch (type) {
              case "RXInit":
                ret = await RXApi.getInstance().RXInit(param as RXConfig, uiContext)
                postMessage(type, ret)
                break;
              case "RXLogin":
                ret = await RXApi.getInstance().RXLogin(param as RXLoginConfig, uiContext)
                postMessage(type, ret)
                break;
              case "showUserCenterUI":
                await RXApi.getInstance().showUserCenterUI(uiContext, param as UserCenterConfig, (cbData) => {
                  postMessage(type, JSON.stringify(cbData || {}))
                })
                break;
              case "showHelperCenterUI":
                RXApi.getInstance().showHelperCenterUI(uiContext, param, (cbData) => {
                  postMessage(type, JSON.stringify(cbData || {}))
                })
                break;
              case "showPrivacyUI":
                RXApi.getInstance().showPrivacyUI(uiContext, param, (cbData) => {
                  postMessage(type, JSON.stringify(cbData || {}))
                })
                break;
              case "showWebView":
                RXApi.getInstance().showWebView(uiContext, param, (cbData) => {
                  postMessage(type, JSON.stringify(cbData || {}))
                }, param.newView)
                break;
              case "sendCaptcha":
                await RXApi.getInstance().sendCaptcha(uiContext, param, (cbResult) => {
                  postMessage(type, JSON.stringify(cbResult || {}))
                })
                break;
              case MsgType.UPDATE_LOGIN_DATA:
                RXApi.getInstance().passport().updateData(param);
                break;
              case MsgType.UPDATE_TOKEN:
                RXApi.getInstance().passport().updateToken(param);
                break;
              case MsgType.TRACK_DATA:
                RXApi.getInstance().trackData(param)
                break;
              case MsgType.TRACK_USER_ACTION:
                RXApi.getInstance().trackUserAction(param)
                break;
              case MsgType.STOP_TRACK_USER_ACTION:
                RXApi.getInstance().stopTrackUserAction()
                break;
              case "logout":
                RXApi.getInstance().logout()
                break;
              case MsgType.SHARE:
                await RXApi.getInstance().share().share(globalThis?.AbilityContext, param, (cbData) => {
                  postMessage(type, JSON.stringify(cbData || {}))
                })
                break;
              case MsgType.OPEN_BUSINESS_VIEW:
                await RXApi.getInstance().wechat().openBusinessView(param, (cbData) => {
                  postMessage(type, JSON.stringify(cbData || {}))
                })
                break;
              case MsgType.ON_KNOCK_SHARE:
                RXApi.getInstance().share().onKnockShare(() => {
                  postMessage(type, JSON.stringify({ code: 0 }))
                })
                break;
              case MsgType.OFF_KNOCK_SHARE:
                RXApi.getInstance().share().offKnockShare()
                break;
              default:
                Logger.d('no handler->' + type);
                if (prevOnMessage) {
                  prevOnMessage(e);
                }
                break;
            }
          }
        } catch (err) {
          Logger.e(err)
          postMessage(type, JSON.stringify(err))
        }
      })();
    };
    SDKManager.MessageInitialized = true;
  }

  // static HMSSDKSyncToWorker(type: string, result: string) {
  // messageCallback(type, "Success", result);
  // if (globalThis.sdkInfo === null || globalThis.sdkInfo == undefined) {
  //   Logger.info('new sdk info map');
  //   let sdkInfo: Obj = new Map();
  //   globalThis.sdkInfo = sdkInfo;
  // }
  // globalThis.sdkInfo.set(type, result);
  // Logger.info('global sdk info value: ' + JSON.stringify(globalThis.sdkInfo));
  // }

  static RXInit(params: string, callback: NativeCallback) {
    SDKManager.BindCallback(callback);
    SDKManager.PostMessageToMain(RXApi.getInstance().RXInit.name, params)
  }

  static RXLogin(params: string, callback: NativeCallback) {
    SDKManager.BindCallback(callback);
    SDKManager.PostMessageToMain(RXApi.getInstance().RXLogin.name, params)
  }

  static RXShare(params: string, callback: NativeCallback) {
    SDKManager.BindCallback(callback);
    SDKManager.PostMessageToMain(MsgType.SHARE, params)
  }

  static RXOpenBusinessView(params: string, callback: NativeCallback) {
    SDKManager.BindCallback(callback);
    SDKManager.PostMessageToMain(MsgType.OPEN_BUSINESS_VIEW, params)
  }

  static RXOnKnockShare(params: string, callback: NativeCallback) {
    SDKManager.BindCallback(callback);
    SDKManager.PostMessageToMain(MsgType.ON_KNOCK_SHARE, params)
  }

  static RXOffKnockShare(params: string) {
    SDKManager.PostMessageToMain(MsgType.OFF_KNOCK_SHARE, params)
  }

  static RXShowPrivacyUI(params: string, callback: NativeCallback) {
    SDKManager.BindCallback(callback);
    SDKManager.PostMessageToMain(RXApi.getInstance().showPrivacyUI.name, params)
  }

  static RXLogout(params: string) {
    SDKManager.PostMessageToMain(RXApi.getInstance().logout.name, params)
  }

  static RXHelperCenter(params: string, callback: NativeCallback) {
    SDKManager.BindCallback(callback);
    SDKManager.PostMessageToMain(RXApi.getInstance().showHelperCenterUI.name, params)
  }

  static RXUserCenter(params: string, callback: NativeCallback) {
    SDKManager.BindCallback(callback);
    SDKManager.PostMessageToMain(RXApi.getInstance().showUserCenterUI.name, params)
  }

  static RXWebView(params: string, callback: NativeCallback) {
    SDKManager.BindCallback(callback);
    SDKManager.PostMessageToMain(RXApi.getInstance().showWebView.name, params)
  }

  static RXSendCaptcha(params: string, callback: NativeCallback) {
    SDKManager.BindCallback(callback);
    SDKManager.PostMessageToMain(RXApi.getInstance().sendCaptcha.name, params)
  }

  static UpdateLoginData(params: string) {
    SDKManager.PostMessageToMain(MsgType.UPDATE_LOGIN_DATA, params)
  }

  static UpdateToken(params: string) {
    SDKManager.PostMessageToMain(MsgType.UPDATE_TOKEN, params)
  }

  static TrackData(params: string) {
    SDKManager.PostMessageToMain(MsgType.TRACK_DATA, params)
  }

  static TrackUserAction(params: string) {
    SDKManager.PostMessageToMain(MsgType.TRACK_USER_ACTION, params)
  }

  static StopTrackUserAction() {
    SDKManager.PostMessageToMain(MsgType.STOP_TRACK_USER_ACTION)
  }

  static LoginOnUI(callback: NativeCallback) {
    SDKManager.BindCallback(callback);
    SDKManager.PostMessageToMain(SDKHandler.Invoke.Login)
  }

  static UnionLoginOnUI(params: string, callback: NativeCallback) {
    SDKManager.BindCallback(callback);
    SDKManager.PostMessageToMain(SDKHandler.Invoke.UnionLogin, params)
  }

  static LogoutOnUI(callback: NativeCallback) {
    SDKManager.BindCallback(callback);
    SDKManager.PostMessageToMain(SDKHandler.Invoke.Logout)
  }

  static IAPInitOnUI(callback: NativeCallback) {

    SDKManager.BindCallback(callback);
    // 向主线程发送消息
    SDKManager.PostMessageToMain(SDKHandler.Invoke.IAPInit);
  }

  static IAPQueryProductsOnUI(storeType: string, storeIdList: string[],
    callback: NativeCallback) {

    const param: Obj = {
      productIds: storeIdList,
      productType: storeType,
    }
    SDKManager.BindCallback(callback);
    SDKManager.PostMessageToMain(SDKHandler.Invoke.QueryList, JSON.stringify(param))

  }

  static IAPPurchase(param: string, callback: NativeCallback) {
    Logger.info('IAPPurchaseOnUI Start!');
    // const param = {
    //   productId: storeId,
    //   productType: storeType,
    //   developerPayload: developerPayload,
    //   reservedInfo: reservedInfo,
    // }
    SDKManager.BindCallback(callback);
    SDKManager.PostMessageToMain(SDKHandler.Invoke.StartPurchase, param)

  }

  static IAPPurchaseOnUI(storeType: string, storeId: string, developerPayload: string, reservedInfo: string,
    callback: NativeCallback) {

    const param: Obj = {
      productId: storeId,
      productType: storeType,
      developerPayload: developerPayload,
      reservedInfo: reservedInfo,
    }
    SDKManager.BindCallback(callback);
    SDKManager.PostMessageToMain(SDKHandler.Invoke.StartPurchase, JSON.stringify(param))

  }

  /**
   * 核销购买(purchaseToken为StartPurchase回参内容 或 CheckOwnedPurchases接口查询出来)
   **/
  static IAPConsumePurchaseOnUI(purchaseToken: string, callback: NativeCallback) {

    const parameter: Obj = {
      purchaseToken: purchaseToken,
    }
    SDKManager.BindCallback(callback);
    SDKManager.PostMessageToMain(SDKHandler.Invoke.ConsumePurchase, JSON.stringify(parameter))

  }

  /**
   * 查询已购买商品
   **/
  static IAPQueryOwnedPurchasesOnUI(storeType: string, callback: NativeCallback) {

    const param: Obj = {
      productType: storeType,
    }
    SDKManager.BindCallback(callback);
    SDKManager.PostMessageToMain(SDKHandler.Invoke.CheckOwnedPurchases, JSON.stringify(param))
  }

  /**
   * 初始化游戏服务
   */
  static GamePlayerInitOnUI(param: string, callback: NativeCallback) {

    SDKManager.BindCallback(callback);
    SDKManager.PostMessageToMain(SDKHandler.Invoke.GamePlayerInit, param)

  }

  /**
   *VerifyLocalPlayer
   */
  static GamePlayerVerifyLocalPlayerOnUI(playerInfo: string, callback: NativeCallback) {

    SDKManager.BindCallback(callback);
    SDKManager.PostMessageToMain(SDKHandler.Invoke.VerifyLocalPlayer, playerInfo)
  }

  static BingPlayerOnUI(param: string, callback: NativeCallback) {

    SDKManager.BindCallback(callback);
    SDKManager.PostMessageToMain(SDKHandler.Invoke.BindPlayer, (param))
  }

  static UnBingPlayerOnUI(param: string, callback: NativeCallback) {

    SDKManager.BindCallback(callback);
    SDKManager.PostMessageToMain(SDKHandler.Invoke.UnBindPlayer, param)
  }


  /**
   * 获取玩家信息
   */
  static GamePlayerGetLocalPlayerOnUI(callback: NativeCallback) {

    SDKManager.BindCallback(callback);
    SDKManager.PostMessageToMain(SDKHandler.Invoke.GetLocalPlayer)

  }

  /**
   * 保存玩家角色信息
   */
  static GamePlayerSavePlayerRoleOnUI(playerInfo: string,
    callback: NativeCallback) {
    Logger.info('GamePlayerSavePlayerRoleOnUI Start!');
    SDKManager.BindCallback(callback);
    SDKManager.PostMessageToMain(SDKHandler.Invoke.SavePlayerRole, playerInfo)

  }
}