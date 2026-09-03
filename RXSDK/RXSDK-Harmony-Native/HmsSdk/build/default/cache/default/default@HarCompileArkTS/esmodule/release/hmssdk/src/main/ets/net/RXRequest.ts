import Http, { CONTENT_TYPE, RUIXUE_ENCIPHER, TEXT_PLAIN } from "@normalized:N&&&hmssdk/src/main/ets/net/http&4.0.0";
import DateTime from "@normalized:N&&&hmssdk/src/main/ets/utils/DateTime&4.0.0";
import Devices from "@normalized:N&&&hmssdk/src/main/ets/utils/Devices&4.0.0";
import type { RCallback, RXResult } from '../types/Index';
import SDKConfig from "@normalized:N&&&hmssdk/src/main/ets/sdk/SDKConfig&4.0.0";
import Passport from "@normalized:N&&&hmssdk/src/main/ets/base/Passport&4.0.0";
import Objects from "@normalized:N&&&hmssdk/src/main/ets/utils/Objects&4.0.0";
import { RXUtil } from "@normalized:N&&&hmssdk/src/main/ets/utils/RXUtil&4.0.0";
import UserActionTracer from "@normalized:N&&&hmssdk/src/main/ets/base/UserActionTracer&4.0.0";
import type { APITraceData } from '../base/UserActionEnum';
import UrlUtil from "@normalized:N&&&hmssdk/src/main/ets/utils/UrlUtil&4.0.0";
export interface RequestOptions {
    method: string | RequestMethod;
    path: string;
    data?: string | Object;
    expectedType?: 'string' | 'object' | 'arraybuffer';
    headers?: Record<string, any>;
    withToken?: boolean;
    ignoreReport?: boolean;
    encipher?: number;
}
export enum RequestMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}
export class RXRequest {
    private retryCode: number = 302001;
    static get token() {
        return Passport.token;
    }
    static getHeader(b62?: Record<string, any>, c62: boolean = true, d62?: number) {
        let e62 = SDKConfig;
        d62 ??= e62.encipher;
        const f62: Record<string, any> = {
            "Charset": "UTF-8",
            "accept": "application/json",
            "Accept-Language": Devices.systemLocale,
            "ruixue-language": Devices.simplifiedLanguage,
            "ruixue-tzoffset": DateTime.getTimezoneDecimal(),
            "ruixue-traceid": Devices.genUUID(),
            "ruixue-appinfo": UrlUtil.toQueryString({ version: e62.APP_VERSION }),
            "ruixue-cpid": e62?.cpId,
            "ruixue-productid": e62?.productId,
            "ruixue-channelid": e62?.channelId,
            "ruixue-platformid": Devices.platformId,
            "ruixue-version": e62.VERSION,
            "ruixue-devicecode": Devices.deviceCode,
            [CONTENT_TYPE]: d62 == 1 ? TEXT_PLAIN : "application/json; charset=UTF-8",
            [RUIXUE_ENCIPHER]: d62,
        };
        if (e62.regionTag) {
            f62["ruixue-region"] = e62.regionTag;
        }
        if (e62.cpRoleId) {
            f62["ruixue-cp-role-id"] = e62.cpRoleId;
        }
        if (b62) {
            Object.assign(f62, Objects.toObject(b62));
        }
        let g62 = this.token;
        if (c62 && g62) {
            f62["ruixue-accesstoken"] = g62.access;
        }
        return f62;
    }
    identity<z61>(a62: z61): z61 {
        return a62;
    }
    static createRequest(y61: RequestOptions): Http {
        y61.headers = RXRequest.getHeader(y61.headers, y61.withToken, y61.encipher);
        return Http.create(y61.path)
            .setMethod(y61.method as RequestMethod)
            .setDomains(SDKConfig.domains)
            .setIgnoreReport(y61.ignoreReport)
            .setHeaders(y61.headers)
            .setBody(y61.data);
    }
    static async request<t61>(u61: RequestOptions, v61?: RCallback<t61>): Promise<RXResult<t61>> {
        return await this.createRequest(u61).fetchRestfulData<t61>(RXUtil.toRXCallback(v61)).then((w61) => {
            let x61: APITraceData = {
                error_code: w61.code,
                error_msg: w61.msg,
                api: u61.path,
                request_body: Objects.toObject(u61.data),
                request_header: u61.headers
            };
            UserActionTracer.dispatch(x61);
            return w61;
        });
    }
    static async get<o61>(p61: string, q61?: string | object, r61?: Record<string, any>, s61?: RCallback<o61>): Promise<RXResult<o61>> {
        return this.request({
            method: RequestMethod.GET,
            path: p61,
            data: q61,
            headers: r61
        }, s61);
    }
    static async post<j61>(k61: string, l61: string | object, m61?: Record<string, any>, n61?: RCallback<j61>): Promise<RXResult<j61>> {
        return this.request({
            method: RequestMethod.POST,
            path: k61,
            data: l61,
            headers: m61
        }, n61);
    }
}
