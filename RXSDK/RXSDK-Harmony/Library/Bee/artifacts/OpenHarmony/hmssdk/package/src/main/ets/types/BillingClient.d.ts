import { OrderData, PayParams, RXResult } from "./Index";
export declare abstract class BillingClient {
    protected _callbackFrom?: number;
    static init(g171?: string): void;
    getOrder(f171: PayParams): Promise<RXResult<OrderData>>;
    notifyResult(c171: string, d171: Record<string, any>): Promise<RXResult>;
    pay(a171: PayParams): Promise<RXResult>;
    handleParams(z170: PayParams): PayParams;
    queryPurchases(y170: any): void;
    abstract name(): string;
    abstract onOrderResponse(x170: OrderData): Promise<RXResult>;
}
