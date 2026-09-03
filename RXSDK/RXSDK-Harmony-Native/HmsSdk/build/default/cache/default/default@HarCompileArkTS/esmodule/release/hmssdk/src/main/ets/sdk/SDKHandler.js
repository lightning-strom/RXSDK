import { __MODULE_NAME__, __BUNDLE_NAME__ } from '@normalized:N&&&hmssdk/build/default/generated/profile/default/ModuleInfo&4.0.0';
import { Logger } from '@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0';
import authentication from '@hms:core.authentication';
import iap from '@hms:core.iap';
import hilog from '@ohos:hilog';
import util from '@ohos:util';
import gamePlayer from '@hms:core.gameservice.gameplayer';
import { JWTUtil } from '@normalized:N&&&hmssdk/src/main/ets/utils/JWTUtil&4.0.0';
import JSON from '@ohos:util.json';
let Instance;
let IAP_VERSION = "12";
const isIapAvailable = canIUse('SystemCapability.Payment.IAP');
export class SDKHandler {
    async login(m164, n164) {
        n164 = n164 || {};
        try {
            let p164 = new authentication.HuaweiIDProvider().createLoginWithHuaweiIDRequest();
            p164.forceLogin = n164.forceAuthorization ?? true;
            p164.state = util.generateRandomUUID();
            p164.idTokenSignAlgorithm = authentication.IdTokenSignAlgorithm.PS256;
            let q164 = new authentication.AuthenticationController(m164);
            let r164 = await q164.executeRequest(p164);
            let s164 = r164.state;
            if (p164.state != s164) {
                Logger.error('login fail,The state is different: %{public}s', JSON.stringify(r164));
                r164['code'] = -1;
                return (r164);
            }
            return ({ code: 0, data: r164.data });
        }
        catch (o164) {
            if (typeof o164 === 'object') {
                o164.code = o164.code ?? -1;
                o164.message = o164.message ?? " Unknown login error";
                o164.msg ??= o164.message;
            }
            Logger.e(o164);
            return (o164);
        }
    }
    async auth(d164, e164, f164, g164) {
        e164 = e164 || {};
        try {
            let i164 = new authentication.HuaweiIDProvider().createAuthorizationWithHuaweiIDRequest();
            i164.scopes = e164.scopes || ['profile', 'phone'];
            i164.permissions = e164.permissions || ['serviceauthcode'];
            i164.forceAuthorization = e164.forceAuthorization ?? true;
            i164.state = util.generateRandomUUID();
            let j164 = new authentication.AuthenticationController(d164);
            let k164 = await j164.executeRequest(i164);
            if (k164.state !== i164.state) {
                return ({ code: -1, msg: "Failed to authenticate. State is different." });
            }
            let l164 = { ...k164.data, ...g164, needBinding: f164 };
            return ({ code: 0, data: l164 });
        }
        catch (h164) {
            if (typeof h164 === 'object') {
                h164.code = h164.code ?? -1;
                h164.message = h164.message ?? " Unknown login error";
                h164.msg ??= h164.message;
            }
            Logger.e(h164);
            return (h164);
        }
    }
    async logout(w163) {
        try {
            let y163 = new authentication.HuaweiIDProvider().createCancelAuthorizationRequest();
            y163.state = util.generateRandomUUID();
            let z163 = new authentication.AuthenticationController(w163);
            let a164 = await z163.executeRequest(y163);
            let b164 = a164;
            let c164 = b164.state;
            if (c164 != undefined && y163.state != c164) {
                Logger.error('cancel fail,The state is different: %{public}s', JSON.stringify(b164));
                return { code: -2, msg: "cancel fail,The state is different", ...b164 };
            }
            Logger.debug('cancel success: %{public}s', JSON.stringify(b164));
            return { code: 0, data: b164 };
        }
        catch (x163) {
            x163["code"] = x163["code"] ?? -1;
            x163.msg ??= x163.message;
            Logger.error(x163);
            return x163;
        }
    }
    async handleLogin(s163, t163) {
        t163 = t163 || {};
        try {
            let v163 = await this.login(s163, t163);
            return JSON.stringify(v163);
        }
        catch (u163) {
            if (typeof u163 === 'object') {
                u163.code = u163.code ?? -1;
                u163.message = u163.message ?? " Unknown login error";
                u163.msg ??= u163.message;
            }
            Logger.e(u163);
            return JSON.stringify(u163);
        }
    }
    async handleAuth(m163, n163, o163, p163) {
        n163 = n163 || {};
        try {
            let r163 = await this.auth(m163, n163);
            return JSON.stringify(r163);
        }
        catch (q163) {
            if (typeof q163 === 'object') {
                q163.code = q163.code ?? -1;
                q163.message = q163.message ?? " Unknown login error";
                q163.msg ??= q163.message;
            }
            Logger.e(q163);
            return JSON.stringify(q163);
        }
    }
    async handleUnionLogin(u162, v162) {
        try {
            let x162 = [];
            let y162 = u162.accountInfos ?? [];
            let z162 = u162.showLoginDialog ?? true;
            let a163 = u162.loginPanelType;
            y162.forEach(i163 => {
                let j163;
                let k163 = i163['accountIcon'];
                if (typeof i163 === 'object' && 'accountName' in i163) {
                    j163 = i163['accountName'];
                    if ('accountIcon' in i163 && typeof i163['accountIcon'] === 'string') {
                        k163 = { "id": -1, "type": -1, params: [i163['accountIcon']], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ };
                    }
                }
                if (j163 && j163 !== "") {
                    let l163 = { accountName: j163, accountIcon: k163 };
                    x162.push(l163);
                }
            });
            let b163 = {
                showLoginDialog: z162,
                loginPanelType: a163,
                thirdAccountInfos: x162
            };
            let c163 = await gamePlayer.unionLogin(v162, b163);
            let d163 = c163.accountName;
            let e163 = c163.needBinding;
            let f163 = c163.localPlayer;
            if (d163 === "hw_account") {
                let g163 = e163;
                if (c163?.boundPlayerInfo?.thirdOpenId && c163?.boundPlayerInfo?.thirdOpenId !== "") {
                    g163 = false;
                }
                let h163;
                if (g163) {
                    h163 = await this.auth(v162, {
                        scopes: u162.scopes,
                        permissions: u162.permissions,
                        forceAuthorization: u162.forceAuthorization
                    }, e163, f163);
                }
                else {
                    h163 = await this.login(v162, {
                        forceAuthorization: u162.forceAuthorization
                    });
                }
                if (h163.code == 0) {
                    return JSON.stringify({ ...c163, ...h163 });
                }
                else {
                    if (h163.code == 1001502012) {
                        this.handleUnBingPlayer({ thirdOpenId: c163?.boundPlayerInfo?.thirdOpenId || util.generateRandomUUID(), teamPlayerId: c163.localPlayer.teamPlayerId }, v162);
                    }
                    return JSON.stringify(h163);
                }
            }
            else {
                return JSON.stringify({ code: 0, ...c163, data: { accountType: "game_account" } });
            }
        }
        catch (w162) {
            if (typeof w162 === 'object') {
                w162.code ??= -1;
                w162.message ??= " Unknown login error";
                w162.msg ??= w162.message;
            }
            w162.msg ??= w162.message;
            Logger.error(`Failed to log in. Error: ${w162.message}`);
            return JSON.stringify(w162);
        }
    }
    async handleInitIAP(s162) {
        try {
            await iap.queryEnvironmentStatus(s162);
            Logger.info(`Iap queryEnvironmentStatus: Success:`);
            return JSON.stringify({ "code": 0 });
        }
        catch (t162) {
            Logger.error(`Iap queryEnvironmentStatus:` + JSON.stringify(t162));
            t162.code = t162.code || -1;
            t162.message = t162.message || "Unknown Error";
            t162.msg ??= t162.message;
            return JSON.stringify(t162);
        }
    }
    async handleQueryIAPList(l162, m162, n162) {
        const o162 = {
            productIds: m162,
            productType: strToProductType(l162),
        };
        return new Promise((p162) => {
            iap.queryProducts(n162, o162).then((r162) => {
                p162(JSON.stringify({ code: 0, data: r162 }));
            }).catch((q162) => {
                p162(JSON.stringify(q162));
            });
        });
    }
    async startPurchase(f162, g162) {
        try {
            const j162 = await iap.createPurchase(g162, f162);
            const k162 = JSON.parse(j162.purchaseData);
            k162.iap_version = IAP_VERSION;
            Logger.debug(JSON.stringify(k162));
            return JSON.stringify({ code: 0, data: k162 });
        }
        catch (h162) {
            Logger.error(JSON.stringify(h162));
            h162.code = h162.code ?? -1;
            h162.msg ??= h162.message;
            if (h162.code === iap.IAPErrorCode.PRODUCT_OWNED || h162.code === iap.IAPErrorCode.SYSTEM_ERROR) {
                let i162 = await this.handleCheckOwnedPurchases("CONSUMABLE", "UNFINISHED", g162);
                return i162;
            }
            else {
                return JSON.stringify(h162);
            }
        }
    }
    async handleStartPurchase(b162, c162, d162) {
        const e162 = {
            productId: c162,
            productType: strToProductType(b162),
        };
        return this.startPurchase(e162, d162);
    }
    async handleConsumePurchase(t161, u161) {
        let v161 = JWTUtil.decodeJwtObj(t161);
        let w161 = JSON.parse(v161);
        let x161 = {
            productType: w161.productType,
            purchaseToken: w161.purchaseToken,
            purchaseOrderId: w161.purchaseOrderId
        };
        return new Promise((y161) => {
            iap.finishPurchase(u161, x161, (z161, a162) => {
                if (z161) {
                    Logger.error(`Iap consumePurchase: Error: ${z161.code}`);
                    y161(JSON.stringify(z161));
                }
                Logger.info(`Iap consumePurchase success`);
                y161(JSON.stringify({ code: 0 }));
            });
        });
    }
    async handleCheckOwnedPurchases(j161, k161, l161) {
        try {
            const n161 = {
                productType: strToProductType(j161),
                queryType: strToQueryType(k161),
            };
            await iap.queryEnvironmentStatus(l161);
            const o161 = await iap.queryPurchases(l161, n161);
            const p161 = o161.purchaseDataList;
            if (!p161 || p161.length === 0) {
                Logger.info("queryPurchases list is null.");
                return JSON.stringify({ code: -1, message: "queryPurchases list null." });
            }
            const q161 = p161[0];
            const r161 = JSON.parse(q161);
            let s161 = JSON.parse(JWTUtil.decodeJwtObj(r161.jwsPurchaseOrder));
            r161.developerPayload = s161.developerPayload;
            r161.iap_version = IAP_VERSION;
            r161.restore = true;
            Logger.debug(JSON.stringify(r161));
            return JSON.stringify({ code: 0, data: r161 });
        }
        catch (m161) {
            m161.code ??= -1;
            m161.msg ??= m161.message;
            return JSON.stringify(m161);
        }
    }
    async handleGamePlayerInit(h161) {
        try {
            await gamePlayer.init(h161);
            Logger.info(`Game Service Init Success`);
            gamePlayer.on('playerChanged', this.onPlayerChangedEventCallback);
            return JSON.stringify({ code: 0 });
        }
        catch (i161) {
            i161.code = i161.code ?? -1;
            i161.message = i161.message ?? "Unknown game player init error";
            i161.msg ??= i161.message;
            Logger.e(i161);
            return JSON.stringify(i161);
        }
    }
    onPlayerChangedEventCallback(g161) {
        if (g161.event === gamePlayer.PlayerChangedEvent.SWITCH_GAME_ACCOUNT) {
            Logger.info(`onPlayerChangedEventCallback ` + g161.resultInfo);
        }
    }
    async handleVerifyLocalPlayer(z160, a161) {
        try {
            let d161 = (z160 ? (z160) : {});
            let e161 = d161;
            await gamePlayer.verifyLocalPlayer(a161, e161);
            if (!d161["verify_only"]) {
                let f161 = d161;
                f161.roleId ??= "0";
                f161.roleName ??= "default";
                await gamePlayer.savePlayerRole(a161, f161);
            }
            return JSON.stringify({ code: 0 });
        }
        catch (b161) {
            b161.msg ??= b161.message;
            let c161 = JSON.stringify(b161);
            Logger.info(`handleVerifyLocalPlayer:` + c161);
            return c161;
        }
    }
    async handleBingPlayer(v160, w160) {
        try {
            await gamePlayer.bindPlayer(w160, v160.thirdOpenId, v160.teamPlayerId);
            return JSON.stringify({ code: 0, data: v160 });
        }
        catch (x160) {
            x160.code ??= -1;
            x160.msg ??= x160.message;
            let y160 = JSON.stringify(x160);
            Logger.error(y160);
            return y160;
        }
    }
    async handleUnBingPlayer(r160, s160) {
        try {
            Logger.d("unbindPlayer thirdOpenId:" + r160.thirdOpenId + " ,teamPlayerId:" + r160.teamPlayerId);
            await gamePlayer.unbindPlayer(s160, r160.thirdOpenId, r160.teamPlayerId);
            return JSON.stringify({ code: 0, data: r160 });
        }
        catch (t160) {
            t160.code ??= -1;
            t160.msg ??= t160.message;
            let u160 = JSON.stringify(t160);
            Logger.error(u160);
            return u160;
        }
    }
    async handleLogout(h160) {
        let i160 = new authentication.HuaweiIDProvider().createCancelAuthorizationRequest();
        i160.state = util.generateRandomUUID();
        return new Promise((j160, k160) => {
            try {
                let m160 = new authentication.AuthenticationController(h160);
                m160.executeRequest(i160, (n160, o160) => {
                    if (n160) {
                        Logger.error('cancel fail,error: %{public}s', JSON.stringify(n160));
                        j160(JSON.stringify(n160));
                        return;
                    }
                    let p160 = o160;
                    let q160 = p160.state;
                    if (q160 != undefined && i160.state != q160) {
                        Logger.error('cancel fail,The state is different: %{public}s', JSON.stringify(p160));
                        p160["code"] = p160["code"] ?? -2;
                        j160(JSON.stringify(p160));
                        return;
                    }
                    hilog.debug(0x0000, 'SDKHandler', 'cancel success: %{public}s', JSON.stringify(p160));
                    j160(JSON.stringify({ code: 0, data: p160 }));
                });
            }
            catch (l160) {
                Logger.error('cancel failed: %{public}s', JSON.stringify(l160));
                l160["code"] = l160["code"] ?? -1;
                l160.msg ??= l160.message;
                j160(JSON.stringify(l160));
            }
        });
    }
    async handleGamePlayerGetLocal(c160) {
        return new Promise((d160) => {
            try {
                gamePlayer.getLocalPlayer(c160, (f160, g160) => {
                    if (f160) {
                        d160(JSON.stringify(f160));
                    }
                    else {
                        d160(JSON.stringify({ code: 0, data: g160 }));
                    }
                });
            }
            catch (e160) {
                e160.code = e160.code ?? -1;
                e160.message = e160.message ?? " Unknown game player get local error";
                e160.msg ??= e160.message;
                d160(JSON.stringify(e160));
            }
        });
    }
    async handleGamePlayerSave(y159, z159) {
        let a160 = (y159);
        try {
            a160.roleId ??= "0";
            a160.roleName ??= "default";
            await gamePlayer.savePlayerRole(z159, a160);
            return JSON.stringify({ code: 0 });
        }
        catch (b160) {
            Logger.error(JSON.stringify(b160));
            b160.code = b160.code ?? -1;
            b160.msg ??= b160.message;
            return JSON.stringify(b160);
        }
    }
    static getInstance() {
        if (Instance == null) {
            Instance = new SDKHandler();
        }
        return Instance;
    }
}
SDKHandler.Invoke = {
    Login: function (x159) {
        return SDKHandler.getInstance().handleLogin(globalThis?.AbilityContext, x159);
    },
    Logout: function (w159) {
        return SDKHandler.getInstance().handleLogout(globalThis?.AbilityContext);
    },
    BindPlayer: function (v159) {
        return SDKHandler.getInstance().handleBingPlayer(v159, globalThis?.AbilityContext);
    },
    UnBindPlayer: function (u159) {
        return SDKHandler.getInstance().handleUnBingPlayer(u159, globalThis?.AbilityContext);
    },
    UnionLogin: function (t159) {
        return SDKHandler.getInstance().handleUnionLogin(t159, globalThis?.AbilityContext);
    },
    IAPInit: function (s159) {
        return SDKHandler.getInstance().handleQueryIAPList(s159.productType, s159.productIds, globalThis?.AbilityContext);
    },
    QueryList: function (r159) {
        return SDKHandler.getInstance().handleStartPurchase(r159.productType, r159.productId, globalThis?.AbilityContext);
    },
    StartPurchase: function (q159) {
        return SDKHandler.getInstance().startPurchase(q159, globalThis?.AbilityContext);
    },
    ConsumePurchase: function (p159) {
        return SDKHandler.getInstance().handleConsumePurchase(p159.purchaseToken, globalThis?.AbilityContext);
    },
    CheckOwnedPurchases: function (o159) {
        return SDKHandler.getInstance().handleCheckOwnedPurchases(o159.productType, o159.queryType, globalThis?.AbilityContext);
    },
    GamePlayerInit: function (n159) {
        return SDKHandler.getInstance().handleGamePlayerInit(globalThis?.AbilityContext);
    },
    GetLocalPlayer: function (m159) {
        return SDKHandler.getInstance().handleGamePlayerGetLocal(globalThis?.AbilityContext);
    },
    SavePlayerRole: function (l159) {
        return SDKHandler.getInstance().handleGamePlayerSave(l159, globalThis?.AbilityContext);
    },
    VerifyLocalPlayer: function (k159) {
        return SDKHandler.getInstance().handleVerifyLocalPlayer(k159, globalThis?.AbilityContext);
    }
};
function strToProductType(j159) {
    switch (j159) {
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
function strToQueryType(i159) {
    switch (i159) {
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
