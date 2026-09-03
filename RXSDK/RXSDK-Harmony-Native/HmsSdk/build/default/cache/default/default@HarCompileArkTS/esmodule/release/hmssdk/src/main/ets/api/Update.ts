import ApiPath from "@normalized:N&&&hmssdk/src/main/ets/constants/ApiPath&4.0.0";
import { RXRequest, RequestMethod } from "@normalized:N&&&hmssdk/src/main/ets/net/RXRequest&4.0.0";
import SDKConfig from "@normalized:N&&&hmssdk/src/main/ets/sdk/SDKConfig&4.0.0";
import { RXErrorCode } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { RCallback, RXResult } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import Devices from "@normalized:N&&&hmssdk/src/main/ets/utils/Devices&4.0.0";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import Objects from "@normalized:N&&&hmssdk/src/main/ets/utils/Objects&4.0.0";
import { RXUtil } from "@normalized:N&&&hmssdk/src/main/ets/utils/RXUtil&4.0.0";
import UrlUtil from "@normalized:N&&&hmssdk/src/main/ets/utils/UrlUtil&4.0.0";
type queryType = {
    type: string;
    format?: string;
};
export default class Update {
    private static handlePath(r8: string) {
        return UrlUtil.joinQuery(r8, { local_country: Devices.systemCountry });
    }
    private static handleUpdateResp(q8: RXResult<object>) {
        if (q8.code == 0 && q8.data) {
        }
        return q8;
    }
    static async updateGameVersion(k8: Record<string, any>, l8: RCallback) {
        try {
            k8 ??= {};
            k8.type ??= "js";
            const o8 = {
                api: SDKConfig.domain,
                productId: SDKConfig.productId,
                channelId: SDKConfig.channelId,
            };
            Objects.checkRequiredParams(o8, Object.keys(o8));
            return await RXRequest.request({
                method: RequestMethod.POST,
                path: this.handlePath(ApiPath.UPDATE_MODULE_VERSION),
                data: k8
            }, l8)
                .then(p8 => {
                return this.handleUpdateResp(p8);
            });
        }
        catch (m8) {
            Logger.e(m8);
            let n8 = RXUtil.formatResult(m8, RXErrorCode.INIT_ERROR);
            l8?.(n8);
            return n8;
        }
    }
    static async checkAppUpdate(z7: string, a8: string, b8?: Record<string, any>, c8?: RCallback, d8?: string, e8?: queryType) {
        try {
            const h8 = {
                productId: SDKConfig.productId,
                channelId: SDKConfig.channelId,
                deviceCode: Devices.deviceCode,
                version: z7
            };
            Objects.checkRequiredParams(h8, Object.keys(h8));
            e8 ??= {
                type: "js"
            };
            if (!e8.type && !e8.format) {
                e8.type = "js";
            }
            let i8 = `v1/vcapi/update/${SDKConfig.productId}/${SDKConfig.channelId}/${z7}/${Devices.deviceCode}/${a8}?${UrlUtil.toQueryString(e8)}`;
            return await RXRequest.request({
                method: d8 || RequestMethod.GET,
                path: this.handlePath(i8),
                data: b8 ?? {}
            }, c8)
                .then(j8 => {
                return this.handleUpdateResp(j8);
            });
        }
        catch (f8) {
            let g8 = RXUtil.formatResult(f8, RXErrorCode.INIT_ERROR);
            c8?.(g8);
            return g8;
        }
    }
    static async checkActivityUpdate(n7: string, o7: string, p7: string, q7: Record<string, any>, r7?: RCallback, s7?: string, t7?: queryType) {
        try {
            const w7 = {
                activityShortName: n7,
                activityVersion: o7,
                activityCheckVersion: p7
            };
            Objects.checkRequiredParams(w7);
            let x7 = `v1/vcapi/update_activity/${n7}/${o7}/${p7}?${UrlUtil.toQueryString(t7)}`;
            return await RXRequest.request({
                method: s7 || RequestMethod.GET,
                path: this.handlePath(x7),
                data: q7 ?? {}
            }, r7)
                .then(y7 => {
                return this.handleUpdateResp(y7);
            });
        }
        catch (u7) {
            let v7 = RXUtil.formatResult(u7, RXErrorCode.PARAMETER_ERROR);
            r7?.(v7);
            return v7;
        }
    }
    static async checkGameUpdate(b7: string, c7: string, d7: string, e7: Record<string, any>, f7?: RCallback, g7?: string, h7?: queryType) {
        try {
            const k7 = {
                gameId: b7,
                gameVersion: c7,
                gameCheckVersion: d7
            };
            Objects.checkRequiredParams(k7);
            let l7 = `v1/vcapi/update_game/${b7}/${c7}/${d7}?${UrlUtil.toQueryString(h7)}`;
            return await RXRequest.request({
                method: g7 || RequestMethod.GET,
                path: this.handlePath(l7),
                data: e7 ?? {}
            }, f7)
                .then(m7 => {
                return this.handleUpdateResp(m7);
            });
        }
        catch (i7) {
            let j7 = RXUtil.formatResult(i7, RXErrorCode.PARAMETER_ERROR);
            f7?.(j7);
            return j7;
        }
    }
}
