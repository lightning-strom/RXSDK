import iap from '@hms.core.iap';
import gamePlayer from '@hms.core.gameservice.gameplayer';
export declare class SDKHandler {
    static Invoke: {
        Login: (param: ESObject) => Promise<string>;
        Logout: (param: ESObject) => Promise<string>;
        BindPlayer: (param: ESObject) => Promise<string>;
        UnBindPlayer: (param: ESObject) => Promise<string>;
        UnionLogin: (param: ESObject) => Promise<string>;
        IAPInit: (param: ESObject) => Promise<string>;
        QueryList: (param: ESObject) => Promise<string>;
        StartPurchase: (param: ESObject) => Promise<string>;
        ConsumePurchase: (param: ESObject) => Promise<string>;
        CheckOwnedPurchases: (param: ESObject) => Promise<string>;
        GamePlayerInit: (param: ESObject) => Promise<string>;
        GetLocalPlayer: (param: ESObject) => Promise<string>;
        SavePlayerRole: (param: ESObject) => Promise<string>;
        VerifyLocalPlayer: (param: ESObject) => Promise<string>;
    };
    /**
     * 登录
     */
    login(m164: any, n164: {
        forceAuthorization?: boolean;
    }): Promise<object>;
    auth(d164: any, e164: {
        scopes?: string[];
        permissions?: string[];
        forceAuthorization?: boolean;
    }, f164?: boolean, g164?: gamePlayer.GSKLocalPlayer): Promise<object>;
    logout(w163: any): Promise<object>;
    /**
     * 登录
     */
    handleLogin(s163: any, t163: {
        forceAuthorization?: boolean;
    }): Promise<string>;
    handleAuth(m163: any, n163: {
        scopes?: string[];
        permissions?: string[];
        forceAuthorization?: boolean;
    }, o163?: boolean, p163?: gamePlayer.GSKLocalPlayer): Promise<string>;
    handleUnionLogin(u162: {
        accountInfos?: Array<object>;
        showLoginDialog?: boolean;
        loginPanelType?: number;
        scopes?: string[];
        permissions?: string[];
        forceAuthorization?: boolean;
    }, v162: any): Promise<string>;
    /**
     * 初始化IAP
     */
    handleInitIAP(s162: any): Promise<string>;
    /**
     * 查询商品列表（查询的商品storeIdList必须是您在AppGallery Connect网站配置的商品）
     * productType: iap.ProductType.CONSUMABLE：消耗型商品; iap.ProductType.NONCONSUMABLE：非消耗型商品;
     */
    handleQueryIAPList(l162: string, m162: string[], n162: any): Promise<string>;
    startPurchase(f162: iap.PurchaseParameter, g162: any): Promise<string>;
    /**
     * 发起购买
     */
    handleStartPurchase(b162: string, c162: string, d162: any): Promise<string>;
    /**
     * 核销购买(purchaseToken为StartPurchase回参内容 或 CheckOwnedPurchases接口查询出来)
     */
    handleConsumePurchase(t161: string, u161: any): Promise<string>;
    /**
     * 查询已购买商品
     */
    handleCheckOwnedPurchases(j161: string, k161: string, l161: any): Promise<string>;
    /**
     * 初始化gameservice
     */
    handleGamePlayerInit(h161: any): Promise<string>;
    private onPlayerChangedEventCallback;
    /**
     * 调用verifyLocalPlayer接口进行合规校验
     */
    handleVerifyLocalPlayer(z160: object, a161: any): Promise<string>;
    handleBingPlayer(v160: {
        thirdOpenId: string;
        teamPlayerId?: string;
    }, w160: any): Promise<string>;
    handleUnBingPlayer(r160: {
        thirdOpenId: string;
        teamPlayerId?: string;
    }, s160: any): Promise<string>;
    /**
     * 登出
     */
    handleLogout(h160: any): Promise<string>;
    /**
     * 获取玩家信息
     */
    handleGamePlayerGetLocal(c160: any): Promise<string>;
    /**
     * 存入玩家信息
     */
    handleGamePlayerSave(y159: object, z159: any): Promise<string>;
    static getInstance(): SDKHandler;
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
