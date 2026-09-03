import { RXErrorCode } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { OrderData, RXResult } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import iap from "@hms:core.iap";
import SDKConfig from "@normalized:N&&&hmssdk/src/main/ets/sdk/SDKConfig&4.0.0";
import type common from "@ohos:app.ability.common";
import { JWTUtil } from "@normalized:N&&&hmssdk/src/main/ets/utils/JWTUtil&4.0.0";
import { RegisterPayment } from "@normalized:N&&&hmssdk/src/main/ets/base/BillingProvider&4.0.0";
import { BillingClient } from "@normalized:N&&&hmssdk/src/main/ets/types/BillingClient&4.0.0";
import { RXUtil } from "@normalized:N&&&hmssdk/src/main/ets/utils/RXUtil&4.0.0";
export interface PurchaseData {
    type: number;
    jwsPurchaseOrder?: string;
    jwsSubscriptionStatus?: string;
    iap_version: string;
    restore: boolean;
    env: number;
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
const IAP_VERSION: string = "12";
const CALLBACK_FROM_CLIENT: number = 1;
@RegisterPayment()
class HmsPay extends BillingClient {
    private _notifyUrl?: string = undefined;
    getDeveloperPayload(i14: OrderData): string {
        const { order_no: j14, price: k14, notify_url: l14 } = i14;
        return [j14, k14, (l14)].join(',');
    }
    async onOrderResponse(b14: OrderData): Promise<RXResult<object>> {
        let c14: common.UIAbilityContext = SDKConfig.context;
        try {
            let f14: iap.PurchaseParameter = b14.ext as iap.PurchaseParameter;
            f14.productId ??= b14.ext?.["third_tag"];
            f14.productType ??= iap.ProductType.CONSUMABLE;
            f14.developerPayload ??= this.getDeveloperPayload(b14);
            f14.reservedInfo ??= b14.transmit_args;
            this._notifyUrl = b14.notify_url;
            let g14: iap.CreatePurchaseResult = await iap.createPurchase(c14, f14);
            const h14 = JSON.parse(g14.purchaseData) as PurchaseData;
            h14.iap_version = IAP_VERSION;
            Logger.debug(JSON.stringify(h14));
            if (this._callbackFrom == CALLBACK_FROM_CLIENT) {
                return this.notifyPay(b14.notify_url, h14, c14);
            }
            else {
                return RXUtil.getRXResult(RXErrorCode.OK);
            }
        }
        catch (d14) {
            Logger.warn(JSON.stringify(d14));
            d14.code = d14.code ?? -1;
            d14.msg ??= d14.message;
            if (d14.code === iap.IAPErrorCode.PRODUCT_OWNED || d14.code === iap.IAPErrorCode.SYSTEM_ERROR) {
                let e14 = await this.handleOwnedPurchases({
                    productType: iap.ProductType.CONSUMABLE
                }, c14);
                return e14;
            }
            else {
                return d14;
            }
        }
    }
    name(): string {
        return 'harmony';
    }
    static install() {
    }
    async queryPurchases(a14: common.UIAbilityContext) {
        await iap.queryEnvironmentStatus(a14 as common.UIAbilityContext);
        Logger.info("queryEnvironmentStatus invoked.");
        return this.handleOwnedPurchases({
            productType: iap.ProductType.CONSUMABLE
        }, a14);
    }
    public async handleOwnedPurchases(s13: iap.QueryPurchasesParameter, t13: common.UIAbilityContext): Promise<RXResult<object>> {
        try {
            s13.productType ??= iap.ProductType.CONSUMABLE;
            s13.queryType ??= iap.PurchaseQueryType.UNFINISHED;
            const v13: iap.QueryPurchaseResult = await iap.queryPurchases(t13 as common.UIAbilityContext, s13);
            const w13 = v13.purchaseDataList;
            if (!w13 || w13.length === 0) {
                Logger.info("queryPurchases list is null.");
                return RXUtil.getRXResult(RXErrorCode.PAY_ERROR, "未能获取到已购买商品的相关数据，请检查支付参数");
            }
            const x13 = w13[0];
            const y13 = JSON.parse(x13) as PurchaseData;
            y13.iap_version = IAP_VERSION;
            y13.restore = true;
            let z13 = this.parseDeveloperPayload(y13);
            return this.notifyPay(z13?.notify_url || this._notifyUrl, y13, t13);
        }
        catch (u13) {
            return RXUtil.getRXResult(RXErrorCode.PAY_ERROR, "获取已购买商品错误", u13.code, u13.message);
        }
    }
    async notifyPay(o13: string, p13: PurchaseData, q13): Promise<RXResult> {
        let r13 = await this.notifyResult(o13, p13);
        if (r13.code == 0 && !r13.data?.["consumed"]) {
            this.consumePurchase(p13, q13);
        }
        return r13;
    }
    async consumePurchase(i13: PurchaseData, j13): Promise<RXResult> {
        try {
            let l13 = JWTUtil.decodeJwtObj(i13.jwsPurchaseOrder);
            let m13 = JSON.parse(l13) as PurchaseOrderPayload;
            let n13: iap.FinishPurchaseParameter = {
                productType: m13.productType,
                purchaseToken: m13.purchaseToken,
                purchaseOrderId: m13.purchaseOrderId
            };
            await iap.finishPurchase(j13 as common.UIAbilityContext, n13);
            return RXUtil.getRXResult(RXErrorCode.OK);
        }
        catch (k13) {
            Logger.e(k13);
            return k13;
        }
    }
    parseDeveloperPayload(d13: PurchaseData): OrderData | null {
        let e13 = JSON.parse(JWTUtil.decodeJwtObj(d13.jwsPurchaseOrder)) as PurchaseOrderPayload;
        let f13 = e13.developerPayload;
        if (f13 && f13.trim()) {
            const g13 = f13.split(",");
            if (g13.length >= 3) {
                const h13: OrderData = {
                    order_no: g13[0],
                    price: parseInt(g13[1]) || 0,
                    notify_url: g13[2],
                };
                return h13;
            }
        }
        return null;
    }
}
export default HmsPay;
