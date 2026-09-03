import type { BillingClient } from '../types/BillingClient';
import { RXErrorCode } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { PayParams, RXCallback, RXResult } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import Objects from "@normalized:N&&&hmssdk/src/main/ets/utils/Objects&4.0.0";
import { RXUtil } from "@normalized:N&&&hmssdk/src/main/ets/utils/RXUtil&4.0.0";
class BillingProvider {
    private static instance: BillingProvider;
    private providers: Map<string, BillingClient> = new Map();
    constructor() {
        if (!BillingProvider.instance) {
            BillingProvider.instance = this;
        }
        return BillingProvider.instance;
    }
    getProvider(v11: string): BillingClient | undefined {
        Logger.d("provider types：" + Objects.stringify(this.providers));
        return this.providers.get(v11);
    }
    register(u11: BillingClient) {
        console.log("register type " + u11.name());
        this.providers.set(u11.name(), u11);
    }
    queryPurchases(p11, q11?: string) {
        try {
            q11 ??= "harmony";
            let s11: BillingClient = this.getProvider(q11 ?? "harmony");
            if (!s11) {
                let t11 = RXUtil.getRXResult(RXErrorCode.PAY_ERROR, "not support pay type " + q11);
                Logger.w("not support type " + q11);
                return t11;
            }
            else {
                return s11.queryPurchases(p11);
            }
        }
        catch (r11) {
            Logger.e(r11);
            return r11;
        }
    }
    async pay(k11: PayParams, l11?: RXCallback<RXResult>): Promise<RXResult> {
        try {
            let n11: BillingClient = this.getProvider(k11.pay_type);
            if (!n11) {
                let o11 = RXUtil.getRXResult(RXErrorCode.PAY_ERROR, "not support pay type " + k11.pay_type);
                Logger.w("not support type " + k11.pay_type);
                l11?.(null, o11);
                return o11;
            }
            else {
                Logger.d("invoke pay " + JSON.stringify(k11));
                return n11.pay(k11);
            }
        }
        catch (m11) {
            Logger.e(m11);
            return m11;
        }
    }
}
const billingProvider = new BillingProvider();
export function RegisterPayment() {
    return function (i11: new () => BillingClient) {
        const j11 = new i11();
        billingProvider.register(j11);
    };
}
export default billingProvider;
