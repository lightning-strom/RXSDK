import type { RCallback, RXResult, SchedulingReportParams, ShareFuncParams, ShareParams, ShortLinkParams } from '../types/Index';
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import { RXRequest } from "@normalized:N&&&hmssdk/src/main/ets/net/RXRequest&4.0.0";
import ApiPath from "@normalized:N&&&hmssdk/src/main/ets/constants/ApiPath&4.0.0";
import SDKConfig from "@normalized:N&&&hmssdk/src/main/ets/sdk/SDKConfig&4.0.0";
import Passport from "@normalized:N&&&hmssdk/src/main/ets/base/Passport&4.0.0";
import Objects from "@normalized:N&&&hmssdk/src/main/ets/utils/Objects&4.0.0";
import type { ShareData } from './ShareData';
import { RXUtil } from "@normalized:N&&&hmssdk/src/main/ets/utils/RXUtil&4.0.0";
interface DefaultParams {
    type: string;
    product_id: string;
    channel_id: string;
    open_id: string | null;
    sub_channel_id: string;
}
export default class ShareImpl {
    protected shareData?: ShareData;
    protected handleShareData(k169: ShareData, l169: ShareFuncParams): ShareData {
        let m169 = k169?.content?.url;
        if (m169) {
            try {
                if (l169.protocol_android) {
                    m169 += `&protocol_android=${encodeURIComponent(String(l169.protocol_android))}`;
                }
                if (l169.protocol_ios) {
                    m169 += `&protocol_ios=${encodeURIComponent(String(l169.protocol_ios))}`;
                }
                if (l169.use_scheme) {
                    m169 += `&use_scheme=${l169.use_scheme}`;
                }
                m169 += `&api=${encodeURIComponent(SDKConfig.domain)}`;
                k169.content!.url = m169;
            }
            catch (n169) {
                Logger.e(n169);
            }
        }
        return k169;
    }
    public isShareFuncParams(j169: ShareParams | ShareFuncParams): j169 is ShareFuncParams {
        return 'func' in j169;
    }
    protected getDefaultParams(): Record<string, ESObject> {
        const i169: DefaultParams = {
            type: "app",
            product_id: SDKConfig.productId,
            channel_id: SDKConfig.channelId,
            open_id: Passport.openid,
            sub_channel_id: SDKConfig.subChannelId,
        };
        return i169;
    }
    async getShareData(d169: ShareFuncParams, e169?: RCallback<ShareData>): Promise<RXResult<ShareData>> {
        try {
            d169 = Objects.assign(this.getDefaultParams(), d169);
            let h169 = await RXRequest.post<ShareData>(ApiPath.GET_DATA, d169);
            if (h169.code == 0 && h169.data) {
                this.shareData = this.handleShareData(h169.data, d169);
                h169.data = this.shareData;
            }
            e169?.(h169);
            return h169;
        }
        catch (f169) {
            let g169 = RXUtil.formatResult(f169) as RXResult<ShareData>;
            e169?.(g169);
            return g169;
        }
    }
    async shareSchedulingReport(z168: SchedulingReportParams, a169?: RCallback): Promise<RXResult<object>> {
        let b169: RXResult<object>;
        try {
            z168 = Objects.assign(this.getDefaultParams, z168);
            b169 = await RXRequest.post(ApiPath.SCHEDULING_REPORT, z168);
            if (b169.code == 0) {
            }
        }
        catch (c169) {
            b169 = RXUtil.formatResult(c169);
        }
        finally {
            a169?.(b169);
            return b169;
        }
    }
    async getShortUrl(x168: ShortLinkParams, y168?: RCallback): Promise<RXResult<object>> {
        return await RXRequest.post("v1/url/short", x168, null, RXUtil.toRXCallback(y168));
    }
}
