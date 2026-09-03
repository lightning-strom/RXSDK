// @keepTs
// @ts-nocheck
import { RXErrorCode } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { RCallback, RXResult } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import { Singleton } from "@normalized:N&&&hmssdk/src/main/ets/types/Types&4.0.0";
import Objects from "@normalized:N&&&hmssdk/src/main/ets/utils/Objects&4.0.0";
import { RXUtil } from "@normalized:N&&&hmssdk/src/main/ets/utils/RXUtil&4.0.0";
import { WXApi } from "@normalized:N&&&hmssdk/src/main/ets/wx/WXApi&4.0.0";
interface WXBusinessResp extends RXResult {
    extMsg?: string;
    businessType?: string;
    result?: 'success' | 'fail' | 'cancel';
}
export class WXSdkWrapper extends Singleton<WXSdkWrapper> {
    async openBusinessView(h205: Record<string, any>, i205?: RCallback): Promise<RXResult> {
        try {
            let k205 = await WXApi.getInstance(h205["wx_appid"]).openBusinessView({
                businessType: h205["businessType"], query: h205["query"],
                extInfo: h205["extInfo"]
            });
            let l205 = k205.errStr;
            let m205: WXBusinessResp = {
                code: k205.errCode,
                message: l205 || ''
            };
            if (k205.extMsg) {
                m205 = Objects.assign(m205, JSON.parse(k205.extMsg));
                l205 = l205 ?? m205.result;
            }
            if (m205.code == 0) {
                i205?.(m205);
                return m205;
            }
            else {
                let n205 = RXUtil.getRXResult(WXApi.toRXShareError(m205.code), l205, m205.code);
                i205?.(n205);
                return n205;
            }
        }
        catch (j205) {
            i205?.(RXUtil.formatResult(j205, RXErrorCode.SHARE_PARAMS_ERROR));
            return j205;
        }
    }
}
