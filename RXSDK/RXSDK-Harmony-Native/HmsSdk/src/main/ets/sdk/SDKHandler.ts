import { Logger } from '../utils/Logger'
import authentication from '@hms.core.authentication';
import common from '@ohos.app.ability.common';
import iap from '@hms.core.iap'
import hilog from '@ohos.hilog';
import util from '@ohos.util';
import gamePlayer from '@hms.core.gameservice.gameplayer';
import { BusinessError } from '@ohos.base';
import { JWTUtil } from '../utils/JWTUtil';
import { JSON } from '@kit.ArkTS';

let Instance: SDKHandler;

let IAP_VERSION: string = "12";
const isIapAvailable: boolean = canIUse('SystemCapability.Payment.IAP');


export class SDKHandler {
  public static Invoke = {
    Login: function (param: ESObject) {
      return SDKHandler.getInstance().handleLogin(globalThis?.AbilityContext, param);
    },
    Logout: function (param: ESObject) {
      return SDKHandler.getInstance().handleLogout(globalThis?.AbilityContext);
    },
    BindPlayer: function (param: ESObject) {
      return SDKHandler.getInstance().handleBingPlayer(param, globalThis?.AbilityContext);
    },
    UnBindPlayer: function (param: ESObject) {
      return SDKHandler.getInstance().handleUnBingPlayer(param, globalThis?.AbilityContext);
    },
    UnionLogin: function (param: ESObject) {
      return SDKHandler.getInstance().handleUnionLogin(param, globalThis?.AbilityContext);
    },
    IAPInit: function (param: ESObject) {
      return SDKHandler.getInstance().handleQueryIAPList(param.productType, param.productIds, globalThis?.AbilityContext);
    },

    QueryList: function (param: ESObject) {
      return SDKHandler.getInstance().handleStartPurchase(param.productType, param.productId, globalThis?.AbilityContext);
    },
    StartPurchase: function (param: ESObject) {
      return SDKHandler.getInstance().startPurchase(param, globalThis?.AbilityContext);
    },
    ConsumePurchase: function (param: ESObject) {
      return SDKHandler.getInstance().handleConsumePurchase(param.purchaseToken, globalThis?.AbilityContext);
    },
    CheckOwnedPurchases: function (param: ESObject) {
      return SDKHandler.getInstance().handleCheckOwnedPurchases(param.productType, param.queryType, globalThis?.AbilityContext);
    },
    GamePlayerInit: function (param: ESObject) {
      return SDKHandler.getInstance().handleGamePlayerInit(globalThis?.AbilityContext);
    },
    GetLocalPlayer: function (param: ESObject) {
      return SDKHandler.getInstance().handleGamePlayerGetLocal(globalThis?.AbilityContext);
    },
    SavePlayerRole: function (param: ESObject) {
      return SDKHandler.getInstance().handleGamePlayerSave(param, globalThis?.AbilityContext);
    },
    VerifyLocalPlayer: function (param: ESObject) {
      return SDKHandler.getInstance().handleVerifyLocalPlayer(param, globalThis?.AbilityContext);
    }
  }


  /**
   * 登录
   */
  public async login(context, params: {
    forceAuthorization?: boolean;
  }): Promise<object> {
    params = params || {};
    try {
      let loginRequest = new authentication.HuaweiIDProvider().createLoginWithHuaweiIDRequest();
      // 当用户未登录华为帐号时，是否强制拉起华为帐号登录界面
      loginRequest.forceLogin = params.forceAuthorization ?? true;
      loginRequest.state = util.generateRandomUUID();
      loginRequest.idTokenSignAlgorithm = authentication.IdTokenSignAlgorithm.PS256;
      let controller = new authentication.AuthenticationController(context as common.UIAbilityContext);
      let loginWithHuaweiIDResponse: authentication.LoginWithHuaweiIDResponse = await controller.executeRequest(loginRequest)
      let state = loginWithHuaweiIDResponse.state;
      if (loginRequest.state != state) {
        Logger.error('login fail,The state is different: %{public}s', JSON.stringify(loginWithHuaweiIDResponse));
        loginWithHuaweiIDResponse['code'] = -1;
        return (loginWithHuaweiIDResponse);
      }
      return ({ code: 0, data: loginWithHuaweiIDResponse.data });
    } catch (err) {
      if (typeof err === 'object') {
        err.code = err.code ?? -1
        err.message = err.message ?? " Unknown login error"
        err.msg ??= err.message
      }
      Logger.e(err);
      return (err);
    }
  }

  public async auth(context, params: {
    scopes?: string[];
    permissions?: string[];
    forceAuthorization?: boolean;
  }, needBinding?: boolean, localPlayer?: gamePlayer.GSKLocalPlayer): Promise<object> {
    params = params || {};
    try {
      let authRequest = new authentication.HuaweiIDProvider().createAuthorizationWithHuaweiIDRequest();
      authRequest.scopes = params.scopes || ['profile', 'phone'];
      authRequest.permissions = params.permissions || ['serviceauthcode'];
      authRequest.forceAuthorization = params.forceAuthorization ?? true;
      authRequest.state = util.generateRandomUUID();
      let controller = new authentication.AuthenticationController(context);
      let authorizationWithHuaweiIDResponse: authentication.AuthorizationWithHuaweiIDResponse = await controller.executeRequest(authRequest);
      if (authorizationWithHuaweiIDResponse.state !== authRequest.state) {
        return ({ code: -1, msg: "Failed to authenticate. State is different." });
      }
      let data = { ...authorizationWithHuaweiIDResponse.data, ...localPlayer, needBinding }
      // 继续处理认证响应...
      return ({ code: 0, data });
    } catch (err) {
      if (typeof err === 'object') {
        err.code = err.code ?? -1
        err.message = err.message ?? " Unknown login error"
        err.msg ??= err.message

      }
      Logger.e(err);
      return (err);
    }
  }

  public async logout(context): Promise<object> {
    try {
      let cancelRequest = new authentication.HuaweiIDProvider().createCancelAuthorizationRequest();
      cancelRequest.state = util.generateRandomUUID();
      let controller = new authentication.AuthenticationController(context as common.UIAbilityContext);
      let data = await controller.executeRequest(cancelRequest)
      let cancelAuthorizationResponse = data as authentication.CancelAuthorizationResponse;
      let state = cancelAuthorizationResponse.state;
      if (state != undefined && cancelRequest.state != state) {
        Logger.error('cancel fail,The state is different: %{public}s', JSON.stringify(cancelAuthorizationResponse));
        return { code: -2, msg: "cancel fail,The state is different", ...cancelAuthorizationResponse };
      }
      Logger.debug('cancel success: %{public}s', JSON.stringify(cancelAuthorizationResponse));
      return { code: 0, data: cancelAuthorizationResponse };
    } catch (err) {
      err["code"] = err["code"] ?? -1;
      err.msg ??= err.message
      Logger.error(err);
      return err;
    }
  }

  /**
   * 登录
   */
  public async handleLogin(context, params: {
    forceAuthorization?: boolean;
  }): Promise<string> {
    params = params || {};
    try {
      let ret = await this.login(context, params)
      return JSON.stringify(ret);
    } catch (err) {
      if (typeof err === 'object') {
        err.code = err.code ?? -1
        err.message = err.message ?? " Unknown login error"
        err.msg ??= err.message
      }
      Logger.e(err);
      return JSON.stringify(err);
    }
  }

  public async handleAuth(context, params: {
    scopes?: string[];
    permissions?: string[];
    forceAuthorization?: boolean;
  }, needBinding?: boolean, localPlayer?: gamePlayer.GSKLocalPlayer): Promise<string> {
    params = params || {};
    try {
      let ret = await this.auth(context, params)
      return JSON.stringify(ret);
    } catch (err) {
      if (typeof err === 'object') {
        err.code = err.code ?? -1
        err.message = err.message ?? " Unknown login error"
        err.msg ??= err.message
      }
      Logger.e(err);
      return JSON.stringify(err);
    }
  }

  public async handleUnionLogin(params: {
    accountInfos?: Array<object>;
    showLoginDialog?: boolean;
    loginPanelType?: number;
    scopes?: string[];
    permissions?: string[];
    forceAuthorization?: boolean;
  }, context): Promise<string> {
    try {
      let thirdAccountInfos: Array<gamePlayer.ThirdAccountInfo> = [];
      let accountInfos: Array<object> = params.accountInfos ?? []
      let showLoginDialog: boolean = params.showLoginDialog ?? true
      let loginPanelType: number = params.loginPanelType
      accountInfos.forEach(account => {
        let accountName: string | undefined;
        let accountIcon = account['accountIcon']; // 默认图标

        // 检查 account 对象是否具有所需的属性
        if (typeof account === 'object' && 'accountName' in account) {
          accountName = account['accountName'] as string; // 使用类型断言来确保是字符串
          if ('accountIcon' in account && typeof account['accountIcon'] === 'string') {
            // @ts-ignore
            accountIcon = $r(account['accountIcon']);
          }
        }
        if (accountName && accountName !== "") {
          // 根据提取的信息构造 gamePlayer.ThirdAccountInfo 对象
          let thirdAccountInfo: gamePlayer.ThirdAccountInfo = { accountName, accountIcon };
          thirdAccountInfos.push(thirdAccountInfo);
        }
      });
      let request: gamePlayer.UnionLoginParam = {
        showLoginDialog: showLoginDialog,
        loginPanelType: loginPanelType,
        thirdAccountInfos: thirdAccountInfos
      };

      let result: gamePlayer.UnionLoginResult = await gamePlayer.unionLogin(context, request);
      let accountName = result.accountName;
      let needBinding: boolean = result.needBinding;
      let localPlayer: gamePlayer.GSKLocalPlayer = result.localPlayer;
      if (accountName === "hw_account") {
        //1：玩家选择转移，且原APK游戏使用了playerId作为玩家标识，Game Service Kit将playerId作为新的gamePlayerId。
        // 2：玩家选择转移，且原APK游戏使用了openId作为玩家标识，Game Service Kit将openId作为新的gamePlayerId。
        // 部分HarmonyOS/EMUI游戏可能使用unionId作为玩家标识，若获取的gamePlayerId有值且idCompatibleType值为1或2时，需要再调用转换ID获取到unionId，再将unionId作为新的gamePlayerId。
        let needAuth = needBinding;
        if (result?.boundPlayerInfo?.thirdOpenId && result?.boundPlayerInfo?.thirdOpenId !== "") {
          needAuth = false;
        }

        let handleResult
        if (needAuth) {
          handleResult = await this.auth(context, {
            scopes: params.scopes,
            permissions: params.permissions,
            forceAuthorization: params.forceAuthorization
          }, needBinding, localPlayer);
        } else {
          handleResult = await this.login(context, {
            forceAuthorization: params.forceAuthorization
          });
        }
        if (handleResult.code == 0) {
          return JSON.stringify({ ...result, ...handleResult });
        } else {
          if (handleResult.code == 1001502012) { //The user canceled the authorization

            this.handleUnBingPlayer({ thirdOpenId: result?.boundPlayerInfo?.thirdOpenId || util.generateRandomUUID(), teamPlayerId: result.localPlayer.teamPlayerId }, context)
          }
          return JSON.stringify(handleResult);
        }
      } else {
        // 如果不是华为账号或不需要绑定，直接返回结果或其他逻辑
        return JSON.stringify({ code: 0, ...result, data: { accountType: "game_account" } });
      }
    } catch (err) {
      if (typeof err === 'object') {
        err.code ??= -1
        err.message ??= " Unknown login error"
        err.msg ??= err.message
      }
      err.msg ??= err.message
      Logger.error(`Failed to log in. Error: ${err.message}`);
      return JSON.stringify(err);
    }
  }

  /**
   * 初始化IAP
   */
  public async handleInitIAP(context): Promise<string> {
    try {
      await iap.queryEnvironmentStatus(context as common.UIAbilityContext);
      Logger.info(`Iap queryEnvironmentStatus: Success:`);
      return JSON.stringify({ "code": 0 });
    } catch (error) {
      Logger.error(`Iap queryEnvironmentStatus:` + JSON.stringify(error));
      error.code = error.code || -1
      error.message = error.message || "Unknown Error"
      error.msg ??= error.message
      return JSON.stringify(error);
    }
  }

  /**
   * 查询商品列表（查询的商品storeIdList必须是您在AppGallery Connect网站配置的商品）
   * productType: iap.ProductType.CONSUMABLE：消耗型商品; iap.ProductType.NONCONSUMABLE：非消耗型商品;
   */
  public async handleQueryIAPList(storeType: string, storeIdList: string[], context): Promise<string> {
    const param: iap.QueryProductsParameter = {
      productIds: storeIdList,
      productType: strToProductType(storeType),
    }
    return new Promise((resolve) => {
      iap.queryProducts(context as common.UIAbilityContext, param).then((products: Array<iap.Product>) => {
        resolve(JSON.stringify({ code: 0, data: products }));
      }).catch((error: BusinessError) => {
        resolve(JSON.stringify(error));
      });
    });
  }

  public async startPurchase(param: iap.PurchaseParameter, context): Promise<string> {
    try {
      // 进行购买
      // const purchaseResult: iap.PurchaseResult = await iap.purchase(context, param);
      const purchaseResult: iap.CreatePurchaseResult = await iap.createPurchase(context, param)
      const purchaseData = JSON.parse(purchaseResult.purchaseData) as PurchaseData;
      // let isEvn: boolean = await iap.isSandboxActivated(context);
      // purchaseData.env = isEvn ? 1 : 0;
      purchaseData.iap_version = IAP_VERSION;
      // const jwsPurchaseOrder: string = purchaseData.jwsPurchaseOrder;
      // const purchaseStr = JWTUtil.decodeJwtObj(jwsPurchaseOrder);
      // 记录购买结果
      Logger.debug(JSON.stringify(purchaseData));
      // 返回成功结果
      return JSON.stringify({ code: 0, data: purchaseData });
    } catch (err) {
      Logger.error(JSON.stringify(err));
      err.code = err.code ?? -1;
      err.msg ??= err.message
      if (err.code === iap.IAPErrorCode.PRODUCT_OWNED || err.code === iap.IAPErrorCode.SYSTEM_ERROR) {
        let result = await this.handleCheckOwnedPurchases("CONSUMABLE", "UNFINISHED", context)
        // let res = JSON.parse(result) as { data: { purchaseStr: string } }
        // await this.handleConsumePurchase(res.data.purchaseStr, context);
        return result;
      } else {
        // 返回错误结果
        return JSON.stringify(err);
      }
    }
  }

  /**
   * 发起购买
   */
  public async handleStartPurchase(storeType: string, storeId: string, context): Promise<string> {
    const param: iap.PurchaseParameter = {
      productId: storeId,
      productType: strToProductType(storeType),
    }
    return this.startPurchase(param, context);
  }

  /**
   * 核销购买(purchaseToken为StartPurchase回参内容 或 CheckOwnedPurchases接口查询出来)
   */
  public async handleConsumePurchase(jwsPurchaseOrder: string, context): Promise<string> {
    let purchaseOrderStr = JWTUtil.decodeJwtObj(jwsPurchaseOrder);
    let purchaseOrder = JSON.parse(purchaseOrderStr) as PurchaseOrderPayload;
    let finishPurchaseParam: iap.FinishPurchaseParameter = {
      productType: purchaseOrder.productType,
      purchaseToken: purchaseOrder.purchaseToken,
      purchaseOrderId: purchaseOrder.purchaseOrderId
    };
    return new Promise((resolve) => {
      iap.finishPurchase(context as common.UIAbilityContext, finishPurchaseParam, (err, data) => {
        if (err) {
          // 这里处理异步的参数错误和业务逻辑执行错误。
          Logger.error(`Iap consumePurchase: Error: ${err.code}`);
          resolve(JSON.stringify(err));
        }
        // 处理成功逻辑
        Logger.info(`Iap consumePurchase success`);
        resolve(JSON.stringify({ code: 0 }));
      });
    });
  }


  /**
   * 查询已购买商品
   */

  public async handleCheckOwnedPurchases(storeType: string, queryType: string, context): Promise<string> {
    try {
      const param: iap.QueryPurchasesParameter = {
        productType: strToProductType(storeType),
        queryType: strToQueryType(queryType),
      };
      await iap.queryEnvironmentStatus(context as common.UIAbilityContext);
      const res: iap.QueryPurchaseResult = await iap.queryPurchases(context as common.UIAbilityContext, param);
      const purchaseDataList = res.purchaseDataList;
      if (!purchaseDataList || purchaseDataList.length === 0) {
        Logger.info("queryPurchases list is null.");
        return JSON.stringify({ code: -1, message: "queryPurchases list null." });
      }
      const firstPurchaseDataStr = purchaseDataList[0];
      const purchaseDataObj = JSON.parse(firstPurchaseDataStr) as PurchaseData;
      let purchaseOrderPayload = JSON.parse(JWTUtil.decodeJwtObj(purchaseDataObj.jwsPurchaseOrder)) as PurchaseOrderPayload;
      // let str= purchaseOrderPayload.developerPayload
      // let isEvn: boolean = await iap.isSandboxActivated(context);
      // if (isEvn) {
      //   purchaseDataObj.env = 1;
      // }
      purchaseDataObj.developerPayload = purchaseOrderPayload.developerPayload
      purchaseDataObj.iap_version = IAP_VERSION;
      purchaseDataObj.restore = true
      Logger.debug(JSON.stringify(purchaseDataObj));
      return JSON.stringify({ code: 0, data: purchaseDataObj });
    } catch (error) {
      error.code ??= -1
      error.msg ??= error.message
      return JSON.stringify(error);
    }

    // const param: iap.QueryPurchasesParameter = {
    //   productType: strToProductType(storeType),
    //   queryType: strToQueryType(queryType),
    // }
    // return new Promise((resolve) => {
    //   iap.queryPurchases(context as common.UIAbilityContext, param).then((res: iap.QueryPurchaseResult) => {
    //     let purchaseDataList: string[] = res.purchaseDataList;
    //     if (purchaseDataList === undefined || purchaseDataList.length <= 0) {
    //       let message = "error inAppPurchaseDataList null";
    //       Logger.error(message);
    //       resolve(JSON.stringify({ code: -1, message: message }));
    //     }
    //     let purchaseData: any = JSON.parse(purchaseDataList[0])
    //     // let jwsPurchaseOrder: string = purchaseData.jwsPurchaseOrder;
    //     // let purchaseStr = JWTUtil.decodeJwtObj(jwsPurchaseOrder);
    //     purchaseData.iap_version = IAP_VERSION;
    //     resolve(JSON.stringify({ code: 0, data: purchaseData }));
    //   }).catch((error: BusinessError) => {
    //     Logger.error(JSON.stringify(error));
    //     resolve(JSON.stringify(error));
    //   });
    // });
  }


  /**
   * 初始化gameservice
   */
  public async handleGamePlayerInit(context): Promise<string> {
    try {
      await gamePlayer.init(context as common.UIAbilityContext);
      Logger.info(`Game Service Init Success`);
      gamePlayer.on('playerChanged', this.onPlayerChangedEventCallback);
      return JSON.stringify({ code: 0 });
    } catch (err) {
      err.code = err.code ?? -1;
      err.message = err.message ?? "Unknown game player init error";
      err.msg ??= err.message
      Logger.e(err)
      return JSON.stringify(err);
    }
  }

  private onPlayerChangedEventCallback(result: gamePlayer.PlayerChangedResult) {
    if (result.event === gamePlayer.PlayerChangedEvent.SWITCH_GAME_ACCOUNT) {
      // 游戏号已切换，完成本地缓存清理工作后，再次调用unionLogin接口等
      Logger.info(`onPlayerChangedEventCallback ` + result.resultInfo);
    }
  }

  /**
   * 调用verifyLocalPlayer接口进行合规校验
   */
  public async handleVerifyLocalPlayer(userInfo: object, context): Promise<string> {
    try {
      let jsonObj = (userInfo ? (userInfo) : {});
      let param = jsonObj as gamePlayer.ThirdUserInfo;
      await gamePlayer.verifyLocalPlayer(context, param)
      if (!jsonObj["verify_only"]) {
        let request: gamePlayer.GSKPlayerRole = jsonObj as gamePlayer.GSKPlayerRole;
        request.roleId ??= "0";
        request.roleName ??= "default";
        await gamePlayer.savePlayerRole(context as common.UIAbilityContext, request)
      }
      return JSON.stringify({ code: 0 });
    } catch (error) {
      error.msg ??= error.message
      let ej = JSON.stringify(error)
      Logger.info(`handleVerifyLocalPlayer:` + ej);
      return ej;
    }
  }

  public async handleBingPlayer(params: {
    thirdOpenId: string,
    teamPlayerId?: string,
  }, context): Promise<string> {
    try {
      await gamePlayer.bindPlayer(context as common.UIAbilityContext, params.thirdOpenId, params.teamPlayerId)
      return JSON.stringify({ code: 0, data: params });
    } catch (err) {
      err.code ??= -1;
      err.msg ??= err.message

      let ej = JSON.stringify(err)
      Logger.error(ej);
      return ej;
    }
  }

  public async handleUnBingPlayer(params: {
    thirdOpenId: string,
    teamPlayerId?: string,
  }, context): Promise<string> {
    try {
      Logger.d("unbindPlayer thirdOpenId:" + params.thirdOpenId + " ,teamPlayerId:" + params.teamPlayerId);
      await gamePlayer.unbindPlayer(context as common.UIAbilityContext, params.thirdOpenId, params.teamPlayerId)
      return JSON.stringify({ code: 0, data: params });
    } catch (err) {
      err.code ??= -1;
      err.msg ??= err.message
      let ej = JSON.stringify(err)
      Logger.error(ej);
      return ej;
    }
  }


  /**
   * 登出
   */
  public async handleLogout(context): Promise<string> {

    // 创建取消授权请求，并设置参数
    let cancelRequest = new authentication.HuaweiIDProvider().createCancelAuthorizationRequest();
    cancelRequest.state = util.generateRandomUUID();
    return new Promise((resolve, reject) => {
      // 执行取消授权请求，并处理结果
      try {
        let controller = new authentication.AuthenticationController(context as common.UIAbilityContext);
        controller.executeRequest(cancelRequest, (err, data) => {
          if (err) {
            Logger.error('cancel fail,error: %{public}s', JSON.stringify(err));
            resolve(JSON.stringify(err));
            return;
          }
          let cancelAuthorizationResponse = data as authentication.CancelAuthorizationResponse;
          let state = cancelAuthorizationResponse.state;
          if (state != undefined && cancelRequest.state != state) {
            Logger.error('cancel fail,The state is different: %{public}s', JSON.stringify(cancelAuthorizationResponse));
            cancelAuthorizationResponse["code"] = cancelAuthorizationResponse["code"] ?? -2;
            resolve(JSON.stringify(cancelAuthorizationResponse));
            return;
          }
          hilog.debug(0x0000, 'SDKHandler', 'cancel success: %{public}s', JSON.stringify(cancelAuthorizationResponse));
          resolve(JSON.stringify({ code: 0, data: cancelAuthorizationResponse }));
        });
      } catch (err) {
        Logger.error('cancel failed: %{public}s', JSON.stringify(err));
        err["code"] = err["code"] ?? -1;
        err.msg ??= err.message
        resolve(JSON.stringify(err));
      }
    });
  }

  /**
   * 获取玩家信息
   */
  public async handleGamePlayerGetLocal(context): Promise<string> {
    return new Promise((resolve) => {
      try {
        gamePlayer.getLocalPlayer(context as common.UIAbilityContext, (error, result) => {
          if (error) {
            resolve(JSON.stringify(error));
          } else {
            resolve(JSON.stringify({ code: 0, data: result }));
          }
        });
      } catch (err) {
        err.code = err.code ?? -1
        err.message = err.message ?? " Unknown game player get local error"
        err.msg ??= err.message
        resolve(JSON.stringify(err));
      }
    });
  }

  /**
   * 存入玩家信息
   */
  public async handleGamePlayerSave(playerInfo: object, context): Promise<string> {

    let request: gamePlayer.GSKPlayerRole = (playerInfo) as gamePlayer.GSKPlayerRole;

    try {
      request.roleId ??= "0";
      request.roleName ??= "default";
      await gamePlayer.savePlayerRole(context as common.UIAbilityContext, request)
      return JSON.stringify({ code: 0 });
    } catch (err) {
      Logger.error(JSON.stringify(err));
      err.code = err.code ?? -1;
      err.msg ??= err.message
      return JSON.stringify(err);
    }

  }


  public static getInstance() {
    if (Instance == null) {
      Instance = new SDKHandler();
    }
    return Instance;
  }
}


function strToProductType(params: string): iap.ProductType {
  switch (params) {
    case "CONSUMABLE":
      return iap.ProductType.CONSUMABLE;
    case "NONCONSUMABLE":
      return iap.ProductType.NONCONSUMABLE;
    case "AUTORENEWABLE":
      return iap.ProductType.AUTORENEWABLE;
    case "0":
      return iap.ProductType.CONSUMABLE;
    case "1":
      return iap.ProductType.NONCONSUMABLE;
    case "2":
      return iap.ProductType.AUTORENEWABLE;
    default:
      return iap.ProductType.CONSUMABLE;
  }
}


function strToQueryType(params: string): iap.PurchaseQueryType {
  switch (params) {
    case "ALL":
      return iap.PurchaseQueryType.ALL;
    case "UNFINISHED":
      return iap.PurchaseQueryType.UNFINISHED;
    case "CURRENT_ENTITLEMENT":
      return iap.PurchaseQueryType.CURRENT_ENTITLEMENT;
    default:
      return iap.PurchaseQueryType.UNFINISHED;

  }
}

export interface InAppPurchaseData {
  purchaseToken: string;
  purchaseState: string;
  productId: string;
  price: string;
  currency: string;
}

export interface PurchaseData {
  type: number;
  jwsPurchaseOrder?: string;
  jwsSubscriptionStatus?: string;
  iap_version: string;
  restore: boolean;
  env: number;
  developerPayload?: string;
}

export interface SubGroupStatusPayload {
  environment: string;
  applicationId: string;
  packageName: string;
  subGroupId: string;
  lastSubscriptionStatus?: SubscriptionStatus;
  historySubscriptionStatusList?: SubscriptionStatus;
}

export interface SubscriptionStatus {
  subGroupGenerationId: string;
  subscriptionId: string;
  purchaseToken: string;
  status: string;
  expiresTime: number;
  recentPurchaseOrderList?: PurchaseOrderPayload[];
  renewalInfo?: SubRenewalInfo;
}


export interface PurchaseOrderPayload {
  applicationId: string;
  countryCode: string;
  environment: string;
  payOrderId: string;
  price: number;
  productId: string;
  productType: number;
  purchaseOrderId: string;
  purchaseTime: number;
  purchaseToken: string;
  signedTime: number;
  developerPayload?: string;
}

export interface SubRenewalInfo {
  productId: string;
}


export interface ProductInfo extends iap.Product {
  subStatus?: string;
}
