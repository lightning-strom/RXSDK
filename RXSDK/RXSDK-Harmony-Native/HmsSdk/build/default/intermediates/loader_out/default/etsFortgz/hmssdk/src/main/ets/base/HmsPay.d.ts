import { OrderData, RXResult } from '../types/Index';
import iap from "@hms.core.iap";
import common from "@ohos.app.ability.common";
import { BillingClient } from '../types/BillingClient';
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
declare class HmsPay extends BillingClient {
    private _notifyUrl?;
    getDeveloperPayload(i14: OrderData): string;
    onOrderResponse(b14: OrderData): Promise<RXResult<object>>;
    name(): string;
    static install(): void;
    queryPurchases(a14: common.UIAbilityContext): Promise<RXResult<object>>;
    handleOwnedPurchases(s13: iap.QueryPurchasesParameter, t13: common.UIAbilityContext): Promise<RXResult<object>>;
    notifyPay(o13: string, p13: PurchaseData, q13: any): Promise<RXResult>;
    consumePurchase(i13: PurchaseData, j13: any): Promise<RXResult>;
    parseDeveloperPayload(d13: PurchaseData): OrderData | null;
}
export default HmsPay;
