import { LoginDecorator } from "@normalized:N&&&hmssdk/src/main/ets/base/LoginDecorator&4.0.0";
import Passport from "@normalized:N&&&hmssdk/src/main/ets/base/Passport&4.0.0";
import ApiPath from "@normalized:N&&&hmssdk/src/main/ets/constants/ApiPath&4.0.0";
import { RXRequest, RequestMethod } from "@normalized:N&&&hmssdk/src/main/ets/net/RXRequest&4.0.0";
import { RXError, RXErrorCode } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { OrderData, PayParams, RXResult } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
export abstract class BillingClient {
    protected _callbackFrom?: number;
    public static init(g171?: string) {
    }
    @LoginDecorator
    async getOrder(f171: PayParams): Promise<RXResult<OrderData>> {
        if (!f171) {
            throw new RXError("params is null error", RXErrorCode.PAY_PARAMS_ERROR);
        }
        f171.currency ??= "CNY";
        f171.openid ??= Passport.openid;
        f171.age ??= Passport.loginData?.age;
        this._callbackFrom = f171.callback_from;
        return RXRequest.request({
            path: ApiPath.ORDER,
            data: f171,
            method: RequestMethod.POST,
        });
    }
    notifyResult(c171: string, d171: Record<string, any>): Promise<RXResult> {
        if (!c171) {
            throw new RXError("notifyUrl is null error", RXErrorCode.PAY_PARAMS_ERROR);
        }
        let e171 = RXRequest.request<RXResult>({
            path: c171,
            data: d171,
            method: RequestMethod.POST,
        });
        return e171;
    }
    async pay(a171: PayParams): Promise<RXResult> {
        let b171 = await this.getOrder(this.handleParams(a171));
        if (b171.code == 0) {
            return this.onOrderResponse(b171.data);
        }
        else {
            return b171;
        }
    }
    handleParams(z170: PayParams): PayParams {
        return z170;
    }
    queryPurchases(y170) {
    }
    abstract name(): string;
    abstract onOrderResponse(x170: OrderData): Promise<RXResult>;
}
