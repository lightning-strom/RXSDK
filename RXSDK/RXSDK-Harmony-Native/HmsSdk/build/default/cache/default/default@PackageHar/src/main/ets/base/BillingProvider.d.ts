import { BillingClient } from '../types/BillingClient';
import { PayParams, RXCallback, RXResult } from '../types/Index';
declare class BillingProvider {
    private static instance;
    private providers;
    constructor();
    getProvider(v11: string): BillingClient | undefined;
    register(u11: BillingClient): void;
    queryPurchases(p11: any, q11?: string): any;
    pay(k11: PayParams, l11?: RXCallback<RXResult>): Promise<RXResult>;
}
declare const billingProvider: BillingProvider;
export declare function RegisterPayment(): (target: new () => BillingClient) => void;
export default billingProvider;
