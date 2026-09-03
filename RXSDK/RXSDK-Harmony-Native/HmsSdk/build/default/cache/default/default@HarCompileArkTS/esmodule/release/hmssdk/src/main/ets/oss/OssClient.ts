import Http from "@normalized:N&&&hmssdk/src/main/ets/net/http&4.0.0";
import Path from "@normalized:N&&&hmssdk/src/main/ets/net/Path&4.0.0";
import { RequestMethod } from "@normalized:N&&&hmssdk/src/main/ets/net/RXRequest&4.0.0";
import type { RCallback, RXResult } from "../types/Index";
import type { BusinessError } from "@ohos:base";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import http from "@ohos:net.http";
import { RXUtil } from "@normalized:N&&&hmssdk/src/main/ets/utils/RXUtil&4.0.0";
export interface CredentialsBean {
    access_key_secret: string;
    expiration: string;
    access_key_id: string;
    security_token: string;
    start_unix_time: number;
    expiration_unix_time: number;
    assumed_role: string;
    arn: string;
}
export interface OssConfigBean {
    provider: string;
    region: string;
    bucket: string;
    domain: string;
    credentials: CredentialsBean;
}
export class Header {
    static readonly AUTHORIZATION = "Authorization";
    static readonly X_COS_SECURITY_TOKEN = "x-cos-security-token";
    static readonly USER_AGENT = "User-Agent";
    static readonly HOST = "Host";
    static readonly CONTENT_LENGTH = "Content-Length";
    static readonly CONTENT_DISPOSITION = "Content-Disposition";
    static readonly CONTENT_ENCODING = "Content-Encoding";
    static readonly CONTENT_TYPE = "Content-Type";
    static readonly CONTENT_MD5 = "Content-MD5";
}
export class OssClient implements OssConfigBean {
    provider: string;
    region: string;
    bucket: string;
    domain: string;
    credentials: CredentialsBean;
    method: RequestMethod = RequestMethod.PUT;
    constructor(i63: OssConfigBean) {
        this.provider = i63.provider;
        this.region = i63.region;
        this.bucket = i63.bucket;
        this.domain = i63.domain;
        this.credentials = i63.credentials;
    }
    generateOSSHeaders(f63: OssConfigBean, g63: string, h63: ArrayBuffer): Record<string, string> {
        return;
    }
    public async putObject(w62: string, x62: ArrayBuffer, y62?: RCallback): Promise<RXResult<object>> {
        let z62 = this.generateOSSHeaders(this, w62, x62);
        let a63 = Path.join(this.domain, w62);
        try {
            let c63 = await Http.create(a63)
                .setMethod(this.method)
                .setHeaders(z62)
                .setBody(x62)
                .request();
            let d63: RXResult<object> = {
                code: 0,
                data: {
                    url: a63
                },
                message: ''
            };
            if (c63.responseCode == http.ResponseCode.OK) {
                y62?.(d63);
                Logger.d("uploadFile resp:" + JSON.stringify(d63));
            }
            else {
                let e63: BusinessError = {
                    code: 1000 + c63.responseCode,
                    name: 'HttpError',
                    message: c63.result.toString()
                };
                throw e63;
            }
            return d63;
        }
        catch (b63) {
            b63 = RXUtil.formatResult(b63);
            y62?.(b63);
            Logger.e(b63);
            return b63;
        }
    }
}
