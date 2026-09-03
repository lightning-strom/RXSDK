import { RequestMethod } from "../net/RXRequest";
import { RCallback, RXResult } from "../types/Index";
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
export declare class Header {
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
export declare class OssClient implements OssConfigBean {
    provider: string;
    region: string;
    bucket: string;
    domain: string;
    credentials: CredentialsBean;
    method: RequestMethod;
    constructor(i63: OssConfigBean);
    generateOSSHeaders(f63: OssConfigBean, g63: string, h63: ArrayBuffer): Record<string, string>;
    putObject(w62: string, x62: ArrayBuffer, y62?: RCallback): Promise<RXResult<object>>;
}
