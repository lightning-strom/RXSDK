import { RequestMethod, RXRequest } from "@normalized:N&&&hmssdk/src/main/ets/net/RXRequest&4.0.0";
import SDKConfig from "@normalized:N&&&hmssdk/src/main/ets/sdk/SDKConfig&4.0.0";
import type { RCallback } from '../types/Index';
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
const LEGAL = "v1/operationapi/legal";
const LEGAL_TERMS = "v1/operationapi/legal/terms";
class Legal {
    legal(o1?: RCallback) {
        return RXRequest.request({
            path: LEGAL,
            data: { channel_id: SDKConfig.channelId, product_id: SDKConfig.productId },
            withToken: false,
            method: RequestMethod.GET,
        }, o1);
    }
    legalTerms(m1: {
        product_id?: string;
        channel_id?: string;
        keys?: string;
        position?: string;
    }, n1?: RCallback) {
        m1.product_id ??= SDKConfig.productId;
        m1.channel_id ??= SDKConfig.channelId;
        if (!m1.keys && !m1.position) {
            Logger.e("keys 和 position 参数必须二选一");
        }
        return RXRequest.request({
            path: LEGAL_TERMS,
            data: m1,
            withToken: false,
            method: RequestMethod.GET,
        }, n1);
    }
}
export default new Legal();
